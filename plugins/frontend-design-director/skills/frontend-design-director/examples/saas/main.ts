// Original Frontend Design Director study. Every action is local sample state.
export {};
// Marketing crops are illustrations; open the uncropped controls for actual work.
document
  .querySelectorAll<HTMLAnchorElement>('a[href="#demo"]')
  .forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector<HTMLDetailsElement>(".demo-disclosure")!.open =
        true;
    });
  });
if (location.hash === "#demo")
  document.querySelector<HTMLDetailsElement>(".demo-disclosure")!.open = true;
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const $$ = <T extends HTMLElement = HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];
let plan: "original" | "proposed" | "applied" = "original";
let approved = false;
let billing: "annual" | "monthly" = "annual";
const history: { title: string; detail: string }[] = [];
const releaseDate = () =>
  plan === "applied" ? "Monday, October 12" : "Thursday, October 8";
function renderPlan() {
  $(".launch-theater").dataset.state = plan;
  $("#project-state").textContent = approved
    ? "Approved"
    : plan === "proposed"
      ? "Change proposed"
      : plan === "applied"
        ? "Plan updated"
        : "On track";
  const moved = plan !== "original";
  $$('[data-date="build"]').forEach(
    (el) => (el.textContent = moved ? "Oct 6 → 8" : "Oct 6"),
  );
  $$('[data-date="review"]').forEach(
    (el) => (el.textContent = moved ? "Oct 7 → 9" : "Oct 7"),
  );
  $$('[data-date="release"]').forEach(
    (el) => (el.textContent = moved ? "Oct 12" : "Oct 8"),
  );
  $("#schedule-note").textContent =
    plan === "proposed"
      ? "Preview: 2 dependent dates move. Your plan is not changed yet."
      : plan === "applied"
        ? "Revised dates applied to the sample plan. All three owners share the update."
        : "One shared date. Three connected workstreams.";
  $("#simulate").innerHTML =
    plan === "original"
      ? "Simulate a 2-day delay <span>↗</span>"
      : plan === "proposed"
        ? "Apply revised dates <span>→</span>"
        : "Inspect the change log <span>↗</span>";
  $("#reset").hidden = plan === "original" && !approved && history.length === 0;
  $("#simulation-hint").textContent =
    plan === "original"
      ? "Try a real change in the sample plan"
      : plan === "proposed"
        ? "Launch moves Thu 8 → Mon 12"
        : "Updated locally. Nothing sent.";
  $("#change-message").textContent =
    plan === "applied"
      ? "“New dates agreed. We’re all working toward Monday.”"
      : "“We need two more days for the release candidate.”";
  $("#change-count").textContent = String(history.length);
  const log = $("#change-log");
  log.replaceChildren();
  const entries = history.length
    ? [...history].reverse()
    : [
        {
          title: "The plan is up to date.",
          detail: "Simulate a delay to see the decisions behind a date change.",
        },
      ];
  for (const entry of entries) {
    const li = document.createElement("li");
    const dot = document.createElement("span");
    dot.className = "log-dot";
    const div = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = entry.title;
    const p = document.createElement("p");
    p.textContent = entry.detail;
    div.append(strong, p);
    const time = document.createElement("span");
    time.textContent = "Just now";
    li.append(dot, div, time);
    log.append(li);
  }
  renderGate();
}
$("#simulate").addEventListener("click", () => {
  if (plan === "applied") {
    setView("changes");
    $("#changes-tab").focus();
    return;
  }
  approved = false;
  $("#gate-feedback").textContent = "";
  if (plan === "original") {
    plan = "proposed";
    history.push({
      title: "Alex proposed a two-day build delay.",
      detail:
        "Release candidate: Oct 6 → 8. Review: Oct 7 → 9. Launch: Oct 8 → 12, skipping the weekend.",
    });
    $("#demo-feedback").textContent =
      "Delay preview. Launch moves to Monday, October 12. Apply the revised dates to confirm.";
  } else {
    plan = "applied";
    history.push({
      title: "Jamie applied the revised dates.",
      detail:
        "The build, review, and launch now share one updated plan. No real people were notified.",
    });
    $("#demo-feedback").textContent =
      "Revised dates applied to the sample plan. Launch is Monday, October 12.";
  }
  // A changed plan invalidates earlier checks instead of silently retaining approval.
  $<HTMLInputElement>("#check-build").checked = false;
  $<HTMLInputElement>("#check-comms").checked = false;
  renderPlan();
});
$("#reset").addEventListener("click", () => {
  plan = "original";
  approved = false;
  history.length = 0;
  $<HTMLInputElement>("#check-build").checked = false;
  $<HTMLInputElement>("#check-comms").checked = false;
  $("#gate-feedback").textContent = "";
  $("#demo-feedback").textContent =
    "Sample reset to the original October 8 launch.";
  renderPlan();
  setView("schedule");
  $("#simulate").focus();
});
function setView(view: string) {
  $$<HTMLButtonElement>("[data-view]").forEach((tab) => {
    const active = tab.dataset.view === view;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  $("#schedule-panel").hidden = view !== "schedule";
  $("#changes-panel").hidden = view !== "changes";
}
const tabs = $$<HTMLButtonElement>("[data-view]");
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => setView(tab.dataset.view!));
  tab.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft")
      next = (index + 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setView(tabs[next].dataset.view!);
    tabs[next].focus();
  });
});
const sources = {
  brief: {
    icon: "▤",
    file: "orbit-launch-brief.doc",
    kicker: "PRODUCT MARKETING · V04",
    title: "A better first five minutes.",
    paragraph:
      "The new onboarding flow helps a team get from an empty workspace to its first shared project.",
    highlight: "Invite your team before creating a project.",
    comment: "This changes the welcome screen.",
    id: "ORB–142",
    issue: "Move team invites into onboarding",
    avatar: "PK",
    owner: "Priya Kapoor",
  },
  design: {
    icon: "◫",
    file: "onboarding-final.design",
    kicker: "PRODUCT DESIGN · V12",
    title: "A welcome worth sharing.",
    paragraph:
      "The approved flow puts teammates first. Empty states, invitations, and error messages belong to the same experience.",
    highlight: "Keep the invite step optional. Let people explore.",
    comment: "Approved with the optional invite path.",
    id: "ORB–156",
    issue: "Build the optional team-invite step",
    avatar: "AM",
    owner: "Alex Morgan",
  },
  code: {
    icon: "⌘",
    file: "release-candidate-248.md",
    kicker: "ENGINEERING · RC.03",
    title: "Ready for a closer look.",
    paragraph:
      "The release candidate includes team invitations, workspace setup, and the updated first-project experience.",
    highlight: "Regression testing must finish before launch review.",
    comment: "Attach the test results to the release gate.",
    id: "ORB–163",
    issue: "Check the release candidate",
    avatar: "AM",
    owner: "Alex Morgan",
  },
};
type SourceKey = keyof typeof sources;
$$<HTMLButtonElement>("[data-source]").forEach((button) =>
  button.addEventListener("click", () => {
    const value = sources[button.dataset.source as SourceKey];
    const mapping: Record<string, string> = {
      "source-icon": value.icon,
      "source-file": value.file,
      "source-kicker": value.kicker,
      "source-doc-title": value.title,
      "source-paragraph": value.paragraph,
      "source-highlight": value.highlight,
      "source-comment": value.comment,
      "issue-id": value.id,
      "issue-title": value.issue,
      "issue-avatar": value.avatar,
      "issue-owner": value.owner,
    };
    for (const [id, text] of Object.entries(mapping))
      $("#" + id).textContent = text;
    $$("[data-source]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el === button)),
    );
    const art = $(".source-art");
    art.classList.remove("ui-updated");
    requestAnimationFrame(() => art.classList.add("ui-updated"));
  }),
);
const handoffs = {
  design: {
    avatar: "JL",
    person: "Jamie → Priya",
    label: "PRODUCT MARKETING → DESIGN",
    pill: "Ready to design",
    description:
      "The brief calls for a team-first onboarding flow. Invites stay optional so a solo user can still explore.",
    file: "Orbit / Launch brief",
    meta: "Version 04 · Decision attached",
    next: "Design the first five minutes",
  },
  build: {
    avatar: "PK",
    person: "Priya → Alex",
    label: "DESIGN → ENGINEERING",
    pill: "Ready to build",
    description:
      "Invite flow approved. Empty states and error messages are included in v12.",
    file: "Onboarding / Final screens",
    meta: "Version 12 · 8 screens",
    next: "Build the team-invite flow",
  },
  launch: {
    avatar: "AM",
    person: "Alex → Jamie",
    label: "ENGINEERING → GO-TO-MARKET",
    pill: "Ready to review",
    description:
      "The release candidate is attached. Check the build and announcement before the final go/no-go decision.",
    file: "Orbit 2.0 / Release candidate",
    meta: "RC.03 · Regression checklist",
    next: "Review the release gate",
  },
};
$$<HTMLButtonElement>("button[data-team]").forEach((button) =>
  button.addEventListener("click", () => {
    const key = button.dataset.team as keyof typeof handoffs,
      value = handoffs[key];
    $(".handoff-art").dataset.team = key;
    $$("button[data-team]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el === button)),
    );
    for (const [id, text] of Object.entries({
      "handoff-avatar": value.avatar,
      "handoff-person": value.person,
      "handoff-label": value.label,
      "handoff-pill": value.pill,
      "handoff-description": value.description,
      "handoff-file": value.file,
      "handoff-meta": value.meta,
      "handoff-next": value.next + " →",
    }))
      $("#" + id).textContent = text;
    $(".handoff-detail").classList.remove("changing");
    requestAnimationFrame(() => $(".handoff-detail").classList.add("changing"));
  }),
);
function renderGate() {
  const ready =
      $<HTMLInputElement>("#check-build").checked &&
      $<HTMLInputElement>("#check-comms").checked,
    pending = plan === "proposed";
  $("#gate-date").textContent = releaseDate();
  $(".gate-card h3").innerHTML =
    plan === "applied"
      ? "Give Monday<br>the green light."
      : "Give Thursday<br>the green light.";
  $("#gate-state").textContent = approved
    ? "Approved to launch"
    : pending
      ? "Date change pending"
      : ready
        ? "Ready for your decision"
        : "Awaiting your review";
  $("#gate-explanation").textContent = approved
    ? "The sample launch is approved. Nothing has been published."
    : pending
      ? "Apply the proposed date change above before approving this release."
      : ready
        ? "Both reviews are complete. The final call is yours."
        : "Check both reviews to enable the final decision.";
  const button = $<HTMLButtonElement>("#approve");
  button.disabled = !ready || pending || approved;
  button.innerHTML = approved
    ? "Launch approved <span>✓</span>"
    : pending
      ? "Resolve the date change <span>↑</span>"
      : ready
        ? "Approve the sample launch <span>↗</span>"
        : "Complete the reviews <span>↗</span>";
  $("#decision-record").textContent = approved
    ? `Jamie approved ${plan === "applied" ? "October 12" : "October 8"}.`
    : "No approval recorded yet.";
}
["#check-build", "#check-comms"].forEach((selector) =>
  $(selector).addEventListener("change", () => {
    if (approved)
      history.push({
        title: "Jamie reopened the release review.",
        detail: "The previous approval was withdrawn because a review changed.",
      });
    approved = false;
    $("#gate-feedback").textContent = "";
    renderPlan();
  }),
);
$("#approve").addEventListener("click", () => {
  if (
    plan === "proposed" ||
    !$<HTMLInputElement>("#check-build").checked ||
    !$<HTMLInputElement>("#check-comms").checked
  )
    return;
  approved = true;
  history.push({
    title: `Jamie approved the ${plan === "applied" ? "October 12" : "October 8"} launch.`,
    detail:
      "Both reviews checked. Explicit approval recorded in this local example only.",
  });
  $("#gate-feedback").textContent =
    "Approval recorded in the sample. No messages sent; nothing published.";
  renderPlan();
});
function price() {
  const seats = Number($<HTMLInputElement>("#seats").value),
    rate = billing === "annual" ? 12 : 15;
  $("#seat-rate").textContent = "$" + rate;
  $("#seat-count").textContent = String(seats);
  $("#monthly-total").textContent = `$${seats * rate} / month`;
  $("#billing-description").textContent =
    billing === "annual"
      ? `$${(seats * rate * 12).toLocaleString("en-US")} billed yearly`
      : "Billed monthly";
  $$("[data-billing]").forEach((el) =>
    el.setAttribute("aria-pressed", String(el.dataset.billing === billing)),
  );
}
$$<HTMLButtonElement>("[data-billing]").forEach((button) =>
  button.addEventListener("click", () => {
    billing = button.dataset.billing as typeof billing;
    price();
  }),
);
$("#seats").addEventListener("input", price);
renderPlan();
price();

// Native scroll draws the connection, never hides content or changes a user's selection.
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
let scrollFrame = 0;
function drawRoute() {
  scrollFrame = 0;
  const scene = $(".handoff-art");
  if (motionQuery.matches || innerWidth <= 580) {
    scene.style.setProperty("--route-progress", "1");
    return;
  }
  const rect = scene.getBoundingClientRect();
  const progress = Math.max(
    0,
    Math.min(1, (innerHeight * 0.9 - rect.top) / (rect.height * 0.9)),
  );
  scene.style.setProperty("--route-progress", String(progress));
}
addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(drawRoute);
  },
  { passive: true },
);
addEventListener("resize", drawRoute);
motionQuery.addEventListener("change", drawRoute);
drawRoute();
