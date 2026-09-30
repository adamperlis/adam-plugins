import React, { useState } from "react";
import "./feature-grids.css";
import { AppIcon, WindowDots } from "./Icons";

// Original UI scenes. Clipping belongs to illustration layers, never controls.
function Cell({
  name,
  title,
  copy,
  children,
}: {
  name: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`fg-cell ${name}`}>
      <header>
        <h3>{title}</h3>
        <p>{copy}</p>
      </header>
      {children}
    </article>
  );
}
function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="fg-chrome">
      <WindowDots />
      {children}
    </div>
  );
}
function Wave({ active = false }: { active?: boolean }) {
  return (
    <div className={`fg-wave ${active ? "active" : ""}`} aria-hidden="true">
      {Array.from({ length: 60 }, (_, i) => (
        <i
          key={i}
          style={{
            height: `${12 + ((i * 17 + i * i * 3) % 58)}px`,
            animationDelay: `${i * 13}ms`,
          }}
        />
      ))}
    </div>
  );
}
function GridHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="fg-heading">
      <div>
        <p className="fg-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p>{copy}</p>
    </div>
  );
}

export function CursorGrid() {
  const [change, setChange] = useState(false);
  const [comment, setComment] = useState(false);
  return (
    <section
      id="features"
      className="feature-grids fg-cursor"
      aria-label="Writing feature grid"
    >
      <GridHeader
        eyebrow="Inside the workspace"
        title="The details behind a finished draft."
        copy="Move from source material to a reviewed document without losing the reasoning along the way."
      />
      <div className="fg-layout">
        <Cell
          name="fg-wide"
          title="A change you can actually inspect."
          copy="Compare the edit with its source. Keep what makes the sentence clearer."
        >
          <div className="fg-art fg-diff-art">
            <div className="fg-window">
              <Chrome>
                release-notes.md{" "}
                <span className="fg-right">Review changes</span>
              </Chrome>
              <div className="fg-filepath">
                Documents / September release / Opening paragraph
              </div>
              <div className="fg-diffline removed">
                <span>12 −</span>We are excited to announce some amazing
                improvements.
              </div>
              <div className={`fg-diffline ${change ? "accepted" : "added"}`}>
                <span>12 +</span>Find a project faster. Keep the context of
                every comment.
              </div>
              <div className="fg-diffline">
                <span>13</span>This release focuses on the work you do every
                day.
              </div>
              <div className="fg-diffline">
                <span>14</span>
              </div>
              <div className="fg-diffline">
                <span>15</span>## A quicker project switcher
              </div>
              <div className="fg-diffline">
                <span>16</span>Recent projects stay one shortcut away.
              </div>
              <div className="fg-diffline">
                <span>17</span>Search by name, owner, or the last thing you
                remember.
              </div>
            </div>
          </div>
          <div className="fg-actions">
            <button onClick={() => setChange(!change)}>
              {change ? "Undo accepted edit" : "Accept this edit"}
            </button>
            <span role="status">
              {change
                ? "Edit accepted in this sample"
                : "1 suggested edit · sample document"}
            </span>
          </div>
        </Cell>
        <Cell
          name="fg-narrow"
          title="The source stays attached."
          copy="Follow a claim back to the note that supports it."
        >
          <div className="fg-art fg-source-art">
            <div className="fg-paper">
              <small>INTERVIEW / 04</small>
              <p>
                “When I switch projects, I spend the first minute finding where
                I was.”
              </p>
              <div className="fg-highlight">
                Keep the current view on return.
              </div>
              <footer>Research notes · product review</footer>
            </div>
            <div className="fg-source-label">
              <AppIcon name="link" /> Linked to release-notes.md, line 18
            </div>
          </div>
        </Cell>
        <Cell
          name="fg-full fg-review-cell"
          title="Feedback, in the right place."
          copy="Review the sentence—not another detached thread."
        >
          <div className="fg-art fg-review-art">
            <div className="fg-review-doc">
              <small>RELEASE NOTES / INTRODUCTION</small>
              <p>
                The everyday work,
                <br />
                <mark>a little lighter.</mark>
              </p>
              <div className="fg-rule" />
              <div className="fg-rule short" />
            </div>
            <div className="fg-comment">
              <b>
                <span className="fg-avatar">AL</span> Alex Lee{" "}
                <small>Reviewer</small>
              </b>
              <p>
                Can we make this more specific? The project switcher is the
                change people will notice first.
              </p>
              <div className="fg-comment-reply">
                {comment
                  ? "Resolved · The opening now names the project switcher."
                  : "Suggested: lead with the concrete change."}
              </div>
            </div>
          </div>
          <div className="fg-actions">
            <button onClick={() => setComment(!comment)}>
              {comment ? "Reopen comment" : "Resolve comment"}
            </button>
            <span role="status">
              {comment ? "Comment resolved" : "1 open comment"}
            </span>
          </div>
        </Cell>
      </div>
      <p className="fg-footnote">
        Original UI illustrations and local sample states. No documents are
        uploaded.
      </p>
    </section>
  );
}

