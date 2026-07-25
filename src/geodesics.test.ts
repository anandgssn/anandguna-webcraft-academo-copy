import { describe, expect, it } from "vitest";
import {
  calculateBearing,
  calculateGreatCircle,
  formatCoordinate
} from "./geodesicMath";

describe("geodesic calculations", () => {
  it("formats map coordinates consistently", () => {
    expect(formatCoordinate({ lat: 12.345, lng: -67.891 })).toBe("(12.35°, -67.89°)");
  });

  it("calculates cardinal bearings", () => {
    expect(calculateBearing({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(0);
    expect(calculateBearing({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(90);
  });

  it("preserves endpoints while interpolating a great circle", () => {
    const origin = { lat: 39.64, lng: -115.49 };
    const destination = { lat: -22.69, lng: 52.98 };
    const points = calculateGreatCircle(origin, destination);
    expect(points).toHaveLength(101);
    expect(points[0][0]).toBeCloseTo(origin.lat);
    expect(points[0][1]).toBeCloseTo(origin.lng);
    expect(points.at(-1)?.[0]).toBeCloseTo(destination.lat);
    expect(points.at(-1)?.[1]).toBeCloseTo(destination.lng);
  });
});
