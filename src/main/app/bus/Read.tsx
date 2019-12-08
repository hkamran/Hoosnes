import {Bit} from "../util/Bit";

export enum ReadType {
    BYTE, WORD,
}

export class Read {

    private readonly low: number;
    private readonly high: number;
    private readonly type: ReadType;
    public readonly cycles: number = 0;

    private constructor(low: number, high: number, type: ReadType, cycles?: number) {
        this.low = low;
        this.high = high;
        this.cycles = cycles | 0;
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getType(): ReadType {
        return this.type;
    }

    public get() : number {
        return Bit.toUint16(this.high, this.low);
    }

    public getLow(): number {
        return this.low;
    }

    public getHigh(): number {
        return this.high;
    }

    public static byte(low: number, cycles?: number) {
        if (low == null || low > 0xFF)
            throw new Error("Invalid read creation " + low.toString(16));
        return new Read(low, 0, ReadType.BYTE, cycles);
    }

    public static word(low: number, high: number, cycles?: number) {
        if (low == null || low > 0xFF || low < 0 || high == null || high > 0xFF || high < 0)
            throw new Error("Invalid read creation " + low.toString(16));
        return new Read(low, high, ReadType.WORD, cycles);
    }

}
