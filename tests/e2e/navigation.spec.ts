import { expect, test } from "@playwright/test";

test("navigates between category and demo routes without a page reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Physics", exact: true }).first().click();
  await expect(page).toHaveURL(/\/physics$/);
  await expect(page.getByRole("heading", { level: 1, name: "Physics" })).toBeVisible();

  await page.getByRole("link", { name: "Simple pendulum" }).click();
  await expect(page).toHaveURL(/\/demos\/simple-pendulum$/);
  await expect(page.locator(".simple-pendulum-demo canvas")).toBeVisible();
});

test("search query renders only matching demos", async ({ page }) => {
  await page.goto("/search");
  await expect(page.locator(".thumbnail")).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search demos" }).fill("temperament");
  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  await expect(page.locator(".thumbnail")).toHaveCount(1);
  await expect(page.getByText("19 TET Keyboard", { exact: true })).toBeVisible();
});

test("lazy-loaded visual engines mount on their demo routes", async ({ page }) => {
  await page.goto("/demos/3d-vector-plotter");
  await expect(page.locator("[data-vector-canvas] canvas")).toBeVisible();

  await page.goto("/demos/simple-pendulum");
  await expect(page.locator(".simple-pendulum-demo canvas")).toBeVisible();
  await expect(page.locator("[data-mathjax] svg").first()).toBeVisible();
});
