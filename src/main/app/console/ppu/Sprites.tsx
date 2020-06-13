import {Oam} from "../memory/Oam";
import {Ppu} from "./Ppu";
import {Objects} from "../../util/Objects";
import {Dimension, Orientation, ITile, ITileAttributes} from "./Tiles";
import {BppType} from "./Palette";

/*
always 4 BPP

format: tttttttt xxxxxxxxx yyyyyyyy vhppcccs

table A: xxxx xxxx yyyy yyyy tttt tttt vhpp ccct

t = index in vram
s = transferSize;
c = palette;
p = getPriority
h = horizontal flip
v = vertical flip

max 128 objects

table a

*/

export class Sprite {

    private readonly id: number;
    private readonly tableAIndex: number;
    private readonly tableBIndex: number;
    private oam: Oam;
    private ppu: Ppu;

    constructor(id: number, oam: Oam, ppu: Ppu) {
        Objects.requireNonNull(ppu);
        
        this.id = id;
        this.tableAIndex = id * 4;
        this.tableBIndex = id;
        this.oam = oam;
        this.ppu = ppu;
    }

    public getXPosition(): number {
        let val: number =
            this.oam.low[this.tableAIndex + 0];
        return val & 0xFF;
    }

    public getYPosition(): number {
        let val: number =
            this.oam.low[this.tableAIndex + 1];
        return val & 0xFF;
    }

    public getTileNumber(): number {
        let val: number =
            this.oam.low[this.tableAIndex + 2];
        return val & 0xFF;
    }

    private getAttributes(): number {
        let val: number =
            this.oam.low[this.tableAIndex + 3];
        return val;
    }

    public getTileAddress(): number {
        let baseTableAddr: number = this.ppu.registers.oamselect.getBaseSelection();
        let secondaryTableOffset: number = this.ppu.registers.oamselect.getNameSelection();
        let secondaryTableAddr: number = baseTableAddr + ((secondaryTableOffset + 1) << 12);

        let isSecondaryTable: boolean = this.getTileTable() == 1;
        let tileNumber: number = this.getTileNumber() << 4;

        // Sprites are always 4 bpp
        let baseAddr: number = isSecondaryTable ? secondaryTableAddr : baseTableAddr;
        let tileAddr: number = ((baseAddr + tileNumber) & 0x7fff) * (BppType.Four / 2);

        return tileAddr;
    }

    public getTile(): ITile {
        let dimensions: {small: Dimension, big: Dimension} = this.ppu.registers.oamselect.getObjectSizes();
        let height: number = this.isBig() ? dimensions.big.height : dimensions.small.height;
        let width: number = this.isBig() ? dimensions.big.width : dimensions.small.width;

        let attributes: ITileAttributes = {
            height,
            width,
            bpp: BppType.Four,
            yFlipped: this.isYFlipped(),
            xFlipped: this.isXFlipped(),
        };
        let address: number = this.getTileAddress();

        return this.ppu.tiles.getTileAt(address, attributes);
    }

    public getTileTable(): number {
        let val: number = this.getAttributes();
        return (val >> 0) & 1;
    }

    // https://sneslab.net/wiki/PPU_Registers
    public getPaletteIndex(): number {
        let val: number = (this.getAttributes() >> 1) & 7;
        let index: number = 8 + val;
        return index;
    }

    public getOrientation(): Orientation {
        let isYFlipped: boolean = this.isYFlipped();
        let isXFlipped: boolean = this.isXFlipped();

        if (isXFlipped) {
            return Orientation.HORIZONTAL;
        } else if (isYFlipped) {
            return Orientation.VERTICAL;
        } else {
            return Orientation.NONE;
        }
    }

    public getSpritePriority(): number {
        let val: number = this.getAttributes();
        return (val >> 4) & 3;
    }

    public isYFlipped(): boolean {
        let val: number = this.getAttributes();
        return ((val >> 7) & 1) == 1;
    }

    public isXFlipped(): boolean {
        let val: number = this.getAttributes();
        return ((val >> 6) & 1) == 1;
    }

    public isBig(): boolean {
        let val: number = this.getSecondaryAttributes();
        return ((val >> 1) & 0x1) == 1;
    }
    public isXWrapped(): boolean {
        let val: number = this.getSecondaryAttributes();
        return ((val >> 0) & 0x1) == 1;
    }

    public getSecondaryAttributes(): number {
        let index: number = Math.floor(this.tableBIndex / 4);
        let offset: number = (this.tableBIndex % 4) * 2;
        let byte: number =
            this.oam.high[index];

        let val = (byte >> offset) & 0x3;
        return val;
    }
}

export class Sprites {

    public static size: number = 128;

    public oam: Oam;
    public ppu: Ppu;
    public sprites: Sprite[] = [];

    constructor(oam: Oam, ppu: Ppu) {
        this.oam = oam;
        this.ppu = ppu;

        this.initSprites();
    }

    private initSprites(): void {
        for (let i = 0; i < Sprites.size; i++) {
            this.sprites.push(new Sprite(i, this.oam, this.ppu));
        }
    }

    public getSprites(): Sprite[] {
        return this.sprites;
    }

    public getSprite(index: number) {
        if (index < 0 || index > Sprites.size) {
            return null;
        }
        return this.sprites[index];
    }

}
