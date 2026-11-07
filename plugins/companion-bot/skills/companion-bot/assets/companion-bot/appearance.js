// The companion's look: the schema the customizer edits, the built-in presets, the glasses catalog,
// and the applied look itself. Both renderers (bot3d.js, bot2d.js) and the customizer read it from
// window.companionBotAppearance. Looks and saved presets stay in this browser's localStorage unless
// window.companionBotConfig = { persist: false } is set before companion-bot.js loads; listen for
// `companionbotappearancechange` to keep the look somewhere else (your server, a user profile).
//
// Optional config, set before companion-bot.js loads:
//   window.companionBotConfig = {
//     storageKey: 'my-app.bot',              // localStorage prefix (default 'companion-bot')
//     persist: true,                         // false: never touch localStorage
//     defaults: { fur: { color: '#2f6bff' } } // your brand's starting look; partial is fine
//   };
const config = window.companionBotConfig || {};
const base = new URL('./', import.meta.url);
const assetUrl = path => new URL(path, base).href;

// ---------- light and dark ----------
// The bot's lighting follows the page: <html data-theme="dark|light">, then class="dark|light"
// (Tailwind, shadcn), then the system setting.
const root = document.documentElement;
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
function isDark() {
  const theme = root.dataset.theme;
  if (theme === 'dark' || theme === 'light') return theme === 'dark';
  if (root.classList.contains('dark')) return true;
  if (root.classList.contains('light')) return false;
  return darkQuery.matches;
}
let wasDark = isDark();
function themeChanged() {
  const dark = isDark();
  if (dark === wasDark) return;
  wasDark = dark;
  dispatchEvent(new Event('companionbotthemechange'));
}
new MutationObserver(themeChanged).observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
darkQuery.addEventListener('change', themeChanged);

