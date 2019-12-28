import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";
import {Address} from "../bus/Address";

export class Vram {

    public static size: number = 64000; // 64 KB 0xFA00
    public data: number[];

    constructor() {
        this.data = new Array(Vram.size);
        this.data.fill(0, 0, Vram.size);

        this.data[0] = 0x7C;
        this.data[1] = 0x7C;
        this.data[2] = 0x82;
        this.data[3] = 0xEE;
        this.data[4] = 0x82;
        this.data[5] = 0xFE;
        this.data[6] = 0x7C;
        this.data[7] = 0x7C;

        this.data[8] = 0x00;
        this.data[9] = 0x00;
        this.data[10] = 0xD6;
        this.data[11] = 0x82;
        this.data[12] = 0x54;
        this.data[13] = 0x44;
        this.data[14] = 0x38;
        this.data[15] = 0x38;

        this.data[16] = 0x7C;
        this.data[17] = 0x00;
        this.data[18] = 0xAA;
        this.data[19] = 0x10;
        this.data[20] = 0x82;
        this.data[21] = 0x00;
        this.data[22] = 0x7C;
        this.data[23] = 0x00;

        this.data[24] = 0x10;
        this.data[25] = 0x00;
        this.data[26] = 0x54;
        this.data[27] = 0x00;
        this.data[28] = 0x38;
        this.data[29] = 0x00;
        this.data[30] = 0x00;
        this.data[31] = 0x00;

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
