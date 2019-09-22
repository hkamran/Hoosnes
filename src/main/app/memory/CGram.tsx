
/**
 * Palette Ram
 */
export class CGram {

    public length: number = 256;
    public data: number[] = [];

    constructor() {
        for (let i = 0; i < this.length; i++) {
            let red: number =  Math.floor(Math.random() * 31);
            let green: number =  Math.floor(Math.random() * 31);
            let blue: number =  Math.floor(Math.random() * 31);

            let value: number = red << 10 | green << 5 | blue;
            this.data.push(value);
        }
    }

    public readByte(address: number, bank?: number): number {
        if (address == null || address < 0 || address > 256) {
            throw new Error("Invalid read at " + address.toString(16));
        }
        return this.data[address];
    }

    public writeByte(address: number, val: number, bank?: number): void {
        if (address == null || address < 0 || address > 256) {
            throw new Error("Invalid write at " + address.toString(16));
        }

        if (val == null || val < 0 || val > 0xFFFF) {
            throw new Error("Invalid write at " + address.toString(16) + " with value " + val);
        }
        this.data[address] = val;
    }

}
