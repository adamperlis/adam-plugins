// The companion as a 3D model: a furry, pear-shaped body with glossy eyes and a soft studio light.
// Three.js draws it with WebGPU, or WebGL 2 where WebGPU isn't there.
//
// The fur is shell fur: the body is drawn again in up to 44 thin layers, and each layer keeps only
// the pixels where a hair is still that long, so hairs taper, darken toward the root, and part where
// they're pushed. With WebGPU, every hair root is also a small spring simulated on the GPU each frame
// (a compute pass): when the body hops, shakes or turns, the hair lags and springs back, and the
// pointer brushes the hair it passes over. With WebGL 2 the whole pelt swings on one spring instead.
//
// Every <companion-bot> on the page is a bot of its own, with its own blinks, glances and hair; one renderer
// poses the shared model for each in turn, draws it and copies the picture onto that bot's canvas.
// companion-bot.js loads this, keeps the page's mood until it's ready, and falls back to bot2d.js.
import * as THREE from './vendor/three-0.186.1/three.webgpu.min.js';
import {
  Fn, If, Discard, uniform, float, vec2, vec3, vec4, color, mix, smoothstep, clamp, min, max, exp, pow, dot, length, normalize,
  floor, fract, hash, varying, atan, acos, positionLocal, normalLocal, normalView, positionView, instanceIndex,
  vertexIndex, instancedArray, storage, mx_noise_vec3, mx_noise_float, transformNormalToView, uv, abs, attribute,
} from './vendor/three-0.186.1/three.tsl.min.js';
import { RoomEnvironment } from './vendor/three-0.186.1/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const isDark = () => window.companionBotAppearance.isDark();
const rand = (a, b) => a + Math.random() * (b - a);
const ease = (rate, dt) => 1 - Math.exp(-rate * dt);
const lerp = (a, b, k) => a + (b - a) * k;
const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
const VIEW_ANGLES = { front: 0, threeQuarter: 0.6, profile: 1.4 };
// Turning to a new preview angle runs on a spring (a little under critically damped): about 0.6 s,
// a hint of settle at the end, and a second press mid-turn carries on from the current speed.
const VIEW_SPRING = { stiffness: 55, damping: 12 };

// ---------- the renderer ----------
const renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
await renderer.init();
const GPU = Boolean(renderer.backend && renderer.backend.isWebGPUBackend);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.NeutralToneMapping;  // keeps reds red (ACES would push them orange)
renderer.toneMappingExposure = 1.05;
let SIDE = 0;  // the shared canvas's size: the biggest bot's backing pixels; smaller bots are scaled down
function sizeTo(n) {
  if (n === SIDE) return;
  SIDE = n;
  renderer.setSize(n, n, false);
}

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;  // soft studio light, and the eyes' reflections
scene.environmentIntensity = 0.52;
const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 50);
camera.position.set(0, 1.42, 8.2);
camera.lookAt(0, 1.13, 0);

// A soft key from above right, cooler sky fill, and an amber rim behind the fur.
const key = new THREE.DirectionalLight(0xffebd6, 3.1);
key.position.set(3.3, 3.5, 2.8);
const fill = new THREE.DirectionalLight(0xf6ceb4, 0.85);
fill.position.set(-3.3, 1.1, 3.2);
const rim = new THREE.DirectionalLight(0xffad62, 1.2);
rim.position.set(0.9, 2.4, -3.5);
const sky = new THREE.HemisphereLight(0xe1e9ff, 0x875645, 0.8);
scene.add(key, fill, rim, sky);

// ---------- the model ----------
// The book cover's orange, with deeper roots and amber tips.
const PALETTE = {
  root: 0xc83502, mid: 0xfa4900, tip: 0xff6916, warmTip: 0xff9a44, fuzz: 0xff923c,
  skin: 0xe14103, muzzle: 0xf26822, mouth: 0x713a24, beardRoot: 0x49251a, beardTip: 0x884423,
  white: 0xd9e0ec, irisIn: 0x995a2f, irisOut: 0x613a25, ring: 0x392318,
};
const C = Object.fromEntries(Object.entries(PALETTE).map(([name, hex]) => [name, uniform(new THREE.Color(hex))]));
let appearance = window.companionBotAppearance.values, configuredAppearance;
const HEAD_SHAPES = { almond: [1, 1, 1], round: [1.09, 0.96, 0.25], pear: [1.08, 1.03, 0.75], tall: [0.92, 1.09, 0.75] };
const R = 1;  // body radius
const SHELLS = 44;
const sphere = new THREE.SphereGeometry(R, 72, 48);
const VCOUNT = sphere.attributes.position.count;
const EYE_DIRS = [new THREE.Vector3(-0.40, 0.26, 0.88).normalize(), new THREE.Vector3(0.40, 0.23, 0.89).normalize()];

// Per-bot values the shaders read; each bot sets them before it's drawn.
const U = {
  shells: uniform(SHELLS), furLen: uniform(0.3), density: uniform(30), time: uniform(0),
  swing: uniform(new THREE.Vector3()), slot: uniform(0, 'uint'), pupil: uniform(0.40), dark: uniform(0),
  shadow: uniform(0.3), motion: uniform(1), face: uniform(new THREE.Vector3()),
  beardStrength: uniform(1), goatee: uniform(0), jaw: uniform(0), crown: uniform(1), noseWidth: uniform(1), noseLength: uniform(1), noseOffset: uniform(0.2),
  frameDark: uniform(new THREE.Color(0x391c15)), frameLight: uniform(new THREE.Color(0xa56232)), transmission: uniform(1),
  frameFinish: uniform(1),
  mohawk: uniform(0), neckline: uniform(0), teeth: uniform(0),
  brows: uniform(0), browTilt: uniform(0), browLift: uniform(0), browAsym: uniform(0), furrow: uniform(0), lensTint: uniform(0), lensColor: uniform(new THREE.Color(0x5a3a1e)),
  chainColor: uniform(new THREE.Color(0xd8aa3a)),
};
const NOSE_BASE_DEPTH = 0.07;
const noseY = (n) => n.y.add(U.noseOffset).sub(U.face.x).div(U.noseLength);
const noseMask = Fn(([n]) => {
  const y = noseY(n);
  const width = mix(0.18, 0.10, smoothstep(-0.055, 0.23, y)).mul(U.noseWidth);
  const base = vec2(n.x.div(width), y.sub(0.065).div(0.245));
  return exp(dot(base, base).negate()).mul(smoothstep(-0.19, -0.045, y))
    .mul(smoothstep(0.74, 0.95, n.z));
});
const noseLight = Fn(([n, nose]) => {
  const crease = vec2(n.x.div(0.155), noseY(n).add(0.155).div(0.05));
  const underTip = exp(dot(crease, crease).negate()).mul(smoothstep(0.8, 0.96, n.z));
  const awayFromKey = smoothstep(0.01, 0.13, n.x.negate()).mul(nose);
  return float(1).sub(underTip.mul(0.35)).sub(awayFromKey.mul(0.28));
});
const mouthOpenness = smoothstep(0.035, 0.25, U.face.z);
const mouthShape = Fn(([p]) => {
  const x = p.x.add(0.01);
  // Baring teeth pulls the lips back: a wider mouth.
  const halfWidth = mix(0.175, 0.218, U.face.z).add(U.face.y.mul(0.15)).add(U.teeth.mul(0.07));
  const side = smoothstep(-0.16, 0.15, x);
  const lift = mix(0.012, 0.025, side).add(U.face.y.mul(mix(0.47, 0.84, side)));
  const corners = smoothstep(0.028, 0.19, x.abs()).mul(lift);
  // A snarl hitches the upper lip up on one side.
  const snarl = U.teeth.mul(0.03).mul(smoothstep(-0.02, 0.16, x));
  const center = float(-0.432).add(U.face.x.mul(0.34)).add(corners).add(snarl);
  const y = p.y.sub(center).div(mix(0.025, 0.105, U.face.z));
  return vec2(x.div(halfWidth), y.mul(mix(0.83, 1.36, smoothstep(-0.1, 0.18, y))));
});
// Distance from the mouth's middle, 1 at the lips: an oval, squaring off as the teeth bare.
const mouthRadius = (p) => mix(length(p), pow(pow(abs(p.x), 4).add(pow(abs(p.y), 4)), 0.25), U.teeth.mul(0.75));
const mouthMask = Fn(([n]) => {
  return float(1).sub(smoothstep(0.57, 1.18, mouthRadius(mouthShape(n))))
    .mul(smoothstep(0.7, 0.94, n.z));
});
const beardMask = Fn(([n]) => {
  const side = n.x.abs();
  const cheekLine = smoothstep(0.12, 0.8, side).mul(0.445).sub(0.47);
  const taper = mix(1, 0.53, smoothstep(0.58, 0.89, side));
  return smoothstep(-0.28, 0.18, n.z)
    .mul(float(1).sub(smoothstep(cheekLine.sub(0.085), cheekLine.add(0.039), n.y)))
    .mul(taper).mul(U.beardStrength)
    .mul(mix(1, float(1).sub(smoothstep(0.25, 0.45, side)), U.goatee))
    // With chains on, the beard stops at a neckline so they hang on the chest below it.
    .mul(mix(1, smoothstep(-0.9, -0.8, n.y), U.neckline));
});
const upperLipMask = Fn(([n]) => {
  const x = n.x.abs();
  const corners = smoothstep(0.04, 0.31, x).mul(0.205);
  const lip = n.y.add(0.29).add(corners).sub(U.face.x.mul(0.24)).sub(U.face.y.mul(0.34));
  const whiskers = float(1).sub(smoothstep(0.027, 0.077, lip.abs()))
    .mul(float(1).sub(smoothstep(0.25, 0.34, x)))
    .mul(mix(0.6, 1, smoothstep(0.014, 0.065, x)))
    .mul(float(1).sub(noseMask(n).mul(0.68)));
  const join = float(1).sub(smoothstep(0.034, 0.084, x.sub(0.247).abs()))
    .mul(smoothstep(-0.61, -0.5, n.y))
    .mul(float(1).sub(smoothstep(-0.415, -0.35, n.y)));
  return max(whiskers, join).mul(smoothstep(0.55, 0.88, n.z)).mul(U.beardStrength);
});
const facialHair = (n) => max(beardMask(n), upperLipMask(n));
// Mohawk: a dense strip on the midline from the hairline, over the crown, down to the nape.
const mohawkMask = Fn(([n]) => {
  const ridge = float(1).sub(smoothstep(0.19, 0.29, n.x.abs()));
  const along = smoothstep(0.62, 0.76, n.y.add(max(n.z.negate(), 0).mul(0.6)));  // hairline above the brows
  return ridge.mul(along).mul(U.mohawk);
});
// Eyebrows: a band of dark fur above each eye, heavier at the inner end. `browTilt` above 0 drops
// the inner ends into a V (anger), below 0 lifts them (worry); `browLift` raises or lowers both;
// `browAsym` raises one and lowers the other (skepticism).
// They sit just above the eyes, which bulge well out of the head (their tops reach about y 0.6).
const BROW_DIRS = EYE_DIRS.map(d => d.clone().add(new THREE.Vector3(0, 0.5, -0.2)).normalize());
const browMask = Fn(([n]) => {
  const brow = (c, side) => {
    const d = n.sub(vec3(c.x, c.y, c.z));
    const u = d.x.mul(side);  // 0 above the pupil, + toward the outer end
    const line = U.browLift.add(U.browAsym.mul(side)).add(u.mul(U.browTilt));
    const half = mix(0.078, 0.045, smoothstep(-0.17, 0.17, u));  // heavy, thickest at the inner end
    const across = float(1).sub(smoothstep(half, half.add(0.018), d.y.sub(line).abs()));
    return across.mul(float(1).sub(smoothstep(0.17, 0.22, u.abs())));
  };
  return max(brow(BROW_DIRS[0], -1), brow(BROW_DIRS[1], 1)).mul(smoothstep(0.4, 0.6, n.z)).mul(U.brows);
});
// Creases that come with a scowl: furrows between the brows and lines across the bridge of the nose.
const furrowMask = Fn(([n]) => {
  const x = n.x.abs();
  const between = float(1).sub(smoothstep(0.008, 0.018, x.sub(0.04).abs()))
    .mul(smoothstep(0.52, 0.57, n.y)).mul(float(1).sub(smoothstep(0.66, 0.71, n.y)));
  const lines = float(1).sub(smoothstep(0.12, 0.34, fract(n.y.mul(26)).sub(0.5).abs().mul(2)));
  const bridge = lines.mul(float(1).sub(smoothstep(0.05, 0.09, x)))
    .mul(smoothstep(0.27, 0.3, n.y)).mul(float(1).sub(smoothstep(0.37, 0.4, n.y)));
  return max(between, bridge).mul(smoothstep(0.6, 0.8, n.z)).mul(U.furrow);
});
// The crown tips to one side, and the forehead and chin taper away from the cheeks.
const surface = Fn(([n]) => {
  const width = float(0.975).sub(n.y.mul(0.075)).sub(n.y.mul(n.y).mul(0.24))
    .add(float(1).sub(smoothstep(-0.65, -0.12, n.y)).mul(U.jaw));
  const crown = n.y.mul(0.095).add(n.y.mul(n.y).mul(0.025)).mul(U.crown);
  const faceDepth = noseMask(n).mul(NOSE_BASE_DEPTH)
    .sub(mouthMask(n).mul(mix(0.018, 0.035, U.face.z)).mul(mouthOpenness));
  return vec3(n.x.mul(width).sub(crown), n.y.mul(1.005), n.z.mul(float(1).sub(n.y.mul(0.08))).add(faceDepth));
});
const muzzleNormal = Fn(([n]) => {
  const dx = vec3(0.01, 0, 0), dy = vec3(0, 0.01, 0);
  const slope = vec3(noseMask(n.add(dx)).sub(noseMask(n.sub(dx))), noseMask(n.add(dy)).sub(noseMask(n.sub(dy))), 0)
    .mul(NOSE_BASE_DEPTH / 0.02);
  return normalize(n.sub(slope.sub(n.mul(dot(n, slope)))));
});
const sculptedNormal = () => transformNormalToView(varying(muzzleNormal(normalLocal)));

