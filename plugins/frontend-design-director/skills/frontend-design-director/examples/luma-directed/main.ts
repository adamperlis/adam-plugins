import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Frontend Design Director: physical-product route. Original geometry and materials.
// One renderer is shared between three viewport-relative stages; no perpetual animation.
const $ = <T extends Element = HTMLElement>(s: string) =>
  document.querySelector<T>(s)!;
const stages = [...document.querySelectorAll<HTMLElement>(".lens-stage")];
const canvas = $<HTMLCanvasElement>("#lens-canvas");
const media = matchMedia("(prefers-reduced-motion: reduce)");
let still = media.matches;
let component = "housing";
let finish: "carbon" | "alloy" | "oxide" = "carbon";
let rotation = -30;
let aperture = 2.8;
let frame = 0,
  last = 0,
  progress = 0,
  target = 0;
let contextLost = false;
const staticView =
  new URLSearchParams(location.search).get("view") === "static";
let renderer: THREE.WebGLRenderer | undefined;
let environment: THREE.WebGLRenderTarget | undefined;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
const group = new THREE.Group();
scene.add(group);
const mix = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const metal = new THREE.MeshStandardMaterial({
  color: "#45413b",
  roughness: 0.4,
  metalness: 0.85,
});
const rubber = new THREE.MeshStandardMaterial({
  color: "#171b1c",
  roughness: 0.63,
  metalness: 0.25,
});
const trim = new THREE.MeshStandardMaterial({
  color: "#7c7466",
  roughness: 0.3,
  metalness: 0.9,
});
const brass = new THREE.MeshStandardMaterial({
  color: "#ad8958",
  roughness: 0.32,
  metalness: 0.86,
});
const bladeMaterial = new THREE.MeshStandardMaterial({
  color: "#55574e",
  roughness: 0.4,
  metalness: 0.7,
  side: THREE.DoubleSide,
});
const parts: { object: THREE.Group; base: number; explode: number }[] = [];
function ring(
  outer: number,
  inner: number,
  depth: number,
  material: THREE.Material,
) {
  const b = 0.018;
  const points = [
    [inner, -depth / 2],
    [outer - b, -depth / 2],
    [outer, -depth / 2 + b],
    [outer, depth / 2 - b],
    [outer - b, depth / 2],
    [inner, depth / 2],
    [inner, -depth / 2],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(points, 128), material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}
function piece(z: number, explode: number) {
  const object = new THREE.Group();
  object.position.z = z;
  group.add(object);
  parts.push({ object, base: z, explode });
  return object;
}
const shell = piece(-0.4, -1.5);
shell.add(ring(1.43, 1.1, 1.65, metal));
const grip = ring(1.47, 1.4, 0.8, rubber);
grip.position.z = -0.03;
shell.add(grip);
for (const z of [-0.82, -0.65, 0.51, 0.78]) {
  const item = ring(1.448, 1.4, 0.024, trim);
  item.position.z = z;
  shell.add(item);
}
const ridges = new THREE.InstancedMesh(
  new THREE.BoxGeometry(0.023, 0.021, 0.76),
  metal,
  180,
);
const dummy = new THREE.Object3D();
for (let i = 0; i < 180; i++) {
  const a = (i / 180) * Math.PI * 2;
  dummy.position.set(Math.cos(a) * 1.473, Math.sin(a) * 1.473, -0.03);
  dummy.rotation.z = a;
  dummy.updateMatrix();
  ridges.setMatrixAt(i, dummy.matrix);
}
shell.add(ridges);
const textureCanvas = document.createElement("canvas");
textureCanvas.width = 2048;
textureCanvas.height = 128;
const ctx = textureCanvas.getContext("2d")!;
ctx.fillStyle = "#302d29";
ctx.fillRect(0, 0, 2048, 128);
ctx.fillStyle = "#ccc5b3";
ctx.font = "28px monospace";
ctx.textAlign = "center";
for (let i = 0; i < 48; i++) {
  const x = (i / 48) * 2048;
  ctx.fillRect(x, 77, 2, i % 6 === 0 ? 27 : 12);
  if (i % 6 === 0)
    ctx.fillText(["∞", "10", "5", "3", "2", "1.5", "1", "0.7"][i / 6], x, 56);
}
const scaleTexture = new THREE.CanvasTexture(textureCanvas);
scaleTexture.colorSpace = THREE.SRGBColorSpace;
const scaleMaterial = new THREE.MeshStandardMaterial({
  map: scaleTexture,
  roughness: 0.5,
  metalness: 0.5,
});
const scale = new THREE.Mesh(
  new THREE.CylinderGeometry(1.438, 1.438, 0.26, 128, 1, true),
  scaleMaterial,
);
scale.rotation.x = Math.PI / 2;
scale.position.z = 0.47;
shell.add(scale);
const apertureGroup = piece(-0.13, -0.12);
apertureGroup.add(ring(1.115, 0.99, 0.1, trim));
const blades: THREE.Mesh[] = [];
for (let i = 0; i < 9; i++) {
  const shape = new THREE.Shape();
  shape.moveTo(0.26, -0.1);
  shape.bezierCurveTo(0.5, -0.58, 1.1, -0.63, 1.09, 0);
  shape.lineTo(0.86, 0.5);
  shape.lineTo(0.38, 0.4);
  shape.closePath();
  const blade = new THREE.Mesh(new THREE.ShapeGeometry(shape), bladeMaterial);
  blade.rotation.z = (i * Math.PI * 2) / 9;
  blade.position.z = i * 0.003;
  apertureGroup.add(blade);
  blades.push(blade);
}
const glass = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  uniforms: { highlight: { value: 0 } },
  vertexShader: `varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vV=-p.xyz;vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*p;}`,
  fragmentShader: `varying vec3 vN;varying vec3 vV;varying vec3 vP;uniform float highlight;void main(){vec3 n=normalize(vN);vec3 v=normalize(vV);float f=pow(1.-abs(dot(n,v)),2.);float rad=length(vP.xy);float band=pow(max(0.,sin(rad*8.5-1.)),13.);vec3 c=mix(vec3(.026,.046,.064),vec3(.21,.24,.24),f);c+=band*vec3(.13,.095,.055);float spec=pow(max(0.,dot(reflect(-normalize(vec3(-.6,.9,1.)),n),v)),100.);c+=spec*vec3(.75,.65,.44);c+=highlight*.07*vec3(.8,.52,.22);gl_FragColor=vec4(c,.71+f*.27);}`,
});
for (const [i, z] of [0.16, 0.46, 0.73].entries()) {
  const p = piece(z, 0.8 + i * 1.2);
  p.add(ring(1.11 - i * 0.016, 1.025 - i * 0.016, 0.1, trim));
  const optic = new THREE.Mesh(
    new THREE.SphereGeometry(1.035 - i * 0.018, 96, 48),
    glass,
  );
  optic.scale.z = 0.115;
  p.add(optic);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.035 - i * 0.018, 0.006, 8, 128),
    brass,
  );
  p.add(rim);
}
const front = piece(0.92, 3.75);
front.add(ring(1.455, 1.04, 0.32, rubber));
front.add(ring(1.46, 1.439, 0.31, metal));
for (const z of [-0.163, 0.163]) {
  const rim = ring(1.455, 1.445, 0.018, trim);
  rim.position.z = z;
  front.add(rim);
}
const engraving = document.createElement("canvas");
engraving.width = 1024;
engraving.height = 1024;
const ec = engraving.getContext("2d")!;
ec.fillStyle = "#d0c6b5";
ec.textAlign = "center";
ec.font = "19px monospace";
const inscription = "L U M A  •  3 5 / 1 . 4";
for (let i = 0; i < inscription.length; i++) {
  const a = (i / (inscription.length - 1) - 0.5) * 1.15;
  ec.save();
  ec.translate(512 + Math.sin(a) * 419, 512 - Math.cos(a) * 419);
  ec.rotate(a);
  ec.fillText(inscription[i], 0, 0);
  ec.restore();
}
ec.font = "15px monospace";
ec.fillStyle = "#afa18c";
ec.fillText("LM — 01", 512, 942);
const engravingTexture = new THREE.CanvasTexture(engraving);
engravingTexture.colorSpace = THREE.SRGBColorSpace;
const faceText = new THREE.Mesh(
  new THREE.PlaneGeometry(2.88, 2.88),
  new THREE.MeshBasicMaterial({
    map: engravingTexture,
    transparent: true,
    depthWrite: false,
  }),
);
faceText.position.z = 0.176;
front.add(faceText);
const dot = new THREE.Mesh(
  new THREE.SphereGeometry(0.028, 16, 8),
  new THREE.MeshStandardMaterial({ color: "#a43b20", roughness: 0.4 }),
);
dot.position.set(0.08, 1.463, 0.62);
shell.add(dot);
const hemisphere = new THREE.HemisphereLight("#f4e5cb", "#393934", 2.5);
scene.add(hemisphere);
const key = new THREE.DirectionalLight("#fff2da", 3.1);
key.position.set(-4, 5, 7);
scene.add(key);
const rimLight = new THREE.DirectionalLight("#e2e9e5", 2.8);
rimLight.position.set(4, 2, -3);
scene.add(rimLight);
const bounce = new THREE.DirectionalLight("#e3c195", 1.3);
bounce.position.set(-3, -2, 3);
scene.add(bounce);
try {
  if (staticView) throw new Error("Static view selected");
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.autoClear = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  document.documentElement.classList.add("webgl-ready");
} catch {
  document.documentElement.classList.add("no-webgl");
}
function request() {
  if (!frame && !document.hidden && !contextLost)
    frame = requestAnimationFrame(draw);
}
function pose(kind: string, aspect: number) {
  const mechanism = kind === "mechanism";
  const small = innerWidth <= 650;
  const exploded = mechanism ? (still || small ? 1 : progress) : 0;
  camera.aspect = aspect;
  camera.position.set(
    0,
    0,
    mechanism ? Math.max(10.7, 8.4 / aspect) : Math.max(7.5, 4.7 / aspect),
  );
  camera.updateProjectionMatrix();
  group.position.set(mechanism ? 0.9 : 0, mechanism ? 0 : -0.08, 0);
  group.rotation.set(
    mechanism ? 0.05 : -0.32,
    mechanism ? -1.16 : kind === "finish" ? (rotation * Math.PI) / 180 : -0.52,
    mechanism ? -0.12 : -0.45,
  );
  group.scale.setScalar(mechanism ? 1 : 1.08);
  for (const p of parts)
    p.object.position.z = p.base + p.explode * exploded * 0.78;
  const tones = {
    carbon: ["#45413b", "#7c7466"],
    alloy: ["#b0aaa0", "#d1cabf"],
    oxide: ["#916d45", "#b99562"],
  };
  metal.color.set(tones[finish][0]);
  trim.color.set(tones[finish][1]);
  metal.emissive.set(
    mechanism && component === "housing" ? "#21180e" : "#000000",
  );
  bladeMaterial.emissive.set(
    mechanism && component === "aperture" ? "#463523" : "#000000",
  );
  glass.uniforms.highlight.value = mechanism && component === "glass" ? 1 : 0;
  for (let i = 0; i < blades.length; i++) {
    const a = (i * Math.PI * 2) / 9;
    blades[i].position.x = Math.cos(a) * mix(0.01, 0.25, (8 - aperture) / 6.6);
    blades[i].position.y = Math.sin(a) * mix(0.01, 0.25, (8 - aperture) / 6.6);
    blades[i].rotation.z = a + (aperture - 2.8) * 0.06;
  }
}
function draw(now: number) {
  frame = 0;
  if (document.hidden || contextLost || !renderer) return;
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  progress = still ? target : mix(progress, target, 1 - Math.exp(-dt * 13));
  renderer.setScissorTest(false);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.setScissorTest(true);
  let anyVisible = false;
  for (const stage of stages) {
    const r = stage.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= innerHeight || r.width <= 0 || r.height <= 0)
      continue;
    anyVisible = true;
    renderer.setViewport(r.left, innerHeight - r.bottom, r.width, r.height);
    renderer.setScissor(
      r.left,
      Math.max(0, innerHeight - r.bottom),
      r.width,
      Math.min(innerHeight, r.bottom) - Math.max(0, r.top),
    );
    pose(stage.dataset.scene!, r.width / r.height);
    renderer.render(scene, camera);
  }
  if (anyVisible && Math.abs(progress - target) > 0.0005 && !still) request();
}
function onScroll() {
  const r = $(".construction").getBoundingClientRect();
  target = clamp((innerHeight * 0.5 - r.top) / (innerHeight * 0.8), 0, 1);
  request();
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", () => {
  renderer?.setSize(innerWidth, innerHeight);
  onScroll();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(frame);
    frame = 0;
  } else request();
});
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  contextLost = true;
  cancelAnimationFrame(frame);
  frame = 0;
  document.documentElement.classList.remove("webgl-ready");
  document.documentElement.classList.add("no-webgl");
});
canvas.addEventListener("webglcontextrestored", () => {
  contextLost = false;
  document.documentElement.classList.add("webgl-ready");
  document.documentElement.classList.remove("no-webgl");
  request();
});
function setMotion() {
  document.documentElement.classList.toggle("still", still);
  $("#motion").setAttribute("aria-pressed", String(still));
  $("#motion").setAttribute(
    "aria-label",
    still ? "Enable motion" : "Disable motion",
  );
  $("#motion span").textContent = still ? "OFF" : "ON";
  request();
}
$("#motion").addEventListener("click", () => {
  still = !still;
  setMotion();
});
media.addEventListener("change", () => {
  still = media.matches;
  setMotion();
});
const descriptions: Record<string, [string, string]> = {
  housing: [
    "The part you feel.",
    "A knurled focus ring gives the hand a reference point. The housing holds the optical elements in relation to one another.",
  ],
  glass: [
    "A sequence, not a single surface.",
    "Three illustrative glass elements share one axis. Their spacing and curved surfaces make the assembly readable; this model does not claim a finished optical prescription.",
  ],
  aperture: [
    "An opening you can change.",
    "Nine overlapping blades define the opening. Move the control to see them shift together. The number is an illustrative aperture setting, not a measured exposure.",
  ],
};
document
  .querySelectorAll<HTMLButtonElement>("[data-component]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      component = button.dataset.component!;
      document
        .querySelectorAll("[data-component]")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String((b as HTMLElement).dataset.component === component),
          ),
        );
      $("#component-title").textContent = descriptions[component][0];
      $("#component-copy").textContent = descriptions[component][1];
      $(".aperture-control").hidden = component !== "aperture";
      request();
    }),
  );
