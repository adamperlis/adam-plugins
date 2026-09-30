// All notes and explanations remain readable without JavaScript.
const notes = [...document.querySelectorAll("[data-evidence]")];
const details = [...document.querySelectorAll("[data-detail]")];
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
function selectEvidence(id, scroll = false) {
  if (!details.some((panel) => panel.dataset.detail === id)) return;
  notes.forEach((note) => {
    note.setAttribute("aria-current", String(note.dataset.evidence === id));
    note.setAttribute("aria-controls", `detail-${note.dataset.evidence}`);
  });
  details.forEach((panel) => {
    panel.hidden = panel.dataset.detail !== id;
    if (!panel.hidden) {
      if (!motionQuery.matches)
        panel.animate(
          [
            { opacity: 0.35, transform: "translateY(6px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      if (scroll) {
        panel.tabIndex = -1;
        panel.focus({ preventScroll: true });
        panel.scrollIntoView({
          behavior: motionQuery.matches ? "instant" : "smooth",
          block: "nearest",
        });
      }
    }
  });
}
if (notes.length && details.length) {
  document.documentElement.classList.add("enhanced");
  const initial = location.hash.replace("#detail-", "");
  selectEvidence(
    details.some((p) => p.dataset.detail === initial) ? initial : "customer",
  );
  notes.forEach((note) =>
    note.addEventListener("click", (event) => {
      event.preventDefault();
      selectEvidence(note.dataset.evidence, true);
    }),
  );
  addEventListener("hashchange", () => {
    if (location.hash.startsWith("#detail-"))
      selectEvidence(location.hash.slice(8));
  });
}
const commitButton = document.querySelector("#commit-button");
if (commitButton) {
  commitButton.hidden = false;
  let committed = false;
  commitButton.addEventListener("click", () => {
    committed = !committed;
    document.querySelector("#record-status").textContent = committed
      ? "Pilot committed"
      : "Proposed pilot";
    document.querySelector(".decision-status").innerHTML = committed
      ? 'Pilot committed <span aria-hidden="true">✓</span>'
      : 'Under review <span aria-hidden="true">◌</span>';
    document.querySelector(".decision-footer p").innerHTML =
      '<span class="dot"></span> ' +
      (committed ? "Committed: " : "Proposed: ") +
      "an optional guided handoff for teams of 10+";
    commitButton.innerHTML = committed
      ? 'Reopen sample decision <span aria-hidden="true">↶</span>'
      : 'Commit sample decision <span aria-hidden="true">↗</span>';
    document.querySelector("#commit-feedback").textContent = committed
      ? "Sample committed. Sam owns the pilot; review after 200 sessions. Stored only for this visit."
      : "Sample reopened for review. No data leaves this page.";
  });
}
