export {};
type Span = {
  number: string;
  title: string;
  kind: string;
  duration: string;
  input: string;
  output: string;
  finding: string;
};
const spans: Record<string, Span> = {
  request: {
    number: "01 / 04",
    title: "receive_request",
    kind: "INPUT",
    duration: "42ms",
    input: '"Can I return an opened headset?"',
    output: "intent: return_eligibility\nproduct: headset\ncondition: opened",
    finding:
      "The question was understood correctly. The failure occurs downstream, when the agent retrieves the return policy.",
  },
  search: {
    number: "02 / 04",
    title: "search_knowledge",
    kind: "RETRIEVAL",
    duration: "816ms",
    input: 'query: "headset return policy"\ncollection: support',
    output: "document: returns-policy\nversion: 2023-11\nstatus: archived",
    finding:
      "Search returned an archived policy. The retrieval filter did not restrict results to active documents.",
  },
  policy: {
    number: "03 / 04",
    title: "get_return_policy",
    kind: "TOOL CALL",
    duration: "324ms",
    input: '{ "product": "headset",\n  "condition": "opened" }',
    output: '"version": "2023-11"\n"returns": "unopened only"',
    finding:
      "The retrieved policy is archived. The active policy allows opened returns within 30 days.",
  },
  answer: {
    number: "04 / 04",
    title: "generate_answer",
    kind: "MODEL OUTPUT",
    duration: "1.66s",
    input: "question + returns-policy/2023-11",
    output: '"Opened items can’t be returned."',
    finding:
      "The response follows the supplied context, but contradicts the active policy. Replaying with current evidence tests this specific source failure.",
  },
};
const el = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const spanButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-span]"),
];
function selectSpan(key: string) {
  const span = spans[key];
  if (!span) return;
  for (const button of spanButtons) {
    const selected = button.dataset.span === key;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
  for (const field of [
    "number",
    "title",
    "kind",
    "duration",
    "input",
    "output",
    "finding",
  ] as const)
    el(`span-${field}`).textContent = span[field];
}
for (const button of spanButtons) {
  button.disabled = false;
  button.addEventListener("click", () => selectSpan(button.dataset.span!));
}
const source = el<HTMLSelectElement>("policy-source");
const replay = el<HTMLButtonElement>("run-replay");
const reset = el<HTMLButtonElement>("reset");
source.disabled = replay.disabled = reset.disabled = false;
function clearReplay(message = "A REPLAY CHANGES THIS SAMPLE ONLY.") {
  el("replay-answer").hidden = true;
  el("replay-empty").hidden = false;
  el("replay-state").textContent = "READY TO RUN";
  delete el("replay-state").dataset.state;
  el("replay-feedback").textContent = message;
  replay.firstChild!.textContent = "Replay run ";
}
source.addEventListener("change", () =>
  clearReplay("SOURCE CHANGED. REPLAY AGAIN TO COMPARE."),
);
replay.addEventListener("click", () => {
  const current = source.value === "current";
  el("replay-empty").hidden = true;
  el("replay-answer").hidden = false;
  el("replay-state").textContent = current
    ? "GROUNDED IN CURRENT POLICY"
    : "FAILURE REPRODUCED";
  el("replay-state").dataset.state = current ? "success" : "failed";
  el("corrected-answer").textContent = current
    ? "Yes. Opened headsets can be returned within 30 days of delivery."
    : "Opened items can’t be returned.";
  el("corrected-source").textContent = current
    ? "returns-policy / 2026-09 · Active"
    : "returns-policy / 2023-11 · Archived";
  el("replay-feedback").textContent = current
    ? "SAMPLE COMPLETE · SOURCE UPDATED · ANSWER CHANGED"
    : "SAMPLE COMPLETE · ARCHIVED SOURCE · SAME FAILURE";
  replay.firstChild!.textContent = "Replay again ";
});
reset.addEventListener("click", () => {
  source.value = "current";
  selectSpan("policy");
  clearReplay("SAMPLE RESET. ORIGINAL RUN PRESERVED.");
});
