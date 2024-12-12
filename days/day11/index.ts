// https://adventofcode.com/2024/day/11
// Day 11: Plutonian Pebbles

import path from 'node:path';

import { readInput } from '../../common';

const input = readInput(path.join(__dirname, 'input01'), '\n')[0].split(' ').map(Number);

let part01PebbleMap: Record<string, number> = {};
let part02PebbleMap: Record<string, number> = {};

for (const peb of input) {
  part01PebbleMap[peb] = 1;
  part02PebbleMap[peb] = 1;
}

let part01Rounds = 25;
while (part01Rounds-- > 0) {
  const newPebbleMap: Record<string, number> = {};

  for (const [pebble, quantity] of Object.entries(part01PebbleMap)) {
    if (pebble === '0') {
      const newPebble = '1';
      newPebbleMap[newPebble] = newPebbleMap[newPebble] === undefined ? quantity : newPebbleMap[newPebble] + quantity;
    } else if (pebble.length % 2 === 0) {
      const leftPebble = pebble.substring(0, pebble.length / 2);
      const rightPebble = String(Number(pebble.substring(pebble.length / 2)));

      newPebbleMap[leftPebble] =
        newPebbleMap[leftPebble] === undefined ? quantity : newPebbleMap[leftPebble] + quantity;
      newPebbleMap[rightPebble] =
        newPebbleMap[rightPebble] === undefined ? quantity : newPebbleMap[rightPebble] + quantity;
    } else {
      const newPebble = String(Number(pebble) * 2024);
      newPebbleMap[newPebble] = newPebbleMap[newPebble] === undefined ? quantity : newPebbleMap[newPebble] + quantity;
    }
  }

  part01PebbleMap = newPebbleMap;
}

let part02Rounds = 75;
while (part02Rounds-- > 0) {
  const newPebbleMap: Record<string, number> = {};

  for (const [pebble, quantity] of Object.entries(part02PebbleMap)) {
    if (pebble === '0') {
      const newPebble = '1';
      newPebbleMap[newPebble] = newPebbleMap[newPebble] === undefined ? quantity : newPebbleMap[newPebble] + quantity;
    } else if (pebble.length % 2 === 0) {
      const leftPebble = pebble.substring(0, pebble.length / 2);
      const rightPebble = String(Number(pebble.substring(pebble.length / 2)));

      newPebbleMap[leftPebble] =
        newPebbleMap[leftPebble] === undefined ? quantity : newPebbleMap[leftPebble] + quantity;
      newPebbleMap[rightPebble] =
        newPebbleMap[rightPebble] === undefined ? quantity : newPebbleMap[rightPebble] + quantity;
    } else {
      const newPebble = String(Number(pebble) * 2024);
      newPebbleMap[newPebble] = newPebbleMap[newPebble] === undefined ? quantity : newPebbleMap[newPebble] + quantity;
    }
  }

  part02PebbleMap = newPebbleMap;
}

const part01 = Object.values(part01PebbleMap).reduce((total, quantity) => total + quantity, 0);
const part02 = Object.values(part02PebbleMap).reduce((total, quantity) => total + quantity, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
