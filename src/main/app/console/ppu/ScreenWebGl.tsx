import vsGLSL from '../../../shaders/screen_vertex_shader.glsl';
import fsGLSL from '../../../shaders/screen_fragment_shader.glsl';

export class ScreenWebGl {

    public gl: WebGLRenderingContext;
    private canvas: HTMLCanvasElement;

    public setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public setRenderingContext(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    public render(): void {
        let gl = this.gl;
        let canvas = this.canvas;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0.5, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsGLSL);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            console.log(gl.getShaderInfoLog(vertexShader));

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsGLSL);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            console.log(gl.getShaderInfoLog(fragmentShader));

        const prg = gl.createProgram();
        gl.attachShader(prg, vertexShader);
        gl.attachShader(prg, fragmentShader);
        gl.linkProgram(prg);

        if (!gl.getProgramParameter(prg, gl.LINK_STATUS))
            console.log(gl.getProgramInfoLog(prg));

        const positionLoc = gl.getAttribLocation(prg, 'position');
        const vertexPositions = new Float32Array([
            -1,   1,
            1,  1,
            1,  -1,
            -1,  1,
            1, -1,
            -1, -1
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLoc);

        gl.vertexAttribPointer(
            positionLoc,
            2,            // 2 values per vertex shader iteration
            gl.FLOAT,     // data is 32bit floats
            false,        // don't normalize
            0,            // stride (0 = auto)
            0,            // offset into buffer
        );

        let itemSize = 2;
        let numItems = vertexPositions.length / itemSize;

        gl.useProgram(prg);
        gl.drawArrays(gl.TRIANGLES, 0, numItems);

    }

}

export const screenGl = new ScreenWebGl();
