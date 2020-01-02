import {Vram} from "../memory/Vram";
import {Dimension, Tile, TileAttributes} from "./Tiles";
import {Address} from "../bus/Address";
import {Ppu} from "./Ppu";
import {BppType} from "./Palette";
import {TileMaps, TileMap} from "./TileMaps";
import {ArrayUtil} from "../util/ArrayUtil";

/**
 *
 BG Modes
 --------

 The SNES has 7 background modes, two of which have major variations. The modes
 are selected by bits 0-2 of register $2105. The variation of Mode 1 is selected
 by bit 3 of $2105, and the variation of Mode 7 is selected by bit 6 of $2133.

 Mode    # Colors for BG
 1   2   3   4
 ======---=---=---=---=
 0        4   4   4   4
 1       16  16   4   -
 2       16  16   -   -
 3      256  16   -   -
 4      256   4   -   -
 5       16   4   -   -
 6       16   -   -   -
 7      256   -   -   -
 7EXTBG 256 128   -   -

 In all modes and for all BGs, color 0 in any palette is considered transparent.
 */

export class Backgrounds {

    private vram: Vram;

    constructor(vram: Vram) {
        this.vram = vram;
    }

}

export abstract class Background {

    private ppu: Ppu;

    constructor(ppu: Ppu) {
        this.ppu = ppu;
    }

    public getImage(): Tile {
        let tileMapAddress: number = this.getTileMapAddress();
        let isVerticallyExtended: boolean = this.isVerticallyExtended();
        let isHorizontallyExtended: boolean = this.isHorizontallyExtended();
        let characterDimension: Dimension = this.getCharacterDimension();
        let backgroundDimension: Dimension = this.getBackgroundDimension();
        let bpp: BppType = this.getBpp();

        let tileAttributes: TileAttributes = TileAttributes.create(characterDimension.height, characterDimension.width, bpp);

        let topLeft: Tile[] = this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 0))));
        let topRight: Tile[] = isHorizontallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 1)))) : null;
        let bottomLeft: Tile[] = isVerticallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 2)))) : null;
        let bottomRight: Tile[] = isHorizontallyExtended && isVerticallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 3)))) : null;

        return Tile.create([], TileAttributes.create(backgroundDimension.height, backgroundDimension.width, bpp));
    }

    private convertToTiles(tileMaps: TileMap[]) {
        // address_of_character = (base_location_bits << 13) + (8 * color_depth * character_number);

        let bpp: number = this.getBpp().valueOf();
        let base: number = this.getBaseCharacterAddress();
        let characterDimension: Dimension = this.getCharacterDimension();
        let attribute: TileAttributes = TileAttributes.create(characterDimension.height, characterDimension.width, this.getBpp());

        let tiles: Tile[] = [];
        for (let tileMap of tileMaps) {
            let address: Address = Address.create(base * (8 * bpp * tileMap.getCharacterNumber()));
            tiles.push(this.ppu.tiles.getTile(address, attribute));
        }
        return tiles;
    }

    private compose(topLeft: Tile[], topRight: Tile[], bottomLeft: Tile[], bottomRight: Tile[], backgroundDimension: Dimension) {
        let data: number[][] = ArrayUtil.create2dMatrix(backgroundDimension.height, backgroundDimension.width);
        let bpp: BppType = this.getBpp();

        let yIndex: number = 0;
        let xIndex: number = 0;
        for (let tile of topLeft) {
        }

        return [];
    }

    public abstract getBpp(): BppType;
    public abstract getBackgroundDimension(): Dimension;
    public abstract getCharacterDimension(): Dimension;
    public abstract isHorizontallyExtended(): boolean;
    public abstract isVerticallyExtended(): boolean;
    public abstract getBaseCharacterAddress(): number;
    public abstract getTileMapAddress(): number;
    public abstract getVerticalScrollOffset(): number;
    public abstract getHorizontalScrollOffset(): number;

}