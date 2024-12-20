// https://adventofcode.com/2024/day/20
// Day 20: Race Condition

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Position, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const rawMap = readInput(path.join(__dirname, 'inputTest'), '\n').map((row) => row.split(''));
const map = buildMap2d(rawMap);

const start = [...map.values()].find((tile) => tile.value === 'S');
const goal = [...map.values()].find((tile) => tile.value === 'E');
start.value = '.';
goal.value = '.';

const printMapping = {
  up: '^',
  down: 'v',
  right: '>',
  left: '<',
};

printMap(map);

let walkDistance = 0;
let currentTile = start;
const currentPath = new Set<Tile>([currentTile]);
currentTile.value = 'x';
while (currentTile !== goal) {
  if (currentTile.up?.value === '.') {
    currentTile.value = 'up';
    currentTile = currentTile.up;
  } else if (currentTile.right?.value === '.') {
    currentTile.value = 'right';
    currentTile = currentTile.right;
  } else if (currentTile.down?.value === '.') {
    currentTile.value = 'down';
    currentTile = currentTile.down;
  } else if (currentTile.left?.value === '.') {
    currentTile.value = 'left';
    currentTile = currentTile.left;
  }

  currentPath.add(currentTile);

  walkDistance += 1;
}

printMap(map, [], printMapping);

type Direction = 'up' | 'down' | 'left' | 'right';

function cheats(tile: Tile, currentPath: Tile[]): Tile[] {
  const directions = ['up', 'down', 'left', 'right'] as const;
  const cheatTiles: Tile[] = [];

  for (const cheatDirection of directions) {
    const cheatTile = tile[cheatDirection];

    if (!cheatTile) continue;
    if (cheatTile.value !== '#') continue;

    for (const nextDirection of directions) {
      const nextTile = cheatTile[nextDirection];

      if (!nextTile) continue;
      if (nextTile.value === '#') continue;
      if (currentPath.includes(nextTile)) continue;

      cheatTiles.push(nextTile);
    }
  }

  return cheatTiles;
}

const walkThreshold = 2;
const arrivals: Record<number, number> = {};
function walk(tile: Tile, distance: number, currentPath: Tile[], cheatUsed: boolean) {
  if (distance > walkDistance - walkThreshold) return;
  currentPath.push(tile);

  if (tile === goal) {
    const savedTime = walkDistance - distance;
    console.log('Arrived', savedTime);

    if (!arrivals[savedTime]) arrivals[savedTime] = 0;
    arrivals[savedTime]++;
    return;
  }

  // FollowDirection
  walk(tile[tile.value as Direction], distance + 1, [...currentPath], cheatUsed);
  // Use Cheat
  if (!cheatUsed) {
    for (const cheatTile of cheats(tile, currentPath)) {
      walk(cheatTile, distance + 2, [...currentPath], true);
    }
  }
}

walk(start, 0, [start], false);

console.log(arrivals);

const part01 = Object.values(arrivals).reduce((total, arrival) => total + arrival, 0);

// const walkThreshold2 = 50;
// const maxCheatDuration = 20;
// function walk2(tile: Tile, distance: number, currentPath: Tile[], cheatUsed: number) {
//   if (distance > walkDistance - walkThreshold2) return;
//   currentPath.push(tile);

//   if (tile === goal) {
//     const savedTime = walkDistance - distance;
//     console.log('Arrived', savedTime);

//     if (!arrivals[savedTime]) arrivals[savedTime] = 0;
//     arrivals[savedTime]++;
//     return;
//   }

//   // FollowDirection
//   walk2(tile[tile.value as Direction], distance + 1, [...currentPath], cheatUsed);

//   // Use Cheat
//   if (!cheatUsed) {
//     for (const cheatTile of cheats(tile, currentPath)) {
//       walk(cheatTile, distance + 2, [...currentPath], true);
//     }
//   }
// }

// walk2(start, 0, [start], 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
