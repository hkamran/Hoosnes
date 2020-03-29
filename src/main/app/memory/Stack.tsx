import {Bit} from "../util/Bit";
import {Console} from "../Console";
import {Address} from "../bus/Address";
import {Read} from "../bus/Read";

export class Stack {

    public stack : number[] = [];
    private console: Console;

    constructor(console: Console) {
        this.console = console;
    }

    public pushWord(value : number) {
        let lowByte: number = value & 0xFF;
        let highByte: number = (value >> 8) & 0xFF;

        this.pushByte(lowByte);
        this.pushByte(highByte);
    }

    public popWord(): number {
        let highByte: number = this.popByte();
        let lowByte: number = this.popByte();

        return Bit.toUint16(highByte, lowByte);
    }

    public pushByte(value : number) {
        let byte = value & 0xFF;
        this.stack.push(byte);

        let sp: number = this.console.cpu.registers.sp.get();
        this.console.bus.writeByte(Address.create(sp), byte);
        this.console.cpu.registers.sp.set((sp - 1) & 0xFFFF);
    }

    public popByte() : number {
        if (this.stack.length <= 0) {
            return 0;
        }
        let sp: number = this.console.cpu.registers.sp.get();
        let value: number = this.stack.pop();
        this.console.cpu.registers.sp.set((sp + 1) & 0xFFFF);

        return value;
    }
}
