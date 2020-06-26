import {Bit} from "../../util/Bit";
import {Console} from "../Console";

export class Stack {

    public stack : number[] = [];
    private console: Console;

    constructor(console: Console) {
        this.console = console;
    }

    public reset(): void {
        this.stack = [];
    }

    public pushWord(value : number) {
        let lowByte: number = value & 0xFF;
        let highByte: number = (value >> 8) & 0xFF;

        this.pushByte(highByte);
        this.pushByte(lowByte);
    }

    public popWord(): number {
        let lowByte: number = this.popByte();
        let highByte: number = this.popByte();

        return Bit.toUint16(highByte, lowByte);
    }

    public pushByte(value : number) {
        let byte = value & 0xFF;
        let sp: number = this.console.cpu.registers.sp.get();
        this.console.bus.writeByte(sp, byte);
        this.console.cpu.registers.sp.set((sp - 1) & 0xFFFF);

        this.stack.push(byte);
    }

    public popByte() : number {
        let sp: number = (this.console.cpu.registers.sp.get() + 1) & 0xFFFF;
        let value: number = this.console.bus.readByte(sp);
        this.console.cpu.registers.sp.set(sp);

        this.stack.pop();
        return value;
    }
}