// ---------- glasses ----------
// rx/ry are outer half-extents; rim, bridge, and brow distinguish the individual frames. points
// trace one lens's outline, which is smoothed into a 32-point contour for the shaders.
const frameCatalog = [
  { id: 'fineRound', name: 'Fine round', rx: .35, ry: .35, rim: .028, bridge: .40, color: '#a56232', finish: 'tortoise', points: [[-1,.1],[-.87,.60],[-.5,.92],[.05,1],[.60,.84],[.94,.45],[1,-.08],[.82,-.62],[.30,-.96],[-.25,-1],[-.78,-.66]] },
  { id: 'sculptedPanto', name: 'Sculpted panto', rx: .38, ry: .35, rim: .052, bridge: .43, color: '#985329', finish: 'tortoise', points: [[-1,.48],[-.66,.86],[-.12,.98],[.55,1],[1,.83],[.98,.12],[.77,-.60],[.24,-1],[-.34,-.94],[-.81,-.51]] },
  { id: 'softPanto', name: 'Soft panto', rx: .37, ry: .34, rim: .045, bridge: .42, color: '#292824', finish: 'solid', points: [[-1,.65],[-.6,.97],[.08,1],[.73,.87],[1,.42],[.95,-.22],[.62,-.80],[.05,-1],[-.55,-.85],[-.94,-.40]] },
  { id: 'boldSquare', name: 'Bold square', rx: .40, ry: .33, rim: .057, bridge: .43, color: '#292824', finish: 'solid', points: [[-1,.80],[-.65,1],[.55,1],[1,.80],[1,-.55],[.70,-1],[-.62,-1],[-1,-.55]] },
  { id: 'lightOval', name: 'Light oval', rx: .37, ry: .31, rim: .029, bridge: .39, color: '#d9a244', finish: 'crystal', points: [[-1,.32],[-.75,.78],[-.18,1],[.50,.91],[.95,.53],[1,-.12],[.66,-.77],[.02,-1],[-.63,-.82],[-.98,-.25]] },
  { id: 'wideSquare', name: 'Wide soft square', rx: .40, ry: .32, rim: .036, bridge: .40, color: '#9d683f', finish: 'tortoise', points: [[-1,.62],[-.63,.94],[.25,1],[.95,.84],[1,.12],[.90,-.64],[.45,-1],[-.45,-.96],[-.92,-.59]] },
  { id: 'aviator', name: 'Double-bridge aviator', rx: .39, ry: .35, rim: .034, bridge: .35, brow: true, color: '#d9a244', finish: 'crystal', points: [[-1,.94],[-.3,1],[.55,1],[1,.81],[1,.14],[.74,-.72],[.20,-1],[-.43,-.73],[-.88,-.20]] },
  { id: 'lowSquare', name: 'Low rounded square', rx: .38, ry: .30, rim: .037, bridge: .40, color: '#955b38', finish: 'tortoise', points: [[-1,.66],[-.62,.96],[.40,1],[1,.70],[1,-.30],[.68,-.91],[-.15,-1],[-.82,-.70],[-1,-.12]] },
  { id: 'sweptPanto', name: 'Swept panto', rx: .40, ry: .34, rim: .043, bridge: .42, color: '#8d5030', finish: 'tortoise', points: [[-1,.54],[-.58,.90],[.02,1],[.70,.97],[1,.90],[.96,.12],[.62,-.74],[.02,-1],[-.55,-.89],[-.92,-.36]] },
  { id: 'compactSquare', name: 'Compact rounded square', rx: .35, ry: .32, rim: .034, bridge: .40, color: '#c5a16d', finish: 'paradox', points: [[-1,.68],[-.55,.97],[.55,1],[1,.73],[1,-.18],[.77,-.83],[.04,-1],[-.72,-.84],[-1,-.20]] },
  { id: 'angularBrow', name: 'Angular brow', rx: .40, ry: .32, rim: .045, bridge: .42, color: '#30332f', finish: 'solid', points: [[-1,.75],[-.42,.94],[.40,1],[1,1.06],[1,.22],[.72,-.68],[.15,-1],[-.48,-.95],[-.90,-.43]] },
  { id: 'thickCircle', name: 'Thick circle', rx: .34, ry: .34, rim: .072, bridge: .37, color: '#242421', finish: 'solid', points: [[-1,0],[-.87,.5],[-.5,.87],[0,1],[.5,.87],[.87,.5],[1,0],[.87,-.5],[.5,-.87],[0,-1],[-.5,-.87],[-.87,-.5]] },
  { id: 'raisedCrown', name: 'Raised crown', rx: .36, ry: .37, rim: .051, bridge: .42, color: '#ba955c', finish: 'paradox', points: [[-1,.54],[-.72,.88],[-.10,1],[.57,1.08],[1.13,1.04],[1,.25],[.77,-.58],[.20,-1],[-.48,-.94],[-.94,-.42]] },
  { id: 'dFrame', name: 'Classic D-frame', rx: .39, ry: .33, rim: .048, bridge: .43, color: '#292824', finish: 'solid', points: [[-1,.69],[-.50,1],[.40,1],[1,.87],[1,.27],[.83,-.53],[.37,-.94],[-.31,-1],[-.83,-.64],[-1,-.07]] },
];
for (const frame of frameCatalog) {
  frame.contour = Array.from({ length: 32 }, (_, i) => {
    const segment = i / 32 * frame.points.length, index = Math.floor(segment), t = segment - index;
    const p = frame.points[index], before = frame.points[(index + frame.points.length - 1) % frame.points.length], after = frame.points[(index + 1) % frame.points.length];
    return [0, 1].map(axis => (1 - t) ** 2 * (before[axis] + p[axis]) / 2 + 2 * (1 - t) * t * p[axis] + t ** 2 * (p[axis] + after[axis]) / 2);
  });
}

