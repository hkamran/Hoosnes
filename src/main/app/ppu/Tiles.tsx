import {Ppu} from "./Ppu";
import {Objects} from "../util/Objects";
import {BppType} from "./Palette";
import {Vram} from "../memory/Vram";
import {Address} from "../bus/Address";

export class TileAttributes {

    public index: number = 0;
    public height: number = 8;
    public width: number = 8;
    public vflip: boolean = false;
    public hflip: boolean = false;
    public bpp: BppType = BppType.Two;

    constructor(index: number, height: number, width: number, vflip: boolean, hflip: boolean, bpp: BppType) {
        this.index = index;
        this.height = height;
        this.width = width;
        this.vflip = vflip;
        this.hflip = hflip;
        this.bpp = bpp;
    }

    public static create(index: number, height: number, width: number,  bpp: BppType, vflip?: boolean, hflip?: boolean) {
        return new TileAttributes(index, height, width, vflip || false, hflip || false, bpp);
    }

    public getTileSize(): number {
        let size: number = 8 * this.bpp.valueOf();
        return size;
    }


}

export class Tiles {

    public ppu: Ppu;
    public vram: Vram;

    constructor(ppu: Ppu) {
        Objects.requireNonNull(ppu);

        this.ppu = ppu;
        this.vram = ppu.vram;
    }

    public getTile(address: Address, attributes: TileAttributes): number[][] {
        Objects.requireNonNull(address);
        Objects.requireNonNull(attributes);

        if (attributes.bpp == BppType.Eight) {
            return this.getTile8Bpp(address, attributes);
        } else {
            return this.getTileNon8Bpp(address, attributes);
        }
    }

    private getTile8Bpp(address: Address, attributes: TileAttributes): number[][] {
        throw new Error("Not implemented!");
    }

    private getTileNon8Bpp(address: Address, attributes: TileAttributes): number[][] {
        let tile = this.create2dMatrix(attributes.height, attributes.width);
        let bpp: number = attributes.bpp.valueOf();
        let index: number = address.toValue();

        for (let yBase: number = 0; yBase < attributes.height; yBase += 8) {
            for (let xBase: number = 0; xBase < attributes.width; xBase += 8) {

                let plane: number = 0;
                for (let i = 0; i < bpp / 2; i++) {
                    let rows: number[][] = this.create2dMatrix(8, 2);
                    for (let y = 0; y < 8; y++) {
                        for (let x = 0; x < 2; x++) {
                            rows[y][x] = this.vram.data[index++ % this.vram.data.length];
                        }
                    }

                    let yOffset: number = 0;
                    for (let row of rows) {
                        let shift: number = plane;
                        for (let cell of row) {
                            let bits: number = cell;
                            for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
                                let bit = bits & 1;
                                let xIndex: number = attributes.hflip ? (attributes.width - 8 - xBase) + bitIndex : xBase + (7 - bitIndex);
                                let yIndex: number = attributes.vflip ? (attributes.height - 8 - yBase) + (7 - yOffset) : yBase + yOffset;
                                tile[yIndex][xIndex] |= (bit << shift);
                                bits = bits >> 1;
                            }
                            shift++;
                        }
                        yOffset++;
                    }

                    plane += 2;
                }
            }
            index += attributes.getTileSize() * (16 - (attributes.width / 8));
        }


        return tile;
    }

    private create2dMatrix(height: number, width: number) {
        Objects.requireNonNull(height);
        Objects.requireNonNull(width);

        let tile: number[][] = [];
        for (let y = 0; y < height; y++) {
            tile.push([]);
            for (let x = 0; x < width; x++) {
                tile[y].push(0);
            }
        }
        return tile;
    }
}