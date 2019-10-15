import {Address} from "../bus/Address";
import {Result} from "../bus/Result";
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

    public read(address: Address): Result {
        return null;
    }

    public write(address: Address, value: number): Write {
        return null;
    }
}

