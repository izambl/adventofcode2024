// https://adventofcode.com/2024/day/20
// Day 20: Race Condition

import path from 'node:path';

import { readInput } from '../../common';
import { Direction, P, type Position, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const rawMap = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));
const map = buildMap2d(rawMap);

const directions = ['up', 'right', 'down', 'left'] as const;

const start = [...map.values()].find((tile) => tile.value === 'S');
const goal = [...map.values()].find((tile) => tile.value === 'E');
start.value = '.';
goal.value = '.';

printMap(map);

let walkDistance = 0;
let currentTile = start;
const completePath = new Set<Tile>([currentTile]);
const tileDistanceToGoal: Map<Tile, number> = new Map();
tileDistanceToGoal.set(currentTile, 0);

while (currentTile !== goal) {
  if (currentTile.up?.value === '.' && !completePath.has(currentTile.up)) currentTile = currentTile.up;
  else if (currentTile.right?.value === '.' && !completePath.has(currentTile.right)) currentTile = currentTile.right;
  else if (currentTile.down?.value === '.' && !completePath.has(currentTile.down)) currentTile = currentTile.down;
  else if (currentTile.left?.value === '.' && !completePath.has(currentTile.left)) currentTile = currentTile.left;

  completePath.add(currentTile);

  walkDistance += 1;
  tileDistanceToGoal.set(currentTile, walkDistance);
}

for (const [tile, distance] of tileDistanceToGoal.entries()) {
  tileDistanceToGoal.set(tile, walkDistance - distance);
}

function getCheatLocations(tile: Tile, distanceWalked: number, walkedPath: Set<Tile>, maxCheatTime: number): number[] {
  const distancesWithCheat: number[] = [];
  const [tileX, tileY] = tile.position;

  for (const cheatTile of map.values()) {
    if (cheatTile.value === '#') continue;

    const [cheatTileX, cheatTileY] = cheatTile.position;
    const distance = Math.abs(cheatTileX - tileX) + Math.abs(cheatTileY - tileY);

    if (distance > maxCheatTime) continue;

    if (walkedPath.has(cheatTile)) continue;

    distancesWithCheat.push(distanceWalked + distance + tileDistanceToGoal.get(cheatTile));
  }

  return distancesWithCheat;
}

function walkWithCheat(maxCheatTime: number, minSaveTime: number): number {
  const walkedPath = new Set<Tile>();
  const cheatedDistancesArray = [];

  for (const tile of completePath) {
    walkedPath.add(tile);
    const currentDistanceLeft = tileDistanceToGoal.get(tile);

    const cheatedDistances = getCheatLocations(
      tile,
      walkDistance - currentDistanceLeft,
      walkedPath,
      maxCheatTime,
    ).filter((distanceToGoal) => walkDistance - distanceToGoal >= minSaveTime);

    cheatedDistancesArray.push(...cheatedDistances);
  }

  // console.log(
  //   cheatedDistancesArray.reduce<Record<number, number>>((totals, distance) => {
  //     const savedDistance = walkDistance - distance;

  //     if (!totals[savedDistance]) totals[savedDistance] = 0;
  //     totals[savedDistance]++;

  //     return totals;
  //   }, {}),
  // );

  return cheatedDistancesArray.length;
}

const part01 = walkWithCheat(2, 100);
const part02 = walkWithCheat(20, 100);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
