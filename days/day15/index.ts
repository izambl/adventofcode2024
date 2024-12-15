// https://adventofcode.com/2024/day/15
// Day 15: Warehouse Woes

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const [rawMap, rawInstructions] = readInput(path.join(__dirname, 'inputTest'), '\n\n');

const map = buildMap2d(rawMap.split('\n').map((row) => row.split('')));
const instructions: Array<'<' | '>' | '^' | 'v'> = rawInstructions
  .split('')
  .filter((char) => ['<', '>', '^', 'v'].includes(char))
  .map((char) => char as '<' | '>' | '^' | 'v');

let robot = [...map.values()].find((tile) => tile.value === '@');

const DIR = {
  '>': 'right',
  '^': 'up',
  v: 'down',
  '<': 'left',
} as const;

function move(tile: Tile, direction: 'right' | 'left' | 'up' | 'down') {
  if (tile[direction].value === 'O') {
    move(tile[direction], direction);
  }

  if (tile[direction].value === '.') {
    const currentTileValue = tile.value;
    const newTileValue = tile[direction].value;

    tile.value = newTileValue;
    tile[direction].value = currentTileValue;

    return tile[direction];
  }
}

printMap(map);

for (const direction of instructions) {
  const dir = DIR[direction];
  move(robot, dir);
  if (robot[dir].value === '@') robot = robot[dir];
}

printMap(map);

const part01 = [...map.values()].reduce((total, tile) => {
  if (tile.value !== 'O') return total;

  return tile.position[1] * 100 + tile.position[0] + total;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);

const map2 = buildMap2d(
  rawMap.split('\n').map((row) => {
    return row
      .split('')
      .map((rawTile) => {
        if (rawTile === '@') {
          return '@.';
        }
        if (rawTile === 'O') {
          return '[]';
        }
        return `${rawTile}${rawTile}`;
      })
      .join('')
      .split('');
  }),
);

let robot2 = [...map2.values()].find((tile) => tile.value === '@');

function move2(tile: Tile, direction: 'right' | 'left' | 'up' | 'down') {
  if (tile[direction].value === '[' || tile[direction].value === ']') {
    if (direction === 'right' || direction === 'left') {
      move2(tile[direction], direction);
    } else {
    }
  }

  if (tile[direction].value === '.') {
    const currentTileValue = tile.value;
    const newTileValue = tile[direction].value;

    tile.value = newTileValue;
    tile[direction].value = currentTileValue;

    return tile[direction];
  }
}

printMap(map2);

for (const direction of instructions) {
  const dir = DIR[direction];
  move2(robot2, dir);
  if (robot2[dir].value === '@') robot2 = robot2[dir];
}

printMap(map2);

process.stdout.write(`Part 02: ${2}\n`);
