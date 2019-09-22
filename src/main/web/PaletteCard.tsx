import * as React from "react";
import {Card} from "./core/layout/Card";
import {PaletteBppType, PaletteColor} from "../app/ppu/Palette";
import Console from "../app/Console";

declare let window : any;

interface IPaletteCardProps {
    snes: Console;
}

export class PaletteCard extends React.Component<IPaletteCardProps, any> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public pixelSize: number = 10;
    public borderSize: number = 2;
    public width: number = 16;
    public height: number = 16;

    constructor(props : IPaletteCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
        this.showPalette();
    }

    public showPalette() {
        let totalWidth = this.width * (this.pixelSize + this.borderSize);
        let totalHeight = this.height * (this.pixelSize + this.borderSize);

        this.canvasRef.current.width = totalWidth;
        this.canvasRef.current.height = totalHeight;

        let colors: PaletteColor[] = this.props.snes.ppu.palette.getPalette(PaletteBppType.Eight, 0);
        let image: ImageData = window.context.createImageData(totalWidth, totalHeight);

        for (let i = 0; i < colors.length; i++) {
            let color: PaletteColor = colors[i];

            let yIndex: number = (Math.floor(i / this.width) * (totalWidth * (this.pixelSize + this.borderSize)));
            let xIndex: number = Math.floor(i % this.height) * (this.pixelSize + this.borderSize);

            for (let yOffset = 0; yOffset < this.pixelSize; yOffset++) {
                for (let xOffset = 0; xOffset < this.pixelSize; xOffset++) {
                    let index: number = 0;
                    index += yIndex + (yOffset * totalWidth);
                    index += (xIndex + xOffset) ;
                    index *= 4;

                    image.data[index + 0] = color.red; // Red
                    image.data[index + 1] = color.green; // Green
                    image.data[index + 2] = color.blue; // Blue
                    image.data[index + 3] = 255; // Blue
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
                                border: "1px solid #000",
                                borderTop: "3px solid #000",
                                borderLeft: "3px solid #000",
                                borderRadius: "4px"
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.showPalette.bind(this)}>Render</button>
                    </div>
                </div>
            </Card>
        );
    }

}
