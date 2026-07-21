import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type Vector3Tuple = [number, number, number];

type VectorEntry = {
  id: string;
  label: string;
  color: string;
  colorName: string;
  value: string;
  type: "vector" | "expression";
};

type ComputedVector = {
  id: string;
  label: string;
  color: string;
  vector: Vector3Tuple;
};

const DEFAULT_AXIS_LIMIT = 15;
const GRID_CENTER_LINE_COLOR = "#bbbbbb";
const GRID_LINE_COLOR = "#bbbbbb";
const PLOT_LINE_WIDTH = 2;
const PLOT_LABEL_COLOR = "#000000";
const PLOT_LABEL_SIZE_MULTIPLIER = 3;
const TICK_LABEL_SIZE_MULTIPLIER = 2;
const PLANE_BORDER_COLOR = "#000000";
const CAMERA_ZOOM_FACTOR = 0.85;
const VECTOR_COLORS = [
  { color: "#4f81bd", name: "Blue" },
  { color: "#d9534f", name: "Red" },
  { color: "#8064a2", name: "Purple" },
  { color: "#37d8e6", name: "Turquoise" },
  { color: "#75c841", name: "Green" },
  { color: "#f79646", name: "Orange" },
  { color: "#8f3938", name: "Brown" },
  { color: "#ff00ff", name: "Magenta" }
];
const EXTRA_ENTRY_COLORS = [VECTOR_COLORS[5], VECTOR_COLORS[7], VECTOR_COLORS[6]];

function parseVector(value: string): Vector3Tuple | undefined {
  const trimmed = value.trim().replace(/^\(/, "").replace(/\)$/, "");
  const rawParts = trimmed.split(",").map((part) => part.trim());

  if (rawParts.length !== 3 || rawParts.some((part) => part === "")) {
    return undefined;
  }

  const parts = rawParts.map((part) => Number(part));

  if (parts.some((part) => !Number.isFinite(part))) {
    return undefined;
  }

  return [parts[0], parts[1], parts[2]];
}

function add(a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function formatVector(vector: Vector3Tuple) {
  return `(${vector.map((value) => Number(value.toFixed(3))).join(", ")})`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createTextSprite(text: string, color = "#333333") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = 128;

  canvas.width = size;
  canvas.height = size / 2;

  if (context) {
    context.font = "400 28px Open Sans, Arial, sans-serif";
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.8, 0.4, 1);

  return sprite;
}

function createAxisLine(start: THREE.Vector3, end: THREE.Vector3, color: string) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color, linewidth: PLOT_LINE_WIDTH });

  return new THREE.Line(geometry, material);
}

function createPlaneBorder(axisLimit: number) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-axisLimit, 0, -axisLimit),
    new THREE.Vector3(axisLimit, 0, -axisLimit),
    new THREE.Vector3(axisLimit, 0, axisLimit),
    new THREE.Vector3(-axisLimit, 0, axisLimit),
    new THREE.Vector3(-axisLimit, 0, -axisLimit)
  ]);
  const material = new THREE.LineBasicMaterial({ color: PLANE_BORDER_COLOR, linewidth: PLOT_LINE_WIDTH });

  return new THREE.Line(geometry, material);
}

function toSceneVector(vector: Vector3Tuple) {
  return new THREE.Vector3(vector[0], vector[2], -vector[1]);
}

function getNiceNumber(value: number) {
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const fraction = value / base;

  if (fraction <= 1) {
    return base;
  }
  if (fraction <= 1.5) {
    return 1.5 * base;
  }
  if (fraction <= 2) {
    return 2 * base;
  }
  if (fraction <= 5) {
    return 5 * base;
  }
  return 10 * base;
}

function getAxisScale(maxAbsValue: number) {
  const paddedValue = maxAbsValue <= DEFAULT_AXIS_LIMIT
    ? DEFAULT_AXIS_LIMIT
    : maxAbsValue * 1.05;
  const axisLimit = getNiceNumber(paddedValue);
  const tickStep = getNiceNumber(axisLimit / 5);

  return { axisLimit, tickStep };
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();

    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else {
      material?.dispose();
    }
  });
}

