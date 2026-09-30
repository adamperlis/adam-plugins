"use client";

import {
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

const spring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export function SectionReveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

export function MagneticAction({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ x, y }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className="inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
    >
      {children}
    </motion.a>
  );
}

export function LayoutTabs({
  items,
}: {
  items: Array<{ id: string; label: string; content: ReactNode }>;
}) {
  const [selected, setSelected] = useState(items[0]?.id);
  const instance = useId();
  const reduce = useReducedMotion();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const current = items.find((item) => item.id === selected) ?? items[0];
  if (!current) return null;

  return (
    <LayoutGroup id={instance}>
      <div role="tablist" aria-label="Product views" className="flex gap-2">
        {items.map((item, index) => {
          const active = item.id === current.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              aria-controls={`${instance}-panel-${item.id}`}
              id={`${instance}-tab-${item.id}`}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              tabIndex={active ? 0 : -1}
              type="button"
              onClick={() => setSelected(item.id)}
              onKeyDown={(event) => {
                if (
                  !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : (index +
                          (event.key === "ArrowRight" ? 1 : -1) +
                          items.length) %
                        items.length;
                setSelected(items[next].id);
                buttons.current[next]?.focus();
              }}
              className="relative rounded-full px-4 py-2 text-sm"
            >
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : "active-tab"}
                  transition={reduce ? { duration: 0 } : spring}
                  className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm"
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <motion.div
          key={item.id}
          role="tabpanel"
          hidden={item.id !== current.id}
          tabIndex={0}
          id={`${instance}-panel-${item.id}`}
          aria-labelledby={`${instance}-tab-${item.id}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="mt-5 rounded-3xl border border-black/15 bg-white p-6"
        >
          {item.content}
        </motion.div>
      ))}
    </LayoutGroup>
  );
}

export function ProductStory({
  steps,
}: {
  steps: Array<{ title: string; description: string; visual: ReactNode }>;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step.title}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className="w-full rounded-2xl border border-black/10 p-5 text-left"
            >
              <span className="font-mono text-xs text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-2 block text-xl">{step.title}</strong>
              <span className="mt-2 block text-neutral-600">
                {step.description}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="min-h-96 overflow-hidden rounded-3xl bg-neutral-950 text-white">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="h-full p-7"
        >
          {steps[active]?.visual}
        </motion.div>
      </div>
    </div>
  );
}
