const OUTER_RADIUS = 150;
const CANVAS_HEIGHT = 400;

type Point = { x: number; y: number };

export function mountHypocycloid(root: HTMLElement) {
  root.innerHTML = `
    <div class="hypocycloid-layout">
      <div class="hypocycloid-stage">
        <canvas aria-label="Animated hypocycloid traced by a circle rolling inside a larger circle"></canvas>
      </div>
      <div class="hypocycloid-controls">
        <div class="hypocycloid-control">
          <label for="inner-circle-radius">Inner Circle Radius</label>
          <div class="hypocycloid-value-with-unit">
            <input id="inner-circle-radius" type="number" min="5" max="120" step="1" value="60">
            <span>pixels</span>
          </div>
          <input class="hypocycloid-range radius-range" type="range" min="5" max="120" step="1" value="60" aria-label="Inner Circle Radius slider">
        </div>
        <label class="hypocycloid-check"><span>Animate</span><input type="checkbox" data-animate><i aria-hidden="true"></i></label>
        <div class="hypocycloid-control">
          <label for="hypocycloid-speed">Speed</label>
          <input id="hypocycloid-speed" type="number" min="1" max="100" step="1" value="10">
          <input class="hypocycloid-range speed-range" type="range" min="1" max="100" step="1" value="10" aria-label="Speed slider">
        </div>
        <label class="hypocycloid-check"><span>Hide Circles</span><input type="checkbox" data-hide-circles><i aria-hidden="true"></i></label>
        <button type="button" data-clear-trace>Clear Trace</button>
      </div>
    </div>`;

  const stage = root.querySelector<HTMLElement>(".hypocycloid-stage")!;
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const radiusNumber = root.querySelector<HTMLInputElement>("#inner-circle-radius")!;
  const radiusRange = root.querySelector<HTMLInputElement>(".radius-range")!;
  const speedNumber = root.querySelector<HTMLInputElement>("#hypocycloid-speed")!;
  const speedRange = root.querySelector<HTMLInputElement>(".speed-range")!;
  const animateInput = root.querySelector<HTMLInputElement>("[data-animate]")!;
  const hideInput = root.querySelector<HTMLInputElement>("[data-hide-circles]")!;
  const clearButton = root.querySelector<HTMLButtonElement>("[data-clear-trace]")!;
  const context = canvas.getContext("2d")!;

  let radius = 60;
  let speed = 10;
  let angle = 0;
  let animationFrame = 0;
  let trace: Point[] = [];

  function markerPoint(theta: number): Point {
    const centerX = canvas.clientWidth / 2;
    const centerY = CANVAS_HEIGHT / 2;
    return {
      x: centerX + (OUTER_RADIUS - radius) * Math.cos(theta) + radius * Math.cos(((OUTER_RADIUS - radius) / radius) * theta),
      y: centerY + (OUTER_RADIUS - radius) * Math.sin(theta) - radius * Math.sin(((OUTER_RADIUS - radius) / radius) * theta)
    };
  }

  function resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    const width = stage.clientWidth;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(CANVAS_HEIGHT * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    trace = [markerPoint(angle)];
    draw();
  }

  function draw() {
    const width = canvas.clientWidth;
    const centerX = width / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const innerX = centerX + (OUTER_RADIUS - radius) * Math.cos(angle);
    const innerY = centerY + (OUTER_RADIUS - radius) * Math.sin(angle);
    const marker = markerPoint(angle);

    context.clearRect(0, 0, width, CANVAS_HEIGHT);
    if (trace.length > 1) {
      context.beginPath();
      context.moveTo(trace[0].x, trace[0].y);
      trace.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.strokeStyle = "#f00";
      context.lineWidth = 1;
      context.lineCap = "round";
      context.stroke();
    }

    if (!hideInput.checked) {
      context.strokeStyle = "#000";
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(centerX, centerY, OUTER_RADIUS, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(innerX, innerY, radius, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(innerX, innerY);
      context.lineTo(marker.x, marker.y);
      context.stroke();
      context.fillStyle = "#000";
      context.beginPath();
      context.arc(innerX, innerY, 3, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#f00";
      context.beginPath();
      context.arc(marker.x, marker.y, 3, 0, Math.PI * 2);
      context.fill();
    }
  }

  function animate() {
    if (!animateInput.checked || !root.isConnected) return;
    angle -= (speed / 20) * Math.PI / 180;
    trace.push(markerPoint(angle));
    draw();
    animationFrame = window.requestAnimationFrame(animate);
  }

  function bindPair(numberInput: HTMLInputElement, rangeInput: HTMLInputElement, update: (value: number) => void) {
    const paintRange = () => {
      const progress = ((Number(rangeInput.value) - Number(rangeInput.min)) / (Number(rangeInput.max) - Number(rangeInput.min))) * 100;
      rangeInput.style.setProperty("--range-progress", `${progress}%`);
    };
    const sync = (source: HTMLInputElement, target: HTMLInputElement) => {
      const value = Math.min(Number(source.max), Math.max(Number(source.min), Number(source.value)));
      source.value = String(value);
      target.value = String(value);
      paintRange();
      update(value);
    };
    numberInput.addEventListener("change", () => sync(numberInput, rangeInput));
    rangeInput.addEventListener("input", () => sync(rangeInput, numberInput));
    paintRange();
  }

  bindPair(radiusNumber, radiusRange, (value) => {
    radius = value;
    trace = [markerPoint(angle)];
    draw();
  });
  bindPair(speedNumber, speedRange, (value) => { speed = value; });
  animateInput.addEventListener("change", () => {
    window.cancelAnimationFrame(animationFrame);
    if (animateInput.checked) animationFrame = window.requestAnimationFrame(animate);
  });
  hideInput.addEventListener("change", draw);
  clearButton.addEventListener("click", () => {
    trace = [markerPoint(angle)];
    draw();
  });

  const observer = new ResizeObserver(resizeCanvas);
  observer.observe(stage);
  resizeCanvas();
}
