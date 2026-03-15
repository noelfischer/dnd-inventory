import { expect, test, type Page } from "@playwright/test";

const E2E_EMAIL = process.env.E2E_EMAIL;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

function requireE2EEnv() {
  test.skip(
    !E2E_EMAIL || !E2E_PASSWORD,
    "Set E2E_EMAIL and E2E_PASSWORD to run smoke e2e tests.",
  );
}

async function login(page: Page) {
  // Retry once because Next dev server can briefly restart during startup/HMR.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto("/en/login", { waitUntil: "domcontentloaded" });
      break;
    } catch (error) {
      if (attempt === 1) throw error;
      await page.waitForTimeout(500);
    }
  }

  if (page.url().includes("/campaigns")) {
    return;
  }

  await page.locator('input[name="email"]').fill(E2E_EMAIL!);
  await page.locator('input[name="password"]').fill(E2E_PASSWORD!);

  const credentialsForm = page
    .locator("form")
    .filter({ has: page.locator('input[name="email"]') });
  await credentialsForm.locator('button[type="submit"]').click();

  await page.waitForURL("**/campaigns", { timeout: 20_000 });
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
}

test.describe.serial("E2E smoke", () => {
  test("auth smoke", async ({ page }) => {
    requireE2EEnv();
    await login(page);
  });

  test("create campaign and character smoke", async ({ page }) => {
    requireE2EEnv();
    await login(page);

    const campaignName = `Smoke Campaign ${Date.now()}`;
    const characterName = `Smoke Character ${Date.now()}`;
    let createdCampaignId: string | null = null;

    await page.locator(".new-campaign").first().click();
    await page.waitForURL("**/campaigns/create", { timeout: 20_000 });
    await page.locator('#name').fill(campaignName);
    await page.locator('form button[type="submit"]').first().click();

    await page.waitForURL("**/campaigns", { timeout: 20_000 });
    await page.getByRole("link", { name: campaignName }).click();
    await page.waitForURL("**/campaigns/*", { timeout: 20_000 });
    createdCampaignId = page.url().match(/\/campaigns\/([^/?#]+)/)?.[1] ?? null;
    expect(createdCampaignId).toBeTruthy();
    await page.waitForLoadState("domcontentloaded");

    await page.locator("a.new-character").first().click();
    await page.waitForURL("**/create-character", { timeout: 20_000 });
    await page.locator('#name').fill(characterName);
    await page.locator('#species').fill("Smoke");
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForURL("**/campaigns/*", { timeout: 20_000 });

    await expect(page.getByText(characterName)).toBeVisible();

    await page.goto("/en/campaigns");
    await page.goto(`/en/campaigns/${createdCampaignId}/delete`);
    await page.locator("button").filter({ hasText: "Delete" }).click();
    await page.waitForURL("**/campaigns", { timeout: 20_000 });
    await expect(
      page.getByRole("heading", { name: "Campaigns" }),
    ).toBeVisible();
    await expect(page.getByText(campaignName)).toHaveCount(0);
  });
});
