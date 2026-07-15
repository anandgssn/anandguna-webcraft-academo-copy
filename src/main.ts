import "./styles.css";

const demos = [
  "3D Vector Plotter",
  "Virtual Oscilloscope",
  "Fourier Series",
  "Pendulum Waves",
  "Doppler Effect",
  "Probability Distributions"
];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="page-shell">
    <header class="site-header" aria-label="Primary">
      <a class="brand" href="/" aria-label="Academo home">Academo</a>
      <nav class="nav-links" aria-label="Demo categories">
        <a href="#demos">Demos</a>
        <a href="#subjects">Subjects</a>
        <a href="#search">Search</a>
      </nav>
    </header>

    <section class="hero" aria-labelledby="hero-title">
      <p class="eyebrow">Free interactive education</p>
      <h1 id="hero-title">Learn by exploring live science and math demos.</h1>
      <p class="hero-copy">
        This starter screen is a clean base for recreating Academo's interactive
        demo directory, subject pages, controls, typography, and motion.
      </p>
      <div class="hero-actions">
        <a class="primary-action" href="#demos">Browse demos</a>
        <a class="secondary-action" href="https://academo.org/" rel="noreferrer">Reference site</a>
      </div>
    </section>

    <section id="demos" class="demo-section" aria-labelledby="demos-title">
      <div class="section-heading">
        <p class="eyebrow">Replica scaffold</p>
        <h2 id="demos-title">Featured demos to implement</h2>
      </div>
      <div class="demo-grid">
        ${demos
          .map(
            (demo) => `
              <article class="demo-card">
                <span class="demo-icon" aria-hidden="true"></span>
                <h3>${demo}</h3>
                <p>Replace this placeholder with the matching Academo card, preview, and interaction.</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  </main>
`;
