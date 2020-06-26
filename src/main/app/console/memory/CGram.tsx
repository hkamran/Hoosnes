
/**
 * Palette Ram
 */
export class CGram {

    public static size: number = 512;
    public data: number[];

    constructor() {
        this.data = new Array(CGram.size);
        this.data.fill(0, 0, CGram.size);
    }

    public reset(): void {
        this.data.fill(0);
    }

    public readByte(address: number, bank?: number): number {
        if (address == null || address < 0 || address > 512) {
            throw new Error("Invalid readByte at 0x" + address.toString(16));
        }
        return this.data[address];
    }

    public writeByte(address: number, val: number, bank?: number): void {
        if (address == null || address < 0 || address > 512) {
            throw new Error("Invalid write at 0x" + address.toString(16));
        }

        if (val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid write at 0x" + address.toString(16) + " with value " + val);
        }
        this.data[address] = val;
    }

}
