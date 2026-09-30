import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Original scene. The same normalized scroll state drives camera, object and light.
// No third-party website source, geometry, textures or shaders are included.
const canvas = document.querySelector<HTMLCanvasElement>("#optics")!;
const chapters = [...document.querySelectorAll<HTMLElement>(".chapter")];
const links = [
  ...document.querySelectorAll<HTMLAnchorElement>(".chapter-nav a"),
];
const motionButton =
  document.querySelector<HTMLButtonElement>(".motion-toggle")!;
const range = document.querySelector<HTMLInputElement>("#aperture")!;
const output = document.querySelector<HTMLOutputElement>("#aperture-value")!;
const label = document.querySelector<HTMLElement>(".scene-label")!;
const media = matchMedia("(prefers-reduced-motion: reduce)");
let still = media.matches;
let renderer: THREE.WebGLRenderer | undefined;
let frame = 0;
let target = 0;
let current = 0;
let active = -1;
let aperture = 2.8;
let mobile = innerWidth < 760;
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = (a: number, b: number, v: number) =>
  THREE.MathUtils.smoothstep(v, a, b);

function updateMotion() {
  document.documentElement.classList.toggle("still", still);
  motionButton.setAttribute("aria-pressed", String(still));
  motionButton.querySelector("span")!.textContent = still ? "off" : "on";
  requestDraw();
}
motionButton.addEventListener("click", () => {
  still = !still;
  updateMotion();
});
media.addEventListener("change", () => {
  still = media.matches;
  updateMotion();
});
range.addEventListener("input", () => {
  aperture = Number(range.value) / 10;
  output.value = `ƒ / ${aperture.toFixed(1)}`;
  requestDraw();
});
function measure() {
  const y = scrollY;
  let i = 0;
  while (i < chapters.length - 1 && y + 1 >= chapters[i + 1].offsetTop) i++;
  target = Math.min(
    3,
    i + clamp((y - chapters[i].offsetTop) / chapters[i].offsetHeight, 0, 1),
  );
  if (i !== active) {
    active = i;
    document.body.dataset.chapter = String(i);
    links.forEach((link, index) =>
      index === i
        ? link.setAttribute("aria-current", "location")
        : link.removeAttribute("aria-current"),
    );
    label.textContent = [
      "ASSEMBLED / PERSPECTIVE",
      "EXPLODED / FIVE COMPONENTS",
      "TRANSMISSION / APERTURE",
      "LM—01 / FORM STUDY",
    ][i];
  }
  requestDraw();
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  33,
  innerWidth / innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 15);
const assembly = new THREE.Group();
scene.add(assembly);
const parts: { object: THREE.Object3D; base: number; offset: number }[] = [];
const metal = new THREE.MeshStandardMaterial({
  color: "#303b37",
  metalness: 0.94,
  roughness: 0.3,
});
const dark = new THREE.MeshStandardMaterial({
  color: "#111916",
  metalness: 0.8,
  roughness: 0.36,
});
const edge = new THREE.MeshStandardMaterial({
  color: "#c1c8b8",
  metalness: 0.95,
  roughness: 0.22,
});
const green = new THREE.MeshStandardMaterial({
  color: "#d4ec85",
  metalness: 0.45,
  roughness: 0.24,
});
function ring(
  outer: number,
  inner: number,
  depth: number,
  material: THREE.Material,
) {
  const bevel = 0.035;
  const pts = [
    [inner, -depth / 2],
    [outer - bevel, -depth / 2],
    [outer, -depth / 2 + bevel],
    [outer, depth / 2 - bevel],
    [outer - bevel, depth / 2],
    [inner, depth / 2],
    [inner, -depth / 2],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(pts, 128), material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}
function part(z: number, offset: number) {
  const group = new THREE.Group();
  group.position.z = z;
  assembly.add(group);
  parts.push({ object: group, base: z, offset });
  return group;
}
const shell = part(-0.5, -1.45);
shell.add(ring(1.46, 1.12, 1.65, metal));
for (const z of [-0.8, -0.66, 0.59, 0.77]) {
  const r = ring(1.49, 1.1, 0.045, edge);
  r.position.z = z;
  shell.add(r);
}
const focus = ring(1.51, 1.42, 0.72, dark);
focus.position.z = -0.09;
shell.add(focus);
const ridgeGeometry = new THREE.BoxGeometry(0.027, 0.028, 0.68);
const ridges = new THREE.InstancedMesh(ridgeGeometry, metal, 160);
const dummy = new THREE.Object3D();
for (let i = 0; i < 160; i++) {
  const a = (i / 160) * Math.PI * 2;
  dummy.position.set(Math.cos(a) * 1.518, Math.sin(a) * 1.518, -0.09);
  dummy.rotation.z = a;
  dummy.updateMatrix();
  ridges.setMatrixAt(i, dummy.matrix);
}
shell.add(ridges);
// Engraved scale is generated from our own technical labels.
const scaleCanvas = document.createElement("canvas");
scaleCanvas.width = 2048;
scaleCanvas.height = 128;
const ctx = scaleCanvas.getContext("2d")!;
ctx.fillStyle = "#1c2622";
ctx.fillRect(0, 0, 2048, 128);
ctx.fillStyle = "#d3d8c9";
ctx.font = "28px monospace";
ctx.textAlign = "center";
for (let i = 0; i < 40; i++) {
  const x = i * 51.2;
  ctx.fillRect(x, 76, 2, i % 5 === 0 ? 27 : 12);
  if (i % 5 === 0)
    ctx.fillText(["∞", "10", "5", "3", "2", "1.5", "1", "0.7"][i / 5], x, 55);
}
const scaleTexture = new THREE.CanvasTexture(scaleCanvas);
scaleTexture.colorSpace = THREE.SRGBColorSpace;
const scaleMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(1.475, 1.475, 0.3, 128, 1, true),
  new THREE.MeshStandardMaterial({
    map: scaleTexture,
    roughness: 0.5,
    metalness: 0.4,
  }),
);
scaleMesh.rotation.x = Math.PI / 2;
scaleMesh.position.z = 0.44;
shell.add(scaleMesh);