// ---------- what can be changed ----------
// [default, min, max, step] is a slider; a hex string is a color; a boolean is a toggle.
const schema = {
  fur: { headShape: { type: 'select', default: 'almond', options: ['almond', 'round', 'pear', 'tall'] },
    color: '#fa4900', length: [0.3, 0.12, 0.42, 0.01],
    beardStyle: { type: 'select', default: 'full', options: ['none', 'stubble', 'full', 'goatee'] },
    beard: [1, 0, 1, 0.05] },
  face: { styling: { type: 'select', default: 'neutral', options: ['neutral', 'feminine', 'masculine'] },
    noseType: { type: 'select', default: 'roman', options: [
      { value: 'roman', label: 'Roman (hooked)' }, { value: 'straight', label: 'Straight' },
      { value: 'button', label: 'Button' }, { value: 'rounded', label: 'Rounded' }] },
    eyeType: { type: 'select', default: 'round', options: ['round', 'almond', 'sleepy'] },
    eyeSize: [1, 0.85, 1.15, 0.025], eyeColor: '#995a2f' },
  glasses: { style: { type: 'select', default: 'keyhole', options: [
    { value: 'keyhole', label: 'Keyhole' }, { value: 'round', label: 'Round' },
    { value: 'square', label: 'Square' }, { value: 'catEye', label: 'Cat-eye' },
    ...frameCatalog.map(frame => ({ value: frame.id, label: frame.name })), { value: 'none', label: 'None' }] },
    finish: { type: 'select', default: 'tortoise', options: ['tortoise', 'solid', 'crystal', 'paradox'] },
    frameColor: '#a56232', size: [1, 0.9, 1.12, 0.01],
    transparency: [1, 0, 1.5, 0.05], shine: [1, 0, 2, 0.05] },
  personality: { idleGestures: true, blinkRate: [1, 0.5, 2, 0.1], mouthMovement: [1, 0, 1.5, 0.1] },
};
const schemaDefaults = Object.fromEntries(Object.entries(schema).map(([group, controls]) => [group,
  Object.fromEntries(Object.entries(controls).map(([name, spec]) => [name,
    Array.isArray(spec) ? spec[0] : typeof spec === 'object' ? spec.default : spec]))]));

// Each nose is a complete sculpt: [height, center depth, half-width, half-depth] rings.
// The flat renderer has its own matching bridge, tip, wing, and nostril contours.
const nosePresets = {
  roman: { root: [0.62, 0.85, 0.17],
    rings: [[.20,.88,0,0],[.12,1.0,.035,.055],[.02,1.06,.045,.09],[-.09,1.12,.065,.13],[-.18,1.15,.11,.18],[-.24,1.10,.085,.14],[-.29,1.0,0,0]],
    nostril: [.072,-.221,1.225,.027,.018,.045],
    flat: { bridge: [.026,.105,-.005,.9], tip: [.055,.038,-.095,1], wing: [.053,.020,.025,-.10], nostril: [.05,-.117,.013,.009] } },
  straight: { root: [0.48, 0.8, 0.14],
    rings: [[.18,.88,0,0],[.12,.99,.027,.045],[.02,1.05,.037,.08],[-.09,1.10,.05,.11],[-.17,1.12,.074,.115],[-.22,1.06,.055,.075],[-.26,1.0,0,0]],
    nostril: [.05,-.20,1.16,.022,.014,.035],
    flat: { bridge: [.021,.095,-.003,.8], tip: [.038,.028,-.085,.8], wing: [.038,.017,.018,-.09], nostril: [.034,-.104,.010,.007] } },
  button: { root: [0.5, 0.4, 0.12],
    rings: [[.0,.96,0,0],[-.045,1.045,.055,.07],[-.095,1.10,.095,.11],[-.15,1.085,.085,.085],[-.19,1.02,.045,.04],[-.215,.98,0,0]],
    nostril: [.053,-.15,1.15,.022,.015,.035],
    flat: { bridge: [.015,.027,-.04,.12], tip: [.046,.037,-.06,.75], wing: [.04,.018,.017,-.07], nostril: [.032,-.082,.009,.006] } },
  rounded: { root: [0.75, 0.6, 0.15],
    rings: [[.10,.90,0,0],[.025,1.03,.07,.075],[-.065,1.115,.125,.15],[-.14,1.13,.14,.17],[-.22,1.08,.095,.10],[-.27,.99,0,0]],
    nostril: [.09,-.205,1.205,.03,.018,.04],
    flat: { bridge: [.03,.058,-.02,.35], tip: [.066,.056,-.07,1], wing: [.06,.024,.022,-.09], nostril: [.052,-.105,.013,.008] } },
};

