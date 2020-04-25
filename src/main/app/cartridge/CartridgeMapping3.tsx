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

    public read(address: number): number {
        return null;
    }

    public write(address: number, value: number): void {
    }

}


