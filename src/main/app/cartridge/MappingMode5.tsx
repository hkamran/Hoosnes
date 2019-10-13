import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";
import {Mapping} from "./Mapping";
import {Cartridge} from "./Cartridge";
import {Sram} from "../memory/Sram";

export class MappingMode5 implements Mapping {

    public ids: number[] = [0x25];
    public label: string = "EXHIROM";

    private cartridge: Cartridge;
    private sram: Sram;

    constructor(cartridge: Cartridge) {
        this.cartridge = cartridge;
    }

    public read(address: Address): Read {
        return null;
    }

    public write(address: Address, value: number): Write {
        return null;
    }

}

