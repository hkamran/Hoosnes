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

    public readByte(address: number): number {
        Objects.requireNonNull(address);

        if (address < 0) {
            throw new Error("Invalid address read " + address.toString(16));
        }
        let bank = (address >> 16) & 0xFF;
        let offset = address & 0xFFFF;

        return this.read(bank, offset);
    }

    public writeByte(address: number, byte: number): void {
        Objects.requireNonNull(address);
        Objects.requireNonNull(byte);

        if (address < 0 || address > 0xFFFFFF || byte > 0xFF) {
            throw new Error("Invalid address read " + address.toString(16));
        }
        let bank = (address >> 16) & 0xFF;
        let offset = address & 0xFFFF;

        this.write(bank, offset, byte);
    }

    public abstract read(bank: number, offset: number): number;

    public abstract write(bank: number, offset: number, byte: number): void;
}

