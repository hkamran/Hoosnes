import {Ppu} from "./Ppu";

export class ScreenStates {

    public static HORT_PRELINE: ScreenStates = new ScreenStates(0, 21);
    public static HORT_RENDERLINE: ScreenStates = new ScreenStates(22, 277);
    public static HORT_BLANK: ScreenStates = new ScreenStates(278, 339);

    public static VERT_PRELINE: ScreenStates = new ScreenStates(0, 1);
    public static VERT_RENDERLINE: ScreenStates = new ScreenStates(2, 224);
    public static VERT_BLANK: ScreenStates = new ScreenStates(225, 261);

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

    public ppu: Ppu;

    constructor(ppu: Ppu) {
        this.ppu = ppu;
    }

    public tick(): void {

    }

}
