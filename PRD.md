# Academo — Product Requirements Document

## 1. Product purpose and audience

Academo is a free directory of interactive educational demonstrations for students, teachers, and self-guided learners. No registration, no fees, no backend services. Six subject areas — Engineering, Geography, Maths, Music, Physics, Flashcards — each with multiple interactive demos organized into subcategories. The site is a static single-page application delivering the sixteen demonstrations documented in §2; it does not provide user accounts, backend storage, or integrated analytics, commenting, or media-hosting systems.

---

## 2. Route-level visible requirements

### `/` — Homepage
Centered h1 "Academo".
- Intro paragraph: stating the site is a free collection of interactive educational demos with no registration required, with inline link to `/demos`
- Subject tag row: linking to the six category pages
- Section heading: "Some of our most popular demos." on one line and "Visit the demos page to browse all our demos." on the next, with "browse all our demos" linked to `/demos`
- Popular demos grid: three demo cards in a centered row — Virtual Oscilloscope, 3D Vector Plotter, Logic Gate Simulator
  - Heading: 1.5em size, 700 weight, normal line height, 0.83em vertical margin, centered, with link portion in title color at 70% opacity shifting to orange on hover
  - Card list:
    - Flex wrap centered, with negative 18px horizontal margin on container to offset card margins
    - Each card list item is `calc(25% − 40px)` wide with 20px margin on all sides
      - Horizontal space between adjacent cards 44px (20px right margin + 4px flex gap + 20px left margin)
      - Vertical space between rows 40px (20px bottom + 20px top)
    - Images use content-box sizing so 1px border sits outside 260px content width
- Featured section: "Featured around the web" with four publication logos in a row

### `/demos` — All demos
h1 "All demos".
- Intro paragraph: "Below is a list of all the demos currently available on academo.org, arranged in alphabetical order. If you would like to browse demos by a specific subject, please click one of the category links to be taken to the page for your chosen category. We are always adding new demos, so please check back often to see the latest updates."
- Subject tag row: showing five categories (Engineering, Geography, Maths, Music, Physics — Flashcards excluded from this row)
- Grid: demo cards sorted alphabetically by title, split into two sections separated by a horizontal rule and an h3 "Flashcards" heading — non-flashcard demos above, flashcard demos below

### `/search`
h1 "What would you like to explore?" followed by a horizontal rule.
- Search field: left-aligned search field 314px wide and 36px tall with accessible name "Search demos" and placeholder "Type here..."
- Initial state: no cards, no result heading, and no result count appear on initial load
- Filtered state: after the user types, a left-aligned h2 "Search results" appears above the filtered grid

### `/about`
h1 "About Academo".
- Lead paragraph: describing Academo as a free open-source hub of interactive educational demonstrations
- Body copy: two body paragraphs on HTML and JavaScript implementation and community contributions

### `/contact`
h1 "Get in touch". Introductory paragraph: "You can find Academo on Twitter at @AcademoOrg, and on Facebook at academo.org. Alternatively, if you'd like to send us a message, you can use the form below."
- Form header: h2 "Contact Us" in regular-weight Lucida type, underlined by a 1px dotted grey separator
- Fields:
  - Name field and Email field each at 50% width, stacked vertically on narrow screens
  - Full-width Your message textarea
- Labels: bold compact Lucida Grande at 12.35px with 3px bottom padding and a red asterisk for required fields
- Inputs: 1px `#a9a9a9` borders, 8px padding, white background, 13px Lucida Grande Tahoma Arial text, 44px minimum height; message textarea 136px tall minimum and vertically resizable
- Submit button: native operating-system styling — 22px visible height, 2px outset `#767676` border, `#efefef` background, black Arial 15.6px text, 0 7px padding, no border radius — with invisible 11px top and bottom extension bringing accessible hit area to 44px
- On submit: opens user's mail client addressed to `hello@academo.org`

