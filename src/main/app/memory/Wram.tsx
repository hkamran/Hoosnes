import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";
import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";

export class Wram {
    // The SNES includes 128Kbytes of Work RAM, which can be accessed in several ways:

    // The whole 128K are at 7E0000h-7FFFFFh.
    // The first 8K are also mirrored to xx0000h-xx1FFFh (xx=00h..3Fh and 80h..BFh)
    // Moreover (mainly for DMA purposes) it can be accessed via Port 218xh.

    public static readonly SIZE = 0x1FFFF;

    private data: number[];

    constructor() {
        this.data = new Array(Wram.SIZE);
        this.data.fill(0, 0, Wram.SIZE);
    }

    public readByte(address: Address): Read {
        Objects.requireNonNull(address);

        let bank = address.getBank();
        let page = address.getPage();

        if (page > 0xFFFF || page < 0) {
            throw new Error("Invalid readByte on work ram!");
        }

        if (NumberUtil.inRange(bank, 0x7E, 0x7F)) {
            // let remainder: number = page % 0x2000;
            // let multiplier: number = Math.floor(page/ 0x2000) * 0x2000;
            // let offset: number = bank == 0x7F ? 0xFFFF : 0x0000;
            // let index: number = multiplier + remainder + offset;

            let base: number = bank == 0x7F ? 0xFFFF : 0x0000;
            let index: number = base + (page % 0xFFFF);
            return Read.byte(this.data[index]);
        } else {
            let base: number = (bank % 0x40) << 16;
            let index: number = base | page % 0x2000;
            return Read.byte(this.data[index]);
        }
    }

    public writeByte(address: Address, value: number): Write {
        Objects.requireNonNull(address);

        let bank = address.getBank();
        let page = address.getPage();

        if (page > 0xFFFF || page < 0) {
            throw new Error("Invalid writeByte on work ram!" + address);
        }

        if (NumberUtil.inRange(bank, 0x7E, 0x7F)) {
            // let remainder: number = page % 0x2000;
            // let multiplier: number = Math.floor(page/ 0x2000) * 0x2000;
            // let offset: number = bank == 0x7F ? 0xFFFF : 0x0000;
            // let index: number = multiplier + remainder + offset;

            let base: number = bank == 0x7F ? 0xFFFF : 0x0000;
            let index: number = base + (page % 0xFFFF);
            this.data[index] = value;
            return new Write(address, value, 0);
        } else {
            let base: number = (bank % 0x40) * 0x2000;
            let index: number = base + (page % 0x2000);
            this.data[index] = value;
            return new Write(address, value, 0);
        }
    }
}


