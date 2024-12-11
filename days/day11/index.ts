// https://adventofcode.com/2024/day/11
// Day 11: Plutonian Pebbles

import path from 'node:path';

import { readInput } from '../../common';

const input = readInput(path.join(__dirname, 'input01'), '\n')[0].split(' ').map(Number);

type Pebble = {
  left: Pebble | null;
  right: Pebble | null;
  value: string;
};
let firstPebble: Pebble = null;
let lastPebble: Pebble = null;
for (const peb of input) {
  const newPebble: Pebble = {
    left: lastPebble,
    right: null,
    value: String(peb),
  };
  if (firstPebble === null) firstPebble = newPebble;
  if (lastPebble !== null) lastPebble.right = newPebble;
  lastPebble = newPebble;
}

function getLength(firstPebble: Pebble) {
  let curr = firstPebble;
  let total = 0;
  while (curr !== null) {
    total++;
    curr = curr.right;
  }

  return total;
}

let rounds = 75;
while (rounds-- > 0) {
  console.log('ROUND', rounds, getLength(firstPebble));
  let currPebble = firstPebble;
  while (currPebble !== null) {
    if (currPebble.value === '0') {
      currPebble.value = '1';
      currPebble = currPebble.right;
    } else if (currPebble.value.length % 2 === 0) {
      const leftPebble: Pebble = {
        value: currPebble.value.substring(0, currPebble.value.length / 2),
        left: currPebble.left,
        right: null,
      };
      const rightPebble: Pebble = {
        value: String(Number(currPebble.value.substring(currPebble.value.length / 2))),
        left: leftPebble,
        right: currPebble.right,
      };
      leftPebble.right = rightPebble;

      if (currPebble.left !== null) currPebble.left.right = leftPebble;
      if (currPebble.right !== null) currPebble.right.left = rightPebble;

      if (currPebble === firstPebble) firstPebble = leftPebble;
      currPebble = rightPebble.right;
    } else {
      currPebble.value = String(Number(currPebble.value) * 2024);
      currPebble = currPebble.right;
    }
  }
}

const part01 = getLength(firstPebble);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
