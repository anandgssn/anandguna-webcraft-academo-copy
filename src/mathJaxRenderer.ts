type MathJaxConfig = {
  startup?: {
    promise?: Promise<void>;
    typeset?: boolean;
  };
  typesetPromise?: (elements?: Element[]) => Promise<void>;
  tex?: unknown;
  svg?: unknown;
};

declare global {
  interface Window {
    MathJax?: MathJaxConfig;
  }
}

let mathJaxReady: Promise<MathJaxConfig> | undefined;

async function loadMathJax() {
  if (!mathJaxReady) {
    window.MathJax = {
      ...(window.MathJax ?? {}),
      tex: {
        displayMath: [["\\[", "\\]"]],
        inlineMath: [["\\(", "\\)"]],
        processEscapes: true
      },
      svg: {
        fontCache: "local"
      },
      startup: {
        ...(window.MathJax?.startup ?? {}),
        typeset: false
      }
    };

    mathJaxReady = import("mathjax/tex-svg.js").then(async () => {
      await window.MathJax?.startup?.promise;
      if (!window.MathJax?.typesetPromise) {
        throw new Error("MathJax did not expose typesetPromise.");
      }
      return window.MathJax;
    });
  }

  return mathJaxReady;
}

export async function renderMathJax(root: ParentNode = document) {
  const formulaBlocks = Array.from(root.querySelectorAll<HTMLElement>("[data-mathjax]"))
    .filter((block) => block.isConnected && block.dataset.mathjaxRendered !== "true");

  if (formulaBlocks.length === 0) {
    return;
  }

  const mathJax = await loadMathJax();
  const connectedBlocks = formulaBlocks.filter((block) => block.isConnected);

  if (connectedBlocks.length === 0) {
    return;
  }

  await mathJax.typesetPromise?.(connectedBlocks);
  connectedBlocks.forEach((block) => {
    block.dataset.mathjaxRendered = "true";
  });
}
