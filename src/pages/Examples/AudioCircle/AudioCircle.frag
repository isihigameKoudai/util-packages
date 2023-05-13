precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform float num;

void main(void){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float f = 0.01 / abs(length(p) - 0.5 - num);
  gl_FragColor = vec4(vec3(f), 1.0);
}