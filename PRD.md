# Academo — Product Requirements Document

## 1. Product purpose and audience

Academo is a free directory of interactive educational demonstrations for students, teachers, and self-guided learners. No registration, no fees, no backend services. Five subject areas — Engineering, Maths, Music, Physics, Flashcards — each with at least one fully interactive demo. The site is a static single-page application.

Reference screenshots in `screenshots/` capture the target visual style for homepage, demo directory, category pages, and each demo detail page.

---

## 2. Route-level visible requirements

### `/` — Homepage
Centered h1 "Academo". Intro paragraph stating the site is a free collection of interactive educational demos with no registration required, with inline link to `/demos`. Subject tag row linking to the five category pages. Section heading "Some of our most popular demos." on one line and "Visit the demos page to browse all our demos." on the next, with "browse all our demos" linked to `/demos`. Below the heading, three demo cards in a centered row: Virtual Oscilloscope, 3D Vector Plotter, Logic Gate Simulator. Section "Featured around the web" with four publication logos in a row.

### `/demos` — All demos
h1 "All demos". Paragraph introducing the demo list as reusable Academo-style thumbnail cards. Subject tag row. Search form labeled "Search demos" with placeholder "Try audio, flags, vectors, logic". Live result count paragraph. Grid of all five demo cards, filtered on every keystroke.

### `/search`
h1 "What would you like to explore?" followed by a horizontal rule, then a left-aligned search field 314px wide and 36px tall with accessible name "Search demos" and placeholder "Type here...". No cards, no result heading, and no result count appear on initial load. After the user types, a left-aligned h2 "Search results" appears above the filtered grid.

### `/about`
h1 "About Academo". Lead paragraph describing Academo as a free open-source hub of interactive educational demonstrations. Two body paragraphs on HTML and JavaScript implementation and community contributions.

### `/contact`
h1 "Get in touch". Introductory paragraph: "You can find Academo on Twitter at @AcademoOrg, and on Facebook at academo.org. Alternatively, if you'd like to send us a message, you can use the form below." The form opens with an h2 "Contact Us" in regular-weight Lucida type, underlined by a 1px dotted grey separator. Below: Name field and Email field each at 50% width, stacked vertically on narrow screens, followed by full-width Your message textarea. Labels use bold compact Lucida Grande at 12.35px with 3px bottom padding and a red asterisk for required fields. Input fields have 1px `#a9a9a9` borders, 8px padding, white background, 13px Lucida Grande Tahoma Arial text, and 44px minimum height; the message textarea is 136px tall minimum and vertically resizable. The Submit button uses native operating-system styling — 22px visible height, 2px outset `#767676` border, `#efefef` background, black Arial 15.6px text, 0 7px padding, no border radius — with an invisible 11px top and bottom extension bringing the accessible hit area to 44px. Submitting opens the user's mail client addressed to `hello@academo.org`.

### Category pages — `/engineering`, `/maths`, `/music`, `/physics`, `/flashcards`
h1 with category label (Flashcards shows "All flashcards"). One category description paragraph unique to each subject. Grid of demo cards filtered to that category.

### `/demos/logic-gate-simulator`
h1 "Logic Gate Simulator". Short blurb. Interactive board left, toolbar right. Toolbar: node type select, "Add Node" button, "Full screen mode" button. Board starts with one INPUT toggle (off) and one OUTPUT indicator, unconnected. Below the board: six reference sections — NOT, AND, NAND, OR, NOR, XOR — each with heading, 100×100 gate symbol, description paragraph, and truth table.

### `/demos/3d-vector-plotter`
h1 "3D Vector Plotter". Short blurb. Split layout: 3D canvas left, controls right. Controls: "Draw" button, Vector v1 (Blue) default "(3,-1,4)", Vector v2 (Red) default "(-2,3,1)", three checkboxes for resultant (purple), difference (turquoise), and cross product (green), "Add a Vector" and "Add an Expression" buttons, error message area. Below: explanatory copy with rendered formulas for vector addition, subtraction, and cross product.

