import * as React from "react";
import {Card} from "./core/layout/Card";
import {BppType, Color} from "../app/ppu/Palette";
import {Console} from "../app/Console";
import {Dimension, Orientation, Tile, TileAttributes} from "../app/ppu/Tiles";
import {Sprite} from "../app/ppu/Sprites";

interface ISpriteCardProps {
    snes: Console;
}

interface ISpriteCardState {
    selected: number | null;
    tilePixelSize: number;
    tileHeightSize: number;
    tileWidthSize: number;
    tileBorderOpacity: number;
    tilesPerRow: number;
}

export class SpriteCard extends React.Component<ISpriteCardProps, ISpriteCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public state: ISpriteCardState = {
        selected: null,
        tilePixelSize: 4,
        tileHeightSize: 8,
        tileWidthSize: 8,
        tileBorderOpacity: 100,
        tilesPerRow: 16, //16 (width) by 0x1FX (height)
    };

    constructor(props : ISpriteCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidUpdate(prevProps: Readonly<ISpriteCardProps>, prevState: Readonly<ISpriteCardState>, snapshot?: any): void {
        this.refresh();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
    }

    public select(index: number) {
        this.setState({
           selected: index,
        });
    }

    public refresh(): void {
        if (this.state.selected == null) {
            this.context = this.canvasRef.current.getContext("2d", {alpha: false});

            this.canvasRef.current.width = 128;
            this.canvasRef.current.height = 128;
            return;
        }

        let sprite: Sprite = this.props.snes.ppu.sprites.getSprite(this.state.selected);
        let tile: Tile = sprite.getTile();

        this.context = this.canvasRef.current.getContext("2d", {alpha: false});

        let height: number = tile.attributes.getHeight();
        let width: number = tile.attributes.getWidth();

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

        let tileBottomIndex: number = ((this.state.tileHeightSize * this.state.tilePixelSize) * 0) * totalWidth;
        let tileRightIndex: number = (0 * this.state.tilePixelSize * this.state.tileWidthSize);

        let colors: Color[] = this.props.snes.ppu.palette.getPalette(BppType.Four, sprite.getPaletteIndex());

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let palette: number = tile.data[y][x];

                let yIndex: number = tileBottomIndex + ((y * this.state.tilePixelSize) * totalWidth);
                let xIndex: number = tileRightIndex + (x * this.state.tilePixelSize);

                // Write pixel size

                for (let yOffset = 0; yOffset < this.state.tilePixelSize; yOffset++) {
                    for (let xOffset = 0; xOffset < this.state.tilePixelSize; xOffset++) {
                        let index = 0;
                        index += yIndex + (yOffset * totalWidth);
                        index += (xIndex + xOffset);
                        index *= 4;

                        let color: Color = colors[palette];
                        if (color == null) {
                            continue;
                        }

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

    public render() {
        let sizes: {small: Dimension, big: Dimension} = this.props.snes.ppu.registers.oamselect.getObjectSizes();

        return (
            <Card title="Sprites">
                <div style={{flexDirection: "row", display:"flex"}}>
                    <div style={{border: "1px solid #ddd", width: "490px", height: "300px", marginRight: "15px", overflow: "hidden", overflowY: "scroll"}}>
                        <table style={{width: "100%"}}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Size</th>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>Char</th>
                                    <th>Priority</th>
                                    <th>Palette</th>
                                    <th>Flip</th>
                                    <th>X-Wrap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.snes.ppu.sprites.getSprites().map((sprite: Sprite, index: number) => {

                                    let height: number = sprite.isBig() ? sizes.big.height: sizes.small.height;
                                    let width: number = sprite.isBig() ? sizes.big.width: sizes.small.width;

                                    let style = {cursor: "pointer", background: ""};

                                    if (index == this.state.selected) {
                                        style.background = "#eee";
                                    }

                                    return (
                                        <tr key={index} onClick={() => { this.select(index); }} style={style}>
                                            <td>{index}</td>
                                            <td>{height + "x" + width}</td>
                                            <td>{sprite.getXPosition()}</td>
                                            <td>{sprite.getYPosition()}</td>
                                            <td>{sprite.getTileNumber()}</td>
                                            <td>{sprite.getSpritePriority()}</td>
                                            <td>{sprite.getPaletteIndex()}</td>
                                            <td>{Orientation[sprite.getOrientation()]}</td>
                                            <td>{sprite.isXWrapped().toString().toUpperCase()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div style={{marginBottom: "10px"}}>
                            <span>Id:</span>
                            <span>{this.state.selected}</span>
                        </div>
                        <div>
                            <canvas ref={this.canvasRef}
                                    style={{
                                        border: "2px solid #000",
                                        borderRadius: "2px",
                                        marginRight: "10px",
                                    }}
                            />
                        </div>
                        <button onClick={this.refresh.bind(this)}>Refresh</button>
                        <button onClick={this.zoomIn.bind(this)}>+</button>
                        <button onClick={this.zoomOut.bind(this)}>-</button>
                    </div>
                </div>
            </Card>
        );
    }

}
