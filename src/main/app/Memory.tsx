import {Objects} from "./util/Objects";
import {Cartridge, CartridgeMap} from "./Cartridge";
import {Cpu} from "./cpu/Cpu";
import {Ppu} from "./Ppu";
import Console from "./Console";
import {NumberUtil} from "./util/NumberUtil";
import {Logger, LoggerManager} from "typescript-logger";

export class Stack {

    public stack : number[] = [];

    public pushByte(value : number) {
        let byte = value & 0xFF;
        value = value >> 8;
        this.stack.push(byte);
    }

    public popByte() : number {
        if (this.stack.length <= 0) {
            return 0;
        }
        return this.stack.pop();
    }
}

export class WorkRam {
    // The SNES includes 128Kbytes of Work RAM, which can be accessed in several ways:

    //    The whole 128K are at 7E0000h-7FFFFFh.
    // The first 8K are also mirrored to xx0000h-xx1FFFh (xx=00h..3Fh and 80h..BFh)
    // Moreover (mainly for DMA purposes) it can be accessed via Port 218xh.

    public low: number[] = [];
    public high: number[] = [];

    public readByte(address: number, bank?: number): number {
        Objects.requireNonNull(address);
        if (address > 0xFFFF || address < 0) {
            throw new Error("Invalid read on work ram!");
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

export class Memory {

    public log : Logger = LoggerManager.create('Memory');

    public stack: Stack;
    public console: Console;
    public wram: WorkRam = new WorkRam();

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
    }

    public readByte(address: number, bank?: number): number {
        Objects.requireNonNull(address);

        if (bank == null) {
            bank = (address >> 16) & 0xFF;
        }
        let offset: number = (address & 0xFFFF);

        console.log(`Reading memory at ${bank.toString(16)}:${offset.toString(16)}!`);

        if (NumberUtil.inRange(bank, 0x00, 0x3F)) {
            if (NumberUtil.inRange(offset, 0x0000, 0x1FFF)) {
                return this.wram.readByte(offset);
            } else if (NumberUtil.inRange(offset, 0x2000, 0x20FF)) {

            } else if (NumberUtil.inRange(offset, 0x2200, 0x2FFF)) {

            } else if (NumberUtil.inRange(offset, 0x3000, 0x3FFF)) {

            } else if (NumberUtil.inRange(offset, 0x4000, 0x41FF)) {

            } else if (NumberUtil.inRange(offset, 0x4200, 0x44FF)) {

            } else if (NumberUtil.inRange(offset, 0x4500, 0x5FFF)) {

            } else if (NumberUtil.inRange(offset, 0x6000, 0x7FFF)) {

            } else if (NumberUtil.inRange(offset, 0x8000, 0xFFFF)) {
                // Hi-Rom more BANKS!
                return this.console.cartridge.readByte(offset, bank);
            }
        } else if (NumberUtil.inRange(bank, 0x40, 0x7D)) {
            return this.console.cartridge.readByte(offset, bank);
        } else if (NumberUtil.inRange(bank, 0x7E, 0x7F)) {
            return this.wram.readByte(offset, bank);
        } else if (NumberUtil.inRange(bank, 0x80, 0xBF)) {
            // Mirror 0x00 - 0x3F
            this.log.info("Mirroring to 0x00-0x3F");
            return this.readByte(offset, bank - 0x80);
        } else if (NumberUtil.inRange(bank, 0xC0, 0xFD)) {
            // Mirror 0x40 - 0x7D
            this.log.info("Mirroring to 0x40-0x7D");
            return this.readByte(offset, bank - 0x80);
        } else if (NumberUtil.inRange(bank, 0xFE, 0xFF)) {
            return this.console.cartridge.readByte(offset, bank);
        }

        throw new Error(`Invalid ${bank.toString(16)}:${offset.toString(16)}`);
    }

    public writeByte(address: number, val: number, bank?: number): void {

    }

}