### `/demos/19-tet-keyboard`
h1 "19 TET Keyboard". Short blurb. SVG keyboard with 20 playable keys in white, black, and grey. Below: explanatory copy on 12-TET vs 19-TET, equal temperament ratios, keyboard layout, and computer keyboard mapping, ending with a keyboard mapping diagram image.

### `/demos/virtual-oscilloscope`
h1 "Virtual Oscilloscope". Short blurb. Split layout: oscilloscope screen left, controls right. Controls in order: Input select (Live / Sine / Square), "Freeze Live Input" checkbox, frequency number and slider with Hz unit, gain number and slider, seconds/div select, volts/div select, horizontal offset slider, vertical offset slider, color scheme select, status area. Below: explanatory copy on oscilloscope purpose, default signal, live input, freeze, gain, timebase worked example, volts/div example, offsets, four named color schemes, and readonly iframe embed code.

### `/demos/flags-of-europe` and `/flashcards/flags-of-europe`
Uppercase "Back to all Flashcards" breadcrumb with `keyboard_double_arrow_left` Material Symbol icon, linking to `/flashcards`, placed above the h1. Then h1 "Flags of Europe flashcards" and short blurb. Action bar with "View All Terms", "Shuffle", "Flip All Cards", "Reset". Stage with Previous button, single flashcard, Next button, slide counter "Current slide: N / 51" with skip-to-start and skip-to-end. Click card to flip between country name and flag image. "View All Terms" opens modal table of all 51 cards with visible checkbox and shown-side toggle per row. Below: "Useful notes" section with seven paragraphs on easily confused flags. The Flashcards item in the secondary navigation uses the stacked-square `auto_awesome_motion` Material Symbol.

### 404
h1 "Sorry, we can't find what you're looking for". Paragraph with link to `/demos`.

---

## 3. Visual system

### Branding
The Academo header mark is a three-color image asset: a transparent PNG combining the teal circular frame, white inner dot, and navy page background showing through the transparent areas. It renders at 40px wide by 36px tall on desktop, with 10px right margin separating it from the wordmark text, vertically middle-aligned to the text baseline. On viewports 760px and below the mark scales to 30px by 28px and reverts to static inline positioning. The wordmark "Academo" is set in Open Sans 32px regular weight, lowercase, white at 95% opacity, positioned 10px below the top edge of the 77px header bar so the combined mark-plus-text sits optically centered. The browser favicon and Apple touch icon use a separate 128×128 PNG placing the same mark centered on a solid navy `#020535` square background.

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

Oscilloscope palettes — Default: bg `#5db1a2`, grid `#196156`, trace `#befde5`, halo `rgba(174,244,218,0.3)`. Dark: `#111` / `#666` / `#fff` / `rgba(255,255,255,0.3)`. Light: `#fdfdfd` / `#BBB` / `#111` / `rgba(0,0,0,0.3)`. Vintage: `#0d200f` / `#000` / `#dbffdf` / `rgb(120,226,154)`.

Vector colors — Blue `#4f81bd` (v1), Red `#d9534f` (v2), Purple `#8064a2` (resultant), Turquoise `#37d8e6` (difference), Green `#75c841` (cross), Orange `#f79646`, Magenta `#ff00ff`, Brown `#8f3938` (added entries cycle).

### Typography
Font family "Open Sans", Arial, sans-serif loaded from Google Fonts at weights 400, 700, 800. Material Symbols Outlined loaded for navigation and flashcard icons. Contact form uses Lucida Grande / Lucida Sans Unicode / Tahoma stack for labels and header, and Lucida Grande / Tahoma / Arial for inputs. Contact submit button uses Arial.

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
Body min-width 320px, margin 0. Wrapper max-width 1200px, `margin: 20px auto 0`, min-height 100vh, white background, shadow `0 0 3px #c8c8c8`. Every route begins with a sponsor spacer: 130px minimum height, 90% width centered, 20px bottom margin, 20px vertical padding, flex-centered content area (currently empty by design to preserve original page rhythm). Main content width 90% (92% ≤760px, 100% with 10px side padding ≤520px), `padding-bottom: 70px`.

