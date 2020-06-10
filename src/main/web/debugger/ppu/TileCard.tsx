import {Console} from "../../../app/console/Console";
import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Tile, TileAttributes} from "../../../app/console/ppu/Tiles";
import {BppType} from "../../../app/console/ppu/Palette";

interface ITileCardProps {
    snes: Console;
}

interface ITileCardState {
    tilePixelSize: number;
    tileHeightSize: number;
    tileWidthSize: number;
    tileBorderOpacity: number;
    tilesPerRow: number;
    bbpType: BppType;
}

/**
 * Characters used for tiles and sprites are 8×8 pixels in size and are stored as bitplanes in VRAM. Each plane contains a bitmap, and corresponding bits set to 1 in different planes are combined to refer to a color in the character's color palette. The number of colors available for a character can vary and is determined by the tile or sprite settings. The number of bitplanes required for the character depends on the number of available colors:

 4 colors: 2 planes
 16 colors: 4 planes
 256 colors: 8 planes

 B: addressof(A) +  1 × 8 × (color depth / 2)
 C: addressof(A) + 16 × 8 × (color depth / 2)
 D: addressof(A) + 17 × 8 × (color depth / 2)


 The record format for the low table is 4 bytes:
 byte OBJ*4+0: xxxxxxxx
 byte OBJ*4+1: yyyyyyyy
 byte OBJ*4+2: cccccccc
 byte OBJ*4+3: vhoopppN

 The record format for the high table is 2 bits:
 bit 0/2/4/6 of byte OBJ/4: X
 bit 1/3/5/7 of byte OBJ/4: s

 The values are:
 Xxxxxxxxx = X position of the sprite. Basically, consider this signed but see
 below.
 yyyyyyyy  = Y position of the sprite. Values 0-239 are on-screen. -63 through
 -1 are "off the top", so the bottom part of the sprite comes in at the
 top of the screen. Note that this implies a really big sprite can go off
 the bottom and come back in the top.
 cccccccc  = First tile of the sprite. See below for the calculation of the
 VRAM address. Note that this could also be considered as 'rrrrcccc'
 specifying the row and column of the tile in the 16x16 character table.
 N         = Name table of the sprite. See below for the calculation of the
 VRAM address.
 ppp       = Palette of the sprite. The first palette index is 128+ppp*16.
 oo        = Sprite priority. See below for details.
 h/v       = Horizontal/Veritcal flip flags. Note this flips the whole sprite,
 not just the individual tiles. However, the rectangular sprites are
 flipped vertically as if they were two square sprites (i.e. rows
 "01234567" flip to "32107654", not "76543210").
 s         = Sprite size flag. See below for details.

 ((Base<<13) + (cccccccc<<4) + (N ? ((Name+1)<<12) : 0)) & 0x7fff
 OAM name selection is a trick for cheap sprite animation, ignore it until you learn how to experiment on your own.
 http://folk.uio.no/sigurdkn/snes/registers.txt

 */

export class TileCard extends React.Component<ITileCardProps, ITileCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public state: ITileCardState = {
        tilePixelSize: 4,
        tileHeightSize: 8,
        tileWidthSize: 8,
        tileBorderOpacity: 100,
        tilesPerRow: 16,
        bbpType: BppType.Four,
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

        let tileSize = (this.state.bbpType / 2) * 0x10;
        let numOfRows = this.props.snes.ppu.vram.data.length / (tileSize * this.state.tilesPerRow);

        let totalWidth = this.state.tilesPerRow * (this.state.tileWidthSize) * this.state.tilePixelSize;
        let totalHeight = (numOfRows) * (this.state.tileHeightSize) * this.state.tilePixelSize;

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
        let tileNumber = 0;

        while (vramIndex < length) {

            let attributes: TileAttributes = TileAttributes.create(8, 8, this.state.bbpType);
            let tile: Tile = this.props.snes.ppu.tiles.getTile(vramIndex, attributes);
            vramIndex += attributes.getTileSize();

            let tileBottomIndex: number = ((this.state.tileHeightSize * this.state.tilePixelSize) * tileYIndex) * totalWidth;
            let tileRightIndex: number = (tileXIndex * this.state.tilePixelSize * this.state.tileWidthSize);
            let minColor = this.state.bbpType == BppType.Two ? 8 : 0;

            // Write pixel
            for (let y = 0; y < this.state.tileHeightSize; y++) {
                for (let x = 0; x < this.state.tileWidthSize; x++) {
                    let palette = tile.data[y][x];
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

                            image.data[index + 0] = Math.max(palette, minColor) * 15;
                            image.data[index + 1] = Math.max(palette, minColor) * 15;
                            image.data[index + 2] = Math.max(palette, minColor) * 15;
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
            if (tileXIndex >= this.state.tilesPerRow) {
                tileYIndex += 1;
                tileXIndex = 0;
            }
            tileNumber++;
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

    public set2Bpp(): void {
        this.setState({
            bbpType: BppType.Two,
        });
    }

    public set4Bpp(): void {
        this.setState({
            bbpType: BppType.Four,
        });
    }


    public render() {
        return (
            <Card title="Tiles">
                <div style={{height: "272px", backgroundColor: "#000000", border: "1px solid #646464", padding: "5px", width: "350px", overflow: "scroll"}}>
                    <canvas ref={this.canvasRef}
                            style={{
                                borderRight: "1px solid #CB2A30",
                                borderBottom: "1px solid #CB2A30",
                                borderRadius: "2px",
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.refresh.bind(this)}>Refresh</button>
                        <button onClick={this.zoomIn.bind(this)}>+</button>
                        <button onClick={this.zoomOut.bind(this)}>-</button>
                        <button onClick={this.set2Bpp.bind(this)}>2bpp</button>
                        <button onClick={this.set4Bpp.bind(this)}>4bpp</button>
                    </div>
                </div>
            </Card>
        );
    }

}