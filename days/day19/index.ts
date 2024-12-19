// https://adventofcode.com/2024/day/19
// Day 19: Linen Layout

import path from 'node:path';

import { readInput } from '../../common';

const [rawTowels, rawPatterns] = readInput(path.join(__dirname, 'input01'), '\n\n');
const towels = rawTowels.split(', ');
const patterns = rawPatterns.split('\n');

const possibles: Record<string, boolean> = {};
for (const pattern of patterns) {
  function processPattern(patt: string) {
    if (possibles[pattern]) return;
    if (patt.length === 0) {
      possibles[pattern] = true;
      return;
    }
    for (const towel of towels) {
      if (patt.substring(0, towel.length) === towel) {
        processPattern(patt.substring(towel.length));
      }
    }
  }

  processPattern(pattern);
}

process.stdout.write(`Part 01: ${Object.keys(possibles).length}\n`);
process.stdout.write(`Part 02: ${2}\n`);
