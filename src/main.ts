import {
  renderAboutPage,
  renderContactPage,
  renderCategoryPage,
  renderDemoList,
  renderDemoDetailPage,
  renderDemosPage,
  renderSubcategoryPage,
  renderHomePage,
  renderNotFoundPage,
  renderSearchPage,
  renderSubmitIdeaPage,
  renderPrivacyPolicyPage,
  renderCookiePolicyPage
} from "./components";
import { categoryRoutes, demos, isDemoInCategory } from "./demoData";
import { mountFlagsOfEurope } from "./flagsOfEurope";
import { mountLogicGateSimulator } from "./logicGateSimulator";
import { renderMathJax } from "./mathJaxRenderer";
import { mountTetKeyboard } from "./tetKeyboard";
import { mountVirtualOscilloscope } from "./virtualOscilloscope";
import { mountAmplitudeModulation } from "./amplitudeModulation";
import { mountRot13 } from "./rot13";
import { mountHypocycloid } from "./hypocycloid";
import { mountMonteCarloPi } from "./monteCarloPi";
import { mountAzimuthCalculator } from "./azimuthCalculator";
import { mountColourTemperature } from "./colourTemperature";
import { mountElectricField } from "./electricField";
import { mountSimplePendulum } from "./simplePendulum";
import { mountGeodesics } from "./geodesics";
import { mountCapitalCities } from "./capitalCities";
import { mountUsStatesFlashcards } from "./usStatesFlashcards";
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

function demosForCategory(category: (typeof categoryRoutes)[number]["label"]) {
  return demos
    .filter((demo) => isDemoInCategory(demo, category))
    .sort((first, second) => first.title.localeCompare(second.title));
}