const irisGroup = part(-0.32, -0.45);
irisGroup.add(ring(1.13, 0.98, 0.13, edge));
const irisBlades: THREE.Mesh[] = [];
for (let i = 0; i < 9; i++) {
  const shape = new THREE.Shape();
  shape.moveTo(0.23, -0.08);
  shape.bezierCurveTo(0.5, -0.6, 1.15, -0.65, 1.12, 0);
  shape.lineTo(0.92, 0.53);
  shape.lineTo(0.4, 0.4);
  shape.closePath();
  const blade = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshStandardMaterial({
      color: i % 2 ? "#424c42" : "#343e36",
      metalness: 0.85,
      roughness: 0.36,
      side: THREE.DoubleSide,
    }),
  );
  blade.rotation.z = (i * Math.PI * 2) / 9;
  blade.position.z = i * 0.002;
  irisGroup.add(blade);
  irisBlades.push(blade);
}

const glassMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  uniforms: { uLight: { value: new THREE.Vector3(-0.4, 0.7, 1) } },
  vertexShader: `varying vec3 vNormal; varying vec3 vView; varying vec2 vUv;
  void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vView=-p.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}`,
  fragmentShader: `varying vec3 vNormal;varying vec3 vView;varying vec2 vUv;uniform vec3 uLight;
  void main(){vec3 n=normalize(vNormal);vec3 v=normalize(vView);float f=pow(1.-abs(dot(n,v)),2.2);float d=length(vUv-.5)*2.;float band=pow(max(0.,sin(d*11.+dot(n,uLight)*3.)),12.);vec3 c=mix(vec3(.03,.14,.14),vec3(.49,.7,.41),f);c+=band*vec3(.11,.22,.17);float spec=pow(max(0.,dot(reflect(-normalize(uLight),n),v)),70.);c+=spec*vec3(.9,.91,.65);gl_FragColor=vec4(c,.58+f*.35);}`,
});
for (const [index, z] of [-0.1, 0.3, 0.68].entries()) {
  const g = part(z, 0.7 + index * 1.15);
  g.add(
    ring(
      1.15 - index * 0.018,
      1.02 - index * 0.025,
      0.11,
      index === 2 ? edge : dark,
    ),
  );
  const lens = new THREE.Mesh(
    new THREE.SphereGeometry(1.035 - index * 0.025, 96, 48),
    glassMaterial,
  );
  lens.scale.z = 0.13;
  g.add(lens);
  for (const r of [0.96, 1.035]) {
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(r - index * 0.02, 0.008, 8, 128),
      green,
    );
    rim.position.z = 0.035;
    g.add(rim);
  }
}
const front = part(0.92, 3.5);
front.add(ring(1.48, 1.08, 0.32, dark));
front.add(ring(1.49, 1.46, 0.28, metal));
for (const z of [-0.17, 0.17]) {
  const r = ring(1.48, 1.42, 0.025, edge);
  r.position.z = z;
  front.add(r);
}
// A small physical index mark helps sell the machined scale.
const mark = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.02, 0.14), green);
mark.position.set(0, 1.492, 0.06);
front.add(mark);

