import type { ReactNode } from "react";
import { archetypes, type ArchetypeId, type PageSection } from "./archetypes";

const layoutClasses: Record<PageSection["layout"], string> = {
  split: "lg:grid-cols-2 lg:items-center",
  stage: "lg:grid-cols-[0.65fr_1.35fr] lg:items-center",
  chapters: "lg:grid-cols-[0.75fr_1.25fr] lg:items-start",
  grid: "lg:grid-cols-3",
  editorial: "lg:grid-cols-[0.65fr_1.35fr] lg:items-start",
  index: "lg:grid-cols-[18rem_1fr] lg:items-start",
};

// Planning wireframe only. Supply project-specific proof and styling before shipping.
export function ArchetypePage({
  type,
  renderProof,
  className = "",
}: {
  type: ArchetypeId;
  renderProof?: (section: PageSection) => ReactNode;
  className?: string;
}) {
  const blueprint = archetypes[type];
  return (
    <main className={`archetype-wireframe ${className}`}>
      <header className="mx-auto flex min-h-16 w-[min(94vw,90rem)] items-center justify-between border-b border-black/15">
        <a href="#top" className="font-semibold">
          Original brand
        </a>
        <a
          href={`#${type}-${blueprint.sections.at(-1)?.id}`}
          className="border px-4 py-2 text-sm"
        >
          {blueprint.primaryAction}
        </a>
      </header>
      <p
        id="top"
        className="mx-auto w-[min(94vw,90rem)] pt-20 text-sm text-neutral-600"
      >
        Concept prompt: {blueprint.conceptPrompt}
      </p>
      {blueprint.sections.map((section, index) => {
        const Heading = index === 0 ? "h1" : "h2";
        return (
          <section
            id={`${type}-${section.id}`}
            key={section.id}
            className={`mx-auto grid w-[min(94vw,90rem)] gap-10 border-b border-current/20 py-12 ${layoutClasses[section.layout]}`}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                {String(index + 1).padStart(2, "0")} / {section.eyebrow}
              </p>
              <Heading className="mt-5 text-2xl font-medium">
                {section.heading}
              </Heading>
              <p className="mt-6 max-w-xl text-lg leading-7 text-neutral-600">
                {section.purpose}
              </p>
            </div>
            {renderProof ? (
              renderProof(section)
            ) : (
              <aside className="border-l border-current/20 pl-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Suggested proof
                </p>
                <strong className="mt-3 block text-2xl">{section.proof}</strong>
                <p className="mt-4 max-w-md text-neutral-600">
                  Replace this placeholder with real content and a composition
                  specific to the project. The blueprint describes intent, not a
                  mandatory component.
                </p>
              </aside>
            )}
          </section>
        );
      })}
    </main>
  );
}
