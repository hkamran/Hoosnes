import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";

export class Wram {
    // The SNES includes 128Kbytes of Work RAM, which can be accessed in several ways:

    // The whole 128K are at 7E0000h-7FFFFFh.
    // The first 8K are also mirrored to xx0000h-xx1FFFh (xx=00h..3Fh and 80h..BFh)
    // Moreover (mainly for DMA purposes) it can be accessed via Port 218xh.

    public low: number[] = [];
    public high: number[] = [];

    public readByte(address: number, bank?: number): number {
        Objects.requireNonNull(address);
        if (address > 0xFFFF || address < 0) {
            throw new Error("Invalid readByte on work ram!");
        }
        if (bank == null) {
            bank = (address >> 16) & 0xFF;
        }
        let offset: number = (address & 0xFFFF);
        console.log(`Reading work ram ${bank.toString(16)}:${offset.toString(16)}`);

        if (NumberUtil.inRange(bank, 0x7F, 0x7F)) {
            return this.high[offset];
        } else {
            return this.low[offset];
        }
    }

    public writeByte(address: number, val: number, bank?: number): void {
    }
}
