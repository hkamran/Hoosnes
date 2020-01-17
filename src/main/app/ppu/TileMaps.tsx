import {Vram} from "../memory/Vram";
import {Address} from "../bus/Address";
import {Dimension, Tile} from "./Tiles";
import {Objects} from "../util/Objects";
import {Bit} from "../util/Bit";

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

    public getTileMap(address: Address): TileMap {
        let index = address.toValue();
        let tileMap = TileMap.create(
            this.vram.data[(index + 0) % this.vram.data.length],
            this.vram.data[(index + 1) % this.vram.data.length]);
        return tileMap;
    }

    public getTileMaps(address: Address): TileMap[] {
        let index = address.toValue();
        let target = (index + ((this.dimension.width * this.dimension.height) * 2))
            % this.vram.data.length;

        let entries: TileMap[] = [];
        while (index < target) {
            entries.push(TileMap.create(this.vram.data[index], this.vram.data[index + 1]));
            index += TileMap.SIZE_IN_BYTES;
        }

        return entries;
    }

}
