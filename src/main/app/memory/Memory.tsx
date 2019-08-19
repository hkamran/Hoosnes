import {Objects} from "../util/Objects";
import {CartridgeLayout} from "../Cartridge";

export class Stack {

    public stack : number[] = [];

    public pushByte(value : number) {
        let byte = value & 0xFF;
        value = value >> 8;
        this.stack.push(byte);
    }

    public popByte() : number {
        if (this.stack.length <= 0) {
            return 0;
        }
        return this.stack.pop();
    }
}


export abstract class Memory {

    public abstract readByte(bank: number, offset: number): number;

    public abstract writeByte(bank: number, offset: number, byte: number): void;
}

export class WorkMemory extends Memory {

    public ram = new Array(0x1FFFFF);

    readByte(bank: number, offset: number): number {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        let address : number = bank << 8 || offset;
        if (address < 0 || address > 0x1FFFFF) {
            throw new Error("Invalid wram read " + address.toString(16));
        }

        return this.ram[address];
    }

    writeByte(bank: number, offset: number, byte: number): void {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        let address : number = bank << 8 || offset;
        if (address < 0 || address > 0x1FFFFF || bank < 0 || bank > 0xFF) {
            throw new Error("Invalid wram write " + address.toString(16) + " " + byte.toString(16));
        }

        this.ram[address] = byte;
    }
}

export class SaveRam extends Memory {

    public ram : number[] = new Array(0x40000);

    constructor(rom : number[]) {
        super();
    }

    readByte(bank: number, offset: number): number {
        return 0;
    }

    writeByte(bank: number, offset: number, byte: number): void {
    }
}

export class HardwareMemory extends Memory {

    readByte(bank: number, offset: number): number {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

        return 0;
    }

    writeByte(bank: number, offset: number, byte: number): void {
        Objects.requireNonNull(bank);
        Objects.requireNonNull(offset);

    }
}



