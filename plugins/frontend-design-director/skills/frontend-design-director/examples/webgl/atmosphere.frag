precision highp float;

uniform float uTime;
uniform float uMotion;
uniform vec2 uPointer;
uniform vec3 uInk;
uniform vec3 uAccentA;
uniform vec3 uAccentB;
varying vec2 vUv;
varying float vLift;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  local = local * local * (3.0 - 2.0 * local);
  return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
             mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), local.x), local.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += valueNoise(p) * amplitude;
    p = p * 2.03 + 7.1;
    amplitude *= 0.5;
  }
  return sum;
}

void main() {
  vec2 p = vUv - 0.5;
  float time = uTime * 0.045 * uMotion;
  float field = fbm(p * 3.2 + vec2(time, -time * 0.7));
  float pointerGlow = exp(-7.0 * distance(vUv, uPointer));
  float veil = smoothstep(0.08, 0.92, field + vLift * 0.08 + pointerGlow * 0.22);
  vec3 spectral = mix(uAccentA, uAccentB, smoothstep(-0.45, 0.55, p.x + field * 0.35));
  vec3 color = mix(uInk, spectral, veil * 0.84);
  float grain = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;
  gl_FragColor = vec4(color + grain, 1.0);
}
