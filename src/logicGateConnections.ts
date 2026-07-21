import { isGateNode, isOutputNode, isSignalSourceNode } from "./logicGateModel";
import type { Connection, LogicNode, SignalConsumerNode, SignalSourceNode } from "./logicGateModel";

export function getConnections(nodes: LogicNode[]): Connection[] {
  return nodes.flatMap((node) => {
    if (isOutputNode(node)) {
      return node.input ? [{ sourceId: node.input, targetId: node.id, targetInput: "input" as const }] : [];
    }
    if (!isGateNode(node)) {
      return [];
    }

    const connections: Connection[] = [];
    if (node.inputA) {
      connections.push({ sourceId: node.inputA, targetId: node.id, targetInput: "inputA" });
    }
    if (node.type !== "NOT" && node.inputB) {
      connections.push({ sourceId: node.inputB, targetId: node.id, targetInput: "inputB" });
    }
    if (node.type === "AND3" && node.inputC) {
      connections.push({ sourceId: node.inputC, targetId: node.id, targetInput: "inputC" });
    }
    return connections;
  });
}

export function setConsumerSource(nodes: LogicNode[], targetId: string, targetInput: Connection["targetInput"], sourceId: string) {
  const node = nodes.find((item): item is SignalConsumerNode => item.id === targetId && (isGateNode(item) || isOutputNode(item)));
  if (!node) {
    return;
  }
  if (isOutputNode(node)) {
    node.input = sourceId;
    return;
  }
  if (targetInput === "inputA" || targetInput === "inputB" || targetInput === "inputC") {
    node[targetInput] = sourceId;
  }
}

export function getConsumerSource(nodes: LogicNode[], targetId: string, targetInput: Connection["targetInput"]) {
  const node = nodes.find((item): item is SignalConsumerNode => item.id === targetId && (isGateNode(item) || isOutputNode(item)));
  if (!node) {
    return "";
  }
  if (isOutputNode(node)) {
    return targetInput === "input" ? node.input : "";
  }
  return targetInput === "inputA" || targetInput === "inputB" || targetInput === "inputC" ? node[targetInput] : "";
}

export function clearConsumerSource(nodes: LogicNode[], targetId: string, targetInput: Connection["targetInput"]) {
  setConsumerSource(nodes, targetId, targetInput, "");
}

export function isFreeInputPort(nodes: LogicNode[], targetId: string, targetInput: Connection["targetInput"]) {
  const node = nodes.find((item): item is SignalConsumerNode => item.id === targetId && (isGateNode(item) || isOutputNode(item)));
  if (!node) {
    return false;
  }
  if (isOutputNode(node)) {
    return targetInput === "input" && !node.input;
  }
  return targetInput !== "input" && !node[targetInput];
}

export function canConnect(
  nodes: LogicNode[],
  sourceId: string,
  targetId: string,
  targetInput: Connection["targetInput"],
  getAvailableSources: (node: SignalConsumerNode) => SignalSourceNode[]
) {
  const source = nodes.find((node) => node.id === sourceId);
  const target = nodes.find((node): node is SignalConsumerNode => node.id === targetId && (isGateNode(node) || isOutputNode(node)));
  return Boolean(source && target && isSignalSourceNode(source) && sourceId !== targetId && isFreeInputPort(nodes, targetId, targetInput) && getAvailableSources(target).some((node) => node.id === sourceId));
}
