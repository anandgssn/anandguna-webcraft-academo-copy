import { describe, expect, it } from "vitest";
import { demos } from "./demoData";
import {
  renderSearchPage,
  renderSearchResults
} from "./components";
import { renderDemoDetailPage } from "./demoDetailPage";

describe("page rendering", () => {
  it("keeps the search page empty until a query is entered", () => {
    const html = renderSearchPage(demos);
    expect(html).toContain('placeholder="Type here..."');
    expect(html).not.toContain("thumbnail-title");
    expect(html).not.toContain("Search results</h2>");
  });

  it("renders a heading and matching result cards after search", () => {
    const matches = demos.filter((demo) => demo.tags.includes("temperament"));
    const html = renderSearchResults(matches);
    expect(html).toContain("1 demo shown");
    expect(html).toContain("19 TET Keyboard");
  });

  it("has a concrete renderer for every catalog demo", () => {
    for (const demo of demos) {
      expect(() => renderDemoDetailPage(demo)).not.toThrow();
    }
  });
});