### `/submit-an-idea`
h1 "Submit an idea". Paragraph asking whether the visitor is a teacher needing an interactive demo, a student needing help understanding a topic, or someone with a new demo or feature idea. Second paragraph with mailto link to `hello@academo.org` with subject "Academo demo idea", asking the sender to include topic, explanation goal, and suggested interaction.

### `/privacy-policy`
Full privacy policy article with h1 "Privacy Policy" and last updated date:
- Sections:
  - Interpretation and definitions
  - Collecting and using personal data
  - Types of data collected
  - Tracking technologies and cookies
  - Use of personal data
  - Retention
  - Links to other websites
  - Changes to policy
  - Contact
- States Academo does not use advertising or Google Analytics
- Loads OpenStreetMap tiles on map demos
- May open email application on mailto links
- Browser storage is used only where demos require local state such as flashcard progress
- Contact section links to `/contact`

### `/cookie-policy`
Full cookie policy article with h1 "Cookie Policy" and effective and last updated dates:
- Sections:
  - What cookies are
  - How they are used
  - Managing cookie preferences
- States Academo does not intentionally set advertising or analytics cookies
- Some demos use browser storage for local state
- OpenStreetMap tiles subject to third-party privacy practices
- Browser-specific cookie management links:
  - Chrome
  - Safari
  - Firefox
  - Internet Explorer

### Category pages — `/engineering`, `/geography`, `/maths`, `/music`, `/physics`, `/flashcards`
- h1 with category label (Flashcards shows "All flashcards")
- Category description paragraph unique to each subject
- Below the description, a paragraph "You can filter these demos further by clicking on one of the following subcategories:" followed by tag pills linking to subcategory pages
- Grid of demo cards filtered to that category, sorted alphabetically by title
- Subcategories per subject:
  - **Engineering**: Computing, Electronics, Signals
  - **Geography**: Human Geography, Maps
  - **Maths**: Geometry, Numbers, Statistics
  - **Music**: Pitch
  - **Physics**: Astronomy, Classical Mechanics, Electricity, Light, Sound, Waves

### Subcategory pages — `/engineering/*`, `/geography/*`, `/maths/*`, `/music/*`, `/physics/*`
- h1 with subcategory title
- Optional description paragraph(s) specific to the subcategory
- Link "← Back to {parent} overview" returning to the parent category page
- Grid of demo cards filtered to that subcategory, sorted alphabetically
- Subcategory descriptions:

| Subcategory | Description |
|-------------|-------------|
| Geometry | "Geometry is an ancient branch of maths and concerns everything to do with shapes." |
| Light | Two description paragraphs on photon properties and light behavior |
| Astronomy | Paragraph on telescopes and night-sky study |
| All others | No description beyond the back link |

### Demo detail pages — `/demos/:slug` and `/flashcards/:slug`
Each demo page shows:
- h1 with the demo title (Flags of Europe shows "Flags of Europe flashcards", US States shows "US States Map Flashcards flashcards")
- Blurb paragraph from the demo catalogue
- Optional category tag pills below the blurb
- Interactive demo area
- Descriptive copy below
- Flashcard demos include an uppercase "Back to all Flashcards" breadcrumb with `keyboard_double_arrow_left` Material Symbol icon linking to `/flashcards`, placed above the h1

### `/demos/logic-gate-simulator`
- h1 "Logic Gate Simulator"
- Short blurb
- Split layout: interactive board left, toolbar right
- Toolbar:
  - Node type select
  - "Add Node" button
  - "Full screen mode" button
- Board starts with one INPUT toggle (off) and one OUTPUT indicator, unconnected
- Below the board: six reference sections — NOT, AND, NAND, OR, NOR, XOR — each with heading, 100×100 gate symbol, description paragraph, and truth table:

| Gate | Symbol size | Contents |
|------|-------------|----------|
| NOT | 100×100 | Heading, description, truth table |
| AND | 100×100 | Heading, description, truth table |
| NAND | 100×100 | Heading, description, truth table |
| OR | 100×100 | Heading, description, truth table |
| NOR | 100×100 | Heading, description, truth table |
| XOR | 100×100 | Heading, description, truth table |