Global header upper bar is 77px tall total, achieved by 25px top and bottom padding around the 32px wordmark positioned 10px below the bar top edge (15px 20px padding and 26px wordmark ≤760px). Header lower bar has 10px vertical padding and 20px horizontal padding (12px horizontal ≤520px) with 1px teal top border. Header inner container max-width 1200px centered. Primary navigation floats right with 20px gap and 40px left margin; secondary navigation is a flex row with 20px gap, max-width 1200px centered, wrapping to multiple rows on narrow viewports.

Standard horizontal rule has 20px vertical margin and 1px `#ecf0f1` top border; large variant 60px vertical margin. Paragraph bottom margin 20px. Intro paragraphs max-width 650px centered. About paragraphs max-width 620px. Contact section max-width 600px. Demo description paragraphs max-width 880px.

Search panel on `/demos` has max-width 540px, 8px grid gap, 30px top margin auto-centered. On `/search` the panel is block layout with no max-width, left-aligned, same top margin. The search input on `/search` is 314px wide (shrinking to 100% below that) and 36px tall with 5px padding and 16px font size.

Contact form uses 15px vertical gap between fields. The Contact Us header has 1px dotted `#cccccc` bottom border, 14.3px bottom padding, 5px bottom margin, and 1% horizontal padding. Name and Email field containers are 50% width on desktop. Labels have 3px bottom padding. Inputs have 8px padding and 44px minimum height; textarea minimum height 136px. The Submit button has 0 7px horizontal padding and no vertical padding, relying on its 22px height plus 2px outset border.

Tag pills have 8px 12px padding, 44px minimum height, 10px gap between pills, centered overall (left-aligned ≤520px except intro tags which stay centered). Buttons in toolbars have 44px minimum height (contact and logic toolbar) or 38px (vector actions), with 10px 16px or 9px 12px padding respectively.

### Card dimensions and homepage popular section
Demo thumbnail image uses aspect-ratio 260/170 with 1px `#c8c8c8` border; opacity transitions to 0.85 on hover over 0.25s. Title has 10px top margin, 14px 800 weight, color transitions to orange over 0.25s. Standard card grid uses 28px row gap and 24px column gap.

On the homepage popular section, the heading uses 1.5em size, 700 weight, normal line height, 0.83em vertical margin, centered, with the link portion in title color at 70% opacity shifting to orange on hover. The card list below uses flex wrap centered, with negative 18px horizontal margin on the container to offset card margins. Each card list item is `calc(25% − 40px)` wide with 20px margin on all sides, producing 44px horizontal space between adjacent cards (20px right margin + 4px flex gap + 20px left margin) and 40px vertical space between rows (20px bottom + 20px top). Images inside popular cards use content-box sizing so the 1px border sits outside the 260px content width.

### Breakpoints
| Width | Behavior |
|-------|----------|
| ≤950px | Demo card grid 4→3 columns. Contact grid and demo placeholder switch to single column. Logic gate, vector plotter, and oscilloscope switch from two-column to single-column stacked layout. Nav link font 18→16px. Fullscreen toolbar shrinks to 220px max. |
| ≤760px | Body text 18→16px. h1 48→34px. Header upper padding 25→15px 20px. Logo wordmark 32→26px, mark image 40×36→30×28, logo positioning becomes static inline. Primary nav wraps below logo instead of floating right. Main width 90→92% with 34px top padding. Card grid 3→2 columns. |
| ≤520px | Header lower side padding 20→12px. Main 92→100% width with 10px side padding. Tags left-align (intro stays centered). Footer left-aligns, text 15→13px. |

### Component dimensions
Featured logos max 160px wide in 84px minimum height containers with 20px margin, grayscale 100% at 60% opacity shifting to color and full opacity on hover. Logic gate node 80×80px white card; ports 12px circles; toolbar 240px wide with 20px padding and 16px gap; fullscreen toolbar fixed 32px from viewport edges (16px ≤950px) at 240px width (220px ≤950px) with shadow. Vector plotter and oscilloscope layouts use 1fr + 270px grid, 20px gap, stacking at 950px; canvas containers min-height 280px with 1px `#d9d9d9` border. Range inputs 10px track height with custom fill gradient; thumb 16×18px. Flashcard image 320×210; table thumbnail 72×48. Gate symbol images 100×100. 19 TET SVG viewBox 0 0 184 120; white keys 23×120, black 13×80, grey 13×50. Keyboard mapping diagram 500×324. Oscilloscope embed textarea max 620px wide, 48px minimum height. Contact form header h2 at 20.8px regular weight in Lucida stack with dotted separator below.

