// The companion's customizer: presets, a live 3D preview you can turn and poke, a glasses picker,
// DialKit controls for every value in the schema, saved presets, and Apply.
//
//   import { mountCustomizer } from '/companion-bot/customizer.js';
//   const customizer = mountCustomizer(document.querySelector('#bot-settings'));
//   // later, when that view closes for good: customizer.destroy();
//
// Load companion-bot.js on the same page (it draws the preview). This module loads its own CSS.
// Apply stores the look in this browser and fires `companionbotappearancechange` on window with the
// values, so an app can also keep it on its server.
import appearance from './appearance.js';
import { createDialKit, createDialRoot } from './vendor/dialkit-2.1.0/index.js';

function stylesheet(href) {
  if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === href)) return;
  document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href }));
}
stylesheet(new URL('./vendor/dialkit-2.1.0/styles.css', import.meta.url).href);
stylesheet(new URL('./customizer.css', import.meta.url).href);

let mounts = 0;
const markup = (id, { title, subtitle, applyLabel }) => `
  <div class="cb-body">
    <header class="cb-heading">
      <div><h2 class="cb-title"></h2><p class="cb-subtitle"></p></div>
      <button class="cb-btn cb-btn-quiet" data-part="reset" type="button" disabled>Reset appearance</button>
    </header>
    <section class="cb-preset-section" aria-labelledby="${id}-presets">
      <div class="cb-preset-heading"><div><h3 id="${id}-presets">Choose your companion</h3><p>Start with a look, then make it yours.</p></div><span class="cb-preset-status" data-part="preset-status" role="status"></span></div>
      <div class="cb-presets" data-part="presets" role="group" aria-label="Bot presets"></div>
    </section>
    <section class="cb-preset-section" data-part="saved-section" aria-labelledby="${id}-saved" hidden>
      <div class="cb-preset-heading"><div><h3 id="${id}-saved">Your presets</h3><p>Saved on this browser. Select one to preview it.</p></div></div>
      <div class="cb-presets" data-part="saved-presets" role="group" aria-label="Saved bot presets"></div>
    </section>
    <div class="cb-layout">
      <section class="cb-preview-card" aria-label="Live bot preview">
        <div class="cb-preview-heading"><span>YOUR COMPANION</span><span class="cb-preview-live">Live preview</span></div>
        <div class="cb-preview-stage">
          <companion-bot data-part="preview" name="customizer-${id}" size="256" view="front" preview aria-label="Your customized companion"></companion-bot>
        </div>
        <div class="cb-views" data-part="views" role="group" aria-label="Preview angle">
          <button type="button" data-bot-view="front" aria-pressed="true">Front</button>
          <button type="button" data-bot-view="threeQuarter" aria-pressed="false">Three-quarter</button>
          <button type="button" data-bot-view="profile" aria-pressed="false">Profile</button>
        </div>
        <div class="cb-expressions" data-part="expressions" role="group" aria-label="Try an expression">
          <button class="cb-btn cb-btn-sm cb-btn-quiet" type="button" data-bot-expression="wink">Try a wink</button>
          <button class="cb-btn cb-btn-sm cb-btn-quiet" type="button" data-bot-expression="examine">Try reading</button>
          <button class="cb-btn cb-btn-sm cb-btn-quiet" type="button" data-bot-expression="neutral" hidden>Reset pose</button>
        </div>
        <p class="cb-preview-note" data-part="note" hidden></p>
      </section>
      <section class="cb-controls-card" aria-label="Bot appearance controls">
        <details class="cb-frame-picker" open>
          <summary>Glasses styles <span class="cb-frame-status" data-part="frame-status"></span></summary>
          <p>Pick a frame, then adjust its color and finish below.</p>
          <div class="cb-frame-choices" data-part="frames" role="group" aria-label="Glasses styles"></div>
        </details>
        <div class="cb-dials" data-part="dials" aria-busy="true"><p class="cb-loading">Loading customizer…</p></div>
      </section>
    </div>
  </div>
  <div class="cb-commit-bar">
    <form class="cb-save-form" data-part="save-form" hidden>
      <label for="${id}-name">Preset name</label>
      <div class="cb-save-fields"><input id="${id}-name" data-part="preset-name" maxlength="40" required autocomplete="off"><button class="cb-btn cb-btn-ink" type="submit">Save</button><button class="cb-btn cb-btn-quiet" data-part="save-cancel" type="button">Cancel</button></div>
    </form>
    <p class="cb-save-error" data-part="save-error" role="alert" hidden></p>
    <div class="cb-commit-row"><span class="cb-save-status" data-part="save-status" role="status">Choose a look to preview.</span><button class="cb-btn cb-btn-quiet" data-part="discard" type="button" hidden>Discard preview</button><div class="cb-commit-actions"><button class="cb-btn" data-part="save-preset" type="button" disabled>Save preset</button><button class="cb-btn cb-btn-ink" data-part="apply" type="button" disabled>${applyLabel}</button></div></div>
  </div>`;

