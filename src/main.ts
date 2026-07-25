import { renderDemoList } from "./components";
import { demos } from "./demoData";
import { renderPath } from "./routeRenderer";
import "./styles.css";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("App root not found");
}

const app = appRoot;

function preloadDemoThumbnails() {
  demos.forEach((demo) => {
    const image = new Image();
    image.src = demo.thumbnail;
  });
}

async function renderRoute() {
  app.innerHTML = renderPath(window.location.pathname);

  bindInternalLinks();
  bindDemoSearch();
  bindMailtoForm();
  await mountCurrentDemo();
  scrollToHash();
}

function navigateTo(url: URL) {
  window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  renderRoute();
}

function bindInternalLinks() {
  app.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) {
        return;
      }

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      navigateTo(url);
    });
  });
}

function bindDemoSearch() {
  const searchInput = app.querySelector<HTMLInputElement>("#demo-search");
  const resultCount = app.querySelector<HTMLParagraphElement>(".result-count");
  const results = app.querySelector<HTMLElement>("[data-demo-results]");

  if (!searchInput || !resultCount || !results) {
    return;
  }

  const updateResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredDemos = searchInput.hasAttribute("data-require-query") && !query
      ? []
      : filterDemos(query);

    resultCount.textContent = query || !searchInput.hasAttribute("data-require-query")
      ? resultCount.hasAttribute("data-result-heading")
        ? "Search results"
        : `${filteredDemos.length} demo${filteredDemos.length === 1 ? "" : "s"} shown`
      : "";
    results.innerHTML = query || !searchInput.hasAttribute("data-require-query")
      ? renderDemoList(filteredDemos)
      : "";
    bindInternalLinks();
  };
  searchInput.addEventListener("input", updateResults);

  if (searchInput.hasAttribute("data-require-query")) {
    const query = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (query) {
      searchInput.value = query;
      updateResults();
    }
  }
}

function filterDemos(query: string) {
  return demos.filter((demo) => {
    const searchable = `${demo.title} ${demo.category} ${demo.additionalCategories?.join(" ") ?? ""} ${demo.tags.join(" ")}`.toLowerCase();
    if (!query) return true;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escapedQuery}([^a-z0-9]|$)`, "i").test(searchable);
  });
}

function bindMailtoForm() {
  const form = app.querySelector<HTMLFormElement>("[data-mailto-form]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const mailto = new URL("mailto:hello@academo.org");
    mailto.searchParams.set("subject", "Academo contact form message");
    mailto.searchParams.set("body", body);

    window.location.href = mailto.toString();
  });
}

type DemoMount = (root: HTMLElement) => void;
type DemoLoader = () => Promise<DemoMount>;

const demoLoaders: Record<string, DemoLoader> = {
  "[data-logic-gate-simulator]": () => import("./logicGateSimulator").then((module) => module.mountLogicGateSimulator),
  "[data-vector-plotter]": () => import("./vectorPlotter").then((module) => module.mountVectorPlotter),
  "[data-tet-keyboard]": () => import("./tetKeyboard").then((module) => module.mountTetKeyboard),
  "[data-virtual-oscilloscope]": () => import("./virtualOscilloscope").then((module) => module.mountVirtualOscilloscope),
  "[data-amplitude-modulation]": () => import("./amplitudeModulation").then((module) => module.mountAmplitudeModulation),
  "[data-rot13]": () => import("./rot13").then((module) => module.mountRot13),
  "[data-hypocycloid]": () => import("./hypocycloid").then((module) => module.mountHypocycloid),
  "[data-monte-carlo-pi]": () => import("./monteCarloPi").then((module) => module.mountMonteCarloPi),
  "[data-azimuth-calculator]": () => import("./azimuthCalculator").then((module) => module.mountAzimuthCalculator),
  "[data-colour-temperature]": () => import("./colourTemperature").then((module) => module.mountColourTemperature),
  "[data-electric-field]": () => import("./electricField").then((module) => module.mountElectricField),
  "[data-simple-pendulum]": () => import("./simplePendulum").then((module) => module.mountSimplePendulum),
  "[data-geodesics]": () => import("./geodesics").then((module) => module.mountGeodesics),
  "[data-capital-cities]": () => import("./capitalCities").then((module) => module.mountCapitalCities),
  "[data-us-states]": () => import("./usStatesFlashcards").then((module) => module.mountUsStatesFlashcards),
  "[data-flags-of-europe]": () => import("./flagsOfEurope").then((module) => module.mountFlagsOfEurope)
};

async function mountCurrentDemo() {
  const entry = Object.entries(demoLoaders).find(([selector]) => app.querySelector(selector));
  if (entry) {
    const [selector, load] = entry;
    const root = app.querySelector<HTMLElement>(selector)!;
    const mount = await load();
    if (root.isConnected) mount(root);
  }

  if (app.querySelector("[data-mathjax]")) {
    const { renderMathJax } = await import("./mathJaxRenderer");
    if (app.isConnected) {
      await renderMathJax(app).catch((error) => console.error("Could not render MathJax formulas.", error));
    }
  }
}

function scrollToHash() {
  if (!window.location.hash) {
    window.scrollTo({ top: 0 });
    return;
  }

  window.requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView();
  });
}

window.addEventListener("popstate", renderRoute);
preloadDemoThumbnails();
renderRoute();
