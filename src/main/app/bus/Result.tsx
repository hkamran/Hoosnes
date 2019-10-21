
export class Result {

    private values: number[] = [];
    cycles: number = 0;

    constructor(values: number[], cycles?: number) {
        if (values == null) {
            throw new Error("Invalid result");
        }

        this.values = values;
        this.cycles = cycles | 0;
    }

    public getValue(index?: number) {
        return this.values[index | 0];
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getSize(): number {
        return this.values.length | 0;
    }

}
