import {HardwareMemory, Memory, SaveRam, WorkMemory} from "./Memory";
import {Objects} from "../util/Objects";
import {Cartridge} from "../Cartridge";

let InvalidWrite = function (bank: number, offset: number, byte: number) {
    throw new Error(`Invalid write ${bank.toString(16)}:${offset.toString(16)}=${byte.toString(16)}`);
};

let InvalidRead = function (bank: number, offset: number) {
    throw new Error(`Invalid read ${bank.toString(16)}:${offset.toString(16)}`);
};

export class LoRomMemory extends Memory {

    public wram : WorkMemory = new WorkMemory();
    public hardware : HardwareMemory = new HardwareMemory();
    public rom : Cartridge;
    public sram : SaveRam;

    constructor(rom : Cartridge) {
        super();
        this.rom = rom;
    }


    public readByte(bank: number, offset: number) : number {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        if (offset < 0 || offset > 0xFFFF || bank < 0 || bank > 0xFF) {
            InvalidRead(bank, offset);
        }

        if (0x00 <= bank && bank <= 0x3f) {
            if (offset < 0x2000) {
                return this.wram.readByte(bank, offset);
            } else if (0x2000 <= offset && offset < 0x6000) {
                return this.hardware.readByte(bank, offset);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                return this.rom.readByte(bank, offset);
            }
        } else if (0x40 <= bank && bank <= 0x6F) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                // mirror of 0x8000 - 0xFFFF
                return this.rom.readByte(bank, offset);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                // Lorom
                return this.rom.readByte(bank, offset);
            }
        } else if (0x70 <= bank && bank <= 0x7D) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                return this.sram.readByte(bank, offset);
            } else {
                return this.rom.readByte(bank, offset);
            }
        } else if (0x7E == bank) {
            return this.wram.readByte(bank, offset);
        } else if (0x7F == bank) {
            return this.wram.readByte(bank, offset);
        } else if (0x7F <= bank && bank < 0x80) {
            return this.wram.readByte(bank, offset);
        } else if (0x80 <= bank && bank <= 0xBF) {
            //Mirror of $00–$3F
            return this.readByte(bank - 0x80, offset);
        } else if (0xC0 <= bank && bank <= 0xEF) {
            //Mirror of $40–$6F
            return this.readByte(bank - 0x80, offset);
        } else if (0xF0 <= bank && bank <= 0xFD) {
            //Mirror of $70–$7D
            return this.readByte(bank - 0x80, offset);
        } else if (0xFE <= bank && bank <= 0xFF) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                return this.sram.readByte(bank, offset);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                return this.rom.readByte(bank, offset);
            }
        }

        InvalidRead(bank, offset);
    }

    public writeByte(bank: number, offset: number, byte: number): void {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        if (offset < 0 || offset > 0xFFFF || bank < 0 || bank > 0xFF || byte < 0 || byte > 0xFF) {
            InvalidWrite(bank, offset, bank);
        }

        if (0x00 <= bank && bank <= 0x3f) {
            if (offset < 0x2000) {
                this.wram.writeByte(bank, offset, byte);
            } else if (0x2000 <= offset && offset < 0x6000) {
                this.hardware.writeByte(bank, offset, byte);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                InvalidWrite(bank, offset, bank);
            }
        } else if (0x40 <= bank && bank <= 0x6F) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                InvalidWrite(bank, offset, bank);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                InvalidWrite(bank, offset, bank);
            }
        } else if (0x70 <= bank && bank <= 0x7D) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                this.sram.writeByte(bank, offset, byte);
            } else {
                InvalidWrite(bank, offset, bank);
            }
        } else if (0x7E == bank) {
            this.wram.writeByte(bank, offset, byte);
        } else if (0x7F == bank) {
            this.wram.writeByte(bank, offset, byte);
        } else if (0x7F <= bank && bank < 0x80) {
            this.wram.writeByte(bank, offset, byte);
        } else if (0x80 <= bank && bank <= 0xBF) {
            //Mirror of $00–$3F
            this.writeByte(bank - 0x80, offset, byte);
        } else if (0xC0 <= bank && bank <= 0xEF) {
            //Mirror of $40–$6F
            this.writeByte(bank - 0x80, offset, byte);
        } else if (0xF0 <= bank && bank <= 0xFD) {
            //Mirror of $70–$7D
            this.writeByte(bank - 0x80, offset, byte);
        } else if (0xFE <= bank && bank <= 0xFF) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                this.sram.writeByte(bank, offset, byte);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                InvalidWrite(bank, offset, bank);
            }
        }
        InvalidWrite(bank, offset, bank);
    }

}