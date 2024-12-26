// https://adventofcode.com/2024/day/25
// Day 25: Code Chronicle

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const rawKeys = readInput(path.join(__dirname, 'input01'), '\n\n');

const keys: number[][] = [];
const locks: number[][] = [];

for (const rawKey of rawKeys) {
  rawKey.split('\n');

  const lockOrKeyMap = buildMap2d(rawKey.split('\n').map((row) => row.split('')));
  const lockOrKeyLengths: number[] = [];

  for (const tile of lockOrKeyMap.values()) {
    if (tile.value !== '#') continue;

    if (lockOrKeyMap.get(P(0, 0)).value === '#') {
      if (!lockOrKeyLengths[tile.position[0]]) {
        lockOrKeyLengths[tile.position[0]] = tile.position[1];
        continue;
      }
      lockOrKeyLengths[tile.position[0]] = Math.max(lockOrKeyLengths[tile.position[0]], tile.position[1]);
    } else {
      if (!lockOrKeyLengths[tile.position[0]]) {
        lockOrKeyLengths[tile.position[0]] = 6 - tile.position[1];
        continue;
      }
      lockOrKeyLengths[tile.position[0]] = Math.max(lockOrKeyLengths[tile.position[0]], 6 - tile.position[1]);
    }
  }

  if (lockOrKeyMap.get(P(0, 0)).value === '#') locks.push(lockOrKeyLengths);
  else keys.push(lockOrKeyLengths);
}

let part01 = 0;
for (const key of keys) {
  for (const lock of locks) {
    if (
      key[0] + lock[0] <= 5 &&
      key[1] + lock[1] <= 5 &&
      key[2] + lock[2] <= 5 &&
      key[3] + lock[3] <= 5 &&
      key[4] + lock[4] <= 5
    ) {
      part01++;
    }
  }
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
