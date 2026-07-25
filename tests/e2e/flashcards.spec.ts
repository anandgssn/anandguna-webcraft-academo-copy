import { expect, test } from "@playwright/test";

test("All Terms visibility controls update the US States deck", async ({ page }) => {
  await page.goto("/flashcards/us-states");
  await expect(page.getByText("Current slide:")).toBeVisible();
  await page.getByRole("button", { name: /View All Terms/ }).click();
  await expect(page.getByRole("dialog", { name: "All Terms" })).toBeVisible();

  const firstVisibilityToggle = page.getByRole("checkbox").first();
  await expect(firstVisibilityToggle).toBeChecked();
  await firstVisibilityToggle.uncheck();
  await expect(page.getByText("/ 50", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Close all terms panel" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
