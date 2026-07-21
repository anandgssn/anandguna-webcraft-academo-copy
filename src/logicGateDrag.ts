import { canConnect, clearConsumerSource, getConsumerSource, setConsumerSource } from "./logicGateConnections";
import { getLayerPoint } from "./logicGateWires";
import type { Connection, SignalConsumerNode, SignalSourceNode, SimulatorState } from "./logicGateModel";
import type { WirePreview } from "./logicGateWires";

type DragContext = {
  root: HTMLElement;
  state: SimulatorState;
  getAvailableSources: (node: SignalConsumerNode) => SignalSourceNode[];
  render: () => void;
  updateConnectionLayer: (preview?: WirePreview) => void;
};

const PORT_DROP_MARGIN = 18;

function getInputPortAtPoint(root: HTMLElement, clientX: number, clientY: number) {
  const exactPort = document
    .elementFromPoint(clientX, clientY)
    ?.closest<HTMLElement>('[data-port-role="input"]');

  if (exactPort && root.contains(exactPort)) {
    return exactPort;
  }

  const nearbyPorts = Array.from(root.querySelectorAll<HTMLElement>('[data-port-role="input"]'));
  let nearestPort: HTMLElement | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  nearbyPorts.forEach((port) => {
    const rect = port.getBoundingClientRect();
    const isWithinExpandedTarget =
      clientX >= rect.left - PORT_DROP_MARGIN &&
      clientX <= rect.right + PORT_DROP_MARGIN &&
      clientY >= rect.top - PORT_DROP_MARGIN &&
      clientY <= rect.bottom + PORT_DROP_MARGIN;

    if (!isWithinExpandedTarget) {
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(clientX - centerX, clientY - centerY);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestPort = port;
    }
  });

  return nearestPort;
}

export function startConnectionDrag(event: PointerEvent, sourcePort: HTMLElement, context: DragContext) {
  const sourceId = sourcePort.dataset.nodeId;
  const layer = context.root.querySelector<SVGSVGElement>(".logic-wires");
  if (!sourceId || !layer) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  sourcePort.setPointerCapture(event.pointerId);
  sourcePort.classList.add("is-connecting");
  context.updateConnectionLayer({ sourceId, end: getLayerPoint(event.clientX, event.clientY, layer) });

  const onMove = (moveEvent: PointerEvent) => {
    context.updateConnectionLayer({ sourceId, end: getLayerPoint(moveEvent.clientX, moveEvent.clientY, layer) });
  };

  const onUp = (upEvent: PointerEvent) => {
    const targetPort = getInputPortAtPoint(context.root, upEvent.clientX, upEvent.clientY);
    const targetId = targetPort?.dataset.nodeId;
    const targetInput = targetPort?.dataset.inputKey as Connection["targetInput"] | undefined;

    sourcePort.releasePointerCapture(upEvent.pointerId);
    sourcePort.classList.remove("is-connecting");
    sourcePort.removeEventListener("pointermove", onMove);
    sourcePort.removeEventListener("pointerup", onUp);
    sourcePort.removeEventListener("pointercancel", onUp);

    if (targetId && targetInput && canConnect(context.state.nodes, sourceId, targetId, targetInput, context.getAvailableSources)) {
      setConsumerSource(context.state.nodes, targetId, targetInput, sourceId);
      context.render();
      return;
    }

    context.updateConnectionLayer();
  };

  sourcePort.addEventListener("pointermove", onMove);
  sourcePort.addEventListener("pointerup", onUp);
  sourcePort.addEventListener("pointercancel", onUp);
}

export function startReconnectionDrag(event: PointerEvent, inputPort: HTMLElement, context: DragContext) {
  const targetId = inputPort.dataset.nodeId;
  const targetInput = inputPort.dataset.inputKey as Connection["targetInput"] | undefined;
  const sourceId = targetId && targetInput ? getConsumerSource(context.state.nodes, targetId, targetInput) : "";
  const layer = context.root.querySelector<SVGSVGElement>(".logic-wires");

  if (!targetId || !targetInput || !sourceId || !layer) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  clearConsumerSource(context.state.nodes, targetId, targetInput);
  inputPort.setPointerCapture(event.pointerId);
  inputPort.classList.add("is-reconnecting");
  context.updateConnectionLayer({ sourceId, end: getLayerPoint(event.clientX, event.clientY, layer) });

  const onMove = (moveEvent: PointerEvent) => {
    context.updateConnectionLayer({ sourceId, end: getLayerPoint(moveEvent.clientX, moveEvent.clientY, layer) });
  };

  const onUp = (upEvent: PointerEvent) => {
    const nextPort = getInputPortAtPoint(context.root, upEvent.clientX, upEvent.clientY);
    const nextTargetId = nextPort?.dataset.nodeId;
    const nextTargetInput = nextPort?.dataset.inputKey as Connection["targetInput"] | undefined;

    inputPort.releasePointerCapture(upEvent.pointerId);
    inputPort.classList.remove("is-reconnecting");
    inputPort.removeEventListener("pointermove", onMove);
    inputPort.removeEventListener("pointerup", onUp);
    inputPort.removeEventListener("pointercancel", onUp);

    if (nextTargetId && nextTargetInput && canConnect(context.state.nodes, sourceId, nextTargetId, nextTargetInput, context.getAvailableSources)) {
      setConsumerSource(context.state.nodes, nextTargetId, nextTargetInput, sourceId);
    }

    context.render();
  };

  inputPort.addEventListener("pointermove", onMove);
  inputPort.addEventListener("pointerup", onUp);
  inputPort.addEventListener("pointercancel", onUp);
}