### `/demos/3d-vector-plotter`
- h1 "3D Vector Plotter"
- Short blurb
- Split layout: 3D canvas left, controls right
- Controls:
  - "Draw" button
  - Vector v1 (Blue) default "(3,-1,4)"
  - Vector v2 (Red) default "(-2,3,1)"
  - Three checkboxes:
    - Resultant (purple)
    - Difference (turquoise)
    - Cross product (green)
  - "Add a Vector" and "Add an Expression" buttons
  - Error message area
- Below: explanatory copy with rendered formulas for vector addition, subtraction, and cross product

### `/demos/19-tet-keyboard`
- h1: "19 TET Keyboard"
- Blurb: Short blurb.
- Layout: SVG keyboard with 20 playable keys in white, black, and grey.
- Controls: Playable keys via mouse and computer keyboard; below explanatory copy on 12-TET vs 19-TET, equal temperament ratios, keyboard layout, and computer keyboard mapping, ending with a keyboard mapping diagram image.

### `/demos/virtual-oscilloscope`
- h1: "Virtual Oscilloscope"
- Blurb: Short blurb.
- Layout: Split layout with oscilloscope screen on the left and controls on the right.
- Controls:
  - Input select (Live / Sine / Square)
  - "Freeze Live Input" checkbox
  - Frequency number and slider with Hz unit
  - Gain number and slider
  - Seconds/div select and volts/div select
  - Horizontal offset slider and vertical offset slider
  - Color scheme select and status area
- Below: explanatory copy on oscilloscope purpose, default signal, live input, freeze, gain, timebase worked example, volts/div example, offsets, four named color schemes, and readonly iframe embed code.

### `/demos/amplitude-modulation`
- h1: "Amplitude Modulation"
- Blurb: Short blurb.
- Layout: Split layout with canvas waveform display on one side and controls on the other.
- Controls: Carrier frequency slider, modulator frequency slider, modulation index slider, and "Hear it" button toggling audio output; below explanatory copy on AM principles with the formula y(t) = A_c [1 + m·cos(2πf_m t)] · cos(2πf_c t) rendered as formatted mathematical notation.

### `/demos/rot-13-cipher`
- h1: "ROT-13 Encrypter/decrypter"
- Blurb: Short blurb.
- Layout: Two text areas side by side with input on the left and output on the right.
- Controls: Live-updating output as the user types; below explanatory copy on ROT-13 as a Caesar cipher with shift 13, its self-inverse property, and historical context.

### `/demos/hypocycloid`
- h1: "Hypocycloid animation"
- Blurb: Short blurb.
- Layout: Canvas showing two circles with animated rolling motion.
- Controls: Inner radius slider, outer radius slider, animation speed slider, and Start/Stop toggle; below explanatory copy on hypocycloid parametric equations.

### `/demos/estimating-pi-monte-carlo`
- h1: "Estimating Pi using the Monte Carlo Method"
- Blurb: Short blurb.
- Layout: Canvas showing unit square with inscribed circle and scattered random points.
- Controls: Start and Stop buttons with live readouts for points inside, total points, and current pi estimate; below explanatory copy on Monte Carlo estimation.

### `/demos/azimuth-calculator`
- h1: "Azimuth Calculator"
- Blurb: Short blurb.
- Layout: Interactive map with a pin marker for origin location and a star marker for target direction, connected by a red line.
- Controls:
  - Dragging either marker updates the azimuth angle in degrees and 16-point compass direction readouts in real time
  - "Set marker to you current location" button uses browser geolocation to center the map and reposition markers
- Below: explanatory copy on azimuth in astronomy and navigation with an azimuth-altitude diagram.

### `/demos/colour-temperature-relationship`
- h1: "Colour-Temperature Relationship"
- Blurb: Short blurb.
- Layout: Kelvin temperature slider with live color swatch display showing the resulting RGB color and hex value.
- Below: explanatory copy on black-body radiation and color temperature.

