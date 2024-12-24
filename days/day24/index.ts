// https://adventofcode.com/2024/day/24
// Day 24: Crossed Wires

import path from 'node:path';

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

const part01 = Number.parseInt(
  [...wireMap.entries()]
    .filter(([wire]) => wire[0] === 'z')
    .sort((wireA, wireB) => {
      return Number(wireB[0].substring(1)) - Number(wireA[0].substring(1));
    })
    .map(([_, value]) => String(value))
    .join(''),
  2,
);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
