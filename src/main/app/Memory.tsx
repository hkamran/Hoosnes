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

export class Memory {

    public data : number[] = new Array<number>(0xFFFFFF);
    public stack : Stack = new Stack();

    public readByte(address : number) : number {
        if (address == null || address < 0) {
            throw new Error("Invalid memory read at " + address.toString(16));
        }

        let bank : number = (address & 0xFFFFFF) >> 16;
        let location : number = (address & 0xFFFF);

        let byte : number = this.data[address];
        if (byte > 0xFF) {
            throw new Error("Invalid memory value at " + bank.toString(16) + " " + location.toString(16));
        }

        return byte;
    }

    public writeByte(address : number, value : number) : void {
        if (address == null || address < 0) {
            throw new Error("Invalid memory write at " + address.toString(16));
        }

        let bank : number = (address & 0xFFFFFF) >> 16;
        let location : number = (address & 0xFFFF);

        if (value > 0xFF || value < 0) {
            throw new Error("Invalid memory value at " + bank.toString(16) + " " + location.toString(16));
        }

        this.data[address] = value;
    }

}