### `/demos/electric-field-line-simulator`
- h1: "Electric field line simulator"
- Blurb: Short blurb.
- Layout: Canvas showing electric field lines around two point charges.
- Controls:
  - Draggable charge positions and charge value sliders (−5 to +5) for each charge
  - Field lines redraw in real time as charges move or values change
- Below: explanatory copy on electric fields and Coulomb's law.

### `/demos/simple-pendulum`
- h1: "Simple pendulum"
- Blurb: Short blurb.
- Layout: Canvas showing two pendulums side by side.
- Controls:
  - Length sliders (50–500 pixels) for each
  - Start and Reset buttons
- Below: explanatory copy on simple harmonic motion and the pendulum period formula.

### `/demos/geodesics`
- h1: "Geodesics on the Earth"
- Blurb: Short blurb.
- Layout: Interactive map showing two draggable markers connected by a red straight projected line and a purple great-circle geodesic curve.
- Controls:
  - Dragging either marker repositions the origin or destination
  - Readouts for origin coordinates, destination coordinates, and initial heading in degrees update in real time
- Below: explanatory copy on geodesics and map projections.

### `/demos/capital-cities-map`
- h1: "Capital Cities Map"
- Blurb: Short blurb.
- Layout: Interactive world map with circle markers at capital city locations.
- Controls:
  - Clicking a capital city marker opens a popup showing the city name, country name, and a "Zoom In" button
  - Clicking Zoom In centers the map on that capital at zoom level 8
- Below: explanatory copy on capital cities.

### `/flashcards/flags-of-europe` and `/flashcards/us-states`
- h1: "Flags of Europe flashcards" / "US States Map Flashcards flashcards" with short blurb; uppercase "Back to all Flashcards" breadcrumb with `keyboard_double_arrow_left` Material Symbol icon linking to `/flashcards` placed above the h1.
- Blurb: Short blurb for each set.
- Layout: Action bar with "View All Terms", "Shuffle", "Flip All Cards", "Reset"; stage with Previous button, single flashcard, Next button, slide counter with skip-to-start and skip-to-end.
- Controls: Click card to flip between name and image (flag SVG for Europe, US state map SVG for US States); "View All Terms" opens a modal table
  - Flags of Europe shows five columns — #, Country, Flag thumbnail 72×48, Visible checkbox, and Shown side toggle button
  - US States shows three columns — State, Map thumbnail, and Visible checkbox (no Shown side control)
  - Below: for Flags of Europe, "Useful notes" section with seven paragraphs on easily confused flags; for US States, a credits paragraph.

### 404
h1 "Sorry, we can't find what you're looking for". Paragraph with link to `/demos`.

---

## 3. Visual system

### Branding
The Academo header mark is a three-color image asset:
- Composition: transparent PNG combining the teal circular frame, white inner dot, and navy page background showing through the transparent areas
- Desktop: 40px wide by 36px tall, 10px right margin separating it from the wordmark text, vertically middle-aligned to the text baseline
- Mobile (≤760px): scales to 30px by 28px and reverts to static inline positioning
- Wordmark "Academo": Open Sans 32px regular weight, lowercase, white at 95% opacity, positioned 10px below the top edge of the 77px header bar so the combined mark-plus-text sits optically centered
- Browser favicon and Apple touch icon: separate 128×128 PNG placing the same mark centered on a solid navy `#020535` square background

