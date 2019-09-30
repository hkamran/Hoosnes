// The second data area, the OAM, is used to store properties of the sprites. It includes information about position,
// size, priority, etc. There can be 128 objects maximum, and the memory is 544 bytes: the first 512 bytes have four
// bytes of information per sprite, and the last 32 bytes have two more bits of information.  Two or more sprites can
// share the same set of tiles.

import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";

export class Oam {

    public static size: number = 544;
    public data: number[];

    constructor() {
        this.data = new Array(Oam.size);
        this.data.fill(0, 0, Oam.size);

        this.data[0] = 0x4c;
        this.data[1] = 0x4F;
        this.data[2] = 0x02;
        this.data[3] = 0x21;
        this.data[4] = 0x4c;
        this.data[5] = 0x47;
        this.data[6] = 0x12;
        this.data[7] = 0x20;
        this.data[512] = 0x20;
        this.data[513] = 0x28;
        this.data[514] = 0x02;
    }

    public readByte(address: number, bank?: number): number {
        if (address == null || address < 0 || address > Oam.size) {
            throw new Error("Invalid read at 0x" + address.toString(16));
        }

        return this.data[address];
    }

    public writeByte(address: number, val: number, bank?: number): void {
        if (address == null || address < 0 || address > Oam.size || val == null) {
            throw new Error("Invalid write at 0x" + address.toString(16) + " with " + val.toString(16));
        }

        this.data[address] = val;
    }
}