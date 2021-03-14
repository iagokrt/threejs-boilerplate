uniform float time;
uniform float progress;
uniform sampler2D txture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main() {
    vec2 newUV = vPosition.xy/vec2(480.*1.5, 820.*1.5);
    gl_FragColor = vec4(1., 0, 0.0, 1.);
    gl_FragColor = vec4(newUV, 0., 1.);
}