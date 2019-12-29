// The second data area, the OAM, is used to store properties of the sprites. It includes information about position,
// transferSize, priority, etc. There can be 128 objects maximum, and the bus is 544 bytes: the first 512 bytes have four
// bytes of information per sprite, and the last 32 bytes have two more bits of information.  Two or more sprites can
// share the same set of tiles.

import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";
import {Address} from "../bus/Address";

export class OamSizes {
    public smallHeight: number;
    public smallWidth: number;
    public bigHeight: number;
    public bigWidth: number;

    public static create(sh, sw, bh, bw): OamSizes {
        let size: OamSizes = new OamSizes();
        size.smallHeight = sh;
        size.smallWidth = sw;
        size.bigHeight = bh;
        size.bigWidth = bw;

        return size;
    }
}

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

    public readByte(address: Address): number {
        if (address == null) {
            throw new Error("Invalid write at 0x" + address);
        }

        let bank = address.getBank();
        let offset = address.getPage();

        if (bank == 0x00) {
            if (offset < 0 || offset > Oam.TABLE_LOW_SIZE) {
                throw new Error("Invalid write at 0x" + address.toString());
            }
            return this.low[offset];
        } else {
            if (offset < 0 || offset > Oam.TABLE_HIGH_SIZE) {
                throw new Error("Invalid write at 0x" + address.toString());
            }
            return this.high[offset];
        }
    }

    public writeByte(address: Address, val: number): void {
        if (address == null || val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid write at 0x" + address + " with " + val);
        }

        let bank = address.getBank();
        let offset = address.getPage();

        if (bank == 0x00) {
            if (offset < 0 || offset > Oam.TABLE_LOW_SIZE) {
                throw new Error("Invalid write at 0x" + address.toString());
            }
            this.low[offset] = val;
        } else {
            if (offset < 0 || offset > Oam.TABLE_HIGH_SIZE) {
                throw new Error("Invalid write at 0x" + address.toString());
            }
            this.high[offset] = val;
        }
    }
}
