import {Objects} from "./util/Objects";
import Console from "./Console";
import {NumberUtil} from "./util/NumberUtil";
import {Logger, LoggerManager} from "typescript-logger";
import {Stack} from "./memory/Stack";
import {WorkRam} from "./memory/Wram";

class NotSupported extends Error {
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
                throw new NotSupported();
            } else if (NumberUtil.inRange(offset, 0x2100, 0x21FF)) {
                // B-Bus 2100h-21FFh
                // PPU1, APU, hardware registers
                if (NumberUtil.inRange(offset, 0x2100, 0x213F)) {
                    return this.console.ppu.readByte(offset);
                } else if (NumberUtil.inRange(offset, 0x2140, 0x217F)) {
                    // APU
                } else if (NumberUtil.inRange(offset, 0x2180, 0x2183)) {
                    // WRAM
                } else {
                    throw new NotSupported(offset);
                }
            } else if (NumberUtil.inRange(offset, 0x2200, 0x2FFF)) {
                throw new NotSupported();
            } else if (NumberUtil.inRange(offset, 0x3000, 0x3FFF)) {
                // DSP, SuperFX, hardware registers
            } else if (NumberUtil.inRange(offset, 0x4000, 0x40FF)) {
                // Old Style Joypad Registers
                if (NumberUtil.inRange(offset, 0x4000, 0x4015)) {
                    throw new NotSupported(offset);
                } else if (NumberUtil.inRange(offset, 0x4016, 0x4016)) {
                    // Joy 2
                } else if (NumberUtil.inRange(offset, 0x4017, 0x4017)) {
                    // Joy 1
                } else {
                    throw new NotSupported(offset);
                }
            } else if (NumberUtil.inRange(offset, 0x4100, 0x41FF)) {
                throw new NotSupported();
            } else if (NumberUtil.inRange(offset, 0x4200, 0x44FF)) {
                // DMA, PPU2, hardware registers
            } else if (NumberUtil.inRange(offset, 0x4500, 0x5FFF)) {
                throw new NotSupported();
            } else if (NumberUtil.inRange(offset, 0x6000, 0x7FFF)) {
                throw new NotSupported();
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