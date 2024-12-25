// https://adventofcode.com/2024/day/24
// Day 24: Crossed Wires

import path from 'node:path';
import { inspect } from 'node:util';

import { readInput } from '../../common';

const [rawValues, rawGates] = readInput(path.join(__dirname, 'input01'), '\n\n');

// Build wire map
const wireMap: Map<string, number> = new Map();
for (const rawValue of rawValues.split('\n')) {
  const [wire, value] = rawValue.split(': ');
  wireMap.set(wire, Number(value));
}

// Build gates
const operations: [string, string, string, string][] = [];
for (const gate of rawGates.split('\n')) {
  const [rawCondition, result] = gate.split(' -> ');

  const [op1, operator, op2] = rawCondition.split(' ');

  operations.push([op1, operator, op2, result]);
}

while (operations.length > 0) {
  for (const wireSetup of operations) {
    const [op1, operation, op2, result] = wireSetup;
    if (wireMap.get(op1) === undefined || wireMap.get(op2) === undefined) continue;

    if (operation === 'AND') wireMap.set(result, wireMap.get(op1) & wireMap.get(op2));
    if (operation === 'OR') wireMap.set(result, wireMap.get(op1) | wireMap.get(op2));
    if (operation === 'XOR') wireMap.set(result, wireMap.get(op1) ^ wireMap.get(op2));

    operations.splice(operations.indexOf(wireSetup), 1);
  }
}

function getBinaryFomWires(wires: Array<[string, number]>): string {
  return wires
    .sort(([wireA], [wireB]) => {
      return Number(wireB.substring(1)) - Number(wireA.substring(1));
    })
    .map(([_, value]) => String(value))
    .join('');
}

console.log(getBinaryFomWires([...wireMap.entries()].filter(([wire]) => wire[0] === 'x')));
console.log(getBinaryFomWires([...wireMap.entries()].filter(([wire]) => wire[0] === 'y')));

const part01 = Number.parseInt(getBinaryFomWires([...wireMap.entries()].filter(([wire]) => wire[0] === 'z')), 2);

// PART 02
// type Operator = 'AND' | 'OR' | 'XOR';
// type Operation = { l: string | Operation; op: Operator; r: string | Operation };
// type Zetas = Map<string, Operation>;

// const gatesMap: Map<string, Operation> = new Map();

// for (const rawGate of rawGates.split('\n')) {
//   const [rawCondition, result] = rawGate.split(' -> ');
//   const [op1, operator, op2] = rawCondition.split(' ');

//   gatesMap.set(result, { l: op1, op: operator as Operator, r: op2 });
// }

// const zetas: Zetas = new Map([...gatesMap.entries()].filter(([wire]) => wire[0] === 'z').sort());

// function processOperation(operation: string | Operation): Operation {
//   if (typeof operation === 'string') {
//     const op = gatesMap.get(operation);
//     if (!op) return op;

//     op.l = processOperation(op.l) ?? op.l;
//     op.r = processOperation(op.r) ?? op.r;

//     return op;
//   }

//   return operation;
// }

// for (const [_, operation] of zetas) {
//   operation.l = processOperation(operation.l);
//   operation.r = processOperation(operation.r);
// }

// function resolveOperation(operation: Operation): number {
//   console.log(operation);
//   const l = typeof operation.l === 'string' ? wireMap.get(operation.l) : resolveOperation(operation.l);
//   const r = typeof operation.r === 'string' ? wireMap.get(operation.r) : resolveOperation(operation.r);

//   if (operation.op === 'OR') {
//     return l | r;
//   }
//   if (operation.op === 'AND') {
//     return l & r;
//   }
//   if (operation.op === 'XOR') {
//     return l ^ r;
//   }
// }

// console.log(inspect(zetas, { showHidden: false, depth: null, colors: true }));

// // Resolve Equation
// for (const zeta of zetas) {
//   console.log(zeta[0], resolveOperation(zeta[1]));
// }

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);

// 1101000110101010100101111010011000011100100110   == gotten
// 1100111110101010100110011010011000011011100110
// ___XXXX_____________XXX______________XXX______
