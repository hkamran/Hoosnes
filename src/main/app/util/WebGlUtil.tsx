export class WebGlUtil {

    public static updateTexture(
        gl: WebGLRenderingContext,
        texture: WebGLTexture,
        image: ImageData) {

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0, gl.RGBA,
            image.width,
            image.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image.data,
        );
    }

    public static createTexture(gl: WebGLRenderingContext): WebGLTexture {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return texture;
    }

    public static createAttribLocation(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        positions: Float32Array,
        name: string,
        usage: GLenum): GLint {

        let attributeLocations = gl.getAttribLocation(program, name);
        let attributeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, usage);
        gl.enableVertexAttribArray(attributeLocations);
        gl.vertexAttribPointer(
            attributeLocations,
            2,              // 2 values per vertex shader iteration
            gl.FLOAT,           // data is 32bit floats
            false,    // don't normalize
            0,            // stride (0 = auto)
            0,            // offset into buffer
        );

        return attributeLocations;
    }

    public static clear(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    public static createProgram(gl: WebGLRenderingContext,
                                vertexShaderSource: string,
                                fragmentShaderSource: string) {

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(vertexShader));

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(fragmentShader));

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(program));

        gl.useProgram(program);
        return program;
    }
}