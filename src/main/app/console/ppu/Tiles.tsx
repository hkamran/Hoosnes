import {Ppu} from "./Ppu";
import {Objects} from "../../util/Objects";
import {BppType} from "./Palette";
import {Vram} from "../memory/Vram";
import {AddressUtil} from "../../util/AddressUtil";

export class Dimension {

    public height: number = 8;
    public width: number = 8;

    private static readonly dimension8by8: Dimension = Dimension.create(8,8);
    private static readonly dimension16by16: Dimension = Dimension.create(16,16);
    private static readonly dimension32by32: Dimension = Dimension.create(32,32);
    private static readonly dimension64by64: Dimension = Dimension.create(64,64);
    private static readonly dimension64by32: Dimension = Dimension.create(64,32);
    private static readonly dimension32by64: Dimension = Dimension.create(32,64);

    constructor(width: number, height: number) {
        Objects.requireNonNull(width);
        Objects.requireNonNull(height);

        this.width = width;
        this.height = height;
    }

    public static create(height: number, width: number): Dimension {
        let dimension = new Dimension(width, height);
        return dimension;
    }

    public static get8by8(): Dimension {
        return this.dimension8by8;
    }

    public static get16by16(): Dimension {
        return this.dimension16by16;
    }

    public static get32by32(): Dimension {
        return this.dimension32by32;
    }

    public static get64by64(): Dimension {
        return this.dimension64by64;
    }

    public static get32by64(): Dimension {
        return this.dimension32by64;
    }

    public static get64by32(): Dimension {
        return this.dimension64by32;
    }

    public toString(): string {
        return `${this.height}x${this.width}`;
    }

}

export enum Orientation {
    VERTICAL,
    HORIZONTAL,
    NONE,
}

export interface ITileAttributes {
    height: number;
    width: number;
    yFlipped: boolean;
    xFlipped: boolean;
    bpp: BppType;
}

export function getTileSizeInByte(bpp: BppType): number {
    return 8 * bpp.valueOf();
}

export interface ITile {
    image: number[][];
    attributes: ITileAttributes;
}

const TILE_HEIGHT = 8;
const TILE_WIDTH = 8;
const BYTES_PER_PIXEL = 2;
const rows = [0, 0];

export class Tiles {

    public ppu: Ppu;
    public vram: Vram;

    private tileMatrixFor8By8 = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ];

    constructor(ppu: Ppu) {
        Objects.requireNonNull(ppu);

        this.ppu = ppu;
        this.vram = ppu.vram;
    }


    public getTileAt(address: number, attributes: ITileAttributes): number[][] {
        Objects.requireNonNull(address);
        Objects.requireNonNull(attributes);

        AddressUtil.assertValid(address);

        if (attributes.bpp == BppType.Eight) {
            throw new Error("Not implemented!");
        } else {
            return this.getTileNon8Bpp(address, attributes);
        }
    }

    private getTileNon8Bpp(address: number, attributes: ITileAttributes): number[][] {
        let image: number[][] = [];
        const bpp: number = attributes.bpp.valueOf();
        const bytesPerTile = TILE_HEIGHT * TILE_WIDTH * BYTES_PER_PIXEL * bpp;

        for (let yBase: number = 0; yBase < attributes.height; yBase++) {
            let row: number[] = this.getTileRowAt(address, yBase, attributes);
            image.push(row);
        }

        return image;
    }

    public getTileRowAt(address: number, row: number, attributes: ITileAttributes): number[] {
        if (attributes.bpp == BppType.Eight) {
            throw new Error("Not implemented!");
        }

        const bpp: number = attributes.bpp.valueOf();
        const numOfPlanes = Math.floor(bpp / 2);

        const rowCourse = row % TILE_HEIGHT;
        const rowHarse = Math.floor(row / TILE_HEIGHT);

        const rowIndex = attributes.yFlipped ?
            (attributes.height - 1 - rowCourse) * BYTES_PER_PIXEL :
            rowCourse * BYTES_PER_PIXEL;
        const bytesPerRow = TILE_WIDTH * bpp * (attributes.yFlipped ? -1 : 1);
        const bytesPerPlane = (TILE_WIDTH - 1) * numOfPlanes;
        const bytesPerTile = TILE_HEIGHT * TILE_WIDTH * BYTES_PER_PIXEL * bpp;

        let image: number[] = new Array(attributes.width);
        let counter = 0;
        let offset = (counter * bytesPerRow) + rowIndex;
        address += bytesPerTile * rowHarse;

        for (let xBase: number = 0; xBase < attributes.width; xBase += TILE_WIDTH) {

            let index = address + offset;
            let plane: number = 0;

            for (let i = 0; i < numOfPlanes; i++) {
                // Capture 8x8 tile from vram (8 bytes high, 2 bytes long)
                rows[0] = this.vram.data[index++ % this.vram.data.length];
                rows[1] = this.vram.data[index++ % this.vram.data.length];

                // Deconstruct planes into tile matrix
                let shift: number = plane;
                for (let cell of rows) {
                    let bits: number = cell;
                    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
                        let bit = bits & 1;
                        let xIndex: number = attributes.xFlipped ?
                            (attributes.width - TILE_WIDTH - xBase) + bitIndex : xBase + (TILE_WIDTH - 1 - bitIndex);
                        image[xIndex] |= (bit << shift);
                        bits = bits >> 1;
                    }
                    shift++;
                }

                plane += 2;
                index += bytesPerPlane;
            }
            counter++;
            offset = (counter * bytesPerRow) + rowIndex;
        }

        return image;
    }

}