// GPU hair: one spring per hair root (per vertex of the body), for up to 8 bots at once.
const SLOTS = 8;
const restNormals = instancedArray(new Float32Array(sphere.attributes.normal.array), 'vec3');
const hairOffset = instancedArray(VCOUNT * SLOTS, 'vec3');
const hairVelocity = instancedArray(VCOUNT * SLOTS, 'vec3');
const SIM = { dt: uniform(1 / 60), accel: uniform(new THREE.Vector3()), brushAt: uniform(new THREE.Vector3(9, 9, 9)), brushV: uniform(new THREE.Vector3()) };
const simulate = Fn(() => {
  const k = instanceIndex.add(U.slot.mul(VCOUNT));
  const o = hairOffset.element(k), v = hairVelocity.element(k), n = restNormals.element(instanceIndex);
  const d = length(n.sub(SIM.brushAt));
  const brush = SIM.brushV.mul(exp(d.mul(d).mul(-14)));  // the pointer pushes the hair right under it
  const f = o.mul(-150).sub(v.mul(10)).sub(SIM.accel).add(brush.mul(14));  // spring home, damping, inertia
  const nv = v.add(f.mul(SIM.dt)).toVar();
  const no = o.add(nv.mul(SIM.dt)).toVar();
  no.assign(no.sub(n.mul(dot(no, n))));  // hair swings along the skin, not into it
  const len = length(no);
  If(len.greaterThan(0.55), () => { no.mulAssign(float(0.55).div(len)); });
  v.assign(nv);
  o.assign(no);
})().compute(VCOUNT);

const rig = new THREE.Group();     // at the feet: hops and leans
const squashG = new THREE.Group(); // squash and stretch, pivoting on the feet
const body = new THREE.Group();    // the head: turns toward what it looks at
body.position.y = R;
rig.add(squashG); squashG.add(body); scene.add(rig);

// Under the fur: the skin, dark so the gaps between hairs read as depth.
const skinMat = new THREE.MeshStandardNodeMaterial({ roughness: 1, metalness: 0 });
skinMat.colorNode = Fn(() => {
  const n = normalLocal;
  const nose = noseMask(n);
  const skin = mix(C.skin, C.muzzle, nose.mul(0.55));
  const facialFur = mix(skin, C.beardRoot, max(facialHair(n), browMask(n)).mul(0.8));
  return mix(facialFur, C.mouth, mouthMask(n).mul(0.9).mul(mouthOpenness)).mul(noseLight(n, nose))
    .mul(float(1).sub(furrowMask(n).mul(0.6)));
})();
skinMat.emissiveNode = C.skin.mul(mix(0.12, 0.018, facialHair(normalLocal)));
skinMat.positionNode = surface(normalLocal);
skinMat.normalNode = sculptedNormal();
body.add(new THREE.Mesh(sphere, skinMat));

// The fur.
const furMat = new THREE.MeshPhysicalNodeMaterial({
  roughness: 0.87, metalness: 0, sheen: 1, sheenRoughness: 0.55, alphaToCoverage: true,
});
furMat.normalNode = sculptedNormal();
const shellH = float(instanceIndex).add(1).div(U.shells);  // 0 at the skin, 1 at the longest hair's tip
// The fur reads the same buffer through a read-only view (WebGPU allows no writable storage in a vertex shader).
const hairRead = storage(hairOffset.value, 'vec3', VCOUNT * SLOTS).toReadOnly();
const hairAt = GPU ? hairRead.element(vertexIndex.add(U.slot.mul(VCOUNT))) : U.swing;
furMat.positionNode = Fn(() => {
  const n = normalLocal;
  const h = shellH, h2 = shellH.mul(shellH);
  const breeze = mx_noise_vec3(n.mul(2.4).add(vec3(0, U.time.mul(0.35), U.time.mul(0.2)))).mul(0.045).mul(h2);
  const beard = beardMask(n);
  const mohawk = mohawkMask(n);
  const down = mix(vec3(-0.08, -1, 0), vec3(n.x.mul(-0.3), -1, 0.035), beard);
  // A mohawk stands up and sweeps a little back instead of being combed down.
  const groom = down.sub(n.mul(dot(n, down))).mul(mix(0.19, 0.3, beard)).mul(float(1).sub(mohawk))
    .add(vec3(0, 0.03, -0.12).mul(mohawk)).mul(h2);
  // With a mohawk, everything off the ridge and outside the beard is clipped to stubble.
  const clipped = U.mohawk.mul(float(1).sub(beard)).mul(float(1).sub(mohawk));
  const scalp = mix(U.furLen, float(0.045), clipped).add(mohawk.mul(float(0.44).sub(U.furLen)));
  const furLength = scalp.add(beard.mul(0.055)).sub(upperLipMask(n).mul(0.02)).add(browMask(n).mul(0.13));
  return surface(n).add(n.mul(h.mul(furLength))).add(groom).add(hairAt.mul(h2).mul(U.motion)).add(breeze);
})();
const vH = varying(shellH);
furMat.colorNode = Fn(() => {
  const n = normalize(normalLocal);
  const p = n.mul(U.density).add(512);
  const id = floor(p), f = fract(p).sub(0.5);
  const seed = id.x.add(id.y.mul(127.1)).add(id.z.mul(7919.3));
  const r1 = hash(seed), r2 = hash(seed.add(3.7)), r3 = hash(seed.add(9.1)), r4 = hash(seed.add(17.3));
  // Around the eyes the hair is short, so it rims them instead of covering them.
  const e = max(dot(n, vec3(EYE_DIRS[0].x, EYE_DIRS[0].y, EYE_DIRS[0].z)), dot(n, vec3(EYE_DIRS[1].x, EYE_DIRS[1].y, EYE_DIRS[1].z)));
  const socket = smoothstep(0.88, 0.955, e);
  const clump = mx_noise_float(n.mul(9)).mul(0.5).add(0.5);
  const nose = noseMask(n);
  const mouth = mouthMask(n);
  const trim = max(socket.mul(0.89), max(nose.mul(0.9), mouth.mul(0.9)));
  const len = mix(0.64, 1, r1).mul(mix(0.79, 1.02, clump)).mul(float(1).sub(trim));
  const u = clamp(vH.div(len), 0, 1);
  const off = vec3(r2, r3, r4).sub(0.5).mul(0.32);
  // Let the edges of the strand soften across the crown and temples, keeping the nose and eyes crisp.
  // Mohawk and brows stay dense: crisp, blunt bristles rather than wisps.
  const bristle = max(mohawkMask(n), browMask(n));
  const soft = max(smoothstep(0.19, 0.75, n.y), smoothstep(0.42, 0.88, n.x.abs())).mul(float(1).sub(bristle.mul(0.85)));
  const feather = mix(0.023, 0.085, soft);
  const edge = min(mix(0.49, mix(0.09, 0.3, bristle), u).sub(length(f.sub(off))), len.sub(vH));
  const coverage = smoothstep(feather.negate(), feather, edge);
  const opaqueCore = smoothstep(0.11, 0.32, coverage);
  const opacity = mix(opaqueCore, coverage, soft);
  If(opacity.lessThan(0.015), () => { Discard(); });
  const c = mix(C.root, C.mid, smoothstep(0, 0.6, u)).toVar();
  const tip = mix(C.tip, C.warmTip, smoothstep(0.55, 1, r3).mul(0.65));
  c.assign(mix(c, tip, smoothstep(0.4, 1, u).mul(mix(0.65, 0.46, soft))));
  const grain = mx_noise_float(n.mul(vec3(74, 8, 27))).mul(0.08).add(1);
  c.assign(mix(c, mix(C.root, C.mid, 0.74).mul(grain), mix(0.22, 0.55, soft)));
  c.assign(mix(c, mix(C.beardRoot, C.beardTip, u), max(max(facialHair(n), mohawkMask(n)), browMask(n)).mul(0.95)));
  c.assign(mix(c, C.beardRoot.mul(0.8), browMask(n).mul(0.6)));  // brows a shade darker than the beard
  c.assign(mix(c, C.muzzle, nose.mul(0.36)));
  c.assign(mix(c, C.mouth, mouth.mul(mix(0.82, 0.95, U.face.z)).mul(mouthOpenness)));
  const creases = float(1).sub(furrowMask(n).mul(0.6));
  return vec4(c.mul(mix(0.96, 1.04, r2)).mul(noseLight(n, nose)).mul(creases), opacity);
})();
// Fur scatters light: a soft amber glow where it turns away from you, strongest at the tips.
furMat.emissiveNode = Fn(() => {
  const facing = abs(dot(normalize(normalView), normalize(positionView).negate()));
  const beard = max(max(facialHair(normalLocal), mohawkMask(normalLocal)), browMask(normalLocal));
  const rim = mix(C.fuzz, C.beardTip, beard.mul(0.65)).mul(pow(float(1).sub(facing), 2.2).mul(vH).mul(mix(0.19, 0.28, U.dark)));
  const fill = mix(0.15, 0.025, beard);
  return rim.add(C.mid.mul(fill).mul(float(1).sub(mouthMask(normalLocal).mul(0.72).mul(mouthOpenness))));
})();
furMat.sheenNode = mix(C.fuzz, C.beardTip, max(max(facialHair(normalLocal), mohawkMask(normalLocal)), browMask(normalLocal)).mul(0.58));
const fur = new THREE.InstancedMesh(sphere, furMat, SHELLS);
fur.frustumCulled = false;
body.add(fur);