export function mountVectorPlotter(root: HTMLElement) {
  let entries: VectorEntry[] = [
    {
      id: "v1",
      label: "Vector v1",
      color: VECTOR_COLORS[0].color,
      colorName: VECTOR_COLORS[0].name,
      value: "(3,-1,4)",
      type: "vector"
    },
    {
      id: "v2",
      label: "Vector v2",
      color: VECTOR_COLORS[1].color,
      colorName: VECTOR_COLORS[1].name,
      value: "(-2,3,1)",
      type: "vector"
    }
  ];
  let expressionCount = 0;
  let showResultant = false;
  let showDifference = false;
  let showCrossProduct = false;

  root.innerHTML = `
    <div class="vector-plotter-layout">
      <div class="vector-plotter-stage">
        <div class="vector-plotter-canvas" data-vector-canvas></div>
        <output class="vector-plotter-readout" data-vector-readout></output>
      </div>
      <form class="vector-plotter-controls" data-vector-controls>
        <div class="vector-actions">
          <button type="submit">Draw</button>
        </div>
        <div class="vector-control-list" data-vector-base-inputs></div>
        <label class="vector-toggle">
          <input type="checkbox" name="showResultant">
          Show resultant, v1 + v2 (Purple)
        </label>
        <label class="vector-toggle">
          <input type="checkbox" name="showDifference">
          Show difference, v1 - v2 (Turquoise)
        </label>
        <label class="vector-toggle">
          <input type="checkbox" name="showCrossProduct">
          Show cross product, v1 x v2 (Green)
        </label>
        <div class="vector-actions">
          <button type="button" data-action="add-vector">Add a Vector</button>
          <button type="button" data-action="add-expression">Add an Expression</button>
        </div>
        <div class="vector-control-list" data-vector-extra-inputs></div>
        <p class="vector-error" data-vector-error role="alert"></p>
      </form>
    </div>
  `;

  const canvasHost = root.querySelector<HTMLElement>("[data-vector-canvas]");
  const controlsForm = root.querySelector<HTMLFormElement>("[data-vector-controls]");
  const baseInputsHost = root.querySelector<HTMLElement>("[data-vector-base-inputs]");
  const extraInputsHost = root.querySelector<HTMLElement>("[data-vector-extra-inputs]");
  const readout = root.querySelector<HTMLOutputElement>("[data-vector-readout]");
  const errorMessage = root.querySelector<HTMLElement>("[data-vector-error]");

  if (!canvasHost || !controlsForm || !baseInputsHost || !extraInputsHost || !readout || !errorMessage) {
    return;
  }

  const canvasElement = canvasHost;
  const formElement = controlsForm;
  const baseInputsElement = baseInputsHost;
  const extraInputsElement = extraInputsHost;
  const readoutElement = readout;
  const errorElement = errorMessage;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(-7, 6, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasElement.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);

  function frameCameraToAxis(force = false) {
    const targetDistance = Math.max(16, axisLimit * 3.6) * CAMERA_ZOOM_FACTOR;
    const currentDirection = camera.position.clone().sub(controls.target);
    const direction = currentDirection.lengthSq() > 0
      ? currentDirection.normalize()
      : new THREE.Vector3(1, 0.7, 1).normalize();

    if (force || camera.position.distanceTo(controls.target) < targetDistance) {
      camera.position.copy(controls.target).add(direction.multiplyScalar(targetDistance));
      camera.near = Math.max(0.1, axisLimit / 500);
      camera.far = Math.max(1000, axisLimit * 20);
      camera.updateProjectionMatrix();
      controls.update();
    }
  }

  const vectorGroup = new THREE.Group();
  scene.add(vectorGroup);

  let grid: THREE.GridHelper | undefined;
  let axisLimit = DEFAULT_AXIS_LIMIT;
  let tickStep = 1;
  const axes = new THREE.Group();
  let xAxisLabel: THREE.Sprite | undefined;
  let yAxisLabel: THREE.Sprite | undefined;
  let zAxisLabel: THREE.Sprite | undefined;
  const xTickLabels: Array<{ tick: number; sprite: THREE.Sprite }> = [];
  const yTickLabels: Array<{ tick: number; sprite: THREE.Sprite }> = [];
  const zTickLabels: Array<{ tick: number; sprite: THREE.Sprite }> = [];
  scene.add(axes);

  const endpointMeshes: Array<{ mesh: THREE.Mesh; vector: ComputedVector }> = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function resize() {
    const width = canvasElement.clientWidth;
    const height = Math.max(280, Math.round(width * 0.67));
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function updateTickLabels() {
    const xSide = camera.position.x >= 0 ? 1 : -1;
    const ySide = camera.position.z >= 0 ? 1 : -1;
    const labelOffset = Math.max(0.45, axisLimit * 0.035);
    const verticalOffset = Math.max(0.5, axisLimit * 0.035);

    xAxisLabel?.position.set(0, 0, ySide * (axisLimit + labelOffset));
    yAxisLabel?.position.set(xSide * (axisLimit + labelOffset), 0, 0);
    zAxisLabel?.position.set(xSide * verticalOffset, 0, ySide * verticalOffset);

    xTickLabels.forEach(({ tick, sprite }) => {
      sprite.position.set(tick, 0, ySide * (axisLimit + labelOffset));
    });
    yTickLabels.forEach(({ tick, sprite }) => {
      sprite.position.set(xSide * (axisLimit + labelOffset), 0, -tick);
    });
    zTickLabels.forEach(({ tick, sprite }) => {
      sprite.position.set(xSide * verticalOffset, tick, ySide * verticalOffset);
    });
  }

  function rebuildAxes(nextAxisLimit: number, nextTickStep: number) {
    axisLimit = nextAxisLimit;
    tickStep = nextTickStep;

    if (grid) {
      scene.remove(grid);
      disposeObject(grid);
    }

    disposeObject(axes);
    axes.clear();
    xTickLabels.length = 0;
    yTickLabels.length = 0;
    zTickLabels.length = 0;

    const gridDivisions = Math.max(2, Math.round((axisLimit * 2) / tickStep));
    const labelScale = (axisLimit / DEFAULT_AXIS_LIMIT) * PLOT_LABEL_SIZE_MULTIPLIER;

    grid = new THREE.GridHelper(axisLimit * 2, gridDivisions, GRID_CENTER_LINE_COLOR, GRID_LINE_COLOR);
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((material) => {
      if (material instanceof THREE.LineBasicMaterial) {
        material.linewidth = PLOT_LINE_WIDTH;
      }
    });
    scene.add(grid);

    axes.add(createPlaneBorder(axisLimit));
    axes.add(createAxisLine(new THREE.Vector3(-axisLimit, 0, 0), new THREE.Vector3(axisLimit, 0, 0), GRID_LINE_COLOR));
    axes.add(createAxisLine(new THREE.Vector3(0, 0, axisLimit), new THREE.Vector3(0, 0, -axisLimit), GRID_LINE_COLOR));
    axes.add(createAxisLine(new THREE.Vector3(0, -axisLimit, 0), new THREE.Vector3(0, axisLimit, 0), GRID_LINE_COLOR));

    xAxisLabel = createTextSprite("x", PLOT_LABEL_COLOR);
    yAxisLabel = createTextSprite("y", PLOT_LABEL_COLOR);
    zAxisLabel = createTextSprite("z", PLOT_LABEL_COLOR);
    xAxisLabel.scale.set(2.4 * labelScale, 1.2 * labelScale, 1);
    yAxisLabel.scale.set(2.4 * labelScale, 1.2 * labelScale, 1);
    zAxisLabel.scale.set(2.4 * labelScale, 1.2 * labelScale, 1);
    axes.add(xAxisLabel, yAxisLabel, zAxisLabel);

    const tickCount = Math.round(axisLimit / tickStep);
    for (let index = -tickCount; index <= tickCount; index += 1) {
      const tick = index * tickStep;
      if (tick === 0 || Math.abs(tick) >= axisLimit) {
        continue;
      }

      const label = String(Number(tick.toFixed(6)));
      const xTick = createTextSprite(label, PLOT_LABEL_COLOR);
      xTick.scale.set(1.35 * labelScale * TICK_LABEL_SIZE_MULTIPLIER, 0.66 * labelScale * TICK_LABEL_SIZE_MULTIPLIER, 1);
      const yTick = createTextSprite(label, PLOT_LABEL_COLOR);
      yTick.scale.set(1.35 * labelScale * TICK_LABEL_SIZE_MULTIPLIER, 0.66 * labelScale * TICK_LABEL_SIZE_MULTIPLIER, 1);
      const zTick = createTextSprite(label, PLOT_LABEL_COLOR);
      zTick.scale.set(1.35 * labelScale * TICK_LABEL_SIZE_MULTIPLIER, 0.66 * labelScale * TICK_LABEL_SIZE_MULTIPLIER, 1);

      xTickLabels.push({ tick, sprite: xTick });
      yTickLabels.push({ tick, sprite: yTick });
      zTickLabels.push({ tick, sprite: zTick });
      axes.add(xTick, yTick, zTick);
    }

    updateTickLabels();
  }

  function renderInputs() {
    const renderEntry = (entry: VectorEntry) => `
      <label class="vector-field">
        <span>${entry.label} (${entry.colorName})</span>
        <input name="${entry.id}" value="${escapeHtml(entry.value)}" autocomplete="off" spellcheck="false">
      </label>
    `;

    baseInputsElement.innerHTML = entries
      .filter((entry) => entry.id === "v1" || entry.id === "v2")
      .map(renderEntry)
      .join("");
    extraInputsElement.innerHTML = entries
      .filter((entry) => entry.id !== "v1" && entry.id !== "v2")
      .map(renderEntry)
      .join("");
  }

  function readEntries() {
    entries = entries.map((entry) => {
      const input = formElement.elements.namedItem(entry.id) as HTMLInputElement | null;
      return { ...entry, value: input?.value ?? entry.value };
    });
    showResultant = Boolean((formElement.elements.namedItem("showResultant") as HTMLInputElement | null)?.checked);
    showDifference = Boolean((formElement.elements.namedItem("showDifference") as HTMLInputElement | null)?.checked);
    showCrossProduct = Boolean((formElement.elements.namedItem("showCrossProduct") as HTMLInputElement | null)?.checked);
  }

  function evaluateExpression(expression: string, vectorsById: Map<string, Vector3Tuple>) {
    const match = expression.trim().match(/^([ve]\d+)\s*([+\-x])\s*([ve]\d+)$/i);
    if (!match) {
      return undefined;
    }

    const left = vectorsById.get(match[1].toLowerCase());
    const right = vectorsById.get(match[3].toLowerCase());
    if (!left || !right) {
      return undefined;
    }

    if (match[2] === "+") {
      return add(left, right);
    }
    if (match[2] === "-") {
      return subtract(left, right);
    }
    return cross(left, right);
  }

  function computeVectors() {
    const parsedBaseVectors = new Map<string, Vector3Tuple>();
    const computed: ComputedVector[] = [];

    entries
      .filter((entry) => entry.type === "vector")
      .forEach((entry) => {
        const vector = parseVector(entry.value);
        if (!vector) {
          throw new Error(`There is a problem with ${entry.id}. Use the form (x,y,z).`);
        }
        parsedBaseVectors.set(entry.id, vector);
        computed.push({ id: entry.id, label: entry.id, color: entry.color, vector });
      });

    const v1 = parsedBaseVectors.get("v1");
    const v2 = parsedBaseVectors.get("v2");
    if (!v1 || !v2) {
      throw new Error("Vectors v1 and v2 are required.");
    }

    if (showResultant) {
      computed.push({ id: "vResultant", label: "v1 + v2", color: VECTOR_COLORS[2].color, vector: add(v1, v2) });
    }
    if (showDifference) {
      computed.push({ id: "vDifference", label: "v1 - v2", color: VECTOR_COLORS[3].color, vector: subtract(v1, v2) });
    }
    if (showCrossProduct) {
      computed.push({ id: "vCross", label: "v1 x v2", color: VECTOR_COLORS[4].color, vector: cross(v1, v2) });
    }

    entries
      .filter((entry) => entry.type === "expression")
      .forEach((entry) => {
        const vector = evaluateExpression(entry.value, parsedBaseVectors);
        if (!vector) {
          throw new Error(`Could not evaluate ${entry.id}. Try an expression like v1 x v2, v1 + v2, or v1 - v2.`);
        }
        parsedBaseVectors.set(entry.id, vector);
        computed.push({ id: entry.id, label: entry.id, color: entry.color, vector });
      });

    return computed;
  }

  function clearVectors() {
    endpointMeshes.length = 0;
    disposeObject(vectorGroup);
    vectorGroup.clear();
  }

  function drawVector(vector: ComputedVector) {
    const direction = toSceneVector(vector.vector);
    const length = direction.length();

    if (length === 0) {
      return;
    }

    const color = new THREE.Color(vector.color);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      direction
    ]);
    const line = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color })
    );
    vectorGroup.add(line);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color, depthWrite: false, opacity: 0, transparent: true })
    );
    sphere.position.copy(direction);
    vectorGroup.add(sphere);
    endpointMeshes.push({ mesh: sphere, vector });
  }

  function updatePlot() {
    try {
      readEntries();
      const vectors = computeVectors();
      const maxMagnitude = Math.max(DEFAULT_AXIS_LIMIT, ...vectors.map((item) => Math.max(...item.vector.map((value) => Math.abs(value)))));
      const nextScale = getAxisScale(maxMagnitude);

      controls.maxDistance = Math.max(20, nextScale.axisLimit * 6);
      if (nextScale.axisLimit !== axisLimit || nextScale.tickStep !== tickStep) {
        rebuildAxes(nextScale.axisLimit, nextScale.tickStep);
        frameCameraToAxis(true);
      }
      clearVectors();
      vectors.forEach(drawVector);
      errorElement.textContent = "";
    } catch (error) {
      errorElement.textContent = error instanceof Error ? error.message : "There is a problem with your input, please try again.";
    }
  }

  function getNextExtraEntryColor() {
    const extraEntryCount = entries.filter((entry) => entry.id !== "v1" && entry.id !== "v2").length;

    return EXTRA_ENTRY_COLORS[extraEntryCount % EXTRA_ENTRY_COLORS.length];
  }

  function addVectorEntry() {
    const vectorCount = entries.filter((entry) => entry.type === "vector").length + 1;
    const colorChoice = getNextExtraEntryColor();
    entries.push({
      id: `v${vectorCount}`,
      label: `Vector v${vectorCount}`,
      color: colorChoice.color,
      colorName: colorChoice.name,
      value: "(1,2,3)",
      type: "vector"
    });
    renderInputs();
    updatePlot();
  }

  function addExpressionEntry() {
    expressionCount += 1;
    const colorChoice = getNextExtraEntryColor();
    entries.push({
      id: `e${expressionCount}`,
      label: `Expression e${expressionCount}`,
      color: colorChoice.color,
      colorName: colorChoice.name,
      value: "v1 x v2",
      type: "expression"
    });
    renderInputs();
    updatePlot();
  }

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    updatePlot();
  });

  formElement.addEventListener("change", () => updatePlot());

  formElement.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
    if (!button) {
      return;
    }

    if (button.dataset.action === "add-vector") {
      addVectorEntry();
    } else if (button.dataset.action === "add-expression") {
      addExpressionEntry();
    }
  });

  renderer.domElement.addEventListener("click", (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(endpointMeshes.map((item) => item.mesh));
    const selected = endpointMeshes.find((item) => item.mesh === intersects[0]?.object);
    if (selected) {
      readoutElement.textContent = `${selected.vector.label}: ${formatVector(selected.vector.vector)}`;
    }
  });

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(canvasElement);

  function animate() {
    if (!root.isConnected) {
      resizeObserver.disconnect();
      renderer.dispose();
      return;
    }

    controls.update();
    updateTickLabels();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }

  renderInputs();
  resize();
  rebuildAxes(axisLimit, tickStep);
  frameCameraToAxis(true);
  updateTickLabels();
  updatePlot();
  animate();
}
