import {Vram} from "../memory/Vram";
import {Dimension} from "./Tiles";
import {Objects} from "../../util/Objects";
import {Bit} from "../../util/Bit";
import {AddressUtil} from "../../util/AddressUtil";

/**
 * vhopppcc cccccccc
     v/h        = Vertical/Horizontal flip this tile.
     o          = Tile priority.
     ppp        = Tile palette. The number of entries in the palette depends on the Mode and the BG.
     cccccccccc = Tile number.
 */

export interface ITileMap {
    characterNumber: number;
    paletteTable: number;
    xFlipped: boolean;
    yFlipped: boolean;
    hasPriority: boolean;
}

export function parseTileMap(data): ITileMap {
    Objects.requireNonNull(data);

    const characterNumber = data & 0x3FF;
    const paletteNumber = (data >> 10) & 0x7;
    const hasPriority = (data & 0x2000) > 0;
    const xFlipped = (data & 0x4000) > 0;
    const yFlipped = (data & 0x8000) > 0;

    return {
        characterNumber,
        paletteTable: paletteNumber,
        xFlipped,
        yFlipped,
        hasPriority,
    };
}

const TILE_MAP_SIZE_IN_BYTES = 2;
export const TILE_MAP_BYTE_SIZE = 2;
export const TOTAL_TILE_MAPS: number = 32;

export class TileMaps {


    private vram: Vram;
    private dimension: Dimension;

    constructor(vram: Vram) {
        this.vram = vram;
        this.dimension = Dimension.get32by32();
    }

    public getTileMap(address: number): ITileMap {
        AddressUtil.assertValid(address);

        let index = address;

        const low: number = this.vram.readByte(index + 0);
        const high: number = this.vram.readByte(index + 1);
        const data = Bit.toUint16(high, low);

        let tileMap = parseTileMap(data);
        return tileMap;
    }

    public reset(): void {

    }

    public getTileMaps(address: number): ITileMap[] {
        AddressUtil.assertValid(address);
        let entries: ITileMap[] = [];

        let amount = ((this.dimension.width * this.dimension.height) * 2);
        for (let offset = 0; offset < amount; offset += TILE_MAP_SIZE_IN_BYTES) {
            const tilemap = this.getTileMap(address + offset);
            entries.push(tilemap);
        }

        return entries;
    }

}
