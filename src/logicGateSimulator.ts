import { getConnections } from "./logicGateConnections";
import { startConnectionDrag, startReconnectionDrag } from "./logicGateDrag";
import { defaultState, gateSymbols, getNextGateNumber, getNextInputId, getNextOutputId, isGateNode, isGateType, isInputNode, isOutputNode, nodeTypes } from "./logicGateModel";
import { updateWireLayer } from "./logicGateWires";
import type { GateInputKey, GateNode, GateType, InputNode, LogicNode, OutputNode, SignalConsumerNode, SimulatorState, SourceId } from "./logicGateModel";
import type { WirePreview } from "./logicGateWires";

export function mountLogicGateSimulator(root: HTMLElement) {
  const state: SimulatorState = structuredClone(defaultState);
  let nextGateNumber = getNextGateNumber(getGateNodes());
  let isFullScreenMode = false;
  let hasAdjustedInitialLayout = false;

  function getGateNodes() {
    return state.nodes.filter(isGateNode);
  }

  function getInputNodes() {
    return state.nodes.filter(isInputNode);
  }

  function getOutputNodes() {
    return state.nodes.filter(isOutputNode);
  }

  function createInputNode(): InputNode {
    const inputCount = getInputNodes().length;

    return {
      id: getNextInputId(state.nodes),
      kind: "input",
      value: false,
      x: 24,
      y: 40 + inputCount * 105
    };
  }

  function createGateNode(type: GateType): GateNode {
    const nextId = `G${nextGateNumber}`;
    const gateCount = getGateNodes().length;

    nextGateNumber += 1;

    return {
      id: nextId,
      kind: "gate",
      type,
      inputA: "",
      inputB: "",
      inputC: "",
      x: 210 + gateCount * 70,
      y: 70 + gateCount * 105
    };
  }

  function createOutputNode(): OutputNode {
    const outputCount = getOutputNodes().length;

    return {
      id: getNextOutputId(state.nodes),
      kind: "output",
      input: "",
      x: 430,
      y: 70 + outputCount * 105
    };
  }

  function evaluateSource(
    source: SourceId,
    overrides: Partial<Record<string, boolean>> = {},
    visited = new Set<string>()
  ): boolean {
    if (Object.hasOwn(overrides, source)) {
      return Boolean(overrides[source]);
    }

    const node = state.nodes.find((item) => item.id === source);
    if (!node || visited.has(node.id)) {
      return false;
    }

    if (isInputNode(node)) {
      return node.value;
    }

    if (isOutputNode(node)) {
      visited.add(node.id);
      return evaluateSource(node.input, overrides, visited);
    }

    visited.add(node.id);
    return evaluateGate(node, overrides, visited);
  }

  function evaluateGate(gate: GateNode, overrides: Partial<Record<string, boolean>> = {}, visited = new Set<string>()) {
    const a = evaluateSource(gate.inputA, overrides, new Set(visited));
    const b = gate.type === "NOT" ? false : evaluateSource(gate.inputB, overrides, new Set(visited));
    const c = gate.type === "AND3" ? evaluateSource(gate.inputC, overrides, new Set(visited)) : false;

    switch (gate.type) {
      case "AND":
        return a && b;
      case "AND3":
        return a && b && c;
      case "OR":
        return a || b;
      case "NOT":
        return !a;
      case "NAND":
        return !(a && b);
      case "NOR":
        return !(a || b);
      case "XOR":
        return a !== b;
      default:
        return false;
    }
  }

  function dependsOn(sourceId: string, targetId: string, seen = new Set<string>()): boolean {
    if (sourceId === targetId) {
      return true;
    }
    if (seen.has(sourceId)) {
      return false;
    }
    seen.add(sourceId);
    const node = state.nodes.find((item) => item.id === sourceId);
    if (!node || isInputNode(node)) {
      return false;
    }
    const dependencies: string[] = [];
    if (isOutputNode(node)) {
      if (node.input) {
        dependencies.push(node.input);
      }
    } else if (isGateNode(node)) {
      if (node.inputA) dependencies.push(node.inputA);
      if (node.inputB) dependencies.push(node.inputB);
      if (node.inputC) dependencies.push(node.inputC);
    }
    return dependencies.some((dependencyId) => dependsOn(dependencyId, targetId, seen));
  }

  function getAvailableSources(node: SignalConsumerNode) {
    const inputSources = getInputNodes();
    const gateSources = getGateNodes().filter((gate) => gate.id !== node.id && !dependsOn(gate.id, node.id));
    return [...inputSources, ...gateSources];
  }

  function normalizeNodeSources() {
    state.nodes.filter((node): node is SignalConsumerNode => isGateNode(node) || isOutputNode(node)).forEach((node) => {
      const availableSources = getAvailableSources(node);
      const availableIds = new Set(availableSources.map((node) => node.id));

      if (isGateNode(node)) {
        if (!availableIds.has(node.inputA)) {
          node.inputA = "";
        }
        if (!availableIds.has(node.inputB)) {
          node.inputB = "";
        }
        if (!availableIds.has(node.inputC)) {
          node.inputC = "";
        }
        return;
      }

      if (!availableIds.has(node.input)) {
        node.input = "";
      }
    });
  }

  function updateConnectionLayer(preview?: WirePreview) {
    updateWireLayer(root, getConnections(state.nodes), preview);
  }

  function adjustInitialNodeLayout() {
    if (
      state.nodes.length !== 2 ||
      !isInputNode(state.nodes[0]) ||
      !isOutputNode(state.nodes[1]) ||
      state.nodes[0].id !== "A" ||
      state.nodes[1].id !== "O1"
    ) {
      return false;
    }

    const board = root.querySelector<HTMLElement>(".logic-demo-board");
    if (!board) {
      return false;
    }

    const margin = 24;
    const nodeSize = 80;
    const visibleWidth = board.clientWidth;
    const input = state.nodes[0];
    const output = state.nodes[1];
    const nextInputX = margin;
    const nextOutputX = Math.max(margin + nodeSize + 80, visibleWidth - nodeSize - margin);
    const nextY = 190;

    if (input.x === nextInputX && input.y === nextY && output.x === nextOutputX && output.y === nextY) {
      return false;
    }

    input.x = nextInputX;
    input.y = nextY;
    output.x = nextOutputX;
    output.y = nextY;
    return true;
  }

  function renderInputNode(input: InputNode) {
    return `
      <article class="logic-node logic-input-node ${input.value ? "on" : ""}" data-node-id="${input.id}" style="left:${input.x}px; top:${input.y}px">
        <div class="logic-connectors logic-connectors-right" aria-hidden="true">
          <span class="logic-port logic-port-output" data-port-role="output" data-node-id="${input.id}" title="Output"></span>
        </div>
        <button type="button" class="logic-node-close" data-action="remove-node" aria-label="Remove input ${input.id}">x</button>
        <div class="logic-node-label">INPUT</div>
        <button type="button" class="logic-switch-toggle" data-action="toggle-input" aria-pressed="${input.value}" aria-label="Toggle input ${input.id}">
          <span class="logic-switch" aria-hidden="true">
            <span class="logic-switch-handle"></span>
          </span>
          <span class="logic-switch-state">${input.value ? "ON" : "OFF"}</span>
        </button>
      </article>
    `;
  }

  function renderOutputNode(output: OutputNode) {
    const value = evaluateSource(output.input);

    return `
      <article class="logic-node logic-output-node ${value ? "on" : ""}" data-node-id="${output.id}" style="left:${output.x}px; top:${output.y}px">
        <div class="logic-connectors logic-connectors-left logic-connectors-count-1" aria-hidden="true">
          <span class="logic-port logic-port-input ${output.input ? "connected" : ""}" data-port-role="input" data-node-id="${output.id}" data-input-key="input" title="Input"></span>
        </div>
        <button type="button" class="logic-node-close" data-action="remove-node" aria-label="Remove ${output.id}">x</button>
        <div class="logic-node-label">OUTPUT</div>
        <div class="logic-node-state">${value ? "1" : "0"}</div>
      </article>
    `;
  }

  function renderInputConnectors(gate: GateNode) {
    const inputKeys: GateInputKey[] = gate.type === "NOT" ? ["inputA"] : gate.type === "AND3" ? ["inputA", "inputB", "inputC"] : ["inputA", "inputB"];

    return inputKeys
      .map((inputKey, index) => {
        const isConnected = gate[inputKey] ? " connected" : "";
        return `<span class="logic-port logic-port-input${isConnected}" data-port-role="input" data-node-id="${gate.id}" data-input-key="${inputKey}" title="Input ${index + 1}"></span>`;
      })
      .join("");
  }

  function getGateLabel(gate: GateNode) {
    return gate.type === "AND3" ? "AND" : gate.type;
  }

  function getNodeTypeLabel(type: string) {
    return type === "AND3" ? "AND (3 input)" : type;
  }

  function renderGateNode(gate: GateNode) {
    const output = evaluateGate(gate);

    return `
      <article class="logic-node logic-gate-node ${output ? "on" : ""}" data-node-id="${gate.id}" style="left:${gate.x}px; top:${gate.y}px">
        <div class="logic-connectors logic-connectors-left logic-connectors-count-${gate.type === "NOT" ? "1" : gate.type === "AND3" ? "3" : "2"}" aria-hidden="true">
          ${renderInputConnectors(gate)}
        </div>
        <div class="logic-connectors logic-connectors-right" aria-hidden="true">
          <span class="logic-port logic-port-output" data-port-role="output" data-node-id="${gate.id}" title="Output"></span>
        </div>
        <button type="button" class="logic-node-close" data-action="remove-node" aria-label="Remove ${gate.id}">x</button>
        <div class="logic-node-label">${getGateLabel(gate)}</div>
        <img src="${gateSymbols[gate.type]}" alt="" aria-hidden="true">
        <div class="logic-node-state">${output ? "1" : "0"}</div>
      </article>
    `;
  }

  function renderNode(node: LogicNode) {
    if (isInputNode(node)) {
      return renderInputNode(node);
    }

    return isOutputNode(node) ? renderOutputNode(node) : renderGateNode(node);
  }

  function render() {
    root.classList.toggle("is-fullscreen", isFullScreenMode);
    root.innerHTML = `
      <div class="logic-demo-board" id="demo">
        <div class="logic-nodes">
          <svg class="logic-wires" aria-hidden="true"></svg>
          ${state.nodes.map((node) => renderNode(node)).join("")}
        </div>
      </div>

      <div class="logic-toolbar" id="ui-container">
        <select data-action="new-node-type" aria-label="Node type">
          ${nodeTypes.map((type) => `<option value="${type}">${getNodeTypeLabel(type)}</option>`).join("")}
        </select>
        <button type="button" data-action="add-node">Add Node</button>
        <button type="button" data-action="toggle-fullscreen" aria-pressed="${isFullScreenMode}">
          ${isFullScreenMode ? "Exit Full Screen" : "Full screen mode"}
        </button>
      </div>
    `;

    if (!hasAdjustedInitialLayout) {
      hasAdjustedInitialLayout = true;
      if (adjustInitialNodeLayout()) {
        render();
        return;
      }
    }

    updateConnectionLayer();
  }

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const actionButton = target.closest<HTMLButtonElement>("[data-action]");
    const nodeId = actionButton?.closest<HTMLElement>("[data-node-id]")?.dataset.nodeId;

    if (actionButton?.dataset.action === "toggle-input") {
      const inputNode = state.nodes.find((node): node is InputNode => node.id === nodeId && isInputNode(node));
      if (!inputNode) {
        return;
      }
      inputNode.value = !inputNode.value;
      render();
      return;
    }

    if (actionButton?.dataset.action === "add-node") {
      const typeSelect = root.querySelector<HTMLSelectElement>('[data-action="new-node-type"]');
      const selectedType = typeSelect?.value ?? "INPUT";
      state.nodes.push(
        selectedType === "OUTPUT"
          ? createOutputNode()
          : isGateType(selectedType)
            ? createGateNode(selectedType)
            : createInputNode()
      );
      render();
      return;
    }

    if (actionButton?.dataset.action === "toggle-fullscreen") {
      isFullScreenMode = !isFullScreenMode;
      render();
      return;
    }

    if (actionButton?.dataset.action === "remove-node") {
      if (!nodeId) {
        return;
      }
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      normalizeNodeSources();
      render();
    }
  });

  root.addEventListener("pointerdown", (event) => {
    const target = event.target as HTMLElement;
    const outputPort = target.closest<HTMLElement>('[data-port-role="output"]');
    if (outputPort) {
      startConnectionDrag(event, outputPort, { root, state, getAvailableSources, render, updateConnectionLayer });
      return;
    }
    const inputPort = target.closest<HTMLElement>('[data-port-role="input"]');
    if (inputPort) {
      if (inputPort.classList.contains("connected")) {
        startReconnectionDrag(event, inputPort, { root, state, getAvailableSources, render, updateConnectionLayer });
      }
      return;
    }

    const nodeElement = target.closest<HTMLElement>(".logic-node");

    if (
      !nodeElement ||
      target.closest("button") ||
      target.closest("select") ||
      target.closest("label")
    ) {
      return;
    }

    const logicNode = state.nodes.find((item) => item.id === nodeElement.dataset.nodeId);
    const board = root.querySelector<HTMLElement>(".logic-demo-board");

    if (!logicNode || !board) {
      return;
    }

    event.preventDefault();
    nodeElement.setPointerCapture(event.pointerId);
    nodeElement.classList.add("is-dragging");

    const boardRect = board.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();
    const offsetX = event.clientX - nodeRect.left;
    const offsetY = event.clientY - nodeRect.top;

    const onMove = (moveEvent: PointerEvent) => {
      const nextX = moveEvent.clientX - boardRect.left + board.scrollLeft - offsetX;
      const nextY = moveEvent.clientY - boardRect.top + board.scrollTop - offsetY;
      const maxX = Math.max(0, board.scrollWidth - nodeElement.offsetWidth);
      const maxY = Math.max(0, board.scrollHeight - nodeElement.offsetHeight);

      logicNode.x = Math.min(Math.max(0, nextX), maxX);
      logicNode.y = Math.min(Math.max(0, nextY), maxY);
      nodeElement.style.left = `${logicNode.x}px`;
      nodeElement.style.top = `${logicNode.y}px`;
      updateConnectionLayer();
    };

    const onUp = (upEvent: PointerEvent) => {
      nodeElement.releasePointerCapture(upEvent.pointerId);
      nodeElement.classList.remove("is-dragging");
      nodeElement.removeEventListener("pointermove", onMove);
      nodeElement.removeEventListener("pointerup", onUp);
      nodeElement.removeEventListener("pointercancel", onUp);
    };

    nodeElement.addEventListener("pointermove", onMove);
    nodeElement.addEventListener("pointerup", onUp);
    nodeElement.addEventListener("pointercancel", onUp);
  });

  render();
}
