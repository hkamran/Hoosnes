import {Bit} from "../util/Bit";

export class Stack {

    public stack : number[] = [];

    public pushWord(value : number) {
        let lowByte: number = value & 0xFF;
        let highByte: number = value >> 8;

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
    }

    public popByte() : number {
        if (this.stack.length <= 0) {
            return 0;
        }
        return this.stack.pop();
    }
}