// Loft each independently authored nose through its own bridge, tip, and base contours.
const noseProfiles = window.companionBotAppearance.nosePresets;
const noseGeometries = new Map();
function geometryForNose(type) {
  if (noseGeometries.has(type)) return noseGeometries.get(type);
  const profile = noseProfiles[type];
  const centers = new THREE.CatmullRomCurve3(profile.rings.map(([y, z]) => new THREE.Vector3(0, y, z)), false, 'catmullrom', 0.5);
  const radii = new THREE.CatmullRomCurve3(profile.rings.map(([, , width, depth]) => new THREE.Vector3(width, depth, 0)), false, 'catmullrom', 0.5);
  const [nx, ny, nz, nw, nh, nd] = profile.nostril;
  const geometry = new THREE.SphereGeometry(1, 64, 48);
  const positions = geometry.attributes.position;
  const hollows = new Float32Array(positions.count);
  const center = new THREE.Vector3(), radius = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    const t = (1 - positions.getY(i)) * 0.5;
    const angle = Math.atan2(positions.getZ(i), positions.getX(i));
    centers.getPoint(t, center);
    radii.getPoint(t, radius);
    const x = Math.cos(angle) * Math.max(0, radius.x);
    const y = center.y;
    const z = center.z + Math.sin(angle) * Math.max(0, radius.y);
    const dentX = (Math.abs(x) - nx) / nw;
    const dentY = (y - ny) / nh;
    const dentZ = (z - nz) / nd;
    const dent = Math.exp(-(dentX * dentX + dentY * dentY + dentZ * dentZ));
    hollows[i] = dent;
    positions.setXYZ(i, x, y + 0.004 * dent, z - 0.015 * dent);
  }
  geometry.setAttribute('noseHollow', new THREE.BufferAttribute(hollows, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  noseGeometries.set(type, geometry);
  return geometry;
}
const noseGeometry = geometryForNose('roman');
const noseLift = Fn(([p]) => vec3(0, U.face.x.mul(smoothstep(1.03, 1.48, p.z)), 0));
// Skin and fur use the same mask as the dents so the hollows stay clear as the nose moves.
const nostrilOpening = smoothstep(0.16, 0.73, attribute('noseHollow', 'float'));
const outsideNostril = float(1).sub(nostrilOpening);
const noseMat = new THREE.MeshPhysicalNodeMaterial({ roughness: 0.88, sheenRoughness: 0.7 });
noseMat.colorNode = Fn(() => {
  const tip = smoothstep(1.05, 1.52, positionLocal.z);
  const grain = mx_noise_float(positionLocal.mul(vec3(92, 30, 92))).mul(0.16).add(0.93);
  const skin = mix(C.skin, C.muzzle, tip.mul(0.34)).mul(grain);
  return mix(skin, color(0x49271c), nostrilOpening);
})();
noseMat.sheenNode = C.fuzz.mul(0.34).mul(outsideNostril);
noseMat.emissiveNode = C.mid.mul(0.035).mul(outsideNostril);
noseMat.positionNode = positionLocal.add(noseLift(positionLocal));
const noseRig = new THREE.Group();
noseRig.position.set(0, 0.2, 0.94);
const noseSkin = new THREE.Mesh(noseGeometry, noseMat);
noseSkin.position.set(0, -0.2, -0.94);
noseRig.add(noseSkin);
body.add(noseRig);

// Short fibers bridge the join at the cheeks, with a finer nap on the rounded tip.
const NOSE_SHELLS = 12;
const noseShell = float(instanceIndex).add(1).div(NOSE_SHELLS);
const noseShellHeight = varying(noseShell);
const noseFurMat = new THREE.MeshPhysicalNodeMaterial({ roughness: 0.91, sheenRoughness: 0.65, alphaToCoverage: true });
noseFurMat.positionNode = Fn(() => {
  const p = positionLocal;
  const furLength = mix(0.025, 0.008, smoothstep(1.03, 1.3, p.z)).mul(outsideNostril);
  return p.add(noseLift(p)).add(normalLocal.mul(noseShell.mul(furLength)));
})();
noseFurMat.colorNode = Fn(() => {
  const cell = uv().mul(vec2(71, 53));
  const seed = dot(floor(cell), vec2(1, 79));
  const h = noseShellHeight;
  const center = vec2(hash(seed), hash(seed.add(23))).sub(0.5).mul(0.46);
  const distance = length(fract(cell).sub(0.5).sub(center));
  const edge = min(mix(0.38, 0.13, h).sub(distance), mix(0.62, 1, hash(seed.add(51))).sub(h));
  const opacity = smoothstep(-0.025, 0.08, edge).mul(outsideNostril);
  If(opacity.lessThan(0.015), () => { Discard(); });
  return vec4(mix(C.root, C.tip, h).mul(mix(0.88, 1.08, hash(seed.add(77)))), opacity);
})();
noseFurMat.sheenNode = C.fuzz.mul(0.65);
const noseFur = new THREE.InstancedMesh(noseGeometry, noseFurMat, NOSE_SHELLS);
noseFur.position.copy(noseSkin.position);
noseRig.add(noseFur);

// Closed lips and the open cavity share a contour so the smile can close smoothly.
const mouthGeo = new THREE.PlaneGeometry(0.66, 0.38, 14, 8).translate(0, -0.43, 0);  // room for a full snarl
const mouthMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
mouthMat.colorNode = Fn(() => {
  const p = mouthShape(positionLocal);
  const radius = mouthRadius(p);
  const lower = float(1).sub(smoothstep(-0.76, 0.13, p.y));
  const inner = mix(color(0x713a24), color(0x9b5431), lower.mul(0.72));
  const tongue = float(1).sub(smoothstep(0.27, 0.76, length(p.sub(vec2(0.08, -0.54)).mul(vec2(1, 1.65)))));
  const lip = smoothstep(0.65, 1, radius).mul(lower);
  const closed = mix(color(0x743923), color(0xa15833), lower);
  const open = mix(mix(inner, color(0x975243), tongue.mul(U.face.z).mul(0.48)), color(0x9f4927), lip.mul(0.68));
  // Teeth: an upper row under the top lip and a lower row over the bottom one, split into teeth
  // by dark gaps. With the mouth only a little open the rows meet: gritted teeth.
  const insideLips = float(1).sub(smoothstep(0.78, 0.95, radius));
  const rows = max(smoothstep(-0.05, 0.12, p.y), float(1).sub(smoothstep(-0.62, -0.45, p.y)));
  const gaps = smoothstep(0.03, 0.09, abs(fract(p.x.mul(3.6).add(0.5)).sub(0.5)));
  const enamel = mix(color(0xf3ecdc), color(0xb9ad97), smoothstep(0.25, 1, abs(p.y)));  // bright at the bite, darker at the gums
  const teeth = insideLips.mul(rows).mul(gaps).mul(U.teeth).mul(mouthOpenness);
  // A strip of gum shows above the top teeth when the lip pulls back.
  const gum = insideLips.mul(smoothstep(0.62, 0.74, p.y)).mul(U.teeth).mul(mouthOpenness);
  return mix(mix(mix(closed, open, mouthOpenness), enamel, teeth), color(0x8a3536), gum.mul(0.9));
})();
mouthMat.positionNode = Fn(() => {
  const p = positionLocal;
  const z = float(1.205).sub(p.x.mul(p.x).mul(0.68)).add(p.y.add(0.42).mul(0.2));
  return vec3(p.x, p.y, z);
})();
mouthMat.opacityNode = Fn(() => {
  const radius = mouthRadius(mouthShape(positionLocal));
  return float(1).sub(smoothstep(0.65, 1.12, radius)).mul(mix(0.78, 0.94, mouthOpenness));
})();
const mouthOpening = new THREE.Mesh(mouthGeo, mouthMat);
mouthOpening.frustumCulled = false;  // the vertex shader moves the opening forward onto the face
body.add(mouthOpening);

// Eyes: glossy balls, brown irises, black pupils; the iris is drawn where the ball faces +z, so turning
// the ball turns the gaze. A thin wet coat (clearcoat) catches the studio light as bright windows.
const eyeMat = new THREE.MeshPhysicalNodeMaterial({
  roughness: 0.44, metalness: 0, specularIntensity: 0.35, clearcoat: 0.26, clearcoatRoughness: 0.1,
});
eyeMat.colorNode = Fn(() => {
  const d = normalize(positionLocal);
  const a = acos(clamp(d.z, -1, 1));
  const IRIS = float(0.78), P = U.pupil;
  const streak = mx_noise_float(vec3(atan(d.y, d.x).mul(3.2), a.mul(14), 0)).mul(0.18).add(0.91);
  const iris = mix(C.irisIn, C.irisOut, smoothstep(P.add(0.03), IRIS.sub(0.08), a)).mul(streak).toVar();
  iris.assign(mix(iris, C.ring, smoothstep(IRIS.sub(0.085), IRIS, a)));
  const white = C.white.mul(mix(0.72, 1, smoothstep(-0.2, 0.8, d.z)));
  const c = mix(iris, white, smoothstep(IRIS.sub(0.02), IRIS.add(0.02), a)).toVar();
  c.assign(mix(color(0x050507), c, smoothstep(P.sub(0.015), P.add(0.015), a)));
  return c;
})();
eyeMat.emissiveNode = Fn(() => {
  const n = normalize(normalView);
  const keyWindow = smoothstep(0.978, 0.996, dot(n, normalize(vec3(-0.3, 0.34, 1))));
  const bounce = smoothstep(0.955, 0.997, dot(n, normalize(vec3(0.5, -0.23, 1))));
  return color(0xfff6f0).mul(keyWindow.mul(1.35)).add(color(0xc4d8bf).mul(bounce.mul(0.32)));
})();
// Lids: furred caps that close over the ball from above (blink, sleep) and below (a pleased squint).
const lidMat = new THREE.MeshPhysicalNodeMaterial({ roughness: 0.85, metalness: 0, sheen: 1, sheenRoughness: 0.5 });
lidMat.colorNode = Fn(() => {
  const fromEdge = abs(normalize(positionLocal).y);
  const fur = mix(C.root, C.mid, smoothstep(-0.2, 0.6, fromEdge));
  return fur.mul(mix(0.49, 1.05, smoothstep(0.012, 0.08, fromEdge)));
})();
lidMat.sheenNode = C.fuzz;
const EYE_R = 0.35;
const eyes = EYE_DIRS.map((dir, i) => {
  const g = new THREE.Group();
  g.position.copy(dir).multiplyScalar(0.86 * R);
  g.lookAt(dir.clone().multiplyScalar(3));
  g.scale.set(...(i === 1 ? [1.08, 1.04, 1.04] : [0.97, 1, 0.98]));
  const ball = new THREE.Mesh(new THREE.SphereGeometry(EYE_R, 48, 32), eyeMat);
  const slant = new THREE.Group();
  const upper = new THREE.Mesh(new THREE.SphereGeometry(EYE_R * 1.05, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
  const lower = new THREE.Mesh(new THREE.SphereGeometry(EYE_R * 1.04, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lidMat);
  slant.add(upper);
  g.add(ball, slant, lower);
  const lashes = new THREE.Group();
  const side = i === 0 ? -1 : 1;
  const lashMat = new THREE.MeshBasicMaterial({ color: 0x633820 });
  for (let lash = 0; lash < 2; lash++) {
    const path = new THREE.CubicBezierCurve3(new THREE.Vector3(side * 0.26, 0.18 + lash * 0.04, 0.15),
      new THREE.Vector3(side * 0.32, 0.2 + lash * 0.04, 0.16), new THREE.Vector3(side * 0.36, 0.25 + lash * 0.04, 0.12),
      new THREE.Vector3(side * 0.38, 0.29 + lash * 0.04, 0.09));
    lashes.add(new THREE.Mesh(new THREE.TubeGeometry(path, 8, 0.009, 4), lashMat));
  }
  g.add(lashes);
  body.add(g);
  return { group: g, baseScale: g.scale.clone(), lashes, ball, slant, upper, lower, side, yaw: -g.rotation.y };
});

// Amber patches transmit more light than the chestnut areas of the tortoiseshell.
const tortoisePattern = Fn(([p]) => {
  const spots = mx_noise_float(p.mul(vec3(5.3, 6.5, 5.1)).add(vec3(2.3, 1.7, 0.7)));
  return smoothstep(-0.25, 0.38, spots);
});
const framePattern = Fn(([p]) => {
  const classic = tortoisePattern(p);
  const bold = smoothstep(-0.08, 0.10, mx_noise_float(p.mul(vec3(9, 5.5, 4)).add(1.8)));
  const patterned = float(1).sub(clamp(min(abs(U.frameFinish.sub(1)), abs(U.frameFinish.sub(3))), 0, 1));
  return mix(1, mix(classic, bold, smoothstep(2.5, 3, U.frameFinish)), patterned);
});
const frontPattern = framePattern(vec3(positionLocal.x, positionLocal.y, 0));
const flatFace = smoothstep(0.35, 0.85, abs(normalLocal.z));
const tortoiseFront = new THREE.MeshPhysicalNodeMaterial({
  roughness: 0.37, ior: 1.49, transmission: 0.46, attenuationColor: 0xf1a458, attenuationDistance: 0.16,
  specularIntensity: 0.48, clearcoat: 0.18, clearcoatRoughness: 0.25,
});
tortoiseFront.colorNode = mix(U.frameDark, U.frameLight, frontPattern).mul(mix(0.64, 1, flatFace));
tortoiseFront.emissiveNode = mix(U.frameDark, U.frameLight, frontPattern).mul(0.08);
tortoiseFront.transmissionNode = mix(0.21, 0.49, frontPattern).mul(mix(0.76, 1, flatFace)).mul(U.transmission);
tortoiseFront.thicknessNode = mix(0.16, 0.11, flatFace);
const tortoiseArm = new THREE.MeshPhysicalNodeMaterial({ roughness: 0.88, specularIntensity: 0.18 });
tortoiseArm.colorNode = mix(U.frameDark, U.frameLight, framePattern(positionLocal));
// One front outline, mirrored around the keyhole bridge, with two rounded openings.
const bridgeTop = [0, 0.455];
const halfFrame = [
  [[0.09, 0.456], [0.123, 0.431], [0.167, 0.451]],
  [[0.248, 0.489], [0.31, 0.539], [0.436, 0.539]],
  [[0.597, 0.539], [0.729, 0.462], [0.842, 0.449]],
  [[0.856, 0.448], [0.86, 0.443], [0.86, 0.43]],
  [[0.861, 0.397], [0.862, 0.341], [0.857, 0.305]],
  [[0.806, 0.293], [0.784, 0.277], [0.76, 0.217]],
  [[0.724, 0.119], [0.704, 0.025], [0.639, -0.051]],
  [[0.586, -0.116], [0.509, -0.162], [0.432, -0.162]],
  [[0.252, -0.162], [0.103, -0.014], [0.077, 0.251]],
  [[0.073, 0.28], [0.107, 0.294], [0.095, 0.319]],
  [[0.083, 0.348], [0.037, 0.345], [0, 0.345]],
];
const frameOutline = new THREE.Shape();
frameOutline.moveTo(...bridgeTop);
for (const [first, second, end] of halfFrame) frameOutline.bezierCurveTo(...first, ...second, ...end);
for (let i = halfFrame.length - 1; i >= 0; i--) {
  const [first, second] = halfFrame[i];
  const [x, y] = i ? halfFrame[i - 1][2] : bridgeTop;
  frameOutline.bezierCurveTo(-second[0], second[1], -first[0], first[1], -x, y);
}
frameOutline.closePath();
const eyewear = new THREE.Group();
const temples = [];
rig.add(eyewear);
for (const side of [-1, 1]) {
  const lens = new THREE.Path();
  lens.moveTo(side * 0.434, 0.474);
  lens.bezierCurveTo(side * 0.614, 0.474, side * 0.731, 0.373, side * 0.72, 0.237);
  lens.bezierCurveTo(side * 0.71, 0.04, side * 0.581, -0.102, side * 0.432, -0.102);
  lens.bezierCurveTo(side * 0.279, -0.102, side * 0.15, 0.037, side * 0.147, 0.208);
  lens.bezierCurveTo(side * 0.142, 0.372, side * 0.262, 0.474, side * 0.434, 0.474);
  lens.closePath();
  frameOutline.holes.push(lens);
  const templePath = new THREE.CubicBezierCurve3(
    new THREE.Vector3(side * 0.842, 0.364, 1.102),
    new THREE.Vector3(side * 1.05, 0.302, 0.81),
    new THREE.Vector3(side * 1.10, 0.24, 0.32),
    new THREE.Vector3(side * 1.01, 0.105, -0.24),
  );
  const temple = new THREE.Mesh(new THREE.TubeGeometry(templePath, 16, 0.032, 8), tortoiseArm);
  temples.push(temple);
  eyewear.add(temple);
}
const frameGeo = new THREE.ExtrudeGeometry(frameOutline, {
  depth: 0.047, bevelThickness: 0.013, bevelSize: 0.009, bevelSegments: 3, curveSegments: 10,
});
const framePositions = frameGeo.attributes.position;
for (let i = 0; i < framePositions.count; i++) {
  const x = framePositions.getX(i);
  framePositions.setZ(i, framePositions.getZ(i) - x * x * 0.047);
}
frameGeo.computeVertexNormals();
const glasses = new THREE.Mesh(frameGeo, tortoiseFront);
glasses.scale.y = 1.075;
glasses.position.set(0, -0.016, 1.124);
eyewear.add(glasses);
const frameGeometries = new Map([['keyhole', frameGeo]]);

// Tinted lenses: a thin pane cut to each frame's openings.
// Every frame style records its openings in lensOutlines as its geometry is built.
const lensOutlines = new Map([['keyhole', frameOutline.holes]]);
const lensGeometries = new Map();
function lensGeometry(style) {
  if (lensGeometries.has(style)) return lensGeometries.get(style);
  const outlines = lensOutlines.get(style) || [];
  const geometry = new THREE.ShapeGeometry(outlines.map(path => new THREE.Shape(path.getPoints(24))), 12);
  const positions = geometry.attributes.position;
  // On the frame's front face (the eyes reach past its middle), with the frame's bend.
  for (let i = 0; i < positions.count; i++) positions.setZ(i, 0.058 - positions.getX(i) ** 2 * 0.047);
  geometry.computeVertexNormals();
  lensGeometries.set(style, geometry);
  return geometry;
}
// Unlit tinted glass: a lit lens picks up the studio reflections and turns milky. Darker at the
// top, like a gradient aviator lens. Front side only: a double-sided transparent pane takes
// WebGPURenderer's two-pass path and doesn't draw here.
// The lens filters what's behind it (multiplies it) rather than painting over it: the scene is
// HDR until tone mapping, and the eye whites are bright enough to shine through an alpha-blended
// pane even at 0.85. Light let through falls off as (1 - tint)³, so the slider reads evenly from
// clear to sunglasses, and what isn't let through takes the lens's color.
const lensMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false,
  blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.ZeroFactor, blendDst: THREE.SrcColorFactor,
  blendEquationAlpha: THREE.AddEquation, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor });
const lensFade = smoothstep(-0.1, 0.45, positionLocal.y);
lensMat.colorNode = mix(U.lensColor.mul(mix(1, 0.55, lensFade)), vec3(1),
  pow(float(1).sub(U.lensTint.mul(mix(0.78, 1, lensFade))), 3));
const lenses = new THREE.Mesh(lensGeometry('keyhole'), lensMat);
lenses.visible = false;
glasses.add(lenses);
const legacyTemples = temples.map(temple => temple.geometry);
const catalogTemples = new Map();
function contourPath(path, frame, side, inset = 0) {
  const points = frame.points.map(([x, y]) => [side * (.43 + x * (frame.rx - inset)), .2 + y * (frame.ry - inset)]);
  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  path.moveTo(...midpoint(points[points.length - 1], points[0]));
  points.forEach((point, i) => path.quadraticCurveTo(...point, ...midpoint(point, points[(i + 1) % points.length])));
  path.closePath();
}
function catalogFrameGeometry(frame) {
  const openings = [];
  const shapes = [-1, 1].map(side => {
    const rim = new THREE.Shape(), opening = new THREE.Path();
    contourPath(rim, frame, side); contourPath(opening, frame, side, frame.rim);
    rim.holes.push(opening);
    openings.push(opening);
    return rim;
  });
  lensOutlines.set(frame.id, openings);
  const gap = .43 - frame.rx + frame.rim * .6, y = .35, thick = Math.max(.032, frame.rim);
  const bridge = new THREE.Shape();
  bridge.moveTo(-gap, y);
  bridge.bezierCurveTo(-gap * .5, y, -gap * .6, frame.bridge, 0, frame.bridge);
  bridge.bezierCurveTo(gap * .6, frame.bridge, gap * .5, y, gap, y);
  bridge.lineTo(gap, y - thick);
  bridge.bezierCurveTo(gap * .5, y - thick, gap * .6, frame.bridge - thick, 0, frame.bridge - thick);
  bridge.bezierCurveTo(-gap * .6, frame.bridge - thick, -gap * .5, y - thick, -gap, y - thick);
  bridge.closePath(); shapes.push(bridge);
  if (frame.brow) {
    const bar = new THREE.Shape(), top = .2 + frame.ry * .87, half = .43 + frame.rx * .85;
    bar.moveTo(-half, top); bar.lineTo(half, top); bar.lineTo(half, top - .035); bar.lineTo(-half, top - .035); bar.closePath();
    shapes.push(bar);
  }
  const geometry = new THREE.ExtrudeGeometry(shapes, { depth: .047, bevelThickness: .010, bevelSize: .007, bevelSegments: 3, curveSegments: 12 });
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) - positions.getX(i) ** 2 * .047);
  geometry.computeVertexNormals();
  return geometry;
}
function templeGeometries(frame) {
  if (catalogTemples.has(frame.id)) return catalogTemples.get(frame.id);
  const outer = .43 + frame.rx * Math.max(...frame.points.map(point => point[0]));
  const geometries = [-1, 1].map(side => new THREE.TubeGeometry(new THREE.CubicBezierCurve3(
    new THREE.Vector3(side * (outer - .015), .35, 1.102), new THREE.Vector3(side * 1.05, .302, .81),
    new THREE.Vector3(side * 1.10, .24, .32), new THREE.Vector3(side * 1.01, .105, -.24)), 16, Math.max(.02, frame.rim * .6), 8));
  catalogTemples.set(frame.id, geometries);
  return geometries;
}
function glassesGeometry(style) {
  if (frameGeometries.has(style)) return frameGeometries.get(style);
  const catalog = window.companionBotAppearance.frameCatalog.find(frame => frame.id === style);
  if (catalog) {
    const geometry = catalogFrameGeometry(catalog);
    frameGeometries.set(style, geometry);
    return geometry;
  }
  const halves = {
    round: [
      [[0.10, 0.46], [0.17, 0.57], [0.43, 0.57]],
      [[0.66, 0.57], [0.84, 0.43], [0.84, 0.21]],
      [[0.84, -0.04], [0.66, -0.17], [0.43, -0.17]],
      [[0.23, -0.17], [0.065, -0.02], [0.07, 0.21]],
      [[0.07, 0.32], [0.035, 0.32], [0, 0.32]],
    ],
    square: [
      [[0.12, 0.46], [0.25, 0.52], [0.78, 0.52]],
      [[0.85, 0.52], [0.9, 0.46], [0.9, 0.38]],
      [[0.9, 0.12], [0.9, -0.12], [0.76, -0.13]],
      [[0.57, -0.17], [0.23, -0.17], [0.13, -0.09]],
      [[0.09, -0.02], [0.075, 0.15], [0.077, 0.25]],
      [[0.075, 0.32], [0.035, 0.32], [0, 0.32]],
    ],
    catEye: [
      [[0.12, 0.44], [0.2, 0.49], [0.42, 0.52]],
      [[0.65, 0.55], [0.84, 0.62], [0.95, 0.64]],
      [[0.88, 0.44], [0.85, 0.2], [0.75, 0.02]],
      [[0.64, -0.19], [0.27, -0.17], [0.14, 0.02]],
      [[0.09, 0.1], [0.075, 0.2], [0.077, 0.25]],
      [[0.075, 0.32], [0.035, 0.32], [0, 0.32]],
    ],
  };
  const half = halves[style];
  const shape = new THREE.Shape();
  shape.moveTo(...bridgeTop);
  for (const [first, second, end] of half) shape.bezierCurveTo(...first, ...second, ...end);
  for (let i = half.length - 1; i >= 0; i--) {
    const [first, second] = half[i], [x, y] = i ? half[i - 1][2] : bridgeTop;
    shape.bezierCurveTo(-second[0], second[1], -first[0], first[1], -x, y);
  }
  shape.closePath();
  for (const side of [-1, 1]) {
    const hole = new THREE.Path();
    if (style === 'round') hole.absellipse(side * 0.43, 0.2, 0.31, 0.30, 0, Math.PI * 2, true);
    else {
      const top = style === 'catEye' ? 0.49 : 0.44;
      hole.moveTo(side * 0.2, 0.40);
      hole.bezierCurveTo(side * 0.32, top, side * 0.64, top, side * 0.78, top - 0.02);
      hole.bezierCurveTo(side * 0.79, 0.28, side * 0.72, -0.06, side * 0.60, -0.08);
      hole.bezierCurveTo(side * 0.38, -0.11, side * 0.20, -0.07, side * 0.17, 0.10);
      hole.bezierCurveTo(side * 0.14, 0.24, side * 0.15, 0.35, side * 0.2, 0.40);
      hole.closePath();
    }
    shape.holes.push(hole);
  }
  lensOutlines.set(style, shape.holes);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.047, bevelThickness: 0.013, bevelSize: 0.009, bevelSegments: 3, curveSegments: 12 });
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) - positions.getX(i) ** 2 * 0.047);
  geometry.computeVertexNormals();
  frameGeometries.set(style, geometry);
  return geometry;
}

