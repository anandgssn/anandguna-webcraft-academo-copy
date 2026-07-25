import {
  renderAboutPage,
  renderCategoryPage,
  renderContactPage,
  renderCookiePolicyPage,
  renderDemosPage,
  renderHomePage,
  renderNotFoundPage,
  renderPrivacyPolicyPage,
  renderSearchPage,
  renderSubmitIdeaPage,
  renderSubcategoryPage
} from "./components";
import { renderDemoDetailPage } from "./demoDetailPage";
import { categoryRoutes, demos, isDemoInCategory, type DemoItem } from "./demoData";

type Route = {
  matches: (pathname: string) => boolean;
  render: (pathname: string) => string;
};

type Subcategory = {
  title: string;
  slugs: string[];
  parentPath: string;
  parentTitle: string;
  description?: string | string[];
};

export function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function demosBySlug(slugs: string[]) {
  return slugs
    .map((slug) => demos.find((demo) => demo.slug === slug))
    .filter((demo): demo is DemoItem => Boolean(demo));
}

function renderDemo(pathname: string) {
  const slug = pathname.split("/").at(-1);
  const demo = demos.find((item) => item.slug === slug);
  return demo ? renderDemoDetailPage(demo) : renderNotFoundPage();
}

const physicsSubcategories: Record<string, Subcategory> = {
  "/physics/astronomy": {
    title: "Astronomy",
    slugs: ["azimuth-calculator"],
    parentPath: "/physics",
    parentTitle: "Physics",
    description: "The night sky has been fascinating humans for millennia. The invention of the telescope in the 17th century accelerated the rate of learning, and the giant land and space based telescopes we have today have enabled us to study the universe in incredible detail."
  },
  "/physics/classical-mechanics": { title: "Classical Mechanics", slugs: ["simple-pendulum"], parentPath: "/physics", parentTitle: "Physics" },
  "/physics/electricity": { title: "Electricity", slugs: ["electric-field-line-simulator"], parentPath: "/physics", parentTitle: "Physics" },
  "/physics/light": {
    title: "Light",
    slugs: ["colour-temperature-relationship"],
    parentPath: "/physics",
    parentTitle: "Physics",
    description: [
      "Light has some truly incredible properties. The photons from which it's made are both particles and waves at the same time. And if that wasn't enough for you, each photon always travels towards you at the speed of light, no matter how fast or which direction you're moving in.",
      "This collection of demos should give you an insight into how light behaves. Keep them in mind next time you flick on a light switch."
    ]
  },
  "/physics/sound": { title: "Sound", slugs: ["virtual-oscilloscope"], parentPath: "/physics", parentTitle: "Physics" },
  "/physics/waves": { title: "Waves", slugs: ["amplitude-modulation"], parentPath: "/physics", parentTitle: "Physics" }
};

const exactRoutes: Record<string, () => string> = {
  "/": () => renderHomePage(demos),
  "/about": renderAboutPage,
  "/contact": renderContactPage,
  "/submit-an-idea": renderSubmitIdeaPage,
  "/privacy-policy": renderPrivacyPolicyPage,
  "/cookie-policy": renderCookiePolicyPage,
  "/search": () => renderSearchPage(demos),
  "/demos": () => renderDemosPage(demos),
  "/music/pitch": () => renderSubcategoryPage("Pitch", demos.filter((demo) => demo.tags.includes("pitch")), "/music", "Music"),
  "/maths/geometry": () => renderSubcategoryPage("Geometry", demosBySlug(["3d-vector-plotter", "geodesics", "hypocycloid"]), "/maths", "Maths", "Geometry is an ancient branch of maths and concerns everything to do with shapes."),
  "/maths/numbers": () => renderSubcategoryPage("Numbers", demos.filter((demo) => demo.tags.includes("numbers")), "/maths", "Maths"),
  "/maths/statistics": () => renderSubcategoryPage("Statistics", demos.filter((demo) => demo.tags.includes("statistics")), "/maths", "Maths"),
  "/geography/maps": () => renderSubcategoryPage("Maps", demosBySlug(["azimuth-calculator", "capital-cities-map", "geodesics"]), "/geography", "Geography"),
  "/geography/human": () => renderSubcategoryPage("Human Geography", demos.filter((demo) => demo.tags.includes("human geography")), "/geography", "Geography")
};

const routes: Route[] = [
  {
    matches: (pathname) => Boolean(exactRoutes[pathname]),
    render: (pathname) => exactRoutes[pathname]()
  },
  {
    matches: (pathname) => Boolean(physicsSubcategories[pathname]),
    render: (pathname) => {
      const route = physicsSubcategories[pathname];
      return renderSubcategoryPage(route.title, demosBySlug(route.slugs), route.parentPath, route.parentTitle, route.description);
    }
  },
  {
    matches: (pathname) => pathname.startsWith("/engineering/"),
    render: (pathname) => {
      const labels = { computing: "Computing", electronics: "Electronics", signals: "Signals" } as const;
      const label = labels[pathname.replace("/engineering/", "") as keyof typeof labels];
      return label
        ? renderSubcategoryPage(label, demos.filter((demo) => demo.engineeringSubcategories?.includes(label)))
        : renderNotFoundPage();
    }
  },
  {
    matches: (pathname) => pathname.startsWith("/demos/") || pathname.startsWith("/flashcards/"),
    render: renderDemo
  },
  {
    matches: (pathname) => categoryRoutes.some((route) => normalizePath(route.path) === pathname),
    render: (pathname) => {
      const category = categoryRoutes.find((route) => normalizePath(route.path) === pathname)!;
      const categoryDemos = demos
        .filter((demo) => isDemoInCategory(demo, category.label))
        .sort((first, second) => first.title.localeCompare(second.title));
      return renderCategoryPage(category, categoryDemos);
    }
  }
];

export function renderPath(pathname: string) {
  const normalizedPath = normalizePath(pathname);
  return routes.find((route) => route.matches(normalizedPath))?.render(normalizedPath) ?? renderNotFoundPage();
}
