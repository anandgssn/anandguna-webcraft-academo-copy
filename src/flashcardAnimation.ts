export function animateVisibleFlashcard(root: HTMLElement) {
  root.querySelector<HTMLElement>(".flags-flip-container")?.classList.toggle("flip");
}
