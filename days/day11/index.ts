// https://adventofcode.com/2024/day/11
// Day 11: Plutonian Pebbles

import path from 'node:path';

import { MakeTuple, readInput } from '../../common';

const input = readInput(path.join(__dirname, 'input01'), '\n')[0].split(' ').map(Number);

let rounds = 75;
let pebbles: number[] = [...input];
while (rounds-- > 0) {
  const newPebbles: number[] = [];
  for (const pebble of pebbles) {
    if (pebble === 0) {
      newPebbles.push(1);
    } else if (String(pebble).length % 2 === 0) {
      newPebbles.push(Number(String(pebble).substring(0, String(pebble).length / 2)));
      newPebbles.push(Number(String(pebble).substring(String(pebble).length / 2)));
    } else {
      newPebbles.push(pebble * 2024);
    }
  }
  pebbles = newPebbles;
}

console.log(pebbles);

process.stdout.write(`Part 01: ${pebbles.length}\n`);
process.stdout.write(`Part 02: ${2}\n`);
