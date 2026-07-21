type InputType = "live" | "sine" | "square";
type ColourScheme = "default" | "dark" | "light" | "vintage";

type ScopeState = {
  inputType: InputType;
  freeze: boolean;
  frequency: number;
  gain: number;
  secondsPerDiv: number;
  voltsPerDiv: number;
  horizontalOffset: number;
  verticalOffset: number;
  colourScheme: ColourScheme;
};

type Scheme = {
  background: string;
  gridLines: string;
  trace: string;
  traceHalo: string;
};

const GRID_SIZE = 100;
const DASH_SIZE = 20;
const WAVE_AMPLITUDE_VOLTS = 5;
const COLOUR_SCHEMES: Record<ColourScheme, Scheme> = {
  default: {
    background: "#5db1a2",
    gridLines: "#196156",
    trace: "#befde5",
    traceHalo: "rgba(174,244,218,0.3)"
  },
  dark: {
    background: "#111",
    gridLines: "#666",
    trace: "#fff",
    traceHalo: "rgba(255,255,255,0.3)"
  },
  light: {
    background: "#fdfdfd",
    gridLines: "#BBB",
    trace: "#111",
    traceHalo: "rgba(0,0,0,0.3)"
  },
  vintage: {
    background: "#0d200f",
    gridLines: "#000",
    trace: "#dbffdf",
    traceHalo: "rgb(120, 226, 154)"
  }
};

const DEFAULT_STATE: ScopeState = {
  inputType: "sine",
  freeze: false,
  frequency: 250,
  gain: 1,
  secondsPerDiv: 1,
  voltsPerDiv: 5,
  horizontalOffset: 0,
  verticalOffset: 0,
  colourScheme: "default"
};

function getFormNumber(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  return Number(field?.value ?? 0);
}

function getFormValue<T extends string>(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  return (field?.value ?? "") as T;
}

function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  context?.setTransform(1, 0, 0, 1, 0, 0);
}

