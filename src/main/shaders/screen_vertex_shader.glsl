precision mediump float;

// an attribute will receive data from a buffer
attribute vec4 position;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = position;
}
