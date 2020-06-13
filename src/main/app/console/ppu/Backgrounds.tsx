import {Dimension, ITile, ITileAttributes} from "./Tiles";
import {Ppu} from "./Ppu";
import {BppType, IColor} from "./Palette";
import {ITileMap} from "./TileMaps";
import {ArrayUtil} from "../../util/ArrayUtil";
import {Objects} from "../../util/Objects";
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

    public getTileMap(x: number, y: number): ITileMap {
        let tileMapAddress: number = this.getTileMapAddress();
        let dimension: Dimension = this.getBackgroundDimension();
        let tileMapSize = 2;
        let totalTileMaps: number = 32;
        let mapIndex: number = 0;
        if (x > 31 && this.isHorizontallyExtended()) mapIndex = 1;
        if (y > 31 && this.isVerticallyExtended()) mapIndex = 2;
        if (x > 31 && y > 31 && this.isHorizontallyExtended() && this.isVerticallyExtended()) mapIndex = 3;

        let mapOffset: number = mapIndex * (totalTileMaps * totalTileMaps) * tileMapSize;
        let yOffset: number = (y % totalTileMaps) * (totalTileMaps * tileMapSize);
        let xOffset: number = (x % totalTileMaps) * tileMapSize;

        let index: number = tileMapAddress + yOffset + xOffset + mapOffset;

        let tileMap: ITileMap = this.ppu.tileMaps.getTileMap(index);
        return tileMap;
    }

    public getLineImage(y: number): IColor[] {
        let base: number = this.getBaseCharacterAddress();
        let characterDimension: Dimension = this.getCharacterDimension();
        let backgroundDimension: Dimension = this.getBackgroundDimension();
        let bpp: number = this.getBpp().valueOf();
        let vertScrollOffset: number = this.getVerticalScrollOffset();
        let hortScrollOffset: number = this.getHorizontalScrollOffset();

        let yPos: number = y + vertScrollOffset;
        let yHarse: number = Math.floor(yPos / characterDimension.width);
        let yCoarse: number = yPos % characterDimension.height;

        let xPos: number = hortScrollOffset;
        let xHarse: number = Math.floor(xPos / characterDimension.width);
        let xCoarse: number = xHarse % characterDimension.width;

        let results: IColor[] = [];
        let xHarseEnd: number = xHarse + 32;

        let attribute: ITileAttributes = {
            height: characterDimension.height,
            width: characterDimension.width,
            bpp: this.getBpp(),
            yFlipped: null,
            xFlipped: null,
        };

        for (;xHarse < xHarseEnd; xHarse++) {
            let tileMap: ITileMap = this.getTileMap(xHarse, yHarse);

            attribute.xFlipped = tileMap.xFlipped;
            attribute.yFlipped = tileMap.yFlipped;

            let address: number = base + (8 * bpp * tileMap.characterNumber);
            let sliver: number[] = this.ppu.tiles.getRowAt(address, yCoarse, attribute);

            let colors: IColor[] = this.ppu.palette.getPalettesForBppType(tileMap.paletteNumber, bpp);
            for (let xIndex = 0; xIndex < sliver.length; xIndex++) {
                let index: number = sliver[xIndex];
                let color: IColor = colors[index];
                if (index == 0) color.opacity = 0;
                results.push(color);
            }
        }

        return results;
    }

    public getTile(tileMap: ITileMap) {
        Objects.requireNonNull(tileMap);

        // address_of_character = (base_location_bits << 13) + (8 * color_depth * character_number);
        let bpp: number = this.getBpp().valueOf();
        let base: number = this.getBaseCharacterAddress();
        let characterDimension: Dimension = this.getCharacterDimension();

        let address: number = base + (8 * bpp * tileMap.characterNumber);
        let attribute: ITileAttributes = {
            height: characterDimension.height,
            width: characterDimension.width,
            bpp: this.getBpp(),
            yFlipped: tileMap.yFlipped,
            xFlipped: tileMap.xFlipped,
        };
        let tile: ITile = this.ppu.tiles.getTileAt(address, attribute);

        return tile;
    }

    public getImage(): ITile {
        let tileMapAddress: number = this.getTileMapAddress();
        let isVerticallyExtended: boolean = this.isVerticallyExtended();
        let isHorizontallyExtended: boolean = this.isHorizontallyExtended();

        let topLeft: ITile[] = this.convertToTiles(this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 0)));
        let topRight: ITile[] = isHorizontallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 1))) : null;
        let bottomLeft: ITile[] = isVerticallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 2))) : null;
        let bottomRight: ITile[] = isHorizontallyExtended && isVerticallyExtended ? this.convertToTiles(this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 3))) : null;

        return this.compose(topLeft, topRight, bottomLeft, bottomRight);
    }

    public getTileMaps(): ITileMap[][] {
        let tileMapAddress: number = this.getTileMapAddress();
        let isVerticallyExtended: boolean = this.isVerticallyExtended();
        let isHorizontallyExtended: boolean = this.isHorizontallyExtended();

        let topLeft: ITileMap[] = this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 0));
        let topRight: ITileMap[] = isHorizontallyExtended ? this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 1)) : null;
        let bottomLeft: ITileMap[] = isVerticallyExtended ? this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 2)) : null;
        let bottomRight: ITileMap[] = isHorizontallyExtended && isVerticallyExtended ? this.ppu.tileMaps.getTileMaps(tileMapAddress + (0x800 * 3)) : null;

        let tileMaps: ITileMap[][] = [];

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
                    xIndex = 32;
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
                    xIndex = 32;
                }
            }
        }

        return tileMaps;
    }

    private convertToTiles(tileMaps: ITileMap[]): ITile[] {
        let tiles: ITile[] = [];
        for (let tileMap of tileMaps) {
            let tile: ITile = this.getTile(tileMap);
            if (tile == null) {
                throw new Error("Invalid tile given!");
            }
            tiles.push(tile);
        }
        return tiles;
    }

    private compose(topLeft: ITile[], topRight: ITile[], bottomLeft: ITile[], bottomRight: ITile[]): ITile {
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
                for (let yOffset = 0; yOffset < tile.image.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.image[yOffset].length; xOffset++) {
                        if (data[yIndex + yOffset] == null) {
                            break;
                        }
                        data[yIndex + yOffset][xIndex + xOffset] = tile.image[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
                if (xIndex >= (characterDimension.width * 32)) {
                    yIndex += characterDimension.height;
                    xIndex = 0;
                }
            }
            xIndex = characterDimension.width * 32;
            yIndex = 0;
        }

        if (topRight) {
            for (let tile of topRight) {
                for (let yOffset = 0; yOffset < tile.image.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.image[yOffset].length; xOffset++) {
                        data[yIndex + yOffset][xIndex + xOffset] = tile.image[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
                if (xIndex >= (characterDimension.width * 64)) {
                    yIndex += characterDimension.height;
                    xIndex = characterDimension.width * 32;
                }
            }
            xIndex = 0;
            yIndex = characterDimension.height * 32;
        }

        if (bottomLeft) {
            xIndex = 0;
            for (let tile of bottomLeft) {
                for (let yOffset = 0; yOffset < tile.image.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.image[yOffset].length; xOffset++) {
                        data[yIndex + yOffset][xIndex + xOffset] = tile.image[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
                if (xIndex >= (characterDimension.width * 32)) {
                    yIndex += characterDimension.height;
                    xIndex = 0;
                }
            }
            xIndex = characterDimension.width * 32;
            yIndex = characterDimension.height * 32;
        }

        if (bottomRight) {
            for (let tile of bottomRight) {
                for (let yOffset = 0; yOffset < tile.image.length; yOffset++) {
                    for (let xOffset = 0; xOffset < tile.image[yOffset].length; xOffset++) {
                        data[yIndex + yOffset][xIndex + xOffset] = tile.image[yOffset][xOffset];
                    }
                }
                xIndex += characterDimension.width;
                if (xIndex >= (characterDimension.width * 64)) {
                    yIndex += characterDimension.height;
                    xIndex = characterDimension.width * 32;
                }
            }
            xIndex = characterDimension.width * 32;
            yIndex = characterDimension.height * 32;
        }

        let attributes: ITileAttributes = {
            height: backgroundDimension.height * characterDimension.height,
            width: backgroundDimension.width * characterDimension.width,
            bpp,
            yFlipped: false,
            xFlipped: false,
        };
        return {
            image: data,
            attributes,
        };
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
        } else if (value == 3) {
            return BppType.Four;
        } else if (value == 5) {
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
        } else if (value == 3) {
            return BppType.Four;
        } else if (value == 5) {
            return BppType.Two;
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
            return BppType.Two;
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