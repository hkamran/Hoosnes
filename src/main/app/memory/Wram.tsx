import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";
import {Address} from "../bus/Address";
import {Read} from "../bus/Read";

export class Wram {
    // The SNES includes 128Kbytes of Work RAM, which can be accessed in several ways:

    // The whole 128K are at 7E0000h-7FFFFFh.
    // The first 8K are also mirrored to xx0000h-xx1FFFh (xx=00h..3Fh and 80h..BFh)
    // Moreover (mainly for DMA purposes) it can be accessed via Port 218xh.

    public low: number[] = [];
    public high: number[] = [];

    public readByte(address: Address): Read {
        Objects.requireNonNull(address);

        let bank = address.getBank();
        let page = address.getPage();

        if (page > 0xFFFF || page < 0) {
            throw new Error("Invalid readByte on work ram!");
        }

        if (NumberUtil.inRange(bank, 0x7F, 0x7F)) {
            return Read.byte(this.high[page]);
        } else {
            return Read.byte(this.low[page]);
        }
    }

    public writeByte(address: number, val: number, bank?: number): void {
    }
}
