export class Sram {

    public size: number;
    public data: number[];

    constructor(size: number) {
        this.size = size;
        this.data = new Array(size);
        this.data.fill(0, 0, size);
    }

}
