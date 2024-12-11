// https://adventofcode.com/2024/day/10
// Day 10: Hoof It

import path from 'node:path';

import { MakeTuple, readInput } from '../../common';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split('').map(Number));

type Position = [number, number];
type Tile = {
  up: Tile | null;
  right: Tile | null;
  down: Tile | null;
  left: Tile | null;
  value: number;
  position: Position;
};
type TileMap = Map<Position, Tile>;

const T = MakeTuple<[number, number]>();

function buildMap(rawMap: number[][]): TileMap {
  const map = new Map<Position, Tile>();

  for (let y = 0; y < rawMap.length; y++) {
    for (let x = 0; x < rawMap[0].length; x++) {
      const tile: Tile = {
        up: null,
        left: null,
        right: null,
        down: null,
        value: rawMap[y][x],
        position: T([x, y]),
      };
      map.set(T([x, y]), tile);
    }
  }

  for (const [[x, y], tile] of map) {
    tile.up = map.get(T([x, y - 1])) ?? null;
    tile.right = map.get(T([x + 1, y])) ?? null;
    tile.down = map.get(T([x, y + 1])) ?? null;
    tile.left = map.get(T([x - 1, y])) ?? null;
  }

  return map;
}

const map = buildMap(input);

const startingPoints: Tile[] = [];
for (const [_, tile] of map.entries()) {
  if (tile.value === 0) {
    startingPoints.push(tile);
  }
}

const foundSummits = new Set<string>();
let totalTrails = 0;
function walk(map: TileMap, currentHeight: number, currentTile: Tile, visitedPaths: Tile[]) {
  visitedPaths.push(currentTile);
  if (currentHeight === 9) {
    foundSummits.add(`${visitedPaths.at(0).position}-${visitedPaths.at(-1).position}`);
    totalTrails += 1;
    return;
  }

  for (const direction of ['up', 'right', 'down', 'left'] as const) {
    const nextTile = currentTile[direction];
    if (nextTile && nextTile.value === currentHeight + 1 && !visitedPaths.includes(nextTile)) {
      walk(map, currentHeight + 1, nextTile, [...visitedPaths]);
    }
  }
}

for (const startingPoint of startingPoints) {
  walk(map, 0, startingPoint, []);
}

process.stdout.write(`Part 01: ${foundSummits.size}\n`);
process.stdout.write(`Part 02: ${totalTrails}\n`);
