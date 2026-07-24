type AudioState = { context: AudioContext; carrier: OscillatorNode; modulator: OscillatorNode; modulatorGain: GainNode; output: GainNode };
type Values = { f1: number; f2: number; amplitude: number; zoom: number; overlay: boolean };

const COLORS = { f1: "rgb(66, 104, 180)", f2: "#d62728", product: "rgb(150, 66, 180)", zoom: "rgb(33, 203, 156)" };

export function mountAmplitudeModulation(root: HTMLElement) {
  root.innerHTML = `
    <div class="amplitude-layout">
      <div class="amplitude-plot" aria-label="Carrier, amplitude envelope, and modulated waveform plot"><canvas></canvas></div>
      <div class="amplitude-controls">
        ${renderNumericControl("f_1", "am-f1", 1, 500, 0.1, 400, "Hz", COLORS.f1, 1)}
        ${renderNumericControl("f_2", "am-f2", 1, 100, 0.1, 6, "Hz", COLORS.f2, 1)}
        ${renderNumericControl("A_2", "am-a2", 0, 1, 0.01, 1, "", COLORS.f2, 2)}
        ${renderZoomControl()}
        ${renderCheckbox("Overlay waves", "am-overlay")}
        ${renderCheckbox("Sound on/off", "am-sound")}
        <div class="amplitude-interface amplitude-codepen"><a href="https://codepen.io/pen/" target="_blank" rel="noreferrer" title="CodePen is a free online tool for editing and writing code."><span class="external-link-icon" aria-hidden="true"></span>Open with CodePen</a></div>
      </div>
    </div>`;

  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  let audio: AudioState | undefined;
  let animationStart = 0;
  let overlayMix = 0;
  let overlayFrom = 0;

  const values = (): Values => ({
    f1: Number(root.querySelector<HTMLInputElement>("#am-f1-number")!.value),
    f2: Number(root.querySelector<HTMLInputElement>("#am-f2-number")!.value),
    amplitude: Number(root.querySelector<HTMLInputElement>("#am-a2-number")!.value),
    zoom: Number(root.querySelector<HTMLInputElement>("#am-zoom")!.value),
    overlay: root.querySelector<HTMLInputElement>("#am-overlay")!.checked
  });

  const redraw = (animateOverlay = false) => {
    if (animateOverlay) { animationStart = performance.now(); overlayFrom = overlayMix; }
    const frame = (now: number) => {
      const elapsed = Math.min(1, (now - animationStart) / 500);
      if (animateOverlay) overlayMix = overlayFrom + ((values().overlay ? 1 : 0) - overlayFrom) * elapsed;
      draw(canvas, values(), overlayMix);
      if (animateOverlay && elapsed < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    if (audio) updateAudio(audio, values());
  };

  root.querySelectorAll<HTMLElement>("[data-am-control]").forEach((control) => {
    const range = control.querySelector<HTMLInputElement>('input[type="range"]')!;
    const number = control.querySelector<HTMLInputElement>('input[type="number"]');
    const decimals = Number(control.dataset.decimals ?? 1);
    const sync = (source: HTMLInputElement, target?: HTMLInputElement) => {
      if (target) target.value = source.value;
      if (number) number.value = Number(source.value).toFixed(decimals);
      setRangeFill(range, control.dataset.color ?? COLORS.f1);
      redraw();
    };
    range.addEventListener("input", () => sync(range));
    const syncNumber = () => {
      if (number && number.value !== "" && Number.isFinite(Number(number.value))) {
        const bounded = Math.min(Number(range.max), Math.max(Number(range.min), Number(number.value)));
        range.value = String(bounded); setRangeFill(range, control.dataset.color ?? COLORS.f1); redraw();
      }
    };
    number?.addEventListener("input", syncNumber);
    number?.addEventListener("change", () => { syncNumber(); if (number) number.value = Number(range.value).toFixed(decimals); });
    setRangeFill(range, control.dataset.color ?? COLORS.f1);
  });

  root.querySelector<HTMLInputElement>("#am-overlay")!.addEventListener("change", () => redraw(true));
  root.querySelector<HTMLInputElement>("#am-sound")!.addEventListener("change", async (event) => {
    const checkbox = event.currentTarget as HTMLInputElement;
    if (checkbox.checked) {
      try { audio = createAudio(values()); await audio.context.resume(); }
      catch { checkbox.checked = false; }
    } else { await stopAudio(audio); audio = undefined; }
  });

  const observer = new ResizeObserver(() => redraw());
  observer.observe(canvas.parentElement!);
  const cleanup = window.setInterval(() => { if (!root.isConnected) { observer.disconnect(); clearInterval(cleanup); void stopAudio(audio); } }, 500);
  redraw();
}

function renderNumericControl(label: string, id: string, min: number, max: number, step: number, value: number, unit: string, color: string, decimals: number) {
  return `<div class="amplitude-interface" data-am-control data-color="${color}" data-decimals="${decimals}">
    <label for="${id}-number"><span class="amplitude-math-label" data-mathjax>\\( ${label} \\)</span></label>
    <div class="amplitude-number-row"><input id="${id}-number" type="number" min="${min}" max="${max}" step="${step}" value="${value.toFixed(decimals)}">${unit ? `<span>${unit}</span>` : ""}</div>
    <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}">
  </div>`;
}

function renderZoomControl() {
  return `<div class="amplitude-interface amplitude-zoom" data-am-control data-color="${COLORS.zoom}" data-decimals="1">
    <label for="am-zoom">Zoom</label><input id="am-zoom" type="range" min="1" max="20" step="0.1" value="1">
  </div>`;
}

function renderCheckbox(label: string, id: string) {
  return `<div class="amplitude-interface amplitude-checkbox"><span>${label}</span><label class="amplitude-check" for="${id}"><input id="${id}" type="checkbox"><span aria-hidden="true"></span></label></div>`;
}

function setRangeFill(range: HTMLInputElement, color: string) {
  const progress = ((Number(range.value) - Number(range.min)) / (Number(range.max) - Number(range.min))) * 100;
  range.style.setProperty("--range-progress", `${progress}%`); range.style.setProperty("--range-color", color);
}

function draw(canvas: HTMLCanvasElement, values: Values, overlayMix: number) {
  const box = canvas.parentElement!.getBoundingClientRect();
  const width = box.width; const height = width * 0.67; const ratio = devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  const c = canvas.getContext("2d")!; c.scale(ratio, ratio); c.fillStyle = "#fff"; c.fillRect(0, 0, width, height);
  const margin = { top: 20, right: 20, bottom: 60, left: 20 }; const pw = width - 40; const ph = height - 80;
  const timeExtent = 0.1 / values.zoom; const xFor = (time: number) => margin.left + ((time + timeExtent) / (2 * timeExtent)) * pw; const yFor = (v: number) => margin.top + (v / -14) * ph;
  c.strokeStyle = "#e5e5e5"; c.lineWidth = 1;
  for (let i = 0; i <= 10; i++) { const x = margin.left + pw * i / 10; c.beginPath(); c.moveTo(x, margin.top); c.lineTo(x, margin.top + ph); c.stroke(); }
  for (let i = 0; i <= 14; i++) { const y = margin.top + ph * i / 14; c.beginPath(); c.moveTo(margin.left, y); c.lineTo(margin.left + pw, y); c.stroke(); }
  c.strokeStyle = "#000"; c.beginPath(); c.moveTo(margin.left, margin.top + ph); c.lineTo(margin.left + pw, margin.top + ph); c.stroke();
  c.fillStyle = "#000"; c.font = '13px "Open Sans", sans-serif'; c.textAlign = "center";
  for (let i = 0; i <= 10; i++) { const t = -timeExtent + 2 * timeExtent * i / 10; c.fillText(t.toFixed(2), margin.left + pw * i / 10, margin.top + ph + 22); }
  c.font = '16px "Open Sans", sans-serif'; c.fillText("Time in seconds", margin.left + pw / 2, height - 10);
  // The original shifts only the carrier and envelope toward one another.
  const offsets = [-2 - 2 * overlayMix, -5 + 2 * overlayMix, -11];
  const funcs = [(t:number)=>Math.sin(2*Math.PI*values.f1*t),(t:number)=>values.amplitude*Math.cos(2*Math.PI*values.f2*t),(t:number)=>(1+values.amplitude*Math.cos(2*Math.PI*values.f2*t))*Math.sin(2*Math.PI*values.f1*t)];
  [COLORS.f1, COLORS.f2, COLORS.product].forEach((color,index)=>{c.beginPath();c.strokeStyle=color;c.lineWidth=1.5;for(let px=0;px<=pw;px++){const t=-timeExtent+2*timeExtent*px/pw;const y=yFor(funcs[index](t)+offsets[index]);if(px===0)c.moveTo(xFor(t),y);else c.lineTo(xFor(t),y);}c.stroke();});
}

function createAudio(values: Values): AudioState { const context=new AudioContext(),carrier=context.createOscillator(),modulator=context.createOscillator(),modulatorGain=context.createGain(),output=context.createGain();carrier.connect(output);modulator.connect(modulatorGain).connect(output.gain);output.connect(context.destination);const state={context,carrier,modulator,modulatorGain,output};updateAudio(state,values);carrier.start();modulator.start();return state; }
function updateAudio(a: AudioState,v: Values){const now=a.context.currentTime;a.carrier.frequency.setTargetAtTime(v.f1,now,.01);a.modulator.frequency.setTargetAtTime(v.f2,now,.01);a.output.gain.setTargetAtTime(.1,now,.01);a.modulatorGain.gain.setTargetAtTime(.1*v.amplitude,now,.01);}
async function stopAudio(a?:AudioState){if(!a||a.context.state==="closed")return;a.carrier.stop();a.modulator.stop();await a.context.close();}
