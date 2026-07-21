export type GateType = "AND" | "AND3" | "OR" | "NOT" | "NAND" | "NOR" | "XOR";
export type NodeType = "INPUT" | "OUTPUT" | GateType;
export type SourceId = string;
export type GateInputKey = "inputA" | "inputB" | "inputC";

export type InputNode = {
  id: string;
  kind: "input";
  value: boolean;
  x: number;
  y: number;
};

export type GateNode = {
  id: string;
  kind: "gate";
  type: GateType;
  inputA: SourceId;
  inputB: SourceId;
  inputC: SourceId;
  x: number;
  y: number;
};

export type OutputNode = {
  id: string;
  kind: "output";
  input: SourceId;
  x: number;
  y: number;
};

export type LogicNode = InputNode | GateNode | OutputNode;
export type SignalSourceNode = InputNode | GateNode;
export type SignalConsumerNode = GateNode | OutputNode;

export type Connection = {
  sourceId: string;
  targetId: string;
  targetInput: "input" | GateInputKey;
};

export type SimulatorState = {
  nodes: LogicNode[];
};

export const gateTypes: GateType[] = ["AND", "AND3", "OR", "NOT", "NAND", "NOR", "XOR"];
export const nodeTypes: NodeType[] = ["INPUT", ...gateTypes, "OUTPUT"];

export const gateSymbols: Record<GateType, string> = {
  AND: "/assets/logic-symbols/and.svg",
  AND3: "/assets/logic-symbols/and3.svg",
  OR: "/assets/logic-symbols/or.svg",
  NOT: "/assets/logic-symbols/not.svg",
  NAND: "/assets/logic-symbols/nand.svg",
  NOR: "/assets/logic-symbols/nor.svg",
  XOR: "/assets/logic-symbols/xor.svg"
};

export const defaultState: SimulatorState = {
  nodes: [
    {
      id: "A",
      kind: "input",
      value: false,
      x: 24,
      y: 190
    },
    {
      id: "O1",
      kind: "output",
      input: "",
      x: 450,
      y: 190
    }
  ]
};

export function isGateNode(node: LogicNode): node is GateNode {
  return node.kind === "gate";
}

export function isInputNode(node: LogicNode): node is InputNode {
  return node.kind === "input";
}

export function isOutputNode(node: LogicNode): node is OutputNode {
  return node.kind === "output";
}

export function isSignalSourceNode(node: LogicNode): node is SignalSourceNode {
  return isInputNode(node) || isGateNode(node);
}

export function isGateType(value: string): value is GateType {
  return gateTypes.includes(value as GateType);
}

export function getNextGateNumber(gates: GateNode[]) {
  const maxGateNumber = gates.reduce((max, gate) => {
    const parsed = Number(gate.id.replace(/^G/, ""));
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);

  return maxGateNumber + 1;
}

export function getNextInputId(nodes: LogicNode[]) {
  const usedIds = new Set(nodes.map((node) => node.id));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (const label of alphabet) {
    if (!usedIds.has(label)) {
      return label;
    }
  }

  let nextInputNumber = 1;
  while (usedIds.has(`I${nextInputNumber}`)) {
    nextInputNumber += 1;
  }

  return `I${nextInputNumber}`;
}

export function getNextOutputId(nodes: LogicNode[]) {
  const usedIds = new Set(nodes.map((node) => node.id));
  let nextOutputNumber = 1;

  while (usedIds.has(`O${nextOutputNumber}`)) {
    nextOutputNumber += 1;
  }

  return `O${nextOutputNumber}`;
}
