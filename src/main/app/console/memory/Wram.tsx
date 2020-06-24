import {Objects} from "../../util/Objects";
import {NumberUtil} from "../../util/NumberUtil";
import {Bit} from "../../util/Bit";
import {AddressUtil} from "../../util/AddressUtil";

export class Wram {
    // The SNES includes 128Kbytes of Work RAM, which can be accessed in several ways:

    // The whole 128K are at 7E0000h-7FFFFFh.
    // The first 8K are also mirrored to xx0000h-xx1FFFh (xx=00h..3Fh and 80h..BFh)
    // Moreover (mainly for DMA purposes) it can be accessed via Port 218xh.

    public static readonly SIZE = 0x20000;

    public data: number[];

    constructor() {
        this.data = new Array(Wram.SIZE);
        this.data.fill(0, 0, Wram.SIZE);
    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (0x7E <= bank && bank <= 0x7F) {
            let index: number = ((bank - 0x7E) * 0x10000) + (page % 0x10000);
            let value: number = this.data[index];
            return Bit.toUint8(value);
        } else {
            let index: number = (page % 0x2000);
            let value: number = this.data[index];
            return Bit.toUint8(value);
        }
    }

    public writeByte(address: number, value: number): void {
        AddressUtil.assertValid(address);
        Objects.requireNonNull(value);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (0x7E <= bank && bank <= 0x7F) {
            let index: number = ((bank - 0x7E) * 0x10000) + (page % 0x10000);
            this.data[index] = value;
        } else {
            let index: number = (page % 0x2000);
            this.data[index] = value;
        }
    }
}


