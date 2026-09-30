uniform float uTime;
uniform float uMotion;
varying vec2 vUv;
varying float vLift;

void main() {
  vUv = uv;
  float waveA = sin(position.x * 2.4 + uTime * 0.18);
  float waveB = cos(position.y * 3.1 - uTime * 0.13);
  vLift = (waveA + waveB) * 0.5;
  vec3 transformed = position;
  transformed.z += vLift * 0.055 * uMotion;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
