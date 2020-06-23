import {Objects} from "../../util/Objects";
import {Console} from "../Console";
import {Cartridge} from "../cartridge/Cartridge";
import {Wram} from "../memory/Wram";
import {Bit} from "../../util/Bit";
import {AddressUtil} from "../../util/AddressUtil";
import {BusB} from "./BusB";
import {BusA} from "./BusA";

export class Bus {

    public busA: BusA;
    public busB: BusB;
    public cartridge: Cartridge;
    public wram: Wram;
    public console: Console;

    public mdr: number = 0x0;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
        this.busA = new BusA(console);
        this.busB = new BusB(console);
        this.cartridge = console.cartridge;
        this.wram = console.cpu.wram;
    }

    // "Internal" cycles on the CPU, and reads from or writes to "Fast" memory regions,
    // specifically the upper 3/8th of memory when enabled (banks $80-$BF pages $80-$FF
    // and banks $C0-$FF all pages) and most registers (banks $00-$3F and $80-$BF,
    // pages $20-$3F and $42-$5F), take place in 6 master clock cycles.
    //
    // Cycles reading or writing to "normal" memory regions (banks $00-$3F, pages $00-$1F
    // and $60-$FF; banks $40-$7F all pages; and that same upper 3/8th of address space
    // when fast memory is not enabled) take 8 master clock cycles.
    //
    // "slow" memory, which is only banks $00-$3F and $80-$BF, pages $40 and $41, take 12 master clock cycles.
    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        let value: number = null;

        if ((0x00 <= bank && bank <= 0x3F) ||
            (0x80 <= bank && bank <= 0xBF)) {
            if (0x0000 <= page && page <= 0x1FFF) {
                value = Bit.toUint8(this.wram.readByte(address));
            } else if (0x2000 <= page && page <= 0x20FF) {
                value = this.mdr;
            } else if (0x2000 <= page && page <= 0x21FF) {
                value = Bit.toUint8(this.busB.readByte(address));
            } else if (0x2200 <= page && page <= 0x2FFF) {
                value = this.mdr;
            } else if (0x3000 <= page && page <= 0x3FFF) {
                value = this.mdr;
            } else if (0x4000 <= page && page <= 0x44FF) {
                value = Bit.toUint8(this.busA.readByte(address));
            } else if (0x4500 <= page && page <= 0x7FFF) {
                value = this.mdr;
            } else if (0x8000 <= page && page <= 0xFFFF) {
                value = Bit.toUint8(this.cartridge.readByte(address));
            }
        } else if (0x7E <= bank && bank <= 0x7F) {
            value = Bit.toUint8(this.wram.readByte(address));
        } else if ((0x40 <= bank && bank <= 0x7D) ||
            (0xC0 <= bank && bank <= 0xFF)) {
            if (0x0000 <= page && page <= 0x7FFF) {
                value = Bit.toUint8(this.cartridge.readByte(address));
            } else if (0x8000 <= page && page <= 0xFFFF) {
                value = Bit.toUint8(this.cartridge.readByte(address));
            }
        }

        if (value == null) {
            throw new Error("read is undefined!");
        }

        return value;
    }


    public writeByte(address: number, value: number): void {
        AddressUtil.assertValid(address);
        Objects.requireNonNull(value);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        this.mdr = value;

        if ((0x00 <= bank && bank <= 0x3F) ||
            (0x80 <= bank && bank <= 0xBF)) {
            if (0x0000 <= page && page <= 0x1FFF) {
                return this.wram.writeByte(address, value);
            } else if (0x2000 <= page && page <= 0x20FF) {
                this.mdr = value;
                return;
            } else if (0x2000 <= page && page <= 0x21FF) {
                return this.busB.writeByte(address, value);
            } else if (0x2200 <= page && page <= 0x2FFF) {
                this.mdr = value;
                return;
            } else if (0x3000 <= page && page <= 0x3FFF) {
                this.mdr = value;
                return;
            } else if (0x4000 <= page && page <= 0x44FF) {
                return this.busA.writeByte(address, value);
            } else if (0x4500 <= page && page <= 0x7FFF) {
                this.mdr = value;
                return;
            } else if (0x8000 <= page && page <= 0xFFFF) {
                return this.cartridge.writeByte(address, value);
            }
        } else if ((0x40 <= bank && bank <= 0x7D) ||
            (0xC0 <= bank && bank <= 0xFF)) {
            if (0x0000 <= page && page <= 0x7FFF) {
                return this.cartridge.writeByte(address, value);
            } else if (0x8000 <= page && page <= 0xFFFF) {
                return this.cartridge.writeByte(address, value);
            }
        } else if (0x7E <= bank && bank <= 0x7F) {
            return this.wram.writeByte(address, value);
        }

        throw new Error(`Invalid write at ${address.toString(16)}=${value}`);
    }

    public reset(): void {
        this.mdr = 0;
        this.cartridge = this.console.cartridge;
    }

}
