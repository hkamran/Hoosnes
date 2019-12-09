import {Ppu} from "./Ppu";
import {Color} from "./Palette";

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
        return !(val < this.start || val > this.end);
    }
}

/**
 * R = 255 / 8 = 31
 * G = 255 / 8 = 31
 * B = 255 / 8 = 31
 * ================
 * Color = 31 x 1024 + 31 x 32 + 31 = 32767 (0x7FFF)
 */
export class Screen {

    public context: CanvasRenderingContext2D;

    public static readonly WIDTH: number = 256;
    public static readonly HEIGHT: number = 224;

    // Note PAL is 256x240

    public buffer: ImageData;

    public setContext(context: CanvasRenderingContext2D): void {
        this.context = context;
        this.buffer = this.context.createImageData(Screen.WIDTH, Screen.HEIGHT);
    }

    public setColor(x: number, y: number, color: Color) {
        if (color == null) {
            throw Error("Invalid coloring");
        }

        let index: number = (x + y * this.buffer.width) * 4;

        this.buffer.data[index+0] = color.red;
        this.buffer.data[index+1] = color.green;
        this.buffer.data[index+2] = color.blue;
        this.buffer.data[index+3] = color.opacity;
    }

    public render(): void {
        this.context.putImageData(this.buffer, 0, 0);
        this.buffer = this.context.createImageData(Screen.WIDTH, Screen.HEIGHT);
    }

}
