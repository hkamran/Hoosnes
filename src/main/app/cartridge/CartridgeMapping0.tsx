import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";
import {Cartridge, ICartridgeMapping} from "./Cartridge";
import {NotSupported} from "../bus/Bus";
import {Sram} from "../memory/Sram";

export class CartridgeMapping0 implements ICartridgeMapping {

    public ids: number[] = [0x20];
    public label: string = "LOROM";

    private cartridge: Cartridge;
    private sram: Sram;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: Address): Read {
        if (0x0000 <= address.addr && address.addr <= 0x7FFF) {
            if (0x40 <= address.bank && address.bank <= 0x6F) {
                let index = ((address.bank - 0x00) * 0xFFFF) + address.addr;
                let value = this.cartridge.rom[index];

                return new Read(value, 0);
            } else if (0xC0 <= address.bank && address.bank <= 0xEF) {
                let index = ((address.bank - 0x80) * 0xFFFF) + address.addr;
                let value = this.cartridge.rom[index];

                return new Read(value, 0);
            } else if (0x70 <= address.bank && address.bank <= 0x7F) {
                let index = ((address.bank - 0x70) * 0xFFFF) + address.addr;
                let value = this.sram.data[index];

                return new Read(value, 0);
            } else if (0xF0 <= address.bank && address.bank <= 0xFF) {
                let index = (((address.bank - 0xF0) % 0xD) * 0xFFFF) + address.addr;
                let value = this.sram.data[index];

                return new Read(value, 0);
            }
        } else if (0x8000 <= address.addr && address.addr <= 0xFFFF) {
            if (0x80 <= address.bank && address.bank <= 0xFF) {
                let index = ((address.bank - 0x80) * 0xFFFF) + address.addr;
                let value = this.cartridge.rom[index];
            } else if (0x00 <= address.bank && address.bank <= 0x7F) {
                let index = ((address.bank - 0x80) * 0xFFFF) + address.addr;
                let value = this.cartridge.rom[index];
            }
        }
        throw new NotSupported();
    }

    public write(address: Address, value: number): Write {
        return null;
    }

}
