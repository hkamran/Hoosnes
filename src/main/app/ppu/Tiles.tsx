import {Ppu} from "./Ppu";
import {Objects} from "../util/Objects";
import {BppType} from "./Palette";
import {Vram} from "../memory/Vram";
import {Address} from "../bus/Address";

export class TileAttributes {

    public height: number = 8;
    public width: number = 8;
    public vflip: boolean = false;
    public hflip: boolean = false;
    public bpp: BppType = BppType.Two;

    constructor(height: number, width: number, vflip: boolean, hflip: boolean, bpp: BppType) {
        this.height = height;
        this.width = width;
        this.vflip = vflip;
        this.hflip = hflip;
        this.bpp = bpp;
    }

    public static create(height: number, width: number,  bpp: BppType, vflip?: boolean, hflip?: boolean) {
        return new TileAttributes(height, width, vflip || false, hflip || false, bpp);
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

        let plane: number = 0;
        for (let i = 0; i < bpp / 2; i++) {
            let rows: number[][] = this.create2dMatrix(8, 2);
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 2; x++) {
                    rows[y][x] = this.vram.data[index++];
                }
            }

            let yIndex: number = attributes.vflip ? 8: 0;
            for (let row of rows) {
                let shift: number = plane;
                for (let cell of row) {
                    let bits: number = cell;
                    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
                        let bit = bits & 1;
                        let xIndex: number = attributes.hflip ? bitIndex : 7 - bitIndex;
                        tile[yIndex][xIndex] |= (bit << shift);
                        bits = bits >> 1;
                    }
                    shift++;
                }
                attributes.vflip ? yIndex--: yIndex++;
            }

            plane += 2;
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