$("#aperture").addEventListener("input", () => {
  aperture = Number($<HTMLInputElement>("#aperture").value) / 10;
  $("#aperture-value").textContent = `ƒ / ${aperture.toFixed(1)}`;
  request();
});
const finishDescriptions = {
  carbon: "Carbon / satin dark metal",
  alloy: "Alloy / brushed silver tone",
  oxide: "Oxide / warm bronze tone",
};
function syncFinish() {
  finish = $<HTMLInputElement>("[name=finish]:checked").value as typeof finish;
  $("#finish-name").textContent = finishDescriptions[finish];
  $("#finish-caption").textContent = finish.toUpperCase();
  $("#specimen-code").textContent = `LM–01 / ${finish[0].toUpperCase()}`;
  document.body.dataset.finish = finish;
  request();
}
document
  .querySelectorAll<HTMLInputElement>("[name=finish]")
  .forEach((input) => input.addEventListener("change", syncFinish));
$("#rotation").addEventListener("input", () => {
  rotation = Number($<HTMLInputElement>("#rotation").value);
  $("#rotation-value").textContent = `${rotation}°`;
  request();
});
const dialog = $<HTMLDialogElement>("#specimen-card");
$("#create-card").addEventListener("click", () => {
  $("#card-finish").textContent = finishDescriptions[finish];
  dialog.showModal();
});
$("#close-card").addEventListener("click", () => dialog.close());
// Preserve BFCache restoration. Release GPU resources only on a non-persisted page exit.
addEventListener("pagehide", (event) => {
  cancelAnimationFrame(frame);
  frame = 0;
  if (!event.persisted) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    scaleTexture.dispose();
    engravingTexture.dispose();
    environment?.dispose();
    renderer?.dispose();
  }
});
addEventListener("pageshow", () => {
  syncFinish();
  request();
});
syncFinish();
setMotion();
onScroll();
