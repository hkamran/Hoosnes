import Console from "../app/Console";
import * as React from "react";
import {Card} from "./core/layout/Card";
import {Registers} from "../app/ppu/Registers";
import {Ppu} from "../app/ppu/Ppu";

interface ITileCardProps {
    snes: Console;
}

interface ITileCardState {
}

export class TileCard extends React.Component<ITileCardProps, ITileCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public pixelSize: number = 2;
    public borderSize: number = 0;
    public width: number = 8;
    public height: number = 8;

    constructor(props : ITileCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
        this.fetch();
    }

    public fetch(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});

        let totalWidth = this.borderSize + ((31 * this.width) * (this.pixelSize + this.borderSize));
        let totalHeight = this.borderSize + ((0xFFFF / (31 * this.width)) * (this.pixelSize + this.borderSize));

        this.canvasRef.current.width = totalWidth;
        this.canvasRef.current.height = totalHeight;

        let image: ImageData = this.context.createImageData(totalWidth, totalHeight);

        for (let index = 0; index < image.data.length; index += 4) {
            image.data[index + 0] = 0;
            image.data[index + 1] = 0;
            image.data[index + 2] = 0;
            image.data[index + 3] = 255;
        }

        let vram: number[] = this.props.snes.ppu.vram.data;

        let vramIndex: number = 0;
        let length: number = this.props.snes.ppu.vram.data.length;

        let bpp: number = 4;

        let tileXIndex: number = 0;
        let tileYIndex: number = 0;

        while (vramIndex < length) {

            let tile: number[][] = [];
            for (let y = 0; y < 8; y++) {
                tile.push([]);
                for (let x = 0; x < 8; x++) {
                    tile[y].push(0);
                }
            }

            let plane: number = 0;
            for (let i = 0; i < bpp / 2; i++) {
                let rows: number[][] = [];

                for (let y = 0; y < 8; y++) {
                    rows.push(new Array(2));
                    for (let x = 0; x < 2; x++) {
                        let data: number = vram[vramIndex++];
                        rows[y][x] = data;
                    }
                }

                let yIndex: number = 0;
                for (let row of rows) {
                    let shift: number = plane;
                    for (let cell of row) {
                        let bits: number = cell;
                        for (let xIndex = 0; xIndex < 8; xIndex++) {
                            let bit = bits & 1;
                            tile[yIndex][7 - xIndex] |= (bit << shift);
                            bits = bits >> 1;
                        }
                        shift++;
                    }
                    yIndex++;
                }

                plane += 2;
            }

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    let palette = tile[y][x];
                    if (palette == 0) continue;

                    let yIndex: number = (totalWidth * this.borderSize) + (Math.floor(y) * (totalWidth * (this.pixelSize + this.borderSize)));
                    let xIndex: number = this.borderSize + (Math.floor(x) * (this.pixelSize + this.borderSize));

                    for (let yOffset = 0; yOffset < this.pixelSize; yOffset++) {
                        for (let xOffset = 0; xOffset < this.pixelSize; xOffset++) {
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
            break;
            tileXIndex += 8;
            if (tileXIndex > 31) {
                tileYIndex += 8;
                tileXIndex = 0;
            }
        }
        this.context.putImageData(image, 0, 0);
    }

    public render() {
        return (
            <Card title="Tiles">
                <div>
                    <canvas ref={this.canvasRef}
                            style={{
                                border: "2px solid #000",
                                borderRadius: "2px",
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.fetch.bind(this)}>Render</button>
                    </div>
                </div>
            </Card>
        );
    }

}