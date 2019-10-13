import {Objects} from "../util/Objects";
import Console from "../Console";
import {NumberUtil} from "../util/NumberUtil";
import {Logger, LoggerManager} from "typescript-logger";
import {Stack} from "../memory/Stack";
import {WorkRam} from "../memory/Wram";
import {Address} from "./Address";
import {Read} from "./Read";
import {Write} from "./Write";

export class NotSupported extends Error {
    constructor(message? : any) {
        super(`Not supported! ${message}`);
        this.name = 'NotSupported';
    }
}


export class Bus {

    public log : Logger = LoggerManager.create('Bus');

    public stack: Stack;
    public console: Console;
    public wram: WorkRam = new WorkRam();
    public mdr: Read = null;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
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

        let read: Read = null;

        if (0x00 <= address.bank && address.bank < 0x3F) {
            if (0x0000 <= address.addr && address.addr <= 0x1FFF) {
                // mirror wram
                // readByte.cycles = 6;
            } else if (0x2100 <= address.addr && address.addr <= 0x21FF) {
                // ppu registers
            } else if (0x2200 <= address.addr && address.addr <= 0x41FF) {
                read = this.console.cartridge.readByte(address);
                // readByte.cycles = 12;
            } else if (0x4200 <= address.addr && address.addr <= 0x43FF) {
                // ppu registers
            } else if (0x4400 <= address.addr && address.addr <= 0x7FFF) {
                read = this.console.cartridge.readByte(address);
                // aux
            } else if (0x8000 <= address.addr && address.addr <= 0xFFFF) {
                read = this.console.cartridge.readByte(address);
                read.cycles = 6;
            }
        } else if (0x40 <= address.bank && address.bank <= 0x7F) {
            if (0x7E <= address.bank && address.bank >= 0x7F) {
                // wram
                // readByte.cycles = 6;
            } else {
                read = this.console.cartridge.readByte(address);
                read.cycles = 6;
            }
        } else if (0x80 <= address.bank && address.bank <= 0xBF) {
            if (0x0000 <= address.addr && address.addr <= 0x1FFF) {
                // mirror wram
                // readByte.cycles = 6;
            } else if (0x2100 <= address.addr && address.addr <= 0x21FF) {
                // ppu registers
            } else if (0x2200 <= address.addr && address.addr <= 0x41FF) {
                // aux
                read = this.console.cartridge.readByte(address);
                // readByte.cycles = 12;
            } else if (0x4200 <= address.addr && address.addr <= 0x43FF) {
                // ppu registers
            } else if (0x4400 <= address.addr && address.addr <= 0x7FFF) {
                read = this.console.cartridge.readByte(address);
                read.cycles = 6;
            } else if (0x8000 <= address.addr && address.addr <= 0xFFFF) {
                read = this.console.cartridge.readByte(address);
                read.cycles = 7;
            }
        } else if (0xC0 <= address.bank && address.bank <= 0xFF) {
            read = this.console.cartridge.readByte(address);
        }

        if (read == null) {
            return this.mdr;
        }
        this.mdr = read;
        return read;
    }


    public writeByte(address: Address, val: number): Write {
        return null;
    }

}
