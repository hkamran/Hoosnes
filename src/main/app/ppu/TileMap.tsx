import {Vram} from "../memory/Vram";
import {Address} from "../bus/Address";


class TileEntry {

    public index: number;
    public vram: Vram;

    constructor(index: number, vram: Vram) {
        this.index = index;
        this.vram = vram;
    }

    public getTileAddress(): number {
        let address: number = this.index * 4;
        return address;
    }

    public getAttributes(): number {
        let high: number = this.vram.readByte(Address.create(this.getTileAddress() + 0));
        let low: number = this.vram.readByte(Address.create(this.getTileAddress() + 1));

        let value: number = (high << 4) | low;
        return value;
    }

    public getCharacterAddress(): number {
        let high: number = this.vram.readByte(Address.create(this.getTileAddress() + 1));
        let mid: number = this.vram.readByte(Address.create(this.getTileAddress() + 2));
        let low: number = this.vram.readByte(Address.create(this.getTileAddress() + 3));

        let address: number = ((high & 0x3) << 7) | (mid << 4) | low;
        return address & 0xFFFF;
    }

    public getPaletteNumber(): number {
        let attributes: number = this.getAttributes();
        return (attributes >> 2) & 0x7;
    }

    public isYFlipped(): boolean {
        let attributes: number = this.getAttributes();
        return (attributes >> 7 & 0x1) == 1;
    }

    public isXFlipped(): boolean {
        let attributes: number = this.getAttributes();
        return (attributes >> 6 & 0x1) == 1;
    }

    public getPriority(): boolean {
        let attributes: number = this.getAttributes();
        return (attributes >> 5 & 0x1) == 1;
    }
}

export class TileMap {

    private vram: Vram;

    constructor(vram: Vram) {
        this.vram = vram;
    }

}
