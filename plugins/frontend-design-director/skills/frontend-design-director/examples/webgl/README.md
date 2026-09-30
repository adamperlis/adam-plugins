# WebGL integration

This is an optional material-field recipe. It is not a finished brand concept. A palette or shader is appropriate only when it helps explain the project's material, space, or behavior.

## Run the actual example

From `examples/`:

```sh
bun install --frozen-lockfile
bun run dev
```

Open `/lab.html`. `bun run build` runs TypeScript checking and a multi-page Vite production build. The lockfile records tested package versions. React and React DOM must share a major version; R3F 9 is used with React 19 here. Do not add this stack to a target project just to copy the look.

## Shader imports

`AtmosphereCanvas.tsx` uses Vite's `?raw` imports for `.vert` and `.frag` strings. The declarations are in `shaders.d.ts`. Other bundlers need an equivalent raw-text loader or explicit shader string exports. A TypeScript module declaration alone does not configure a bundler.

## Fallback contract

- The CSS field exists before the canvas initializes.
- Canvas creation errors are caught by an error boundary; R3F's unavailable-GL fallback is supplied too.
- Context loss unmounts the canvas, leaving the static field. Reload to attempt GPU initialization again.
- `IntersectionObserver` and document visibility control the frame loop.
- Reduced motion uses a demand frame loop with displacement disabled.
- DPR is capped at 1.75. The canvas is decorative and carries no semantic information.

Test both GPU and fallback states on the target device. A successful desktop build is not a mobile performance profile. The lab has a large graphics dependency; keep it out of static marketing pages unless justified.

`halftone.frag` is a shader fragment, not a wired postprocessing pass. It requires a texture, UV coordinates, and its declared uniforms. Treat it as an integration exercise until rendered in the target pipeline.