### Colors
| Name | Hex | Use |
|------|-----|-----|
| Page background | `#e9e9e9` | Body |
| Panel / card | `#ffffff` | Content wrapper, nodes, inputs |
| Navy | `#020535` | Header upper bar, favicon background |
| Navy soft | `rgba(2,5,53,0.85)` | Header lower bar |
| Title | `rgba(2,5,53,0.75)` | h1, h2, h3 |
| Ink | `#111111` | Body text |
| Muted | `#555c66` | Secondary text, result count |
| Accent teal | `#1abc9c` | Header divider and teal portion of logo mark image |
| Warm orange | `#ff9900` | Link hover, title hover, active nav, focus outline |
| Line | `#ecf0f1` | Horizontal rules |
| Control bg | `#efefef` | Demo control panels, contact submit button |
| Tag text | `#666666` | Tag pills |
| Tag bg | `#e9e9e9` | Tag pills |
| Tag hover | `#8ddece` | Tag and button hover |
| Button bg | `#dddddd` | Default button |
| Input border | `#cccccc` | Form fields, search, selects |
| Contact input border | `#a9a9a9` | Contact form fields specifically |
| Contact label | `#222222` | Contact form labels |
| Required red | `#ff0000` | Required field asterisk |
| Thumbnail border | `#c8c8c8` | Card images |
| Footer bg | `#11172b` | Footer |
| Error | `#8a1f11` | Error and status messages |
| Contact dotted | `#cccccc` | Contact form header separator, 1px dotted |

Oscilloscope palettes:

| Palette | bg | grid | trace | halo |
|---------|----|------|-------|------|
| Default | `#5db1a2` | `#196156` | `#befde5` | `rgba(174,244,218,0.3)` |
| Dark | `#111` | `#666` | `#fff` | `rgba(255,255,255,0.3)` |
| Light | `#fdfdfd` | `#BBB` | `#111` | `rgba(0,0,0,0.3)` |
| Vintage | `#0d200f` | `#000` | `#dbffdf` | `rgb(120,226,154)` |

Vector colors:

| Role | Hex |
|------|-----|
| Blue (v1) | `#4f81bd` |
| Red (v2) | `#d9534f` |
| Purple (resultant) | `#8064a2` |
| Turquoise (difference) | `#37d8e6` |
| Green (cross) | `#75c841` |
| Orange | `#f79646` |
| Magenta | `#ff00ff` |
| Brown | `#8f3938` (added entries cycle) |

### Typography
Font family "Open Sans", Arial, sans-serif at weights 400, 700, 800. Material Symbols Outlined for navigation and flashcard icons. Contact form uses Lucida Grande / Lucida Sans Unicode / Tahoma stack for labels and header, and Lucida Grande / Tahoma / Arial for inputs. Contact submit button uses Arial.

| Element | Size | Weight | Color | Line height |
|---------|------|--------|-------|-------------|
| Body | 18px (16px ≤760px) | 400 | `#111111` | 1.5 |
| h1 | 48px (34px ≤760px) | — | title token | 1.05 |
| h2 | 30px | — | title token | 1.05 |
| Demo description h2 | 18px | — | title token | 1.2 |
| Homepage popular h2 | 1.5em | 700 | title token at 70% opacity, link inherits | normal |
| Search results h2 | 24px | 700 | title token | normal |
| Contact Us h2 | 20.8px | 400 | `#000000` | normal |
| Lead paragraph | 1.4em | — | — | — |
| Thumbnail title | 14px | 800 | `#333333` → orange hover | — |
| Tag pills | 16px | — | `#666666` | — |
| Nav links | 18px (16px ≤950px) | 400 | white 95% → orange hover | 1.5 |
| Logo wordmark | 32px (26px ≤760px) | 400 | white 95%, lowercase | normal |
| Contact labels | 12.35px | 700 | `#222222` | 18.525px |
| Contact inputs | 13px | — | `#333333` | — |
| Contact button | 15.6px | 400 | `#000000` | — |
| Control labels | 13px | 800 | `#333333` | — |
| Vector / scope controls | 13px–14px | 600–700 | `#333333` / `#555555` | 1.35–1.428 |
| Result count p | 14px | — | muted | — |
| Footer | 15px (13px ≤520px) | — | white | 49px |
| Error/status | 13px | — | `#8a1f11` | — |

### Spacing and layout
- Body: min-width 320px, margin 0
- Wrapper: max-width 1200px, `margin: 20px auto 0`, min-height 100vh, white background, shadow `0 0 3px #c8c8c8`
- Sponsor spacer (every route): 130px minimum height, 90% width centered, 20px bottom margin, 20px vertical padding, flex-centered content area (empty by design as a visual spacer in the homepage layout)
- Main content: width 90% (92% ≤760px, 100% with 10px side padding ≤520px), `padding-bottom: 70px`

