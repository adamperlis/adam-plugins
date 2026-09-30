precision highp float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uGrid;
varying vec2 vUv;

float luminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 gridUv = vUv * aspect * uGrid;
  vec2 cell = floor(gridUv);
  vec2 local = fract(gridUv) - 0.5;
  vec2 sampleUv = (cell + 0.5) / (aspect * uGrid);
  vec4 source = texture2D(uTexture, sampleUv);
  float radius = mix(0.08, 0.46, luminance(source.rgb));
  float edge = fwidth(length(local));
  float dotMask = 1.0 - smoothstep(radius - edge, radius + edge, length(local));
  vec3 paper = vec3(0.95, 0.94, 0.90);
  vec3 ink = vec3(0.10, 0.11, 0.10);
  gl_FragColor = vec4(mix(paper, ink, dotMask), source.a);
}
