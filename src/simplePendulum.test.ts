import { describe, expect, it } from "vitest";
import { clampPendulumLength } from "./simplePendulum";

describe("pendulum controls", () => {
  it("clamps lengths to the supported range", () => {
    expect(clampPendulumLength(10)).toBe(50);
    expect(clampPendulumLength(250)).toBe(250);
    expect(clampPendulumLength(900)).toBe(500);
  });
});