function framePath(frame, side, inset = 0) {
  const points = frame.points.map(([x, y]) => [side * (.43 + x * (frame.rx - inset)), .2 + y * (frame.ry - inset)]);
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return `M${mid(points[points.length - 1], points[0]).join(',')}` + points.map((point, i) => `Q${point.join(',')} ${mid(point, points[(i + 1) % points.length]).join(',')}`).join('') + 'Z';
}
function frameIcon(frame) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '-1 -.68 2 1.02'); svg.setAttribute('aria-hidden', 'true');
  const group = document.createElementNS(ns, 'g'); group.setAttribute('transform', 'scale(1,-1)');
  const rims = document.createElementNS(ns, 'path');
  rims.setAttribute('d', [-1, 1].map(side => framePath(frame, side) + framePath(frame, side, frame.rim)).join(''));
  rims.setAttribute('fill-rule', 'evenodd'); rims.setAttribute('fill', frame.color);
  rims.setAttribute('fill-opacity', frame.finish === 'crystal' ? '.65' : '1');
  rims.setAttribute('stroke', frame.color); rims.setAttribute('stroke-width', '.006');
  const bridge = document.createElementNS(ns, 'path');
  const gap = .43 - frame.rx + frame.rim * .6;
  bridge.setAttribute('d', `M${-gap},.35 C${-gap * .5},.35 ${-gap * .6},${frame.bridge} 0,${frame.bridge} C${gap * .6},${frame.bridge} ${gap * .5},.35 ${gap},.35`
    + (frame.brow ? `M-.76,${.2 + frame.ry * .87} H.76` : ''));
  bridge.setAttribute('fill', 'none'); bridge.setAttribute('stroke', frame.color); bridge.setAttribute('stroke-width', String(Math.max(.032, frame.rim))); bridge.setAttribute('stroke-linecap', 'round');
  group.append(rims, bridge); svg.append(group); return svg;
}

