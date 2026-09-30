import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { AppIcon, WindowDots } from "./Icons";
import {
  CursorGrid,
  LinearGrid,
  FirecrawlGrid,
  ElevenGrid,
} from "./FeatureGrids";

type Study = "cursor" | "linear" | "firecrawl" | "elevenlabs";
const studies: Study[] = ["cursor", "linear", "firecrawl", "elevenlabs"];
const sources = {
  cursor: "https://cursor.com/",
  linear: "https://linear.app/",
  firecrawl: "https://www.firecrawl.dev/",
  elevenlabs: "https://elevenlabs.io/",
};
const fromQuery = new URLSearchParams(location.search).get("study") as Study;
const initialStudy = studies.includes(fromQuery) ? fromQuery : "cursor";
const tasks = [
  {
    title: "Build release notes",
    file: "release-notes.md",
    message: "Turn the merged changes into a release note people can scan.",
    result: "The small things, shipped.",
    text: "This release makes the everyday work a little lighter. Find a project faster, leave a more useful comment, and keep your place when you switch views.",
    changes: [
      "A quicker project switcher",
      "Comments that keep their context",
      "Your workspace, right where you left it",
    ],
  },
  {
    title: "Review empty states",
    file: "empty-states.tsx",
    message: "Make the empty state explain what happens next.",
    result: "A place for your next idea.",
    text: "Your collection is empty. Add a first note, or bring one in from a file. Nothing is published until you choose to share it.",
    changes: ["Create a note", "Import a document", "Invite a collaborator"],
  },
  {
    title: "Document shortcuts",
    file: "keyboard-guide.md",
    message: "Write a short guide for moving around without a mouse.",
    result: "Keep your hands on the keys.",
    text: "Search, switch, and create without leaving the keyboard. Every shortcut has a visible alternative in the menu.",
    changes: [
      "⌘ K — open the command menu",
      "⌘ N — create a note",
      "Escape — return to your work",
    ],
  },
];

