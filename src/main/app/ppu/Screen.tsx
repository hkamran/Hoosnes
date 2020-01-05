import {Ppu} from "./Ppu";
import {Color} from "./Palette";

export class ScreenRegion {

    public static HORT_PRELINE: ScreenRegion = new ScreenRegion(0, 21);
    public static HORT_RENDERLINE: ScreenRegion = new ScreenRegion(22, 277);
    public static HORT_BLANK: ScreenRegion = new ScreenRegion(278, 339);

    public static VERT_PRELINE: ScreenRegion = new ScreenRegion(0, 1);
    public static VERT_RENDERLINE: ScreenRegion = new ScreenRegion(2, 224);
    public static VERT_BLANK: ScreenRegion = new ScreenRegion(225, 261);

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

export enum ScreenState {
    HBLANK, VBLANK, PRELINE, RENDER,
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
    public state: ScreenState;

    public static readonly WIDTH: number = 256;
    public static readonly HEIGHT: number = 224;

    // Note PAL is 256x240

    public buffer: ImageData;

    public setContext(context: CanvasRenderingContext2D): void {
        this.context = context;
        this.buffer = this.context.createImageData(Screen.WIDTH, Screen.HEIGHT);
    }

    public setPixel(x: number, y: number, color: Color) {
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
