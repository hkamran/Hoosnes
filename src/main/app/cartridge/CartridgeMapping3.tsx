import {Address} from "../bus/Address";
import {Result} from "../bus/Result";
import {Write} from "../bus/Write";
import {Sram} from "../memory/Sram";
import {Cartridge, ICartridgeMapping} from "./Cartridge";

export class CartridgeMapping3 implements ICartridgeMapping {

    public ids: number[] = [0x23];
    public label: string = "SAS";

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