function StudyDock({ study }: { study: Study }) {
  const [open, setOpen] = useState(false);
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current)
      document.getElementById(open ? "study" : "study-toggle")?.focus();
  }, [open]);
  if (!open)
    return (
      <>
        <a
          href="#features"
          className="fixed bottom-3 left-3 z-50 rounded-lg border border-[#ccc] bg-[#f8f8f4] px-3 py-2 text-[11px] text-[#555] shadow-sm"
        >
          UI feature grids ↓
        </a>
        <button
          id="study-toggle"
          aria-label="Open study selector"
          aria-expanded={false}
          onClick={() => {
            interacted.current = true;
            setOpen(true);
          }}
          className="fixed bottom-3 right-3 z-50 rounded-lg border border-[#ccc] bg-[#f8f8f4] px-3 py-2 text-[11px] text-[#555] shadow-sm"
        >
          Studies ↗
        </button>
      </>
    );
  return (
    <aside className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-[590px] -translate-x-1/2 items-center gap-2 rounded-xl border border-[#d8d8d3] bg-[#f8f8f4]/95 p-2 text-[12px] text-[#292923] shadow-[0_6px_30px_#0003] backdrop-blur-md">
      <button
        aria-label="Close study selector"
        onClick={() => setOpen(false)}
        className="px-2 py-2"
      >
        ×
      </button>
      <label htmlFor="study" className="shrink-0 pl-2 text-[#62625b]">
        UI study
      </label>
      <select
        id="study"
        value={study}
        onChange={(e) =>
          location.assign(
            `?study=${e.target.value}${location.hash === "#features" ? "#features" : ""}`,
          )
        }
        className="min-w-0 flex-1 rounded-md border border-[#d9d9d2] bg-white p-2 capitalize"
      >
        {studies.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <a
        className="shrink-0 px-2 underline underline-offset-4"
        href={sources[study]}
        target="_blank"
        rel="noreferrer"
      >
        Reference ↗
      </a>
      <a
        href="./README.md"
        className="hidden shrink-0 px-2 underline underline-offset-4 sm:block"
      >
        Evidence
      </a>
    </aside>
  );
}

function CursorStudy() {
  const [task, setTask] = useState(0);
  const current = tasks[task];
  const [accepted, setAccepted] = useState(false);
  return (
    <main className="min-h-screen bg-[#14140c] pb-28 text-[#eeeee9]">
      {/* CURSOR: quiet proposition, then an inset, dense three-pane product stage. */}
      <header className="flex h-[52px] items-center justify-between px-5 text-[14px]">
        <a href="#" className="text-[19px] font-bold tracking-[-.7px]">
          ◈ FIELDNOTE
        </a>
        <div className="hidden gap-8 md:flex">
          <a href="#workspace">Workspace</a>
          <a href="#method">How it works</a>
          <a href="#evidence">Study notes</a>
        </div>
        <a
          href="#workspace"
          className="rounded-full bg-[#eeeee9] px-4 py-1.5 text-[#17170f]"
        >
          Open demo
        </a>
      </header>
      <section className="px-5 pb-[55px] pt-[112px] max-md:pt-[72px]">
        <h1 className="max-w-[658px] text-[26px] font-normal leading-[32.5px] tracking-[-.325px]">
          A writing workspace for turning
          <br className="hidden sm:block" /> unfinished ideas into useful
          documents.
        </h1>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <a
            href="#workspace"
            className="rounded-full bg-[#eeeee9] px-6 py-3 text-[16px] text-[#181811]"
          >
            Try the workspace ↓
          </a>
          <a
            href="#method"
            className="rounded-full bg-[#27271f] px-6 py-3 text-[16px]"
          >
            See the workflow →
          </a>
        </div>
      </section>
      <section
        id="workspace"
        aria-label="Interactive document workspace"
        className="mx-5 overflow-hidden rounded-[4px] bg-[radial-gradient(ellipse_at_12%_100%,#777b69,transparent_65%),linear-gradient(145deg,#d0cec1,#b3b2a4_45%,#848779)] px-[80px] pb-[70px] pt-[50px] max-lg:px-8 max-sm:mx-3 max-sm:px-3 max-sm:pb-6 max-sm:pt-6"
      >
        <div className="overflow-hidden rounded-t-xl border border-[#11130d] bg-[#171810] shadow-[0_30px_80px_#25282050]">
          <div className="relative flex h-7 items-center justify-center border-b border-[#313228] text-[12px] text-[#92958b]">
            <span className="absolute left-3 tracking-[4px] text-[#3f4136]">
              <WindowDots />
            </span>
            Fieldnote desktop · sample data
          </div>
          <div className="grid min-h-[500px] grid-cols-[20%_32%_48%] max-lg:grid-cols-[32%_68%] max-sm:grid-cols-1">
            <aside className="border-r border-[#303229] p-3 text-[12px] max-lg:hidden">
              <p className="mb-3 text-[10px] text-[#95988a]">
                READY FOR REVIEW {tasks.length}
              </p>
              {tasks.map((t, i) => (
                <button
                  key={t.title}
                  onClick={() => {
                    setTask(i);
                    setAccepted(false);
                  }}
                  aria-pressed={task === i}
                  className={`mb-1 w-full rounded p-2 text-left transition-colors hover:bg-[#292c21] ${task === i ? "bg-[#26291f]" : "text-[#92958b]"}`}
                >
                  <span className="block">
                    <AppIcon name={task === i ? "target" : "pending"} />{" "}
                    {t.title}
                  </span>
                  <span className="mt-1 block truncate pl-5 text-[11px] text-[#777b6c]">
                    {i === 0
                      ? "Draft ready · 3 changes"
                      : "Waiting for your review"}
                  </span>
                </button>
              ))}
              <p className="mt-10 border-t border-[#303229] pt-3 text-[#777b6c]">
                Your workspace
                <br />
                <span className="mt-2 block text-[#b3b6a8]">
                  <AppIcon name="plus" /> New document
                </span>
              </p>
            </aside>
            <div className="flex flex-col border-r border-[#303229] p-3 text-[12px] leading-[18px] max-sm:border-b">
              <label className="mb-2 lg:hidden">
                Document
                <select
                  aria-label="Choose document"
                  value={task}
                  onChange={(e) => {
                    setTask(+e.target.value);
                    setAccepted(false);
                  }}
                  className="mt-1 w-full rounded border border-[#44473a] bg-[#24271d] p-2"
                >
                  {tasks.map((t, i) => (
                    <option key={t.title} value={i}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mb-2">{current.title}</p>
              <div className="rounded-lg border border-[#36392e] bg-[#202219] p-2">
                {current.message}
              </div>
              <div className="my-4 space-y-2 text-[#878c7c]">
                <p>Read project brief</p>
                <p>Read voice-guidelines.md</p>
                <p>Reviewed 3 source documents</p>
              </div>
              <p>
                I've put the useful details first and kept the language direct.
              </p>
              <div className="mt-3 rounded-md border border-[#393d30] bg-[#202419] px-3 py-2">
                <AppIcon name="file" /> {current.file}{" "}
                <span className="text-[#7aab84]">+24</span>
              </div>
              <div className="mt-2 rounded-md border border-[#393d30] bg-[#202419] px-3 py-2">
                <AppIcon name="file" /> outline.md{" "}
                <span className="text-[#7aab84]">+8</span>
              </div>
              <div className="mt-auto pt-8">
                <button
                  onClick={() => setAccepted(!accepted)}
                  className="w-full rounded-md border border-[#565c45] bg-[#323928] px-3 py-2 hover:bg-[#414c32]"
                >
                  {accepted ? "Undo approval" : "Approve draft"}
                </button>
                <p
                  aria-live="polite"
                  className="mt-2 text-[11px] text-[#a3ad92]"
                >
                  {accepted
                    ? "Draft approved. Ready to export."
                    : "Local demo — nothing is uploaded."}
                </p>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex h-8 items-center gap-4 border-b border-[#303229] bg-[#1e2118] px-4 text-[11px] text-[#a0a594]">
                <AppIcon name="back" />
                <AppIcon name="arrow" />
                <AppIcon name="reload" />{" "}
                <span className="truncate">
                  fieldnote.local / {current.file}
                </span>
              </div>
              <article className="p-6 pt-9 text-[#a5ae92] max-sm:p-5">
                <p className="mb-8 text-[11px] uppercase tracking-[.15em]">
                  Editorial / Working draft
                </p>
                <h2 className="max-w-[320px] text-[30px] leading-[1.1] tracking-[-1px] text-[#e0e5d5]">
                  {current.result}
                </h2>
                <p className="mt-6 max-w-[360px] text-[15px] leading-[24px]">
                  {current.text}
                </p>
                <div className="mt-6 border-l border-[#667553] pl-4 text-[13px] leading-7">
                  {current.changes.map((c) => (
                    <p key={c}>{c}</p>
                  ))}
                </div>
                <p className="mt-8 text-[11px] text-[#717d62]">
                  {accepted ? "APPROVED" : "DRAFT"} · Original demonstration
                  content
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section
        id="method"
        className="mx-5 mt-24 grid grid-cols-[1fr_2fr] items-center gap-14 border-t border-[#33352a] py-16 max-md:grid-cols-1"
      >
        <h2 className="max-w-[380px] text-[24px] leading-[30px]">
          Keep the conversation
          <br />
          <span className="text-[#909487]">beside the work it changes.</span>
        </h2>
        <div className="border-y border-[#3c4032] py-8 text-[17px] text-[#acb39b]">
          Choose a document → inspect the draft → approve the change.
          <p className="mt-3 text-[13px] text-[#757e67]">
            The three panes form one continuous workspace. They are not three
            feature cards.
          </p>
        </div>
      </section>
      <CursorGrid />
      <Evidence id="evidence" dark>
        Borrowed structure: quiet 26px proposition, image-ground stage, 20/32/48
        product panes. Original gradient ground, type substitute, product, and
        copy. No proprietary source code.
      </Evidence>
    </main>
  );
}

const issues = [
  "Preserve the current view on refresh",
  "Make search results easier to scan",
  "Restore keyboard focus after closing a dialog",
  "Keep draft comments when switching projects",
];
const issueDetails = [
  {
    summary:
      "People should be able to leave the workspace and return without losing their place.",
    detail:
      "Preserve the project, active filter, and selected item. The URL should describe enough state to share the same view with a teammate.",
    checks: [
      "Preserve selected project",
      "Keep applied filters",
      "Restore scroll position",
    ],
  },
  {
    summary: "A result should explain why it matched, before someone opens it.",
    detail:
      "Show the matching phrase with a short excerpt. Separate document titles from metadata so the important information is easier to scan.",
    checks: [
      "Highlight matching phrase",
      "Add a useful excerpt",
      "Test long document titles",
    ],
  },
  {
    summary:
      "Closing a dialog should return focus to the control that opened it.",
    detail:
      "Keep a reference to the trigger and restore focus after closing. When that trigger is gone, move focus to the next meaningful control.",
    checks: [
      "Restore trigger focus",
      "Handle removed triggers",
      "Test keyboard-only navigation",
    ],
  },
  {
    summary: "An unfinished comment should survive a change of context.",
    detail:
      "Save draft text locally per project. Make its status visible and clear it only after a successful submission or an explicit discard.",
    checks: [
      "Store draft per project",
      "Show saved draft status",
      "Confirm before discarding",
    ],
  },
];
function LinearStudy() {
  const [issue, setIssue] = useState(0);
  const [view, setView] = useState<"document" | "activity">("document");
  const [status, setStatus] = useState("In progress");
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090a] pb-28 text-[#f4f4f5]">
      {/* LINEAR: monumental proposition followed by one uninterrupted product surface. */}
      <header className="mx-8 flex h-[73px] items-center justify-between border-b border-[#222326] px-2 text-[13px] max-sm:mx-5">
        <a href="#" className="text-[22px] tracking-[-.5px]">
          ◒ Tandem
        </a>
        <div className="hidden items-center gap-7 text-[#8b8c92] md:flex">
          <a href="#product">Product</a>
          <a href="#intake">Workflow</a>
          <a href="#notes">Study notes</a>
        </div>
        <a
          href="#product"
          className="rounded-full bg-[#eeeeef] px-4 py-2 text-[#101114]"
        >
          Open sample
        </a>
      </header>
      <section className="px-10 pb-[69px] pt-[199px] max-sm:px-5 max-sm:pt-24">
        <h1 className="max-w-[1120px] text-[64px] font-medium leading-[64px] tracking-[-2.8px] max-md:text-[48px] max-md:leading-[50px] max-sm:text-[40px] max-sm:leading-[42px]">
          The shared workspace for
          <br className="hidden md:block" /> deciding what gets built next
        </h1>
        <div className="mt-8 flex items-end justify-between gap-8">
          <p className="text-[15px] leading-[25px] text-[#909198]">
            A clear path from the first request to the final review.
            <br />
            Built around the decisions behind the work.
          </p>
          <a
            href="#intake"
            className="hidden whitespace-nowrap text-[14px] text-[#a6a7ad] sm:block"
          >
            Explore intake →
          </a>
        </div>
      </section>
      <section
        id="product"
        aria-label="Interactive planning workspace"
        className="relative ml-8 rounded-tl-xl border border-[#303136] bg-[#111214] max-sm:ml-3"
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[18%] bg-gradient-to-l from-[#08090a] to-transparent max-sm:hidden" />
        <div className="grid min-h-[570px] grid-cols-[238px_1fr] max-md:grid-cols-[170px_1fr] max-sm:grid-cols-1">
          <aside className="border-r border-[#292a2d] bg-[#151618] px-5 py-5 text-[13px] text-[#acadb3] max-sm:hidden">
            <p className="mb-6 font-bold text-[#dddde0]">
              Tandem <AppIcon name="chevron" />
            </p>
            <div className="space-y-4">
              <p>
                <AppIcon name="activity" /> Pulse
              </p>
              <p>
                <AppIcon name="inbox" /> Inbox{" "}
                <span className="float-right text-[#62646c]">3</span>
              </p>
              <p>
                <AppIcon name="target" /> My work
              </p>
              <p>
                <AppIcon name="checked" /> Reviews
              </p>
            </div>
            <p className="mb-3 mt-10 text-[11px] text-[#666870]">Workspace</p>
            <p className="mb-4">
              <AppIcon name="layers" /> Initiatives
            </p>
            <p>
              <AppIcon name="grid" /> Projects
            </p>
            <p className="mb-3 mt-10 text-[11px] text-[#666870]">Your teams</p>
            <p>
              <AppIcon name="person" /> Experience
            </p>
            <div className="mt-4 space-y-3 pl-6 text-[12px] text-[#777983]">
              <p>Issues</p>
              <p>Current cycle</p>
              <p>Backlog</p>
            </div>
          </aside>
          <div className="min-w-0">
            <div className="flex h-[52px] items-center gap-3 border-b border-[#292a2d] px-6 text-[12px]">
              <span className="text-[#d6c752]">
                <AppIcon name="pending" />
              </span>
              <span className="text-[#84858d]">EXP-{214 + issue}</span>
              <span className="truncate">{issues[issue]}</span>
              <span className="ml-auto pr-10 text-[#64666e]">
                {issue + 1} / 4
              </span>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_210px] max-lg:grid-cols-1">
              <div className="px-[72px] py-14 max-md:px-7 max-sm:px-5">
                <div className="mb-7 flex gap-5 border-b border-[#28292d] text-[12px] text-[#85868f]">
                  {(["document", "activity"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      className={`pb-3 capitalize ${view === v ? "border-b border-[#cdced4] text-[#dedee2]" : ""}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <h2 className="text-[22px] font-medium tracking-[-.5px]">
                  {issues[issue]}
                </h2>
                {view === "document" ? (
                  <div className="mt-4 text-[14px] leading-[23px] text-[#a4a5ae]">
                    <p>{issueDetails[issue].summary}</p>
                    <p className="mt-5">{issueDetails[issue].detail}</p>
                    <div className="mt-7 rounded-lg border border-[#303139] bg-[#1a1b20] p-4">
                      <p className="text-[12px] text-[#e0e0e5]">
                        Acceptance criteria
                      </p>
                      {issueDetails[issue].checks.map((check, i) => (
                        <p key={check} className={i === 0 ? "mt-3" : ""}>
                          <AppIcon name={i < 2 ? "checked" : "unchecked"} />{" "}
                          {check}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-5 border-l border-[#363840] pl-5 text-[13px] text-[#a4a5ae]">
                    <p>
                      <span className="text-[#dddde3]">Maya</span> added the
                      acceptance criteria.
                      <span className="mt-1 block text-[11px] text-[#676974]">
                        Today, 09:42
                      </span>
                    </p>
                    <p>
                      <span className="text-[#dddde3]">You</span> opened this
                      sample issue.
                      <span className="mt-1 block text-[11px] text-[#676974]">
                        This session
                      </span>
                    </p>
                  </div>
                )}
                <label className="mt-8 block text-[11px] text-[#777983]">
                  Open another issue
                  <select
                    aria-label="Select issue"
                    className="mt-2 w-full rounded border border-[#33353d] bg-[#18191d] p-2 text-[12px] text-[#bbbcc5]"
                    value={issue}
                    onChange={(e) => {
                      setIssue(+e.target.value);
                      setStatus("In progress");
                    }}
                  >
                    {issues.map((x, i) => (
                      <option key={x} value={i}>
                        {x}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-5 block text-[12px] text-[#aaa] lg:hidden">
                  Status
                  <select
                    aria-label="Issue status mobile"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="ml-3 rounded border border-[#444] bg-[#18191d] p-2"
                  >
                    <option>In progress</option>
                    <option>In review</option>
                    <option>Done</option>
                  </select>
                </label>
              </div>
              <aside className="relative z-20 bg-[#111214] pt-16 text-[12px] text-[#81838d] max-lg:hidden">
                <p className="mb-4">Properties</p>
                <label className="block">
                  Status
                  <select
                    aria-label="Issue status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-2 block rounded border border-[#33343d] bg-[#1a1b20] p-2 text-[#babbc4]"
                  >
                    <option>In progress</option>
                    <option>In review</option>
                    <option>Done</option>
                  </select>
                </label>
                <p className="mt-5">
                  <AppIcon name="person" /> Maya Chen
                </p>
                <p className="mt-5">
                  <AppIcon name="priority" /> Medium
                </p>
                <p className="mt-5">
                  <AppIcon name="layers" /> Experience
                </p>
                <p className="mt-10 text-[#5e606b]" aria-live="polite">
                  {status}
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>
      <section id="intake" className="mx-10 pb-20 pt-32 max-sm:mx-5">
        <p className="mb-6 text-[13px] text-[#8a8c96]">01 / Intake</p>
        <div className="grid grid-cols-2 gap-20 max-md:grid-cols-1 max-md:gap-6">
          <h2 className="text-[48px] leading-[50px] tracking-[-1.8px] max-sm:text-[38px]">
            One place for
            <br />
            the work ahead.
          </h2>
          <p className="max-w-[500px] text-[26px] leading-[34px] tracking-[-.5px] text-[#92939d]">
            A request becomes useful when the context travels with it. Keep the
            source, the decision, and the owner together.
          </p>
        </div>
        <div className="relative mt-14 min-h-[560px] overflow-hidden max-sm:min-h-[610px]">
          <div
            aria-hidden="true"
            style={{
              maskImage:
                "linear-gradient(to bottom, #000 0%, #000 40%, transparent 90%), linear-gradient(to right, #000 0%, #000 68%, transparent 96%)",
              maskComposite: "intersect",
            }}
            className="absolute inset-y-8 left-[340px] w-[1050px] -translate-x-[120px] rounded-xl border border-[#30323c] bg-[#111217] p-5 max-sm:left-[240px] max-sm:opacity-40"
          >
            <div className="mb-5 flex justify-between text-[12px] text-[#8d909c]">
              <span>Experience / Requests</span>
              <span>Filter　Display</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["New requests", "Under review", "Planned"].map((column, c) => (
                <div key={column}>
                  <p className="mb-4 text-[12px] text-[#999dab]">
                    <AppIcon name="pending" /> {column}　
                    <span className="text-[#555b6a]">{4 - c}</span>
                  </p>
                  {issues.map((title, i) => (
                    <div
                      key={title}
                      className="mb-3 rounded-md border border-[#282c36] bg-[#171a21] p-4"
                    >
                      <p className="mb-3 text-[10px] text-[#5f6678]">
                        EXP-{218 + i + c * 4}　···
                      </p>
                      <p className="text-[12px] leading-5 text-[#b3b7c2]">
                        {title}
                      </p>
                      <p className="mt-5 text-[10px] text-[#6d7587]">
                        <AppIcon name="layers" /> Experience　
                        <AppIcon name="person" />
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-[75px] w-[470px] rounded-xl border border-[#3b3e49] bg-[#191b21] shadow-[0_30px_80px_#0009] max-sm:mt-8 max-sm:w-full">
            <div className="border-b border-[#30333e] px-5 py-4 text-[13px] text-[#c4c6d0]">
              # product-feedback{" "}
              <span className="float-right text-[#656b7a]">
                <AppIcon name="search" />
              </span>
            </div>
            <div className="p-6">
              <p className="text-[12px] text-[#d1d3dd]">
                Maya Chen{" "}
                <span className="ml-2 text-[10px] text-[#757b8a]">09:42</span>
              </p>
              <p className="mt-3 text-[14px] leading-6 text-[#a3a8b8]">
                A customer shared this in today's review. When they return to a
                project, they have to find their place all over again.
              </p>
              <p className="mt-4 border-l-2 border-[#686e89] pl-4 text-[13px] leading-6 text-[#838b9f]">
                “I want to come back to the view I was working in, not start
                from the top.”
              </p>
              <div className="mt-6 rounded-lg border border-[#3b4050] bg-[#202430] p-4">
                <p className="text-[10px] text-[#858da1]">
                  LINKED REQUEST · EXP-214
                </p>
                <p className="mt-2 text-[14px] text-[#c8cddd]">
                  Preserve the current view on refresh
                </p>
                <p className="mt-3 text-[11px] text-[#929aaf]">
                  <AppIcon name="pending" /> In progress　
                  <AppIcon name="person" /> Maya Chen
                </p>
              </div>
              <button
                onClick={() => {
                  setIssue(0);
                  setStatus("In progress");
                  document.getElementById("product")?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  });
                }}
                className="mt-5 rounded border border-[#51576a] bg-[#2c3241] px-4 py-2 text-[12px] text-[#e0e4ee] hover:bg-[#394257]"
              >
                Open linked request <AppIcon name="external" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-hidden border-y border-[#2b2d35]">
          <div className="flex justify-between bg-[#14151a] px-6 py-4 text-[13px]">
            <span>Incoming requests</span>
            <span className="text-[#747783]">4 to review</span>
          </div>
          {issues.map((x, i) => (
            <button
              key={x}
              onClick={() => {
                setIssue(i);
                setStatus("In progress");
                document.getElementById("product")?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                });
              }}
              className="flex w-full items-center gap-5 border-t border-[#252730] px-6 py-5 text-left text-[14px] hover:bg-[#15171c]"
            >
              <span className="text-[#606574]">0{i + 1}</span>
              <span className="min-w-0 flex-1">{x}</span>
              <span className="hidden text-[12px] text-[#686b78] sm:block">
                Experience
              </span>
              <span className="text-[#777d90]">
                <AppIcon name="external" />
              </span>
            </button>
          ))}
        </div>
      </section>
      <LinearGrid />
      <Evidence id="notes" dark>
        Borrowed structure: 64px left-aligned proposition, a full-width
        continuous workspace, edge fade, then a split 48px/26px chapter.
        Original interface and sample issues; fade never covers required
        controls.
      </Evidence>
    </main>
  );
}

function FirecrawlStudy() {
  const [url, setUrl] = useState("https://example.com/field-guide");
  const [format, setFormat] = useState("Markdown");
  const [result, setResult] = useState(false);
  const [error, setError] = useState("");
  function run(e: React.FormEvent) {
    e.preventDefault();
    try {
      const parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
      setError("");
      setResult(true);
    } catch {
      setResult(false);
      setError("Enter a complete http:// or https:// address.");
    }
  }
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] pb-28 text-[#262626]">
      {/* FIRECRAWL: an instrument grid funnels attention into a real input/output loop. */}
      <div className="mx-auto max-w-[1112px] border-x border-[#e9e9e9]">
        <p className="mx-3 my-3 rounded-xl bg-[#ff6400] px-4 py-3 text-center text-[13px] text-[#321400]">
          Local fixture explorer — every result is sample data, not a live crawl
          →
        </p>
        <header className="flex h-[101px] items-center justify-between border-y border-[#e9e9e9] px-[60px] max-sm:h-20 max-sm:px-5">
          <a href="#" className="text-[21px] font-bold tracking-[-.7px]">
            <span className="text-[#ff6500]">✳</span> Pagewire
          </a>
          <div className="hidden gap-7 text-[14px] md:flex">
            <a href="#operation">Playground</a>
            <a href="#output">Output</a>
            <a href="#notes">Study notes</a>
          </div>
          <a
            href="#operation"
            className="rounded-md bg-[#f0f0f0] px-4 py-2 text-[13px]"
          >
            Try a sample
          </a>
        </header>
        <section className="relative bg-[linear-gradient(#e9e9e9_1px,transparent_1px),linear-gradient(90deg,#e9e9e9_1px,transparent_1px)] bg-[size:101px_101px] pt-[100px] max-sm:pt-14">
          <div className="relative mx-auto max-w-[708px] bg-[#fafafa] px-4 pb-8 pt-[53px] text-center max-sm:pt-8">
            <span
              className="absolute -left-2 top-0 text-3xl text-[#ff6400]"
              aria-hidden="true"
            >
              ✦
            </span>
            <span
              className="absolute -right-2 top-0 text-3xl text-[#ff6400]"
              aria-hidden="true"
            >
              ✦
            </span>
            <p className="mx-auto mb-[18px] w-fit rounded-full border border-[#eeeeed] bg-[#f6f6f5] px-3 py-1 text-[12px]">
              One source. Structured output.　
              <span className="text-[#ff6400]">↗</span>
            </p>
            <h1 className="text-[60px] font-medium leading-[64px] tracking-[-2.4px] max-md:text-[50px] max-sm:text-[38px] max-sm:leading-[42px]">
              Give your next idea
              <br />
              <span className="text-[#ff6400]">a cleaner starting point</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[460px] text-[16px] leading-[24px]">
              Turn a messy page into a focused document.
              <br />
              Inspect the source, then choose the shape of the output.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="#operation"
                className="rounded-xl bg-[#ff6400] px-4 py-2.5 text-[14px] text-[#321400] shadow-[0_3px_0_#e85a00]"
              >
                Explore the fixture
              </a>
              <a
                href="#output"
                className="rounded-xl bg-[#eee] px-4 py-2.5 text-[14px]"
              >
                View output ↓
              </a>
            </div>
          </div>
          <div
            id="operation"
            className="relative mx-auto max-w-[556px] rounded-t-[24px] border border-[#e8e8e8] bg-white p-3 shadow-[0_0_0_8px_#f5f5f5] max-sm:mx-5"
          >
            <form onSubmit={run}>
              <label htmlFor="page-url" className="sr-only">
                Page URL
              </label>
              <div className="flex items-center gap-3 border-b border-[#efefef] p-2 pb-4">
                <span className="text-[#777]">
                  <AppIcon name="globe" />
                </span>
                <input
                  id="page-url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setResult(false);
                  }}
                  className="min-w-0 flex-1 bg-transparent text-[14px]"
                  aria-invalid={!!error}
                  aria-describedby="url-help"
                />
                <button
                  aria-label="Run sample extraction"
                  className="rounded-lg bg-[#ff6500] px-4 py-2 text-[#321400] hover:bg-[#e45a00]"
                >
                  <AppIcon name="arrow" />
                </button>
              </div>
              <div className="flex items-center gap-1 pt-3">
                {["Markdown", "JSON", "Text"].map((f) => (
                  <button
                    type="button"
                    key={f}
                    aria-pressed={format === f}
                    onClick={() => setFormat(f)}
                    className={`rounded-md px-3 py-2 text-[12px] ${format === f ? "bg-[#f0f0ef] text-[#272727]" : "text-[#707070] hover:text-[#444]"}`}
                  >
                    {f}
                  </button>
                ))}
                <span className="ml-auto pr-2 text-[10px] uppercase tracking-wide text-[#707070]">
                  Fixture
                </span>
              </div>
              <p
                id="url-help"
                role={error ? "alert" : undefined}
                className={`px-2 pb-2 pt-3 text-[11px] ${error ? "text-[#b93900]" : "text-[#707070]"}`}
              >
                {error ||
                  "Any valid URL loads the same local sample. No network request."}
              </p>
            </form>
          </div>
        </section>
        <section id="output" className="border-t border-[#e9e9e9] bg-white">
          <div className="flex items-center justify-between border-b border-[#ececec] px-6 py-4 text-[12px]">
            <span>
              <span
                className={`mr-2 ${result ? "text-[#458849]" : "text-[#999]"}`}
              >
                ●
              </span>
              {result ? "Fixture ready" : "Output preview"}
            </span>
            <span className="text-[#707070]">{format}　/　sample data</span>
          </div>
          <div className="grid grid-cols-2 max-sm:grid-cols-1">
            <div className="border-r border-[#ececec] p-8 max-sm:border-b">
              <p className="mb-5 text-[11px] uppercase tracking-[.12em] text-[#707070]">
                Source document
              </p>
              <h2 className="text-[25px] tracking-[-.6px]">
                A field guide to quiet work
              </h2>
              <p className="mt-4 max-w-[400px] text-[14px] leading-6 text-[#777]">
                A practical note on making room for focused work. Start with one
                task, silence the nonessential, and write down where you
                stopped.
              </p>
              <p className="mt-5 text-[12px] text-[#a1a1a1]">
                By the Pagewire team · 4 minute read
              </p>
            </div>
            <div className="min-w-0 bg-[#fcfcfc] p-8">
              <p className="mb-5 text-[11px] uppercase tracking-[.12em] text-[#707070]">
                {result ? "Extracted fixture" : "Expected structure"}
              </p>
              <pre
                aria-live="polite"
                className="whitespace-pre-wrap break-words text-[12px] leading-[23px] text-[#616161]"
              >
                {format === "JSON"
                  ? JSON.stringify(
                      {
                        title: "A field guide to quiet work",
                        author: "Pagewire team",
                        sections: [
                          "Choose one task",
                          "Remove distractions",
                          "Leave a trail",
                        ],
                        fixture: true,
                      },
                      null,
                      2,
                    )
                  : format === "Markdown"
                    ? "# A field guide to quiet work\n\n## Choose one task\nMake the next action explicit.\n\n## Remove distractions\nKeep only the tools the task needs.\n\n## Leave a trail\nWrite down where you stopped."
                    : "A field guide to quiet work\n\nChoose one task.\nRemove distractions.\nLeave a trail.\n\n[Original local sample]"}
              </pre>
            </div>
          </div>
        </section>
      </div>
      <FirecrawlGrid />
      <Evidence id="notes">
        Borrowed structure: 1,112px instrument grid, 60/64 centered headline,
        orange action syntax, compact input leading to structured output. The
        source/result panel is an original extension; no live crawl or vendor
        code.
      </Evidence>
    </main>
  );
}

function ElevenLabsStudy() {
  const [product, setProduct] = useState(0);
  const [voice, setVoice] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState("Narration");
  const [apiText, setApiText] = useState("The afternoon moved slowly.");
  const [apiResult, setApiResult] = useState("");
  const voices = ["Moss", "Iris", "Sol", "Ember", "Pearl"];
  const gradients = [
    "radial-gradient(circle at 28% 25%,#fff,#c2d8c4 40%,#6b8c74 75%,#303c39)",
    "radial-gradient(circle at 68% 25%,#f5d6f8,#b5ceee 30%,#ba72d9 62%,#70638f)",
    "radial-gradient(circle at 45% 75%,#ffeab5,#ffd77d 25%,#e37343 58%,#8f453e 83%,#f7ca8d)",
    "radial-gradient(circle at 22% 65%,#b9c7ff,#7c5551 30%,#383832 65%,#b88d6d)",
    "radial-gradient(circle at 40% 25%,#fff,#f9edcc 38%,#c2d3d3 75%,#768783)",
  ];
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfcfc] pb-28 text-[#0b0b0b]">
      {/* ELEVENLABS: editorial split hero opens into a full-width nested product playground. */}
      <p className="flex h-[48px] items-center justify-center gap-3 bg-[#f4f3f1] px-4 text-center text-[13px]">
        <span className="text-[#a78562]">◒</span> A studio for the shape of a
        voice.
        <span className="hidden text-[#777] sm:inline">
          Original visual interaction study.
        </span>
      </p>
      <header className="flex h-[64px] items-center justify-between rounded-t-[24px] border-t border-[#e8e7e5] px-16 text-[14px] max-sm:px-5">
        <a href="#" className="text-[21px] font-bold tracking-[-.8px]">
          Ⅱ Sonora
        </a>
        <div className="hidden gap-7 md:flex">
          <a href="#studio">Products</a>
          <a href="#studio">Studio</a>
          <a href="#notes">Study notes</a>
        </div>
        <a
          href="#studio"
          className="rounded-full bg-black px-5 py-2.5 text-white"
        >
          Try the studio
        </a>
      </header>
      <section className="grid grid-cols-2 items-center gap-12 px-16 pb-[34px] pt-[113px] max-md:grid-cols-1 max-md:gap-7 max-sm:px-5 max-sm:pt-16">
        <div>
          <h1 className="text-[48px] font-light leading-[52px] tracking-[-1.6px] max-sm:text-[42px] max-sm:leading-[46px]">
            Give your words
            <br />a different presence
          </h1>
          <div className="mt-6 flex gap-2">
            <a
              href="#studio"
              className="rounded-full bg-black px-5 py-3 text-[15px] text-white"
            >
              Explore voices
            </a>
            <a
              href="#notes"
              className="rounded-full border border-[#e3e3e3] px-5 py-3 text-[15px] shadow-sm"
            >
              About this study
            </a>
          </div>
        </div>
        <p className="max-w-[552px] self-start pt-[29px] text-[16px] leading-[24px] max-md:pt-0">
          A shared space for narration, conversation, and creative experiments.
          Choose a voice, explore its character, and see how a small change
          shifts the feel of a story.
        </p>
      </section>
      <section
        id="studio"
        className="mx-16 overflow-hidden rounded-[24px] border border-[#e7e6e3] bg-[#f3f2f0] max-sm:mx-3"
      >
        <div className="grid grid-cols-3 gap-1 p-1.5">
          {["Creative", "Conversations", "API"].map((p, i) => (
            <button
              key={p}
              aria-pressed={product === i}
              onClick={() => {
                setProduct(i);
                setPlaying(false);
              }}
              className={`rounded-[16px] py-3 text-[16px] max-sm:text-[13px] ${product === i ? "border border-[#e1e0de] bg-white shadow-sm" : "text-[#585853] hover:bg-[#eae9e6]"}`}
            >
              <span
                className={`mr-2 ${i === 0 ? "text-[#caa777]" : i === 1 ? "text-[#81a69a]" : "text-[#969691]"}`}
              >
                ●
              </span>
              {p}
            </button>
          ))}
        </div>
        {product === 0 ? (
          <>
            <div className="relative flex h-[330px] items-center justify-center gap-[80px] overflow-hidden rounded-t-[24px] border-t border-[#eae8e5] pt-10 max-sm:h-[270px] max-sm:gap-10">
              {voices.map((v, i) => (
                <button
                  key={v}
                  aria-label={
                    voice === i
                      ? `${playing ? "Pause" : "Play"} ${v} visual preview`
                      : `Select ${v} voice`
                  }
                  aria-pressed={voice === i}
                  onClick={() => {
                    if (voice === i) setPlaying(!playing);
                    else {
                      setVoice(i);
                      setPlaying(false);
                    }
                  }}
                  style={{ background: gradients[i] }}
                  className={`relative shrink-0 rounded-full shadow-[inset_0_0_30px_#ffffff30] transition-[width,height,opacity] duration-300 ${voice === i ? "h-[256px] w-[256px] max-sm:h-[210px] max-sm:w-[210px]" : "h-[202px] w-[202px] opacity-80 max-sm:hidden"} ${(i === 0 || i === 4) && voice !== i ? "max-lg:hidden" : ""}`}
                >
                  <span
                    className={`absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_20%,#ffffff25,transparent_65%)] ${playing && voice === i ? "motion-safe:animate-pulse" : ""}`}
                  />
                  {voice === i && (
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[18px] text-black shadow-sm">
                      <AppIcon name={playing ? "pause" : "play"} size={20} />
                    </span>
                  )}
                  <span className="sr-only">{v}</span>
                </button>
              ))}
            </div>
            <div className="px-6 pb-7 text-center">
              <div
                className="mb-5 flex flex-wrap justify-center gap-2"
                aria-label="Voice choices"
              >
                {voices.map((v, i) => (
                  <button
                    key={v}
                    aria-pressed={voice === i}
                    onClick={() => {
                      setVoice(i);
                      setPlaying(false);
                    }}
                    className={`rounded-full border px-3 py-1 text-[12px] ${voice === i ? "border-[#888] bg-white" : "border-transparent text-[#696661]"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <h2 className="text-[22px]">
                {voices[voice]}
                <span className="ml-2 text-[15px] text-[#898782]">
                  /{" "}
                  {
                    ["Grounded", "Expressive", "Warm", "Reflective", "Airy"][
                      voice
                    ]
                  }
                </span>
              </h2>
              <button
                onClick={() => setPlaying(!playing)}
                className="mt-4 rounded-full border border-[#d8d6d1] bg-white px-5 py-2 text-[13px]"
              >
                {playing ? "Pause visual preview" : "Play visual preview"}
              </button>
              <p className="mt-3 text-[11px] text-[#696661]" aria-live="polite">
                {playing
                  ? "Silent visual preview playing."
                  : "Silent visual study — no audio generated."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-1 border-t border-[#e0deda] bg-[#f9f8f6] p-3">
              {[
                "Narration",
                "Dialogue",
                "Stories",
                "Translation",
                "Sound",
                "Music",
              ].map((m) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-4 py-2 text-[13px] ${mode === m ? "bg-[#e9e7e2]" : "text-[#696661] hover:bg-[#efede9]"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p
              aria-live="polite"
              className="border-t border-[#e4e2de] px-8 py-6 text-center text-[14px] text-[#7e7a73]"
            >
              {mode} sample ·{" "}
              {mode === "Dialogue"
                ? "“Do you remember the way?” “I remember the light.”"
                : mode === "Translation"
                  ? "The same thought, carried into another language."
                  : mode === "Sound"
                    ? "A door opens. Footsteps cross a wooden floor."
                    : mode === "Music"
                      ? "A soft piano phrase, with room between the notes."
                      : mode === "Stories"
                        ? "At the end of the street, one window was still lit."
                        : "The afternoon moved slowly through the room."}
            </p>
          </>
        ) : product === 1 ? (
          <div className="grid min-h-[465px] grid-cols-2 gap-12 p-12 max-sm:grid-cols-1 max-sm:p-6">
            <div>
              <p className="mb-6 text-[11px] uppercase tracking-[.1em] text-[#888]">
                Conversation fixture
              </p>
              <h2 className="text-[34px] leading-[38px] tracking-[-1px]">
                A voice on the
                <br />
                other end.
              </h2>
              <p className="mt-5 text-[15px] leading-6 text-[#777]">
                This panel changes the product context. It does not connect to a
                live agent.
              </p>
            </div>
            <div className="space-y-4 text-[14px]">
              <p className="rounded-2xl bg-white p-5">
                Hello. I'm looking for the delivery window for my order.
              </p>
              <p className="ml-8 rounded-2xl bg-[#e5e3df] p-5">
                I can help with that. What is your order number?
              </p>
              <p className="rounded-2xl bg-white p-5">It's SN-2048.</p>
              <p className="px-5 text-[12px] text-[#949089]">
                Sample transcript · no personal information
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-[465px] p-12 max-sm:p-6">
            <p className="mb-7 text-[11px] uppercase tracking-[.1em] text-[#888]">
              API shape / illustrative only
            </p>
            <h2 className="mb-8 text-[32px] tracking-[-1px]">
              A voice, in your workflow.
            </h2>
            <pre className="overflow-x-auto rounded-xl border border-[#dedbd5] bg-[#f9f8f5] p-6 text-[13px] leading-7 text-[#6b675f]">
              {`POST /v1/preview\n\n${JSON.stringify({ voice: voices[voice].toLowerCase(), text: apiText, format: "wav" }, null, 2)}\n\n// Illustrative schema. Not a working endpoint.`}
            </pre>
            <label className="mt-5 block text-[12px] text-[#68645e]">
              Preview text
              <textarea
                aria-label="API preview text"
                className="mt-2 block w-full rounded-lg border border-[#ccc7be] bg-white p-3 text-[14px]"
                value={apiText}
                onChange={(e) => {
                  setApiText(e.target.value);
                  setApiResult("");
                }}
              />
            </label>
            <button
              onClick={() =>
                setApiResult(
                  apiText.trim()
                    ? `Fixture accepted: ${apiText.trim().length} characters, ${voices[voice]} voice. No audio or network request generated.`
                    : "Add some text before running the fixture.",
                )
              }
              className="mt-4 rounded-full bg-black px-5 py-2 text-[13px] text-white"
            >
              Run local fixture
            </button>
            <p aria-live="polite" className="mt-3 text-[12px] text-[#68645e]">
              {apiResult}
            </p>
          </div>
        )}
      </section>
      <ElevenGrid />
      <Evidence id="notes">
        Borrowed structure: 48/52 editorial title, 552px split columns,
        full-width product tabs and cropped media carousel. CSS orbs are
        original; no WebGL, vendor audio, generated speech, or copied assets.
        The nested controls switch real local states.
      </Evidence>
    </main>
  );
}

function Evidence({
  children,
  id,
  dark = false,
}: {
  children: React.ReactNode;
  id: string;
  dark?: boolean;
}) {
  return (
    <footer
      id={id}
      className={`mx-auto max-w-[1100px] px-6 pb-8 pt-16 text-[12px] leading-6 ${dark ? "text-[#73766c]" : "text-[#99958e]"}`}
    >
      <p className="mb-2 uppercase tracking-[.1em]">
        Original reconstruction / measured reference, not vendor source
      </p>
      {children}
      <p className="mt-2">
        Desktop composition observed at 1280 × 720. Responsive behavior here is
        an original adaptation. Arial + monospace only. Local sample data.
      </p>
    </footer>
  );
}
function App() {
  useEffect(() => {
    if (location.hash === "#features")
      document.getElementById("features")?.scrollIntoView();
  }, []);
  return (
    <>
      <div>
        {initialStudy === "cursor" ? (
          <CursorStudy />
        ) : initialStudy === "linear" ? (
          <LinearStudy />
        ) : initialStudy === "firecrawl" ? (
          <FirecrawlStudy />
        ) : (
          <ElevenLabsStudy />
        )}
      </div>
      <StudyDock study={initialStudy} />
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
