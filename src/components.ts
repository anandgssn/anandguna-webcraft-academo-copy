import {
  categoryRoutes,
  getCategoryPath,
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
  { label: "Contact", href: "/contact" }
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
  const popularDemos = demos.slice(0, 3);
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
  const content = `
    <section id="demos" class="demo-directory" aria-labelledby="demos-title">
      <h1 id="demos-title">All demos</h1>
      <hr>
      <div class="subcategory-description">
        <p>
          Below is a list of the demos currently included in this replica, arranged
          as reusable Academo-style thumbnail cards.
        </p>
        ${renderTagLinks()}
      </div>
      <hr>
      ${renderSearchPanel()}
      ${renderSearchResults(demos)}
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

export function renderCategoryPage(category: CategoryRoute, demos: DemoItem[]) {
  const content = `
    <section class="demo-directory" aria-labelledby="category-title">
      <h1 id="category-title">${category.title ?? category.label}</h1>
      <hr>
      <div class="subcategory-description category-description">
        <p>${category.description}</p>
      </div>
      <hr>
      ${renderDemoList(demos)}
    </section>
  `;

  return renderPageShell(content, category.path);
}

export function renderDemoDetailPage(demo: DemoItem) {
  const title = escapeHtml(demo.title);
  const heading = demo.slug === "flags-of-europe" ? "Flags of Europe flashcards" : title;
  const categoryPath = getCategoryPath(demo.category);
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
      : demo.slug === "flags-of-europe"
        ? `
          <div class="flags-of-europe-demo" data-flags-of-europe></div>
          ${renderFlagsOfEuropeDescription()}
        `
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
        : ""}
      <div class="preamble">
        <h1 id="demo-title">${heading}</h1>
        <hr>
        <p class="blurb">${escapeHtml(demo.description)}</p>
        <hr>
      </div>
      ${demoBody}
    </article>
  `;

  return renderPageShell(content, categoryPath);
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
    </section>
  `;
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
        If you would like to embed the oscilloscope on your own website, the original page provides an iframe snippet. In this local replica, the equivalent route is:
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
        <p>&copy; Academo.org 2025.</p>
      </div>
    </footer>
  `;
}
