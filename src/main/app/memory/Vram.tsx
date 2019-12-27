import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";
import {Address} from "../bus/Address";

export class Vram {

    public static size: number = 64000; // 64 KB 0xFA00
    public data: number[];

    constructor() {
        this.data = new Array(Vram.size);
        this.data.fill(0, 0, Vram.size);
    }

    public readByte(address: Address): number {
        if (address == null) {
            throw new Error("Invalid readByte at " + address);
        }

        let offset = address.toValue();

        if (offset < 0 || offset > Vram.size) {
            throw new Error("Invalid readByte at " + address.toString());
        }

        return this.data[address.toValue()];
    }

    public writeByte(address: Address, val: number): void {
        if (address == null || val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid write at 0x" + address + " with value " + val);
        }

        let offset = address.toValue();

        if (offset < 0 || offset > Vram.size) {
            throw new Error("Invalid write at 0x" + address.toString() + " with value " + val);
        }

        this.data[offset] = val;
    }
}
