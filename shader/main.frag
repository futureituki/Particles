varying vec2 vUv;
float PI = 3.141529;
uniform float progress;
void main(){
  vec2 newUv = vUv;
  float bottom = abs(1. - progress);
  float curveStrength = 15.;
  float waveStrength = 7.;
  float curve = progress + sin(newUv.y * PI * curveStrength ) * progress * bottom * waveStrength  ;
  float color = step(curve,newUv.y);
  gl_FragColor = vec4(color,color,color,1.);
}