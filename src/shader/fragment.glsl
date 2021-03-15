uniform float time;
uniform float progress;
uniform sampler2D t;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main() {
    // vec2 newUV = vPosition.xy/vec2(480.*1.5, 820.*1.5) + vec2(0.5);
    // gl_FragColor = vec4(1., 0, 0.0, 1.);

    vec4 tt = texture2D(t, vUv);
    gl_FragColor = vec4(vUv, 0., 1.);
    gl_FragColor = tt;

    // if (gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;
    // gl_FragColor = vec4(0.,0.,1.,0.5);
}