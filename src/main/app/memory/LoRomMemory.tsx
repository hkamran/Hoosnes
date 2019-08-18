import {Memory} from "./Memory";
import {Objects} from "../util/Objects";

export class LoRomMemory extends Memory {

    public read(bank: number, offset: number) : number {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        if (0x00 <= bank && bank <= 0x3f) {
            if (offset < 0x2000) {
                //WRAM
            } else if (0x2000 <= offset && offset < 0x6000) {
                //Hardware Reg
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                //Rom
            } else {
                //error
            }
        } else if (0x40 <= bank && bank <= 0x6F) {
            if (0x0000 <= offset && offset <= 0x7FFF) {

            } else if (0x8000 <= offset && offset <= 0xFFFF) {

            } else {
                // error
            }
        } else if (0x70 <= bank && bank <= 0x7D) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                //SRAM
            } else {
                //lowRom
            }
        } else if (0x7E <= bank && bank < 0x7F) {
            if (0x0000 <= offset && offset <= 0x1FFF) {
                //lowram (wram)
            } else if (0x2000 <= offset && offset <= 0x7FFF) {
                //lowram (wram);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                //Extended RAM (WRAM)
            } else {
                // error
            }
        } else if (0x7F <= bank && bank < 0x80) {
            if (0x0000 <= offset && offset <= 0xFFFF) {
                //Extended RAM (WRAM)
            } else {
                // error
            }
        } else if (0x80 <= bank && bank <= 0xBF) {
            //Mirror of $00–$3F
        } else if (0xC0 <= bank && bank <= 0xEF) {
            //Mirror of $40–$6F
        } else if (0xF0 <= bank && bank <= 0xFD) {
            //Mirror of $70–$7D
        } else if (0xFE <= bank && bank <= 0xFF) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                //Cartridge SRAM - 64 Kilobytes (512 KB total)
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                //lowram (wram);
            } else {
                //LoROM section (program memory)
            }
        }

        return 0;
    }

    public write(bank: number, offset: number, byte: number): void {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        if (0x00 <= bank && bank <= 0x3f) {
            if (offset < 0x2000) {
                //WRAM
            } else if (0x2000 <= offset && offset < 0x6000) {
                //Hardware Reg
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                //Rom
            } else {
                //error
            }
        } else if (0x40 <= bank && bank <= 0x6F) {
            if (0x0000 <= offset && offset <= 0x7FFF) {

            } else if (0x8000 <= offset && offset <= 0xFFFF) {

            } else {
                // error
            }
        } else if (0x70 <= bank && bank <= 0x7D) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                //SRAM
            } else {
                //lowRom
            }
        } else if (0x7E <= bank && bank < 0x7F) {
            if (0x0000 <= offset && offset <= 0x1FFF) {
                //lowram (wram)
            } else if (0x2000 <= offset && offset <= 0x7FFF) {
                //lowram (wram);
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                //Extended RAM (WRAM)
            } else {
                // error
            }
        } else if (0x7F <= bank && bank < 0x80) {
            if (0x0000 <= offset && offset <= 0xFFFF) {
                //Extended RAM (WRAM)
            } else {
                // error
            }
        } else if (0x80 <= bank && bank <= 0xBF) {
            //Mirror of $00–$3F
        } else if (0xC0 <= bank && bank <= 0xEF) {
            //Mirror of $40–$6F
        } else if (0xF0 <= bank && bank <= 0xFD) {
            //Mirror of $70–$7D
        } else if (0xFE <= bank && bank <= 0xFF) {
            if (0x0000 <= offset && offset <= 0x7FFF) {
                //Cartridge SRAM - 64 Kilobytes (512 KB total)
            } else if (0x8000 <= offset && offset <= 0xFFFF) {
                //lowram (wram);
            } else {
                //LoROM section (program memory)
            }
        }
    }

}