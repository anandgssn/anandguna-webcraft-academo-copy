import type { Connection } from "./logicGateModel";

type WirePoint = {
  x: number;
  y: number;
};

type WirePath = {
  from: WirePoint;
  to: WirePoint;
  className: string;
};

export type WirePreview = {
  sourceId: string;
  end: WirePoint;
};

export function getLayerPoint(clientX: number, clientY: number, layer: SVGSVGElement): WirePoint {
  const layerRect = layer.getBoundingClientRect();
  return { x: clientX - layerRect.left, y: clientY - layerRect.top };
}

function getPortCenter(port: HTMLElement, layer: SVGSVGElement): WirePoint {
  const portRect = port.getBoundingClientRect();
  const layerRect = layer.getBoundingClientRect();
  return {
    x: portRect.left - layerRect.left + portRect.width / 2,
    y: portRect.top - layerRect.top + portRect.height / 2
  };
}

function createWirePath(from: WirePoint, to: WirePoint) {
  const midX = from.x + (to.x - from.x) / 2;
  const radius = Math.min(10, Math.abs(to.x - from.x) / 4, Math.abs(to.y - from.y) / 2);

  if (radius < 1) {
    return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
  }

  const xDirection = Math.sign(to.x - from.x) || 1;
  const yDirection = Math.sign(to.y - from.y) || 1;

  return [
    `M ${from.x} ${from.y}`,
    `L ${midX - xDirection * radius} ${from.y}`,
    `Q ${midX} ${from.y} ${midX} ${from.y + yDirection * radius}`,
    `L ${midX} ${to.y - yDirection * radius}`,
    `Q ${midX} ${to.y} ${midX + xDirection * radius} ${to.y}`,
    `L ${to.x} ${to.y}`
  ].join(" ");
}

export function updateWireLayer(root: HTMLElement, connections: Connection[], preview?: WirePreview) {
  const layer = root.querySelector<SVGSVGElement>(".logic-wires");
  if (!layer) {
    return;
  }

  const paths: WirePath[] = [];
  layer.innerHTML = "";
  connections.forEach((connection) => {
    const sourcePort = root.querySelector<HTMLElement>(`[data-port-role="output"][data-node-id="${connection.sourceId}"]`);
    const targetPort = root.querySelector<HTMLElement>(`[data-port-role="input"][data-node-id="${connection.targetId}"][data-input-key="${connection.targetInput}"]`);
    if (sourcePort && targetPort) {
      paths.push({ from: getPortCenter(sourcePort, layer), to: getPortCenter(targetPort, layer), className: "logic-wire" });
    }
  });

  if (preview) {
    const sourcePort = root.querySelector<HTMLElement>(`[data-port-role="output"][data-node-id="${preview.sourceId}"]`);
    if (sourcePort) {
      paths.push({ from: getPortCenter(sourcePort, layer), to: preview.end, className: "logic-wire logic-wire-preview" });
    }
  }

  paths.forEach((path) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
    element.setAttribute("class", path.className);
    element.setAttribute("d", createWirePath(path.from, path.to));
    layer.append(element);
  });
}
