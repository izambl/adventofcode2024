// https://adventofcode.com/2024/day/20
// Day 20: Race Condition

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Position, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const rawMap = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));
const map = buildMap2d(rawMap);

const start = [...map.values()].find((tile) => tile.value === 'S');
const goal = [...map.values()].find((tile) => tile.value === 'E');
start.value = '.';
goal.value = '.';

printMap(map);

// const walkDistance = 0;
// let currentTile = start;
// while (currentTile !== goal) {
//   currentTile = currentTile.up;
//   walkDistance += 1
// }

const visitedMap = new Map<Tile, number>();
let withNoCheats = Number.POSITIVE_INFINITY;
function walk(tile: Tile | null, map: TileMap, visitedMap: Map<Tile, number>, path: Tile[], pathSize: number) {
  const newPathSize = pathSize + 1;

  if (!tile) return;
  if (tile.value === '#') return;
  if (newPathSize >= withNoCheats) return;
  if (visitedMap.get(tile) <= newPathSize) return;
  if (pathSize + goal.position[0] - tile.position[0] > withNoCheats) return;
  if (pathSize + goal.position[1] - tile.position[1] > withNoCheats) return;
  if (path.includes(tile)) return;

  path.push(tile);

  visitedMap.set(tile, newPathSize);

  if (tile === goal) {
    withNoCheats = Math.min(path.length - 1, withNoCheats);
  }

  for (const direction of ['right', 'down', 'up', 'left'] as const) {
    walk(tile[direction], map, visitedMap, [...path], newPathSize);
  }
}

walk(start, map, visitedMap, [], 0);

const visitedMap2 = new Map<Tile, number>();
const arrivals: number[] = [];
const cheatThreshold = 100;
function walkCheating(
  tile: Tile | null,
  map: TileMap,
  visitedMap: Map<Tile, number>,
  path: Tile[],
  pathSize: number,
  cheatUsed: boolean,
) {
  const newPathSize = pathSize + 1;

  if (!tile) return;

  if (tile.value === '#' && cheatUsed) return;
  if (newPathSize - 1 > withNoCheats - cheatThreshold) return;
  // if (visitedMap.get(tile) <= newPathSize) return;
  if (pathSize + goal.position[0] - tile.position[0] > withNoCheats - cheatThreshold) return;
  if (pathSize + goal.position[1] - tile.position[1] > withNoCheats - cheatThreshold) return;
  if (path.includes(tile)) return;

  path.push(tile);

  visitedMap.set(tile, newPathSize);

  if (tile === goal) {
    console.log('arrival');
    arrivals.push(withNoCheats - (newPathSize - 1));
    return;
  }

  for (const direction of ['right', 'down', 'up', 'left'] as const) {
    walkCheating(tile[direction], map, visitedMap, [...path], newPathSize, cheatUsed || tile.value === '#');
  }
}

walkCheating(start, map, visitedMap2, [], 0, false);

console.log(
  arrivals.reduce<Record<number, number>>((total, arrival) => {
    if (!total[arrival]) total[arrival] = 0;
    total[arrival]++;

    return total;
  }, {}),
);

process.stdout.write(`Part 01: ${arrivals.length}\n`);
process.stdout.write(`Part 02: ${2}\n`);
