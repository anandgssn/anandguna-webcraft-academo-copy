type FlashcardTableOptions = {
  closeAction: string;
  labelledBy: string;
  headers: string[];
  rows: string;
};

export function renderFlashcardTable({ closeAction, labelledBy, headers, rows }: FlashcardTableOptions) {
  return `
    <div class="flags-modal-backdrop" data-action="${closeAction}"></div>
    <section class="flags-modal" role="dialog" aria-modal="true" aria-labelledby="${labelledBy}">
      <header class="flags-modal-header">
        <h2 id="${labelledBy}">All Terms</h2>
        <button class="flags-modal-close" type="button" data-action="${closeAction}" aria-label="Close all terms panel"><span aria-hidden="true">&times;</span></button>
      </header>
      <div class="flags-modal-body">
        <table class="flags-table">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}
