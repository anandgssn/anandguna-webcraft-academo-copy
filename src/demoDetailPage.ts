import type { DemoItem } from "./demoData";
import { escapeHtml, renderPageShell } from "./components";
import {
  renderHypocycloidDescription,
  renderMonteCarloPiDescription,
  renderAzimuthDescription,
  renderColourTemperatureDescription,
  renderElectricFieldDescription,
  renderPendulumDescription,
  renderGeodesicsDescription,
  renderCapitalCitiesDescription,
  renderRot13Description,
  renderAmplitudeModulationDescription,
  renderFlagsOfEuropeDescription,
  renderUsStatesCredits,
  renderFlashcardActions,
  renderVirtualOscilloscopeDescription,
  renderTetKeyboardDescription,
  renderLogicGateDescription,
  renderVectorPlotterDescription
} from "./demoDescriptions";

export function renderDemoDetailPage(demo: DemoItem) {
  const title = escapeHtml(demo.title);
  const heading = demo.slug === "flags-of-europe"
    ? "Flags of Europe flashcards"
    : demo.slug === "us-states"
      ? "US States Map Flashcards flashcards"
      : title;
  const demoRenderers: Record<string, () => string> = {
    "logic-gate-simulator": () => `
        <div class="logic-gate-simulator" data-logic-gate-simulator></div>
        ${renderLogicGateDescription()}
      `,
    "3d-vector-plotter": () => `
          <div class="vector-plotter" data-vector-plotter></div>
          ${renderVectorPlotterDescription()}
        `,
    "19-tet-keyboard": () => `
          <div class="tet-keyboard-demo" data-tet-keyboard></div>
          ${renderTetKeyboardDescription()}
        `,
    "virtual-oscilloscope": () => `
          <div class="virtual-oscilloscope" data-virtual-oscilloscope></div>
          ${renderVirtualOscilloscopeDescription()}
        `,
    "amplitude-modulation": () => `
          <div class="amplitude-modulation" data-amplitude-modulation></div>
          ${renderAmplitudeModulationDescription()}
        `,
    "rot-13-cipher": () => `
          <div class="rot13-demo" data-rot13></div>
          ${renderRot13Description()}
        `,
    "hypocycloid": () => `
          <div class="hypocycloid-demo" data-hypocycloid></div>
          ${renderHypocycloidDescription()}
        `,
    "estimating-pi-monte-carlo": () => `
          <div class="monte-carlo-demo" data-monte-carlo-pi></div>
          ${renderMonteCarloPiDescription()}
        `,
    "azimuth-calculator": () => `
          <div class="azimuth-demo" data-azimuth-calculator></div>
          ${renderAzimuthDescription()}
        `,
    "colour-temperature-relationship": () => `
          <div class="colour-temperature-demo" data-colour-temperature></div>
          ${renderColourTemperatureDescription()}
        `,
    "electric-field-line-simulator": () => `
          <div class="electric-field-demo" data-electric-field></div>
          ${renderElectricFieldDescription()}
        `,
    "simple-pendulum": () => `<div class="simple-pendulum-demo" data-simple-pendulum></div>${renderPendulumDescription()}`,
    "geodesics": () => `<div class="geodesics-demo" data-geodesics></div>${renderGeodesicsDescription()}`,
    "capital-cities-map": () => `<div class="capital-cities-demo" data-capital-cities></div>${renderCapitalCitiesDescription()}`,
    "flags-of-europe": () => `
          <div class="flags-of-europe-demo" data-flags-of-europe></div>
          ${renderFlagsOfEuropeDescription()}
        `,
    "us-states": () => `<div class="us-states-flashcards" data-us-states></div>${renderUsStatesCredits()}`
  };
  const renderDemo = demoRenderers[demo.slug];
  if (!renderDemo) {
    throw new Error(`No implementation registered for demo: ${demo.slug}`);
  }
  const demoBody = renderDemo();

  const content = `
    <article class="demo-detail" aria-labelledby="demo-title">
      ${demo.slug === "flags-of-europe"
        ? `<a class="flashcards-breadcrumb" href="/flashcards" data-link><span class="material-symbols-outlined" aria-hidden="true">keyboard_double_arrow_left</span> Back to all Flashcards</a>`
        : demo.slug === "us-states"
          ? `<a class="flashcards-breadcrumb" href="/flashcards" data-link><span class="material-symbols-outlined" aria-hidden="true">keyboard_double_arrow_left</span> Back to all Flashcards</a>`
        : ""}
      <div class="preamble">
        <h1 id="demo-title">${heading}</h1>
        <hr>
        <p class="blurb">${escapeHtml(demo.description)}</p>
        ${demo.slug === "amplitude-modulation"
          ? `<p class="tags demo-tags" aria-label="Amplitude Modulation categories">
              <a href="/physics" data-link>Physics</a>
              <a href="/music" data-link>Music</a>
              <a href="/engineering" data-link>Engineering</a>
              <a href="/physics/waves" data-link>Waves</a>
              <a href="/engineering/signals" data-link>Signals</a>
              </p>`
          : demo.slug === "hypocycloid"
            ? `<p class="tags demo-tags" aria-label="Hypocycloid categories">
                <a href="/maths" data-link>Maths</a>
                <a href="/maths/geometry" data-link>Geometry</a>
                <a href="/search?q=circle" data-link>Circle</a>
              </p>`
          : demo.slug === "estimating-pi-monte-carlo"
            ? `<p class="tags demo-tags" aria-label="Estimating Pi categories">
                <a href="/maths" data-link>Maths</a>
                <a href="/maths/numbers" data-link>Numbers</a>
                <a href="/maths/statistics" data-link>Statistics</a>
                <a href="/search?q=pi" data-link>Pi</a>
              </p>`
          : demo.slug === "19-tet-keyboard"
            ? `<p class="tags demo-tags" aria-label="19 TET Keyboard categories">
                <a href="/music" data-link>Music</a>
                <a href="/music/pitch" data-link>Pitch</a>
                <a href="/search?q=temperament" data-link>Temperament</a>
                <a href="/search?q=audio" data-link>Audio</a>
              </p>`
          : demo.slug === "azimuth-calculator"
            ? `<p class="tags demo-tags" aria-label="Azimuth Calculator categories">
                <a href="/physics" data-link>Physics</a>
                <a href="/geography" data-link>Geography</a>
                <a href="/physics/astronomy" data-link>Astronomy</a>
                <a href="/geography/maps" data-link>Maps</a>
              </p>`
          : demo.slug === "colour-temperature-relationship"
            ? `<p class="tags demo-tags" aria-label="Colour-Temperature categories">
                <a href="/physics" data-link>Physics</a>
                <a href="/physics/light" data-link>Light</a>
                <a href="/search?q=colour" data-link>Colour</a>
              </p>`
          : demo.slug === "electric-field-line-simulator"
            ? `<p class="tags demo-tags" aria-label="Electric field simulator categories">
                <a href="/physics" data-link>Physics</a>
                <a href="/physics/electricity" data-link>Electricity</a>
                <a href="/search?q=fields" data-link>Fields</a>
                <a href="/search?q=coulomb" data-link>Coulomb</a>
              </p>`
          : demo.slug === "simple-pendulum"
            ? `<p class="tags demo-tags" aria-label="Simple pendulum categories"><a href="/physics" data-link>Physics</a><a href="/physics/classical-mechanics" data-link>Classical Mechanics</a></p>`
          : demo.slug === "geodesics"
            ? `<p class="tags demo-tags" aria-label="Geodesics categories"><a href="/maths" data-link>Maths</a><a href="/geography" data-link>Geography</a><a href="/maths/geometry" data-link>Geometry</a><a href="/geography/maps" data-link>Maps</a><a href="/search?q=geodesic" data-link>Geodesic</a></p>`
          : demo.slug === "capital-cities-map"
            ? `<p class="tags demo-tags" aria-label="Capital Cities Map categories"><a href="/geography" data-link>Geography</a><a href="/geography/maps" data-link>Maps</a><a href="/geography/human" data-link>Human Geography</a><a href="/search?q=cities" data-link>Cities</a></p>`
          : demo.slug === "logic-gate-simulator"
            ? `<p class="tags demo-tags" aria-label="Logic Gate Simulator categories">
                <a href="/engineering" data-link>Engineering</a>
                <a href="/engineering/electronics" data-link>Electronics</a>
                <a href="/search?q=logic" data-link>Logic</a>
              </p>`
          : demo.slug === "rot-13-cipher"
          ? `<p class="tags demo-tags" aria-label="ROT-13 categories">
              <a href="/engineering" data-link>Engineering</a>
              <a href="/engineering/computing" data-link>Computing</a>
              <a href="/search?q=cryptography" data-link>Cryptography</a>
            </p>`
          : ""}
        ${demo.slug === "flags-of-europe" || demo.slug === "us-states" ? renderFlashcardActions() : ""}
        <hr>
      </div>
      ${demoBody}
    </article>
  `;

  return renderPageShell(content);
}
