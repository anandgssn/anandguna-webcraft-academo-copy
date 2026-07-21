type Flashcard = {
  id: number;
  country: string;
  code: string;
};

type FlashcardState = Flashcard & {
  faceVisible: "front" | "back";
  status: "visible" | "hidden";
};

const STORAGE_KEY = "flags-of-europe.html";
const preloadedFlagImages: HTMLImageElement[] = [];
let hasPreloadedFlagImages = false;

const FLAGS: Flashcard[] = [
  { id: 1, country: "Albania", code: "al" },
  { id: 2, country: "Andorra", code: "ad" },
  { id: 3, country: "Armenia", code: "am" },
  { id: 4, country: "Austria", code: "at" },
  { id: 5, country: "Azerbaijan", code: "az" },
  { id: 6, country: "Belarus", code: "by" },
  { id: 7, country: "Belgium", code: "be" },
  { id: 8, country: "Bosnia and Herzegovina", code: "ba" },
  { id: 9, country: "Bulgaria", code: "bg" },
  { id: 10, country: "Croatia", code: "hr" },
  { id: 11, country: "Cyprus", code: "cy" },
  { id: 12, country: "Czech Republic", code: "cz" },
  { id: 13, country: "Denmark", code: "dk" },
  { id: 14, country: "Estonia", code: "ee" },
  { id: 15, country: "Finland", code: "fi" },
  { id: 16, country: "France", code: "fr" },
  { id: 17, country: "Georgia", code: "ge" },
  { id: 18, country: "Germany", code: "de" },
  { id: 19, country: "Greece", code: "gr" },
  { id: 20, country: "Hungary", code: "hu" },
  { id: 21, country: "Iceland", code: "is" },
  { id: 22, country: "Ireland", code: "ie" },
  { id: 23, country: "Italy", code: "it" },
  { id: 24, country: "Kazakhstan", code: "kz" },
  { id: 25, country: "Kosovo", code: "xk" },
  { id: 26, country: "Latvia", code: "lv" },
  { id: 27, country: "Liechtenstein", code: "li" },
  { id: 28, country: "Lithuania", code: "lt" },
  { id: 29, country: "Luxembourg", code: "lu" },
  { id: 30, country: "Malta", code: "mt" },
  { id: 31, country: "Moldova", code: "md" },
  { id: 32, country: "Monaco", code: "mc" },
  { id: 33, country: "Montenegro", code: "me" },
  { id: 34, country: "Netherlands", code: "nl" },
  { id: 35, country: "North Macedonia", code: "mk" },
  { id: 36, country: "Norway", code: "no" },
  { id: 37, country: "Poland", code: "pl" },
  { id: 38, country: "Portugal", code: "pt" },
  { id: 39, country: "Romania", code: "ro" },
  { id: 40, country: "Russia", code: "ru" },
  { id: 41, country: "San Marino", code: "sm" },
  { id: 42, country: "Serbia", code: "rs" },
  { id: 43, country: "Slovakia", code: "sk" },
  { id: 44, country: "Slovenia", code: "si" },
  { id: 45, country: "Spain", code: "es" },
  { id: 46, country: "Sweden", code: "se" },
  { id: 47, country: "Switzerland", code: "ch" },
  { id: 48, country: "Turkey", code: "tr" },
  { id: 49, country: "Ukraine", code: "ua" },
  { id: 50, country: "United Kingdom", code: "gb" },
  { id: 51, country: "Vatican City", code: "va" }
];

function createInitialState(): FlashcardState[] {
  return FLAGS.map((flag) => ({
    ...flag,
    faceVisible: "back",
    status: "visible"
  }));
}

function readStoredState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return createInitialState();
    }

    const parsed = JSON.parse(saved) as FlashcardState[];
    const validIds = new Set(FLAGS.map((flag) => flag.id));
    const hasAllCards = parsed.length === FLAGS.length && parsed.every((card) => validIds.has(card.id));

    return hasAllCards ? parsed : createInitialState();
  } catch {
    return createInitialState();
  }
}

