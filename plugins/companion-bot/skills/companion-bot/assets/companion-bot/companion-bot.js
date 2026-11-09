// Companion bot: the one file a page loads.
//
//   <script type="module" src="/companion-bot/companion-bot.js"></script>
//   <companion-bot size="96"></companion-bot>
//
// It reads the look (appearance.js), then starts the 3D bot (bot3d.js: Three.js on WebGPU, or
// WebGL 2). Until that's ready it remembers whatever mood the page sets. If the 3D bot can't load
// or can't run, the flat bot (bot2d.js, WebGL 1) takes over, and failing that a still picture.
//
//   window.companionBot.mood('idle' | 'working' | 'sleeping')    every bot on the page
//   window.companionBot.express(element, 'wink' | 'examine' | 'neutral')
//   window.companionBot.setView(element, 'front' | 'threeQuarter' | 'profile')   3D only
//   window.companionBot.renderer   'webgpu' | 'webgl' | 'flat' | 'still' once `companionbotready` fires
import './appearance.js';

// Each bot sets its own width and height from `size`; :where() keeps these at zero specificity, so
// any rule in your own CSS wins.
const style = document.createElement('style');
style.textContent = ':where(companion-bot) { display: inline-block; flex: none; vertical-align: middle; }'
  + ' :where(companion-bot) > canvas, :where(companion-bot) > img { display: block; width: 100%; height: 100%; }';
document.head.prepend(style);

let pending = 'idle';
window.companionBot = { mood(m) { pending = m; }, get pending() { return pending; } };

try {
  await import('./bot3d.js');
} catch (error) {
  console.warn('Companion bot: the 3D version could not start, using the flat one.', error);
  if (!customElements.get('companion-bot')) {
    await import('./bot2d.js');
    window.companionBot.mood(pending);
  }
}
