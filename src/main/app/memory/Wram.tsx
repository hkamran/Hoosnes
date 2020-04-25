import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";
import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";
import {Bit} from "../util/Bit";
import {AddressUtil} from "../util/AddressUtil";

export class Wram {
    // The SNES includes 128Kbytes of Work RAM, which can be accessed in several ways:

    // The whole 128K are at 7E0000h-7FFFFFh.
    // The first 8K are also mirrored to xx0000h-xx1FFFh (xx=00h..3Fh and 80h..BFh)
    // Moreover (mainly for DMA purposes) it can be accessed via Port 218xh.

    public static readonly SIZE = 0x20000;

    private data: number[];

    constructor() {
        this.data = new Array(Wram.SIZE);
        this.data.fill(0, 0, Wram.SIZE);
    }

    public readByte(address: number): number {
        Objects.requireNonNull(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (page > 0xFFFF || page < 0) {
            throw new Error("Invalid readByte on work ram!");
        }

        if (NumberUtil.inRange(bank, 0x7E, 0x7F)) {
            let base: number = (((bank % 0x80) - 0x7E) << 16);
            let index: number = base | (page % 0xFFFF);

            let value: number = this.data[index];
            return Bit.toUint8(value);
        } else {
            let index: number = (page % 0x2000);

            let value: number = this.data[index];
            return Bit.toUint8(value);
        }
    }

    public writeByte(address: number, value: number): void {
        Objects.requireNonNull(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        if (page > 0xFFFF || page < 0) {
            throw new Error("Invalid writeByte on work ram!" + address);
        }

        if (NumberUtil.inRange(bank, 0x7E, 0x7F)) {
            let base: number = (((bank % 0x80) - 0x7E) << 16);
            let index: number = base | (page % 0xFFFF);
            this.data[index] = value;
        } else {
            let index: number = (page % 0x2000);
            this.data[index] = value;
        }
    }
}


