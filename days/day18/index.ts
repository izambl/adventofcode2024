// https://adventofcode.com/2024/day/18
// Day 17: Chronospatial Computer

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(',').map(Number));
const rawMap: string[][] = [];
const gridSize = 70;
const fallenBytes = 1024;

for (let y = 0; y <= gridSize; y++) {
  rawMap[y] = Array(gridSize + 1).fill('.');
}
for (const [x, y] of input.slice(0, fallenBytes)) {
  rawMap[y][x] = '#';
}

const map = buildMap2d(rawMap);
const start = map.get(P(0, 0));
const goal = map.get(P(gridSize, gridSize));

const visitedMap = new Map<Tile, number>();
let part01 = Number.POSITIVE_INFINITY;
function walk(tile: Tile | null, map: TileMap, visitedMap: Map<Tile, number>, path: Tile[], pathSize: number) {
  const newPathSize = pathSize + 1;

  if (!tile) return;
  if (tile.value === '#') return;
  if (newPathSize >= part01) return;
  if (visitedMap.get(tile) <= newPathSize) return;
  if (pathSize + goal.position[0] - tile.position[0] > part01) return;
  if (pathSize + goal.position[1] - tile.position[1] > part01) return;
  if (path.includes(tile)) return;

  path.push(tile);

  visitedMap.set(tile, newPathSize);

  if (tile === goal) {
    console.log('Arrived', path.length);
    part01 = Math.min(path.length - 1, part01);
  }

  for (const direction of ['right', 'down', 'up', 'left'] as const) {
    walk(tile[direction], map, visitedMap, [...path], newPathSize);
  }
}

walk(start, map, visitedMap, [], 0);

process.stdout.write(`Part 01: ${part01}\n`);

const part2Map = buildMap2d(rawMap);
for (const tile of part2Map.values()) {
  tile.value = '.';
}

function findBlock(tile: Tile, block: Set<Tile>): Set<Tile> {
  if (!tile) return block;
  if (tile.value !== '#') return block;
  if (block.has(tile)) return block;

  block.add(tile);

  findBlock(tile.up, block);
  findBlock(tile.right, block);
  findBlock(tile.down, block);
  findBlock(tile.left, block);

  findBlock(tile.left?.up, block);
  findBlock(tile.left?.down, block);
  findBlock(tile.right?.up, block);
  findBlock(tile.right?.down, block);

  return block;
}

let part02 = '';
for (const [x, y] of input) {
  const position = P(x, y);
  const tile = part2Map.get(position);
  tile.value = '#';

  const corruptedRegion = findBlock(tile, new Set());
  const maxX = Math.max(...[...corruptedRegion].map((r) => r.position[0]));
  const minX = Math.min(...[...corruptedRegion].map((r) => r.position[0]));

  const maxY = Math.max(...[...corruptedRegion].map((r) => r.position[1]));
  const minY = Math.min(...[...corruptedRegion].map((r) => r.position[1]));

  if ((minX === 0 && maxX === gridSize) || (minY === 0 && maxY === gridSize)) {
    part02 = position.join(',');
    break;
  }
}

process.stdout.write(`Part 02: ${part02}\n`);
