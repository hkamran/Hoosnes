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

    public static readonly SIZE = 0x1F400;

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
            let index: number = ((bank - 0x7E) * 0xFFFF);
            let offset: number = page;
            return Read.byte(this.data[index + offset]);
        } else {
            return Read.byte(this.data[page]);
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
            let multiplier: number = (page / 0x2000) * 0x2000;
            let remainder: number = page % 0x2000;
            this.data[multiplier + remainder] = value;
            return new Write(address, value, 0);
        } else {
            this.data[page] = value;
            return new Write(address, value, 0);
        }
    }
}