export function mountVirtualOscilloscope(root: HTMLElement) {
  let state = { ...DEFAULT_STATE };
  let animationFrame = 0;
  let audioContext: AudioContext | undefined;
  let analyser: AnalyserNode | undefined;
  let mediaStream: MediaStream | undefined;
  let mediaSource: MediaStreamAudioSourceNode | undefined;
  let mediaGain: GainNode | undefined;
  let timeDomainData: Float32Array<ArrayBuffer> | undefined;
  let frozenData: Float32Array<ArrayBuffer> | undefined;

  root.innerHTML = `
    <div class="oscilloscope-layout">
      <div class="oscilloscope-screen" data-scope-screen>
        <canvas data-scope-grid aria-hidden="true"></canvas>
        <canvas data-scope-trace aria-label="Virtual oscilloscope waveform display"></canvas>
      </div>
      <form class="oscilloscope-controls" data-scope-controls>
        <label>
          <span>Input</span>
          <select name="inputType">
            <option value="live">Live Input (5 V peak amplitude)</option>
            <option value="sine" selected>Sine Wave (amplitude 5 V)</option>
            <option value="square">Square Wave (amplitude 5 V)</option>
          </select>
        </label>
        <label class="oscilloscope-toggle">
          <input type="checkbox" name="freeze">
          Freeze Live Input
        </label>
        <fieldset class="oscilloscope-frequency" data-frequency-controls>
          <legend>Input Wave Frequency</legend>
          <span class="oscilloscope-unit-input">
            <input type="number" name="frequencyText" min="1" max="1000" step="1" value="250" aria-label="Input Wave Frequency value">
            <span class="oscilloscope-unit">Hz</span>
          </span>
          <input type="range" name="frequency" min="1" max="1000" step="1" value="250" aria-label="Input Wave Frequency slider">
        </fieldset>
        <label>
          <span>Oscilloscope gain</span>
          <input class="oscilloscope-gain-value" type="number" name="gainText" min="0" max="5" step="0.1" value="1.0" aria-label="Oscilloscope gain value">
          <input type="range" name="gain" min="0" max="5" step="0.1" value="1.0">
        </label>
        <label>
          <span>Seconds / div</span>
          <select name="secondsPerDiv">
            <option value="0.05">50 µs</option>
            <option value="0.1">100 µs</option>
            <option value="0.2">200 µs</option>
            <option value="0.5">500 µs</option>
            <option value="1" selected>1 ms</option>
            <option value="2">2 ms</option>
            <option value="5">5 ms</option>
          </select>
        </label>
        <label>
          <span>Volts / div</span>
          <select name="voltsPerDiv">
            <option value="1">1 V</option>
            <option value="2">2 V</option>
            <option value="5" selected>5 V</option>
            <option value="10">10 V</option>
          </select>
        </label>
        <label>
          <span>Horizontal Offset</span>
          <input type="range" name="horizontalOffset" min="-100" max="100" step="1" value="0">
        </label>
        <label>
          <span>Vertical Offset</span>
          <input type="range" name="verticalOffset" min="-100" max="100" step="1" value="0">
        </label>
        <label>
          <span>Color scheme</span>
          <select name="colourScheme">
            <option value="default" selected>Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="vintage">Vintage</option>
          </select>
        </label>
        <p class="oscilloscope-status" data-scope-status></p>
      </form>
    </div>
  `;

  const screen = root.querySelector<HTMLElement>("[data-scope-screen]")!;
  const gridCanvas = root.querySelector<HTMLCanvasElement>("[data-scope-grid]")!;
  const traceCanvas = root.querySelector<HTMLCanvasElement>("[data-scope-trace]")!;
  const form = root.querySelector<HTMLFormElement>("[data-scope-controls]")!;
  const status = root.querySelector<HTMLElement>("[data-scope-status]")!;

  if (!screen || !gridCanvas || !traceCanvas || !form || !status) {
    return;
  }

  const gridContext = gridCanvas.getContext("2d")!;
  const traceContext = traceCanvas.getContext("2d")!;

  if (!gridContext || !traceContext) {
    return;
  }

  function readState() {
    state = {
      inputType: getFormValue<InputType>(form, "inputType"),
      freeze: Boolean((form.elements.namedItem("freeze") as HTMLInputElement | null)?.checked),
      frequency: getFormNumber(form, "frequencyText"),
      gain: getFormNumber(form, "gainText"),
      secondsPerDiv: getFormNumber(form, "secondsPerDiv"),
      voltsPerDiv: getFormNumber(form, "voltsPerDiv"),
      horizontalOffset: getFormNumber(form, "horizontalOffset"),
      verticalOffset: getFormNumber(form, "verticalOffset"),
      colourScheme: getFormValue<ColourScheme>(form, "colourScheme")
    };
  }

  function updateRangeProgress() {
    form.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((input) => {
      const min = Number(input.min || 0);
      const max = Number(input.max || 100);
      const value = Number(input.value || 0);
      const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

      input.style.setProperty("--range-progress", `${Math.min(100, Math.max(0, progress))}%`);
    });
  }

  function syncFrequencyInputs(source: HTMLInputElement) {
    const frequencySlider = form.elements.namedItem("frequency") as HTMLInputElement | null;
    const frequencyText = form.elements.namedItem("frequencyText") as HTMLInputElement | null;
    const nextValue = String(Math.min(1000, Math.max(1, Number(source.value) || DEFAULT_STATE.frequency)));

    if (frequencySlider && source !== frequencySlider) {
      frequencySlider.value = nextValue;
    }
    if (frequencyText && source !== frequencyText) {
      frequencyText.value = nextValue;
    }
  }

  function syncGainInputs(source: HTMLInputElement) {
    const gainSlider = form.elements.namedItem("gain") as HTMLInputElement | null;
    const gainText = form.elements.namedItem("gainText") as HTMLInputElement | null;
    const parsedValue = Number(source.value);
    const clampedValue = Math.min(5, Math.max(0, Number.isFinite(parsedValue) ? parsedValue : DEFAULT_STATE.gain));
    const nextValue = clampedValue.toFixed(1);

    if (gainSlider && source !== gainSlider) {
      gainSlider.value = nextValue;
    }
    if (gainText && source !== gainText) {
      gainText.value = nextValue;
    }
  }

  function drawGrid() {
    const { width, height } = gridCanvas.getBoundingClientRect();
    const scheme = COLOUR_SCHEMES[state.colourScheme];
    const midpoint = { x: width / 2, y: height / 2 };

    gridContext.clearRect(0, 0, width, height);
    gridContext.fillStyle = scheme.background;
    gridContext.fillRect(0, 0, width, height);
    gridContext.strokeStyle = scheme.gridLines;
    gridContext.lineWidth = 2;
    gridContext.beginPath();

    gridContext.moveTo(0, midpoint.y);
    gridContext.lineTo(width, midpoint.y);
    gridContext.moveTo(midpoint.x, 0);
    gridContext.lineTo(midpoint.x, height);

    for (let x = midpoint.x - GRID_SIZE; x >= 0; x -= GRID_SIZE) {
      gridContext.moveTo(x, 0);
      gridContext.lineTo(x, height);
    }
    for (let x = midpoint.x + GRID_SIZE; x <= width; x += GRID_SIZE) {
      gridContext.moveTo(x, 0);
      gridContext.lineTo(x, height);
    }
    for (let y = midpoint.y - GRID_SIZE; y >= 0; y -= GRID_SIZE) {
      gridContext.moveTo(0, y);
      gridContext.lineTo(width, y);
    }
    for (let y = midpoint.y + GRID_SIZE; y <= height; y += GRID_SIZE) {
      gridContext.moveTo(0, y);
      gridContext.lineTo(width, y);
    }
    for (let x = midpoint.x - DASH_SIZE; x >= 0; x -= DASH_SIZE) {
      gridContext.moveTo(x, midpoint.y - 5);
      gridContext.lineTo(x, midpoint.y + 5);
    }
    for (let x = midpoint.x + DASH_SIZE; x <= width; x += DASH_SIZE) {
      gridContext.moveTo(x, midpoint.y - 5);
      gridContext.lineTo(x, midpoint.y + 5);
    }
    for (let y = midpoint.y - DASH_SIZE; y >= 0; y -= DASH_SIZE) {
      gridContext.moveTo(midpoint.x - 5, y);
      gridContext.lineTo(midpoint.x + 5, y);
    }
    for (let y = midpoint.y + DASH_SIZE; y <= height; y += DASH_SIZE) {
      gridContext.moveTo(midpoint.x - 5, y);
      gridContext.lineTo(midpoint.x + 5, y);
    }

    gridContext.stroke();
  }

  function getGeneratedVoltage(x: number, width: number) {
    const secondsPerPixel = (state.secondsPerDiv / 1000) / GRID_SIZE;
    const time = (x - width / 2 - state.horizontalOffset) * secondsPerPixel;
    const sine = Math.sin(2 * Math.PI * state.frequency * time);

    return state.inputType === "square"
      ? (sine >= 0 ? WAVE_AMPLITUDE_VOLTS : -WAVE_AMPLITUDE_VOLTS)
      : WAVE_AMPLITUDE_VOLTS * sine;
  }

  function getLiveVoltage(x: number, width: number) {
    const data = state.freeze ? frozenData : timeDomainData;
    if (!data || data.length === 0) {
      return 0;
    }

    const sampleX = x - state.horizontalOffset;
    const index = Math.min(data.length - 1, Math.max(0, Math.round((sampleX / width) * (data.length - 1))));
    return data[index] * WAVE_AMPLITUDE_VOLTS;
  }

  function drawTrace() {
    const { width, height } = traceCanvas.getBoundingClientRect();
    const scheme = COLOUR_SCHEMES[state.colourScheme];
    const midpointY = height / 2;

    traceContext.clearRect(0, 0, width, height);
    traceContext.beginPath();

    for (let x = 0; x <= width; x += 1) {
      const voltage = state.inputType === "live" ? getLiveVoltage(x, width) : getGeneratedVoltage(x, width);
      const y = midpointY - ((voltage * state.gain) / state.voltsPerDiv) * GRID_SIZE + state.verticalOffset;

      if (x === 0) {
        traceContext.moveTo(x, y);
      } else {
        traceContext.lineTo(x, y);
      }
    }

    traceContext.strokeStyle = scheme.trace;
    traceContext.lineWidth = 1;
    traceContext.stroke();
    traceContext.strokeStyle = scheme.traceHalo;
    traceContext.lineWidth = 3;
    traceContext.stroke();
    traceContext.lineWidth = 4;
    traceContext.stroke();
  }

  function draw() {
    if (state.inputType === "live" && analyser && timeDomainData && !state.freeze) {
      analyser.getFloatTimeDomainData(timeDomainData);
      frozenData = new Float32Array(timeDomainData);
    }

    drawTrace();
  }

  function revertToSine() {
    const inputSelect = form.elements.namedItem("inputType") as HTMLSelectElement | null;
    if (inputSelect) {
      inputSelect.value = "sine";
    }
    state.inputType = "sine";
    const frequencyControls = form.querySelector<HTMLFieldSetElement>("[data-frequency-controls]");
    if (frequencyControls) {
      frequencyControls.disabled = false;
    }
    draw();
  }

  async function startLiveInput() {
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = "To use Live Audio Input, please download the latest version of Chrome.";
      revertToSine();
      return;
    }

    try {
      audioContext ??= new AudioContext();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      mediaStream ??= await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (!analyser) {
        mediaSource = audioContext.createMediaStreamSource(mediaStream);
        mediaGain = audioContext.createGain();
        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.9;
        analyser.fftSize = 4096;
        mediaGain.gain.value = 3;
        mediaSource.connect(mediaGain);
        mediaGain.connect(analyser);
        timeDomainData = new Float32Array(analyser.frequencyBinCount);
        frozenData = new Float32Array(analyser.frequencyBinCount);
      }
      status.textContent = "";
    } catch {
      status.textContent = "To use Live Audio Input, please allow access to your browser's microphone when prompted, or check your browser settings.";
      revertToSine();
    }
  }

  function resize() {
    const width = screen.clientWidth;
    const height = Math.round(width * 0.67);
    resizeCanvas(gridCanvas, width, height);
    resizeCanvas(traceCanvas, width, height);
    screen.style.height = `${height}px`;
    drawGrid();
    draw();
  }

  function syncControls(event?: Event) {
    const target = event?.target;
    if (target instanceof HTMLInputElement && (target.name === "frequency" || target.name === "frequencyText")) {
      syncFrequencyInputs(target);
    }
    if (target instanceof HTMLInputElement && (target.name === "gain" || target.name === "gainText")) {
      syncGainInputs(target);
    }

    readState();
    updateRangeProgress();
    drawGrid();

    const frequencyControls = form.querySelector<HTMLFieldSetElement>("[data-frequency-controls]");
    if (frequencyControls) {
      frequencyControls.disabled = state.inputType === "live";
    }
    if (state.inputType === "live") {
      void startLiveInput();
    } else {
      status.textContent = "";
    }

    draw();
  }

  form.addEventListener("input", syncControls);
  form.addEventListener("change", syncControls);

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(screen);

  function animate() {
    if (!root.isConnected) {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mediaStream?.getTracks().forEach((track) => track.stop());
      mediaSource?.disconnect();
      mediaGain?.disconnect();
      void audioContext?.close();
      return;
    }

    draw();
    animationFrame = window.requestAnimationFrame(animate);
  }

  readState();
  updateRangeProgress();
  resize();
  animate();
}
