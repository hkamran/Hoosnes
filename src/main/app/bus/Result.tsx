
export class Result {

    private values: number[] = [];
    public cycles: number = 0;

    constructor(values: number[], cycles?: number) {
        if (values == null) {
            throw new Error("Invalid result");
        }

        this.values = values;
        this.cycles = cycles | 0;
    }

    public getValue(index?: number) {
        index = index | 0;
        if (index > this.values.length) {
            throw new Error("Invalid value index " + index);
        }
        return this.values[index];
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getSize(): number {
        return this.values.length | 0;
    }

}
