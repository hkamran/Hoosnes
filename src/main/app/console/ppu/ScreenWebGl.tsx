import vsGLSL from '../../../shaders/screen_vertex_shader.glsl';
import fsGLSL from '../../../shaders/screen_fragment_shader.glsl';

export class ScreenWebGl {

    public gl: WebGLRenderingContext;

    public setRenderingContext(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    public render(): void {
        let gl = this.gl;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);

        gl.shaderSource(vertexShader, vsGLSL);

        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertexShader))
        };

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(fragmentShader, fsGLSL);

        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragmentShader))
        };

        const prg = gl.createProgram();

        gl.attachShader(prg, vertexShader);

        gl.attachShader(prg, fragmentShader);

        gl.linkProgram(prg);

        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramParameter(prg, null))
        };


// NOTE! These are only here to unclutter the diagram.
// It is safe to detach and delete shaders once
// a program is linked though it is arguably not common.
// and I usually don't do it.
        gl.detachShader(prg, vertexShader);

        gl.deleteShader(vertexShader);

        gl.detachShader(prg, fragmentShader);

        gl.deleteShader(fragmentShader);

        const positionLoc = gl.getAttribLocation(prg, 'position');

// in clip space
        const vertexPositions = new Float32Array([
            0,   0.7,
            0.5,  -0.7,
            -0.5,  -0.7,
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

        gl.useProgram(prg);

// compute 3 vertices for 1 triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);

    }

}

export const screenGl = new ScreenWebGl();
