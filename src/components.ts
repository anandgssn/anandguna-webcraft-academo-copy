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

export function escapeHtml(value: string) {
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

export function renderPageShell(content: string, currentPath = "") {
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
