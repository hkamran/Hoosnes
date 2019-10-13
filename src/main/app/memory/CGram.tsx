
/**
 * Palette Ram
 */
export class CGram {

    public static size: number = 512;
    public data: number[];

    constructor() {
        this.data = new Array(CGram.size);
        this.data.fill(0, 0, CGram.size);
        this.initialize();
    }

    private initialize() {
        let colors: number = 256;

        let index = 0;
        for (let i = 0; i < colors; i++) {
            let red: number =  Math.floor(Math.random() * 31);
            let green: number =  Math.floor(Math.random() * 31);
            let blue: number =  Math.floor(Math.random() * 31);

            let value: number = 0 << 15 | red << 10 | green << 5 | blue;

            let lowHalf = (value >> 0) & 0xFF;
            let highHalf = (value >> 8) & 0xFF;

            this.writeByte(index + 0, lowHalf);
            this.writeByte(index + 1, highHalf);
            index += 2;
        }
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
