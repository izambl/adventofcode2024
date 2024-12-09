// https://adventofcode.com/2024/day/9
// Day 9: Disk Fragmenter

import path from 'node:path';

import { readInput } from '../../common/index';

const input = readInput(path.join(__dirname, 'input01'), '\n')[0].split('');

type Block = { id: number; type: 'space' | 'block' };

const expandedInput: Block[] = [];

for (const [index, value] of input.entries()) {
  const isBlock = index % 2 === 0;
  const num = Math.floor(index / 2);

  for (let i = Number(value); i > 0; i--) {
    expandedInput.push({ type: isBlock ? 'block' : 'space', id: isBlock ? num : -1 });
  }
}

for (let i = expandedInput.length - 1; i >= 0; i--) {
  const block = expandedInput[i];

  if (block.type === 'block') {
    for (let e = 0; e < i; e++) {
      if (expandedInput[e].type === 'space') {
        expandedInput[e].type = 'block';
        expandedInput[e].id = block.id;

        block.id = -1;
        block.type = 'space';

        break;
      }
    }
  }
}

const part01 = expandedInput.reduce((total, block, index) => {
  if (block.type === 'block') {
    return total + block.id * index;
  }

  return total;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
