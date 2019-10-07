
import {Oam} from "../memory/Oam";

/*
always 4 BPP

format: tttttttt xxxxxxxxx yyyyyyyy vhppcccs

table A: xxxx xxxx yyyy yyyy tttt tttt vhpp ccct

t = index in vram
s = size;
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

    constructor(id: number, oam: Oam) {
        this.id = id;
        this.tableAIndex = id * 4;
        this.tableBIndex = id * 2;
        this.oam = oam;
    }

    public getXPosition(): number {
        let val: number =
            this.oam.readByte(this.tableAIndex + 0);
        return  val;
    }

    public getYPosition(): number {
        let val: number =
            this.oam.readByte(this.tableAIndex + 1);
        return val;
    }

    public getTileNumber(): number {
        let val: number =
            this.oam.readByte(this.tableAIndex + 2);
        return val;
    }

    public getAttributes(): number {
        let val: number =
            this.oam.readByte(this.tableAIndex + 3);
        return val;
    }

    public getPageNumber(): number {
        let val: number = this.getAttributes();
        return val & 1;
    }

    public getPaletteIndex(): number {
        let val: number = this.getAttributes();
        return (val >> 1) & 7;
    }

    public getPriority(): number {
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

    public getTilePage(): number {
        let attributes: number = this.getAttributes();
        return (attributes >> 0 & 0x1);
    }

    public isXWrapped(): number {
        let attributes: number = this.getAttributes();
        return (attributes >> 1 & 0x1);
    }

    public getSecondaryAttributes(): number {
        let index: number = Math.floor(this.tableBIndex / 8);
        let offset: number = (this.tableBIndex % 8);
        let byte: number =
            this.oam.readByte(512 + index);

        let val = (byte >> (6 - offset)) & 0x3;
        return val;
    }
}

export class Sprites {

    public static size: number = 128;

    public oam: Oam;
    public sprites: Sprite[] = [];

    constructor(oam: Oam) {
        this.oam = oam;

        this.initSprites();
    }

    private initSprites(): void {
        for (let i = 0; i < Sprites.size; i++) {
            this.sprites.push(new Sprite(i, this.oam));
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
