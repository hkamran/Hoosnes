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
