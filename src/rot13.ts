const INITIAL_TEXT = 'Write your text to be encoded here, then click the "Encrypt/Decrypt" button.';

export function mountRot13(root: HTMLElement) {
  root.innerHTML = `
    <div class="rot13-layout">
      <div class="rot13-workspace">
        <label class="visually-hidden" for="rot13-text">Text to encrypt or decrypt</label>
        <textarea id="rot13-text">${INITIAL_TEXT}</textarea>
      </div>
      <div class="rot13-controls"><button type="button">Encrypt/decrypt</button></div>
    </div>`;
  const textarea = root.querySelector<HTMLTextAreaElement>("#rot13-text")!;
  root.querySelector<HTMLButtonElement>("button")!.addEventListener("click", () => {
    textarea.value = rot13(textarea.value);
    textarea.focus();
  });
}

export function rot13(value: string) {
  return value.replace(/[A-Za-z]/g, (letter) => {
    const start = letter <= "Z" ? 65 : 97;
    return String.fromCharCode(start + ((letter.charCodeAt(0) - start + 13) % 26));
  });
}