---

## 4. Verifiable interactions

- Clicking any internal navigation link updates the URL and renders the target page without full reload.
- Typing in the search input filters demo cards by title, category, tags, or description substring and updates the result count live.
- On `/search`, no cards or result heading appear until text is entered; typing shows the "Search results" h2 and filtered grid.
- Submitting the contact form opens the user's mail client addressed to `hello@academo.org` with the form contents.
- In Logic Gate Simulator, selecting a node type and clicking Add Node places a new node on the board.
- Clicking an INPUT node's switch toggles its state and updates connected outputs visually.
- Clicking a node's remove button deletes the node and clears its wire connections.
- Dragging a node repositions it within the board and redraws connected wires during drag.
- Dragging from an output port to an input port creates a wire connection.
- Dragging away from a connected input port removes that wire.
- Clicking Full Screen Mode expands the simulator to viewport; button toggles to Exit Full Screen.
- In 3D Vector Plotter, clicking Draw renders the entered vectors as colored arrows in the 3D scene or shows an error naming the invalid field.
- Clicking Add a Vector appends a new vector input with sequential id and next palette color.
- Clicking Add an Expression appends a new expression input.
- Clicking a vector endpoint in the 3D scene displays that vector's label and components.
- Dragging in the 3D canvas rotates the view; scrolling zooms.
- In 19 TET Keyboard, pressing a key in the SVG or on the computer keyboard plays the corresponding sine tone and highlights the key; releasing stops the tone.
- In Virtual Oscilloscope, changing the Input select to Live requests microphone permission and switches to live audio and disables frequency controls; Sine or Square switches to generated signal and enables frequency controls.
- Checking Freeze Live Input holds the current waveform frame static.
- Adjusting frequency, gain, timebase, volts/div, or offset controls rescales or repositions the waveform in real time.
- Changing color scheme recolors the oscilloscope screen immediately.
- In Flags of Europe, clicking the "Back to all Flashcards" breadcrumb navigates to `/flashcards`.
- Clicking the flashcard flips between country name and flag image.
- Clicking Previous or Next navigates cards; buttons disable at ends. Skip buttons jump to first or last.
- Clicking Shuffle randomizes card order.
- Clicking Flip All Cards toggles every card's face.
- Clicking Reset restores all cards visible and showing flag face.
- Clicking View All Terms opens a modal table; Close or backdrop click dismisses it.
- Unchecking a Visible checkbox in the table hides that card from the carousel.
- Clicking a Shown side button in the table flips that individual card.
- Pressing Shift flips the current card; ArrowLeft and ArrowRight navigate.

---

## 5. Responsive, accessibility, animation, and error states

**Responsive:** Minimum supported width 320px. Layouts stack from two-column to single-column at 950px for demos with sidebars. Card grid collapses 4→3→2→1 columns across breakpoints. Header navigation wraps to multiple rows. All interactive targets meet 44px minimum height where specified; contact submit button achieves this via invisible hit-area extension.

**Accessibility:** Semantic landmarks — header with labeled navigation, main, footer, sections with aria-labelledby, search form with role search, dialog with role dialog and aria-modal. One h1 per page, hierarchical h2/h3. Active nav link marked aria-current page. Toggle buttons use aria-pressed. Live regions (aria-live polite) on search results, result count, demo list, and flashcard carousel. Form inputs paired with labels; required fields marked required and indicated visually with red asterisk. Images have descriptive alt text; decorative images aria-hidden or empty alt. SVG keyboard keys have role button, tabindex, and aria-label. Flashcard flip button and breadcrumb link have accessible names including country name or destination. Focus visible outline 3px solid orange with 3px offset on all interactive elements. Color is never the sole indicator.