const rayGroup = new THREE.Group();
assembly.add(rayGroup);
const rayMaterials: THREE.LineBasicMaterial[] = [];
const rayLines: THREE.Line[] = [];
for (let i = 0; i < 17; i++) {
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color().setHSL(0.16 + i * 0.012, 0.65, 0.62),
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(new Float32Array(15), 3),
  );
  const line = new THREE.Line(geometry, material);
  rayLines.push(line);
  rayMaterials.push(material);
  rayGroup.add(line);
}
scene.add(new THREE.HemisphereLight("#d7e0cd", "#101d19", 2));
const key = new THREE.DirectionalLight("#eff5df", 5);
key.position.set(-3, 6, 7);
scene.add(key);
const rimLight = new THREE.DirectionalLight("#a8e4cc", 4);
rimLight.position.set(6, 2, -4);
scene.add(rimLight);
const warm = new THREE.PointLight("#e8be7b", 35, 20);
warm.position.set(-4, -2, 3);
scene.add(warm);
let environment: THREE.WebGLRenderTarget | undefined;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  environment = pmrem.fromScene(room, 0.05);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
} catch {
  document.body.classList.add("no-webgl");
}
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  cancelAnimationFrame(frame);
  frame = 0;
  document.body.classList.add("no-webgl");
});
canvas.addEventListener("webglcontextrestored", () => {
  document.body.classList.remove("no-webgl");
  requestDraw();
});

function renderScene(p: number) {
  const explode = smooth(0.58, 1.14, p) * (1 - smooth(2.55, 2.95, p));
  const light = smooth(1.65, 2.05, p) * (1 - smooth(2.55, 2.9, p));
  const end = smooth(2.55, 3, p);
  const firstShift = smooth(0.62, 1.14, p);
  const secondShift = smooth(1.62, 2.05, p);
  const x = mix(mix(2.55, -2.25, firstShift), 3.55, secondShift);
  assembly.position.set(
    mobile ? explode * 0.65 : mix(x, 2.55, end),
    mobile ? -1.45 : mix(-0.04, -0.55, end),
    0,
  );
  const scale = mobile
    ? mix(0.8, 0.49, explode)
    : mix(mix(1.32, 1.08, explode), 0.85, light);
  assembly.scale.setScalar(scale);
  assembly.rotation.set(
    mix(-0.22, 0.08, explode),
    mix(-0.55, -1.23, explode) + end * 0.8,
    mix(-0.3, -0.32, explode) + end * 0.45,
  );
  for (const item of parts)
    item.object.position.z = item.base + item.offset * explode * 0.77;
  for (let i = 0; i < irisBlades.length; i++) {
    const b = irisBlades[i];
    const a = (i * Math.PI * 2) / 9;
    b.position.x = Math.cos(a) * mix(0.02, 0.27, (8 - aperture) / 6.6);
    b.position.y = Math.sin(a) * mix(0.02, 0.27, (8 - aperture) / 6.6);
    b.rotation.z = a + (aperture - 2.8) * 0.055;
  }
  rayGroup.visible = light > 0.01;
  const opening = mix(0.22, 0.82, (8 - aperture) / 6.6);
  for (let i = 0; i < rayLines.length; i++) {
    const a = (i / 17) * Math.PI * 2;
    const x = Math.cos(a) * opening,
      y = Math.sin(a) * opening;
    const positions = rayLines[i].geometry.attributes.position;
    positions.setXYZ(0, x * 1.9, y * 1.9, 5.8);
    positions.setXYZ(1, x * 1.35, y * 1.35, 2.9);
    positions.setXYZ(2, x, y, 1);
    positions.setXYZ(3, x * 0.25, y * 0.25, -1.8);
    positions.setXYZ(4, 0, 0, -3.6);
    positions.needsUpdate = true;
    rayMaterials[i].opacity = light * 0.5;
  }
  renderer?.render(scene, camera);
}
let last = 0;
function tick(now: number) {
  frame = 0;
  if (document.hidden) return;
  const dt = Math.min((now - last) / 1000, 0.06);
  last = now;
  // Reduced motion uses stable chapter poses, not scrubbed camera movement.
  const desired = still ? Math.max(0, active) : target;
  current = still ? desired : mix(current, desired, 1 - Math.exp(-dt * 12));
  renderScene(current);
  if (!still && Math.abs(current - desired) > 0.0002) requestDraw();
}
function requestDraw() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
}
addEventListener("scroll", measure, { passive: true });
addEventListener("resize", () => {
  mobile = innerWidth < 760;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer?.setSize(innerWidth, innerHeight);
  measure();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(frame);
    frame = 0;
  } else {
    last = performance.now();
    requestDraw();
  }
});
addEventListener(
  "pagehide",
  () => {
    cancelAnimationFrame(frame);
    renderer?.dispose();
    environment?.dispose();
  },
  { once: true },
);
updateMotion();
measure();
