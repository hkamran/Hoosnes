// The second data area, the OAM, is used to store properties of the sprites. It includes information about position,
// transferSize, priority, etc. There can be 128 objects maximum, and the bus is 544 bytes: the first 512 bytes have four
// bytes of information per sprite, and the last 32 bytes have two more bits of information.  Two or more sprites can
// share the same set of tiles.

import {AddressUtil} from "../util/AddressUtil";

export class Oam {

    public static readonly TABLE_LOW_SIZE: number = 512;
    public static readonly TABLE_HIGH_SIZE: number = 32;

    public static size: number = 544;
    public low: number[];
    public high: number[];

    constructor() {
        this.low = new Array(Oam.TABLE_LOW_SIZE);
        this.low.fill(0, 0, Oam.TABLE_LOW_SIZE);

        this.high = new Array(Oam.TABLE_HIGH_SIZE);
        this.high.fill(0, 0, Oam.TABLE_HIGH_SIZE);
    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        if (address < 512) {
            return this.low[address];
        } else if (address < 544) {
            return this.high[address - 512];
        }
        throw new Error("Invalid read at " + address.toString());
    }

    public writeByte(address: number, value: number): void {
        AddressUtil.assertValid(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        if (address < 512) {
            this.low[address] = value;
        } else if (address < 544) {
            this.high[address - 512] = value;
        } else {
            throw Error("Invalid write at " + address.toString() + " " + value);
        }
    }
}
