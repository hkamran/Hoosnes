import Console from "../app/Console";
import * as React from "react";
import {Card} from "./core/layout/Card";
import {TileAttributes} from "../app/ppu/Tiles";
import {BppType} from "../app/ppu/Palette";
import {Address} from "../app/bus/Address";

interface ITileCardProps {
    snes: Console;
}

interface ITileCardState {
    tilePixelSize: number;
    tileHeightSize: number;
    tileWidthSize: number;
    tileBorderOpacity: number;
    tilesPerRow: number;
}

export class TileCard extends React.Component<ITileCardProps, ITileCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public state: ITileCardState = {
        tilePixelSize: 4,
        tileHeightSize: 8,
        tileWidthSize: 8,
        tileBorderOpacity: 100,
        tilesPerRow: 31,
    };

    constructor(props : ITileCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
        this.refresh();
    }

    public componentDidUpdate(prevProps: Readonly<ITileCardProps>, prevState: Readonly<ITileCardState>, snapshot?: any): void {
        this.refresh();
    }

    public refresh(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});

        let totalWidth = this.state.tilesPerRow * (this.state.tileWidthSize) * this.state.tilePixelSize;
        let totalHeight = this.state.tilesPerRow * (this.state.tileHeightSize) * this.state.tilePixelSize;

        this.canvasRef.current.width = totalWidth;
        this.canvasRef.current.height = totalHeight;

        let image: ImageData = this.context.createImageData(totalWidth, totalHeight);

        for (let index = 0; index < image.data.length; index += 4) {
            image.data[index + 0] = 0;
            image.data[index + 1] = 0;
            image.data[index + 2] = 0;
            image.data[index + 3] = 255;
        }

        let vramIndex: number = 0;
        let length: number = this.props.snes.ppu.vram.data.length;

        let tileXIndex: number = 0;
        let tileYIndex: number = 0;

        while (vramIndex < length) {

            let attributes: TileAttributes = TileAttributes.create(8, 8, BppType.Four);
            let tile: number[][] = this.props.snes.ppu.tiles.getTile(Address.create(vramIndex), attributes);
            vramIndex += attributes.getTileSize();

            let tileBottomIndex: number = ((this.state.tileHeightSize * this.state.tilePixelSize) * tileYIndex) * totalWidth;
            let tileRightIndex: number = (tileXIndex * this.state.tilePixelSize * this.state.tileWidthSize);

            // Write pixel

            for (let y = 0; y < this.state.tileHeightSize; y++) {
                for (let x = 0; x < this.state.tileWidthSize; x++) {
                    let palette = tile[y][x];
                    if (palette == 0) continue;

                    let yIndex: number = tileBottomIndex + ((y * this.state.tilePixelSize) * totalWidth);
                    let xIndex: number = tileRightIndex + (x * this.state.tilePixelSize);

                    // Write pixel size

                    for (let yOffset = 0; yOffset < this.state.tilePixelSize; yOffset++) {
                        for (let xOffset = 0; xOffset < this.state.tilePixelSize; xOffset++) {
                            let index = 0;
                            index += yIndex + (yOffset * totalWidth);
                            index += (xIndex + xOffset);
                            index *= 4;

                            image.data[index + 0] = palette * 15;
                            image.data[index + 1] = palette * 15;
                            image.data[index + 2] = palette * 15;
                            image.data[index + 3] = 255;
                        }
                    }
                }
            }

            // Write border

            for (let yOffset = 0; yOffset <= this.state.tileHeightSize * this.state.tilePixelSize; yOffset++) {
                let index = 0;
                index += tileBottomIndex + (yOffset * totalWidth);
                index += 0 + tileRightIndex;
                index *= 4;

                image.data[index + 0] = 255;
                image.data[index + 1] = 0;
                image.data[index + 2] = 0;
                image.data[index + 3] = this.state.tileBorderOpacity;
            }

            for (let xOffset = 0; xOffset <= this.state.tileWidthSize * this.state.tilePixelSize; xOffset++) {
                let index = 0;
                index += tileBottomIndex + 0;
                index += xOffset + tileRightIndex;
                index *= 4;

                image.data[index + 0] = 255;
                image.data[index + 1] = 0;
                image.data[index + 2] = 0;
                image.data[index + 3] = this.state.tileBorderOpacity;
            }

            tileXIndex += 1;
            if (tileXIndex >= 31) {
                tileYIndex += 1;
                tileXIndex = 0;
            }
        }
        this.context.putImageData(image, 0, 0);
    }

    public zoomIn(): void {
        this.setState({
           tilePixelSize: Math.min(this.state.tilePixelSize + 1, 15),
        });
    }

    public zoomOut(): void {
        this.setState({
            tilePixelSize: Math.max(this.state.tilePixelSize - 1, 1),
        });
    }

    public render() {
        return (
            <Card title="Tiles">
                <div style={{height: "272px", width: "270px", overflow: "scroll"}}>
                    <canvas ref={this.canvasRef}
                            style={{
                                border: "2px solid #000",
                                borderRadius: "2px",
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.refresh.bind(this)}>Refresh</button>
                        <button onClick={this.zoomIn.bind(this)}>+</button>
                        <button onClick={this.zoomOut.bind(this)}>-</button>
                    </div>
                </div>
            </Card>
        );
    }

}