#version 300 es
precision highp float;
uniform float u_time;
in vec2 v_objectUV;
out vec4 fragColor;

// Original generative artwork: 48 strands, grouped 24 / 16 / 8 like the sample project.
// Work strands, not chart coordinates: this is a brand illustration, not analytics.
void main() {
  vec2 uv = v_objectUV + .5;
  vec3 ground = vec3(.94,.28,.11);
  vec3 color = ground;
  float t = u_time * .3;
  for (int i=0; i<48; i++) {
    float row=float(i)/47.;
    float x=uv.x;
    float envelope=sin(clamp(x,0.,1.)*3.14159265);
    float fold=sin(x*5.8 + row*2.6 + t)*.13*envelope;
    float crest=cos(x*9. + row*4. - t*.6)*.04*envelope;
    float y=.08+row*.80 + fold + crest;
    float start=.06+.06*sin(row*4.+t*.4);
    float finish=.92+.04*cos(row*6.);
    float width=.0065 + .0025*sin(x*3.14);
    float aa=max(fwidth(uv.y),.0008);
    float mask=(1.-smoothstep(width-aa,width+aa,abs(uv.y-y))) * smoothstep(start,start+.012,x)*(1.-smoothstep(finish-.012,finish,x));
    vec3 strand=i<24?vec3(1.,.83,.55):(i<40?vec3(.29,.26,.16):vec3(1.,.98,.86));
    float light=.78+.22*cos(x*5.8+row*2.6+t);
    color=mix(color,strand*light,mask);
  }
  float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
  fragColor=vec4(color+grain*.035,1.);
}
