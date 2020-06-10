import {AddressUtil} from "../../util/AddressUtil";

export class Vram {

    public static size: number = 0xFFFF; // 64 KB 0xFA00
    public data: number[];

    constructor() {
        this.data = new Array(Vram.size);
        this.data.fill(0, 0, Vram.size);
    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        if (address < 0 || address > Vram.size) {
            throw new Error("Invalid readByte at " + address.toString());
        }

        return this.data[address];
    }

    public writeByte(address: number, value: number): void {
        AddressUtil.assertValid(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        if (address < 0 || address > Vram.size) {
            throw new Error("Invalid write at 0x" + address.toString() + " with value " + value);
        }

        this.data[address] = value;
    }
}
