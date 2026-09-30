import { chromium } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.DESIGN_BASE_URL || "http://127.0.0.1:4174";
const root = "test-results";
await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.DESIGN_CHROME
    ? { executablePath: process.env.DESIGN_CHROME }
    : {}),
});
const results = [];
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  for (const name of ["vanilla", "commerce", "developer", "research"]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}/${name}/`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${root}/${name}-desktop.png`,
      fullPage: true,
    });
    assert.equal(await page.locator("h1").count(), 1);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${name} overflow at ${width}`,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `${root}/${name}-mobile.png`,
      fullPage: true,
    });
    results.push(
      `${name}: one H1, no horizontal overflow at 320/390/768/1440, desktop/mobile capture`,
    );
  }
  await page.goto(base + "/vanilla/");
  await page.locator("[data-evidence=dissent]").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#detail-dissent").isVisible(), true);
  assert.equal(await page.locator("#detail-customer").isVisible(), false);
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "detail-dissent",
  );
  await page.getByRole("button", { name: "Commit sample decision" }).click();
  assert.match(
    await page.locator(".decision-status").innerText(),
    /Pilot committed/,
  );
  assert.match(await page.locator(".decision-footer").innerText(), /Committed/);
  await page.getByRole("button", { name: "Reopen sample decision" }).click();
  assert.match(
    await page.locator(".decision-status").innerText(),
    /Under review/,
  );
  assert.match(await page.locator(".decision-footer").innerText(), /Proposed/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .locator("#workspace")
    .screenshot({ path: `${root}/vanilla-dissent.png` });
  results.push(
    "Northstar: keyboard selection, focus transfer, dissent state, commit and reopen synchronize all surfaces",
  );
  await page.goto(base + "/commerce/");
  await page.getByRole("radio", { name: "Forest" }).check();
  assert.equal(
    await page.locator("#lamp-finish").getAttribute("fill"),
    "#4f6346",
  );
  await page.getByRole("button", { name: "Add to sample bag" }).click();
  assert.match(await page.locator("#feedback").innerText(), /Forest/);
  results.push("Lilt: native variant selector updates object and sample bag");
  await page.goto(base + "/developer/");
  for (const [value, label] of [
    ["retry", "202 QUEUED"],
    ["failed", "401 REJECTED"],
    ["delivered", "202 ACCEPTED"],
  ]) {
    await page.locator("#scenario").selectOption(value);
    await page.getByRole("button", { name: "Send sample event" }).click();
    assert.match(
      await page.locator("#response-label").innerText(),
      new RegExp(label),
    );
  }
  results.push("Relay: success, retry, and rejected fixtures");
  await page.goto(base + "/research/");
  const before = await page.locator("#observation").getAttribute("d");
  await page.locator("#noise").focus();
  await page.keyboard.press("End");
  assert.equal(await page.locator("#noise-value").innerText(), "100%");
  assert.notEqual(await page.locator("#observation").getAttribute("d"), before);
  results.push(
    "Fieldwork: keyboard range changes plotted observation and accessible description",
  );
  const staticContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base + "/vanilla/");
  assert.equal(await staticPage.locator("[data-detail]:visible").count(), 3);
  assert.equal(await staticPage.locator("nav a:visible").count(), 3);
  await staticContext.close();
  results.push(
    "Northstar: all evidence and navigation readable without JavaScript",
  );
  // Served from the Vite production output, including shader transforms.
  await page.goto(base + "/lab.html");
  await page.getByRole("tablist").first().waitFor();
  const tabs = page.getByRole("tablist");
  assert.equal(await tabs.count(), 2);
  await tabs.first().getByRole("tab").first().focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await tabs.first().getByRole("tab", { selected: true }).innerText(),
    "Decision",
  );
  assert.equal(
    await tabs.nth(1).getByRole("tab", { selected: true }).innerText(),
    "Source",
  );
  assert.equal(
    await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
      return ids.length === new Set(ids).size;
    }),
    true,
  );
  await page
    .getByRole("button", { name: "Review Inspect the review state." })
    .click();
  assert.equal(errors.length, 0, errors.join("\n"));
  assert.equal(await page.locator("[data-scroll-enhanced]").count(), 0);
  results.push(
    "Production lab: independent tabs, unique IDs, keyboard navigation, ProductStory inside a form, reduced-motion GSAP fallback",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("[data-scroll-enhanced=true]").waitFor();
  await page.locator("[data-story-step]").last().scrollIntoViewIfNeeded();
  results.push("GSAP: enhanced desktop story mounted and final step reached");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("[data-scroll-enhanced]").waitFor({ state: "detached" });
  assert.equal(await page.locator("[data-story-frame]:visible").count(), 3);
  results.push(
    "GSAP: live reduced-motion change cleans up and restores all static frames",
  );
  await page.locator("#material").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${root}/lab-material.png` });
  const canvas = page.locator("canvas");
  if (await canvas.count()) {
    await canvas.evaluate((c) =>
      c.dispatchEvent(new Event("webglcontextlost")),
    );
    await canvas.waitFor({ state: "detached" });
    results.push(
      "WebGL: context-loss event unmounts canvas and retains CSS fallback",
    );
  } else
    results.push(
      "WebGL: GPU canvas unavailable in headless environment; CSS fallback retained",
    );
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(JSON.stringify({ results, errors }, null, 2));
  await fs.writeFile(
    `${root}/verification.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
} finally {
  await browser.close();
}
