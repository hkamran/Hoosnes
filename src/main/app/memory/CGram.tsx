
/**
 * Palette Ram
 */
export class CGram {

    public length: number = 256;
    public data: number[] = [];

    constructor() {
        for (let i = 0; i < this.length; i++) {
            let value: number = 0x0000;

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
