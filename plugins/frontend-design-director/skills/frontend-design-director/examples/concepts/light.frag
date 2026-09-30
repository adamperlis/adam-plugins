#version 300 es
precision highp float;
uniform float u_time;
in vec2 v_objectUV;
out vec4 fragColor;
// Original light study. Window light, not a visualization of project data.
void main() {
  vec2 p=v_objectUV+.5;
  float t=u_time*.12;
  float beam=sin(p.x*8.-p.y*3.+sin(t)*.6)*.5+.5;
  beam=pow(beam,5.);
  float soft=sin(p.y*4.+p.x*3.+t)*.5+.5;
  vec3 color=mix(vec3(.16,.23,.17),vec3(.54,.57,.33),beam*.7+soft*.2);
  color+=vec3(.24,.20,.12)*exp(-length(p-vec2(.8,.8))*2.);
  float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
  fragColor=vec4(color+grain*.04,1.);
}