- Global header upper bar: 77px tall total, achieved by 25px top and bottom padding around the 32px wordmark positioned 10px below the bar top edge (15px 20px padding and 26px wordmark ≤760px)
- Header lower bar: 10px vertical padding and 20px horizontal padding (12px horizontal ≤520px) with 1px teal top border
- Header inner container: max-width 1200px centered
- Primary navigation: floats right with 20px gap and 40px left margin
  - Includes About, Search, Contact, and Submit an idea links
- Secondary navigation: flex row with 20px gap, max-width 1200px centered, wrapping to multiple rows on narrow viewports
  - Shows All plus six category links (Engineering, Geography, Maths, Music, Physics, Flashcards with stacked-square icon)

- Standard horizontal rule: 20px vertical margin and 1px `#ecf0f1` top border
  - Large variant: 60px vertical margin
- Paragraph bottom margin: 20px
- Intro paragraphs: max-width 650px centered
- About paragraphs: max-width 620px
- Contact section: max-width 600px
- Demo description paragraphs: max-width 880px
- Search panel on `/demos`: max-width 540px, 8px grid gap, 30px top margin auto-centered
- On `/search` panel: block layout with no max-width, left-aligned, same top margin
- Contact form: 15px vertical gap between fields
- Contact Us header: 1px dotted `#cccccc` bottom border, 14.3px bottom padding, 5px bottom margin, and 1% horizontal padding
- Name and Email field containers: 50% width on desktop
- Labels: 3px bottom padding
- Inputs: 8px padding and 44px minimum height
  - Textarea minimum height: 136px
- Submit button: 0 7px horizontal padding and no vertical padding, relying on its 22px height plus 2px outset border

Tag pills have 8px 12px padding, 44px minimum height, 10px gap between pills, centered overall (left-aligned ≤520px except intro tags which stay centered). Buttons in toolbars have 44px minimum height (contact and logic toolbar) or 38px (vector actions), with 10px 16px or 9px 12px padding respectively.

### Card dimensions
Demo thumbnail image uses aspect-ratio 260/170 with 1px `#c8c8c8` border; opacity transitions to 0.85 on hover over 0.25s. Title has 10px top margin, 14px 800 weight, color transitions to orange over 0.25s. Card grid gap 28px row / 24px column. Images inside cards use content-box sizing so the 1px border sits outside the 260px content width.

For the Homepage popular section dimensions, see §2 `/` — Homepage (popular demos grid) where the per-surface card layout is documented with its surface.

### Breakpoints
| Width | Behavior |
|-------|----------|
| ≤950px | Demo card grid 4→3 columns. Contact grid and demo placeholder switch to single column. Logic gate, vector plotter, oscilloscope, and other two-column demo layouts switch to single-column stacked layout. Nav link font 18→16px. Fullscreen toolbar shrinks to 220px max. |
| ≤760px | Body text 18→16px. h1 48→34px. Header upper padding 25→15px 20px. Logo wordmark 32→26px, mark image 40×36→30×28, logo positioning becomes static inline. Primary nav wraps below logo instead of floating right. Main width 90→92% with 34px top padding. Card grid 3→2 columns. |
| ≤520px | Header lower side padding 20→12px. Main 92→100% width with 10px side padding. Tags left-align (intro stays centered). Footer left-aligns, text 15→13px. |

### Component dimensions

Per-surface component dimensions are documented with their Product Surfaces in §2 (Homepage popular grid, logic gate toolbar, flashcard image, 19 TET SVG, oscilloscope embed, contact header, breadcrumb) and via the shared grid rules in §3 Spacing and layout. The shared canvas-container and range-input dimensions above apply across the split-layout demos.

---

## 4. Acceptance Criteria

The following verification matrix summarizes high-signal checks for the product. For per-surface interaction details, see §2 Product Surfaces where each surface documents its content, layout, and behavior; this section verifies outcomes without duplicating those descriptions.