export function mountCustomizer(target, {
  title = 'Customize your companion',
  subtitle = 'Make it your own.',
  applyLabel = 'Apply',
} = {}) {
  const id = `cb-${++mounts}`;
  const events = new AbortController(), on = { signal: events.signal };
  const box = document.createElement('div');
  box.className = 'cb-customizer';
  box.innerHTML = markup(id, { title, subtitle, applyLabel });
  box.querySelector('.cb-title').textContent = title;
  box.querySelector('.cb-subtitle').textContent = subtitle;
  const theme = () => appearance.isDark() ? 'dark' : 'light';
  box.dataset.theme = theme();
  target.replaceChildren(box);

  const part = name => box.querySelector(`[data-part="${name}"]`);
  const all = selector => box.querySelectorAll(selector);
  const preview = part('preview'), saveForm = part('save-form'), saveError = part('save-error');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let dial, root, notice = '';

  function updatePreviewAvailability() {
    const renderer = window.companionBot?.renderer;
    const ready = ['webgpu', 'webgl', 'flat'].includes(renderer);
    const simplified = renderer === 'flat' || renderer === 'still';
    all('[data-bot-view]').forEach(button => { button.disabled = !ready || (simplified && button.dataset.botView !== 'front'); });
    all('[data-bot-expression]').forEach(button => {
      button.disabled = !ready;
      if (button.dataset.botExpression === 'neutral') button.hidden = !reducedMotion.matches;
    });
    const note = part('note');
    note.hidden = !simplified && !reducedMotion.matches;
    note.textContent = renderer === 'still' ? 'This browser shows a still illustration. Settings are saved for the 3D bot.'
      : [simplified ? 'This browser shows a simplified front view.' : '',
        reducedMotion.matches ? 'Reduced motion is on. Expressions show a still pose; Reset pose returns to normal.' : ''].filter(Boolean).join(' ');
  }
  function setPreviewView(view, animate = false) {
    if (window.companionBot?.setView) window.companionBot.setView(preview, view, { animate });
    else preview.setAttribute('view', view);
    all('[data-bot-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.botView === view)));
  }
  const neutral = () => window.companionBot?.express?.(preview, 'neutral');

  for (const frame of [{ id: 'none', name: 'No glasses' }, ...appearance.frameCatalog]) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'cb-frame-choice'; button.dataset.frameStyle = frame.id;
    button.setAttribute('aria-label', frame.name);
    if (frame.id !== 'none') button.append(frameIcon(frame));
    else { const empty = document.createElement('span'); empty.className = 'cb-frame-none'; empty.textContent = '—'; button.append(empty); }
    const label = document.createElement('span'); label.textContent = frame.name; button.append(label);
    button.addEventListener('click', () => {
      dial.setValues({ glasses: frame.id === 'none' ? { style: 'none' } : {
        style: frame.id, finish: frame.finish, frameColor: frame.color,
        transparency: frame.finish === 'solid' ? 0 : frame.finish === 'crystal' ? 1.35 : 1,
        shine: frame.finish === 'solid' ? .5 : 1,
      } });
      setPreviewView('front');
    });
    part('frames').append(button);
  }

  function choosePreset(preset) {
    dial.setValues(preset.values);
    neutral();
    setPreviewView('front');
  }
  function presetCard(preset, saved = false) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'cb-preset'; button.dataset.botPreset = preset.id;
    button.setAttribute('aria-label', saved ? preset.name : `${preset.name}, ${preset.description.replace(' · ', ', ')}`);
    const image = document.createElement('img');
    image.src = preset.thumbnail;
    image.alt = ''; image.width = image.height = 192;
    image.loading = 'lazy'; image.decoding = 'async';
    const name = document.createElement('strong'); name.textContent = preset.name;
    const description = document.createElement('span'); description.textContent = saved ? 'Saved preset' : preset.description;
    button.append(image, name, description);
    button.addEventListener('click', () => choosePreset(preset));
    if (!saved) return button;
    const card = document.createElement('div'); card.className = 'cb-saved-preset';
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'cb-saved-preset-remove'; remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${preset.name} preset`);
    remove.addEventListener('click', () => {
      try {
        saveError.hidden = true;
        appearance.removePreset(preset.id);
        notice = `Removed “${preset.name}” from your presets.`;
        updatePresetSelection();
        part('save-preset').focus({ preventScroll: true });
      } catch (error) { showSaveError(error.message); }
    });
    card.append(button, remove);
    return card;
  }
  for (const preset of appearance.presets) part('presets').append(presetCard(preset));
  function renderSavedPresets() {
    part('saved-presets').replaceChildren(...appearance.savedPresets.map(preset => presetCard(preset, true)));
    part('saved-section').hidden = !appearance.savedPresets.length;
    updatePresetSelection();
  }
  function updatePresetSelection() {
    const selected = appearance.presetFor(appearance.previewValues);
    all('[data-bot-preset]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.botPreset === selected)));
    const preset = [...appearance.savedPresets, ...appearance.presets].find(preset => preset.id === selected);
    part('preset-status').textContent = preset
      ? `${preset.name} ${appearance.pending ? 'preview' : 'applied'}` : appearance.pending ? 'Custom preview' : 'Custom look applied';
    part('apply').disabled = !dial || (!appearance.pending && appearance.persisted);
    part('save-preset').disabled = !dial;
    part('discard').hidden = !appearance.pending;
    part('save-status').textContent = notice || (appearance.pending
      ? 'Preview only. Apply this look to keep it.'
      : appearance.persisted ? 'Applied · Saved on this browser.' : 'Applied for this session. This browser could not save the change.');
    const style = appearance.previewValues.glasses.style;
    all('[data-frame-style]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.frameStyle === style)));
    part('frame-status').textContent = appearance.schema.glasses.style.options.find(option => option.value === style)?.label || style;
  }
  function showSaveError(message) {
    saveError.textContent = message; saveError.hidden = false;
  }

  part('apply').addEventListener('click', () => {
    saveError.hidden = true;
    const saved = appearance.apply();
    notice = saved ? 'Applied. Saved on this browser.' : 'Applied for this session. This browser could not save the change.';
    updatePresetSelection();
  });
  part('discard').addEventListener('click', () => {
    dial.setValues(appearance.values);
    neutral();
    notice = 'Preview discarded. Your bot is unchanged.';
    updatePresetSelection();
  });
  part('save-preset').addEventListener('click', () => {
    saveForm.hidden = false; saveError.hidden = true;
    const preset = [...appearance.savedPresets, ...appearance.presets].find(preset => preset.id === appearance.presetFor(appearance.previewValues));
    const input = part('preset-name');
    input.value = preset ? `${preset.name} copy`.slice(0, 40) : 'My bot';
    input.focus(); input.select();
  });
  part('save-cancel').addEventListener('click', () => {
    saveForm.hidden = true; saveError.hidden = true;
    part('save-preset').focus();
  });
  saveForm.addEventListener('submit', async event => {
    event.preventDefault(); saveError.hidden = true;
    const button = saveForm.querySelector('[type=submit]');
    if (button.disabled) return;
    button.disabled = true;
    try {
      neutral();
      setPreviewView('front');
      const source = preview.querySelector('canvas, img');
      if (!source) throw new Error('The preview is still loading. Try saving again in a moment.');
      if (source instanceof HTMLImageElement) await source.decode();
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 192;
      canvas.getContext('2d').drawImage(source, 0, 0, 192, 192);
      const preset = appearance.savePreset(part('preset-name').value, canvas.toDataURL('image/png'));
      saveForm.hidden = true;
      notice = `Saved “${preset.name}” as a preset.${appearance.pending ? ' Your preview has not been applied.' : ''}`;
      updatePresetSelection();
      part('save-preset').focus({ preventScroll: true });
    } catch (error) { showSaveError(error.message); }
    finally { button.disabled = false; }
  });
  part('views').addEventListener('click', event => {
    const button = event.target.closest('button[data-bot-view]');
    if (button) setPreviewView(button.dataset.botView, true);
  });
  part('expressions').addEventListener('click', event => {
    const button = event.target.closest('button[data-bot-expression]');
    if (button) window.companionBot?.express?.(preview, button.dataset.botExpression);
  });

  // DialKit: one folder per schema group, starting from the current preview.
  const current = appearance.previewValues;
  const config = Object.fromEntries(Object.entries(appearance.schema).map(([group, fields]) => [group,
    Object.fromEntries(Object.entries(fields).map(([name, spec]) => [name,
      Array.isArray(spec) ? [current[group][name], ...spec.slice(1)]
        : typeof spec === 'object' ? { ...spec, default: current[group][name] } : current[group][name]]))]));
  dial = createDialKit('Bot customizer', config, { id: `companion-bot-${id}`, persist: false });
  root = createDialRoot({ target: part('dials'), mode: 'inline', versions: 'menu', theme: theme() });
  const unsubscribe = dial.subscribe(values => appearance.preview(values));
  part('dials').removeAttribute('aria-busy');
  part('dials').querySelector('.cb-loading')?.remove();
  part('reset').disabled = false;
  part('reset').addEventListener('click', () => dial.setValues(appearance.defaults));

  addEventListener('companionbotready', updatePreviewAvailability, on);
  reducedMotion.addEventListener('change', updatePreviewAvailability, on);
  addEventListener('companionbotpreviewchange', () => { notice = ''; updatePresetSelection(); }, on);
  addEventListener('companionbotappearancechange', updatePresetSelection, on);
  addEventListener('companionbotpresetschange', renderSavedPresets, on);
  addEventListener('companionbotthemechange', () => {
    box.dataset.theme = theme();
    if (root) root.element.dataset.theme = theme();
  }, on);
  updatePreviewAvailability();
  renderSavedPresets();

  return {
    element: box,
    destroy() {
      events.abort();
      if (typeof unsubscribe === 'function') unsubscribe();
      root?.destroy?.();
      dial?.destroy?.();
      appearance.preview(appearance.values);  // drop an unapplied preview
      box.remove();
    },
  };
}
