import {
  categoryRoutes,
  type CategoryRoute,
  type DemoItem
} from "./demoData";

type LinkItem = {
  label: string;
  href: string;
  icon?: "flashcards";
};

const primaryLinks: LinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
  { label: "Contact", href: "/contact" },
  { label: "Submit an idea", href: "/submit-an-idea" }
];

const secondaryLinks: LinkItem[] = [
  { label: "All", href: "/demos" },
  ...categoryRoutes.map((category) => ({
    label: category.label,
    href: category.path,
    icon: category.label === "Flashcards" ? ("flashcards" as const) : undefined
  }))
];

const featuredLogos = [
  {
    name: "HTML5 Weekly",
    image: "/assets/logos/html5-weekly.png"
  },
  {
    name: "Journal of Chemical Education",
    image: "/assets/logos/jce.png"
  },
  {
    name: "OER Commons",
    image: "/assets/logos/oer.png"
  },
  {
    name: "Science in School",
    image: "/assets/logos/science-in-school.png"
  }
];

function getDemoPath(demo: DemoItem) {
  return demo.category === "Flashcards" ? `/flashcards/${demo.slug}` : `/demos/${demo.slug}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderLinks(links: LinkItem[], currentPath?: string) {
  return links
    .map((link) => {
      const icon = link.icon === "flashcards"
        ? '<span class="material-symbols-outlined nav-icon nav-icon--flashcards" aria-hidden="true">auto_awesome_motion</span>'
        : "";
      const isCurrent = currentPath === link.href;
      const currentClass = isCurrent ? ' class="current"' : "";
      const currentAttribute = isCurrent ? ' aria-current="page"' : "";
      return `<a href="${link.href}" data-link${currentClass}${currentAttribute}>${icon}${escapeHtml(link.label)}</a>`;
    })
    .join("");
}

function renderPageShell(content: string, currentPath = "") {
  return `
    ${renderHeader(currentPath)}
    <div class="wrapper" id="home">
      ${renderSponsorBand()}
      <main class="main">
        ${content}
      </main>
    </div>
    ${renderFooter()}
  `;
}

export function renderHeader(currentPath = "") {
  return `
    <header class="site-header">
      <div class="header-upper">
        <div class="header-inner">
          <a class="logo" href="/" data-link aria-label="Academo home">
            <img class="logo-mark" src="/assets/logos/academo-mark.png" alt="" aria-hidden="true">Academo
          </a>
          <nav class="primary-nav" aria-label="Primary navigation">
            ${renderLinks(primaryLinks, currentPath)}
          </nav>
        </div>
      </div>
      <div class="header-lower">
        <nav class="secondary-nav" aria-label="Demo categories">
          ${renderLinks(secondaryLinks, currentPath)}
        </nav>
      </div>
    </header>
  `;
}

export function renderSponsorBand() {
  return `<div class="sponsor-wrapper" aria-hidden="true"></div>`;
}

export function renderTagLinks() {
  return `
    <p class="tags" aria-label="Subject links">
      ${categoryRoutes
        .map((category) => `<a href="${category.path}" data-link>${category.label}</a>`)
        .join("")}
    </p>
  `;
}

export function renderSectionTitle(id: string, title: string, copy?: string) {
  return `
    <div class="section-title">
      <h2 id="${id}">${escapeHtml(title)}</h2>
      ${copy ? `<p>${escapeHtml(copy)}</p>` : ""}
    </div>
  `;
}

type SearchPanelOptions = {
  placeholder?: string;
  showLabel?: boolean;
  requireQuery?: boolean;
};

export function renderSearchPanel({
  placeholder = "Try audio, flags, vectors, logic",
  showLabel = true,
  requireQuery = false
}: SearchPanelOptions = {}) {
  return `
    <form class="search-panel" role="search" id="search">
      ${showLabel ? '<label for="demo-search">Search demos</label>' : ""}
      <input id="demo-search" type="search" placeholder="${escapeHtml(placeholder)}" autocomplete="off" aria-label="Search demos"${requireQuery ? " data-require-query" : ""}>
    </form>
  `;
}

type SearchResultsOptions = {
  showInitialState?: boolean;
  useHeading?: boolean;
};

export function renderSearchResults(
  demos: DemoItem[],
  { showInitialState = true, useHeading = false }: SearchResultsOptions = {}
) {
  const initialLabel = showInitialState
    ? `${demos.length} demo${demos.length === 1 ? "" : "s"} shown`
    : "";

  return `
    ${useHeading
      ? `<h2 class="result-count search-results-title" data-result-heading aria-live="polite">${showInitialState ? "Search results" : ""}</h2>`
      : `<p class="result-count" aria-live="polite">${initialLabel}</p>`}
    <div data-demo-results>
      ${showInitialState ? renderDemoList(demos) : ""}
    </div>
  `;
}

export function renderDemoCard(demo: DemoItem) {
  const title = escapeHtml(demo.title);
  const href = getDemoPath(demo);

  return `
    <li>
      <a class="thumbnail" href="${href}" data-link>
        <img src="${demo.thumbnail}" alt="${title} demo thumbnail" width="260" height="170" loading="eager" decoding="async">
        <p class="thumbnail-title">${title}</p>
      </a>
    </li>
  `;
}

export function renderDemoList(demos: DemoItem[]) {
  if (demos.length === 0) {
    return `
      <ul class="thumbnails" aria-live="polite">
        <li class="empty-result">
          <p>No matching demos. Try a broader subject or clear the search field.</p>
        </li>
      </ul>
    `;
  }

  return `<ul class="thumbnails" aria-live="polite">${demos.map((demo) => renderDemoCard(demo)).join("")}</ul>`;
}

export function renderIntroSection() {
  return `
    <section class="intro" aria-labelledby="intro-title">
      <h1 id="intro-title">Academo</h1>
      <p>
        A collection of interactive, educational demos and tools.<br>
        It's completely free, and there's no need to register or sign-in.
      </p>
      <p>
        Visit the <a href="/demos" data-link>demos page</a> to view interactive tools, or click a subject below
        to browse a specific category.
      </p>
      ${renderTagLinks()}
    </section>
  `;
}

export function renderHomePage(demos: DemoItem[]) {
  const popularSlugs = ["virtual-oscilloscope", "3d-vector-plotter", "logic-gate-simulator"];
  const popularDemos = popularSlugs
    .map((slug) => demos.find((demo) => demo.slug === slug))
    .filter((demo): demo is DemoItem => Boolean(demo));
  const sections = [
    renderIntroSection(),
    `
      <section class="demo-directory home-popular" aria-labelledby="popular-title">
        <h2 id="popular-title">
          Some of our most popular demos.<br>
          Visit the demos page to <a href="/demos" data-link>browse all our demos</a>.
        </h2>
        ${renderDemoList(popularDemos)}
      </section>
    `,
    renderMentionsSection()
  ].join('<hr class="hr-large">');

  return renderPageShell(sections, "/");
}

export function renderDemosPage(demos: DemoItem[]) {
  const alphabeticalDemos = demos
    .filter((demo) => demo.category !== "Flashcards")
    .sort((first, second) => first.title.localeCompare(second.title));
  const alphabeticalFlashcards = demos
    .filter((demo) => demo.category === "Flashcards")
    .sort((first, second) => first.title.localeCompare(second.title));
  const content = `
    <section id="demos" class="demo-directory" aria-labelledby="demos-title">
      <h1 id="demos-title">All demos</h1>
      <hr>
      <div class="subcategory-description">
        <p>
          Below is a list of all the demos currently available on academo.org, arranged in alphabetical order. If you would like to browse demos by a specific subject,
          please click one of the category links to be taken to the page for your chosen category. We are always adding new demos, so please check back often to see the latest updates.
        </p>
        <p class="tags demos-category-links" aria-label="Demo categories">
          ${categoryRoutes.filter((category) => category.label !== "Flashcards").map((category) => `<a href="${category.path}" data-link>${category.label}</a>`).join("")}
        </p>
      </div>
      <hr>
      ${renderDemoList(alphabeticalDemos)}
      <hr class="demos-flashcards-divider">
      <h3 class="demos-flashcards-title">Flashcards</h3>
      ${renderDemoList(alphabeticalFlashcards)}
    </section>
  `;

  return renderPageShell(content, "/demos");
}

export function renderSearchPage(demos: DemoItem[]) {
  const content = `
    <section class="search-page" aria-labelledby="search-title">
      <h1 id="search-title">What would you like to explore?</h1>
      <hr>
      ${renderSearchPanel({ placeholder: "Type here...", showLabel: false, requireQuery: true })}
      ${renderSearchResults(demos, { showInitialState: false, useHeading: true })}
    </section>
  `;

  return renderPageShell(content, "/search");
}

export function renderAboutPage() {
  const content = `
    <section class="about" aria-labelledby="about-title">
      <h1 id="about-title">About Academo</h1>
      <hr>
      <p class="lead">Academo is an online hub of interactive, educational demonstrations. It's free, open source, and available to all.</p>
      <p>All our demos are built using HTML and Javascript. This means they can take advantage of all the latest web technology (including touch recognition and audio input/output) and generally, they should work on all varieties of tablets, mobiles, PCs and Macs without having to install any additional plugins or software.</p>
      <p>And because they're open source, the community can adjust, edit, or even submit completely new demos.</p>
    </section>
  `;

  return renderPageShell(content, "/about");
}

export function renderContactPage() {
  const content = `
    <section class="contact" aria-labelledby="contact-title">
      <h1 id="contact-title">Get in touch</h1>
      <p>
        You can find Academo on Twitter at @AcademoOrg, and on Facebook at academo.org.
        Alternatively, if you'd like to send us a message, you can use the form below.
      </p>

      <form class="contact-form" data-mailto-form>
        <header class="contact-form-header">
          <h2>Contact Us</h2>
        </header>

        <div class="contact-field contact-field--medium">
          <label for="contact-name">Name <span class="required-mark" aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" type="text" autocomplete="name" required>
        </div>

        <div class="contact-field contact-field--medium">
          <label for="contact-email">Email <span class="required-mark" aria-hidden="true">*</span></label>
          <input id="contact-email" name="email" type="email" autocomplete="email" required>
        </div>

        <div class="contact-field">
          <label for="contact-message">Your message <span class="required-mark" aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" rows="7" required></textarea>
        </div>

        <button type="submit">Submit</button>
      </form>
    </section>
  `;

  return renderPageShell(content, "/contact");
}

export function renderSubmitIdeaPage() {
  return renderPageShell(`
    <section class="about submit-idea" aria-labelledby="submit-idea-title">
      <h1 id="submit-idea-title">Submit an idea</h1>
      <hr>
      <p>Are you a teacher who would like an interactive demo to help illustrate a point? Are you a student who needs help understanding a topic? Do you have an idea for a new demo or a new feature for an existing one?</p>
      <p>If so, please <a href="mailto:hello@academo.org?subject=Academo%20demo%20idea">send us your idea by email</a>. Please include the topic, what the demo should help explain, and any interaction you think would make it useful.</p>
    </section>
  `, "/submit-an-idea");
}

export function renderPrivacyPolicyPage() {
  return renderPageShell(`<article class="policy-page"><h1>Privacy Policy</h1><p>Last updated: July 2nd, 2024</p>
    <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
    <p>Academo does not use advertising services or Google Analytics. It loads OpenStreetMap tiles on the map demos and may open your email application when you choose a mailto link.</p><hr>
    <p>We use Your Personal Data only where needed to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
    <h1>Interpretation and Definitions</h1><h2>Interpretation</h2><p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
    <h2>Definitions</h2><p>For the purposes of this Privacy Policy:</p><ul>
      <li><p><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our") refers to Academo.</p></li>
      <li><p><strong>Cookies</strong> are small files placed on Your computer, mobile device or other device by a website.</p></li><li><p><strong>Country</strong> refers to the United Kingdom.</p></li>
      <li><p><strong>Device</strong> means any device that can access the Service, such as a computer, cellphone or digital tablet.</p></li><li><p><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</p></li>
      <li><p><strong>Service</strong> refers to the Website.</p></li><li><p><strong>Website</strong> refers to Academo.</p></li><li><p><strong>You</strong> means the individual accessing or using the Service.</p></li>
    </ul>
    <h1>Collecting and Using Your Personal Data</h1><h2>Types of Data Collected</h2><h3>Usage Data</h3><p>Academo does not operate its own analytics or advertising system. Hosting infrastructure and OpenStreetMap tile servers may receive standard request information such as IP address, browser type, requested URL, and request time.</p>
    <h3>Tracking Technologies and Cookies</h3><p>The Website does not intentionally set advertising or analytics cookies. Browser storage is used only where an interactive demo requires local state, such as flashcard progress.</p>
    <h2>Use of Your Personal Data</h2><p>The Company may use Personal Data to provide and maintain the Service, respond when You contact Us, comply with legal obligations, and protect the security of the Service.</p>
    <h2>Retention of Your Personal Data</h2><p>The Company will retain Personal Data only for as long as necessary for the purposes set out in this Privacy Policy and to comply with applicable legal obligations.</p>
    <h1>Links to Other Websites</h1><p>Our Service may contain links to websites not operated by Us. We strongly advise You to review the Privacy Policy of every site You visit. We assume no responsibility for third-party content, privacy policies or practices.</p>
    <h1>Changes to this Privacy Policy</h1><p>We may update Our Privacy Policy from time to time by posting the new Privacy Policy on this page. Changes are effective when posted.</p>
    <h1>Contact Us</h1><p>If you have questions about this Privacy Policy, visit our <a href="/contact" data-link>contact page</a>.</p></article>`);
}

export function renderCookiePolicyPage() {
  return renderPageShell(`<article class="policy-page cookie-policy"><h1>Cookie Policy</h1><p>Effective Date: 13-Mar-2024<br>Last Updated: 13-Mar-2024</p>
    <div class="policy-spacer" aria-hidden="true"></div>
    <h5>What are cookies?</h5><div class="cookie-policy-p"><p>This Cookie Policy explains what cookies are and how we use them, the types of cookies we use i.e, the information we collect using cookies and how that information is used, and how to manage the cookie settings.</p><p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement.</p></div>
    <div class="policy-spacer" aria-hidden="true"></div>
    <h5>How do we use cookies?</h5><div class="cookie-policy-p"><p>As most of the online services, our website may use first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.</p><p>Academo does not intentionally set advertising or analytics cookies. Some interactive demos use browser storage to preserve local state. OpenStreetMap tiles are requested from a third-party service and are subject to that service's privacy practices.</p></div>
    <div class="policy-spacer" aria-hidden="true"></div>
    <h5>Manage cookie preferences</h5><p>Different browsers provide different methods to block and delete cookies used by websites. You can change the settings of your browser to block/delete the cookies. Listed below are the links to the support documents on how to manage and delete cookies from the major web browsers.</p>
    <p>Chrome: <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noreferrer">https://support.google.com/accounts/answer/32050</a></p>
    <p>Safari: <a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">https://support.apple.com/en-in/guide/safari/sfri11471/mac</a></p>
    <p>Firefox: <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&amp;redirectlocale=en-US" target="_blank" rel="noreferrer">https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&amp;redirectlocale=en-US</a></p>
    <p>Internet Explorer: <a href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc" target="_blank" rel="noreferrer">https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc</a></p>
    <p>If you are using any other web browser, please visit your browser’s official support documents.</p>
    <div class="policy-spacer" aria-hidden="true"></div></article>`);
}

export function renderCategoryPage(category: CategoryRoute, demos: DemoItem[]) {
  const categoryFilters = category.label === "Engineering"
    ? `
      <p>You can filter these demos further by clicking on one of the following subcategories:</p>
      <p class="tags category-filters" aria-label="Engineering subcategories">
        <a href="/engineering/computing" data-link>Computing</a>
        <a href="/engineering/electronics" data-link>Electronics</a>
        <a href="/engineering/signals" data-link>Signals</a>
      </p>
    `
    : category.label === "Music"
      ? `
        <p>You can filter these demos further by clicking on one of the following subcategories:</p>
        <p class="tags category-filters" aria-label="Music subcategories">
          <a href="/music/pitch" data-link>Pitch</a>
        </p>
      `
      : category.label === "Maths"
        ? `
          <p>You can filter these demos further by clicking on one of the following subcategories:</p>
          <p class="tags category-filters" aria-label="Maths subcategories">
            <a href="/maths/geometry" data-link>Geometry</a>
            <a href="/maths/numbers" data-link>Numbers</a>
            <a href="/maths/statistics" data-link>Statistics</a>
          </p>
        `
      : category.label === "Physics"
        ? `
          <p>You can filter these demos further by clicking on one of the following subcategories:</p>
          <p class="tags category-filters" aria-label="Physics subcategories">
            <a href="/physics/astronomy" data-link>Astronomy</a>
            <a href="/physics/classical-mechanics" data-link>Classical Mechanics</a>
            <a href="/physics/electricity" data-link>Electricity</a>
            <a href="/physics/light" data-link>Light</a>
            <a href="/physics/sound" data-link>Sound</a>
            <a href="/physics/waves" data-link>Waves</a>
          </p>
        `
      : category.label === "Geography"
        ? `<p>You can filter these demos further by clicking on one of the following subcategories:</p><p class="tags category-filters" aria-label="Geography subcategories"><a href="/geography/human" data-link>Human Geography</a><a href="/geography/maps" data-link>Maps</a></p>`
      : "";
  const content = `
    <section class="demo-directory" aria-labelledby="category-title">
      <h1 id="category-title">${category.title ?? category.label}</h1>
      <hr>
      <div class="subcategory-description category-description">
        <p>${category.description}</p>
        ${categoryFilters}
      </div>
      <hr>
      ${renderDemoList(demos)}
    </section>
  `;

  return renderPageShell(content, category.path);
}

export function renderSubcategoryPage(
  title: string,
  demos: DemoItem[],
  parentPath = "/engineering",
  parentTitle = "Engineering",
  description: string | string[] = ""
) {
  const descriptionParagraphs = (Array.isArray(description) ? description : [description])
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const content = `
    <section class="demo-directory" aria-labelledby="subcategory-title">
      <h1 id="subcategory-title">${escapeHtml(title)}</h1>
      <hr>
      <div class="category-description">
        ${descriptionParagraphs}
        <p><a href="${parentPath}" data-link>&larr; Back to ${parentTitle} overview</a></p>
      </div>
      <hr>
      ${renderDemoList(demos)}
    </section>
  `;
  return renderPageShell(content);
}

export function renderDemoDetailPage(demo: DemoItem) {
  const title = escapeHtml(demo.title);
  const heading = demo.slug === "flags-of-europe"
    ? "Flags of Europe flashcards"
    : demo.slug === "us-states"
      ? "US States Map Flashcards flashcards"
      : title;
  const demoBody =
    demo.slug === "logic-gate-simulator"
      ? `
        <div class="logic-gate-simulator" data-logic-gate-simulator></div>
        ${renderLogicGateDescription()}
      `
      : demo.slug === "3d-vector-plotter"
        ? `
          <div class="vector-plotter" data-vector-plotter></div>
          ${renderVectorPlotterDescription()}
        `
      : demo.slug === "19-tet-keyboard"
        ? `
          <div class="tet-keyboard-demo" data-tet-keyboard></div>
          ${renderTetKeyboardDescription()}
        `
      : demo.slug === "virtual-oscilloscope"
        ? `
          <div class="virtual-oscilloscope" data-virtual-oscilloscope></div>
          ${renderVirtualOscilloscopeDescription()}
        `
      : demo.slug === "amplitude-modulation"
        ? `
          <div class="amplitude-modulation" data-amplitude-modulation></div>
          ${renderAmplitudeModulationDescription()}
        `
      : demo.slug === "rot-13-cipher"
        ? `
          <div class="rot13-demo" data-rot13></div>
          ${renderRot13Description()}
        `
      : demo.slug === "hypocycloid"
        ? `
          <div class="hypocycloid-demo" data-hypocycloid></div>
          ${renderHypocycloidDescription()}
        `
      : demo.slug === "estimating-pi-monte-carlo"
        ? `
          <div class="monte-carlo-demo" data-monte-carlo-pi></div>
          ${renderMonteCarloPiDescription()}
        `
      : demo.slug === "azimuth-calculator"
        ? `
          <div class="azimuth-demo" data-azimuth-calculator></div>
          ${renderAzimuthDescription()}
        `
      : demo.slug === "colour-temperature-relationship"
        ? `
          <div class="colour-temperature-demo" data-colour-temperature></div>
          ${renderColourTemperatureDescription()}
        `
      : demo.slug === "electric-field-line-simulator"
        ? `
          <div class="electric-field-demo" data-electric-field></div>
          ${renderElectricFieldDescription()}
        `
      : demo.slug === "simple-pendulum"
        ? `<div class="simple-pendulum-demo" data-simple-pendulum></div>${renderPendulumDescription()}`
      : demo.slug === "geodesics"
        ? `<div class="geodesics-demo" data-geodesics></div>${renderGeodesicsDescription()}`
      : demo.slug === "capital-cities-map"
        ? `<div class="capital-cities-demo" data-capital-cities></div>${renderCapitalCitiesDescription()}`
      : demo.slug === "flags-of-europe"
        ? `
          <div class="flags-of-europe-demo" data-flags-of-europe></div>
          ${renderFlagsOfEuropeDescription()}
        `
      : demo.slug === "us-states"
        ? `<div class="us-states-flashcards" data-us-states></div>${renderUsStatesCredits()}`
      : `
        <div class="demo-placeholder">
          <img src="${demo.thumbnail}" alt="${title} demo thumbnail" width="260" height="170">
          <div>
            <h2>Interactive demo area</h2>
            <p>
              This page is wired into the local route structure, but the demo functionality
              is intentionally not implemented in this step.
            </p>
            <a href="/demos" data-link>Browse all demos</a>
          </div>
        </div>
      `;

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

function renderHypocycloidDescription() {
  return `
    <section class="demo-description hypocycloid-description" aria-label="Hypocycloid explanation">
      <hr>
      <p>Imagine attaching a pen to a certain point on a small circle. If you were to then roll that small circle around the inside of a larger circle, the shape the pen would trace out would be a <em>hypercycloid</em>.</p>
      <p>Mathematically speaking, the hypocycloid is defined by two parametric equations:</p>
      <div data-mathjax aria-label="Hypocycloid parametric equations">
        \\[ x(\\theta) = (R-r)\\cos{\\theta} + r \\cos \\left( \\frac{R-r}{r}\\theta \\right) \\]
        \\[ y(\\theta) = (R-r)\\sin{\\theta} - r \\sin \\left( \\frac{R-r}{r}\\theta \\right) \\]
      </div>
      <p>Where</p>
      <ul data-mathjax>
        <li>\\( R \\) is the radius of the large circle</li>
        <li>\\( r \\) is the radius of the small circle</li>
      </ul>
      <p data-mathjax>The shape of the hypocycloid depends heavily on the ratio \\( k = \\frac{R}{r} \\). If \\( k \\) is a whole number, then the hypocycloid will have \\( k \\) sharp corners. For example, for \\( k = 2 \\) the shape will be a straight line (this system is known as the Tusi-couple, and was first investigated by Nasir al-Din al-Tusi in 1247). For \\( k = 3\\), the hypocycloid will be a 3-pointed shape called a deltoid and for \\( k = 4 \\) it will be a 4-pointed shape called an astroid.</p>
      <p data-mathjax>If \\( k \\) is a fractional number, the number of corners is the numerator in simplest fractional representation of the ratio. So if the ratio is 1.67 recurring, the fraction will be \\( \\frac{5}{3} \\), so the hypocycloid has 5 corners.</p>
      <p>This demo was inspired by http://en.wikipedia.org/wiki/File:Deltoid2.gif.</p>
    </section>`;
}

function renderMonteCarloPiDescription() {
  return `
    <section class="demo-description monte-carlo-description" aria-label="Monte Carlo Pi explanation">
      <hr>
      <p data-mathjax>One method to estimate the value of \\( \\pi \\) (3.141592...) is by using a Monte Carlo method. In the demo above, we have a circle of radius 0.5, enclosed by a 1 &times; 1 square. The area of the circle is \\( \\pi r^2 = \\pi / 4 \\), the area of the square is 1. If we divide the area of the circle, by the area of the square we get \\( \\pi / 4 \\).</p>
      <p data-mathjax>We then generate a large number of uniformly distributed random points and plot them on the graph. These points can be in any position within the square i.e. between (0,0) and (1,1). If they fall within the circle, they are coloured red, otherwise they are coloured blue. We keep track of the total number of points, and the number of points that are inside the circle. If we divide the number of points within the circle, \\( N_{inner} \\) by the total number of points, \\( N_{total} \\), we should get a value that is an approximation of the ratio of the areas we calculated above, \\( \\pi / 4 \\).</p>
      <p>In other words,</p>
      <div data-mathjax aria-label="Monte Carlo Pi equations">
        \\[ \\frac{\\pi}{4} \\approx \\frac{N_{inner}}{N_{total}} \\]
        \\[ \\pi \\approx 4 \\frac{N_{inner}}{N_{total}} \\]
      </div>
      <p>When we only have a small number of points, the estimation is not very accurate, but when we have hundreds of thousands of points, we get much closer to the actual value - to within around 2 decimal places of accuracy. You can add points one at a time, or you can tick the "animate" checkbox to add many points to the graph very quickly.</p>
    </section>`;
}

function renderAzimuthDescription() {
  return `
    <section class="demo-description azimuth-description" aria-label="Azimuth Calculator explanation">
      <hr>
      <p>When you want to observe an object such as a comet or planet in the night sky, often you will visit a website that tells you where to look. The website often provides two numbers: an <em>azimuth</em> and an <em>altitude</em>.</p>
      <div class="azimuth-illustration"><img src="/assets/demos/azimuth-altitude.svg" width="256" height="256" alt=""></div>
      <p>The azimuth is a number between 0&deg; and 360&deg;, and is an angle (measured clockwise) from due north. So in other words, the azimuth tells you which direction along the horizon you should turn. An azimuth of 0&deg; means you should look due north. An azimuth of 90&deg; means you should look east. An azimuth of 180&deg; means you should look south, and so on.</p>
      <p>The altitude is how far above the horizon you should look. An altitude of 0&deg; means the object is directly on the horizon, whereas an altitude of 90&deg; means the object is directly above you.</p>
      <p>To use this tool, drag the pin marker to your location, or click on the "set marker to current location" button to do this automatically. Then drag the star marker around until the azimuth displays the correct value. You will then be able to use the line that joins the two markers to help you identify which direction you need to look in to see your object.</p>
      <p>In the default example above, if you are in the middle of Trafalgar Square, and your stargazing website has said the object you're looking for can be found at an azimuth of 32&deg;, then you know that to see it, you need to look in the direction of the Coliseum.</p>
    </section>`;
}

function renderColourTemperatureDescription() {
  return `
    <section class="demo-description colour-temperature-description" aria-label="Colour-Temperature explanation">
      <hr>
      <p>As an object heats up, it begins to emit light. (If you're interested in the exact way in which this occurs, please see Planck's Law of Blackbody Radiation.)</p>
      <p>In very simple terms, a hotter object emits more high frequency radiation than a less hot one. For the sake of this explanation, a "hot" object will have a temperature of around 15,000 Kelvin, a "warm" object will be at approximately 6,500 Kelvin and a "cool" object will be around 1,500 Kelvin.</p>
      <p>Blue light has a higher frequency than red light, so it follows that hot objects will glow bluish, warm objects will glow white (made up from a combination of blue and red light), and cool objects will glow red. Using the term "cool" to describe something glowing red hot could be thought of as a slight misnomer, but it helps you to understand that compared to blue-hot objects, red-hot objects certainly are cool!</p>
      <p>The slider above allows you to control the temperature, which in turn changes the display to the color of the light that would be emitted from an object at that temperature. The color is also written in RGB and hexadecimal format.</p>
      <p>As with a Wavelength-Colour demo, the perception of colour by the the human eye depends not only on the wavelength of the incoming radiation but also on a number of additional factors (including psychological ones), so this scale should best be thought of as an approximation.</p>
      <hr>
      <h4>Credits</h4>
      <ul class="credits"><li>Algorithm for generating RGB colours created by Tanner Helland.</li></ul>
    </section>`;
}

function renderElectricFieldDescription() {
  return `
    <section class="demo-description electric-field-description" aria-label="Electric field explanation">
      <hr>
      <p data-mathjax>Coulomb's Law tells us that the force, \\( F \\), between two point charges is</p>
      <div data-mathjax aria-label="Coulomb's law">\\[ \\vec{F} = k_e \\frac{q_1 q_2}{r_{21}^2} \\hat{r}_{21} \\]</div>
      <p data-mathjax>Where, \\( q_1 \\) and \\( q_2 \\) are the values of each charge, \\( k_e \\) is Coulomb's constant, \\( 8.987 \\times 10^9 \\textrm{N} \\textrm{m}^2 \\textrm{C}^{-2}\\), \\( r_{21} \\) is the magnitude of the vector pointing from charge 2 to charge 1, and \\( \\hat{r}_{21} \\) is the unit vector along that direction.</p>
      <p>The important principle to help you remember which way the force points is that opposite charges attract and like charges repel.</p>
      <p>Once we know the force, we can compute the electric field. This is the force per unit charge.</p>
      <div data-mathjax aria-label="Electric field equation">\\[ \\vec{E} = \\vec{F} / q \\]</div>
      <p>The electric field is often visualised using field lines, which are what you can see in the interactive demo at the top of the page. Electric field lines follow a number of rules</p>
      <ul>
        <li>They always point in the direction of the electric field at a given point. This direction is represented by an arrow.</li>
        <li>They never cross, because this would mean the electric field would be pointing in two different directions at the same location, which is impossible.</li>
        <li>They always start at positive charges (also known as a source) or at infinity.</li>
        <li>They always end at negative charges or at infinity.</li>
        <li>The number of lines in a given area is proportional to the field strength. In the simulation, a charge with +2 will have twice as many lines coming out of it as one with +1.</li>
      </ul>
      <p>The demo above allows you to alter the charge of each point charge. You can also drag and drop each point charge to see how the lines behave when the positions are changed.</p>
    </section>`;
}

function renderPendulumDescription() {
  return `<section class="demo-description pendulum-description" aria-label="Simple pendulum explanation"><hr>
    <p>The demo above shows two simple pendula. When you click the start button, you will see them oscillate back and forth. Click the reset button to stop.</p>
    <p>This commonly used simulation assumes that the mass on the end is a point mass (it takes up no space), the string is massless and completely rigid, and the maximum angular displacement is small enough to satisfy the small angle approximation.</p>
    <p>When the above conditions are met, the pendulum undergoes simple harmonic motion with a period</p>
    <div data-mathjax aria-label="Simple pendulum period equation">\\[ T = 2 \\pi \\left(\\frac{L}{g}\\right)^\\frac{1}{2} \\]</div>
    <p data-mathjax>Interestingly, this means that the period of oscillation is completely independent of mass, and depends only on the acceleration due to gravity \\(g\\), and the string length, \\(L\\). So for pendula of the same length, no matter what the mass on the end, the period should be the same, assuming \\(g\\) hasn't changed!</p>
    <p>Notice however, that the relationship is not linear, and instead the period is dependent on the <em>square root</em> of the length. So this means in order to double the period, you would have to multiply the length by four.</p>
  </section>`;
}

function renderGeodesicsDescription() {
  return `<section class="demo-description geodesics-description" aria-label="Geodesics explanation"><hr>
    <p>A geodesic is a line representing the shortest route between two points. In simple terms, it might help to think of this as the route a crow (or aeroplane) would fly to get from one point to another (ignoring any effects for wind).</p>
    <p>The demo above demonstrates how confusing geodesics can appear when displayed on a standard 2D map of the world. The red line is what many people might assume would be the shortest path between the two markers. However, this is not the case and it is actually the purple line that is the geodesic. It really is true that the shortest way to get from the western America, to Madagascar is via Scotland!</p>
    <p>The discrepancy between the red and purple lines arises because it is not possible to represent the 3D surface of the earth (spherical) on a flat 2D map without distorting its features.</p>
    <p>Both markers can be dragged around the map which will in turn update the geodesic.</p>
  </section>`;
}

function renderCapitalCitiesDescription() {
  return `<section class="demo-description capital-cities-description" aria-label="Capital Cities Map explanation"><hr>
    <p>The map above shows the locations of capital cities spanning the world from Abu Dhabi to Zagreb. After spending some time browsing, it becomes apparent that a large number of capitals are located on coast lines or rivers, or other strategically important locations.</p>
    <p>Clicking on a marker reveals the name of the city and gives you the option to jump to a much closer level of zoom.</p>
    <p>The most northen capital is Nuuk, Greenland, and the most northern capital of a sovereign state is Reykjavík, Iceland. The most southerly capital is Grytviken, South Georgia.</p>
  </section>`;
}

function renderRot13Description() {
  const upper = "ABCDEFGHIJKLM".split("");
  const lower = "NOPQRSTUVWXYZ".split("");
  return `
    <section class="demo-description rot13-description" aria-label="ROT-13 explanation">
      <hr>
      <p>ROT-13 is a method used to encrypt messages. It involves replacing each letter with the corresponding letter located 13 places away from it in the alphabet. Methods such as these, where letters are substituted by others a fixed distance away, are known as Caesar ciphers, named after Julius Caesar who used the technique to send secret messages.</p>
      <p>In ROT13, A is replaced with N, B with O and so on. The full list of substitutions is outlined in the table below.</p>
      <div class="rot13-table-wrap"><table class="rot13-table" aria-label="ROT-13 substitutions"><tbody>
        <tr>${upper.map((letter) => `<td>${letter}</td>`).join("")}</tr>
        <tr>${upper.map(() => "<td>&#8597;</td>").join("")}</tr>
        <tr>${lower.map((letter) => `<td>${letter}</td>`).join("")}</tr>
      </tbody></table></div>
      <p>In reality, the algorithm offers very little security as it can be undone by applying the exact same algorithm. In other words, the inverse of ROT13 is also ROT13. As such, it should not be used as an encryption method for critical information, but it remains useful to study as an introduction to cryptography and also for more light hearted scenarios such as hiding spoilers on internet forums.</p>
    </section>`;
}

function renderAmplitudeModulationDescription() {
  return `
    <section class="demo-description" aria-label="Amplitude modulation explanation">
      <hr>
      <p>
        The demo above shows three waveforms. From top to bottom, they are coloured blue, red and purple, and are mathematically described by the following equations.
      </p>
      <div class="vector-formula" data-mathjax aria-label="Carrier wave formula">\\[ y_1 = \\sin{(2\\pi f_1 t)} \\]</div>
      <div class="vector-formula" data-mathjax aria-label="Modulator formula">\\[ y_2 = 1 + A_2\\cos{(2\\pi f_2 t)} \\]</div>
      <div class="vector-formula" data-mathjax aria-label="Amplitude modulation formula">\\[ y_{1\\times2} = y_1 \\times y_2 = \\sin{(2\\pi f_1 t)}\\left(1 + A_2\\cos{(2\\pi f_2 t)}\\right) \\]</div>
      <p data-mathjax>
        where \\( f_1 \\) and \\( f_2 \\) are the frequencies of each wave, \\( A_2 \\) is the amplitude of the second wave, and \\( t \\) is the time. The amplitude of the first wave is 1.
      </p>
      <p data-mathjax>
        You can check the "Sound on/off" checkbox to hear what \\( y_{1\\times2} \\) sounds like. You should be able to hear a note that has a frequency of \\( f_1 \\), that is going up and down in loudness at a rate of \\( f_2 \\). For example, if the value of \\( f_2 \\) is 1Hz, the volume should go to zero once every second.
      </p>
      <p data-mathjax>
        The \\( y_2 \\) waveform is acting as a modulator and creates an amplitude envelope. This means its magnitude is determining the magnitude of \\( y_{1\\times2} \\). When the value of \\( A_2 \\) is zero, the modulator has a constant value of 1, and the line \\( y_{1\\times2} \\) is exactly equal to \\( y_1 \\), meaning you will not hear any variation in loudness.
      </p>
      <p data-mathjax>
        If you increase \\( f_2 \\) higher and higher, you may begin to hear two discernible frequencies, and the tone sounds a little like a dial tone. This can be explained by understanding that the trigonometric identity
      </p>
      <div class="vector-formula" data-mathjax aria-label="Trigonometric identity">\\[ \\sin{\\left(\\frac{x+y}{2}\\right)}\\cos{\\left(\\frac{x-y}{2}\\right)} = \\frac{1}{2}\\left[\\sin{(x)} + \\sin{(y)}\\right] \\]</div>
      <p data-mathjax>
        allows us to write the equation for \\( y_{1\\times2} \\) as a sum of sine waves, which is equivalent to playing two tones of different frequencies. The fact that rapidly modulating the amplitude of one wave results in a waveform identical to playing two notes of different frequencies is quite remarkable. This behavior is also known as wave interference or beat frequency.
      </p>
    </section>
  `;
}

function renderFlagsOfEuropeDescription() {
  return `
    <section class="demo-description" aria-label="Flags of Europe notes">
      <hr>
      <h2>Useful notes</h2>

      <p>
        Be aware of Austria 🇦🇹 and Latvia 🇱🇻, their flags are very similar. The key difference is the red on the Latvian flag is darker, and the white horizontal strip is narrower.
      </p>

      <p>
        Similarly, the flags of Luxembourg 🇱🇺 and the Netherlands 🇳🇱 are very similar too. The most obvious difference here is that Luxembourg uses a noticeably brigter blue, as well as a slightly brighter red.
      </p>

      <p>
        The flags of Poland 🇵🇱 and Monaco 🇲🇨 are virtually the same, but flipped vertically.
      </p>

      <p>
        A helpful way to remember the flag of Ukraine 🇺🇦 is to visualise a field of wheat (yellow), under a blue sky.
      </p>

      <p>
        The flags of Russia 🇷🇺, Slovakia 🇸🇰 and Slovenia 🇸🇮 are all horizontal tricolour flags, with bands of white, blue and red. Slovakia and Slovenia's flags each have a coat of arms on them. A a double white cross for Slovakia and a white Mount Triglav for Slovenia.
      </p>

      <p>
        Romania 🇷🇴 and Moldova 🇲🇩 are neighbouring countries with a very close relationship. Their flags are very similar in that they are both vertical tricolours of blue, yellow and red, the only difference being the Moldovan flag features the coat of arms (an eagle holding a shield on which there is a picture of an aurochs, an extinct type of cattle).
      </p>

      <p>
        Hungary 🇭🇺 and Bulgaria 🇧🇬 also have similar flags. You might find it helpful to think of the Italian flag, which also shares the same colours 🇮🇹. The word "Italy" is similar in terms of syllables (and ending in -y) to Hungary, and this can help you to remember that Hungary's flag has a white band in the middle just like Italy's does.
      </p>

      <hr>
      <h4>Credits</h4>
      <ul class="credits">
        <li>Flag images are taken from <a href="https://github.com/hampusborgos/country-flags" target="_blank" rel="noreferrer">https://github.com/hampusborgos/country-flags</a></li>
      </ul>
    </section>
  `;
}

function renderUsStatesCredits() {
  return `<section class="demo-description us-states-credits" aria-label="US States map credits"><hr><h4>Credits</h4><ul class="credits"><li>Public domain version of the map available from <a href="https://commons.wikimedia.org/wiki/File:Blank_US_Map_(states_only).svg" target="_blank" rel="noreferrer">Wikimedia</a></li></ul></section>`;
}

function renderFlashcardActions() {
  return `<div class="flags-actions tags" data-flashcard-actions aria-label="Flashcard controls">
    <button type="button" data-action="open-panel"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">view_list</span><span>View All Terms</span></button>
    <button type="button" data-action="shuffle"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">shuffle</span><span>Shuffle</span></button>
    <button type="button" data-action="flip-all"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">sync</span><span>Flip All Cards</span></button>
    <button type="button" data-action="reset"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">settings_backup_restore</span><span>Reset</span></button>
  </div>`;
}

function renderVirtualOscilloscopeDescription() {
  return `
    <section class="demo-description" aria-label="Virtual oscilloscope explanation">
      <hr>

      <p>
        An oscilloscope is a useful tool for anyone working with electrical signals because it provides a visual representation of the signal's shape, or waveform. This allows you to measure properties of the wave, such as amplitude or frequency.
      </p>

      <p>
        The initial signal above is a 250Hz sine wave, which has an amplitude of 5 volts. The frequency of this wave can be adjusted by using the "Input Wave Frequency" slider. You can also choose to display a square wave.
      </p>

      <p>
        If your browser supports audio capture, the input dropdown box allows you to select "live input". This will take data from any microphone connected to your computer and display the live audio data. Different microphones send different voltages to the computer, so for consistency the input is normalised so the raw input signal is limited to somewhere between -5 and +5 volts.
      </p>

      <p>
        Since waveforms come in a wide variety of shapes, amplitudes and frequencies, oscilloscopes need to have a number of controls to adjust the display of the waveform so it can comfortably fit inside the viewport.
      </p>

      <p>
        <em>Freeze live input</em><br>
        This tickbox freezes the input allowing you to effectively take a snapshot of what is displayed on the oscilloscope at a given instant in time. This is especially useful because you can still adjust the time base and volts per division setting. Try whistling and freezing the input. Adjusting the timebase to a convenient scale allows you to calculate the frequency of your whistle by counting the period of one complete waveform.
      </p>

      <p>
        <em>Oscilloscope gain</em><br>
        This is a number that the incoming signal is multiplied by. A gain of 1 will have no effect, a gain of less than 1 will make the signal smaller and a gain of more than 1 will make it larger.
      </p>

      <p>
        <em>seconds / div</em><br>
        This control allows you to adjust the length of time that each square of the grid represents. When the oscilloscope is first loaded, this setting is set at 1ms, and shows one complete waveform over 4 squares. This means that the period of the wave is 4ms, or 0.004s, giving a frequency of (1/0.004) = 250Hz. If you change the timebase to 500µs, you should see the waveform now takes 8 squares to complete one full oscillation. The period and frequency remain constant because 8 times 500µs still equals 0.004s.
      </p>

      <p>
        <em>volts / div</em><br>
        This setting is very similar to the timebase setting described above, but instead of stretching the wave along the x-axis, it involves stretching it along the y-axis. The sine wave has an amplitude of 5V, meaning when volts/div is set to 5, the waveform just reaches the top of the first square. If you were to change the setting to 10 volts/div, the waveform now only reaches up half of a square.
      </p>

      <p>
        <em>Horizontal and Vertical Offsets</em><br>
        These two sliders allow you to adjust the position of the oscilloscope's trace on the grid. They are particularly useful for lining up parts of the waveform with the gridlines, which can make it easier to count the squares when determining wavelength.
      </p>

      <p>
        <em>Color scheme</em><br>
        This setting allows you to choose from a selection of themes.
      </p>

      <ul>
        <li><strong>Default</strong>: Light trace, green background</li>
        <li><strong>Dark</strong>: Light trace, dark background</li>
        <li><strong>Light</strong>: Dark trace, light background</li>
        <li><strong>Vintage</strong>: Green trace, dark background</li>
      </ul>

      <p>
        If you would like to embed the oscilloscope on your own website, use the following Academo route:
      </p>

      <textarea class="oscilloscope-embed-code" readonly>&lt;iframe src="/demos/virtual-oscilloscope" width="800" height="380"&gt;&lt;/iframe&gt;</textarea>
    </section>
  `;
}

function renderTetKeyboardDescription() {
  return `
    <section class="demo-description" aria-label="19 TET keyboard explanation">
      <hr>

      <p>
        On a standard piano keyboard, one octave is divided into 12 notes made up from 7 white keys (A, B, C, D, E, F and G), and in between some of these, 5 black keys, which can be called either sharps or flats: A# (Bb), C# (Db), D# (Eb), F# (Gb), G# (Ab). Whether it's a sharp or a flat doesn't really matter, the note has the same frequency, just a different name. To recap, this gives us a grand total of 12 notes in one octave.
      </p>

      <p>
        If you were to measure the frequency of a note, then measure the frequency of a note exactly one octave higher, you would see that the higher note has exactly twice the frequency of the lower note. For example, middle C has a frequency of 261.626Hz, and the C above it has a frequency of 523.251Hz.
      </p>

      <p>
        Additionally, if you were to measure the frequency of a note, and then divide it by the frequency of the next lowest note, you would always get the same result: 1.05946. For example, if we divide the frequency of middle C (261.626Hz) by the next lowest note, a B with frequency 246.942Hz, we get 1.05946. In other words, the ratio between all adjacent notes is always the same. The number 1.05946 is special because it is the twelfth root of 2.
      </p>

      <p>
        This means that if you were to multiply it by itself 12 times, the answer would be 2. If you began at middle C, and multiplied 261.626Hz by 1.05946 12 times in a row, you would end up with 523.251Hz, which is exactly one octave higher as we found out in the paragraph above.
      </p>

      <p>
        Dividing octaves up in this fashion, with equal ratios between notes, is called equal temperament. And when there are 12 notes in the octave, it is called 12 tone equal temperament, or 12-TET for short. But there is no law saying you have to do this. In the demo above, we have divided the octave up into 19 notes. This means the ratio between each note is now the nineteenth root of 2, which is 1.0371.
      </p>

      <p>
        In 19 TET, we have to come up with a new layout for the keyboard because we have 7 new notes to fit it. In the first paragraph we said that sharps and flats sound the same. Well in 19 TET, they are different notes. In our demo, we have coloured the flats grey and made them slightly shorter than the sharps. That still leaves us 2 notes short, so we add in an E# and a B#, to complete the 19 note scale.
      </p>

      <p>
        The keyboard above can be played by either clicking the notes with your mouse or by pressing keys on your computer keyboard. The lowest note, a C, corresponds to the 'Z' on the keyboard, and all other white notes follow along on the bottom row. Black notes, sharps, are on the row above, and grey notes, flats, on the row above that. The picture below shows exactly which keys to press.
      </p>

      <img class="tet-layout-image" src="/assets/19-tet/keyboard.png" alt="Computer keyboard controls for the 19 TET keyboard" width="500" height="324">
    </section>
  `;
}

function renderLogicGateDescription() {
  const singleInputRows = [
    ["0", "1"],
    ["1", "0"]
  ];
  const gateRows = {
    AND: [
      ["0", "0", "0"],
      ["1", "0", "0"],
      ["0", "1", "0"],
      ["1", "1", "1"]
    ],
    NAND: [
      ["0", "0", "1"],
      ["1", "0", "1"],
      ["0", "1", "1"],
      ["1", "1", "0"]
    ],
    OR: [
      ["0", "0", "0"],
      ["1", "0", "1"],
      ["0", "1", "1"],
      ["1", "1", "1"]
    ],
    NOR: [
      ["0", "0", "1"],
      ["1", "0", "0"],
      ["0", "1", "0"],
      ["1", "1", "0"]
    ],
    XOR: [
      ["0", "0", "0"],
      ["1", "0", "1"],
      ["0", "1", "1"],
      ["1", "1", "0"]
    ]
  };

  return `
    <section class="demo-description" aria-label="Logic gate simulator instructions">
      <hr>

      <p>
        The demo above allows you to create sequences of logic gates to see how they behave when connected to various inputs and outputs. Initially, you are presented with a simple on/off input and an output. To connect them, click and drag from the hollow circle on the right side of the on/off switch, and release the mouse when you are over the solid circle on the left side of the output block.
      </p>

      <p>
        For each of the logic gates, outputs are hollow circles, and inputs are solid circles. The on/off switch and output block are not actually logic gates, but they are required because they give us the 1s and 0s needed to see how the gates behave. Click the on/off switch and see what happens. It turns yellow. This is our way of differentiating between 0 (off) and 1 (on).
      </p>

      <p>
        To add a new logic gate, or an additional input or output block, choose from the dropdown menu and then click "Add Node". The new node will be placed on the workspace, and you can drag it to your desired position. To delete nodes, click the small cross in the top right corner of its enclosing box. To remove connections, click the input solid circle and drag away before releasing.
      </p>

      <p>
        If you need more space, click the "Full screen mode" button, which increases the size of the workspace to fill the window.
      </p>

      <h2>NOT Gate</h2>
      <img class="demo-gate-symbol" src="/assets/logic-symbols/not.svg" alt="NOT gate symbol" width="100" height="100">
      <p>
        The NOT gate is also known as an inverter because the output is the exact opposite of the input. It has one input and one output. The two possibilities are written out in the table below. Tables listing all logical possibilities like this are known as <em>truth tables</em>.
      </p>
      ${renderStaticTruthTable(["Input", "Output"], singleInputRows)}

      <h2>AND Gate</h2>
      <img class="demo-gate-symbol" src="/assets/logic-symbols/and.svg" alt="AND gate symbol" width="100" height="100">
      <p>
        The AND gate has two inputs and one output. The output is 1 if <em>both</em> inputs are 1, and for all other cases the output is 0.
      </p>
      ${renderStaticTruthTable(["Input 1", "Input 2", "Output"], gateRows.AND)}

      <h2>NAND Gate</h2>
      <img class="demo-gate-symbol" src="/assets/logic-symbols/nand.svg" alt="NAND gate symbol" width="100" height="100">
      <p>
        The NAND gate behaves in the opposite fashion to an AND gate. You can think of it as an AND gate followed immediately by a NOT gate. Its output is 0 when the two inputs are 1, and for all other cases, its output is 1.
      </p>
      ${renderStaticTruthTable(["Input 1", "Input 2", "Output"], gateRows.NAND)}

      <h2>OR Gate</h2>
      <img class="demo-gate-symbol" src="/assets/logic-symbols/or.svg" alt="OR gate symbol" width="100" height="100">
      <p>
        The OR gate has two inputs and one output. If at least one of the inputs is 1, then the output will be 1. If neither input is 1, the output will be 0.
      </p>
      ${renderStaticTruthTable(["Input 1", "Input 2", "Output"], gateRows.OR)}

      <h2>NOR Gate</h2>
      <img class="demo-gate-symbol" src="/assets/logic-symbols/nor.svg" alt="NOR gate symbol" width="100" height="100">
      <p>
        Just as the NAND gate could be thought of as an AND followed by a NOT, a NOR can be thought of as an OR also followed by a NOT.
      </p>
      ${renderStaticTruthTable(["Input 1", "Input 2", "Output"], gateRows.NOR)}

      <h2>XOR Gate</h2>
      <img class="demo-gate-symbol" src="/assets/logic-symbols/xor.svg" alt="XOR gate symbol" width="100" height="100">
      <p>
        With an OR gate, if both inputs were 1, the output was 1. However, with an XOR, or exclusive OR, if both inputs are 1, the output is 0. For all other scenarios, the XOR behaves the same as the OR.
      </p>
      ${renderStaticTruthTable(["Input 1", "Input 2", "Output"], gateRows.XOR)}
    </section>
  `;
}

function renderVectorPlotterDescription() {
  return `
    <section class="demo-description" aria-label="3D vector plotter explanation">
      <hr>

      <p>
        The demo above allows you to enter up to three vectors in the form (x,y,z). Clicking the draw button will then display the vectors on the diagram. The scale of the diagram adjusts to fit the magnitude of the vectors. You can drag the diagram around and zoom in or out by scrolling with the mouse. Clicking on the end of a vector will also reveal its individual components.
      </p>

      <p>
        The demo also has the ability to plot three other vectors which can be computed from the first two input vectors. The first of these is the resultant, and this is obtained when the components of each vector are added together. If the resultant is <strong>c</strong>, then
      </p>

      <div class="vector-formula" data-mathjax aria-label="Resultant vector formula">
        \\[ \\textbf{c} = \\textbf{a} + \\textbf{b} \\]

        \\[ \\left( \\begin{array}{c}
        c_x \\\\
        c_y \\\\
        c_z \\end{array} \\right) =
        \\left(
        \\begin{array}{c}
        a_x \\\\
        a_y \\\\
        a_z
        \\end{array} \\right)
        +
        \\left(
        \\begin{array}{c}
        b_x \\\\
        b_y \\\\
        b_z
        \\end{array} \\right)
        =
        \\left(
        \\begin{array}{c}
        a_x + b_x \\\\
        a_y + b_y \\\\
        a_z + b_z
        \\end{array}
        \\right)
        \\]
      </div>

      <p>
        In a similar fashion, the difference is what you obtain when you subtract one vector from the other. If the difference is <strong>d</strong>, then
      </p>

      <div class="vector-formula" data-mathjax aria-label="Difference vector formula">
        \\[ \\textbf{d} = \\textbf{a} - \\textbf{b} \\]

        \\[ \\left( \\begin{array}{c}
        d_x \\\\
        d_y \\\\
        d_z \\end{array} \\right) =
        \\left(
        \\begin{array}{c}
        a_x \\\\
        a_y \\\\
        a_z
        \\end{array} \\right)
        -
        \\left(
        \\begin{array}{c}
        b_x \\\\
        b_y \\\\
        b_z
        \\end{array} \\right)
        =
        \\left(
        \\begin{array}{c}
        a_x - b_x \\\\
        a_y - b_y \\\\
        a_z - b_z
        \\end{array}
        \\right)
        \\]
      </div>

      <p>
        Finally, the vector product, also known as the cross product, is defined as
      </p>

      <div class="vector-formula" data-mathjax aria-label="Cross product vector formula">
        \\[ \\textbf{e} = \\textbf{a} \\times \\textbf{b} = \\lvert a \\rvert\\ \\lvert b \\rvert\\ \\sin(\\theta)\\hat{n} \\]

        \\[ \\left( \\begin{array}{c}
        e_x \\\\
        e_y \\\\
        e_z \\end{array} \\right) =
        \\left(
        \\begin{array}{c}
        a_x \\\\
        a_y \\\\
        a_z
        \\end{array} \\right)
        \\times
        \\left(
        \\begin{array}{c}
        b_x \\\\
        b_y \\\\
        b_z
        \\end{array} \\right)
        =
        \\left(
        \\begin{array}{c}
        a_yb_z - a_zb_y \\\\
        a_zb_x - a_xb_z\\\\
        a_xb_y - a_yb_x
        \\end{array}
        \\right)
        \\]
      </div>

      <p>
        Geometrically speaking, the cross product's length is equal to the product of the magnitudes of <strong>a</strong> and <strong>b</strong> multiplied by the sine of the angle between them. It points in the direction of n, which is the vector pointing directly out of the plane which <strong>a</strong> and <strong>b</strong> lie in. This means that if two vectors point in the same, or exactly opposite, direction, then their cross product will be zero.
      </p>
    </section>
  `;
}

function renderStaticTruthTable(headers: string[], rows: string[][]) {
  return `
    <table class="truth-table">
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `;
}

export function renderNotFoundPage() {
  return renderPageShell(`
    <section class="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Sorry, we can't find what you're looking for</h1>
      <hr>
      <p>Head over to the <a href="/demos" data-link>demos page</a> to browse the current scope.</p>
    </section>
  `);
}

export function renderMentionsSection() {
  return `
    <section class="mentions" id="about" aria-labelledby="mentions-title">
      <h2 id="mentions-title">Featured around the web</h2>
      <ul class="logos" aria-label="Publication logos">
        ${featuredLogos
          .map(
            (logo) => `
              <li>
                <img src="${logo.image}" alt="${escapeHtml(logo.name)}" loading="lazy">
              </li>
            `
          )
          .join("")}
      </ul>
    </section>
  `;
}

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <p><span class="footer-link"><a href="/privacy-policy" data-link>Privacy Policy</a></span><span class="footer-link"><a href="/cookie-policy" data-link>Cookie Policy</a></span>&copy; Academo.org 2025.</p>
      </div>
    </footer>
  `;
}