// Gold rope chains, stacked around the lower head and resting on the fur. They hang from the
// squash group, not the head, so they stay put when the head turns to look at something.
const chainMat = new THREE.MeshPhysicalNodeMaterial({ metalness: 1, roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.2 });
chainMat.colorNode = Fn(() => {
  // uv.x runs along the strand (rescaled to length), uv.y around it: diagonal bands read as twisted rope.
  const band = abs(fract(uv().x.add(uv().y)).sub(0.5)).mul(2);
  return U.chainColor.mul(mix(0.5, 1.12, smoothstep(0.12, 0.88, band)));
})();
const chains = new THREE.Group();
chains.position.y = R;
squashG.add(chains);
function surfaceRadius(y) {  // matches surface(): the head narrows toward the chin
  return Math.sqrt(Math.max(0.02, 1 - y * y)) * (0.975 - y * 0.075 - y * y * 0.24);
}
// Each strand is a group that swings on its own spring (see stepChains); the pendant swings again
// on its ring. A set is built per chain count and fur depth and kept: a customizer preview and the
// applied bot can wear different chains or fur, and draw() reconfigures between them every frame.
let strands = [], pendantPivot = null;
const chainSets = new Map();  // `${count}:${furDepth}` → { group, strands, pendantPivot }, newest last
// `furDepth`: how far the chains sit off the skin (short with clipped hair, further over full fur).
function buildChainSet(count, furDepth) {
  const group = new THREE.Group(), set = { group, strands: [], pendantPivot: null };
  let top = null;
  for (let i = 0; i < count; i++) {
    // A neck ring under the face: close round the back of the head, then swinging down and forward
    // under the chin, clear of the beard's hanging tips. Each strand hangs a little lower.
    const y0 = -0.6 - i * 0.04, droop = 0.32 + i * 0.07, thickness = 0.034 - i * 0.002;
    const points = [];
    for (let k = 0; k < 72; k++) {
      const a = k / 72 * Math.PI * 2, front = (1 + Math.cos(a)) / 2;
      const y = y0 - droop * front ** 1.6;
      const r = surfaceRadius(y) + furDepth + 0.52 * front ** 2;
      points.push(new THREE.Vector3(r * Math.sin(a), y, r * Math.cos(a)));
    }
    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');
    const geometry = new THREE.TubeGeometry(curve, 260, thickness, 8, true);
    const uvs = geometry.attributes.uv, twists = curve.getLength() / (thickness * 1.7);
    for (let j = 0; j < uvs.count; j++) uvs.setX(j, uvs.getX(j) * twists);
    const strand = new THREE.Group();
    strand.add(new THREE.Mesh(geometry, chainMat));
    group.add(strand);
    set.strands.push(strand);
    if (i === 0) top = curve.getPoint(0);
  }
  if (!top) return set;
  // A pendant with a soft-cornered plate, hung from the top strand by a ring it pivots on, in
  // front of the strands below (hung from the lowest, it would reach the floor).
  const plate = new THREE.Shape(), w = 0.08, h = 0.1, c = 0.025;
  plate.moveTo(-w + c, -h); plate.lineTo(w - c, -h); plate.quadraticCurveTo(w, -h, w, -h + c);
  plate.lineTo(w, h - c); plate.quadraticCurveTo(w, h, w - c, h); plate.lineTo(-w + c, h);
  plate.quadraticCurveTo(-w, h, -w, h - c); plate.lineTo(-w, -h + c); plate.quadraticCurveTo(-w, -h, -w + c, -h);
  const pendant = new THREE.Mesh(new THREE.ExtrudeGeometry(plate, { depth: 0.03, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 2 }), chainMat);
  pendant.position.set(0, -h - 0.035, -0.01);
  pendant.rotation.x = -0.3;  // rests against the curve of the chest
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.01, 8, 20), chainMat);
  ring.position.set(0, -0.012, 0.01);
  set.pendantPivot = new THREE.Group();  // at the point where it hangs from the strand
  set.pendantPivot.position.set(0, top.y - 0.02, top.z + 0.05);
  set.pendantPivot.add(pendant, ring);
  set.strands[0].add(set.pendantPivot);
  return set;
}
function showChains(count, furDepth) {
  if (count === 0) {
    for (const set of chainSets.values()) set.group.visible = false;
    strands = []; pendantPivot = null;
    return;
  }
  const key = `${count}:${furDepth}`;
  let set = chainSets.get(key);
  if (set) chainSets.delete(key);  // re-added below as the newest
  else {
    set = buildChainSet(count, furDepth);
    chains.add(set.group);
    if (chainSets.size >= 4) {  // keep a few: dragging the fur length would otherwise pile them up
      const [oldest, old] = chainSets.entries().next().value;
      old.group.traverse(child => child.geometry?.dispose());
      chains.remove(old.group);
      chainSets.delete(oldest);
    }
  }
  chainSets.set(key, set);
  for (const other of chainSets.values()) other.group.visible = other === set;
  ({ strands, pendantPivot } = set);
}

