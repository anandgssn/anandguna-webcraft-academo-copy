import {
  renderAboutPage,
  renderContactPage,
  renderCategoryPage,
  renderDemoList,
  renderDemoDetailPage,
  renderDemosPage,
  renderHomePage,
  renderNotFoundPage,
  renderSearchPage
} from "./components";
import { categoryRoutes, demos } from "./demoData";
import { mountFlagsOfEurope, preloadFlagsOfEuropeAssets } from "./flagsOfEurope";
import { mountLogicGateSimulator } from "./logicGateSimulator";
import { renderMathJax } from "./mathJaxRenderer";
import { mountTetKeyboard } from "./tetKeyboard";
import { mountVirtualOscilloscope } from "./virtualOscilloscope";
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

function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function renderRoute() {
  const pathname = normalizePath(window.location.pathname);

  if (pathname === "/") {
    app.innerHTML = renderHomePage(demos);
  } else if (pathname === "/about") {
    app.innerHTML = renderAboutPage();
  } else if (pathname === "/contact") {
    app.innerHTML = renderContactPage();
  } else if (pathname === "/search") {
    app.innerHTML = renderSearchPage(demos);
  } else if (pathname === "/demos") {
    app.innerHTML = renderDemosPage(demos);
  } else if (pathname === "/flashcards/flags-of-europe") {
    const demo = demos.find((item) => item.slug === "flags-of-europe");
    app.innerHTML = demo ? renderDemoDetailPage(demo) : renderNotFoundPage();
  } else if (pathname.startsWith("/demos/")) {
    const slug = pathname.replace("/demos/", "");
    const demo = demos.find((item) => item.slug === slug);
    app.innerHTML = demo ? renderDemoDetailPage(demo) : renderNotFoundPage();
  } else {
    const category = categoryRoutes.find((route) => normalizePath(route.path) === pathname);
    app.innerHTML = category
      ? renderCategoryPage(
          category,
          demos.filter((demo) => demo.category === category.label)
        )
      : renderNotFoundPage();
  }

  bindInternalLinks();
  bindDemoSearch();
  bindMailtoForm();
  bindLogicGateSimulator();
  bindVectorPlotter();
  bindTetKeyboard();
  bindVirtualOscilloscope();
  bindFlagsOfEurope();
  bindMathJax();
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

  searchInput.addEventListener("input", () => {
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
  });
}

function filterDemos(query: string) {
  return demos.filter((demo) => {
    const searchable = `${demo.title} ${demo.category} ${demo.tags.join(" ")} ${demo.description}`.toLowerCase();
    return !query || searchable.includes(query);
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

function bindLogicGateSimulator() {
  const simulator = app.querySelector<HTMLElement>("[data-logic-gate-simulator]");

  if (simulator) {
    mountLogicGateSimulator(simulator);
  }
}

async function bindVectorPlotter() {
  const plotter = app.querySelector<HTMLElement>("[data-vector-plotter]");

  if (plotter) {
    const { mountVectorPlotter } = await import("./vectorPlotter");
    if (!plotter.isConnected) {
      return;
    }
    mountVectorPlotter(plotter);
  }
}

function bindTetKeyboard() {
  const keyboard = app.querySelector<HTMLElement>("[data-tet-keyboard]");

  if (keyboard) {
    mountTetKeyboard(keyboard);
  }
}

function bindVirtualOscilloscope() {
  const oscilloscope = app.querySelector<HTMLElement>("[data-virtual-oscilloscope]");

  if (oscilloscope) {
    mountVirtualOscilloscope(oscilloscope);
  }
}

function bindFlagsOfEurope() {
  const flashcards = app.querySelector<HTMLElement>("[data-flags-of-europe]");

  if (flashcards) {
    mountFlagsOfEurope(flashcards);
  }
}

function bindMathJax() {
  void renderMathJax(app).catch((error) => {
    console.error("Could not render MathJax formulas.", error);
  });
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
preloadFlagsOfEuropeAssets();
renderRoute();
