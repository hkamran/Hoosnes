import vsGLSL from '../../../shaders/screen_vertex_shader.glsl';
import fsGLSL from '../../../shaders/screen_fragment_shader.glsl';
import {WebGlUtil} from "../../util/WebGlUtil";

export class ScreenWebGl {

    private readonly canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private frame: WebGLTexture;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.initialize(canvas);
    }

    public render(image: ImageData): void {
        let gl = this.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        WebGlUtil.updateTexture(gl, this.frame, image);

        const itemSize = 2;
        const numItems = 6; //vertexCoordinates.length / itemSize;

        let offset = 0;
        let count = numItems;
        gl.drawArrays(gl.TRIANGLES, offset, count);
    }

    public clear(): void {
        WebGlUtil.clear(this.gl, this.canvas);
    }

    private initialize(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext("webgl");
        if (this.gl == null) {
            throw new Error("WebGL not working!");
        }

        let gl = this.gl;
        let program = WebGlUtil.createProgram(gl, vsGLSL, fsGLSL);
        this.program = program;

        const vertexCoordinates = new Float32Array([
            -1, 1,
            1, 1,
            1, -1,
            -1, 1,
            1, -1,
            -1, -1,
        ]);
        const textureCoordinates = new Float32Array([
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ])
        WebGlUtil.createAttribLocation(
            gl,
            program,
            vertexCoordinates,
            "a_position",
            gl.STATIC_DRAW
        );
        WebGlUtil.createAttribLocation(
            gl,
            program,
            textureCoordinates,
            "a_texCoord",
            gl.STATIC_DRAW
        );
        this.frame = WebGlUtil.createTexture(gl);

        WebGlUtil.clear(gl, canvas);
    }
}