// Chain swing, per bot: one damped spring per strand (sideways tilt, fore-aft tilt, drop) driven by
// the body's acceleration, and a looser one for the pendant. Lower strands are heavier and looser.
// Sized from the bot's own look, not the set drawn last: bots on a page can wear different counts.
function stepChains(b, dt, count) {
  if (!count) { b.chains = null; return; }
  if (!b.chains || b.chains.length !== count + 1)
    b.chains = Array.from({ length: count + 1 }, () => ({ z: 0, vz: 0, x: 0, vx: 0, y: 0, vy: 0 }));
  for (let left = dt; left > 0; left -= 1 / 60) {
    const h = Math.min(left, 1 / 60);
    b.chains.forEach((c, i) => {
      const pendant = i === count;
      const k = pendant ? 24 : 52 - i * 8, damp = pendant ? 2.4 : 3.6 - i * 0.3;
      // Accelerating one way leaves the chain behind; going up leaves it low, landing throws it up.
      c.vz += (-k * c.z - damp * c.vz + b.ax * (pendant ? 0.45 : 0.28)) * h;
      c.vx += (-k * c.x - damp * c.vx + b.ay * (pendant ? 0.35 : 0.1)) * h;
      c.vy += (-k * c.y - damp * c.vy - b.ay * 0.18) * h;
      c.z = clampN(c.z + c.vz * h, -0.4, 0.4);
      c.x = clampN(c.x + c.vx * h, -0.45, 0.45);
      c.y = clampN(c.y + c.vy * h, -0.16, 0.12);
    });
  }
}
function poseChains(b) {
  const state = b.chains && b.chains.length === strands.length + 1 ? b.chains : null;
  strands.forEach((strand, i) => {
    const c = state ? state[i] : null;
    strand.rotation.set(c ? c.x : 0, 0, c ? c.z : 0);
    strand.position.y = c ? c.y : 0;
  });
  if (pendantPivot) {
    const p = state ? state[strands.length] : null;
    pendantPivot.rotation.set(p ? p.x : 0, 0, p ? p.z : 0);
  }
}

// A soft contact shadow on the floor, smaller and fainter while it's in the air.
const shadowMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
shadowMat.colorNode = color(0x000000);
shadowMat.opacityNode = Fn(() => {
  const r = length(uv().sub(0.5)).mul(2);
  return float(1).sub(smoothstep(0.15, 1, r)).mul(U.shadow);
})();
const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.25, 48), shadowMat);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.005;
scene.add(shadow);

// ---------- posing ----------
const ray = new THREE.Raycaster();
const hitSphere = new THREE.Sphere(new THREE.Vector3(), 1.25);
const tmpV = new THREE.Vector3(), tmp2 = new THREE.Vector2();
function brushNormal(x, y, target) {
  ray.setFromCamera(tmp2.set(x, y), camera);
  if (!ray.ray.intersectSphere(hitSphere, target)) return false;
  body.worldToLocal(target).normalize();
  return true;
}
function pose(b) {
  const s = b.s;
  rig.position.y = s.hop * 2.4;
  rig.rotation.z = -s.leanAll * 1.5;
  const sq = s.squash;
  const [headWidth, headHeight] = HEAD_SHAPES[appearance.fur.headShape];
  squashG.scale.set((1 + sq) * headWidth, (1 - sq) * headHeight, 1 + sq);
  const nod = Math.abs(s.inspect);
  const view = b.host.getAttribute('view');
  const yaw = view ? viewYaw(b) + s.lean * 0.2 : s.lean * 3.2;
  body.rotation.set(-s.ly * 0.12 + nod * 0.10 + (s.chin || 0) * 0.16, yaw, 0);
  // The frame follows the head through squash and tilt, then slides forward down the nose.
  eyewear.position.set(0, (body.position.y - (body.position.y + 0.21) * sq) * headHeight - s.glassesDown * 0.25, s.glassesDown * 0.17);
  eyewear.scale.set(headWidth * appearance.glasses.size, appearance.glasses.size, appearance.glasses.size);
  eyewear.rotation.copy(body.rotation);
  eyewear.rotateX(s.glassesDown * 0.08);
  for (const e of eyes) {
    e.ball.rotation.set(0.06 - s.ly * 0.42 - nod * 0.16 - (s.chin || 0) * 0.22, e.yaw + s.lx * 0.5, 0);  // eyes stay up when the chin drops
    const wink = Math.max(0, e.side * s.wink);
    const shut = Math.max(s.blink, s.squint, s.sleep);
    const styling = appearance.face.styling === 'feminine' ? 0.08 : appearance.face.styling === 'masculine' ? -0.07 : 0;
    const sleepy = appearance.face.eyeType === 'sleepy' ? -0.22 : 0;
    const brow = s.lidTop + sleepy + styling - e.side * 0.06 + e.side * s.inspect * 0.23;
    // Both lids meet across the eye in a wink so the closed crease stays visible.
    const top = lerp(lerp(lerp(brow, 1.05, s.wide) - s.joy * 0.12, -1.02, shut), -0.36, wink);
    const bottom = lerp(lerp(-1.05, -0.7, s.joy), -0.29, wink);
    e.upper.rotation.x = -Math.asin(clampN(top, -1, 1));
    e.lower.rotation.x = -Math.asin(clampN(bottom, -1, 1));
    e.slant.rotation.z = -e.side * s.lidSlant * 0.55 * (1 - Math.max(shut, wink));
  }
  U.pupil.value = s.pupil;
  poseChains(b);
  shadow.scale.setScalar(1 - s.hop * 0.9);
  U.shadow.value = Math.max(0, 0.34 * (1 - s.hop * 2.4)) * (isDark() ? 0.8 : 1);
  rig.updateMatrixWorld(true);
}

