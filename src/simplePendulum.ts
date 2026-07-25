const MIN_LENGTH = 50;
const MAX_LENGTH = 500;
const INITIAL_ANGLE = 0.2;

export function clampPendulumLength(value: number) {
  return Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, value));
}

function renderLengthControl(index: number, value: number, color: string) {
  return `
    <div class="pendulum-control">
      <label for="pendulum-${index}">Pendulum ${index} Length</label>
      <div>
        <input id="pendulum-${index}" data-length-number="${index}" type="number" min="${MIN_LENGTH}" max="${MAX_LENGTH}" value="${value}">
        <span>pixels</span>
      </div>
      <input data-length="${index}" type="range" min="${MIN_LENGTH}" max="${MAX_LENGTH}" step="1" value="${value}" style="--range-color:${color}">
    </div>`;
}

export function mountSimplePendulum(root: HTMLElement) {
  root.innerHTML = `
    <div class="pendulum-layout">
      <div class="pendulum-stage"><canvas></canvas></div>
      <div class="pendulum-controls">
        ${renderLengthControl(1, 100, "lightblue")}
        ${renderLengthControl(2, 400, "lightgreen")}
        <div class="pendulum-button"><button type="button" data-start>Start</button></div>
        <div class="pendulum-button"><button type="button" data-reset>Reset</button></div>
      </div>
    </div>`;

  const stage = root.querySelector<HTMLElement>(".pendulum-stage")!;
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const context = canvas.getContext("2d")!;
  const lengths = [100, 400];
  const angles = [INITIAL_ANGLE, INITIAL_ANGLE];
  const velocities = [0, 0];
  let animationFrame = 0;
  let running = false;

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    lengths.forEach((length, index) => {
      const x = width / 2 - length * Math.sin(angles[index]);
      const y = length * Math.cos(angles[index]);
      context.beginPath();
      context.moveTo(width / 2, 0);
      context.lineTo(x, y);
      context.strokeStyle = "#aaa";
      context.lineWidth = 1;
      context.stroke();
      context.beginPath();
      context.arc(x, y, 6, 0, Math.PI * 2);
      context.fillStyle = index ? "lightgreen" : "lightblue";
      context.fill();
    });
  }

  function resize() {
    const pixelRatio = devicePixelRatio || 1;
    const width = stage.clientWidth;
    const height = width * 2 / 3;
    stage.style.height = `${height}px`;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  function animate() {
    if (!running || !root.isConnected) return;
    lengths.forEach((length, index) => {
      velocities[index] += -9.8 * angles[index] * 0.1 / length;
      angles[index] += velocities[index];
    });
    draw();
    animationFrame = requestAnimationFrame(animate);
  }

  root.querySelectorAll<HTMLInputElement>("[data-length]").forEach((slider) => {
    const index = Number(slider.dataset.length) - 1;
    const numberInput = root.querySelector<HTMLInputElement>(`[data-length-number="${index + 1}"]`)!;
    const updateLength = (value: number) => {
      lengths[index] = clampPendulumLength(value);
      slider.value = numberInput.value = String(lengths[index]);
      slider.style.setProperty("--range-progress", `${(lengths[index] - MIN_LENGTH) / 4.5}%`);
      draw();
    };
    slider.addEventListener("input", () => updateLength(Number(slider.value)));
    numberInput.addEventListener("change", () => updateLength(Number(numberInput.value)));
    updateLength(lengths[index]);
  });

  const fields = [...root.querySelectorAll<HTMLInputElement>("input")];
  const startButton = root.querySelector<HTMLButtonElement>("[data-start]")!;
  startButton.addEventListener("click", () => {
    if (running) return;
    running = true;
    fields.forEach((field) => { field.disabled = true; });
    startButton.disabled = true;
    animationFrame = requestAnimationFrame(animate);
  });
  root.querySelector<HTMLButtonElement>("[data-reset]")!.addEventListener("click", () => {
    running = false;
    cancelAnimationFrame(animationFrame);
    angles.fill(INITIAL_ANGLE);
    velocities.fill(0);
    fields.forEach((field) => { field.disabled = false; });
    startButton.disabled = false;
    draw();
  });

  new ResizeObserver(resize).observe(stage);
  resize();
}