// ---------- built-in presets (thumbnails in presets/) ----------
const look = overrides => Object.fromEntries(['fur', 'face', 'glasses'].map(group => [group, { ...schemaDefaults[group], ...overrides[group] }]));
const presets = [
  { id: 'theo', name: 'Theo', description: 'Bearded · Masculine', values: look({}) },
  { id: 'poppy', name: 'Poppy', description: 'Fluffy · Feminine', values: look({ fur: { headShape: 'round', color: '#f37b50', beardStyle: 'none', length: .38 }, face: { styling: 'feminine', noseType: 'button', eyeType: 'round', eyeSize: 1.075, eyeColor: '#76523b' }, glasses: { style: 'none' } }) },
  { id: 'sage', name: 'Sage', description: 'Calm · Neutral', values: look({ fur: { headShape: 'pear', color: '#8ca582', beardStyle: 'stubble', beard: .5, length: .16 }, face: { noseType: 'rounded', eyeType: 'sleepy', eyeSize: .95, eyeColor: '#546a47' }, glasses: { style: 'none' } }) },
  { id: 'nova', name: 'Nova', description: 'Sleek · Feminine', values: look({ fur: { headShape: 'tall', color: '#b88bd4', beardStyle: 'none', length: .22 }, face: { styling: 'feminine', noseType: 'straight', eyeType: 'almond', eyeSize: .925, eyeColor: '#4d6d60' }, glasses: { style: 'round', frameColor: '#50406b' } }) },
  { id: 'finn', name: 'Finn', description: 'Trimmed · Masculine', values: look({ fur: { headShape: 'almond', color: '#668399', beardStyle: 'goatee', beard: .75, length: .14 }, face: { styling: 'masculine', noseType: 'straight', eyeType: 'almond', eyeSize: .95, eyeColor: '#644333' }, glasses: { style: 'none' } }) },
  { id: 'mochi', name: 'Mochi', description: 'Playful · Neutral', values: look({ fur: { headShape: 'round', color: '#e5a83c', beardStyle: 'none', length: .42 }, face: { noseType: 'button', eyeSize: 1.15, eyeColor: '#76523b' }, glasses: { style: 'none' } }) },
].map(preset => ({ ...preset, thumbnail: assetUrl(`presets/${preset.id}.png`) }));

// ---------- reading values safely ----------
const colorCanvas = document.createElement('canvas');
colorCanvas.width = colorCanvas.height = 1;
const colorContext = colorCanvas.getContext('2d', { willReadFrequently: true });
function normalizeColor(value, fallback) {
  if (typeof value !== 'string' || !CSS.supports('color', value)) return fallback;
  colorContext.clearRect(0, 0, 1, 1);
  colorContext.fillStyle = value;
  colorContext.fillRect(0, 0, 1, 1);
  return '#' + [...colorContext.getImageData(0, 0, 1, 1).data].slice(0, 3)
    .map(channel => channel.toString(16).padStart(2, '0')).join('');
}
// Anything missing, out of range or unknown falls back to `fallback`'s value (the schema's by default).
function normalize(input, fallback = schemaDefaults) {
  return Object.fromEntries(Object.entries(schema).map(([group, controls]) => [group,
    Object.fromEntries(Object.entries(controls).map(([name, spec]) => {
      const value = input?.[group]?.[name], otherwise = fallback[group][name];
      if (Array.isArray(spec)) return [name, typeof value === 'number' && Number.isFinite(value)
        ? Math.max(spec[1], Math.min(spec[2], value)) : otherwise];
      if (typeof spec === 'object') return [name, spec.options.some(option => (option.value || option) === value) ? value : otherwise];
      if (typeof spec === 'boolean') return [name, typeof value === 'boolean' ? value : otherwise];
      return [name, normalizeColor(value, otherwise)];
    }))]));
}
const defaults = normalize(config.defaults || {});

