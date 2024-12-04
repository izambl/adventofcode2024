// https://adventofcode.com/2024/day/4
// Day 4: Ceres Search

import path from 'node:path';

import { readInput } from '../../common/index';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((line) => line.split(''));

const map: Record<string, string> = {};
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    map[`${x}-${y}`] = input[y][x];
  }
}

let part01XmasesFound = 0;

for (const [position, letter] of Object.entries(map)) {
  if (letter === 'X') {
    part01XmasesFound += searchForXmas(position);
  }
}

function searchForXmas(position: string): number {
  let total = 0;
  const [x, y] = position.split('-').map(Number);

  // Top
  if (map[`${x}-${y - 1}`] === 'M' && map[`${x}-${y - 2}`] === 'A' && map[`${x}-${y - 3}`] === 'S') {
    total += 1;
  }
  // TopRight
  if (map[`${x + 1}-${y - 1}`] === 'M' && map[`${x + 2}-${y - 2}`] === 'A' && map[`${x + 3}-${y - 3}`] === 'S') {
    total += 1;
  }
  // Right
  if (map[`${x + 1}-${y}`] === 'M' && map[`${x + 2}-${y}`] === 'A' && map[`${x + 3}-${y}`] === 'S') {
    total += 1;
  }
  // BottomRight
  if (map[`${x + 1}-${y + 1}`] === 'M' && map[`${x + 2}-${y + 2}`] === 'A' && map[`${x + 3}-${y + 3}`] === 'S') {
    total += 1;
  }
  // Bottom
  if (map[`${x}-${y + 1}`] === 'M' && map[`${x}-${y + 2}`] === 'A' && map[`${x}-${y + 3}`] === 'S') {
    total += 1;
  }
  // BottomLeft
  if (map[`${x - 1}-${y + 1}`] === 'M' && map[`${x - 2}-${y + 2}`] === 'A' && map[`${x - 3}-${y + 3}`] === 'S') {
    total += 1;
  }
  // Left
  if (map[`${x - 1}-${y}`] === 'M' && map[`${x - 2}-${y}`] === 'A' && map[`${x - 3}-${y}`] === 'S') {
    total += 1;
  }
  // TopLeft
  if (map[`${x - 1}-${y - 1}`] === 'M' && map[`${x - 2}-${y - 2}`] === 'A' && map[`${x - 3}-${y - 3}`] === 'S') {
    total += 1;
  }

  return total;
}

let part02XmasesFound = 0;

for (const [position, letter] of Object.entries(map)) {
  if (letter === 'A') {
    part02XmasesFound += searchForX_mas(position);
  }
}

function searchForX_mas(position: string): number {
  const [x, y] = position.split('-').map(Number);

  // M#S
  // #A#
  // M#S
  if (
    map[`${x - 1}-${y - 1}`] === 'M' &&
    map[`${x - 1}-${y + 1}`] === 'M' &&
    map[`${x + 1}-${y + 1}`] === 'S' &&
    map[`${x + 1}-${y - 1}`] === 'S'
  ) {
    return 1;
  }

  // S#M
  // #A#
  // S#M
  if (
    map[`${x - 1}-${y - 1}`] === 'S' &&
    map[`${x - 1}-${y + 1}`] === 'S' &&
    map[`${x + 1}-${y + 1}`] === 'M' &&
    map[`${x + 1}-${y - 1}`] === 'M'
  ) {
    return 1;
  }

  // S#S
  // #A#
  // M#M
  if (
    map[`${x - 1}-${y - 1}`] === 'S' &&
    map[`${x - 1}-${y + 1}`] === 'M' &&
    map[`${x + 1}-${y + 1}`] === 'M' &&
    map[`${x + 1}-${y - 1}`] === 'S'
  ) {
    return 1;
  }

  // M#M
  // #A#
  // S#S
  if (
    map[`${x - 1}-${y - 1}`] === 'M' &&
    map[`${x - 1}-${y + 1}`] === 'S' &&
    map[`${x + 1}-${y + 1}`] === 'S' &&
    map[`${x + 1}-${y - 1}`] === 'M'
  ) {
    return 1;
  }

  return 0;
}

process.stdout.write(`Part 01: ${part01XmasesFound}\n`);
process.stdout.write(`Part 02: ${part02XmasesFound}\n`);
