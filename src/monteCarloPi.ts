const CANVAS_SIZE = 500;

export function mountMonteCarloPi(root: HTMLElement) {
  root.innerHTML = `
    <div class="monte-carlo-layout">
      <div class="monte-carlo-stage">
        <canvas width="500" height="500" aria-label="Monte Carlo simulation estimating Pi with random points"></canvas>
      </div>
      <div class="monte-carlo-controls">
        <div class="monte-carlo-stats" aria-live="polite">
          Total Number of points: <span data-total>0</span><br>
          Points within circle: <span data-inner>0</span><br>
          Pi estimation: <span data-estimate></span><br>
        </div>
        <div class="monte-carlo-button-control"><button type="button" data-add-point>Add points one-by-one</button></div>
        <label class="monte-carlo-check"><span>Animate</span><input type="checkbox" data-animate><i aria-hidden="true"></i></label>
        <div class="monte-carlo-speed">
          <label for="monte-carlo-speed">Speed</label>
          <input id="monte-carlo-speed" type="range" min="1" max="100" step="1" value="1">
        </div>
        <div class="monte-carlo-button-control"><button type="button" data-reset>Reset</button></div>
      </div>
    </div>`;

  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const context = canvas.getContext("2d")!;
  const totalOutput = root.querySelector<HTMLElement>("[data-total]")!;
  const innerOutput = root.querySelector<HTMLElement>("[data-inner]")!;
  const estimateOutput = root.querySelector<HTMLElement>("[data-estimate]")!;
  const animateInput = root.querySelector<HTMLInputElement>("[data-animate]")!;
  const speedInput = root.querySelector<HTMLInputElement>("#monte-carlo-speed")!;
  let totalPoints = 0;
  let innerPoints = 0;
  let animationFrame = 0;

  function paintSpeed() {
    const progress = ((Number(speedInput.value) - 1) / 99) * 100;
    speedInput.style.setProperty("--range-progress", `${progress}%`);
  }

  function drawBoundary() {
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.beginPath();
    context.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2);
    context.strokeStyle = "#999";
    context.lineWidth = 1;
    context.stroke();
  }

  function updateDisplay() {
    totalOutput.textContent = String(totalPoints);
    innerOutput.textContent = String(innerPoints);
    estimateOutput.textContent = totalPoints ? (4 * innerPoints / totalPoints).toFixed(5) : "";
  }

  function addPoints(amount: number) {
    for (let index = 0; index < amount; index += 1) {
      const x = Math.random();
      const y = Math.random();
      const inside = (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.25;
      context.fillStyle = inside ? "#f00" : "#00f";
      context.fillRect(x * CANVAS_SIZE, y * CANVAS_SIZE, 1, 1);
      totalPoints += 1;
      if (inside) innerPoints += 1;
    }
    updateDisplay();
  }

  function animate() {
    if (!animateInput.checked || !root.isConnected) return;
    addPoints(Number(speedInput.value));
    animationFrame = window.requestAnimationFrame(animate);
  }

  root.querySelector<HTMLButtonElement>("[data-add-point]")!.addEventListener("click", () => addPoints(1));
  root.querySelector<HTMLButtonElement>("[data-reset]")!.addEventListener("click", () => {
    totalPoints = 0;
    innerPoints = 0;
    drawBoundary();
    updateDisplay();
  });
  animateInput.addEventListener("change", () => {
    window.cancelAnimationFrame(animationFrame);
    if (animateInput.checked) animationFrame = window.requestAnimationFrame(animate);
  });
  speedInput.addEventListener("input", paintSpeed);

  drawBoundary();
  updateDisplay();
  paintSpeed();
}