function viewYaw(b) { return b.viewYaw || 0; }
const turning = (b) => Math.abs((b.viewTo ?? 0) - (b.viewYaw || 0)) > 1e-4 || Math.abs(b.viewVel || 0) > 1e-4;
function stepView(b, dt) {
  if (!turning(b)) { b.viewYaw = b.viewTo ?? 0; b.viewVel = 0; return; }
  for (let left = Math.min(dt, 0.25); left > 0; left -= 1 / 120) {
    const h = Math.min(left, 1 / 120);
    b.viewVel += (-VIEW_SPRING.stiffness * (b.viewYaw - b.viewTo) - VIEW_SPRING.damping * b.viewVel) * h;
    b.viewYaw += b.viewVel * h;
  }
}
function snapView(b, angle) { b.viewYaw = b.viewTo = angle; b.viewVel = 0; }

// ---------- drawing ----------
let clockT = 0;
function draw(b, dt) {
  const selected = window.companionBotAppearance.forHost(b.host);
  if (configuredAppearance !== selected) configureAppearance(selected);
  pose(b);
  const N = SIDE;
  U.time.value = reduce.matches ? 0 : clockT;
  U.motion.value = reduce.matches ? 0 : 1;
  U.dark.value = isDark() ? 1 : 0;
  U.face.value.set(b.s.nose, b.s.smile, b.s.mouth * appearance.personality.mouthMovement);
  U.teeth.value = b.s.teeth || 0;
  U.browTilt.value = b.s.browTilt || 0; U.browLift.value = b.s.browLift || 0; U.browAsym.value = b.s.browAsym || 0;
  U.furrow.value = b.s.furrow || 0;
  U.density.value = clampN(N * 0.2, 14, 52);  // hair about a pixel and a half wide at any size
  U.shells.value = N < 100 ? 24 : N < 170 ? 34 : SHELLS;
  fur.count = U.shells.value;
  rim.intensity = isDark() ? 1.4 : 1.1;
  if (GPU) U.slot.value = b.slot;
  if (GPU && dt > 0) {
    // Hair physics: the body's acceleration, in its own frame, and the pointer where it crosses the fur.
    SIM.accel.value.set(b.ax, b.ay, 0);
    SIM.brushV.value.set(0, 0, 0);
    if (b.brushOn) {
      body.getWorldPosition(hitSphere.center);
      if (brushNormal(b.bx, b.by, SIM.brushAt.value) && brushNormal(b.lbx, b.lby, tmpV)) {
        SIM.brushV.value.copy(SIM.brushAt.value).sub(tmpV).multiplyScalar(1 / b.brushGap).clampLength(0, 6);
      }
      b.brushOn = false;
    }
    const steps = Math.min(4, Math.max(1, Math.ceil(dt * 60)));
    SIM.dt.value = Math.min(dt, 1 / 15) / steps;
    for (let i = 0; i < steps; i++) renderer.compute(simulate);
  } else if (!GPU) {
    U.swing.value.set(b.s.fx * 2.4 + b.s.brx * 2, b.s.fy * 2.4 + b.s.bry * 2, 0);
  }
  renderer.render(scene, camera);
  b.ctx.clearRect(0, 0, b.n, b.n);
  b.ctx.drawImage(renderer.domElement, 0, 0, N, N, 0, 0, b.n, b.n);
}

// ---------- behaviour (as before: moods, glances, blinks, hops, fidgets, poses) ----------
let mood = (window.companionBot && window.companionBot.pending) || 'idle';
const live = new Set();
const kept = new Map();  // a bot drawn again under the same name carries on where it was
const GAZE = { left: [-1, -0.15], right: [1, -0.15], down: [0, -0.6] };
const freeSlots = Array.from({ length: SLOTS }, (_, i) => i);
function makeBot() {
  return { s: { lx: 0, ly: 0.3, tx: 0, ty: 0.3, blink: 0, sleep: mood === 'sleeping' ? 1 : 0, hop: 0, squash: 0,
    lean: 0, leanV: 0, leanAll: 0, fx: 0, fy: 0, fvx: 0, fvy: 0, squint: 0, wide: 0, joy: 0,
    inspect: 0, glassesDown: 0, wink: 0,
    nose: 0, smile: 0, mouth: 0, brx: 0, bry: 0, brvx: 0, brvy: 0,
    lidTop: 0.72, lidSlant: 0.18, pupil: 0.40,
    teeth: 0, browTilt: 0, browLift: 0, browAsym: 0, furrow: 0, chin: 0 },
  nextLook: 0, nextBlink: rand(0.8, 3), blinkAt: -9, hopAt: -1, attnUntil: 0, prevHop: 0, hopDir: 1, poke: false, joyAt: -9,
  nextFidget: performance.now() / 1000 + rand(5, 9), fidget: null, fidgetAt: -9, fidgetSide: 1,
  bx: 9, by: 9, bt: -Infinity, brushOn: false,
  ax: 0, ay: 0, pvx: 0, pvy: 0, ppx: 0, ppy: 0, slot: 0 };
}

// One hop, 0.78s: crouch to wind up (anticipation), spring out and stretch on take-off, round off at
// the top, stretch into the fall, squash on landing and wobble to rest.
const HOP = 0.78, CROUCH = 0.22, LAND = 0.8;
function hopPose(k) {
  if (k < CROUCH) return [0, 0.2 * Math.sin((k / CROUCH) * Math.PI / 2)];
  if (k < LAND) {
    const u = (k - CROUCH) / (LAND - CROUCH);
    const sq = -0.12 * Math.abs(Math.cos(Math.PI * u));
    return [0.17 * Math.sin(Math.PI * u), 0.2 + (sq - 0.2) * Math.min(1, u / 0.12)];
  }
  const u = (k - LAND) / (1 - LAND);
  return [0, 0.24 * Math.exp(-u * 4) * Math.cos(u * 7)];
}

function fidgetEase(t, start, end) {
  const u = clampN((t - start) / (end - start), 0, 1);
  return u * u * (3 - 2 * u);
}

// Timed faces (express(host, 'angry' | 'scary')): where the lids, pupils, mouth and nose go, how
// long it's held, and how hard the head shakes. Lid slant below 0 slopes the lids into a V (a brow).
// `gaze` is where it looks ([x, y], x mirrored to a random side); without one it glares at you.
// `shades`: how far it pulls its glasses down the nose to glare over them (0 to 1), so the brow
// shows past the frame's top bar.
const FACES = {
  // angry: the snarl. Eyes squeezed to slits under a crushed brow, nose scrunched, gritted teeth
  // in a wide grimace (`teeth` 0 to 1 shows them).
  // `brow`: [tilt, lift, one-side raise] (see browMask); `furrow`: creases 0 to 1; `chin`: head
  // pitched down while the eyes stay on you (a glare from under the brow).
  angry: { duration: 2.6, lid: 0.12, slant: -1.35, pupil: 0.26, smile: -0.08, nose: -0.13, mouth: 0.5, teeth: 1, shake: 0.006, shakeHz: 38, shades: 0.75,
    brow: [1.1, -0.06, 0], furrow: 1, chin: 0.6 },
  // scary: a roar baring both rows, under a hard scowl (wide-open lids would read as surprise), pupils pinned
  scary: { duration: 1.9, lid: 0.6, slant: -1.3, pupil: 0.14, smile: -0.06, nose: -0.1, mouth: 1.1, teeth: 1, shake: 0.03, shakeHz: 26, shades: 0.85,
    brow: [1.2, -0.04, 0], furrow: 1, chin: 0.35 },
  // skeptical: narrowed eyes cut hard to one side, mouth flat
  sideEye: { duration: 2.2, lid: 0.4, slant: -0.3, pupil: 0.32, smile: -0.02, nose: -0.03, mouth: 0, shake: 0, shakeHz: 0, gaze: [0.95, 0.12], shades: 0.35,
    brow: [0.35, -0.01, 0.055], furrow: 0.3, chin: 0.15 },
  // lecture: telling you off. A hard stare at you, mouth working as it talks (`talk`), and the head
  // jabbing forward on the emphasis.
  lecture: { duration: 2.8, lid: 0.45, slant: -0.95, pupil: 0.3, smile: -0.03, nose: -0.06, mouth: 0.12, talk: 0.3, shake: 0, shakeHz: 0, shades: 0.5,
    brow: [0.85, -0.04, 0], furrow: 0.7, chin: 0.3 },
  // disapproving: a slow head shake with a frown, eyes down and heavy-lidded
  disapprove: { duration: 2.4, lid: 0.3, slant: -0.6, pupil: 0.34, smile: -0.07, nose: -0.05, mouth: 0.05, shake: 0.06, shakeHz: 7, gaze: [0, -0.1], shades: 0.55,
    brow: [0.6, -0.035, 0], furrow: 0.5, chin: 0.45 },
};
// Resting faces (personality.temper): [lid, slant, pupil, smile, nose], brows [tilt, lift], creases.
const TEMPERS = { soft: [0.72, 0.22, 0.40, 0, 0], grumpy: [0.42, -0.8, 0.34, -0.04, -0.03] };
// At rest the brows sit high enough to clear the top bar of most frames.
const REST_BROWS = { soft: [-0.3, 0.045, 0], grumpy: [0.55, 0.03, 0.35] };
// What a bot does now and then while idle, in turn. A grumpy one works the tough faces in.
const FIDGETS = { soft: ['examine', 'wink'], grumpy: ['examine', 'angry', 'lecture', 'wink', 'sideEye', 'scary', 'disapprove'] };
function activeFace(b, t) {
  if (!b.face) return null;
  const F = FACES[b.face.kind], e = t - b.face.at;
  if (e > F.duration) { b.face = null; return null; }
  return { F, e, side: b.face.side, w: Math.min(1, e / 0.12) * Math.min(1, (F.duration - e) / 0.35) };  // quick in, eased out
}

