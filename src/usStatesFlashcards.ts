import { animateVisibleFlashcard } from "./flashcardAnimation";
import { renderFlashcardTable } from "./flashcardTable";

const STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Washington D.C."];

const slug = (name: string) => name === "Washington D.C." ? "columbia" : name.toLowerCase().replaceAll(" ", "-").replaceAll(".", "");

export function mountUsStatesFlashcards(root: HTMLElement) {
  const actionsRoot = root.closest(".demo-detail")?.querySelector<HTMLElement>("[data-flashcard-actions]");
  let order = STATES.map((_, index) => index);
  let currentIndex = 0;
  let flipped = new Set<number>(order);
  let hidden = new Set<number>();
  let modalOpen = false;

  const visibleOrder = () => order.filter((id) => !hidden.has(id));

  function modal() {
    const rows = STATES.map((name, id) => `
      <tr>
        <td>${name}</td>
        <td><img src="/assets/us-states/${slug(name)}.svg" alt="Map highlighting ${name}" loading="lazy"></td>
        <td><input type="checkbox" data-action="toggle-visible" data-card-id="${id}"${hidden.has(id) ? "" : " checked"} aria-label="Show ${name}"></td>
      </tr>
    `).join("");

    return renderFlashcardTable({
      closeAction: "close",
      labelledBy: "states-panel-title",
      headers: ["State", "Map", "Visible"],
      rows
    });
  }

  function render() {
    const cards = visibleOrder();
    currentIndex = Math.min(currentIndex, Math.max(cards.length - 1, 0));
    const id = cards[currentIndex];
    const name = id === undefined ? "" : STATES[id];
    const card = id === undefined
      ? `<p class="flags-empty">No visible flashcards. Open All Terms to make cards visible again.</p>`
      : `<div class="flags-slide"><button class="flags-flip-container${flipped.has(id) ? " flip" : ""}" type="button" data-action="card" aria-label="Flip ${name} flashcard"><span class="flags-flipper"><span class="flags-card-face flags-card-front"><span class="flags-card-term">State</span><span class="flags-country">${name}</span><span class="flags-front-border"></span></span><span class="flags-card-face flags-card-back"><span class="flags-card-term">Map</span><img src="/assets/us-states/${slug(name)}.svg" alt="Map highlighting ${name}"><span class="flags-back-border"></span></span></span></button></div>`;

    root.innerHTML = `<div class="flags-flashcards"><section class="flags-stage" aria-label="US States Map flashcards"><button class="flags-nav flags-nav-prev" type="button" data-action="previous" aria-label="Previous flashcard"${currentIndex === 0 ? " disabled" : ""}>Previous</button><div class="flags-carousel">${card}</div><button class="flags-nav flags-nav-next" type="button" data-action="next" aria-label="Next flashcard"${currentIndex >= cards.length - 1 ? " disabled" : ""}>Next</button><div class="flags-slide-status"><button class="flags-skip flags-skip-start" type="button" data-action="start" aria-label="Skip to start"></button>Current slide: <span>${cards.length ? currentIndex + 1 : 0}</span> / <span>${cards.length}</span><button class="flags-skip flags-skip-end" type="button" data-action="end" aria-label="Skip to end"></button></div></section>${modalOpen ? modal() : ""}</div>`;
    bind();
  }

  function handleAction(element: HTMLElement) {
    const actionName = element.dataset.action;
    const cards = visibleOrder();
    const id = cards[currentIndex];

    if (actionName === "card" && id !== undefined) {
      flipped.has(id) ? flipped.delete(id) : flipped.add(id);
      animateVisibleFlashcard(root);
      return;
    }
    else if (actionName === "previous") currentIndex--;
    else if (actionName === "next") currentIndex++;
    else if (actionName === "start") currentIndex = 0;
    else if (actionName === "end") currentIndex = Math.max(cards.length - 1, 0);
    else if (actionName === "open-panel") modalOpen = true;
    else if (actionName === "close") modalOpen = false;
    else if (actionName === "shuffle") { order = [...order].sort(() => Math.random() - 0.5); currentIndex = 0; }
    else if (actionName === "flip-all") {
      flipped.size === STATES.length ? flipped.clear() : flipped = new Set(STATES.map((_, index) => index));
      animateVisibleFlashcard(root);
      return;
    }
    else if (actionName === "reset") { order = STATES.map((_, index) => index); currentIndex = 0; flipped = new Set(order); hidden = new Set(); }
    else if (actionName === "toggle-visible") {
      const cardId = Number(element.dataset.cardId);
      hidden.has(cardId) ? hidden.delete(cardId) : hidden.add(cardId);
    }
    render();
  }

  function bind() {
    root.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => {
      element.addEventListener("click", () => handleAction(element));
    });
  }

  actionsRoot?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionTarget = target.closest<HTMLElement>("[data-action]");
    if (actionTarget) handleAction(actionTarget);
  });

  render();
}
