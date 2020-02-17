import {Vram} from "../memory/Vram";
import {Dimension, Tile, TileAttributes} from "./Tiles";
import {Address} from "../bus/Address";
import {Ppu} from "./Ppu";
import {BppType, Color} from "./Palette";
import {TileMap} from "./TileMaps";
import {ArrayUtil} from "../util/ArrayUtil";
import {Objects} from "../util/Objects";
import {Screen} from "./Screen";

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

    private ppu: Ppu;

    public bg1: Background1;
    public bg2: Background2;
    public bg3: Background3;
    public bg4: Background1;

    constructor(ppu: Ppu) {
        this.ppu = ppu;
        this.bg1 = new Background1(ppu);
        this.bg2 = new Background2(ppu);
        this.bg3 = new Background3(ppu);
    }

}

export abstract class Background {

    protected ppu: Ppu;

    constructor(ppu: Ppu) {
        Objects.requireNonNull(ppu);

        this.ppu = ppu;
    }

    public getTileMap(x: number, y: number): TileMap {
        let tileMapAddress: number = this.getTileMapAddress();
        let isVerticallyExtended: boolean = this.isVerticallyExtended();

        let yOffset: number = y * (0x40 * (isVerticallyExtended ? 2 : 1));
        let xOffset: number = x * 2;

        let index: number = tileMapAddress + yOffset + xOffset;

        let tileMap: TileMap = this.ppu.tileMaps.getTileMap(Address.create(index));
        return tileMap;
    }

    public getLineImage(y: number): Color[] {
        let characterDimension: Dimension = this.getCharacterDimension();
        let backgroundDimension: Dimension = this.getBackgroundDimension();
        let bpp: number = this.ppu.backgrounds.bg1.getBpp().valueOf();
        let vertScrollOffset: number = this.getVerticalScrollOffset();

        let yStart: number = (y + vertScrollOffset);
        let yHarse: number = Math.floor((yStart) / characterDimension.height) % backgroundDimension.height;
        let yCoarse: number = (yStart) % characterDimension.height;

        let xStart: number = this.getHorizontalScrollOffset() % backgroundDimension.width;
        let xEnd: number = xStart + Screen.WIDTH;

        let results: Color[] = [];
        for (let xHarse: number = Math.floor(xStart / characterDimension.width);
             xHarse < Math.floor(xEnd / characterDimension.width); xHarse++) {
            let tileMap: TileMap = this.getTileMap(xHarse, yHarse);
            let tile: Tile = this.getTile(tileMap);

            let colors: Color[] = this.ppu.palette.getPalettesForBppType(tileMap.getPaletteNumber(), bpp);
            let sliver: number[] = tile.data[yCoarse];
            for (let xCoarse: number = 0; xCoarse < sliver.length; xCoarse++) {
                let index: number = sliver[xCoarse];
                let color: Color = colors[index];
                if (index == 0) color.opacity = 0;
                results.push(color);
            }
        }

        return results;
    }

    public getTile(tileMap: TileMap) {
        Objects.requireNonNull(tileMap);

        // address_of_character = (base_location_bits << 13) + (8 * color_depth * character_number);
        let bpp: number = this.getBpp().valueOf();
        let base: number = this.getBaseCharacterAddress();
        let characterDimension: Dimension = this.getCharacterDimension();

        let address: Address = Address.create(base + (8 * bpp * tileMap.getCharacterNumber()));
        let attribute: TileAttributes = TileAttributes.create(characterDimension.height, characterDimension.width, this.getBpp(), tileMap.isYFlipped(), tileMap.isXFlipped());
        let tile: Tile = this.ppu.tiles.getTile(address, attribute);

        return tile;
    }