| Area | Verify |
|------|--------|
| Navigation | Client-side routing: clicking any internal link updates the URL and renders the target page without full reload; category/subcategory filters, demo-card navigation, and flashcard breadcrumb each resolve correctly |
| Search | On `/search`, empty query shows no cards and no heading; typing filters by title/category/tags/description substring and shows `Search results` h2 with live result count; no-results shows `No matching demos. Try a broader subject or clear the search field.` |
| Contact | Form Name/Email/message with required labels and native validation; submit opens mailto `hello@academo.org` |
| Demos — Logic Gate | Add Node places node; INPUT toggle updates outputs; drag creates/removes wires; Full Screen Mode toggles correctly |
| Demos — 3D Vector | Draw renders vectors or shows error naming invalid field; Add Vector/Expression appends inputs; 3D drag rotates and scroll zooms |
| Demos — 19 TET | Pressing SVG or keyboard key plays sine tone with highlight; release stops tone |
| Demos — Oscilloscope | Input Live requests mic and disables frequency controls; Sine/Square enables them; Freeze, gain, timebase, offsets, and color scheme each update waveform as described |
| Demos — AM / ROT-13 / Hypocycloid / Pi / Azimuth / Colour / E-Field / Pendulum / Geodesics / Capitals | Each demo's primary interaction (AM frequency sliders + Hear toggle; ROT-13 live transform; Hypocycloid radius + Start/Stop; Pi Start/Stop with live estimate; Azimuth marker drag + geolocation; Colour Kelvin slider; E-Field drag + charge slider; Pendulum length + Start/Reset; Geodesics marker drag with readouts; Capitals marker popup + Zoom In) produces the described real-time updates |
| Flashcards | Card flip between name/image; View All Terms modal with per-set table (Flags: 5 columns including Shown side; US States: 3 columns); Shuffle/Flip All/Reset/Previous/Next/Skip and Visibility/Shown side toggles; keyboard Shift/ArrowLeft/ArrowRight; empty-state `No visible flashcards` with disabled nav and 0/0 counter |
| Global | Responsive breakpoints 950/760/520 collapse as specified; accessibility landmarks, aria-current, live regions, focus outline, and alt text as in §5; animations and transitions as in §3 |

---

## 5. Global Accessibility Requirements

- Landmarks: header with labeled navigation, main, footer, sections with aria-labelledby, search form with role search, dialog with role dialog and aria-modal
- Headings: one h1 per page, hierarchical h2/h3/h5
- Navigation: active nav link marked aria-current page; toggle buttons use aria-pressed
- Live regions: aria-live polite on search results, result count, demo list, and flashcard carousel
- Forms: inputs paired with labels; required fields marked required and indicated visually with red asterisk
- Images: descriptive alt text for meaningful imagery; decorative images aria-hidden or empty alt
- Keyboard: SVG keys have role button, tabindex, and aria-label; flashcard flip button and breadcrumb link have accessible names
- Focus: visible outline 3px solid orange with 3px offset on all interactive elements; color is never the sole indicator

---

## 6. Global Content and Data

This section inventories reusable content and assets mapped to Product Surfaces in §2. The following subsections list the public asset inventory and outbound attribution links that are part of Global Content and Data.

### Asset inventory

| Asset group | Public paths |
|-------------|--------------|
| Demo thumbnails | `public/assets/demos/19-tet-keyboard.png`, `public/assets/demos/3d-vector-plotter.png`, `public/assets/demos/amplitude-modulation.png`, `public/assets/demos/azimuth-calculator.png`, `public/assets/demos/capital-cities-map.png`, `public/assets/demos/colour-temperature-relationship.png`, `public/assets/demos/electric-field-line-simulator.png`, `public/assets/demos/estimating-pi-monte-carlo.png`, `public/assets/demos/flags-of-europe.png`, `public/assets/demos/geodesics.png`, `public/assets/demos/hypocycloid.png`, `public/assets/demos/logic-gate-simulator.png`, `public/assets/demos/rot-13-cipher.png`, `public/assets/demos/simple-pendulum.png`, `public/assets/demos/us-states-map.png`, `public/assets/demos/virtual-oscilloscope.png` |
| Logic gate | `public/assets/demos/logic-gate-graph-paper.png`, `public/assets/logic-symbols/and.svg`, `public/assets/logic-symbols/and3.svg`, `public/assets/logic-symbols/nand.svg`, `public/assets/logic-symbols/nor.svg`, `public/assets/logic-symbols/not.svg`, `public/assets/logic-symbols/or.svg`, `public/assets/logic-symbols/xor.svg` |