function saveState(cards: FlashcardState[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function flagPath(code: string) {
  return `/assets/flags/europe/${code}.svg`;
}

export function preloadFlagsOfEuropeAssets() {
  if (hasPreloadedFlagImages) {
    return;
  }

  hasPreloadedFlagImages = true;
  FLAGS.forEach((flag) => {
    const image = new Image();
    image.decoding = "async";
    image.src = flagPath(flag.code);
    preloadedFlagImages.push(image);
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shuffleCards(cards: FlashcardState[]) {
  const next = [...cards];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function mountFlagsOfEurope(root: HTMLElement) {
  preloadFlagsOfEuropeAssets();

  let cards = readStoredState();
  let currentIndex = 0;
  let allPanelOpen = false;

  function getVisibleCards() {
    return cards.filter((card) => card.status === "visible");
  }

  function getCurrentCard() {
    return getVisibleCards()[currentIndex];
  }

  function clampCurrentIndex() {
    const visibleCount = getVisibleCards().length;
    currentIndex = Math.min(currentIndex, Math.max(visibleCount - 1, 0));
  }

  function updateCard(cardId: number, updater: (card: FlashcardState) => FlashcardState) {
    cards = cards.map((card) => (card.id === cardId ? updater(card) : card));
    saveState(cards);
  }

  function renderCard(card: FlashcardState) {
    const isFlipped = card.faceVisible === "front" ? "" : " flip";
    const country = escapeHtml(card.country);

    return `
      <div class="flags-slide" data-flashcard-id="${card.id}">
        <button class="flags-flip-container${isFlipped}" type="button" data-action="flip-current" aria-label="Flip ${country} flashcard">
          <span class="flags-flipper">
            <span class="flags-card-face flags-card-front">
              <span class="flags-card-term">Country</span>
              <span class="flags-country">${country}</span>
              <span class="flags-front-border"></span>
            </span>
            <span class="flags-card-face flags-card-back">
              <span class="flags-card-term">Flag</span>
              <img src="${flagPath(card.code)}" alt="Flag of ${country}" width="320" height="210" loading="eager" decoding="sync" fetchpriority="high">
              <span class="flags-back-border"></span>
            </span>
          </span>
        </button>
      </div>
    `;
  }

  function renderAllPanel() {
    if (!allPanelOpen) {
      return "";
    }

    const rows = cards
      .map((card) => {
        const country = escapeHtml(card.country);
        const checked = card.status === "visible" ? " checked" : "";
        const face = card.faceVisible === "front" ? "Country" : "Flag";

        return `
          <tr>
            <td>${card.id}</td>
            <td>${country}</td>
            <td><img src="${flagPath(card.code)}" alt="Flag of ${country}" width="72" height="48" loading="eager" decoding="async"></td>
            <td><input type="checkbox" data-action="toggle-visible" data-card-id="${card.id}"${checked} aria-label="Show ${country}"></td>
            <td><button type="button" data-action="toggle-face" data-card-id="${card.id}">${face}</button></td>
          </tr>
        `;
      })
      .join("");

    return `
      <div class="flags-modal-backdrop" data-action="close-panel"></div>
      <section class="flags-modal" role="dialog" aria-modal="true" aria-labelledby="flags-panel-title">
        <header class="flags-modal-header">
          <h2 id="flags-panel-title">All flashcards</h2>
          <button type="button" data-action="close-panel" aria-label="Close all flashcards panel">Close</button>
        </header>
        <div class="flags-modal-body">
          <table class="flags-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Country</th>
                <th>Flag</th>
                <th>Visible</th>
                <th>Shown side</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function render() {
    clampCurrentIndex();
    const visibleCards = getVisibleCards();
    const currentCard = getCurrentCard();
    const slideNumber = visibleCards.length === 0 ? 0 : currentIndex + 1;
    const cardMarkup = currentCard
      ? renderCard(currentCard)
      : `<p class="flags-empty">No visible flashcards. Open All Flashcards to make cards visible again.</p>`;

    root.innerHTML = `
      <div class="flags-flashcards">
        <div class="flags-actions tags" aria-label="Flashcard controls">
          <button type="button" data-action="open-panel"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">view_list</span><span>View All Terms</span></button>
          <button type="button" data-action="shuffle"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">shuffle</span><span>Shuffle</span></button>
          <button type="button" data-action="flip-all"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">sync</span><span>Flip All Cards</span></button>
          <button type="button" data-action="reset"><span class="material-symbols-outlined flags-action-icon" aria-hidden="true">settings_backup_restore</span><span>Reset</span></button>
        </div>
        <section class="flags-stage" aria-label="Flags of Europe flashcards">
          <button class="flags-nav flags-nav-prev" type="button" data-action="previous" aria-label="Previous flashcard"${currentIndex === 0 ? " disabled" : ""}>Previous</button>
          <div class="flags-carousel" aria-live="polite">${cardMarkup}</div>
          <button class="flags-nav flags-nav-next" type="button" data-action="next" aria-label="Next flashcard"${currentIndex >= visibleCards.length - 1 ? " disabled" : ""}>Next</button>
          <div class="flags-slide-status">
            <button class="flags-skip flags-skip-start" type="button" data-action="start" title="Skip to start" aria-label="Skip to start"></button>
            Current slide: <span>${slideNumber}</span> / <span>${visibleCards.length}</span>
            <button class="flags-skip flags-skip-end" type="button" data-action="end" title="Skip to end" aria-label="Skip to end"></button>
          </div>
        </section>
        ${renderAllPanel()}
      </div>
    `;
  }

  function handleAction(action: string, target: HTMLElement) {
    const currentCard = getCurrentCard();

    if (action === "open-panel") {
      allPanelOpen = true;
    } else if (action === "close-panel") {
      allPanelOpen = false;
    } else if (action === "previous") {
      currentIndex = Math.max(0, currentIndex - 1);
    } else if (action === "next") {
      currentIndex = Math.min(getVisibleCards().length - 1, currentIndex + 1);
    } else if (action === "start") {
      currentIndex = 0;
    } else if (action === "end") {
      currentIndex = Math.max(getVisibleCards().length - 1, 0);
    } else if (action === "flip-current" && currentCard) {
      updateCard(currentCard.id, (card) => ({
        ...card,
        faceVisible: card.faceVisible === "front" ? "back" : "front"
      }));
    } else if (action === "shuffle") {
      cards = shuffleCards(cards);
      saveState(cards);
    } else if (action === "flip-all") {
      cards = cards.map((card) => ({
        ...card,
        faceVisible: card.faceVisible === "front" ? "back" : "front"
      }));
      saveState(cards);
    } else if (action === "reset") {
      cards = createInitialState();
      currentIndex = 0;
      allPanelOpen = false;
      saveState(cards);
    } else if (action === "toggle-visible") {
      const input = target as HTMLInputElement;
      const cardId = Number(input.dataset.cardId);
      updateCard(cardId, (card) => ({
        ...card,
        status: input.checked ? "visible" : "hidden"
      }));
    } else if (action === "toggle-face") {
      const cardId = Number(target.dataset.cardId);
      updateCard(cardId, (card) => ({
        ...card,
        faceVisible: card.faceVisible === "front" ? "back" : "front"
      }));
    }

    render();
  }

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const actionTarget = target.closest<HTMLElement>("[data-action]");
    const action = actionTarget?.dataset.action;
    if (actionTarget && action) {
      handleAction(action, actionTarget);
    }
  });

  root.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.dataset.action === "toggle-visible") {
      handleAction("toggle-visible", target);
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Shift" && getCurrentCard()) {
      handleAction("flip-current", root);
    } else if (event.key === "ArrowLeft") {
      handleAction("previous", root);
    } else if (event.key === "ArrowRight") {
      handleAction("next", root);
    }
  });

  render();
}
