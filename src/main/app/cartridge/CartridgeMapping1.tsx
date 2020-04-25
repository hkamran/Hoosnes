import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";
import {Cartridge, ICartridgeMapping} from "./Cartridge";
import {Sram} from "../memory/Sram";

export class CartridgeMapping1 implements ICartridgeMapping {

    public ids: number[] = [0x21];
    public label: string = "HIROM";

    private cartridge: Cartridge;
    private sram: Sram;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: Address): number {

        let bank = address.getBank();
        let page = address.getPage();
        const length = this.cartridge.rom.length;

        if (0xC0 <= bank && bank <= 0xFF) {
            let base: number = (bank - 0xC0) * 0xFFFF;
            let offset: number = page % 0xFFFF;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        } else if (0x40 <= bank && bank <= 0x7D) {
            let base: number = (bank - 0x40) * 0xFFFF;
            let offset: number = page % 0xFFFF;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        } else if (0x00 <= bank && bank < 0x40) {
            let base: number = (bank - 0x00) * 0xFFFF;
            let offset: number = page % 0xFFFF;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        } else if (0x80 <= bank && bank < 0xC0) {
            let base: number = (bank - 0x80) * 0xFFFF;
            let offset: number = page % 0xFFFF;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        }

        throw new Error("Invalid read at " + address.toString());
    }

    public write(address: Address, value: number): Write {
        throw new Error("Invalid write at " + address.toString());
    }
}

