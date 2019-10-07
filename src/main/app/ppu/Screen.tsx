
export class ScanlineState {

    public static HORT_PRELINE: ScanlineState = new ScanlineState(0, 21);
    public static HORT_RENDERLINE: ScanlineState = new ScanlineState(22, 277);
    public static HORT_BLANK: ScanlineState = new ScanlineState(278, 339);

    public static VERT_PRELINE: ScanlineState = new ScanlineState(0, 0);
    public static VERT_RENDERLINE: ScanlineState = new ScanlineState(1, 224);
    public static VERT_BLANK: ScanlineState = new ScanlineState(225, 261);

    public start: number;
    public end: number;

    private constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    public isInRange(val: number): boolean {
        if (val < this.start || val > this.end) {
            return false;
        }
        return true;
    }
}

export class Screen {
    public static WIDTH: number = 256;
    public static HEIGHT: number = 224;

}
