import {Objects} from "../util/Objects";
import {Console} from "../Console";
import {Address} from "./Address";
import {Write} from "./Write";
import {Read} from "./Read";
import {BusA} from "./BusA";
import {BusB} from "./BusB";
import {Cartridge} from "../cartridge/Cartridge";
import {Wram} from "../memory/Wram";
import {Bit} from "../util/Bit";
import {AddressUtil} from "../util/AddressUtil";

export class Bus {

    public busA: BusA;
    public busB: BusB;
    public cartridge: Cartridge;
    public wram: Wram;
    public console: Console;

    public mdr: number = null;

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

        let value: number = this.mdr;

        if (0x00 <= bank && bank < 0x3F) {
            if (0x0000 <= page && page <= 0x1FFF) {
                value = this.wram.readByte(address);
            } else if (0x2100 <= page && page <= 0x21FF) {
                value = this.busB.readByte(address);
            } else if (0x2200 <= page && page <= 0x3FFF) {
                value = this.mdr;
            } else if (0x4000 <= page && page <= 0x43FF) {
                value = this.busA.readByte(address);
            } else if (0x4380 <= page && page <= 0x7FFF) {
                value = this.mdr;
            } else if (0x8000 <= page && page <= 0xFFFF) {
                value = this.cartridge.readByte(address);
            }
        } else if (0x40 <= bank && bank <= 0x7F) {
            if (0x7E <= bank && bank <= 0x7F) {
                value = this.wram.readByte(address);
            } else {
                value = this.cartridge.readByte(address);
            }
        } else if (0x80 <= bank && bank <= 0xBF) {
            if (0x0000 <= page && page <= 0x1FFF) {
                value = this.wram.readByte(address);
            } else if (0x2100 <= page && page <= 0x21FF) {
                value = this.busB.readByte(address);
            } else if (0x2200 <= page && page <= 0x4000) {
                value = this.mdr;
            } else if (0x4000 <= page && page <= 0x43FF) {
                value = this.busA.readByte(address);
            } else if (0x4400 <= page && page <= 0x7FFF) {
                value = this.mdr;
            } else if (0x8000 <= page && page <= 0xFFFF) {
                value = this.cartridge.readByte(address);
            }
        } else if (0xC0 <= bank && bank <= 0xFF) {
            value = this.cartridge.readByte(address);
        } else {
            throw new Error("Invalid bus value at " + address.toString(16));
        }

        this.mdr = value;
        return Bit.toUint8(value);
    }


    public writeByte(address: number, value: number): void {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        this.mdr = value;

        if (0x00 <= bank && bank < 0x3F) {
            if (0x0000 <= page && page <= 0x1FFF) {
                this.wram.writeByte(address, value);
            } else if (0x2100 <= page && page <= 0x21FF) {
                this.busB.writeByte(address, value);
            } else if (0x2200 <= page && page <= 0x3FFF) {
                console.warn(`Writing ${address}=${value}`);
            } else if (0x4000 <= page && page <= 0x43FF) {
                this.busA.writeByte(address, value);
            } else if (0x4380 <= page && page <= 0x7FFF) {
                console.warn(`Writing ${address}=${value}`);
            } else if (0x8000 <= page && page <= 0xFFFF) {
                this.cartridge.writeByte(address, value);
            }
        } else if (0x40 <= bank && bank <= 0x7F) {
            if (0x7E <= bank && bank <= 0x7F) {
                this.wram.writeByte(address, value);
            } else {
                this.cartridge.writeByte(address, value);
            }
        } else if (0x80 <= bank && bank <= 0xBF) {
            if (0x0000 <= page && page <= 0x1FFF) {
                this.wram.writeByte(address, value);
            } else if (0x2100 <= page && page <= 0x21FF) {
                this.busB.writeByte(address, value);
            } else if (0x2200 <= page && page <= 0x41FF) {
                //this.console.cartridge.writeByte(address, value);
            } else if (0x4200 <= page && page <= 0x43FF) {
                this.busA.writeByte(address, value);
            } else if (0x4400 <= page && page <= 0x7FFF) {
                this.cartridge.writeByte(address, value);
            } else if (0x8000 <= page && page <= 0xFFFF) {
                this.cartridge.writeByte(address, value);
            }
        } else if (0xF0 <= bank && bank <= 0xFF) {
            this.cartridge.writeByte(address, value);
        }
    }

    public reset(): void {
        this.mdr = 0;
        this.cartridge = this.console.cartridge;
    }

}