    public getImage(): Tile {
        let tileMapAddress: number = this.getTileMapAddress();
        let isVerticallyExtended: boolean = this.isVerticallyExtended();
        let isHorizontallyExtended: boolean = this.isHorizontallyExtended();

        let topLeft: Tile[] = this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 0))));
        let topRight: Tile[] = isHorizontallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 1)))) : null;
        let bottomLeft: Tile[] = isVerticallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 2)))) : null;
        let bottomRight: Tile[] = isHorizontallyExtended && isVerticallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 3)))) : null;

        return this.compose(topLeft, topRight, bottomLeft, bottomRight);
    }

    public getTileMaps(): TileMap[][] {
        let tileMapAddress: number = this.getTileMapAddress();
        let isVerticallyExtended: boolean = this.isVerticallyExtended();
        let isHorizontallyExtended: boolean = this.isHorizontallyExtended();

        let topLeft: TileMap[] = this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 0)));
        let topRight: TileMap[] = isHorizontallyExtended ? this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 1))) : null;
        let bottomLeft: TileMap[] = isVerticallyExtended ? this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 2))) : null;
        let bottomRight: TileMap[] = isHorizontallyExtended && isVerticallyExtended ? this.ppu.tileMaps.getTileMaps(Address.create(tileMapAddress + (0x800 * 3))) : null;

        let tileMaps: TileMap[][] = [];

        let yIndex: number = 0;
        let xIndex: number = 0;

        if (topLeft) {
            yIndex = 0;
            xIndex = 0;
            for (let tile of topLeft) {
                if (tileMaps[yIndex] == null) {
                    tileMaps.push([]);
                }
                tileMaps[yIndex][xIndex++] = tile;
                if (xIndex >= 32) {
                    yIndex++;
                    xIndex = 0;
                }
            }
        }

        if (topRight) {
            yIndex = 0;
            xIndex = 32;
            for (let tile of topRight) {
                if (tileMaps[yIndex] == null) {
                    tileMaps.push([]);
                }
                tileMaps[yIndex][xIndex++] = tile;
                if (xIndex >= 64) {
                    yIndex++;
                    xIndex = 0;
                }
            }
        }

        if (bottomLeft) {
            yIndex = 32;
            xIndex = 0;
            for (let tile of bottomLeft) {
                if (tileMaps[yIndex] == null) {
                    tileMaps.push([]);
                }
                tileMaps[yIndex][xIndex++] = tile;
                if (xIndex >= 32) {
                    yIndex++;
                    xIndex = 0;
                }
            }
        }

        if (bottomRight) {
            yIndex = 32;
            xIndex = 32;
            for (let tile of bottomRight) {
                if (tileMaps[yIndex] == null) {
                    tileMaps.push([]);
                }
                tileMaps[yIndex][xIndex++] = tile;
                if (xIndex >= 64) {
                    yIndex++;
                    xIndex = 0;
                }
            }
        }

        return tileMaps;
    }

    private convertToTiles(tileMaps: TileMap[]): Tile[] {
        let tiles: Tile[] = [];
        for (let tileMap of tileMaps) {
            let tile: Tile = this.getTile(tileMap);
            if (tile == null) {
                throw new Error("Invalid tile given!");
            }
            tiles.push(tile);
        }
        return tiles;
    }

    private compose(topLeft: Tile[], topRight: Tile[], bottomLeft: Tile[], bottomRight: Tile[]): Tile {
        let characterDimension: Dimension = this.getCharacterDimension();
        let backgroundDimension: Dimension = this.getBackgroundDimension();
        let bpp: BppType = this.getBpp();

        let data: number[][] = ArrayUtil.create2dMatrix(
            backgroundDimension.height * characterDimension.height,
            backgroundDimension.width * characterDimension.width,
        );

        let yIndex: number = 0;
        let xIndex: number = 0;

        if (topLeft) {
            for (let tile of topLeft) {
                for (let yOffset = 0; yOffset < tile.data.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.data[yOffset].length; xOffset++) {
                        if (data[yIndex + yOffset] == null) {
                            break;
                        }
                        data[yIndex + yOffset][xIndex + xOffset] = tile.data[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
                if (xIndex >= characterDimension.width * backgroundDimension.width) {
                    yIndex += characterDimension.height;
                    xIndex = 0;
                }
            }
        }

        if (topRight) {
            for (let tile of topRight) {
                for (let yOffset = 0; yOffset < tile.data.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.data[yOffset].length; xOffset++) {
                        data[yIndex + yOffset][xIndex + xOffset] = tile.data[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
            }
            yIndex += characterDimension.height;
        }

        if (bottomLeft) {
            xIndex = 0;
            for (let tile of bottomLeft) {
                for (let yOffset = 0; yOffset < tile.data.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.data[yOffset].length; xOffset++) {
                        data[yIndex + yOffset][xIndex + xOffset] = tile.data[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
            }
            yIndex += characterDimension.height;
        }

        if (bottomRight) {
            for (let tile of bottomRight) {
                for (let yOffset = 0; yOffset < tile.data.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.data[yOffset].length; xOffset++) {
                        data[yIndex + yOffset][xIndex + xOffset] = tile.data[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
            }
            yIndex += characterDimension.height;
        }

        return new Tile(data, TileAttributes.create(
            backgroundDimension.height * characterDimension.height,
            backgroundDimension.width * characterDimension.width, bpp));
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



export class Background1 extends Background {

    public getBackgroundDimension(): Dimension {
        return this.ppu.registers.vtilebg1.getDimension();
    }

    public getBaseCharacterAddress(): number {
        return this.ppu.registers.vcharlocbg12.getBaseAddressForBG1();
    }

    public getBpp(): BppType {
        let value: number = this.ppu.registers.bgmode.getMode();
        if (value == 0) {
            return BppType.Two;
        } else if (value == 1) {
            return BppType.Four;
        } else if (value == 2) {
            return BppType.Four;
        }
        throw new Error("Not implemented!");
    }

    public getCharacterDimension(): Dimension {
        return this.ppu.registers.bgmode.getBG1TileSize();
    }

    public getHorizontalScrollOffset(): number {
        return this.ppu.registers.bg1hofs.getBG1HortOffset();
    }

    public getVerticalScrollOffset(): number {
        return this.ppu.registers.bg1vofs.getBG1VertOffset();
    }

    public getTileMapAddress(): number {
        return this.ppu.registers.vtilebg1.getTileMapAddress();
    }

    public isHorizontallyExtended(): boolean {
        return this.ppu.registers.vtilebg1.isExtendedHorizontally();
    }

    public isVerticallyExtended(): boolean {
        return this.ppu.registers.vtilebg1.isExtendedVertically();
    }

}

export class Background2 extends Background {

    public getBackgroundDimension(): Dimension {
        return this.ppu.registers.vtilebg2.getDimension();
    }

    public getBaseCharacterAddress(): number {
        return this.ppu.registers.vcharlocbg12.getBaseAddressForBG2();
    }

    public getBpp(): BppType {
        let value: number = this.ppu.registers.bgmode.getMode();
        if (value == 0) {
            return BppType.Two;
        } else if (value == 1) {
            return BppType.Four;
        } else if (value == 2) {
            return BppType.Four;
        }
        throw new Error("Not implemented!");
    }

    public getCharacterDimension(): Dimension {
        return this.ppu.registers.bgmode.getBG2TileSize();
    }

    public getHorizontalScrollOffset(): number {
        return this.ppu.registers.bg2hofs.getBG2HortOffset();
    }

    public getVerticalScrollOffset(): number {
        return this.ppu.registers.bg2vofs.getBG2VertOffset();
    }

    public getTileMapAddress(): number {
        return this.ppu.registers.vtilebg2.getTileMapAddress();
    }

    public isHorizontallyExtended(): boolean {
        return this.ppu.registers.vtilebg2.isExtendedHorizontally();
    }

    public isVerticallyExtended(): boolean {
        return this.ppu.registers.vtilebg2.isExtendedVertically();
    }

}

export class Background3 extends Background {

    public getBackgroundDimension(): Dimension {
        return this.ppu.registers.vtilebg3.getDimension();
    }

    public getBaseCharacterAddress(): number {
        return this.ppu.registers.vcharlocbg34.getBaseAddressForBG3();
    }

    public getBpp(): BppType {
        let value: number = this.ppu.registers.bgmode.getMode();
        if (value == 0) {
            return BppType.Two;
        } else if (value == 1) {
            return BppType.Four;
        } else if (value == 2) {
            return BppType.Four;
        }
        throw new Error("Not implemented!");
    }

    public getCharacterDimension(): Dimension {
        return this.ppu.registers.bgmode.getBG3TileSize();
    }

    public getHorizontalScrollOffset(): number {
        return this.ppu.registers.bg3hofs.getBG3HortOffset();
    }

    public getVerticalScrollOffset(): number {
        return this.ppu.registers.bg3vofs.getBG3VertOffset();
    }

    public getTileMapAddress(): number {
        return this.ppu.registers.vtilebg3.getTileMapAddress();
    }

    public isHorizontallyExtended(): boolean {
        return this.ppu.registers.vtilebg3.isExtendedHorizontally();
    }

    public isVerticallyExtended(): boolean {
        return this.ppu.registers.vtilebg3.isExtendedVertically();
    }

}