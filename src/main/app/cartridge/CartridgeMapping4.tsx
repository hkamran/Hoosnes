import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";
import {Cartridge, ICartridgeMapping} from "./Cartridge";
import {Sram} from "../memory/Sram";

export class CartridgeMapping4 implements ICartridgeMapping {

    public ids: number[] = [0x24];
    public label: string = "SFX";

    private cartridge: Cartridge;
    private sram: Sram;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: Address): number {
        return null;
    }

    public write(address: Address, value: number): Write {
        return null;
    }

}