**Animation:** Links and buttons transition color, background, border, and opacity over 0.25s. Thumbnail image opacity 0.85 on hover over 0.25s; title color to orange over 0.25s. Publication logos transition grayscale filter and opacity over 0.5s on hover-out, instant on hover-in. Flashcard uses CSS 3D flip transform. Vector plotter camera uses damping for smooth orbit inertia. 19 TET audio uses 15ms attack and 30ms release ramps. Oscilloscope redraws at animation frame rate. Range input fill updates instantly on input.

**Error and empty states:** No search results shows full-width card with "No matching demos. Try a broader subject or clear the search field." On `/search`, empty query shows no cards and no heading at all. Vector plotter shows red error text naming the invalid field; readout hides when empty. Oscilloscope shows red status text for missing microphone permission or unsupported browser and reverts to sine wave. 19 TET shows upgrade message if Web Audio unavailable. Flags with no visible cards shows "No visible flashcards. Open All Flashcards to make cards visible again." with disabled nav buttons and 0/0 counter. Corrupted flashcard storage resets silently to initial state. Contact form uses native browser validation blocking submit on empty or invalid email. Unrecognized route shows 404 with link to demos.

---

## 6. Asset references

Demo thumbnails — `public/assets/demos/19-tet-keyboard.png`, `public/assets/demos/3d-vector-plotter.png`, `public/assets/demos/flags-of-europe.png`, `public/assets/demos/logic-gate-simulator.png`, `public/assets/demos/virtual-oscilloscope.png`.

Logic gate — `public/assets/demos/logic-gate-graph-paper.png`, `public/assets/logic-symbols/and.svg`, `public/assets/logic-symbols/and3.svg`, `public/assets/logic-symbols/nand.svg`, `public/assets/logic-symbols/nor.svg`, `public/assets/logic-symbols/not.svg`, `public/assets/logic-symbols/or.svg`, `public/assets/logic-symbols/xor.svg`.

19 TET — `public/assets/19-tet/keyboard.png`.

Flags of Europe — 51 SVG files in `public/assets/flags/europe/` named by ISO code: `ad.svg`, `al.svg`, `am.svg`, `at.svg`, `az.svg`, `ba.svg`, `be.svg`, `bg.svg`, `by.svg`, `ch.svg`, `cy.svg`, `cz.svg`, `de.svg`, `dk.svg`, `ee.svg`, `es.svg`, `fi.svg`, `fr.svg`, `gb.svg`, `ge.svg`, `gr.svg`, `hr.svg`, `hu.svg`, `ie.svg`, `is.svg`, `it.svg`, `kz.svg`, `li.svg`, `lt.svg`, `lu.svg`, `lv.svg`, `mc.svg`, `md.svg`, `me.svg`, `mk.svg`, `mt.svg`, `nl.svg`, `no.svg`, `pl.svg`, `pt.svg`, `ro.svg`, `rs.svg`, `ru.svg`, `se.svg`, `si.svg`, `sk.svg`, `sm.svg`, `tr.svg`, `ua.svg`, `va.svg`, `xk.svg`.

Brand and publication logos — `public/assets/logos/academo-mark.png` (three-color transparent PNG used in header at 40×36px desktop, 30×28px ≤760px), `public/assets/logos/academo-favicon.png` (128×128 PNG with mark centered on navy `#020535` square, used for favicon and Apple touch icon), `public/assets/logos/html5-weekly.png`, `public/assets/logos/jce.png`, `public/assets/logos/oer.png`, `public/assets/logos/science-in-school.png`.

Fonts and icons — Open Sans 400/700/800 loaded from Google Fonts. Material Symbols Outlined loaded from Google Fonts and used for the Flashcards navigation icon (`auto_awesome_motion` stacked squares) and the Flags breadcrumb icon (`keyboard_double_arrow_left`).

---

## 7. Intentional scope exclusions

No user accounts, registration, or authentication. No backend APIs, databases, or server-side rendering. No analytics, tracking, or ad scripts. No social embeds, share buttons, or comments. No donation or sponsor links. No external outbound links in the application surface. No video, 3D model files, or prerecorded audio assets. No email sending backend — contact uses mailto handoff only. No geography category beyond Flags of Europe flashcards. No demo functionality beyond the five specified interactive demos.
