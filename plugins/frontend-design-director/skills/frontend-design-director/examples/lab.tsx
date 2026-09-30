import { createRoot } from "react-dom/client";
import { useEffect, useRef } from "react";
import {
  LayoutTabs,
  ProductStory,
  SectionReveal,
  MagneticAction,
} from "./react/MotionPatterns";
import { AtmosphereCanvas } from "./webgl/AtmosphereCanvas";
import { mountScrollStory } from "./motion/scroll-story";
import "./lab.css";

const items = [
  {
    id: "source",
    label: "Source",
    content: <p>Interview notes and their limitations.</p>,
  },
  {
    id: "decision",
    label: "Decision",
    content: <p>An optional pilot, with a named owner.</p>,
  },
  { id: "review", label: "Review", content: <p>Return after 200 sessions.</p> },
];
function ScrollStudy() {
  const root = useRef<HTMLElement>(null);
  useEffect(
    () => (root.current ? mountScrollStory(root.current) : undefined),
    [],
  );
  return (
    <section
      ref={root}
      className="scroll-study"
      aria-label="Scroll story example"
    >
      <h2 className="mb-4 text-xl">GSAP sequence</h2>
      <div className="scroll-grid">
        <div data-story-visual className="story-visual">
          {items.map((item, index) => (
            <div key={item.id} data-story-frame={index} className="story-frame">
              <strong>{item.label}</strong>
              {item.content}
            </div>
          ))}
        </div>
        <div>
          {items.map((item) => (
            <article key={item.id} data-story-step className="story-step">
              <h3>{item.label}</h3>
              {item.content}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(
  <main className="mx-auto max-w-5xl space-y-12 p-8">
    <a href="./index.html">← Example library</a>
    <h1 className="text-4xl">Interaction lab</h1>
    <p>
      This page verifies integration, not art direction. Two independent tab
      sets test keyboard behavior and unique IDs. The material study below is
      decorative; use it only when its motion supports a project's subject.
    </p>
    <section>
      <h2 className="mb-4 text-xl">Decision views</h2>
      <LayoutTabs items={items} />
    </section>
    <section>
      <h2 className="mb-4 text-xl">Second independent instance</h2>
      <LayoutTabs items={items} />
    </section>
    <section>
      <h2 className="mb-4 text-xl">Product sequence</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          throw new Error("Story controls must not submit forms");
        }}
      >
        <ProductStory
          steps={items.map((item) => ({
            title: item.label,
            description: "Inspect the " + item.label.toLowerCase() + " state.",
            visual: item.content,
          }))}
        />
      </form>
    </section>
    <SectionReveal>
      <section>
        <h2 className="mb-4 text-xl">Reveal and pointer response</h2>
        <p>
          Content enters once; reduced motion keeps it static. The link's target
          stays accessible from the keyboard.
        </p>
        <MagneticAction href="#material">Go to material study</MagneticAction>
      </section>
    </SectionReveal>
    <section id="material">
      <h2 className="mb-4 text-xl">Material field / WebGL</h2>
      <AtmosphereCanvas />
      <p className="mt-4">
        The CSS field remains if WebGL fails. Animation pauses offscreen, in
        hidden tabs, and under reduced motion. Context loss leaves the static
        fallback.
      </p>
    </section>
    <ScrollStudy />
  </main>,
);
