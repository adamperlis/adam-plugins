import type { ReactNode } from "react";

// Optional structural sketches, not a default visual identity. Prefer the complete
// studies for art direction. Override --pattern-radius and --pattern-accent in
// the host design system; replace the composition when the product needs it.

type Action = { href: string; label: string };

const button =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--pattern-radius,4px)] border border-current px-5 py-2.5 text-sm font-semibold transition-transform motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";

export function AsymmetricHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  media,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary: Action;
  secondary?: Action;
  media: ReactNode;
}) {
  return (
    <section className="mx-auto grid min-h-[min(900px,calc(100svh-5rem))] w-[min(94vw,90rem)] items-center gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
      <div>
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
          {eyebrow}
        </p>
        <h1 className="max-w-[12ch] text-balance text-[clamp(3.25rem,7vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.065em]">
          {title}
        </h1>
        <p className="mt-7 max-w-xl text-pretty text-lg leading-7 text-neutral-600">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            className={`${button} bg-neutral-950 text-white`}
            href={primary.href}
          >
            {primary.label}
          </a>
          {secondary && (
            <a
              className={`${button} bg-transparent text-neutral-950`}
              href={secondary.href}
            >
              {secondary.label}
            </a>
          )}
        </div>
      </div>
      <div className="min-h-[32rem] overflow-hidden rounded-[clamp(1.25rem,3vw,2.5rem)] border border-black/15 bg-neutral-900 shadow-[0_2rem_6rem_rgb(0_0_0/0.16)]">
        {media}
      </div>
    </section>
  );
}

export function ProductWindow({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[32rem] flex-col text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-xs text-white/65">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-[var(--pattern-accent,#d5dbbf)]"
        />
        <span>{title}</span>
        <span className="ml-auto">{meta}</span>
      </div>
      <div className="grid flex-1 place-items-center p-[clamp(1.5rem,5vw,5rem)]">
        {children}
      </div>
    </div>
  );
}

export function ProductChapter({
  index,
  title,
  description,
  visual,
  reverse = false,
}: {
  index: string;
  title: string;
  description: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid w-[min(94vw,90rem)] gap-10 border-t border-black/15 py-[clamp(4rem,9vw,9rem)] lg:grid-cols-2 lg:items-center">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="mb-5 font-mono text-xs uppercase tracking-widest text-neutral-500">
          {index}
        </p>
        <h2 className="max-w-[13ch] text-balance text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-7 text-neutral-600">
          {description}
        </p>
      </div>
      <div
        className={`min-h-[28rem] overflow-hidden rounded-3xl border border-black/15 bg-white ${reverse ? "lg:order-1" : ""}`}
      >
        {visual}
      </div>
    </section>
  );
}

export function MetricBand({
  metrics,
}: {
  metrics: Array<{ value: string; label: string; note?: string }>;
}) {
  return (
    <section
      aria-label="Evidence"
      className="grid border-y border-black/15 bg-black/15 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric) => (
        <div className="m-px bg-stone-100 p-7" key={metric.label}>
          <strong className="block text-4xl font-medium tracking-[-0.04em]">
            {metric.value}
          </strong>
          <span className="mt-2 block text-sm text-neutral-600">
            {metric.label}
          </span>
          {metric.note && (
            <small className="mt-4 block text-xs text-neutral-500">
              {metric.note}
            </small>
          )}
        </div>
      ))}
    </section>
  );
}

type Plan = {
  name: string;
  price: string;
  unit?: string;
  description: string;
  features: string[];
  action: Action;
  featured?: boolean;
};

export function PricingMatrix({
  unitExplanation,
  plans,
}: {
  unitExplanation: string;
  plans: Plan[];
}) {
  return (
    <section
      className="mx-auto w-[min(94vw,90rem)] py-24"
      aria-label="Pricing comparison"
    >
      <p className="max-w-2xl text-lg text-neutral-600">{unitExplanation}</p>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            className={`flex min-h-[30rem] flex-col rounded-[var(--pattern-radius,4px)] border border-black/15 p-7 ${plan.featured ? "bg-[var(--pattern-accent,#d5dbbf)]" : "bg-white"}`}
            key={plan.name}
          >
            <p className="text-xs font-semibold uppercase tracking-widest">
              {plan.name}
            </p>
            <h3 className="mt-7 text-5xl font-medium tracking-[-0.05em]">
              {plan.price}{" "}
              <span className="text-sm tracking-normal text-neutral-600">
                {plan.unit}
              </span>
            </h3>
            <p className="mt-5 text-neutral-700">{plan.description}</p>
            <ul className="mt-7 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>— {feature}</li>
              ))}
            </ul>
            <a
              className={`${button} mt-auto ${plan.featured ? "bg-neutral-950 text-white" : "bg-transparent"}`}
              href={plan.action.href}
            >
              {plan.action.label}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FinalAction({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: Action;
}) {
  return (
    <section className="mx-auto grid min-h-[70svh] w-[min(94vw,90rem)] place-content-center py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
        {eyebrow}
      </p>
      <h2 className="mt-6 max-w-[18ch] text-balance text-[clamp(2.5rem,6vw,6rem)] font-medium leading-[0.95] tracking-[-0.055em]">
        {title}
      </h2>
      <a
        className={`${button} mx-auto mt-8 bg-neutral-950 text-white`}
        href={action.href}
      >
        {action.label}
      </a>
    </section>
  );
}
