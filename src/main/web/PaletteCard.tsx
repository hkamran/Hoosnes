import * as React from "react";
import {Card} from "./core/layout/Card";
import {BppType, Color} from "../app/ppu/Palette";
import {Console} from "../app/Console";

declare let window : any;

interface IPaletteCardProps {
    snes: Console;
}

export class PaletteCard extends React.Component<IPaletteCardProps, any> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public pixelSize: number = 10;
    public borderSize: number = 1;
    public width: number = 16;
    public height: number = 16;

    constructor(props : IPaletteCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.refresh();
    }

    public componentDidUpdate(prevProps: Readonly<IPaletteCardProps>, prevState: Readonly<any>, snapshot?: any): void {
        this.refresh();
    }

    public refresh(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});

        let totalWidth = this.borderSize + (this.width * (this.pixelSize + this.borderSize));
        let totalHeight = this.borderSize + (this.height * (this.pixelSize + this.borderSize));

        this.canvasRef.current.width = totalWidth;
        this.canvasRef.current.height = totalHeight;

        let colors: Color[] = this.props.snes.ppu.palette.getPalette(BppType.Eight, 0);
        let image: ImageData = this.context.createImageData(totalWidth, totalHeight);

        for (let index = 0; index < image.data.length; index += 4) {
            image.data[index + 0] = 0;
            image.data[index + 1] = 0;
            image.data[index + 2] = 0;
            image.data[index + 3] = 255;
        }

        for (let i = 0; i < colors.length; i++) {
            let color: Color = colors[i];

            let yIndex: number = (totalWidth * this.borderSize) + (Math.floor(i / this.width) * (totalWidth * (this.pixelSize + this.borderSize)));
            let xIndex: number = this.borderSize + (Math.floor(i % this.height) * (this.pixelSize + this.borderSize));

            for (let yOffset = 0; yOffset < this.pixelSize; yOffset++) {
                for (let xOffset = 0; xOffset < this.pixelSize; xOffset++) {
                    let index: number = 0;
                    index += yIndex + (yOffset * totalWidth);
                    index += (xIndex + xOffset) ;
                    index *= 4;

                    image.data[index + 0] = color.red; // Red
                    image.data[index + 1] = color.green; // Green
                    image.data[index + 2] = color.blue; // Blue
                    image.data[index + 3] = color.opacity; // Opacity
                }
            }
        }

        this.context.putImageData(image, 0, 0);
    }

    public render() {
        return (
            <Card title="Palette">
                <div>
                    <canvas ref={this.canvasRef}
                            style={{
                                borderRadius: "2px",
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.refresh.bind(this)}>Render</button>
                    </div>
                </div>
            </Card>
        );
    }

}
