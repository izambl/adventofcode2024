// https://adventofcode.com/2024/day/19
// Day 19: Linen Layout

import path from 'node:path';

import { readInput } from '../../common';

const [rawTowels, rawPatterns] = readInput(path.join(__dirname, 'input01'), '\n\n');
const towels = rawTowels.split(', ');
const patterns = rawPatterns.split('\n');

const possibles: Record<string, number> = {};
for (const pattern of patterns) {
  const possibleTowels = towels.filter((towel) => pattern.indexOf(towel) !== -1);
  console.log(towels.length, possibleTowels.length);

  function processPattern(startIndex: number) {
    if (startIndex >= pattern.length) {
      if (!possibles[pattern]) possibles[pattern] = 0;
      possibles[pattern] += 1;
      return;
    }

    for (const towel of possibleTowels) {
      let isGoodTowel = true;
      for (let i = 0; i < towel.length; i++) {
        if (pattern[startIndex + i] !== towel[i]) {
          isGoodTowel = false;
          break;
        }
      }

      isGoodTowel && processPattern(startIndex + towel.length);
    }
  }

  processPattern(0);

  console.log('pattern done', pattern, possibles[pattern]);
}

const part01 = Object.keys(possibles).length;
const part02 = Object.keys(possibles).reduce((total, pattern) => total + possibles[pattern], 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
