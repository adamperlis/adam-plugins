// The flat companion: a small plush bot drawn by one WebGL fragment shader, used where the 3D one
// (bot3d.js) can't run. It looks around and blinks and fidgets while idle, looks alert while your
// app works, and dozes while it sleeps. Every <companion-bot size="…"> on the page is a bot of its
// own, with its own blinks and glances. They share one WebGL context, which draws each in turn and
// copies it onto that bot's canvas. Where WebGL can't run at all, bot-still.png stands in.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const isDark = () => window.companionBotAppearance.isDark();  // set by theme.js
  const rand = (a, b) => a + Math.random() * (b - a);
  const ease = (rate, dt) => 1 - Math.exp(-rate * dt);
  const HEAD_SHAPES = { almond: [1, 1, 1], round: [1.09, 0.96, 0.25], pear: [1.08, 1.03, 0.75], tall: [0.92, 1.09, 0.75] };
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);

  // ---------- the shared renderer ----------
  const glc = Object.assign(document.createElement('canvas'), { width: 64, height: 64 });  // grows to the biggest bot
  const gl = glc.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  const FRAG = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec2 R;
    uniform vec2 look;     // where the eyes point, -1..1
    uniform float blink;   // 0 open, 1 shut
    uniform float sleep;   // 0 awake, 1 asleep: the eyes become closed arcs
    uniform float hop;     // lift off the ground
    uniform float squash;  // + wide and short, - tall and thin
    uniform float dark;    // 1 on a dark page: stronger back light
    uniform float time;    // seconds, for the breeze in the fur and the odd twinkle
    uniform vec2 swing;    // how far the fur's tips trail the body's motion
    uniform float lean;    // the body leaning over from its feet, toward where it looks
    uniform float joy;     // 0..1: a soft squint after landing
    uniform float inspect; // the signed tilt while peering over the glasses
    uniform float glassesDown;
    uniform float wink;    // the sign selects the eye
    uniform float wide;    // 0..1: eyes opened wide, at the top of a hop
    uniform vec4 brush;    // xy: the pointer, in canvas space; zw: how far it has pushed the fur there
    uniform float lidTop;  // where the upper lids rest: 1 wide open, lower is heavier-lidded
    uniform float lidSlant;// + raises the inner corners (soft, pleading), - lowers them (intent)
    uniform float pupil;   // pupil size, in eyeball radii: wider when something has its interest
    uniform vec3 face;     // nose lift, smile curl, and mouth opening
    uniform vec3 furColor, eyeColor, frameColor, headShape;
    uniform float furLength, beardStrength, goatee;
    uniform vec4 noseBridge, noseTip, noseWing, noseNostril;
    uniform float eyeSize, eyeType, styling, glassesStyle, glassesSize, transparency, shine;
    uniform vec2 frameContour[32];
    uniform vec4 frameMetrics;
    uniform float frameBrow, frameFinish;

    float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
    }
    // A sloping crown and broad cheeks, with room above for the hop.
    const float H = .4, ground = -H;
    #define FUR (furLength * .6666667)
    const int SHELLS = 16;
    vec2 shape(vec2 p) { return vec2((p.x + p.y * .16 * headShape.z) / max(.5, .98 - p.y * .18 - p.y * p.y * 1.2 + styling * .035 * (1. - smoothstep(-.3, -.05, p.y))), p.y); }
    float body(vec2 p) { return (length(shape(p) / vec2(.47, H)) - 1.) * H; }
    float form(vec2 p) { return length((shape(p) - vec2(0., .02)) / vec2(.6, .53)); }
    float frameDistance(vec2 p) {
      float distance = 10.;
      bool inside = false;
      vec2 a = frameContour[31] * frameMetrics.xy;
      for (int i = 0; i < 32; i++) {
        vec2 b = frameContour[i] * frameMetrics.xy;
        vec2 edge = b - a, delta = p - a;
        distance = min(distance, length(delta - edge * clamp(dot(delta, edge) / max(dot(edge, edge), .000001), 0., 1.)));
        if ((a.y > p.y) != (b.y > p.y)) {
          if (p.x < a.x + (b.x - a.x) * (p.y - a.y) / (b.y - a.y)) inside = !inside;
        }
        a = b;
      }
      return inside ? -distance : distance;
    }
    vec4 over(vec4 top, vec4 under) { return top + under * (1. - top.a); }

    void main() {
      float px = 2. / R.y;
      vec2 p = (gl_FragCoord.xy * 2. - R) / R.y;
      // Body space: squash and stretch pivot on the feet, so landing flattens it onto the floor.
      vec2 q = p - vec2(0., ground + hop);
      q /= headShape.xy;
      q.x -= lean * q.y;  // the lean pivots on the feet, like the squash
      q.y += inspect * q.x * .12;
      q.x /= 1. + squash; q.y /= 1. - squash;
      q.y -= H;
      float nod = abs(inspect) * .038;
      float faceY = q.y + nod;
      vec3 L = normalize(vec3(.47, .7, .55));  // a soft key light from above right
      vec3 V = vec3(0., 0., 1.);

      // Contact shadow: a wide soft pool and a tight dark core where it touches, both fading as it lifts.
      vec2 sv = (p - vec2(0., ground - .015)) / vec2(.54 - hop * .9, .07);
      float touch = clamp(1. - hop * 5., 0., 1.);
      float shadow = smoothstep(1., .05, length(sv)) * max(.2 - hop * .45, 0.)
        + smoothstep(.7, 0., length(sv * vec2(1.25, 1.8))) * .24 * touch;
      vec4 acc = vec4(0., 0., 0., shadow * (1. - dark * .2));

      // The body as a solid: domed over its whole face, lit by the key light with a soft wrap (fur
      // scatters light a little past the shadow line), shadows that go deep red rather than grey, less
      // light underneath near the floor, warm light bounced up off it, and a rim on the silhouette.
      // When it glances aside, the light shifts a touch on its face, as if it had turned.
      float d0 = body(q);
      vec2 e = vec2(.01, 0.);
      // Approximate the slope of the body for the wrapped light.
      float se = form(q);
      vec2 sg = normalize(vec2(form(q + e.xy) - form(q - e.xy), form(q + e.yx) - form(q - e.yx)) + 1e-5);
      float rr = clamp(se, 0., .995);
      vec3 n = normalize(vec3(sg * rr - vec2(look.x * .14, 0.) * (1. - rr), sqrt(1. - rr * rr) + .02));
      float noseY = faceY - face.x * .43;
      vec2 bridgeShape = vec2(q.x / noseBridge.x, (noseY - noseBridge.z) / noseBridge.y);
      vec2 tipShape = vec2(q.x / noseTip.x, (noseY - noseTip.z) / noseTip.y);
      float wingX = abs(q.x) - noseWing.x;
      vec2 wingShape = vec2(wingX / noseWing.y, (noseY - noseWing.w) / noseWing.z);
      float ridge = exp(-dot(bridgeShape, bridgeShape)) * noseBridge.w;
      float tip = exp(-dot(tipShape, tipShape));
      float wing = exp(-dot(wingShape, wingShape));
      float nose = max(ridge * .7, max(tip, wing * .72));
      vec2 wingSlope = vec2(wingShape.x * sign(q.x), wingShape.y) * wing * .47;
      n = normalize(n + vec3((bridgeShape * ridge * .66 + tipShape * tip * 1.27 + wingSlope) * noseTip.w, 0.));
      // Wrapped light keeps the copper shadows warm and gives the silhouette an amber glow.
      float wrap = clamp((dot(n, L) + .5) / 1.5, 0., 1.);
      float under = smoothstep(-.44, .08, q.y);
      vec3 orange = furColor;
      vec3 lit = mix(vec3(.43, .105, .025), orange * 1.12, wrap) * mix(.7, 1., under);
      lit += orange * vec3(1., .8, .64) * clamp(-n.y, 0., 1.) * (1. - under) * .2;
      lit += vec3(1., .59, .31) * pow(1. - n.z, 2.2) * (.26 + .3 * dark);
      lit += vec3(1., .87, .66) * pow(max(dot(reflect(-L, n), V), 0.), 5.) * .1;
      lit += vec3(.25, .115, .03) * nose;
      vec2 nostril = vec2((abs(q.x) - noseNostril.x) / noseNostril.z, (noseY - noseNostril.y) / noseNostril.w);
      lit = mix(lit, vec3(.30, .12, .072), .78 * exp(-dot(nostril, nostril)));
      float cheek = abs(q.x);
      float cheekLine = -.204 + .191 * smoothstep(.052, .35, cheek);
      float beard = (1. - smoothstep(cheekLine - .036, cheekLine + .017, q.y)) * mix(1., .53, smoothstep(.25, .39, cheek));
      beard *= beardStrength * mix(1., 1. - smoothstep(.11, .2, cheek), goatee);
      float upperLip = faceY + .126 + .087 * smoothstep(.018, .136, cheek) - face.x * .103 - face.y * .145;
      float whiskers = (1. - smoothstep(.012, .034, abs(upperLip))) * (1. - smoothstep(.109, .15, cheek))
        * mix(.6, 1., smoothstep(.006, .029, cheek)) * (1. - .68 * nose);
      float join = (1. - smoothstep(.015, .036, abs(cheek - .108))) * smoothstep(-.267, -.215, faceY)
        * (1. - smoothstep(-.18, -.15, faceY));
      whiskers = max(whiskers, join);
      whiskers *= beardStrength;
      lit = mix(lit, lit * vec3(.39, .38, .44) + vec3(.025, .009, .006), max(beard, whiskers) * .94);
      float lipX = q.x + .0044;
      float lipSide = smoothstep(-.07, .066, lipX);
      float lift = mix(.005, .011, lipSide) + face.y * mix(.205, .37, lipSide);
      float corners = smoothstep(.012, .084, abs(lipX)) * lift;
      float lipY = (faceY + .208 - face.x * .15 - corners) / mix(.011, .047, face.z);
      vec2 aperture = vec2(lipX / (mix(.078, .096, face.z) + .066 * face.y),
                           lipY * mix(.83, 1.36, smoothstep(-.1, .18, lipY)));
      float mouthRadius = length(aperture);
      float mouth = 1. - smoothstep(.57, 1.18, mouthRadius);
      float mouthOpenness = smoothstep(.035, .25, face.z);
      lit *= 1. - (.3 + .13 * face.z) * mouth * mouthOpenness;

      // Fur, as stacked shells. Each hair is rooted in a cell of a fine grid (about a pixel and a half
      // across), leans along the flow, tapers, and is darker at the root than at the tip. Drawing the
      // shells tips first lets nearer hair cover what's under it, which is what makes it read as a pelt.
      // The flow: out from the middle and pulled down, with a slow wave so neighbouring hairs lie
      // together, and short where the hair points at you (round the crown).
      // Hair grows out of the skin and gravity pulls it down. Seen from the front that's outward at the
      // silhouette and short and downward on the face, where it points more at you.
      vec2 fv = sg * rr * 1.1 + vec2(-q.x * .4 * beard, -.5 - .3 * beard);
      vec2 flow = fv / max(1., length(fv));
      float wv = (noise(q * 3.2 + 7.) - .5) * .75;
      flow = mat2(cos(wv), sin(wv), -sin(wv), cos(wv)) * flow;
      float lean = 1.;
      float cell = max(2.6 * px, FUR / float(SHELLS) * 1.25);
      // Shine, the way hair has it: two highlights running along the strands (Kajiya-Kay, with the
      // tangent nudged each way). The first is narrow and nearly white; the second is broader, sits a
      // little lower and shifts from copper to gold across the pelt. Both move with the fur.
      vec3 T = normalize(vec3(flow + swing * 3., .5));
      vec3 Hv = normalize(L + V);
      float t1 = dot(normalize(T + n * .2), Hv), t2 = dot(normalize(T - n * .25), Hv);
      float spec1 = pow(sqrt(max(0., 1. - t1 * t1)), 80.) * .32 * wrap;  // no shine where the light doesn't reach
      float spec2 = pow(sqrt(max(0., 1. - t2 * t2)), 18.) * .37 * wrap;
      float hue = fract(t2 * 1.4 + q.x * .7 + q.y * .3 + time * .015);
      vec3 irid = mix(vec3(1., .56, .32), vec3(1., .83, .53), .5 - .5 * cos(6.2832 * hue));
      // A breeze moves through the fur on its own; the swing is the fur trailing the body.
      vec2 breeze = (vec2(noise(q * 2.2 + vec2(time * .35, 0.)), noise(q * 2.2 + vec2(0., time * .3) + 5.)) - .5) * .055;
      // The pointer brushes the fur where it passes, like a hand stroking it, and the fur springs back.
      float stroke = exp(-dot(p - brush.xy, p - brush.xy) / .1);
      float soft = max(smoothstep(.1, .35, q.y), smoothstep(.26, .49, abs(q.x)));
      float twinkle = step(120., R.y) * (1. - .75 * soft);
      vec4 fur = vec4(0.);
      vec2 side = vec2(-flow.y, flow.x);
      float CL = cell * 4.;  // clump size: a few hairs gather into each tuft
      for (int i = 0; i < SHELLS; i++) {
        float k = 1. - (float(i) + .5) / float(SHELLS);
        float hh = k * FUR;
        vec2 p0 = q - flow * hh * lean;
        // Hair bends a little to one side along its length, in waves that neighbours share.
        p0 -= side * (noise(p0 * 5.5 + 3.) - .5) * 2. * hh * hh / FUR * .6;
        p0 -= (swing + breeze + brush.zw * stroke) * k * k;  // tips move most, roots stay put
        // Toward the tips, hairs gather to their clump's centre: undo that pull to find the root.
        vec2 cg = p0 / CL, cb = floor(cg), cid = cb, cc = vec2(0.);
        float best = 9.;
        for (int j = 0; j < 9; j++) {  // the nearest tuft centre, so tufts come out round, not square
          vec2 o = cb + vec2(mod(float(j), 3.), floor(float(j) / 3.)) - 1.;
          vec2 c = o + .5 + (vec2(hash(o + 3.1), hash(o + 8.7)) - .5) * .8;
          float dd = dot(cg - c, cg - c);
          if (dd < best) { best = dd; cid = o; cc = c * CL; }
        }
        float pull = .5 * k;
        vec2 root = cc + (p0 - cc) / (1. - pull);
        if (body(root) > 0.) continue;
        vec2 gc = root / cell;
        gc.x += .5 * mod(floor(gc.y), 2.);  // staggered rows, so the hairs don't line up in a grid
        vec2 id = floor(gc), f = fract(gc) - .5;
        float r1 = hash(id), r2 = hash(id + 19.19), r3 = hash(id + 47.7);
        float tuft = hash(cid + 11.3);  // hairs in a tuft are about the same length
        float len = FUR * (.7 + .3 * r1) * (.5 + .5 * tuft) * mix(.45, 1., smoothstep(-.35, .1, root.y));
        len *= (1. + .15 * beard - .08 * whiskers) * (1. - max(.64 * mouth, .48 * nose));
        if (hh > len) continue;
        float u = hh / len;
        float rad = (.32 + .12 * r3) * (1. - .65 * u);
        float feather = mix(.17, .28, soft);
        float cov = (1. - smoothstep(rad - feather, rad + feather, length(f - (vec2(r2, r3) - .5) * .5))) * (1. - .35 * u * u);
        vec3 hc = lit * mix(.72, 1.2, u) * (.88 + .26 * r2) * (.93 + .14 * tuft);
        hc = mix(hc, vec3(1., .73, .46) * length(lit) * .72, u * u * .3);
        float tint = hash(cid + 23.1);
        hc *= mix(vec3(1.02, .9, .83), vec3(1.04, 1.06, .95), tint);
        hc += (vec3(1., .96, .9) * spec1 + irid * spec2) * u * (.6 + .8 * r2);
        float spark = step(.986, hash(id + floor(time * 1.5 + r1 * 9.) * .731)) * step(.7, u) * twinkle;
        hc += vec3(1., .95, .85) * spark * (spec1 + spec2) * 2.3;
        fur += (1. - fur.a) * vec4(hc, 1.) * cov;
      }
      fur += (1. - fur.a) * vec4(lit * .6, 1.) * smoothstep(px, -px, d0);  // the undercoat between hairs

      // Eyes set into the fur. A white ball, a brown iris with fine streaks and a dark
      // outer ring, a black pupil, and a window-shaped reflection that stays put while the iris turns
      // to look about (the iris squashes as it turns toward the edge of the ball). Fur-coloured lids
      // close over the ball to blink and to sleep; when it's pleased it squints up from below, which
      // reads as a smile.
      vec4 eyes = vec4(0.);
      float socket = 0.;
      const float IR = .69;  // iris radius, in eyeball radii
      for (int i = 0; i < 2; i++) {
        float sx = i == 0 ? -1. : 1.;
        // Big and close-set, the right one a touch larger, as in the reference.
        vec2 c = vec2(sx * .177, .067 - sx * .009 - nod) + look * vec2(.02, .015);
        float er = .145 * (sx > 0. ? 1.05 : .98) * (1. + .05 * wide) * eyeSize;
        float PR = pupil;
        vec2 v = (q - c) / er;  // eyeball space: the ball is the unit disc
        if (eyeType > .5 && eyeType < 1.5) v /= vec2(1.08, .85);
        float d = length(v);
        socket = max(socket, smoothstep(1.55, 1., d));
        float aa = px / er * 1.2;
        float ball = smoothstep(1. + aa, 1. - aa, d);
        vec3 en = vec3(v, sqrt(max(0., 1. - d * d)));
        // The white, lit like the body and greyer toward the rim, where it turns away into the fur.
        vec3 col = vec3(.98, .96, .93) * (.6 + .45 * clamp(dot(en, L) * .6 + .45, 0., 1.));
        col *= mix(1., .62, smoothstep(.55, 1., d));
        col = mix(col, vec3(.86, .63, .46), smoothstep(.7, 1., d) * .3);
        vec2 g = vec2(0., .06) + look * vec2(.48, mix(.4, .32, abs(inspect)));
        float gl = length(g);
        vec2 gd = gl > 1e-3 ? g / gl : vec2(1., 0.);
        vec2 iv = v - g;
        vec2 ivr = vec2(dot(iv, gd) / sqrt(max(.25, 1. - gl * gl)), dot(iv, vec2(-gd.y, gd.x)));
        float ir = length(ivr), ang = atan(ivr.y, ivr.x), ia = aa * 1.2;
        vec3 iris = mix(eyeColor, eyeColor * vec3(.63, .66, .80), smoothstep(PR + .025, IR - .07, ir));
        iris *= .82 + .32 * noise(vec2(ang * 8., ir * 10.));
        iris = mix(iris, eyeColor * vec3(.37, .4, .52), smoothstep(IR - .07, IR, ir));
        iris *= .55 + .5 * clamp(dot(en, L) * .6 + .5, 0., 1.);
        col = mix(col, iris, smoothstep(IR + ia, IR - ia, ir));
        col = mix(col, vec3(.02, .015, .015), smoothstep(PR + ia, PR - ia, ir));
        float win = smoothstep(.17 + aa, .17 - aa, length((v - vec2(-.3, .36)) * vec2(1., 1.25)));
        float dot2 = smoothstep(.07 + aa, .07 - aa, length(v - vec2(.32, -.3)));
        col += vec3(1.) * (win * .92 + dot2 * .55) + vec3(1., .97, .92) * pow(max(dot(reflect(-L, en), V), 0.), 18.) * .25;
        // Lids: the upper one comes down to blink or sleep; for a smile the lower one rises in an arch.
        float rim = sqrt(max(0., 1. - v.x * v.x));
        float eyeWink = max(0., sx * wink);
        float shut = max(blink, sleep);
        // Personality lives in the upper lid: where it rests and how it tilts (inner corners up reads
        // soft and pleading, down reads intent). It opens all the way at the top of a hop.
        float inner = -sx * v.x;
        float top = mix(lidTop + lidSlant * inner + sx * inspect * .23, 1.08, wide) - joy * .12;
        top -= styling * .06 + .22 * step(1.5, eyeType);
        float upper = mix(mix(top, -1.02, shut), -.36, eyeWink) * rim;
        float lower = mix(mix(-1.08, -.7, joy), -.29, eyeWink) * rim;
        float lidA = max(smoothstep(upper - aa, upper + aa, v.y), smoothstep(lower + aa, lower - aa, v.y));
        float lash = smoothstep(.1, 0., abs(v.y - upper)) * step(.02, shut + joy + eyeWink)
          + smoothstep(.1, 0., abs(v.y - lower)) * joy;
        vec3 lid = lit * (.62 + .38 * en.z) * (1. - .55 * lash);
        col = mix(col, lid, lidA);
        eyes = over(vec4(col, 1.) * ball, eyes);
      }
      fur.rgb *= 1. - socket * .38;
      acc = over(fur, acc);
      acc = over(eyes * fur.a, acc);
      float mouthLower = 1. - smoothstep(-.76, .13, aperture.y);
      float lip = smoothstep(.65, 1., mouthRadius) * mouthLower;
      vec3 insideMouth = mix(vec3(.443, .227, .141), vec3(.608, .329, .192), mouthLower * .72);
      insideMouth = mix(insideMouth, vec3(.624, .286, .153), lip * .68);
      vec3 closedLips = mix(vec3(.455, .224, .137), vec3(.631, .345, .2), mouthLower);
      vec3 mouthColor = mix(closedLips, insideMouth, mouthOpenness);
      acc = over(vec4(mouthColor, 1.) * (mix(.78, .94, mouthOpenness) * (1. - smoothstep(.65, 1.14, mouthRadius))), acc);

      // Tortoiseshell acetate, drawn in body space with softer amber patches.
      vec2 eyewear = vec2(q.x * (1. + squash), (q.y - .081) * (1. - squash) + .081);
      eyewear = (eyewear - vec2(0., .081)) / glassesSize + vec2(0., .081);
      eyewear.y += nod + glassesDown * .21;
      float x = abs(eyewear.x);
      float frameY = (eyewear.y - .081) / 1.075 + .081;
      vec2 frame = vec2(x - .195, frameY - .081);
      if (glassesStyle > 2.5 && glassesStyle < 3.5) frame.y -= max(0., frame.x) * .32;
      float outside = (length(frame / vec2(.171, .161)) - 1.) * .16;
      float opening = (length((frame - vec2(0., .004)) / vec2(.147, .132)) - 1.) * .132;
      if (glassesStyle > .5 && glassesStyle < 1.5) {
        outside = (length(frame / .168) - 1.) * .168;
        opening = (length(frame / .139) - 1.) * .139;
      }
      if (glassesStyle > 1.5 && glassesStyle < 2.5) {
        outside = (pow(pow(abs(frame.x / .171), 4.) + pow(abs(frame.y / .161), 4.), .25) - 1.) * .16;
        opening = (pow(pow(abs(frame.x / .147), 4.) + pow(abs((frame.y - .004) / .132), 4.), .25) - 1.) * .132;
      }
      if (glassesStyle > 3.5) {
        outside = frameDistance(frame);
        opening = outside + frameMetrics.z;
      }
      float keyhole = .129 + .022 * (1. - smoothstep(.018, .058, x));
      float bridgeDist = max(x - .083, max(frameY - .194, keyhole - frameY));
      if (glassesStyle > 3.5) {
        float arch = frameMetrics.w + .014 * (1. - smoothstep(0., .085, x));
        bridgeDist = max(x - .09, abs(frameY - arch) - .011);
        if (frameBrow > .5) bridgeDist = min(bridgeDist, max(x - .37, abs(frameY - (.081 + frameMetrics.y * .87)) - .009));
      }
      float armDist = max(abs(x - .407) - .044, abs(frameY - .152) - .014);
      float hingeDist = max(abs(x - .368) - .033, abs(frameY - .15) - .031);
      float frameDist = max(min(outside, min(bridgeDist, hingeDist)), -opening);
      float arm = 1. - smoothstep(-px, px, armDist);
      float edge = 1. - smoothstep(-px, px, frameDist);
      float front = 1. - smoothstep(-px, px, frameDist + .008);
      float mottle = smoothstep(.15, .84, noise(eyewear * vec2(10.4, 13.1) + vec2(4.2, 2.1)));
      if (frameFinish < .5 || (frameFinish > 1.5 && frameFinish < 2.5)) mottle = 1.;
      if (frameFinish > 2.5) mottle = smoothstep(.40, .57, noise(eyewear * vec2(17., 10.) + vec2(1.8)));
      vec3 acetate = mix(frameColor * .33, frameColor, mottle);
      float crystal = frameFinish > 1.5 && frameFinish < 2.5 ? 1. : 0.;
      acetate = mix(acetate, mix(acetate, vec3(.94, .94, .87), .12), crystal);
      float frontOpacity = frameFinish < .5 ? 1. : mix(mix(.98, .80 - .03 * transparency, mottle), clamp(.72 - .17 * transparency, .35, .8), crystal);
      vec2 glint = vec2(sign(eyewear.x) * frame.x, frame.y) - vec2(.075, .13);
      float reflection = 1. - smoothstep(.026, .083, length(glint));
      float visible = step(-.5, glassesStyle);
      acc = over(vec4(frameColor * .4, 1.) * arm * mix(1., .65, crystal) * visible, acc);
      acc = over(vec4(frameColor * mix(.26, .62, crystal), 1.) * (.9 * (edge - front)) * visible, acc);
      acc = over(vec4(acetate, 1.) * (frontOpacity * front) * visible, acc);
      acc = over(vec4(1., .79, .56, 1.) * (.23 * front * reflection * shine) * visible, acc);
      gl_FragColor = acc;
    }`;
  const VERT = 'attribute vec2 v; void main() { gl_Position = vec4(v, 0., 1.); }';
  let U = null;  // the shader's uniforms; null while WebGL can't run, and every bot is the still picture
  if (gl) {
    const shader = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'v');
    gl.linkProgram(prog);
    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      U = Object.fromEntries(['R', 'look', 'blink', 'sleep', 'hop', 'squash', 'dark', 'time', 'swing', 'lean', 'joy', 'inspect', 'glassesDown', 'wink', 'wide', 'brush', 'lidTop', 'lidSlant', 'pupil', 'face',
        'furColor', 'eyeColor', 'frameColor', 'headShape', 'furLength', 'beardStrength', 'goatee', 'noseBridge', 'noseTip', 'noseWing', 'noseNostril',
        'eyeSize', 'eyeType', 'styling', 'glassesStyle', 'glassesSize', 'transparency', 'shine', 'frameMetrics', 'frameBrow', 'frameFinish']
        .map((k) => [k, gl.getUniformLocation(prog, k)]));
      U.frameContour = gl.getUniformLocation(prog, 'frameContour[0]');
    }
  }
  const picture = (host) => host.replaceChildren(Object.assign(document.createElement('img'), { src: host.getAttribute('fallback') || window.companionBotAppearance.assetUrl('bot-still.png'), alt: '' }));
  glc.addEventListener('webglcontextlost', (e) => { e.preventDefault(); U = null; live.forEach((b) => picture(b.host)); live.clear(); });

  // Draw one bot in the corner of the shared canvas and copy it onto the bot's own.
  function draw(b) {
    const appearance = window.companionBotAppearance.forHost(b.host);
    const n = b.n, s = b.s;
    if (glc.width < n || glc.height < n) glc.width = glc.height = Math.max(n, glc.width, glc.height);
    gl.viewport(0, 0, n, n);
    gl.uniform2f(U.R, n, n);
    gl.uniform2f(U.look, s.lx, s.ly);
    gl.uniform3fv(U.furColor, rgb(appearance.fur.color)); gl.uniform3fv(U.eyeColor, rgb(appearance.face.eyeColor));
    gl.uniform3fv(U.frameColor, rgb(appearance.glasses.frameColor)); gl.uniform3fv(U.headShape, HEAD_SHAPES[appearance.fur.headShape]);
    gl.uniform1f(U.furLength, appearance.fur.length);
    gl.uniform1f(U.beardStrength, appearance.fur.beard * ({ none: 0, stubble: .35, full: 1, goatee: 1 }[appearance.fur.beardStyle]));
    gl.uniform1f(U.goatee, appearance.fur.beardStyle === 'goatee' ? 1 : 0);
    const nose = window.companionBotAppearance.nosePresets[appearance.face.noseType].flat;
    gl.uniform4fv(U.noseBridge, nose.bridge); gl.uniform4fv(U.noseTip, nose.tip);
    gl.uniform4fv(U.noseWing, nose.wing); gl.uniform4fv(U.noseNostril, nose.nostril);
    gl.uniform1f(U.eyeSize, appearance.face.eyeSize);
    gl.uniform1f(U.eyeType, { round: 0, almond: 1, sleepy: 2 }[appearance.face.eyeType]);
    gl.uniform1f(U.styling, { neutral: 0, feminine: -1, masculine: 1 }[appearance.face.styling]);
    const catalog = window.companionBotAppearance.frameCatalog;
    const frameIndex = catalog.findIndex(frame => frame.id === appearance.glasses.style);
    gl.uniform1f(U.glassesStyle, frameIndex >= 0 ? 4 + frameIndex : { none: -1, keyhole: 0, round: 1, square: 2, catEye: 3 }[appearance.glasses.style]);
    if (frameIndex >= 0) {
      const frame = catalog[frameIndex];
      gl.uniform2fv(U.frameContour, frame.contour.flat());
      gl.uniform4f(U.frameMetrics, frame.rx * .455, frame.ry * .455, frame.rim * .455, (frame.bridge - .2) * .455 + .081);
      gl.uniform1f(U.frameBrow, frame.brow ? 1 : 0);
    }
    gl.uniform1f(U.frameFinish, { solid: 0, tortoise: 1, crystal: 2, paradox: 3 }[appearance.glasses.finish]);
    gl.uniform1f(U.glassesSize, appearance.glasses.size); gl.uniform1f(U.transparency, appearance.glasses.transparency);
    gl.uniform1f(U.shine, appearance.glasses.shine);
    gl.uniform1f(U.blink, Math.max(s.blink, s.squint)); gl.uniform1f(U.sleep, s.sleep);
    gl.uniform1f(U.hop, s.hop); gl.uniform1f(U.squash, s.squash);
    gl.uniform1f(U.dark, isDark() ? 1 : 0);
    gl.uniform1f(U.time, clockT);
    gl.uniform2f(U.swing, s.fx, s.fy);
    gl.uniform1f(U.lean, s.leanAll); gl.uniform1f(U.joy, s.joy); gl.uniform1f(U.wide, s.wide);
    gl.uniform1f(U.inspect, s.inspect); gl.uniform1f(U.glassesDown, s.glassesDown); gl.uniform1f(U.wink, s.wink);
    gl.uniform3f(U.face, s.nose, s.smile, s.mouth * appearance.personality.mouthMovement);
    gl.uniform4f(U.brush, b.bx, b.by, s.brx, s.bry);
    gl.uniform1f(U.lidTop, s.lidTop); gl.uniform1f(U.lidSlant, s.lidSlant); gl.uniform1f(U.pupil, s.pupil);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    b.ctx.clearRect(0, 0, n, n);
    b.ctx.drawImage(glc, 0, glc.height - n, n, n, 0, 0, n, n);  // GL's corner is bottom-left, 2D's top-left
  }

  // ---------- behaviour ----------
  let mood = (window.companionBot && window.companionBot.pending) || 'idle';  // the whole page's: every bot shares it
  const live = new Set();
  // A bot that's drawn again under the same name (the page re-renders whenever its data changes)
  // carries on from where it was instead of starting over.
  const kept = new Map();
  const GAZE = { left: [-1, -0.15], right: [1, -0.15], down: [0, -0.6] };
  function makeBot() {
    return { s: { lx: 0, ly: 0, tx: 0, ty: 0, blink: 0, sleep: mood === 'sleeping' ? 1 : 0, hop: 0, squash: 0,
      lean: 0, leanV: 0, leanAll: 0, fx: 0, fy: 0, fvx: 0, fvy: 0, squint: 0, wide: 0, joy: 0,
      inspect: 0, glassesDown: 0, wink: 0,
      nose: 0, smile: 0, mouth: 0, brx: 0, bry: 0, brvx: 0, brvy: 0,
      lidTop: 0.74, lidSlant: 0.16, pupil: 0.3 },
      nextLook: 0, nextBlink: rand(0.8, 3), blinkAt: -9, hopAt: -1, attnUntil: 0, prevHop: 0, hopDir: 1, poke: false, joyAt: -9,
      nextFidget: performance.now() / 1000 + rand(5, 9), fidget: null, fidgetAt: -9, fidgetSide: 1,
      bx: 9, by: 9, bt: 0 };
  }

  // One hop, 0.78s: crouch to wind up (anticipation), spring out of it and stretch on take-off, round
  // off at the top, stretch into the fall, squash on landing and wobble to rest.
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
    const u = Math.max(0, Math.min(1, (t - start) / (end - start)));
    return u * u * (3 - 2 * u);
  }

  function tick(b, t, dt, focal) {
    const appearance = window.companionBotAppearance.forHost(b.host);
    const botMood = b.host.hasAttribute('preview') ? 'idle' : mood;
    const s = b.s, asleep = botMood === 'sleeping';
    s.sleep += ((asleep ? 1 : 0) - s.sleep) * ease(4, dt);
    if (asleep) { s.tx = 0; s.ty = -0.4; }
    else if (t > b.nextLook && t > b.attnUntil) {
      const glance = Math.random() < 0.3;
      if (botMood === 'working') [s.tx, s.ty] = glance ? [rand(-1, 1), rand(-0.2, 0.4)] : [rand(-0.3, 0.3), -0.45];
      else if (b.gaze && Math.random() < 0.65) [s.tx, s.ty] = [b.gaze[0] + rand(-0.2, 0.15), b.gaze[1] + rand(-0.25, 0.25)];
      else [s.tx, s.ty] = Math.random() < 0.3 ? [0, 0.3] : [rand(-1, 1), rand(-0.4, 0.9)];  // mostly up, at you
      b.nextLook = t + rand(1.2, 3.6);
    }
    // Only the main visible mascot fidgets. The gaze leads, then the head and glasses follow.
    if (appearance.personality.idleGestures && botMood === 'idle' && focal && b.hopAt < 0 && t - b.joyAt > 0.3 && t > b.nextFidget && t - b.blinkAt > 0.16) {
      b.fidget = b.fidget === 'examine' ? 'wink' : 'examine';
      b.fidgetAt = t;
      b.fidgetSide = Math.random() < 0.5 ? -1 : 1;
      b.nextFidget = t + rand(9, 16);
      b.nextBlink = Math.max(b.nextBlink, t + (b.fidget === 'wink' ? 0.36 : 1.55));
    }
    const fidgetTime = botMood === 'idle' && b.hopAt < 0 ? t - b.fidgetAt : Infinity;
    const exam = b.fidget === 'examine' ? fidgetTime : Infinity;
    const peek = fidgetEase(exam, 0, 0.21) * (1 - fidgetEase(exam, 1.0, 1.48));
    const tilt = fidgetEase(exam, 0.06, 0.38) * (1 - fidgetEase(exam, 1.1, 1.5));
    const slide = fidgetEase(exam, 0.14, 0.46) * (1 - fidgetEase(exam, 1.17, 1.58));
    const readingX = -0.26 + 0.52 * fidgetEase(exam, 0.4, 0.97);
    s.inspect += (b.fidgetSide * tilt - s.inspect) * ease(24, dt);
    s.glassesDown += (slide - s.glassesDown) * ease(20, dt);
    s.wink = b.fidget === 'wink' && fidgetTime < 0.28
      ? b.fidgetSide * fidgetEase(fidgetTime, 0, 0.09) * (1 - fidgetEase(fidgetTime, 0.09, 0.28)) : 0;
    const previousLookY = s.ly;
    s.lx += (s.tx + (readingX - s.tx) * peek - s.lx) * ease(16, dt);
    s.ly += (s.ty + (-0.78 - s.ty) * peek - s.ly) * ease(16, dt);
    // Its expression: soft and a little pleading at rest, wide-eyed with big pupils when something
    // (your pointer) has its interest, and intent while it works.
    const interested = t < b.attnUntil;
    const [lidTo, slantTo, pupilTo] = botMood === 'working' ? [0.6, -0.1, 0.27] : interested ? [0.88, 0.1, 0.37] : [0.72, 0.18, 0.3];
    s.lidTop += (lidTo - s.lidTop) * ease(5, dt);
    s.lidSlant += (slantTo - s.lidSlant) * ease(5, dt);
    s.pupil += (pupilTo - s.pupil) * ease(4, dt);

    if (!asleep && t > b.nextBlink) {
      b.blinkAt = t;
      b.nextBlink = t + (Math.random() < 0.2 ? 0.3 : rand(2.2, 5.5)) / appearance.personality.blinkRate;
    }
    const bk = (t - b.blinkAt) / 0.16;
    s.blink = bk >= 0 && bk <= 1 ? Math.sin(Math.PI * bk) : 0;

    let hop = 0, squash = asleep ? Math.sin(t * 1.3) * 0.045 : Math.sin(t * 2.4) * 0.02;  // breathing
    let squint = 0, wide = 0, hopLean = 0;
    if (b.hopAt >= 0 && t >= b.hopAt) {
      const k = (t - b.hopAt) / HOP;
      if (k >= 1) {
        b.hopAt = -1; b.hopDir = -b.hopDir;
        if (b.poke) { b.poke = false; b.joyAt = t; }  // poked: it lands pleased with itself
      } else {
        const [hh, sq] = hopPose(k); hop = hh; squash += sq;
        const air = (k - CROUCH) / (LAND - CROUCH);
        // It narrows its eyes as it gathers itself, opens them wide in the air, and leans a little to
        // one side and back, so the hop travels an arc; the next hop leans the other way.
        if (k < CROUCH) squint = (b.poke ? 0.22 : 0.5) * Math.sin((k / CROUCH) * Math.PI / 2);
        else if (air < 1) { wide = Math.sin(Math.PI * air); hopLean = b.hopDir * 0.07 * wide; }
      }
    }
    s.hop = hop; s.squash = squash; s.squint = squint; s.wide = wide;
    const j = (t - b.joyAt) / 0.3;
    s.joy = j >= 0 && j < 1 ? Math.sin(Math.PI * j) : 0;
    const vy = dt > 0 ? (hop - b.prevHop) / dt : 0;
    b.prevHop = hop;
    // The body leans toward where the eyes look, a beat behind them: the eyes lead, the body follows.
    const leanTo = asleep ? 0 : s.lx * 0.09 + hopLean;
    for (let left = dt; left > 0; left -= 1 / 60) {
      const h = Math.min(left, 1 / 60);
      s.leanV += (-70 * (s.lean - leanTo) - 11 * s.leanV) * h;
      s.lean += s.leanV * h;
    }
    // Match the nose lift and the mouth's follow-through on the 3D bot.
    s.nose += (0.055 * s.wide - 0.095 * s.squint + 0.031 * s.joy - 0.018 * peek - s.nose) * ease(17, dt);
    s.smile += (0.09 * s.joy + 0.035 * Math.abs(s.wink) + 0.023 * peek - s.smile) * ease(13, dt);
    const allFrom = s.leanAll;
    s.leanAll = s.lean + s.inspect * 0.12;
    const vx = dt > 0 ? (s.leanAll - allFrom) / dt * 0.8 : 0;  // how fast the top of the body is moving sideways
    const pitchSpeed = dt > 0 ? (s.ly - previousLookY) * 0.12 / dt : 0;
    const turnOpening = asleep ? 0 : Math.max(0, Math.min(0.4, (Math.hypot(vx * 4, pitchSpeed) - 0.1) * 0.32));
    s.mouth += (Math.max(0.65 * s.wide, turnOpening) - s.mouth) * ease(15, dt);
    // The fur trails changes in the body's motion and sags a little more while it sleeps.
    const fxTo = Math.max(-0.13, Math.min(0.13, -vx * 0.08));
    const fyTo = Math.max(-0.13, Math.min(0.13, -vy * 0.08 - s.sleep * 0.02));
    for (let left = dt; left > 0; left -= 1 / 60) {
      const h = Math.min(left, 1 / 60);
      s.fvx += (120 * (fxTo - s.fx) - 9 * s.fvx) * h; s.fx += s.fvx * h;
      s.fvy += (120 * (fyTo - s.fy) - 9 * s.fvy) * h; s.fy += s.fvy * h;
      s.brvx += (-110 * s.brx - 7 * s.brvx) * h; s.brx = Math.max(-0.14, Math.min(0.14, s.brx + s.brvx * h));
      s.brvy += (-110 * s.bry - 7 * s.brvy) * h; s.bry = Math.max(-0.14, Math.min(0.14, s.bry + s.brvy * h));
    }
  }

  function still(b) {  // reduced motion: one pose per mood, no wandering
    const zz = !b.host.hasAttribute('preview') && mood === 'sleeping', g = b.gaze || [0, 0];
    Object.assign(b.s, { lx: zz ? 0 : g[0] * 0.8, ly: zz ? -0.4 : g[1], blink: 0, hop: 0, squash: 0,
      sleep: zz ? 1 : 0, lean: 0, leanAll: 0, fx: 0, fy: zz ? -0.02 : 0, squint: 0, wide: 0, joy: 0,
      inspect: 0, glassesDown: 0, wink: 0,
      nose: 0, smile: 0, mouth: 0, brx: 0, bry: 0,
      lidTop: mood === 'working' ? 0.6 : 0.72, lidSlant: mood === 'working' ? -0.1 : 0.18, pupil: 0.3 });
    if (b.previewExpression === 'wink') Object.assign(b.s, { wink: 1, smile: 0.035 });
    if (b.previewExpression === 'examine') Object.assign(b.s, { lx: 0, ly: -0.78, inspect: 0.65, glassesDown: 0.85, nose: -0.018, smile: 0.023 });
  }
  const shown = (b) => b.host.getClientRects().length > 0;  // false inside a hidden view

  // They only animate while the tab is showing; a hidden tab gets no frames at all.
  let last = performance.now(), lastDraw = -1e9, raf = 0, clockT = 0;
  function frame(now) {
    raf = 0;
    if (reduce.matches) return restart();
    if (document.hidden) return;
    if (now - lastDraw < 32) return schedule();  // about 30 frames a second is plenty
    // real elapsed time, even when frames are throttled; never below zero (a frame's timestamp can be
    // earlier than the clock read when the loop started, and a negative step makes the eases overshoot)
    const t = now / 1000, dt = Math.max(0, Math.min(1.5, (now - last) / 1000));
    last = lastDraw = now;
    clockT = t % 1000;
    let focal = null;
    for (const b of live) if (shown(b) && (!focal || b.n > focal.n)) focal = b;
    for (const b of live) { tick(b, t, dt, b === focal); if (shown(b)) draw(b); }
    schedule();
  }
  function schedule() {
    if (U && live.size && !reduce.matches && !document.hidden && !raf) raf = requestAnimationFrame(frame);
  }
  function restart() {
    cancelAnimationFrame(raf); raf = 0;
    last = performance.now();
    if (reduce.matches) live.forEach((b) => { still(b); draw(b); }); else schedule();
  }
  document.addEventListener('visibilitychange', restart);
  reduce.addEventListener('change', restart);
  addEventListener('companionbotthemechange', () => live.forEach((b) => shown(b) && draw(b)));

  // Each one notices the pointer for a moment, and hops when you poke it.
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
      // Over the bot, the pointer's movement pushes the fur it passes; the push springs back in tick.
      const x = dx / (r.width / 2), y = -dy / (r.height / 2);
      if (Math.abs(x) < 1.1 && Math.abs(y) < 1.1) {
        const gap = Math.max(0.016, t - b.bt);
        if (t - b.bt < 0.2) {
          b.s.brvx += Math.max(-3, Math.min(3, (x - b.bx) / gap)) * 0.35;
          b.s.brvy += Math.max(-3, Math.min(3, (y - b.by) / gap)) * 0.35;
        }
        b.bx = x; b.by = y; b.bt = t;
      }
    }
  }, { passive: true });

  // <companion-bot size="72" name="allclear" gaze="left" hop>: size in CSS pixels; name keeps its place
  // across re-renders; gaze is where it tends to look when idle; hop jumps once on arrival.
  customElements.define('companion-bot', class extends HTMLElement {
    connectedCallback() {
      const size = Number(this.getAttribute('size')) || 32;
      this.style.width = this.style.height = `${size}px`;
      if (!U) return picture(this);
      const name = this.getAttribute('name');
      const b = (name && kept.get(name)) || makeBot();
      if (name) kept.set(name, b);
      b.host = this;
      b.gaze = GAZE[this.getAttribute('gaze')] || null;
      b.n = Math.max(2 * size, Math.round(size * devicePixelRatio));  // backing pixels
      const canvas = Object.assign(document.createElement('canvas'), { width: b.n, height: b.n });
      b.ctx = canvas.getContext('2d');
      canvas.addEventListener('click', () => {
        if (reduce.matches || mood === 'sleeping') return;
        const t = performance.now() / 1000;
        if (b.hopAt < 0) {
          b.hopAt = t;
          b.poke = true;
          b.nextBlink = Math.max(b.nextBlink, t + HOP + 0.35);
        }
      });
      this.replaceChildren(canvas);
      if (this.hasAttribute('hop') && mood !== 'sleeping' && !reduce.matches) b.hopAt = performance.now() / 1000 + 0.25;
      this.bot = b;
      live.add(b);
      if (reduce.matches) still(b);
      draw(b);  // at once, so it never shows an empty frame
      schedule();
    }
    disconnectedCallback() { if (this.bot) live.delete(this.bot); }
  });

  function refreshAppearance(previewOnly = false) {
    if (U) live.forEach(b => { if (shown(b) && (!previewOnly || b.host.hasAttribute('preview'))) draw(b); });
    schedule();
  }
  addEventListener('companionbotappearancechange', () => refreshAppearance());
  addEventListener('companionbotpreviewchange', () => refreshAppearance(true));
  window.companionBot = {
    renderer: U ? 'flat' : 'still',
    express(host, expression) {
      const b = host?.bot;
      if (!b || !U || !['wink', 'examine', 'neutral'].includes(expression)) return false;
      b.previewExpression = reduce.matches && expression !== 'neutral' ? expression : null;
      if (reduce.matches || expression === 'neutral') {
        b.fidget = null;
        still(b);
      } else {
        const t = performance.now() / 1000;
        b.fidget = expression; b.fidgetAt = t - (expression === 'wink' ? 0.09 : 0.3); b.hopAt = -1; b.poke = false;
        b.blinkAt = -9;
        b.nextFidget = t + rand(9, 16); b.nextBlink = Math.max(b.nextBlink, t + 1.6);
        if (expression === 'examine') { b.s.lx = -0.2; b.s.ly = -0.55; }
        tick(b, t, 1 / 60, false);
      }
      draw(b);
      schedule();
      return true;
    },
    mood(m) {
      if (m === mood) return;
      mood = m;
      if (reduce.matches) live.forEach((b) => { still(b); draw(b); });
    },
  };
  dispatchEvent(new Event('companionbotready'));
})();