function tick(b, t, dt, focal) {
  const appearance = window.companionBotAppearance.forHost(b.host);
  const botMood = b.host.hasAttribute('preview') ? 'idle' : mood;
  const s = b.s, asleep = botMood === 'sleeping';
  const face = asleep ? null : activeFace(b, t);
  const rest = TEMPERS[appearance.personality.temper] || TEMPERS.soft;
  s.sleep += ((asleep ? 1 : 0) - s.sleep) * ease(4, dt);
  if (asleep) { s.tx = 0; s.ty = -0.4; }
  else if (face) [s.tx, s.ty] = face.F.gaze ? [face.F.gaze[0] * face.side, face.F.gaze[1]] : [0, 0.22];  // default: glares at you
  else if (t > b.nextLook && t > b.attnUntil) {
    const glance = Math.random() < 0.3;
    if (botMood === 'working') [s.tx, s.ty] = glance ? [rand(-1, 1), rand(-0.2, 0.4)] : [rand(-0.3, 0.3), -0.45];
    else if (b.gaze && Math.random() < 0.65) [s.tx, s.ty] = [b.gaze[0] + rand(-0.2, 0.15), b.gaze[1] + rand(-0.25, 0.25)];
    else [s.tx, s.ty] = Math.random() < 0.3 ? [0, 0.3] : [rand(-1, 1), rand(-0.4, 0.9)];  // mostly up, at you
    b.nextLook = t + rand(1.2, 3.6);
  }
  // Only the main visible mascot fidgets. The gaze leads, then the head and glasses follow.
  if (appearance.personality.idleGestures && botMood === 'idle' && !face && focal && b.hopAt < 0 && t - b.joyAt > 0.3 && t > b.nextFidget && t - b.blinkAt > 0.16) {
    const turns = FIDGETS[appearance.personality.temper] || FIDGETS.soft;
    b.fidgetTurn = ((b.fidgetTurn ?? -1) + 1) % turns.length;
    const next = turns[b.fidgetTurn];
    b.fidgetSide = Math.random() < 0.5 ? -1 : 1;
    b.nextFidget = t + rand(9, 16);
    if (FACES[next]) {
      b.face = { kind: next, at: t, side: b.fidgetSide };
      b.fidget = null;
      b.nextBlink = Math.max(b.nextBlink, t + 0.8);
    } else {
      b.fidget = next;
      b.fidgetAt = t;
      b.nextBlink = Math.max(b.nextBlink, t + (b.fidget === 'wink' ? 0.36 : 1.55));
    }
  }
  const fidgetTime = botMood === 'idle' && b.hopAt < 0 ? t - b.fidgetAt : Infinity;
  const exam = b.fidget === 'examine' ? fidgetTime : Infinity;
  const peek = fidgetEase(exam, 0, 0.21) * (1 - fidgetEase(exam, 1.0, 1.48));
  const tilt = fidgetEase(exam, 0.06, 0.38) * (1 - fidgetEase(exam, 1.1, 1.5));
  const slide = fidgetEase(exam, 0.14, 0.46) * (1 - fidgetEase(exam, 1.17, 1.58));
  const readingX = lerp(-0.26, 0.26, fidgetEase(exam, 0.4, 0.97));
  s.inspect += (b.fidgetSide * tilt - s.inspect) * ease(24, dt);
  s.glassesDown += (Math.max(slide, face ? face.F.shades * face.w : 0) - s.glassesDown) * ease(20, dt);
  s.wink = b.fidget === 'wink' && fidgetTime < 0.28
    ? b.fidgetSide * fidgetEase(fidgetTime, 0, 0.09) * (1 - fidgetEase(fidgetTime, 0.09, 0.28)) : 0;
  const previousLookY = s.ly;
  s.lx += (lerp(s.tx, readingX, peek) - s.lx) * ease(16, dt);
  s.ly += (lerp(s.ty, -0.78, peek) - s.ly) * ease(16, dt);
  // Its expression: soft and a little pleading at rest, wide-eyed with big pupils when your pointer
  // has its interest, and intent while it works.
  const interested = t < b.attnUntil;
  let [lidTo, slantTo, pupilTo] = botMood === 'working' ? [0.55, -0.15, 0.34] : interested ? [0.9, 0.08, 0.46] : rest;
  if (face) {
    lidTo = lerp(lidTo, face.F.lid, face.w); slantTo = lerp(slantTo, face.F.slant, face.w); pupilTo = lerp(pupilTo, face.F.pupil, face.w);
  }
  const faceRate = face ? 3 : 1;  // a face snaps on; moods drift
  s.lidTop += (lidTo - s.lidTop) * ease(5 * faceRate, dt);
  s.lidSlant += (slantTo - s.lidSlant) * ease(5 * faceRate, dt);
  s.pupil += (pupilTo - s.pupil) * ease(4 * faceRate, dt);
  // Brows, creases and chin: from the face, else the mood, else the resting temper.
  const restBrow = REST_BROWS[appearance.personality.temper] || REST_BROWS.soft;
  let [tiltTo, liftTo] = botMood === 'working' ? [0.35, -0.01] : interested ? [-0.15, 0.025] : restBrow;
  let asymTo = 0, furrowTo = botMood === 'working' ? 0.15 : restBrow[2], chinTo = 0;
  liftTo += 0.035 * peek + 0.04 * s.wide;  // brows go up peering over the glasses, and in the air
  if (face && face.F.brow) {
    tiltTo = lerp(tiltTo, face.F.brow[0], face.w); liftTo = lerp(liftTo, face.F.brow[1], face.w);
    asymTo = face.F.brow[2] * face.side * face.w;
    furrowTo = lerp(furrowTo, face.F.furrow, face.w); chinTo = face.F.chin * face.w;
  }
  const browRate = ease(10 * faceRate, dt);
  s.browTilt += (tiltTo - s.browTilt) * browRate;
  s.browLift += (liftTo - s.browLift) * browRate;
  s.browAsym += (asymTo - s.browAsym) * browRate;
  s.furrow += (furrowTo - s.furrow) * browRate;
  s.chin += (chinTo - s.chin) * ease(8, dt);

  if (!asleep && t > b.nextBlink) {
    b.blinkAt = t;
    b.nextBlink = t + (Math.random() < 0.2 ? 0.3 : rand(2.2, 5.5)) / appearance.personality.blinkRate;
  }
  const bk = (t - b.blinkAt) / 0.16;
  s.blink = bk >= 0 && bk <= 1 ? Math.sin(Math.PI * bk) : 0;

  let hop = 0, squash = asleep ? Math.sin(t * 1.3) * 0.04 : Math.sin(t * 2.4) * 0.015;  // breathing
  let squint = 0, wide = 0, hopLean = 0;
  if (b.hopAt >= 0 && t >= b.hopAt) {
    const k = (t - b.hopAt) / HOP;
    if (k >= 1) {
      b.hopAt = -1; b.hopDir = -b.hopDir;
      if (b.poke) { b.poke = false; b.joyAt = t; }  // poked: it lands pleased with itself
    } else {
      const [hh, sq] = hopPose(k); hop = hh; squash += sq;
      const air = (k - CROUCH) / (LAND - CROUCH);
      // It narrows its eyes as it gathers itself, opens them wide in the air, and leans to one side and
      // back so the hop travels an arc; the next hop leans the other way.
      if (k < CROUCH) squint = (b.poke ? 0.22 : 0.5) * Math.sin((k / CROUCH) * Math.PI / 2);
      else if (air < 1) { wide = Math.sin(Math.PI * air); hopLean = b.hopDir * 0.07 * wide; }
    }
  }
  s.hop = hop; s.squash = squash; s.squint = squint; s.wide = wide;
  const j = (t - b.joyAt) / 0.3;
  s.joy = j >= 0 && j < 1 ? Math.sin(Math.PI * j) : 0;
  const vy = dt > 0 ? (hop - b.prevHop) / dt : 0;
  b.prevHop = hop;
  // The body leans and turns toward where the eyes look, a beat behind them.
  let leanTo = asleep ? 0 : s.lx * 0.09 + hopLean;
  if (face) {
    // angry trembles; scary shakes its head hard, settling as the roar runs out
    const decay = face.F === FACES.scary ? Math.max(0, 1 - face.e / 1.3) : 1;
    leanTo += face.F.shake * face.w * decay * Math.sin(t * face.F.shakeHz);
    if (face.F === FACES.scary) s.squash -= 0.05 * face.w;  // puffs itself up taller
    if (face.F.talk) s.squash -= 0.03 * face.w * Math.abs(Math.sin(t * 4.3));  // jabs on each word
  }
  for (let left = dt; left > 0; left -= 1 / 60) {
    const h = Math.min(left, 1 / 60);
    s.leanV += (-70 * (s.lean - leanTo) - 11 * s.leanV) * h;
    s.lean += s.leanV * h;
  }
  // The nose follows the crouch and lift, and the smile follows the landing.
  s.nose += (0.055 * s.wide - 0.095 * s.squint + 0.031 * s.joy - 0.018 * peek + rest[4] - s.nose) * ease(17, dt);
  s.smile += (0.09 * s.joy + 0.035 * Math.abs(s.wink) + 0.023 * peek + rest[3] - s.smile) * ease(13, dt);
  const allFrom = s.leanAll;
  s.leanAll = s.lean + s.inspect * 0.08;
  const vx = dt > 0 ? (s.leanAll - allFrom) / dt * 0.8 : 0;
  const pitchSpeed = dt > 0 ? (s.ly - previousLookY) * 0.12 / dt : 0;
  const turnOpening = asleep ? 0 : clampN((Math.hypot(vx * 4, pitchSpeed) - 0.1) * 0.32, 0, 0.4);
  s.mouth += (Math.max(0.65 * s.wide, turnOpening) - s.mouth) * ease(15, dt);
  s.teeth = (s.teeth || 0) + ((face ? (face.F.teeth || 0) * face.w : 0) - (s.teeth || 0)) * ease(18, dt);
  if (face) {
    const roar = face.F === FACES.scary ? 0.85 + 0.15 * Math.sin(t * 30) : 1;  // the roar flutters
    s.smile = lerp(s.smile, face.F.smile, face.w);
    s.nose = lerp(s.nose, face.F.nose, face.w);
    const talking = face.F.talk ? face.F.talk * Math.abs(Math.sin(t * 8.6)) : 0;  // syllables
    s.mouth = lerp(s.mouth, face.F.mouth * roar + talking, face.w);
  }
  // The body's acceleration drives the GPU hair; the WebGL swing follows its velocity.
  const px = s.leanAll * 1.5 * 2, py = hop * 2.4;  // where the head is, in model units
  const pvx = dt > 0 ? (px - b.ppx) / dt : 0, pvy = dt > 0 ? (py - b.ppy) / dt : 0;
  b.ax = clampN(dt > 0 ? (pvx - b.pvx) / dt : 0, -90, 90) * 0.5;
  b.ay = clampN(dt > 0 ? (pvy - b.pvy) / dt : 0, -90, 90) * 0.5;
  b.ppx = px; b.ppy = py; b.pvx = pvx; b.pvy = pvy;
  stepChains(b, dt, Math.round(appearance.jewelry.chains));
  const fxTo = clampN(-vx * 0.08, -0.13, 0.13), fyTo = clampN(-vy * 0.08 - s.sleep * 0.02, -0.13, 0.13);
  for (let left = dt; left > 0; left -= 1 / 60) {
    const h = Math.min(left, 1 / 60);
    s.fvx += (120 * (fxTo - s.fx) - 9 * s.fvx) * h; s.fx += s.fvx * h;
    s.fvy += (120 * (fyTo - s.fy) - 9 * s.fvy) * h; s.fy += s.fvy * h;
    s.brvx += (-110 * s.brx - 7 * s.brvx) * h; s.brx = clampN(s.brx + s.brvx * h, -0.14, 0.14);
    s.brvy += (-110 * s.bry - 7 * s.brvy) * h; s.bry = clampN(s.bry + s.brvy * h, -0.14, 0.14);
  }
}

function still(b) {  // reduced motion: one pose per mood, no wandering
  const zz = !b.host.hasAttribute('preview') && mood === 'sleeping', g = b.gaze || [0, 0.3];
  Object.assign(b.s, { lx: zz ? 0 : g[0] * 0.8, ly: zz ? -0.4 : g[1], blink: 0, hop: 0, squash: 0,
    sleep: zz ? 1 : 0, lean: 0, leanAll: 0, fx: 0, fy: zz ? -0.02 : 0, squint: 0, wide: 0, joy: 0,
    inspect: 0, glassesDown: 0, wink: 0,
    nose: 0, smile: 0, mouth: 0, brx: 0, bry: 0, lidTop: mood === 'working' ? 0.55 : 0.72,
    lidSlant: mood === 'working' ? -0.15 : 0.22, pupil: 0.40 });
  b.brushOn = false;
  b.ax = b.ay = 0;
  b.chains = null;  // chains hang at rest
  if (b.previewExpression === 'wink') Object.assign(b.s, { wink: 1, smile: 0.035 });
  if (b.previewExpression === 'examine') Object.assign(b.s, { lx: 0, ly: -0.78, inspect: 0.65, glassesDown: 0.85, nose: -0.018, smile: 0.023 });
  const F = FACES[b.previewExpression];
  b.s.teeth = F ? F.teeth || 0 : 0;
  const restBrow = REST_BROWS[window.companionBotAppearance.forHost(b.host).personality.temper] || REST_BROWS.soft;
  const browPose = F && F.brow ? F.brow : [restBrow[0], restBrow[1], 0];
  Object.assign(b.s, { browTilt: browPose[0], browLift: browPose[1], browAsym: browPose[2], furrow: F ? F.furrow || 0 : restBrow[2], chin: F ? F.chin || 0 : 0 });
  if (F) Object.assign(b.s, { lidTop: F.lid, lidSlant: F.slant, pupil: F.pupil, smile: F.smile, nose: F.nose, mouth: F.mouth, glassesDown: F.shades,
    lx: F.gaze ? F.gaze[0] : 0, ly: F.gaze ? F.gaze[1] : 0.22 });
  // reduced motion still shows its resting temper
  const rest = TEMPERS[window.companionBotAppearance.forHost(b.host).personality.temper];
  if (!F && !zz && mood !== 'working' && rest && !b.previewExpression)
    Object.assign(b.s, { lidTop: rest[0], lidSlant: rest[1], pupil: rest[2], smile: rest[3], nose: rest[4] });
}
const shown = (b) => b.host.getClientRects().length > 0;  // false inside a hidden view

