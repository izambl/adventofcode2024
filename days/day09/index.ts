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

// Part 02
type Block2 = { id: number; type: 'space' | 'block'; size: number };
const inputBlocks: Block2[] = [];
for (const [index, value] of input.entries()) {
  const isBlock = index % 2 === 0;
  const num = Math.floor(index / 2);

  inputBlocks.push({ type: isBlock ? 'block' : 'space', id: isBlock ? num : -1, size: Number(value) });
}

for (let i = inputBlocks.length - 1; i >= 0; i--) {
  const block = inputBlocks[i];

  if (block.type === 'block') {
    for (let e = 0; e < i; e++) {
      if (inputBlocks[e].type === 'space' && inputBlocks[e].size >= block.size) {
        const extraSpace = inputBlocks[e].size - block.size;
        inputBlocks[e].type = 'block';
        inputBlocks[e].id = block.id;
        inputBlocks[e].size = block.size;

        block.id = -1;
        block.type = 'space';

        if (extraSpace) {
          inputBlocks.splice(e + 1, 0, { type: 'space', id: -1, size: extraSpace });
        }

        break;
      }
    }
  }
}

const expandedInput2: Block[] = [];
for (const block of inputBlocks) {
  for (let i = 0; i < block.size; i++) {
    expandedInput2.push({ type: block.type, id: block.id });
  }
}

const part02 = expandedInput2.reduce((total, block, index) => {
  if (block.type === 'block') {
    return total + block.id * index;
  }

  return total;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
