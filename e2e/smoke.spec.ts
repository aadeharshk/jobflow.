import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

async function devSignIn(page: Page) {
  const email = `e2e.${Date.now()}.${Math.random().toString(36).slice(2, 7)}@example.com`;
  await page.goto("/signin");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Dev sign-in" }).click();
  await expect(page).toHaveURL(/\/app$/);
  return email;
}

test("landing page explains the product and its guard rails", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("trustworthy AI copilot");
  await expect(page.getByText("never scrapes LinkedIn")).toBeVisible();
  const csp = (await page.request.get("/")).headers()["content-security-policy"];
  expect(csp).toContain("frame-ancestors 'none'");
});

test("theme toggle switches to dark mode", async ({ page }) => {
  await page.goto("/");
  const before = await page.locator("html").getAttribute("data-theme");
  await page
    .getByRole("button", { name: /Switch to (dark|light) theme/ })
    .first()
    .click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", before ?? "");
});

test("protected routes redirect to sign-in", async ({ page }) => {
  await page.goto("/app/settings");
  await expect(page).toHaveURL(/\/signin\?returnTo=%2Fapp%2Fsettings/);
});

test("sign in, upload a résumé and pause automation", async ({ page }) => {
  await devSignIn(page);
  await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();

  await page.getByRole("link", { name: "Résumés" }).first().click();
  const pdf = path.join(os.tmpdir(), `jobflow-e2e-${Date.now()}.pdf`);
  fs.writeFileSync(pdf, "%PDF-1.7\n% e2e\n%%EOF\n");
  await page.getByLabel("Choose résumé PDF").setInputFiles(pdf);
  await expect(page.getByText(path.basename(pdf))).toBeVisible();

  await page.getByRole("link", { name: "Settings" }).first().click();
  const pause = page.getByRole("switch", { name: "Pause all automation" });
  await pause.click();
  await expect(pause).toHaveAttribute("aria-checked", "true");
  await expect(page.getByText("Paused", { exact: true })).toBeVisible();

  await page.goto("/app");
  await expect(page.getByText("Automation paused")).toBeVisible();
});
