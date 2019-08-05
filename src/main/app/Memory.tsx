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

export class Bank {

    public memory : number[] = new Array<number>(0xFFFF);

    public readBytes(address : number, size : number) {
        if (address > 0xFFFF || address < 0) {
            throw Error("Invalid memory address read!");
        }

        let result = 0;
        for (let i = size - 1; i >= 0; i--) {
            let byte = this.memory[address + i];
            result = result << 8;
            result |= byte;
        }

        return result;
    }

    public writeBytes(address : number, value : number, size : number) {
        if (address > 0xFFFF || address < 0) {
            throw Error("Invalid memory address write!");
        }

        for (let i = 0; i < size; i++) {
            let byte = value & 0xFF;
            this.memory[address + i] = byte;
            value = value >> 8;
        }
    }

}

export class Memory {

    public banks : Bank[] = new Array<Bank>(0xFF);
    public stack : Stack = new Stack();

    constructor() {
        for (let i = 0; i < 0xFF; i++) {
            this.banks[i] = new Bank();
        }
    }

    public readBytes(bank : number, address : number, size : number) : number {
        if (bank > 0xFF || bank < 0x0) {
            throw Error("Invalid bank address!");
        }

        let memory : Bank = this.banks[bank];

        if (memory == null) {
            throw Error("No bank found at 0x" + bank.toString(16));
        }

        let result = memory.readBytes(address, size);
        if (result == null || result < 0x0) {
            throw Error("Invalid Read");
        }

        return result;
    }

    public writeBytes(bank : number, address : number, value : number, size : number) : void {
        if (bank > 0xFF || bank < 0x0) {
            throw Error("Invalid bank address!");
        }

        let memory : Bank = this.banks[bank];

        if (memory == null) {
            throw Error("No bank found at 0x" + bank.toString(16));
        }

        memory.writeBytes(address, value, size);
    }


    public writeByte(opaddr: number, val: number) : void {

    }
}
