import {Cartridge, ICartridgeMapping} from "./Cartridge";
import {Sram} from "../memory/Sram";
import {AddressUtil} from "../../util/AddressUtil";

export class CartridgeMapping1 implements ICartridgeMapping {

    public ids: number[] = [0x21];
    public label: string = "HIROM";

    private cartridge: Cartridge;
    private sram: Sram;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        const length = this.cartridge.rom.length;

        if (0xC0 <= bank && bank <= 0xFF) {
            let base: number = (bank - 0xC0) * 0x10000;
            let offset: number = page % 0x10000;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        } else if (0x80 <= bank && bank <= 0xBF) {
            let base: number = (bank - 0x80) * 0x10000;
            let offset: number = page % 0x10000;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        } else if (0x40 <= bank && bank <= 0x7D) {
            let base: number = (bank - 0x40) * 0x10000;
            let offset: number = page % 0x10000;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        } else if (0x00 <= bank && bank <= 0x3F) {
            let base: number = (bank % 0x3F) * 0x10000;
            let offset: number = page % 0x10000;

            let index = (base + offset) % length;
            let value = this.cartridge.rom[index];
            return value;
        }

        throw new Error("Invalid read at " + address.toString());
    }

    public write(address: number, value: number): void {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        throw new Error("Invalid write at " + address.toString());
    }
}

