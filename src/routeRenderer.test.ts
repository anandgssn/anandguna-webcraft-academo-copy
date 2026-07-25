import { describe, expect, it } from "vitest";
import { normalizePath, renderPath } from "./routeRenderer";

describe("route registry", () => {
  it("normalizes trailing slashes", () => {
    expect(normalizePath("/physics/")).toBe("/physics");
    expect(normalizePath("/")).toBe("/");
  });

  it.each([
    ["/", "Academo"],
    ["/physics", "Physics"],
    ["/physics/light", "Light"],
    ["/engineering/computing", "Computing"],
    ["/demos/simple-pendulum", "Simple pendulum"],
    ["/flashcards/flags-of-europe", "Flags of Europe flashcards"]
  ])("renders %s", (path, expectedText) => {
    expect(renderPath(path)).toContain(expectedText);
  });

  it("renders the not-found page for unknown routes", () => {
    expect(renderPath("/missing")).toContain("can't find what you're looking for");
  });
});
