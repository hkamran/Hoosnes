precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

uniform float u_mosaic;
uniform float u_brightness;

void main() {
    vec2 st = v_texCoord;
    vec3 color = texture2D(u_image, st).rgb;

    if(u_mosaic > 0.0) {
        float scale = max(1., (15. - u_mosaic) * 5.);
        st = ceil(st * scale) / scale;
        color = texture2D(u_image, st).rgb;
    }

    color.r = color.r * u_brightness;
    color.b = color.b * u_brightness;
    color.g = color.g * u_brightness;

    gl_FragColor = vec4(color, 1.);
}