// ---------- the applied look, a preview, and saved presets ----------
const prefix = typeof config.storageKey === 'string' && config.storageKey ? config.storageKey : 'companion-bot';
const lookKey = `${prefix}.appearance.v1`, savedKey = `${prefix}.presets.v1`;
const useStorage = config.persist !== false;
const read = key => { try { return useStorage ? JSON.parse(localStorage.getItem(key)) : null; } catch { return null; } };
const write = (key, value) => { if (!useStorage) return false; try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };

let current = normalize(read(lookKey) || defaults, defaults), persisted = true;
let draft = current;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const validThumbnail = value => typeof value === 'string' && value.length < 180000 && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value);
const cleanPresets = list => Array.isArray(list) ? list.filter(preset => preset && /^saved-[a-z0-9-]+$/.test(preset.id)
  && typeof preset.name === 'string' && preset.name.trim().length > 0 && preset.name.length <= 40 && validThumbnail(preset.thumbnail))
  .slice(0, 24).map(preset => ({ id: preset.id, name: preset.name, thumbnail: preset.thumbnail, values: normalize(preset.values, defaults) })) : [];
let savedPresets = cleanPresets(read(savedKey));

function preview(values) {
  const next = normalize(values, defaults);
  if (same(next, draft)) return;
  draft = same(next, current) ? current : next;
  dispatchEvent(new CustomEvent('companionbotpreviewchange', { detail: draft }));
}
// Applies a look on this page (every <companion-bot> without `preview`) and stores it.
// Returns false when it could not be stored here; the look still applies until the page closes.
function set(values) {
  current = normalize(values, defaults);
  draft = current;
  persisted = useStorage ? write(lookKey, current) : true;
  dispatchEvent(new CustomEvent('companionbotappearancechange', { detail: current }));
  dispatchEvent(new CustomEvent('companionbotpreviewchange', { detail: draft }));
  return persisted;
}
function storePresets(next) {
  if (useStorage && !write(savedKey, next)) throw new Error('This browser could not save your presets. Free some browser storage and try again.');
  savedPresets = next;
  dispatchEvent(new CustomEvent('companionbotpresetschange', { detail: savedPresets }));
}
function savePreset(name, thumbnail) {
  name = typeof name === 'string' ? name.replace(/\s+/g, ' ').trim() : '';
  if (!name || name.length > 40) throw new Error('Give your preset a name between 1 and 40 characters.');
  if (savedPresets.some(preset => preset.name.toLowerCase() === name.toLowerCase())) throw new Error('A preset with that name already exists. Choose another name.');
  if (savedPresets.length >= 24) throw new Error('You have 24 saved presets. Remove one before saving another.');
  if (!validThumbnail(thumbnail)) throw new Error('The preview is not ready yet. Try saving again in a moment.');
  const preset = { id: `saved-${crypto.randomUUID()}`, name, thumbnail, values: normalize(draft, defaults) };
  storePresets([...savedPresets, preset]);
  return preset;
}
const presetFor = values => [...savedPresets, ...presets].find(preset => ['fur', 'face', 'glasses'].every(group =>
  Object.entries(preset.values[group]).every(([name, value]) => values[group]?.[name] === value)))?.id;

const appearance = { schema, defaults, presets, presetFor, nosePresets, frameCatalog, isDark, assetUrl, normalize,
  get values() { return current; }, get previewValues() { return draft; }, get pending() { return !same(draft, current); },
  get persisted() { return persisted; }, get savedPresets() { return savedPresets; },
  forHost: host => host.hasAttribute('preview') ? draft : current,
  preview, set, apply: () => set(draft), savePreset,
  // Replaces the saved presets wholesale, for apps that keep them on a server.
  loadPresets: list => storePresets(cleanPresets(list)),
  removePreset: id => storePresets(savedPresets.filter(preset => preset.id !== id)) };
window.companionBotAppearance = appearance;
export default appearance;
