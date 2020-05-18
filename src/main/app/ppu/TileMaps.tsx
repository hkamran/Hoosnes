import {Vram} from "../memory/Vram";
import {Dimension} from "./Tiles";
import {Objects} from "../util/Objects";
import {Bit} from "../util/Bit";
import {AddressUtil} from "../util/AddressUtil";

/**
 * vhopppcc cccccccc
     v/h        = Vertical/Horizontal flip this tile.
     o          = Tile priority.
     ppp        = Tile palette. The number of entries in the palette depends on the Mode and the BG.
     cccccccccc = Tile number.
 */
export class TileMap {

    public static readonly SIZE_IN_BYTES: number = 2;
    public value: number;

    constructor(low: number, high: number) {
        this.value = Bit.toUint16(high, low);
    }

    public getCharacterNumber(): number {
        return this.value & 0x3FF;
    }

    public getPaletteNumber(): number {
        return (this.value >> 10) & 0x7;
    }

    public isXFlipped(): boolean {
        return ((this.value >> 14) & 0x1) == 1;
    }

    public isYFlipped(): boolean {
        return ((this.value >> 15) & 0x1) == 1;
    }

    public hasPriority(): boolean {
        return ((this.value >> 13) & 0x1) == 1;
    }

    public static create(low: number, high: number) {
        Objects.requireNonNull(low);
        Objects.requireNonNull(high);

        return new TileMap(low, high);
    }
}

export class TileMaps {

    private vram: Vram;
    private dimension: Dimension;

    constructor(vram: Vram) {
        this.vram = vram;
        this.dimension = Dimension.get32by32();
    }

    public getTileMap(address: number): TileMap {
        AddressUtil.assertValid(address);

        let index = address;
        let tileMap = TileMap.create(
            this.vram.data[(index + 0) % this.vram.data.length],
            this.vram.data[(index + 1) % this.vram.data.length]);
        return tileMap;
    }

    public getTileMaps(address: number): TileMap[] {
        AddressUtil.assertValid(address);
        let entries: TileMap[] = [];

        let amount = ((this.dimension.width * this.dimension.height) * 2);
        for (let offset = 0; offset < amount; offset += TileMap.SIZE_IN_BYTES) {
            const lowIndex = (address + offset) % this.vram.data.length;
            const highIndex = (lowIndex + 1) % this.vram.data.length;
            const tilemap = TileMap.create(this.vram.data[lowIndex], this.vram.data[highIndex]);
            entries.push(tilemap);
        }

        return entries;
    }

}