function renderRoute() {
  const pathname = normalizePath(window.location.pathname);

  if (pathname === "/") {
    app.innerHTML = renderHomePage(demos);
  } else if (pathname === "/about") {
    app.innerHTML = renderAboutPage();
  } else if (pathname === "/contact") {
    app.innerHTML = renderContactPage();
  } else if (pathname === "/submit-an-idea") {
    app.innerHTML = renderSubmitIdeaPage();
  } else if (pathname === "/privacy-policy") {
    app.innerHTML = renderPrivacyPolicyPage();
  } else if (pathname === "/cookie-policy") {
    app.innerHTML = renderCookiePolicyPage();
  } else if (pathname === "/search") {
    app.innerHTML = renderSearchPage(demos);
  } else if (pathname === "/demos") {
    app.innerHTML = renderDemosPage(demos);
  } else if (pathname === "/music/pitch") {
    app.innerHTML = renderSubcategoryPage(
      "Pitch",
      demos.filter((demo) => demo.tags.includes("pitch")),
      "/music",
      "Music"
    );
  } else if (pathname === "/maths/geometry") {
    const geometrySlugs = ["3d-vector-plotter", "geodesics", "hypocycloid"];
    app.innerHTML = renderSubcategoryPage(
      "Geometry",
      geometrySlugs
        .map((slug) => demos.find((demo) => demo.slug === slug))
        .filter((demo): demo is (typeof demos)[number] => Boolean(demo)),
      "/maths",
      "Maths",
      "Geometry is an ancient branch of maths and concerns everything to do with shapes."
    );
  } else if (pathname === "/maths/numbers" || pathname === "/maths/statistics") {
    const subcategory = pathname.endsWith("/numbers") ? "Numbers" : "Statistics";
    app.innerHTML = renderSubcategoryPage(
      subcategory,
      demos.filter((demo) => demo.tags.includes(subcategory.toLowerCase())),
      "/maths",
      "Maths"
    );
  } else if (pathname.startsWith("/physics/")) {
    const physicsSubcategories: Record<string, { title: string; slugs: string[]; description?: string | string[] }> = {
      astronomy: {
        title: "Astronomy",
        slugs: ["azimuth-calculator"],
        description: "The night sky has been fascinating humans for millennia. The invention of the telescope in the 17th century accelerated the rate of learning, and the giant land and space based telescopes we have today have enabled us to study the universe in incredible detail."
      },
      "classical-mechanics": { title: "Classical Mechanics", slugs: ["simple-pendulum"] },
      electricity: { title: "Electricity", slugs: ["electric-field-line-simulator"] },
      light: {
        title: "Light",
        slugs: ["colour-temperature-relationship"],
        description: [
          "Light has some truly incredible properties. The photons from which it's made are both particles and waves at the same time. And if that wasn't enough for you, each photon always travels towards you at the speed of light, no matter how fast or which direction you're moving in.",
          "This collection of demos should give you an insight into how light behaves. Keep them in mind next time you flick on a light switch."
        ]
      },
      sound: { title: "Sound", slugs: ["virtual-oscilloscope"] },
      waves: { title: "Waves", slugs: ["amplitude-modulation"] }
    };
    const subcategory = physicsSubcategories[pathname.replace("/physics/", "")];
    app.innerHTML = subcategory
      ? renderSubcategoryPage(
          subcategory.title,
          demos.filter((demo) => subcategory.slugs.includes(demo.slug)),
          "/physics",
          "Physics",
          subcategory.description
        )
      : renderNotFoundPage();
  } else if (pathname === "/geography/maps") {
    const mapDemoSlugs = ["azimuth-calculator", "capital-cities-map", "geodesics"];
    const mapDemos = mapDemoSlugs
      .map((slug) => demos.find((demo) => demo.slug === slug))
      .filter((demo): demo is (typeof demos)[number] => Boolean(demo));
    app.innerHTML = renderSubcategoryPage("Maps", mapDemos, "/geography", "Geography");
  } else if (pathname === "/geography/human") {
    app.innerHTML = renderSubcategoryPage("Human Geography", demos.filter((demo) => demo.tags.includes("human geography")), "/geography", "Geography");
  } else if (pathname.startsWith("/engineering/")) {
    const name = pathname.replace("/engineering/", "");
    const labels: Record<string, "Computing" | "Electronics" | "Signals"> = {
      computing: "Computing",
      electronics: "Electronics",
      signals: "Signals"
    };
    const label = labels[name];
    app.innerHTML = label
      ? renderSubcategoryPage(
          label,
          demos.filter((demo) => demo.engineeringSubcategories?.includes(label))
        )
      : renderNotFoundPage();
  } else if (pathname === "/flashcards/flags-of-europe" || pathname === "/flashcards/us-states") {
    const slug = pathname.replace("/flashcards/", "");
    const demo = demos.find((item) => item.slug === slug);
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
          demosForCategory(category.label)
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
  bindAmplitudeModulation();
  bindRot13();
  bindHypocycloid();
  bindMonteCarloPi();
  bindAzimuthCalculator();
  bindColourTemperature();
  bindElectricField();
  bindSimplePendulum();
  bindGeodesics();
  bindCapitalCities();
  bindUsStatesFlashcards();
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

function bindAmplitudeModulation() {
  const demo = app.querySelector<HTMLElement>("[data-amplitude-modulation]");
  if (demo) mountAmplitudeModulation(demo);
}

function bindRot13() {
  const demo = app.querySelector<HTMLElement>("[data-rot13]");
  if (demo) mountRot13(demo);
}

function bindHypocycloid() {
  const demo = app.querySelector<HTMLElement>("[data-hypocycloid]");
  if (demo) mountHypocycloid(demo);
}

function bindMonteCarloPi() {
  const demo = app.querySelector<HTMLElement>("[data-monte-carlo-pi]");
  if (demo) mountMonteCarloPi(demo);
}

function bindAzimuthCalculator() {
  const demo = app.querySelector<HTMLElement>("[data-azimuth-calculator]");
  if (demo) mountAzimuthCalculator(demo);
}

function bindColourTemperature() {
  const demo = app.querySelector<HTMLElement>("[data-colour-temperature]");
  if (demo) mountColourTemperature(demo);
}

function bindElectricField() {
  const demo = app.querySelector<HTMLElement>("[data-electric-field]");
  if (demo) mountElectricField(demo);
}

function bindSimplePendulum() {
  const demo = app.querySelector<HTMLElement>("[data-simple-pendulum]");
  if (demo) mountSimplePendulum(demo);
}

function bindGeodesics() {
  const demo = app.querySelector<HTMLElement>("[data-geodesics]");
  if (demo) mountGeodesics(demo);
}

function bindCapitalCities() {
  const demo = app.querySelector<HTMLElement>("[data-capital-cities]");
  if (demo) mountCapitalCities(demo);
}

function bindUsStatesFlashcards() {
  const deck = app.querySelector<HTMLElement>("[data-us-states]");
  if (!deck) return;
  mountUsStatesFlashcards(deck);
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
renderRoute();
