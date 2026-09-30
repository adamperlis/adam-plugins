import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Progressive enhancement for markup shaped like:
 * <section data-scroll-story>
 *   <div data-story-visual><div data-story-frame="0">…</div>…</div>
 *   <article data-story-step>…</article>…
 * </section>
 *
 * CSS should show every step in normal flow by default. This function only
 * pins the visual on wide screens when motion is allowed.
 */
export function mountScrollStory(root: HTMLElement) {
  const visual = root.querySelector<HTMLElement>("[data-story-visual]");
  const steps = [...root.querySelectorAll<HTMLElement>("[data-story-step]")];
  const frames = [...root.querySelectorAll<HTMLElement>("[data-story-frame]")];
  if (!visual || steps.length === 0 || frames.length !== steps.length)
    return () => {};

  const media = gsap.matchMedia();

  media.add(
    "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    () => {
      root.dataset.scrollEnhanced = "true";
      gsap.set(frames, { autoAlpha: 0, scale: 0.985 });
      gsap.set(frames[0], { autoAlpha: 1, scale: 1 });

      const triggers = steps.map((step, index) =>
        ScrollTrigger.create({
          trigger: step,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => show(index),
          onEnterBack: () => show(index),
        }),
      );

      const pin = ScrollTrigger.create({
        trigger: root,
        start: "top top+=96",
        end: "bottom bottom-=96",
        pin: visual,
        pinSpacing: false,
      });

      function show(index: number) {
        frames.forEach((frame, frameIndex) => {
          gsap.to(frame, {
            autoAlpha: frameIndex === index ? 1 : 0,
            scale: frameIndex === index ? 1 : 0.985,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          });
        });
      }

      return () => {
        delete root.dataset.scrollEnhanced;
        pin.kill();
        triggers.forEach((trigger) => trigger.kill());
        gsap.set(frames, { clearProps: "all" });
      };
    },
  );

  return () => media.revert();
}
