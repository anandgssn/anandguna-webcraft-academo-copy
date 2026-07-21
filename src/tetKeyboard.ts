type TetKey = {
  step: number;
  color?: "black" | "grey";
  x: number;
  y: number;
  width: number;
  height: number;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type PlayingNote = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

const START_FREQUENCY = 261.626;
const STEP_RATIO = 1.037155044;
const MASTER_GAIN = 0.12;

const KEYBOARD_KEY_CODES = new Map<number, number>([
  [90, 0],
  [83, 1],
  [69, 2],
  [88, 3],
  [68, 4],
  [82, 5],
  [67, 6],
  [70, 7],
  [86, 8],
  [71, 9],
  [89, 10],
  [66, 11],
  [72, 12],
  [85, 13],
  [78, 14],
  [74, 15],
  [73, 16],
  [77, 17],
  [75, 18],
  [188, 19]
]);

const TET_KEYS: TetKey[] = [
  { step: 0, x: 0, y: 0, width: 23, height: 120 },
  { step: 3, x: 23, y: 0, width: 23, height: 120 },
  { step: 6, x: 46, y: 0, width: 23, height: 120 },
  { step: 8, x: 69, y: 0, width: 23, height: 120 },
  { step: 11, x: 92, y: 0, width: 23, height: 120 },
  { step: 14, x: 115, y: 0, width: 23, height: 120 },
  { step: 17, x: 138, y: 0, width: 23, height: 120 },
  { step: 19, x: 161, y: 0, width: 23, height: 120 },
  { step: 1, color: "black", x: 14.33333, y: 0, width: 13, height: 80 },
  { step: 4, color: "black", x: 41.66666, y: 0, width: 13, height: 80 },
  { step: 7, color: "black", x: 64.25, y: 0, width: 13, height: 80 },
  { step: 9, color: "black", x: 82.25, y: 0, width: 13, height: 80 },
  { step: 12, color: "black", x: 108.25, y: 0, width: 13, height: 80 },
  { step: 15, color: "black", x: 134.75, y: 0, width: 13, height: 80 },
  { step: 18, color: "black", x: 154.75, y: 0, width: 13, height: 80 },
  { step: 2, color: "grey", x: 17.33333, y: 0, width: 13, height: 50 },
  { step: 5, color: "grey", x: 44.66666, y: 0, width: 13, height: 50 },
  { step: 10, color: "grey", x: 85.25, y: 0, width: 13, height: 50 },
  { step: 13, color: "grey", x: 111.25, y: 0, width: 13, height: 50 },
  { step: 16, color: "grey", x: 137.75, y: 0, width: 13, height: 50 }
];

function getFrequency(step: number) {
  return Math.pow(STEP_RATIO, step) * START_FREQUENCY;
}

function getOriginalKeyCode(event: KeyboardEvent) {
  return event.keyCode || event.which;
}

function renderKeyboardSvg() {
  return `
    <svg class="tet-keyboard-svg" viewBox="0 0 184 120" role="group" aria-label="19 tone equal temperament keyboard">
      ${TET_KEYS.map((key) => `
        <rect
          data-tet-key="${key.step}"
          ${key.color ? `data-colour="${key.color}"` : ""}
          x="${key.x}"
          y="${key.y}"
          width="${key.width}"
          height="${key.height}"
          role="button"
          tabindex="0"
          aria-label="Play 19 TET note ${key.step}"
        />
      `).join("")}
    </svg>
  `;
}

export function mountTetKeyboard(root: HTMLElement) {
  const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;
  const controller = new AbortController();
  const playingNotes = new Map<number, PlayingNote>();
  const activeKeyboardCodes = new Set<number>();
  let audioContext: AudioContext | undefined;
  let masterGain: GainNode | undefined;

  root.innerHTML = `
    <div class="tet-keyboard" data-tet-keyboard-stage>
      ${renderKeyboardSvg()}
      <p class="tet-keyboard-status" data-tet-status>
        ${AudioContextConstructor ? "" : "To use this demo, please upgrade your browser to the latest version of Chrome or Firefox."}
      </p>
    </div>
  `;

  function ensureAudioContext() {
    if (!AudioContextConstructor) {
      return undefined;
    }

    if (!audioContext) {
      audioContext = new AudioContextConstructor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = MASTER_GAIN;
      masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }

    return audioContext;
  }

  function getKeyElement(step: number) {
    return root.querySelector<SVGRectElement>(`[data-tet-key="${step}"]`);
  }

  function playStep(step: number) {
    if (playingNotes.has(step)) {
      return;
    }

    const context = ensureAudioContext();
    if (!context || !masterGain) {
      return;
    }

    const gain = context.createGain();
    const oscillator = context.createOscillator();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.value = getFrequency(step);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + 0.015);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);

    playingNotes.set(step, { oscillator, gain });
    getKeyElement(step)?.classList.add("is-active");
  }

  function stopStep(step: number) {
    const note = playingNotes.get(step);
    if (!note || !audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    note.gain.gain.cancelScheduledValues(now);
    note.gain.gain.setValueAtTime(note.gain.gain.value, now);
    note.gain.gain.linearRampToValueAtTime(0, now + 0.03);
    note.oscillator.stop(now + 0.035);
    window.setTimeout(() => {
      note.oscillator.disconnect();
      note.gain.disconnect();
    }, 80);
    playingNotes.delete(step);
    getKeyElement(step)?.classList.remove("is-active");
  }

  function stopAll() {
    Array.from(playingNotes.keys()).forEach(stopStep);
    activeKeyboardCodes.clear();
  }

  root.addEventListener("pointerdown", (event) => {
    const key = (event.target as Element).closest<SVGRectElement>("[data-tet-key]");
    if (!key) {
      return;
    }

    event.preventDefault();
    key.setPointerCapture?.(event.pointerId);
    playStep(Number(key.dataset.tetKey));
  }, { signal: controller.signal });

  root.addEventListener("pointerup", (event) => {
    const key = (event.target as Element).closest<SVGRectElement>("[data-tet-key]");
    if (key) {
      stopStep(Number(key.dataset.tetKey));
    }
  }, { signal: controller.signal });

  root.addEventListener("pointercancel", stopAll, { signal: controller.signal });
  root.addEventListener("pointerleave", stopAll, { signal: controller.signal });

  root.addEventListener("keydown", (event) => {
    const key = (event.target as Element).closest<SVGRectElement>("[data-tet-key]");
    if (key && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      playStep(Number(key.dataset.tetKey));
    }
  }, { signal: controller.signal });

  root.addEventListener("keyup", (event) => {
    const key = (event.target as Element).closest<SVGRectElement>("[data-tet-key]");
    if (key && (event.key === "Enter" || event.key === " ")) {
      stopStep(Number(key.dataset.tetKey));
    }
  }, { signal: controller.signal });

  document.addEventListener("keydown", (event) => {
    const keyCode = getOriginalKeyCode(event);
    const step = KEYBOARD_KEY_CODES.get(keyCode);
    if (step === undefined || activeKeyboardCodes.has(keyCode)) {
      return;
    }

    event.preventDefault();
    activeKeyboardCodes.add(keyCode);
    playStep(step);
  }, { signal: controller.signal });

  document.addEventListener("keyup", (event) => {
    const keyCode = getOriginalKeyCode(event);
    const step = KEYBOARD_KEY_CODES.get(keyCode);
    if (step === undefined) {
      return;
    }

    activeKeyboardCodes.delete(keyCode);
    stopStep(step);
  }, { signal: controller.signal });

  function monitorConnection() {
    if (!root.isConnected) {
      stopAll();
      controller.abort();
      void audioContext?.close();
      return;
    }

    window.requestAnimationFrame(monitorConnection);
  }

  monitorConnection();
}