// They only animate while the tab is showing; a hidden tab gets no frames at all.
let last = performance.now(), lastDraw = -1e9, raf = 0;
function frame(now) {
  raf = 0;
  if (reduce.matches) return drawAllStill();
  if (document.hidden) return;
  // About 30 frames a second is plenty, except while a bot turns to a new angle: then every frame.
  if (now - lastDraw < 32 && ![...live].some(turning)) return schedule();
  // Never below zero: a frame's timestamp can be earlier than the clock read when the loop started
  // (seen by 1.3 s in a lazily loaded iframe), and a negative step makes the eases overshoot wildly.
  const t = now / 1000, dt = Math.max(0, Math.min(1.5, (now - last) / 1000));
  last = lastDraw = now;
  clockT = t % 1000;
  let focal = null;
  for (const b of live) if (shown(b) && (!focal || b.n > focal.n)) focal = b;
  sizeTo(Math.max(64, ...[...live].filter(shown).map((b) => b.n)));
  for (const b of live) { tick(b, t, dt, b === focal); stepView(b, dt); if (shown(b)) draw(b, dt); }
  schedule();
}
function schedule() {
  if (live.size && !reduce.matches && !document.hidden && !raf) raf = requestAnimationFrame(frame);
}
function drawAllStill() {
  sizeTo(Math.max(64, ...[...live].map((b) => b.n)));
  live.forEach((b) => { still(b); draw(b, 0); });
}
function restart() {
  cancelAnimationFrame(raf); raf = 0;
  last = performance.now();
  if (reduce.matches) drawAllStill(); else schedule();
}
document.addEventListener('visibilitychange', restart);
reduce.addEventListener('change', restart);
addEventListener('companionbotthemechange', () => { if (reduce.matches) drawAllStill(); });

// Each one notices the pointer, and the pointer brushes its fur where it passes over.
addEventListener('pointermove', (e) => {
  if (reduce.matches || mood === 'sleeping') return;
  const t = performance.now() / 1000;
  for (const b of live) {
    const r = b.host.getBoundingClientRect();
    if (!r.width) continue;
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const k = Math.min(1, Math.hypot(dx, dy) / (160 + r.width)) / Math.max(1, Math.hypot(dx, dy));
    [b.s.tx, b.s.ty] = [dx * k, -dy * k];
    b.attnUntil = t + 1.4;
    const x = dx / (r.width / 2), y = -dy / (r.height / 2);
    const gap = t - b.bt;
    if (Math.abs(x) >= 1 || Math.abs(y) >= 1) {
      b.bt = -Infinity;
      b.brushOn = false;
      continue;
    }
    b.brushGap = Math.max(0.008, gap);
    b.brushOn = gap < 0.2;
    b.lbx = b.bx; b.lby = b.by;
    b.bx = x; b.by = y; b.bt = t;
    if (!GPU && b.brushOn) {
      b.s.brvx += clampN((x - b.lbx) / b.brushGap, -3, 3) * 0.35;
      b.s.brvy += clampN((y - b.lby) / b.brushGap, -3, 3) * 0.35;
    }
  }
}, { passive: true });

// <companion-bot size="72" name="allclear" gaze="left" hop>: size in CSS pixels; name keeps its place across
// re-renders; gaze is where it tends to look when idle; hop jumps once on arrival.
customElements.define('companion-bot', class extends HTMLElement {
  static get observedAttributes() { return ['view']; }
  attributeChangedCallback(name, previous, value) {
    if (!this.bot || previous === value) return;
    const b = this.bot, to = VIEW_ANGLES[value] || 0;
    if (reduce.matches || b.instantView || !shown(b)) snapView(b, to);
    else b.viewTo = to;  // the frame loop springs it there
    sizeTo(Math.max(SIDE, this.bot.n));
    draw(this.bot, 0);
    schedule();
  }
  connectedCallback() {
    const size = Number(this.getAttribute('size')) || 32;
    this.style.width = this.style.height = `${size}px`;
    const name = this.getAttribute('name');
    const b = (name && kept.get(name)) || makeBot();
    if (name) kept.set(name, b);
    if (!live.has(b)) b.slot = freeSlots.length ? freeSlots.shift() : 0;
    b.host = this;
    snapView(b, VIEW_ANGLES[this.getAttribute('view')] || 0);
    b.gaze = GAZE[this.getAttribute('gaze')] || null;
    b.n = Math.min(this.hasAttribute('preview') ? 512 : 256, Math.max(2 * size, Math.round(size * devicePixelRatio)));
    const canvas = Object.assign(document.createElement('canvas'), { width: b.n, height: b.n });
    b.ctx = canvas.getContext('2d');
    canvas.addEventListener('click', () => {
      if (reduce.matches || mood === 'sleeping') return;
      if (b.hopAt < 0) {
        b.hopAt = performance.now() / 1000;
        b.poke = true;
        b.nextBlink = Math.max(b.nextBlink, b.hopAt + HOP + 0.35);
      }
    });
    this.replaceChildren(canvas);
    if (this.hasAttribute('hop') && mood !== 'sleeping' && !reduce.matches) b.hopAt = performance.now() / 1000 + 0.25;
    this.bot = b;
    live.add(b);
    if (reduce.matches) still(b);
    sizeTo(Math.max(SIDE, b.n));
    if (reduce.matches || shown(b)) draw(b, 0);  // paint reduced-motion bots even before their view opens
    schedule();
  }
  disconnectedCallback() {
    const b = this.bot;
    if (!b || b.host !== this) return;
    live.delete(b);
    if (!b.host.isConnected) freeSlots.push(b.slot);
  }
});

function recolor(target, original, baseline, selected) {
  const base = new THREE.Color(baseline).getHSL({}), next = new THREE.Color(selected).getHSL({});
  target.copy(new THREE.Color(original)).offsetHSL(next.h - base.h, next.s - base.s, next.l - base.l);
}
function configureAppearance(values) {
  appearance = configuredAppearance = values;
  for (const name of ['root', 'mid', 'tip', 'warmTip', 'fuzz', 'skin', 'muzzle'])
    recolor(C[name].value, PALETTE[name], 0xfa4900, appearance.fur.color);
  for (const name of ['irisIn', 'irisOut', 'ring'])
    recolor(C[name].value, PALETTE[name], 0x995a2f, appearance.face.eyeColor);
  for (const name of ['beardRoot', 'beardTip'])
    recolor(C[name].value, PALETTE[name], 0x884423, appearance.fur.hairColor);
  U.furLen.value = appearance.fur.length;
  U.beardStrength.value = appearance.fur.beard * ({ none: 0, stubble: 0.35, full: 1, goatee: 1 }[appearance.fur.beardStyle]);
  U.goatee.value = appearance.fur.beardStyle === 'goatee' ? 1 : 0;
  U.jaw.value = appearance.face.styling === 'masculine' ? 0.075 : appearance.face.styling === 'feminine' ? -0.05 : 0;
  U.crown.value = HEAD_SHAPES[appearance.fur.headShape][2];
  const [width, length, offset] = noseProfiles[appearance.face.noseType].root;
  U.noseWidth.value = width; U.noseLength.value = length; U.noseOffset.value = offset;
  noseSkin.geometry = noseFur.geometry = geometryForNose(appearance.face.noseType);

  for (const eye of eyes) {
    eye.group.scale.copy(eye.baseScale).multiplyScalar(appearance.face.eyeSize);
    if (appearance.face.eyeType === 'almond') { eye.group.scale.x *= 1.08; eye.group.scale.y *= 0.85; }
    eye.lashes.visible = appearance.face.styling === 'feminine';
  }
  eyewear.visible = appearance.glasses.style !== 'none';
  if (eyewear.visible) {
    glasses.geometry = glassesGeometry(appearance.glasses.style);
    const catalog = window.companionBotAppearance.frameCatalog.find(frame => frame.id === appearance.glasses.style);
    const arms = catalog ? templeGeometries(catalog) : legacyTemples;
    temples.forEach((temple, i) => { temple.geometry = arms[i]; });
  }
  recolor(U.frameDark.value, 0x391c15, 0xa56232, appearance.glasses.frameColor);
  U.frameLight.value.set(appearance.glasses.frameColor);
  U.frameFinish.value = { solid: 0, tortoise: 1, crystal: 2, paradox: 3, metal: 4 }[appearance.glasses.finish];
  const crystal = appearance.glasses.finish === 'crystal', metal = appearance.glasses.finish === 'metal';
  U.transmission.value = appearance.glasses.finish === 'solid' || metal ? 0 : appearance.glasses.transparency + (crystal ? .4 : 0);
  tortoiseFront.metalness = tortoiseArm.metalness = metal ? 1 : 0;
  tortoiseFront.roughness = metal ? clampN(0.34 - appearance.glasses.shine * 0.1, 0.12, 0.4)
    : clampN(0.49 - appearance.glasses.shine * 0.12 - (crystal ? .1 : 0), 0.18, 0.6);
  tortoiseArm.roughness = metal ? tortoiseFront.roughness : 0.88;
  tortoiseFront.clearcoat = appearance.glasses.shine * 0.18 + (crystal ? .12 : 0);

  U.lensTint.value = appearance.glasses.tint;
  U.lensColor.value.set(appearance.glasses.lensColor);
  lenses.visible = eyewear.visible && appearance.glasses.tint > 0.01;
  if (lenses.visible) lenses.geometry = lensGeometry(appearance.glasses.style);

  U.mohawk.value = appearance.fur.hairStyle === 'mohawk' ? 1 : 0;
  U.brows.value = appearance.face.eyebrows ? 1 : 0;
  U.chainColor.value.set(appearance.jewelry.chainColor);
  const chainCount = Math.round(appearance.jewelry.chains);  // a config default may not be a whole number
  U.neckline.value = chainCount > 0 ? 1 : 0;
  const furDepth = appearance.fur.hairStyle === 'mohawk' ? 0.1 : Math.round((appearance.fur.length * 0.7 + 0.02) * 100) / 100;
  showChains(chainCount, furDepth);
}
function refreshAppearance(previewOnly = false) {
  for (const b of live) if (shown(b) && (!previewOnly || b.host.hasAttribute('preview'))) draw(b, 0);
  schedule();
}
addEventListener('companionbotappearancechange', () => refreshAppearance());
addEventListener('companionbotpreviewchange', () => refreshAppearance(true));
configureAppearance(window.companionBotAppearance.values);
window.companionBot = {
  renderer: GPU ? 'webgpu' : 'webgl',
  setView(host, view, { animate = true } = {}) {
    const b = host?.bot;
    if (!b || !Object.hasOwn(VIEW_ANGLES, view)) return false;
    b.instantView = !animate;
    try { host.setAttribute('view', view); }
    finally { b.instantView = false; }
    if (!animate || reduce.matches) {
      snapView(b, VIEW_ANGLES[view]);
      sizeTo(Math.max(SIDE, b.n)); draw(b, 0);
    }
    schedule();
    return true;
  },
  express(host, expression) {
    const b = host?.bot;
    if (!b || !['wink', 'examine', 'neutral', ...Object.keys(FACES)].includes(expression)) return false;
    b.previewExpression = reduce.matches && expression !== 'neutral' ? expression : null;
    if (reduce.matches || expression === 'neutral') {
      b.fidget = null;
      b.face = null;
      still(b);
    } else if (FACES[expression]) {
      const t = performance.now() / 1000;
      b.face = { kind: expression, at: t, side: Math.random() < 0.5 ? -1 : 1 };
      b.fidget = null; b.hopAt = -1; b.poke = false;
      b.nextFidget = t + rand(9, 16);
      tick(b, t, 1 / 60, false);
    } else {
      const t = performance.now() / 1000;
      b.face = null;
      // Paint a recognizable first pose on tap, even when the phone's next frame is delayed.
      b.fidget = expression; b.fidgetAt = t - (expression === 'wink' ? 0.09 : 0.3); b.hopAt = -1; b.poke = false;
      b.blinkAt = -9;
      b.nextFidget = t + rand(9, 16); b.nextBlink = Math.max(b.nextBlink, t + 1.6);
      if (expression === 'examine') { b.s.lx = -0.2; b.s.ly = -0.55; }
      tick(b, t, 1 / 60, false);
    }
    sizeTo(Math.max(SIDE, b.n));
    draw(b, 0);
    schedule();
    return true;
  },
  mood(m) {
    if (m === mood) return;
    mood = m;
    if (reduce.matches) drawAllStill();
  },
};
dispatchEvent(new Event('companionbotready'));
