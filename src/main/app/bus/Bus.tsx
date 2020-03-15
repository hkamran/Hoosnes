import {Objects} from "../util/Objects";
import {Console} from "../Console";
import {Address} from "./Address";
import {Write} from "./Write";
import {Read} from "./Read";
import {BusA} from "./BusA";
import {BusB} from "./BusB";

export class NotSupported extends Error {
    constructor(message? : any) {
        super(`Not supported! ${message}`);
        this.name = 'NotSupported';
    }
}

export class Bus {


    public busA: BusA;
    public busB: BusB;

    public console: Console;
    public mdr: Read = null;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
        this.busA = new BusA(console);
        this.busB = new BusB(console);
    }

    public readWord(address: Address): Read {
        let nextAddress = Address.create(address.toValue() + 1);

        let low: Read = this.readByte(address);
        let high: Read = this.readByte(nextAddress);

        let cycles: number = low.getCycles() + high.getCycles();

        let result: Read = Read.word(low.get(), high.get(), cycles);
        return result;
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
    public readByte(address: Address): Read {
        if (address == null) {
            throw new Error("Invalid readByte at " + address);
        }

        //console.log("reading " + address.toString());

        let read: Read = null;

        let bank = address.getBank();
        let page = address.getPage();

        if (0x00 <= bank && bank < 0x3F) {
            if (0x0000 <= page && page <= 0x1FFF) {
                read = this.console.cpu.wram.readByte(address);
            } else if (0x2100 <= page && page <= 0x21FF) {
                read = this.busB.readByte(address);
            } else if (0x2200 <= page && page <= 0x3FFF) {
                read = this.console.cartridge.readByte(address);
            } else if (0x4000 <= page && page <= 0x43FF) {
                read = this.busA.readByte(address);
            } else if (0x4380 <= page && page <= 0x7FFF) {
                read = this.mdr;
            } else if (0x8000 <= page && page <= 0xFFFF) {
                read = this.console.cartridge.readByte(address);
            }
        } else if (0x40 <= bank && bank <= 0x7F) {
            if (0x7E <= bank && bank <= 0x7F) {
                read = this.console.cpu.wram.readByte(address);
            } else {
                read = this.console.cartridge.readByte(address);
            }
        } else if (0x80 <= bank && bank <= 0xBF) {
            if (0x0000 <= page && page <= 0x1FFF) {
                read = this.console.cpu.wram.readByte(address);
            } else if (0x2100 <= page && page <= 0x21FF) {
                read = this.busB.readByte(address);
            } else if (0x2200 <= page && page <= 0x4000) {
                read = this.console.cartridge.readByte(address);
            } else if (0x4000 <= page && page <= 0x43FF) {
                read = this.busA.readByte(address);
            } else if (0x4400 <= page && page <= 0x7FFF) {
                read = this.console.cartridge.readByte(address);
            } else if (0x8000 <= page && page <= 0xFFFF) {
                read = this.console.cartridge.readByte(address);
            }
        } else if (0xC0 <= bank && bank <= 0xFF) {
            read = this.console.cartridge.readByte(address);
        } else {
            throw new Error("Invalid bus read at " + address.toValue());
        }

        if (read == null) {
            return this.mdr;
        }
        this.mdr = read;
        return read;
    }


    public writeByte(address: Address, value: number): Write {
        if (address == null || value < 0 || value > 0xFF) {
            throw new Error("Invalid readByte at " + address);
        }

        //console.log("writing " + address + " 0x" + value.toString(16));

        let write: Write = new Write(address, value, 0);

        let bank = address.getBank();
        let page = address.getPage();

        if (0x00 <= bank && bank < 0x3F) {
            if (0x0000 <= page && page <= 0x1FFF) {
                this.console.cpu.wram.writeByte(address, value);
            } else if (0x2100 <= page && page <= 0x21FF) {
                this.busB.writeByte(address, value);
            } else if (0x2200 <= page && page <= 0x3FFF) {
                this.console.cartridge.writeByte(address, value);
            } else if (0x4000 <= page && page <= 0x43FF) {
                this.busA.writeByte(address, value);
            } else if (0x4380 <= page && page <= 0x7FFF) {
                console.warn(`Writing ${address}=${value}`);
            } else if (0x8000 <= page && page <= 0xFFFF) {
                this.console.cartridge.writeByte(address, value);
            }
        } else if (0x40 <= bank && bank <= 0x7F) {
            if (0x7E <= bank && bank <= 0x7F) {
                this.console.cpu.wram.writeByte(address, value);
            } else {
                this.console.cartridge.writeByte(address, value);
            }
        } else if (0x80 <= bank && bank <= 0xBF) {
            if (0x0000 <= page && page <= 0x1FFF) {
                this.console.cpu.wram.writeByte(address, value);
            } else if (0x2100 <= page && page <= 0x21FF) {
                this.busB.writeByte(address, value);
            } else if (0x2200 <= page && page <= 0x41FF) {
                this.console.cartridge.writeByte(address, value);
            } else if (0x4200 <= page && page <= 0x43FF) {
                this.busA.writeByte(address, value);
            } else if (0x4400 <= page && page <= 0x7FFF) {
                this.console.cartridge.writeByte(address, value);
            } else if (0x8000 <= page && page <= 0xFFFF) {
                this.console.cartridge.writeByte(address, value);
            }
        } else if (0xF0 <= bank && bank <= 0xFF) {
            this.console.cartridge.writeByte(address, value);
        } else {
            throw new Error("Invalid bus read at " + address.toValue());
        }

        return null;
    }

}
