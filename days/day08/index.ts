// https://adventofcode.com/2024/day/8
// Day 8: Resonant Collinearity

import path from 'node:path';

import { readInput } from '../../common/index';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));

const antennas: Record<string, { positions: [number, number][] }> = {};
const antiNodes: Record<string, { positions: [number, number][] }> = {};

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input.length; x++) {
    const tile = input[y][x];

    if (tile !== '.') {
      if (!antennas[tile]) {
        antennas[tile] = { positions: [] };
      }
      antennas[tile].positions.push([x, y]);
    }
  }
}

for (const [antenna, { positions }] of Object.entries(antennas)) {
  const antennaPairsTemp = new Set<string>();
  for (let a = 0; a < positions.length; a++) {
    for (let b = 0; b < positions.length; b++) {
      if (a === b) continue;
      const pair = [positions[a], positions[b]].sort(([ax, ay], [bx, by]) => (ax === bx ? ay - by : ax - bx));
      antennaPairsTemp.add(JSON.stringify(pair));
    }
  }
  const antennaPairs = [...antennaPairsTemp].map((stringPair) => JSON.parse(stringPair));

  antiNodes[antenna] = { positions: [] };
  for (const pair of antennaPairs) {
    const [[ax, ay], [bx, by]] = pair;
    const minX = 0;
    const maxX = input[0].length - 1;
    const maxY = input.length - 1;
    const minY = 0;

    let newBx = bx;
    let newBy = by;
    while (newBx < maxX && newBy < maxY && newBx > minX && newBy > minY) {
      newBx = newBx + (bx - ax);
      newBy = newBy + (by - ay);

      antiNodes[antenna].positions.push([newBx, newBy]);
    }

    let newAx = ax;
    let newAy = ay;
    while (newAx < maxX && newAy < maxY && newAx > minX && newAy > minY) {
      newAx = newAx + (ax - bx);
      newAy = newAy + (ay - by);

      antiNodes[antenna].positions.push([newAx, newAy]);
    }
  }
}

const allAntinodes = Object.keys(antiNodes).reduce((uniques, antiNode) => {
  for (const [x, y] of antiNodes[antiNode].positions) {
    uniques.add(`${x}:${y}`);
  }

  return uniques;
}, new Set<string>());

for (const antenna of Object.keys(antennas)) {
  for (const [x, y] of antennas[antenna].positions) {
    allAntinodes.add(`${x}:${y}`);
  }
}

const part02 = [...allAntinodes].filter((antinodeString) => {
  const [x, y] = antinodeString.split(':').map(Number);
  if (x < 0 || y < 0) return false;
  if (x >= input[0].length || y >= input.length) return false;

  return true;
}).length;

process.stdout.write(`Part 02: ${part02}\n`);