19 TET — `public/assets/19-tet/keyboard.png`.

| Asset subgroup | Paths / notes |
|---------------|---------------|
| Flags of Europe | 51 SVG files in `public/assets/flags/europe/` named by ISO code: `ad.svg`, `al.svg`, `am.svg`, `at.svg`, `az.svg`, `ba.svg`, `be.svg`, `bg.svg`, `by.svg`, `ch.svg`, `cy.svg`, `cz.svg`, `de.svg`, `dk.svg`, `ee.svg`, `es.svg`, `fi.svg`, `fr.svg`, `gb.svg`, `ge.svg`, `gr.svg`, `hr.svg`, `hu.svg`, `ie.svg`, `is.svg`, `it.svg`, `kz.svg`, `li.svg`, `lt.svg`, `lu.svg`, `lv.svg`, `mc.svg`, `md.svg`, `me.svg`, `mk.svg`, `mt.svg`, `nl.svg`, `no.svg`, `pl.svg`, `pt.svg`, `ro.svg`, `rs.svg`, `ru.svg`, `se.svg`, `si.svg`, `sk.svg`, `sm.svg`, `tr.svg`, `ua.svg`, `va.svg`, `xk.svg` |
| US States | SVG files in `public/assets/us-states/` named by state slug (e.g. `alabama.svg`, `alaska.svg`, `columbia.svg` for Washington D.C.) |
| Brand and publication logos | `public/assets/logos/academo-mark.png` (three-color transparent PNG used in header at 40×36px desktop, 30×28px ≤760px), `public/assets/logos/academo-favicon.png` (128×128 PNG with mark centered on navy `#020535` square, used for favicon and Apple touch icon), `public/assets/logos/html5-weekly.png`, `public/assets/logos/jce.png`, `public/assets/logos/oer.png`, `public/assets/logos/science-in-school.png` |
| Fonts and icons | Open Sans 400/700/800 and Material Symbols Outlined. Material Symbols used for Flashcards navigation icon (`auto_awesome_motion` stacked squares), Flags breadcrumb icon (`keyboard_double_arrow_left`), and flashcard action bar icons. |

---

### External links and attributions

The following outbound links are part of Global Content and Data and appear on the surfaces noted; all open in a new tab with `rel="noreferrer"` except where noted:

- **CodePen** — on the Amplitude Modulation demo page, an "Open with CodePen" link to `https://codepen.io/pen/` with tooltip "CodePen is a free online tool for editing and writing code."
- **OpenStreetMap attribution** — on the Azimuth Calculator, Geodesics on the Earth, and Capital Cities Map demos, the map tile layer attribution links to `https://www.openstreetmap.org/copyright` crediting OpenStreetMap contributors.
- **GitHub flag credits** — in the Flags of Europe useful notes section, a credits link to `https://github.com/hampusborgos/country-flags` attributing the flag image source.
- **Wikimedia state-map credits** — in the US States Map Flashcards credits section, a link to the Wikimedia Commons page for the public-domain blank US map SVG.
- **Browser cookie help** — on the Cookie Policy page, links to official support documents for Chrome (`support.google.com`), Safari (`support.apple.com`), Firefox (`support.mozilla.org`), and Internet Explorer (`support.microsoft.com`).
- **mailto links** — on Contact, Submit an idea, Privacy Policy, and Cookie Policy pages, mailto links to `hello@academo.org` open the user's email client; these are not external web links.

All other navigation stays within local routes.
