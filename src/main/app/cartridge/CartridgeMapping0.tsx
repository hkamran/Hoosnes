import {Address} from "../bus/Address";
import {Write} from "../bus/Write";
import {Cartridge, ICartridgeMapping} from "./Cartridge";
import {Sram} from "../memory/Sram";
import {Read} from "../bus/Read";
import {Bit} from "../util/Bit";

export class CartridgeMapping0 implements ICartridgeMapping {

    public ids: number[] = [0x20];
    public label: string = "LOROM";

    private cartridge: Cartridge;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: Address): number {
        let bank = address.getBank();
        let page = address.getPage();

        if (0x0000 <= page && page <= 0x7FFF) {
            if (0x40 <= bank && bank <= 0x6F) {
                let index = ((bank - 0x00) * 0x8000) + (page - 0x0000);
                let value = this.cartridge.rom[index];

                return value;
            } else if (0xC0 <= bank && bank <= 0xEF) {
                let index = ((bank - 0x80) * 0x8000) + (page - 0x0000);
                let value = this.cartridge.rom[index];

                return value;
            } else if (0x70 <= bank && bank <= 0x7F) {
                let index =(bank - 0x70) + page;

                return this.cartridge.sram.read(index);
            } else if (0xF0 <= bank && bank <= 0xFF) {
                let index = (bank - 0xF0) + page;

                return this.cartridge.sram.read(index);
            }
        } else if (0x8000 <= page && page <= 0xFFFF) {
            if (0x80 <= bank && bank <= 0xFF) {
                let index = ((bank - 0x80) * 0x8000) + (page - 0x8000);
                let value = this.cartridge.rom[index];

                return value;
            } else if (0x00 <= bank && bank <= 0x7F) {
                let index = ((bank - 0x00) * 0x8000) + (page - 0x8000);
                let value = this.cartridge.rom[index];

                return value;
            }
        }

        throw new Error(`Invalid read at ${address.toString}`);
    }

    public write(address: Address, value: number): Write {
        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write at ${address.toString} ${value}`);
        }

        let bank = address.getBank();
        let page = address.getPage();

        if (0x70 <= bank && bank <= 0x7D) {
            let index =(bank - 0x70) + page;

            this.cartridge.sram.write(index, value);
            return new Write(address, 0, 0);
        } else if (0xFE <= bank && bank <= 0xFF) {
            let index = (bank - 0xF0) + page;

            this.cartridge.sram.write(index, value);
            return new Write(address, 0, 0);
        }

        console.warn(`Invalid write at ${address.toString()} ${value}`);
    }

}
