import {Ppu} from "./Ppu";
import {IColor} from "./Palette";
import {WebGlUtil} from "../../util/WebGlUtil";
import vsGLSL from "../../../shaders/screen_vertex_shader.glsl";
import fsGLSL from "../../../shaders/screen_fragment_shader.glsl";

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

export interface IUniforms {
    mosaic: WebGLUniformLocation;
    brightness: WebGLUniformLocation;
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

    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private frame: WebGLTexture;

    public buffer: ImageData;
    public zoom: number = 2;

    public uniforms : IUniforms = {
        mosaic: null,
        brightness: null,
    };

    private mosaic: number = 0;
    private brightness: number = 1; // 0-1

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.initialize(canvas);
        this.reset();
    }

    public setMosaic(level: number) {
        this.mosaic = level;
    }

    private initialize(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext("webgl");
        if (this.gl == null) {
            throw new Error("WebGL not working!");
        }

        let gl = this.gl;
        let program = WebGlUtil.createProgram(gl, vsGLSL, fsGLSL);
        this.program = program;

        // clip space coords
        const vertexCoordinates = new Float32Array([
            -1, 1,
            1, 1,
            1, -1,
            -1, 1,
            1, -1,
            -1, -1,
        ]);

        // uv coords
        const textureCoordinates = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]);
        WebGlUtil.createAttribLocation(
            gl,
            program,
            vertexCoordinates,
            "a_position",
            gl.STATIC_DRAW,
        );
        WebGlUtil.createAttribLocation(
            gl,
            program,
            textureCoordinates,
            "a_texCoord",
            gl.STATIC_DRAW,
        );
        this.frame = WebGlUtil.createTexture(gl, gl.TEXTURE0);

        let textureId = gl.getUniformLocation(program, `u_image`);
        gl.uniform1i(textureId, 0);

        this.uniforms.mosaic = gl.getUniformLocation(program, `u_mosaic`);
        this.uniforms.brightness = gl.getUniformLocation(program, `u_brightness`);

        WebGlUtil.clear(gl, canvas);
    }

    public setPixel(x: number, y: number, color: IColor) {
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
        let gl = this.gl;

        gl.uniform1f(this.uniforms.brightness, this.brightness);
        gl.uniform1f(this.uniforms.mosaic, this.mosaic);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        WebGlUtil.updateTexture(gl, this.frame, this.buffer);

        const itemSize = 2;
        const numItems = 6; //vertexCoordinates.length / itemSize;

        let offset = 0;
        let count = numItems;
        gl.drawArrays(gl.TRIANGLES, offset, count);
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

        const length = Screen.WIDTH * Screen.HEIGHT * 4;
        this.buffer = {
            data: new Uint8ClampedArray(new ArrayBuffer(length)),
            width: Screen.WIDTH,
            height: Screen.HEIGHT,
        };
    }

    public getWidth(): number {
        return Screen.WIDTH * this.zoom;
    }

    public getHeight(): number {
        return Screen.HEIGHT * this.zoom;
    }

    public isReady(): boolean {
        return this.buffer != null;
    }
}

