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

    public static readonly MAX_ZOOM: number = 4;
    public static readonly MIN_ZOOM: number = 1;
    // Note PAL is 256x240

    public buffer: ImageData;
    public scaled: ImageData;
    public sub: Uint8ClampedArray;
    public zoom: number = 2;

    public canvas: HTMLCanvasElement;

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.reset();
    }

    public setPixel(x: number, y: number, color: Color) {
        if (color == null) {
            throw Error("Invalid coloring");
        }
        if (this.buffer.width == null) {
            throw new Error("Empty buffer given!");
        }

        let index: number = (x + y * this.buffer.width) * 4;

        this.buffer.data[index+0] = color.red;
        this.buffer.data[index+1] = color.green;
        this.buffer.data[index+2] = color.blue;
        this.buffer.data[index+3] = color.opacity;
    }

    public render(): void {
        this.context.putImageData(this.scale(this.buffer, this.scaled, this.zoom), 0, 0);
    }

    public zoomIn(): void {
        this.zoom = Math.min(Screen.MAX_ZOOM, this.zoom + 1);
        this.reset();
    }

    public zoomOut(): void {
        this.zoom = Math.max(Screen.MIN_ZOOM, this.zoom - 1);
        this.reset();
    }

    public reset(): void {
        if (!this.canvas) return;
        this.context = this.canvas.getContext('2d', {alpha: false});

        this.canvas.width = this.getWidth();
        this.canvas.height = this.getHeight();
        this.buffer = this.context.createImageData(Screen.WIDTH, Screen.HEIGHT);
        this.scaled = this.context.createImageData(this.getWidth(), this.getHeight());
        this.sub = this.context.createImageData(this.zoom, 1).data;
    }

    public getWidth(): number {
        return Screen.WIDTH * this.zoom;
    }

    public getHeight(): number {
        return Screen.HEIGHT * this.zoom;
    }

    private scale(imageData: ImageData, scaledImageData: ImageData, scale: number): ImageData {
        if (scale == 1) return imageData;

        for (let row = 0; row < imageData.height; row++) {
            for (let col = 0; col < imageData.width; col++) {
                let sourcePixel = imageData.data.subarray(
                    (row * imageData.width + col) * 4,
                    (row * imageData.width + col) * 4 + 4,
                );
                for (let x = 0; x < scale; x++) this.sub.set(sourcePixel, x*4);
                for (let y = 0; y < scale; y++) {
                    let destRow = row * scale + y;
                    let destCol = col * scale;
                    scaledImageData.data.set(this.sub, (destRow * scaledImageData.width + destCol) * 4);
                }
            }
        }

        return scaledImageData;
    }
}

