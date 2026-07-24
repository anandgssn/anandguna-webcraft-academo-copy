type Charge = { x: number; y: number; q: number };

const SIZE = 500;
const CHARGE_RADIUS = 10;
const LINES_PER_CHARGE = 10;

export function mountElectricField(root: HTMLElement) {
  root.innerHTML = `
    <div class="electric-field-layout">
      <div class="electric-field-stage"><canvas width="500" height="500" aria-label="Electric field lines around two draggable point charges"></canvas></div>
      <div class="electric-field-controls">
        ${controlMarkup(1, 2)}
        ${controlMarkup(2, -1)}
      </div>
    </div>`;
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const context = canvas.getContext("2d")!;
  const charges: Charge[] = [{ x: 150, y: 250, q: 2 }, { x: 350, y: 250, q: -1 }];
  let dragged = -1;

  function fieldAt(x: number, y: number) {
    return charges.reduce((field, charge) => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const distanceSquared = Math.max(dx * dx + dy * dy, 25);
      const scale = charge.q / Math.pow(distanceSquared, 1.5);
      field.x += dx * scale;
      field.y += dy * scale;
      return field;
    }, { x: 0, y: 0 });
  }

  function traceLine(startX: number, startY: number, direction: number) {
    let x = startX;
    let y = startY;
    let distanceSinceArrow = 0;
    context.beginPath();
    context.moveTo(x, y);
    for (let step = 0; step < 2500; step += 1) {
      const field = fieldAt(x, y);
      const magnitude = Math.hypot(field.x, field.y);
      if (!Number.isFinite(magnitude) || magnitude < 1e-10) break;
      const previousX = x;
      const previousY = y;
      x += direction * field.x / magnitude * 10;
      y += direction * field.y / magnitude * 10;
      context.lineTo(x, y);
      if (step > 5 && charges.some((charge) => Math.hypot(x - charge.x, y - charge.y) < CHARGE_RADIUS)) break;
      // Dipole lines may leave the viewport and curve back into it before
      // terminating at the opposite charge, so integrate beyond the canvas.
      if (x < -2000 || x > SIZE + 2000 || y < -2000 || y > SIZE + 2000) break;
      distanceSinceArrow += Math.hypot(x - previousX, y - previousY);
      if (distanceSinceArrow >= 100) {
        drawArrow(previousX, previousY, x, y, direction);
        distanceSinceArrow = 0;
      }
    }
    context.stroke();
  }

  function drawArrow(x1: number, y1: number, x2: number, y2: number, direction: number) {
    const angle = Math.atan2((y2 - y1) * direction, (x2 - x1) * direction);
    context.moveTo(x2, y2);
    context.lineTo(x2 - 5 * Math.cos(angle - .5), y2 - 5 * Math.sin(angle - .5));
    context.moveTo(x2, y2);
    context.lineTo(x2 - 5 * Math.cos(angle + .5), y2 - 5 * Math.sin(angle + .5));
    context.moveTo(x2, y2);
  }

  function draw() {
    context.clearRect(0, 0, SIZE, SIZE);
    context.strokeStyle = "#999";
    context.lineWidth = 1;
    const sources = charges.filter((charge) => charge.q > 0);
    const seeds = sources.length ? sources : charges.filter((charge) => charge.q < 0);
    seeds.forEach((charge) => {
      const count = Math.abs(charge.q) * LINES_PER_CHARGE;
      for (let index = 0; index < count; index += 1) {
        const angle = index * Math.PI * 2 / count;
        traceLine(
          charge.x + Math.sin(angle) * CHARGE_RADIUS,
          charge.y + Math.cos(angle) * CHARGE_RADIUS,
          charge.q > 0 ? 1 : -1
        );
      }
    });
    charges.forEach((charge) => {
      context.beginPath();
      context.arc(charge.x, charge.y, CHARGE_RADIUS, 0, Math.PI * 2);
      context.fillStyle = charge.q > 0 ? "#f00" : charge.q < 0 ? "#00f" : "#333";
      context.fill();
    });
  }

  root.querySelectorAll<HTMLInputElement>("[data-charge]").forEach((input) => {
    const index = Number(input.dataset.charge) - 1;
    const number = root.querySelector<HTMLInputElement>(`[data-charge-number="${index + 1}"]`)!;
    const update = (value: number) => {
      charges[index].q = Math.max(-5, Math.min(5, value));
      input.value = String(charges[index].q);
      number.value = String(charges[index].q);
      input.style.setProperty("--range-progress", `${(charges[index].q + 5) * 10}%`);
      draw();
    };
    input.addEventListener("input", () => update(Number(input.value)));
    number.addEventListener("change", () => update(Number(number.value)));
    update(charges[index].q);
  });

  canvas.addEventListener("pointerdown", (event) => {
    const point = canvasPoint(event, canvas);
    dragged = charges.findIndex((charge) => Math.hypot(point.x - charge.x, point.y - charge.y) <= 18);
    if (dragged >= 0) canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (dragged < 0) return;
    const point = canvasPoint(event, canvas);
    charges[dragged].x = Math.max(CHARGE_RADIUS, Math.min(SIZE - CHARGE_RADIUS, point.x));
    charges[dragged].y = Math.max(CHARGE_RADIUS, Math.min(SIZE - CHARGE_RADIUS, point.y));
    draw();
  });
  canvas.addEventListener("pointerup", () => { dragged = -1; });
  draw();
}

function controlMarkup(index: number, value: number) {
  return `<div class="electric-field-control"><label for="charge-${index}">Charge ${index}</label><input id="charge-${index}" data-charge-number="${index}" type="number" min="-5" max="5" step="1" value="${value}"><input data-charge="${index}" type="range" min="-5" max="5" step="1" value="${value}" aria-label="Charge ${index} slider"></div>`;
}

function canvasPoint(event: PointerEvent, canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  return { x: (event.clientX - bounds.left) * SIZE / bounds.width, y: (event.clientY - bounds.top) * SIZE / bounds.height };
}
