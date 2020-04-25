import {Read} from "../bus/Read";

export class Sram {

    private static readonly  MAX_SRAM_VALUE = 9;

    public value: number = 0;
    public size: number = 0;
    public data: number[] = [];

    constructor(value: number) {
        this.value = Math.min(Sram.MAX_SRAM_VALUE, value);
        this.size = this.value != 0 ? 0x400 << value : 0;
        this.data = new Array(this.size);
        this.data.fill(0, 0, this.size);
    }

    public read(index: number): number {
        if (this.size == 0) {
            return 0x70;
        }
        return this.data[index % this.data.length];
    }

    public write(index: number, value: number): void {
        if (this.size == 0) {
            return;
        }

        this.data[index % this.data.length] = value;
    }
}
