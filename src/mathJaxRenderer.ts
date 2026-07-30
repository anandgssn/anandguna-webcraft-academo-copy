import "katex/dist/katex.css";
import katex from "katex";

// Escape helper for HTML
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderLatexToHtml(latex: string, displayMode: boolean) {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return escapeHtml(latex);
  }
}

// Renderer contract preserved (same export name used throughout the app)
export async function renderMathJax(root: ParentNode = document) {
  const freshBlocks = Array.from(root.querySelectorAll<HTMLElement>("[data-mathjax]")).filter(
    (block) => block.isConnected && block.dataset.mathjaxRendered !== "true"
  );

  if (freshBlocks.length === 0) {
    return;
  }

  freshBlocks.forEach((block) => {
    block.dataset.mathjaxLoading = "true";
  });

  // Double RAF ensures SPA layout has flushed before we inject SVG/HTML (fixes zero-width canvas interactions)
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

  const stillConnected = freshBlocks.filter((block) => block.isConnected);
  if (stillConnected.length === 0) {
    freshBlocks.forEach((block) => delete block.dataset.mathjaxLoading);
    return;
  }

  const renderOneBlock = (block: HTMLElement) => {
    if (!block.isConnected) {
      return;
    }
    // Preserve the original TeX on the element so subsequent navigations don't re-parse already-rendered HTML
    const rawHtml = block.getAttribute("data-mathjax-original") ?? block.innerHTML;
    block.setAttribute("data-mathjax-original", rawHtml);

    let html = rawHtml;
    // Replace \[...\] display math first
    html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_match, texBlock) => {
      const tex = String(texBlock).trim();
      if (!tex) return "";
      return `<span class="katex-display-wrap">${renderLatexToHtml(tex, true)}</span>`;
    });
    // Then remaining \(...\) inline math
    html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_match, texBlock) => {
      const tex = String(texBlock).trim();
      if (!tex) return "";
      return `<span class="katex-inline-wrap">${renderLatexToHtml(tex, false)}</span>`;
    });

    // If the replacement still contains raw KaTeX error containers, keep original LaTeX as fallback text
    block.innerHTML = html;
    block.dataset.mathjaxRendered = "true";
  };

  stillConnected.forEach((block) => renderOneBlock(block));

  // Cleanup loading flag for all — even blocks that detached during double RAF
  freshBlocks.forEach((block) => {
    delete block.dataset.mathjaxLoading;
  });
}
