import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRightIcon,
  ClockIcon,
  BarChartIcon,
  FileTextIcon,
  CheckIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { mountPaperBackground } from "../webgl/paper-background";
import workdayShader from "./workday.frag?raw";

const cleanupBackground = mountPaperBackground(
  document.getElementById("paper-background")!,
  document.getElementById("background-toggle") as HTMLButtonElement,
  { fragmentShader: workdayShader, speed: 0.65 },
);
if (import.meta.hot) import.meta.hot.dispose(cleanupBackground);

if (new URLSearchParams(location.search).has("inspect")) {
  document.getElementById("layout-inspector")!.hidden = false;
  for (const [id, cls] of [
    ["grid-switch", "show-grid"],
    ["safe-switch", "show-safe"],
  ]) {
    document
      .getElementById(id)!
      .addEventListener("change", (event) =>
        document.body.classList.toggle(
          cls,
          (event.target as HTMLInputElement).checked,
        ),
      );
  }
}

// Named imports; MIT notice retained in public/licenses/radix-icons-LICENSE.txt.
const icons = {
  arrow: ArrowRightIcon,
  clock: ClockIcon,
  chart: BarChartIcon,
  file: FileTextIcon,
  check: CheckIcon,
  play: PlayIcon,
};
document.querySelectorAll<HTMLElement>("[data-icon]").forEach((el) => {
  const Icon = icons[el.dataset.icon as keyof typeof icons];
  if (Icon) {
    el.classList.add("icon");
    el.setAttribute("aria-hidden", "true");
    createRoot(el).render(<Icon width={15} height={15} focusable="false" />);
  }
});

const tabs = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-mode]"),
);
function selectTab(selected: HTMLButtonElement, keyboard = false) {
  document
    .querySelector(".work-stage")!
    .classList.toggle("keyboard-change", keyboard);
  tabs.forEach((tab) => {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")!)!.hidden =
      !active;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next], true);
    tabs[next].focus();
  });
});

const timer = document.getElementById("timer")!;
const toggle = document.getElementById("timer-toggle")!;
const label = document.getElementById("timer-label")!;
let running = false,
  elapsed = 0,
  started = 0;
function seconds() {
  return elapsed + (running ? Math.floor((Date.now() - started) / 1000) : 0);
}
function format(total: number, withSeconds = false) {
  const hours = Math.floor(total / 3600),
    minutes = Math.floor((total % 3600) / 60);
  return `${hours}:${String(minutes).padStart(2, "0")}${withSeconds ? ":" + String(total % 60).padStart(2, "0") : ""}`;
}
function update() {
  const s = seconds();
  timer.textContent = format(6300 + s, true);
  document.getElementById("day-total")!.textContent = format(20700 + s);
  document.getElementById("week-total")!.textContent = format(70200 + s);
}
toggle.addEventListener("click", () => {
  if (running) {
    elapsed = seconds();
    running = false;
  } else {
    started = Date.now();
    running = true;
  }
  toggle.setAttribute("aria-pressed", String(running));
  label.textContent = running ? "Stop timer" : "Start timer";
  update();
});
window.setInterval(() => {
  if (running && !document.hidden) update();
}, 1000);
document
  .getElementById("invoice-preview")!
  .addEventListener("click", (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const created = button.dataset.created === "true";
    button.dataset.created = String(!created);
    button.textContent = created
      ? "Create sample invoice"
      : "Reset sample invoice";
    document
      .querySelector(".invoice-paper")!
      .classList.toggle("created", !created);
    document.getElementById("invoice-state")!.textContent = created
      ? "DRAFT PREVIEW"
      : "DRAFT CREATED";
    document.getElementById("invoice-feedback")!.textContent = created
      ? "Local demonstration. Nothing will be sent."
      : "Sample draft created from 48 hours at $125/hour. Nothing sent.";
  });
