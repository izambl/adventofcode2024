// https://adventofcode.com/2024/day/16
// Day 16: Reindeer Maze

import path from 'node:path';

import { Dir } from 'node:fs';
import { readInput } from '../../common';
import { P, type Position, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

type Direction = 'up' | 'right' | 'down' | 'left';
const turnRight: Record<Direction, Direction> = {
  up: 'right',
  right: 'down',
  down: 'left',
  left: 'up',
};
const turnLeft: Record<Direction, Direction> = {
  up: 'left',
  left: 'down',
  down: 'right',
  right: 'up',
};

const rawMap = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));

const map = buildMap2d(rawMap);

const reindeer = [...map.values()].find((tile) => tile.value === 'S');
const exit = [...map.values()].find((tile) => tile.value === 'E');

printMap(map);

const testResult = 7036; // Gotten from part01 run
const prodResult = 85480; // Gotten from part01 run

const part02Tiles = new Set<string>();
const results: number[] = [];
function walk(tile: Tile, direction: Direction, path: string[], scoreMap: Map<string, number>, score: number) {
  if (tile.value === '#') return;
  if (tile === exit) {
    console.log('FOUND', tile.position, score);
    results.push(score);
    for (const tilePosition of path) {
      part02Tiles.add(tilePosition);
    }
    return;
  }
  if (score > prodResult) return;

  const walkKey = `${tile.position}`;
  const scoreMapKey = `${tile.position}:${direction}`;
  if (scoreMap.has(scoreMapKey) && scoreMap.get(scoreMapKey) < score) return;
  if (path.includes(walkKey)) return;

  path.push(walkKey);
  scoreMap.set(scoreMapKey, score);

  // Go left
  walk(tile[turnLeft[direction]], turnLeft[direction], [...path], scoreMap, score + 1001);
  // Go right
  walk(tile[turnRight[direction]], turnRight[direction], [...path], scoreMap, score + 1001);
  // Go forward
  walk(tile[direction], direction, [...path], scoreMap, score + 1);
}

walk(reindeer, 'right', [], new Map(), 0);

const part01 = Math.min(...results);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02Tiles.size + 1}\n`);
