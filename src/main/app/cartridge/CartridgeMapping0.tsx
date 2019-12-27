import {Address} from "../bus/Address";
import {Write} from "../bus/Write";
import {Cartridge, ICartridgeMapping} from "./Cartridge";
import {NotSupported} from "../bus/Bus";
import {Sram} from "../memory/Sram";
import {Read} from "../bus/Read";

export class CartridgeMapping0 implements ICartridgeMapping {

    public ids: number[] = [0x20];
    public label: string = "LOROM";

    private cartridge: Cartridge;
    private sram: Sram;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: Address): Read {

        let bank = address.getBank();
        let page = address.getPage();

        if (0x0000 <= page && page <= 0x7FFF) {
            if (0x40 <= bank && bank <= 0x6F) {
                let index = ((bank - 0x00) * 0xFFFF) + page;
                let value = this.cartridge.rom[index];

                return Read.byte(value, 0);
            } else if (0xC0 <= bank && bank <= 0xEF) {
                let index = ((bank - 0x80) * 0xFFFF) + page;
                let value = this.cartridge.rom[index];

                return Read.byte(value, 0);
            } else if (0x70 <= bank && bank <= 0x7F) {
                let index = ((bank - 0x70) * 0xFFFF) + page;
                let value = this.sram.data[index];

                return Read.byte(value, 0);
            } else if (0xF0 <= bank && bank <= 0xFF) {
                let index = (((bank - 0xF0) % 0xD) * 0xFFFF) + page;
                let value = this.sram.data[index];

                return Read.byte(value, 0);
            }
        } else if (0x8000 <= page && page <= 0xFFFF) {
            if (0x80 <= bank && bank <= 0xFF) {
                let index = ((bank - 0x80) * 0x8000) + (page - 0x8000);
                let value = this.cartridge.rom[index];

                return Read.byte(value, 0);
            } else if (0x00 <= bank && bank <= 0x7F) {
                let index = ((bank - 0x00) * 0x8000) + (page - 0x8000);
                let value = this.cartridge.rom[index];
                return Read.byte(value, 0);
            }
        }
        throw new Error("Invalid read at " + address.toString());
    }

    public write(address: Address, value: number): Write {
        throw new Error("Invalid write at " + address.toString());
    }

}
