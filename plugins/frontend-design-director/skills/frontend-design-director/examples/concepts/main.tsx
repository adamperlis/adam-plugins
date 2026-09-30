import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRightIcon,
  ArrowTopRightIcon,
  CheckIcon,
  PlusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { mountPaperBackground } from "../webgl/paper-background";
import lightShader from "./light.frag?raw";
import studioPhoto from "./studio.jpg";
import "./style.css";

type Direction = "closing" | "ledger" | "room";
const directions: { id: Direction; name: string; label: string }[] = [
  { id: "closing", name: "Closing Time", label: "01" },
  { id: "ledger", name: "The Working Ledger", label: "02" },
  { id: "room", name: "Room for the Work", label: "03" },
];
const query = new URLSearchParams(location.search).get("direction");
const direction = directions.find((d) => d.id === query)?.id;
const Arrow = () => <ArrowRightIcon aria-hidden="true" />;
const Check = () => <CheckIcon aria-hidden="true" />;
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function Switcher({ current }: { current?: Direction }) {
  return (
    <aside className="switcher" aria-label="Concept comparison">
      <a href="./index.html" className="compare-home">
        Design studies
      </a>
      <nav aria-label="Switch design direction">
        {directions.map((d) => (
          <a
            href={`?direction=${d.id}`}
            key={d.id}
            aria-current={current === d.id ? "page" : undefined}
          >
            <span>{d.label}</span> {d.name}
          </a>
        ))}
      </nav>
      <span className="prototype">Interactive concepts</span>
    </aside>
  );
}
function Header({ light = false }: { light?: boolean }) {
  return (
    <header className={`site-header ${light ? "light" : ""}`}>
      <a
        className="wordmark"
        href={`?direction=${direction}`}
        aria-label="Dayform home"
      >
        dayform<span className="brand-period">.</span>
      </a>
      <nav aria-label="Page sections">
        <a href="#how">The product</a>
        <a href="#details">The details</a>
      </nav>
      <a className="header-action" href="#demo">
        Try the demo <Arrow />
      </a>
    </header>
  );
}
function Footer({ next }: { next: Direction }) {
  return (
    <footer className="footer">
      <a className="wordmark" href="./index.html">
        dayform.
      </a>
      <p>
        Independent brand concept. Fictional sample data.
        <br />
        No account, payment, or external submission.
      </p>
      <a href={`?direction=${next}`}>
        Next direction <Arrow />
      </a>
    </footer>
  );
}
function Gallery() {
  return (
    <div className="gallery">
      <Switcher />
      <main>
        <p className="eyebrow">Dayform / Art direction in the browser</p>
        <h1>
          One product.
          <br />
          Three points of view.
        </h1>
        <p className="gallery-intro">
          Time, projects, and invoices for independent teams. Choose a direction
          and try its product story. Each has its own mobile composition.
        </p>
        <div className="direction-grid">
          {directions.map((d) => (
            <a
              className={`direction-card preview-${d.id}`}
              href={`?direction=${d.id}`}
              key={d.id}
            >
              <span className="eyebrow">
                {d.label} / {d.name}
              </span>
              <div className="preview-title">
                {d.id === "closing" ? (
                  <>
                    MAKE A LIVING.
                    <br />
                    HAVE A LIFE.<strong>17:00</strong>
                  </>
                ) : d.id === "ledger" ? (
                  <>
                    Every hour has
                    <br />a bottom line.<strong>48h — $6,000</strong>
                  </>
                ) : (
                  <>
                    Protect the work
                    <br />
                    you opened
                    <br />a studio to do.
                  </>
                )}
              </div>
              <span className="view-direction">
                Explore direction <ArrowTopRightIcon aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
        <p className="gallery-note">
          Three working prototypes, not finished services. Studio photography is
          AI-generated. Motion respects your device’s reduced-motion preference.
        </p>
      </main>
    </div>
  );
}
function Closing() {
  const [closed, setClosed] = useState(false);
  const [extra, setExtra] = useState(false);
  const total = extra ? "6h 30m" : "6h 00m";
  return (
    <div className="closing">
      <Switcher current="closing" />
      <main>
        <div className="closing-intro">
          <Header />
          <section className="closing-hero" aria-labelledby="closing-title">
            <div className="hero-kicker">
              <span>GOOD WORK. THEN GO HOME.</span>
              <span>Time tracking for independent teams</span>
            </div>
            <h1 id="closing-title">
              MAKE A LIVING.
              <br />
              <span>HAVE A LIFE.</span>
            </h1>
            <div className="clock-row">
              <div className="clock" aria-label="Five o’clock">
                17<span className="clock-colon">:</span>00
              </div>
              <div className="clock-note">
                <p>
                  Your day has an end.
                  <br />
                  Your timesheet should, too.
                </p>
                <a href="#demo" className="button dark-button">
                  Call it a day <Arrow />
                </a>
                <span className="eyebrow">
                  Track time. Review work. Get paid.
                </span>
              </div>
            </div>
            <div className="hero-bottom">
              <span>Built for work with an outside.</span>
              <a href="#how">
                Meet Dayform <Arrow />
              </a>
            </div>
          </section>
        </div>
        <section className="close-work section-pad" id="how">
          <div className="section-heading">
            <p className="eyebrow">01 / Leave a clean slate</p>
            <h2>
              Close the day.
              <br />
              Keep the detail.
            </h2>
            <p>
              The last task shouldn’t be remembering every task. Gather the
              hours, check the work, and leave with nothing loose.
            </p>
          </div>
          <div className="close-grid" id="demo">
            <div className={`day-sheet ${closed ? "is-closed" : ""}`}>
              <div className="sheet-heading">
                <div>
                  <span className="eyebrow">Sample timesheet / Wednesday</span>
                  <h3>{closed ? "All wrapped up." : "A good day’s work."}</h3>
                </div>
                <span className="status">
                  {closed ? (
                    <>
                      <Check /> Reviewed
                    </>
                  ) : (
                    "Ready to review"
                  )}
                </span>
              </div>
              <div className="time-entry">
                <span>
                  <b>Brand exploration</b>
                  <small>Studio Folk / Identity</small>
                </span>
                <strong>3h 15m</strong>
              </div>
              <div className="time-entry">
                <span>
                  <b>Client check-in</b>
                  <small>Studio Folk / Direction</small>
                </span>
                <strong>0h 45m</strong>
              </div>
              <div className="time-entry">
                <span>
                  <b>Build & refine</b>
                  <small>North House / Website</small>
                </span>
                <strong>2h 00m</strong>
              </div>
              {extra && (
                <div className="time-entry added-entry">
                  <span>
                    <b>Final notes</b>
                    <small>North House / Handoff</small>
                  </span>
                  <strong>0h 30m</strong>
                </div>
              )}
              <div className="sheet-total">
                <span>Total tracked</span>
                <strong>{total}</strong>
              </div>
              <div className="sheet-actions">
                <button
                  className="button dark-button"
                  onClick={() => setClosed(!closed)}
                >
                  {closed ? "Reopen day" : "Review & close day"}
                  {closed ? <ReloadIcon aria-hidden="true" /> : <Check />}
                </button>
                <button
                  className="text-button"
                  disabled={closed}
                  onClick={() => setExtra(!extra)}
                >
                  {extra ? "Remove final notes" : "Add 30 minutes"}
                  <PlusIcon aria-hidden="true" />
                </button>
              </div>
              <p className="small-note" role="status">
                {closed
                  ? `${total} reviewed. Your sample day is closed; no invoice has been sent.`
                  : "Local demo. Review the day, or add a final entry before closing."}
              </p>
            </div>
            <aside className={`off-clock ${closed ? "finished" : ""}`}>
              <span className="eyebrow">
                {closed ? "DONE FOR TODAY" : "LIFE AFTER THE LAST TAB"}
              </span>
              <div className="off-clock-art" aria-hidden="true">
                <div className="sun" />
                <div className="horizon" />
              </div>
              <h3>
                {closed ? (
                  <>
                    See you
                    <br />
                    tomorrow.
                  </>
                ) : (
                  <>
                    Work ends.
                    <br />
                    Life doesn’t.
                  </>
                )}
              </h3>
              <p>
                {closed
                  ? "The hours are accounted for. The evening is yours."
                  : "One place for the time you put in. More room for everything you do outside it."}
              </p>
            </aside>
          </div>
        </section>
        <section className="closing-details section-pad" id="details">
          <div className="section-heading">
            <p className="eyebrow">02 / No loose ends</p>
            <h2>Done means done.</h2>
          </div>
          <div className="closing-proof">
            <article>
              <span className="eyebrow">Keep the week in view</span>
              <h3>No Friday archaeology.</h3>
              <div
                className="week-art"
                aria-label="Illustrative week: Monday 6 hours, Tuesday 7, Wednesday 6, Thursday 5, Friday 4"
              >
                {[6, 7, 6, 5, 4].map((h, i) => (
                  <div key={i}>
                    <span>{h}h</span>
                    <i style={{ height: `${h * 16}px` }} />
                    <small>{["M", "T", "W", "T", "F"][i]}</small>
                  </div>
                ))}
              </div>
              <p>
                A week of work, already where it belongs. Illustrative weekly
                view.
              </p>
            </article>
            <article>
              <span className="eyebrow">Carry the detail forward</span>
              <h3>Hours become an invoice.</h3>
              <div
                className="invoice-crop"
                aria-label="Illustrative draft invoice"
              >
                <div className="mini-invoice">
                  <div>
                    <b>Studio Folk</b>
                    <span>DRAFT / 0042</span>
                  </div>
                  <hr />
                  <p>
                    Identity exploration <b>3.25h</b>
                  </p>
                  <p>
                    Client direction <b>0.75h</b>
                  </p>
                  <hr />
                  <p>
                    Total at $125/hour <b>$500</b>
                  </p>
                  <small>Itemized from your time entries</small>
                </div>
              </div>
              <p>Same work. Same detail. No second spreadsheet.</p>
            </article>
          </div>
        </section>
        <section className="closing-end section-pad">
          <p className="eyebrow">TIME WELL SPENT. AND THEN NOT SPENT HERE.</p>
          <h2>THAT’S YOUR DAY.</h2>
          <a href="#demo" className="button dark-button">
            Try closing it <Arrow />
          </a>
        </section>
      </main>
      <Footer next="ledger" />
    </div>
  );
}
function Ledger() {
  const [hours, setHours] = useState(24);
  const [rate, setRate] = useState(125);
  const [issued, setIssued] = useState(false);
  const total = hours + 24;
  const changeHours = (n: number) => {
    setHours(n);
    setIssued(false);
  };
  const changeRate = (n: number) => {
    setRate(n);
    setIssued(false);
  };
  return (
    <div className="ledger">
      <Switcher current="ledger" />
      <Header />
      <main className="ledger-main">
        <section className="ledger-hero">
          <div className="ledger-title">
            <p className="eyebrow">THE BUSINESS BEHIND THE WORK</p>
            <h1>
              Every hour has
              <br />a bottom line.
            </h1>
          </div>
          <div className="ledger-margin">
            <p>
              Know what went into the work.
              <br />
              Know what should come out of it.
            </p>
            <a href="#demo">
              Explore a project <Arrow />
            </a>
          </div>
          <div
            className="equation"
            aria-label={`${total} hours at ${rate} dollars per hour equals ${money(total * rate)}`}
          >
            <div>
              <strong>
                {total}
                <span> hours</span>
              </strong>
              <small>Illustrative project / {money(rate)} per hour</small>
            </div>
            <div className="equation-line" aria-hidden="true" />
            <div>
              <strong>{money(total * rate)}</strong>
              <small>Work, accounted for.</small>
            </div>
          </div>
        </section>
        <section className="ledger-project" id="demo">
          <div className="project-band">
            <div>
              <span className="eyebrow">PROJECT / SAMPLE DATA</span>
              <h2>Brand & website</h2>
            </div>
            <span>Studio Folk</span>
            <span className="status">In progress</span>
          </div>
          <div className="ledger-project-grid">
            <div className="ledger-table">
              <div className="ledger-table-head">
                <span>Task</span>
                <span>Hours</span>
                <span>Amount</span>
              </div>
              {[
                ["Design", "Visual direction, UI design", hours],
                ["Development", "Front-end build, CMS", 16],
                ["Strategy", "Research & positioning", 8],
              ].map(([task, text, n]) => (
                <div className="ledger-row" key={task}>
                  <div>
                    <b>{task}</b>
                    <small>{text}</small>
                  </div>
                  <span>{n}h</span>
                  <span>{money(Number(n) * rate)}</span>
                </div>
              ))}
              <div className="ledger-inputs">
                <label htmlFor="design-hours">
                  Design hours <output>{hours}h</output>
                  <input
                    id="design-hours"
                    type="range"
                    min="8"
                    max="56"
                    step="1"
                    value={hours}
                    onChange={(e) => changeHours(Number(e.target.value))}
                  />
                </label>
                <label htmlFor="hourly-rate">
                  Hourly rate
                  <select
                    id="hourly-rate"
                    value={rate}
                    onChange={(e) => changeRate(Number(e.target.value))}
                  >
                    <option value="100">$100 / hour</option>
                    <option value="125">$125 / hour</option>
                    <option value="150">$150 / hour</option>
                  </select>
                </label>
              </div>
            </div>
            <aside className="ledger-budget">
              <div>
                <span className="eyebrow">Budget</span>
                <strong>80h</strong>
              </div>
              <div>
                <span className="eyebrow">Remaining</span>
                <strong>{80 - total}h</strong>
              </div>
              <div
                className="budget-meter"
                style={{ "--used": (total / 80) * 100 } as React.CSSProperties}
                role="meter"
                aria-label="Hours used"
                aria-valuenow={total}
                aria-valuemin={0}
                aria-valuemax={80}
              >
                <i style={{ height: `${(total / 80) * 100}%` }} />
              </div>
            </aside>
          </div>
          <p className="small-note">
            Adjust the design hours or rate. Project value, remaining budget,
            and invoice update together.
          </p>
        </section>
        <section className="ledger-story" id="how">
          <div className="ledger-caption">
            <p className="eyebrow">01 — ACCOUNT FOR THE WORK</p>
            <h2>
              A clear line from
              <br />
              effort to income.
            </h2>
            <p>
              Time shouldn’t disappear into a timesheet. Follow it through the
              project, into the budget, and onto the bill.
            </p>
          </div>
          <div className="ledger-invoice">
            <div className="invoice-heading">
              <span className="eyebrow">DAYFORM / SAMPLE INVOICE</span>
              <span className="status">
                {issued ? "Draft created" : "Preview"}
              </span>
            </div>
            <h3>Studio Folk</h3>
            <div className="invoice-line">
              <span>Brand & website</span>
              <span>{total} hours</span>
            </div>
            <div className="invoice-line">
              <span>Rate</span>
              <span>{money(rate)} / hour</span>
            </div>
            <div className="invoice-amount">
              <span>Total / no tax in this demo</span>
              <strong>{money(total * rate)}</strong>
            </div>
            <button
              className="button red-button"
              onClick={() => setIssued(!issued)}
            >
              {issued ? "Reset draft" : "Create sample draft"}
              {issued ? <ReloadIcon aria-hidden="true" /> : <Arrow />}
            </button>
            <p className="small-note" role="status">
              {issued
                ? `Draft ready for ${money(total * rate)}. Not saved or sent. Editing hours or rate resets it.`
                : "A local preview based on the project above. Nothing is sent."}
            </p>
          </div>
        </section>
        <section className="ledger-details" id="details">
          <p className="eyebrow">02 — LESS INTERPRETATION. MORE INFORMATION.</p>
          <div>
            <h2>
              The numbers
              <br />
              belong together.
            </h2>
            <div className="ledger-principles">
              <article>
                <span>01</span>
                <h3>Time has context.</h3>
                <p>
                  Every entry stays attached to the task and project it came
                  from.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Budgets stay visible.</h3>
                <p>
                  See what’s used and what’s left before the next round of work.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Invoices keep the story.</h3>
                <p>
                  The work you tracked is the work you bill. One connected
                  record.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer next="room" />
    </div>
  );
}
function Daylight() {
  const host = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (host.current && control.current)
      return mountPaperBackground(host.current, control.current, {
        fragmentShader: lightShader,
        speed: 0.7,
      });
  }, []);
  return (
    <>
      <div className="daylight" ref={host} aria-hidden="true" />
      <button ref={control} className="motion-control" hidden>
        Pause background motion
      </button>
    </>
  );
}
function Room() {
  const [phase, setPhase] = useState(1);
  const [added, setAdded] = useState(false);
  const phases = ["Concept", "Development", "Delivery"];
  const values = [24, 48, 64];
  const used = values[phase] + (added ? 8 : 0);
  return (
    <div className="room">
      <Switcher current="room" />
      <main>
        <section className="room-hero">
          <img
            className="studio-photo"
            src={studioPhoto}
            alt="Two architects working together on a building model in a sunlit studio. AI-generated concept photography."
            fetchPriority="high"
          />
          <div className="photo-shade" />
          <Header light />
          <div className="room-hero-copy">
            <p className="eyebrow">FOR THE PEOPLE WHO MAKE THINGS</p>
            <h1>
              Protect the work
              <br />
              you opened
              <br />a studio to do.
            </h1>
            <p>
              Time, projects, and invoices.
              <br />
              Handled with care.
            </p>
            <a href="#demo" className="button cream-button">
              Step inside <Arrow />
            </a>
          </div>
          <div className="room-photo-caption">
            <span>Less administration. More room for the work.</span>
            <span>AI-generated studio study</span>
          </div>
        </section>
        <section className="room-opening section-pad" id="how">
          <p className="eyebrow">A LITTLE ORDER. A LOT OF POSSIBILITY.</p>
          <div>
            <h2>
              Keep the business
              <br />
              from crowding
              <br />
              out the craft.
            </h2>
            <p>
              You didn’t open a studio to manage a spreadsheet. Dayform brings
              the practical parts together, so the work can have your attention.
            </p>
          </div>
        </section>
        <section className="room-product section-pad" id="demo">
          <div className="room-product-heading">
            <div>
              <p className="eyebrow">A PROJECT, WITH PERSPECTIVE</p>
              <h2>
                Enough detail.
                <br />
                Room to breathe.
              </h2>
            </div>
            <p>
              Follow a sample project from first thought to final handoff. See
              the budget change as the work moves forward.
            </p>
          </div>
          <div className="room-product-grid">
            <div className="studio-project">
              <div className="studio-project-top">
                <span className="eyebrow">FOLK STUDIO / SAMPLE PROJECT</span>
                <h3>North House</h3>
                <span className="project-type">Visual identity & website</span>
              </div>
              <div className="phase-buttons" aria-label="Project phase">
                {phases.map((p, i) => (
                  <button
                    key={p}
                    aria-pressed={phase === i}
                    onClick={() => {
                      setPhase(i);
                      setAdded(false);
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="timeline-crop">
                <div className="timeline">
                  <div className="timeline-labels">
                    <span>Workstream</span>
                    <span>Week 01</span>
                    <span>Week 02</span>
                    <span>Week 03</span>
                  </div>
                  {[
                    ["Research & direction", 0, 35],
                    ["Identity system", 24, 45],
                    ["Digital experience", 48, 43],
                  ].map(([label, start, width], i) => (
                    <div className="timeline-row" key={label}>
                      <span>{label}</span>
                      <div>
                        <i
                          className={i <= phase ? "active" : ""}
                          style={{
                            marginLeft: `${start}%`,
                            width: `${width}%`,
                          }}
                        >
                          {i < phase
                            ? "Complete"
                            : i === phase
                              ? "In progress"
                              : "Upcoming"}
                        </i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="project-summary">
                <span>{phases[phase]} phase</span>
                <span>{used} of 80 hours used</span>
              </div>
              <p className="small-note">
                Illustrative schedule. Select a phase to explore the linked
                budget.
              </p>
            </div>
            <div className="budget-scene">
              <Daylight />
              <div className="budget-paper">
                <span className="eyebrow">NORTH HOUSE / TIME BUDGET</span>
                <h3>
                  Space for
                  <br />
                  what’s next.
                </h3>
                <div className="room-hours">
                  <strong>{80 - used}h</strong>
                  <span>still in the budget</span>
                </div>
                <div
                  className="room-meter"
                  role="meter"
                  aria-label="Project hours used"
                  aria-valuenow={used}
                  aria-valuemin={0}
                  aria-valuemax={80}
                >
                  <i style={{ width: `${(used / 80) * 100}%` }} />
                </div>
                <p>{used}h used · 80h agreed</p>
              </div>
              <div className="budget-scene-controls">
                <button
                  className="button cream-button"
                  onClick={() => setAdded(!added)}
                >
                  {added ? "Remove extra day" : "Plan an extra day"}
                  {added ? (
                    <ReloadIcon aria-hidden="true" />
                  ) : (
                    <PlusIcon aria-hidden="true" />
                  )}
                </button>
                <span role="status">
                  {added
                    ? "8 hours added to the sample plan."
                    : "Try adding 8 hours to this phase."}
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="room-details section-pad" id="details">
          <div className="room-detail-title">
            <p className="eyebrow">THE PRACTICAL PARTS, TOGETHER</p>
            <h2>
              Make good work.
              <br />
              Run a good studio.
            </h2>
          </div>
          <div className="room-detail-grid">
            <article>
              <h3>A week you can read.</h3>
              <p>
                Give each person enough room, and each project the attention it
                needs.
              </p>
              <div className="people-list">
                <div>
                  <span className="avatar">AK</span>
                  <span>
                    Ada K.<small>Design direction</small>
                  </span>
                  <b>24 / 32h</b>
                </div>
                <div>
                  <span className="avatar">JM</span>
                  <span>
                    Jules M.<small>Digital design</small>
                  </span>
                  <b>28 / 32h</b>
                </div>
                <div>
                  <span className="avatar">RL</span>
                  <span>
                    Ren L.<small>Strategy</small>
                  </span>
                  <b>16 / 24h</b>
                </div>
              </div>
              <small>Illustrative team allocation</small>
            </article>
            <article>
              <h3>The work, in writing.</h3>
              <p>
                Carry the care you put into the project all the way to the
                invoice.
              </p>
              <div className="room-invoice-crop">
                <div className="mini-invoice">
                  <span className="eyebrow">FOLK STUDIO / DRAFT 0042</span>
                  <h4>North House</h4>
                  <p>
                    Identity & website <b>48 hours</b>
                  </p>
                  <hr />
                  <p>
                    At $125 per hour <b>$6,000</b>
                  </p>
                  <small>Illustrative invoice · Not sent</small>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section className="room-end section-pad">
          <p className="eyebrow">YOUR STUDIO. WITH A LITTLE MORE SPACE.</p>
          <h2>
            Back to the work
            <br />
            you love.
          </h2>
          <a className="button cream-button" href="#demo">
            Explore the project <Arrow />
          </a>
        </section>
      </main>
      <Footer next="closing" />
    </div>
  );
}

function InitialAnchor() {
  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(location.hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}

document.title = direction
  ? `Dayform — ${directions.find((d) => d.id === direction)!.name}`
  : "Dayform — Three directions";
createRoot(document.getElementById("root")!).render(
  <>
    <InitialAnchor />
    {direction === "closing" ? (
      <Closing />
    ) : direction === "ledger" ? (
      <Ledger />
    ) : direction === "room" ? (
      <Room />
    ) : (
      <Gallery />
    )}
  </>,
);