export function LinearGrid() {
  const [routed, setRouted] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [approved, setApproved] = useState(false);
  return (
    <section
      id="features"
      className="feature-grids fg-linear"
      aria-label="Planning feature grid"
    >
      <GridHeader
        eyebrow="From signal to shipped"
        title="Less context lost between steps."
        copy="Capture the request, make the trade-off, and carry the decision through to release."
      />
      <div className="fg-layout">
        <Cell
          name="fg-wide"
          title="Turn the conversation into work."
          copy="The customer’s words travel with the issue, not into a separate inbox."
        >
          <div className="fg-art fg-route-art">
            <div className="fg-message">
              <small># customer-feedback</small>
              <b>
                <span className="fg-avatar">MC</span>Maya Chen
              </b>
              <p>
                On mobile, closing a dialog sends keyboard focus back to the top
                of the page.
              </p>
              <span>Today, 09:42 · Customer interview</span>
            </div>
            <div className={`fg-routed-issue ${routed ? "is-routed" : ""}`}>
              <small>
                {routed ? "EXPERIENCE / READY" : "TRIAGE / NEW REQUEST"}
              </small>
              <h4>Restore focus after closing a dialog</h4>
              <div>
                <span className="fg-tag">Accessibility</span>
                <span className="fg-tag">Mobile</span>
              </div>
              <footer>
                {routed ? (
                  <>
                    <AppIcon name="person" /> Assigned to Maya · Experience
                  </>
                ) : (
                  <>
                    <AppIcon name="pending" /> Unassigned · Needs a team
                  </>
                )}
              </footer>
            </div>
            <div className="fg-route-line" aria-hidden="true" />
          </div>
          <div className="fg-actions">
            <button onClick={() => setRouted(!routed)}>
              {routed ? "Return to triage" : "Route to Experience"}
            </button>
            <span role="status">
              {routed
                ? "Assigned with source attached"
                : "Review before routing · local fixture"}
            </span>
          </div>
        </Cell>
        <Cell
          name="fg-narrow"
          title="Make the trade-off visible."
          copy="Priority means something when the next person can read the reason."
        >
          <div className="fg-art fg-priority-art">
            <div className="fg-priority-menu">
              <small>SET PRIORITY</small>
              {["Urgent", "High", "Medium", "Low"].map((p, i) => (
                <div className={priority === p ? "chosen" : ""} key={p}>
                  <span>
                    <AppIcon name="priority" /> {p}
                  </span>
                  <span>
                    {priority === p ? <AppIcon name="check" /> : i + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="fg-context-note">
              Blocks keyboard navigation.
              <br />
              Keep it ahead of visual polish.
            </div>
          </div>
          <div className="fg-actions">
            <label>
              Priority{" "}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                aria-label="Grid issue priority"
              >
                <option>Urgent</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
          </div>
        </Cell>
        <Cell
          name="fg-narrow"
          title="Plan around the real work."
          copy="See dependencies in the same view as the cycle."
        >
          <div className="fg-art fg-cycle-art">
            <div className="fg-timeline">
              <div className="fg-timeline-axis">
                MON　 TUE　 WED　 THU　 FRI
              </div>
              {[
                "Focus management",
                "Screen reader review",
                "Regression tests",
                "Release candidate",
              ].map((t, i) => (
                <div className="fg-timeline-row" key={t}>
                  <span>{t}</span>
                  <i
                    style={{
                      marginLeft: `${i * 32}px`,
                      width: `${156 - i * 13}px`,
                    }}
                  >
                    {i === 0 ? "Experience" : ""}
                  </i>
                </div>
              ))}
            </div>
          </div>
        </Cell>
        <Cell
          name="fg-wide"
          title="A release is a decision, not a date."
          copy="Keep the last checks beside the change they protect."
        >
          <div className="fg-art fg-release-art">
            <div className="fg-release">
              <Chrome>Mobile / Release candidate</Chrome>
              <h4>Focus stays where you left it.</h4>
              <div className="fg-check-row">
                <span>
                  <AppIcon name="check" /> Keyboard navigation
                </span>
                <small>Reviewed by Maya</small>
              </div>
              <div className="fg-check-row">
                <span>
                  <AppIcon name="check" /> Screen reader labels
                </span>
                <small>Reviewed by Alex</small>
              </div>
              <div className="fg-check-row">
                <span>
                  <AppIcon name={approved ? "check" : "pending"} /> Release
                  approval
                </span>
                <small>
                  {approved ? "Approved in this fixture" : "Waiting for you"}
                </small>
              </div>
            </div>
          </div>
          <div className="fg-actions">
            <button onClick={() => setApproved(!approved)}>
              {approved ? "Revoke sample approval" : "Approve sample release"}
            </button>
            <span role="status">
              {approved
                ? "Ready in this local fixture. Nothing shipped."
                : "2 checks passed · 1 decision remaining"}
            </span>
          </div>
        </Cell>
      </div>
      <p className="fg-footnote">
        Fictional work items. Decisions are local and reversible; no issue
        tracker or release service is connected.
      </p>
    </section>
  );
}

export function FirecrawlGrid() {
  const [format, setFormat] = useState("JSON");
  const [delivered, setDelivered] = useState(false);
  return (
    <section
      id="features"
      className="feature-grids fg-firecrawl"
      aria-label="Extraction feature grid"
    >
      <GridHeader
        eyebrow="One page. Several useful forms."
        title="The messy part stays behind the API."
        copy="Inspect what comes out: readable text, typed fields, and a delivery event your application can understand."
      />
      <div className="fg-layout">
        <Cell
          name="fg-wide"
          title="Keep the content. Lose the clutter."
          copy="The source and its structured output, side by side."
        >
          <div className="fg-art fg-extract-art">
            <div className="fg-browser-page">
              <Chrome>example.com / field-guide</Chrome>
              <div className="fg-tiny-nav">FIELD NOTES　 JOURNAL　 ABOUT</div>
              <h4>
                A field guide
                <br />
                to quiet work
              </h4>
              <p>
                Choose one task. Remove distractions. Leave a trail for
                tomorrow.
              </p>
              <div className="fg-rule" />
              <div className="fg-rule" />
              <div className="fg-rule short" />
            </div>
            <div className="fg-code-card">
              <small>{format.toLowerCase()} / fixture</small>
              <pre>
                {format === "JSON"
                  ? '{\n  "title": "A field guide",\n  "author": "Pagewire team",\n  "sections": [\n    "Choose one task",\n    "Remove distractions"\n  ],\n  "fixture": true\n}'
                  : "# A field guide\n\nBy Pagewire team\n\n## Choose one task\nMake the next action explicit.\n\n## Remove distractions\nKeep only the tools you need."}
              </pre>
            </div>
          </div>
          <div className="fg-actions">
            <div className="fg-segment" aria-label="Extraction format">
              {["JSON", "Markdown"].map((f) => (
                <button
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                  key={f}
                >
                  {f}
                </button>
              ))}
            </div>
            <span>Local fixture; not a live scrape</span>
          </div>
        </Cell>
        <Cell
          name="fg-narrow"
          title="Ask for the fields you need."
          copy="A small schema makes the result useful to the next step."
        >
          <div className="fg-art fg-schema-art">
            <div className="fg-schema">
              <small>OUTPUT SCHEMA</small>
              {[
                ["title", "string"],
                ["author", "string"],
                ["published", "date"],
                ["sections", "array"],
              ].map(([key, type]) => (
                <div key={key}>
                  <span>{key}</span>
                  <code>{type}</code>
                </div>
              ))}
              <footer>
                <AppIcon name="check" /> 4 fields validated in fixture
              </footer>
            </div>
          </div>
        </Cell>
        <Cell
          name="fg-narrow"
          title="Know where a value came from."
          copy="Keep the source URL and selector with the extracted field."
        >
          <div className="fg-art fg-provenance-art">
            <div className="fg-field-value">
              <small>title</small>
              <h4>A field guide</h4>
              <span>
                <AppIcon name="link" /> article &gt; h1
              </span>
            </div>
            <div className="fg-provenance-line" />
            <div className="fg-source-url">
              <AppIcon name="external" /> example.com/field-guide
              <br />
              <small>Source retained in sample output</small>
            </div>
          </div>
        </Cell>
        <Cell
          name="fg-wide"
          title="An event the next service can use."
          copy="Inspect a delivery envelope before wiring up your own endpoint."
        >
          <div className="fg-art fg-webhook-art">
            <div className="fg-event">
              <Chrome>
                Delivery log <span className="fg-right">local fixture</span>
              </Chrome>
              <div className="fg-event-row">
                <span className={delivered ? "fg-success" : ""}>
                  {delivered ? "200 OK" : "PENDING"}
                </span>
                <code>document.extracted</code>
                <small>evt_sample_01</small>
              </div>
              <pre>
                {
                  '{\n  "event": "document.extracted",\n  "source": "example.com/field-guide",\n  "data": { "sections": 3 },\n  "fixture": true\n}'
                }
              </pre>
            </div>
          </div>
          <div className="fg-actions">
            <button onClick={() => setDelivered(!delivered)}>
              {delivered ? "Reset delivery fixture" : "Simulate delivery"}
            </button>
            <span role="status">
              {delivered
                ? "Local delivery marked successful; no request sent"
                : "Nothing will be sent to an external URL"}
            </span>
          </div>
        </Cell>
      </div>
      <p className="fg-footnote">
        Every response is a labeled local fixture. No crawling or network
        delivery occurs.
      </p>
    </section>
  );
}

export function ElevenGrid() {
  const [playing, setPlaying] = useState(false);
  const [voice, setVoice] = useState("Sol");
  const [language, setLanguage] = useState("Spanish");
  const [reviewed, setReviewed] = useState(false);
  const translated =
    language === "Spanish"
      ? "La tarde entró despacio en la habitación."
      : "L’après-midi avançait doucement dans la pièce.";
  return (
    <section
      id="features"
      className="feature-grids fg-eleven"
      aria-label="Creative feature grid"
    >
      <GridHeader
        eyebrow="A studio, not a single prompt"
        title="Make room for the whole story."
        copy="Shape the words, choose their character, and carry the same intention into another language."
      />
      <div className="fg-layout">
        <Cell
          name="fg-wide"
          title="Edit the story where you hear it."
          copy="Keep the script, speaker, and timeline in one focused view."
        >
          <div className="fg-art fg-editor-art">
            <div className="fg-audio-editor">
              <Chrome>
                Untitled story{" "}
                <span className="fg-right">Saved locally · sample</span>
              </Chrome>
              <div className="fg-editor-body">
                <aside>
                  <span className="fg-mini-orb" />
                  <b>{voice}</b>
                  <small>Narration</small>
                </aside>
                <div>
                  <small>SCENE 01 / A QUIET AFTERNOON</small>
                  <p>
                    The afternoon moved slowly through the room.
                    <br />
                    <mark>There was still time to begin again.</mark>
                  </p>
                  <span className="fg-editor-note">
                    A pause gives the second line room to land.
                  </span>
                </div>
              </div>
              <div className="fg-audio-track">
                <div className="fg-timecode">
                  00:00　　00:04　　00:08　　00:12
                </div>
                <Wave active={playing} />
                <div className={`fg-playhead ${playing ? "playing" : ""}`} />
              </div>
            </div>
          </div>
          <div className="fg-actions">
            <button onClick={() => setPlaying(!playing)}>
              {playing ? "Pause visual timeline" : "Play visual timeline"}
            </button>
            <span role="status">
              {playing
                ? "Timeline moving · silent visual study"
                : "Silent sample · no audio generated"}
            </span>
          </div>
        </Cell>
        <Cell
          name="fg-narrow"
          title="A voice with a point of view."
          copy="Choose a character. The editor stays in sync."
        >
          <div className="fg-art fg-voices-art">
            <div className={`fg-voice-orb voice-${voice.toLowerCase()}`} />
            <div className="fg-voice-summary">
              <strong>{voice}</strong>
              <span>
                {voice === "Sol"
                  ? "Warm, unhurried, close."
                  : "Clear, bright, conversational."}
              </span>
            </div>
          </div>
          <div className="fg-actions">
            <div className="fg-segment" aria-label="Editor voice">
              {["Sol", "Iris"].map((v) => (
                <button
                  key={v}
                  aria-pressed={voice === v}
                  aria-label={`Use ${v} in editor`}
                  onClick={() => setVoice(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </Cell>
        <Cell
          name="fg-half"
          title="The same intention, another language."
          copy="Review the translation alongside the original line."
        >
          <div className="fg-art fg-translation-art">
            <div className="fg-language-line">
              <small>ENGLISH / ORIGINAL</small>
              <p>The afternoon moved slowly through the room.</p>
            </div>
            <div className="fg-language-line translated">
              <small>{language.toUpperCase()} / SAMPLE TRANSLATION</small>
              <p>{translated}</p>
              <Wave />
            </div>
          </div>
          <div className="fg-actions">
            <label>
              Language{" "}
              <select
                aria-label="Translation language"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setReviewed(false);
                }}
              >
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>
          </div>
        </Cell>
        <Cell
          name="fg-half"
          title="A final pass before it leaves the studio."
          copy="Keep human review visible, even in an automated workflow."
        >
          <div className="fg-art fg-transcript-art">
            <div className="fg-transcript">
              <small>REVIEW / SCENE 01</small>
              <div>
                <time>00:00</time>
                <p>
                  The afternoon moved slowly
                  <br />
                  through the room.
                </p>
              </div>
              <div>
                <time>00:04</time>
                <p>
                  There was still time
                  <br />
                  to begin again.
                </p>
              </div>
              <footer>
                <span className="fg-avatar">AL</span>
                {reviewed
                  ? `${language} sample reviewed`
                  : `${language} sample awaiting review`}
              </footer>
            </div>
          </div>
          <div className="fg-actions">
            <button onClick={() => setReviewed(!reviewed)}>
              {reviewed ? "Reopen review" : "Mark sample reviewed"}
            </button>
            <span role="status">
              {reviewed
                ? "Reviewed locally; nothing published"
                : "A language change resets this review"}
            </span>
          </div>
        </Cell>
      </div>
      <p className="fg-footnote">
        Original CSS artwork and sample scripts. Playback is a silent
        visualization, not generated speech.
      </p>
    </section>
  );
}
