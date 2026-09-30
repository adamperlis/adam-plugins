import type { ShaderMount } from "@paper-design/shaders";

/** Original lifecycle wrapper, Paper's shader implementation. Keep UI outside host. */
export function mountPaperBackground(
  host: HTMLElement,
  control: HTMLButtonElement,
  options: {
    colors?: string[];
    speed?: number;
    distortion?: number;
    swirl?: number;
    fragmentShader?: string;
  } = {},
) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let shader: ShaderMount | undefined;
  let disposed = false,
    paused = false,
    failed = false,
    loading = false;
  let canvas: HTMLCanvasElement | undefined;
  const sync = () => {
    shader?.setSpeed(paused || reduce.matches ? 0 : (options.speed ?? 0.12));
    control.hidden = !shader || failed || reduce.matches;
    control.textContent = paused
      ? "Play background motion"
      : "Pause background motion";
    control.setAttribute("aria-pressed", String(paused));
  };
  const release = () => {
    canvas?.removeEventListener("webglcontextlost", contextLost);
    shader?.dispose();
    shader = undefined;
    canvas = undefined;
    host.replaceChildren();
    host.dataset.shader = "fallback";
    sync();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    failed = true;
    release();
  };
  async function initialize() {
    if (disposed || failed || shader || loading || reduce.matches) return;
    loading = true;
    try {
      const {
        ShaderMount,
        meshGradientFragmentShader,
        getShaderColorFromString,
        ShaderFitOptions,
      } = await import("@paper-design/shaders");
      if (disposed || reduce.matches) return;
      const colors = options.colors ?? [
        "#e6a16b",
        "#f1c4a0",
        "#e8ad7c",
        "#f5d9bd",
      ];
      shader = new ShaderMount(
        host,
        options.fragmentShader ?? meshGradientFragmentShader,
        {
          u_colors: colors.map(getShaderColorFromString),
          u_colorsCount: colors.length,
          u_distortion: options.distortion ?? 0.7,
          u_swirl: options.swirl ?? 0.15,
          u_grainMixer: 0.03,
          u_grainOverlay: 0.025,
          u_fit: ShaderFitOptions.cover,
          u_rotation: 0,
          u_scale: 1,
          u_offsetX: 0,
          u_offsetY: 0,
          u_originX: 0.5,
          u_originY: 0.5,
          u_worldWidth: 0,
          u_worldHeight: 0,
        },
        { alpha: false, antialias: false, powerPreference: "low-power" },
        0,
        12000,
        1,
        600_000,
      );
      canvas = shader.canvasElement;
      canvas.addEventListener("webglcontextlost", contextLost);
      host.dataset.shader = "ready";
      sync();
    } catch {
      failed = true;
      release(); // Background is optional; product remains usable.
    } finally {
      loading = false;
    }
  }
  const preferenceChanged = () => {
    if (reduce.matches) release();
    else void initialize();
  };
  const toggle = () => {
    paused = !paused;
    sync();
  };
  control.hidden = true;
  control.addEventListener("click", toggle);
  reduce.addEventListener("change", preferenceChanged);
  void initialize();
  return () => {
    disposed = true;
    release();
    control.removeEventListener("click", toggle);
    reduce.removeEventListener("change", preferenceChanged);
  };
}
