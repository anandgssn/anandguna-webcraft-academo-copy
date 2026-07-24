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

  formulaBlocks.forEach((block) => {
    block.dataset.mathjaxLoading = "true";
  });

  let mathJax: MathJaxConfig;
  try {
    mathJax = await loadMathJax();
  } catch (error) {
    formulaBlocks.forEach((block) => delete block.dataset.mathjaxLoading);
    throw error;
  }
  const connectedBlocks = formulaBlocks.filter((block) => block.isConnected);

  if (connectedBlocks.length === 0) {
    return;
  }

  try {
    const typesetting = mathJax.typesetPromise?.(connectedBlocks) ?? Promise.resolve();
    await Promise.race([
      typesetting,
      new Promise<void>((resolve) => window.setTimeout(resolve, 1000))
    ]);
  } finally {
    connectedBlocks.forEach((block) => {
      block.dataset.mathjaxRendered = "true";
      delete block.dataset.mathjaxLoading;
    });
  }
}
