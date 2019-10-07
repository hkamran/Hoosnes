import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";

export class Vram {

    public static size: number = 64000; // 64 KB
    public data: number[];

    constructor() {
        this.data = new Array(Vram.size);
        this.data.fill(0, 0, Vram.size);
    }

    public readByte(address: number, bank?: number): number {
        if (address == null || address < 0 || address > this.data.length) {
            throw new Error("Invalid read at 0x" + address.toString(16));
        }
        return this.data[address];
    }

    public writeByte(address: number, val: number, bank?: number): void {
        if (address == null || address < 0 || address > this.data.length) {
            throw new Error("Invalid write at 0x" + address.toString(16));
        }

        if (val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid write at 0x" + address.toString(16) + " with value " + val);
        }
        this.data[address] = val;
    }
}
