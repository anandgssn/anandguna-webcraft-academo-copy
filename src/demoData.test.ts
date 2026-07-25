import { describe, expect, it } from "vitest";
import { demos, isDemoInCategory } from "./demoData";

describe("demo catalog", () => {
  it("contains the sixteen scoped demos with unique slugs", () => {
    expect(demos).toHaveLength(16);
    expect(new Set(demos.map((demo) => demo.slug)).size).toBe(demos.length);
  });

  it("includes demos in their additional categories", () => {
    const amplitudeModulation = demos.find((demo) => demo.slug === "amplitude-modulation")!;
    expect(isDemoInCategory(amplitudeModulation, "Engineering")).toBe(true);
    expect(isDemoInCategory(amplitudeModulation, "Music")).toBe(true);
    expect(isDemoInCategory(amplitudeModulation, "Physics")).toBe(true);
    expect(isDemoInCategory(amplitudeModulation, "Geography")).toBe(false);
  });
});
