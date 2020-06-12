import {Console} from "../../../app/console/Console";
import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Background} from "../../../app/console/ppu/Backgrounds";
import {Dimension, Tile} from "../../../app/console/ppu/Tiles";
import {BppType, IColor} from "../../../app/console/ppu/Palette";
import {ITileMap} from "../../../app/console/ppu/TileMaps";

interface IBackgroundsCardProps {
    snes: Console;
}

interface IBackgroundsCardState {
    selected: number;
    tilePixelSize: number;
    tileHeightSize: number;
    tileWidthSize: number;
    tileBorderOpacity: number;
    tilesPerRow: number;
}

export class BackgroundsCard extends React.Component<IBackgroundsCardProps, IBackgroundsCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public state: IBackgroundsCardState = {
        selected: 1,
        tilePixelSize: 4,
        tileHeightSize: 8,
        tileWidthSize: 8,
        tileBorderOpacity: 100,
        tilesPerRow: 16, //16 (width) by 0x1FX (height)
    };

    constructor(props : IBackgroundsCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public zoomIn(): void {
        this.setState({
            tilePixelSize: Math.min(this.state.tilePixelSize + 1, 7),
        });
    }

    public zoomOut(): void {
        this.setState({
            tilePixelSize: Math.max(this.state.tilePixelSize - 1, 1),
        });
    }

    public componentDidUpdate(prevProps: Readonly<IBackgroundsCardProps>, prevState: Readonly<IBackgroundsCardState>, snapshot?: any): void {
        this.refresh();
    }

    public componentDidMount(): void {
        this.refresh();
    }

    public refresh(): void {
        let background: Background = null;
        if (this.state.selected == 1) background = this.props.snes.ppu.backgrounds.bg1;
        if (this.state.selected == 2) background = this.props.snes.ppu.backgrounds.bg2;
        if (this.state.selected == 3) background = this.props.snes.ppu.backgrounds.bg3;
        if (this.state.selected == 4) background = this.props.snes.ppu.backgrounds.bg4;

        if (background) {
            let tile: Tile = background.getImage();
            let tileMaps: ITileMap[][] = background.getTileMaps();
            if (tileMaps.length == 0) return;
            this.context = this.canvasRef.current.getContext("2d", {alpha: false});

            let characterDimension: Dimension = background.getCharacterDimension();
            let height: number = tile.attributes.getHeight();
            let width: number = tile.attributes.getWidth();
            let bpp: BppType = background.getBpp();

            let totalWidth = width * this.state.tilePixelSize;
            let totalHeight = height * this.state.tilePixelSize;

            this.canvasRef.current.width = totalWidth;
            this.canvasRef.current.height = totalHeight;

            let image: ImageData = this.context.createImageData(totalWidth, totalHeight);

            for (let index = 0; index < image.data.length; index += 4) {
                image.data[index + 0] = 0;
                image.data[index + 1] = 0;
                image.data[index + 2] = 0;
                image.data[index + 3] = 255;
            }

            let defaultColor: IColor = this.props.snes.ppu.palette.getPalette(0);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let palette: number = tile.data[y][x];
                    let tileMap: ITileMap = tileMaps[Math.floor(y / characterDimension.height)][Math.floor(x / characterDimension.width)];

                    let yIndex: number = ((y * this.state.tilePixelSize) * totalWidth);
                    let xIndex: number = (x * this.state.tilePixelSize);

                    let colors: IColor[] = this.props.snes.ppu.palette.getPalettesForBppType(tileMap.paletteNumber, bpp);
                    let color: IColor = palette == 0 ? defaultColor: colors[palette];

                    // Write pixel size
                    for (let yOffset = 0; yOffset < this.state.tilePixelSize; yOffset++) {
                        for (let xOffset = 0; xOffset < this.state.tilePixelSize; xOffset++) {
                            let index = 0;
                            index += yIndex + (yOffset * totalWidth);
                            index += (xIndex + xOffset);
                            index *= 4;

                            image.data[index + 0] = color.red;
                            image.data[index + 1] = color.green;
                            image.data[index + 2] = color.blue;
                            image.data[index + 3] = color.opacity;
                        }
                    }
                }
            }
            this.context.putImageData(image, 0, 0);
        }
    }

    public select(index: number) {
        this.setState({
            selected: index,
        });
    }

    public render() {
        return (
            <Card title="Backgrounds">
                <div style={{maxHeight: "300px", backgroundColor: "#000000", border: "1px solid #646464", maxWidth: "512px", overflow: "scroll"}}>
                    <canvas ref={this.canvasRef}
                            style={{
                                border: "2px solid #000",
                                borderRadius: "2px",
                                minHeight: "256px",
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={() => { this.select(1); }}>1</button>
                        <button onClick={() => { this.select(2); }}>2</button>
                        <button onClick={() => { this.select(3); }}>3</button>
                        <button onClick={() => { this.select(4); }}>4</button>
                        <button onClick={this.zoomIn.bind(this)}>+</button>
                        <button onClick={this.zoomOut.bind(this)}>-</button>
                    </div>
                </div>
            </Card>
        );
    }
}