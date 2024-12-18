// https://adventofcode.com/2024/day/15
// Day 15: Warehouse Woes

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Tile, type TileMap, buildMap2d, printMap } from '../../common/map-builder';

const [rawMap, rawInstructions] = readInput(path.join(__dirname, 'input01'), '\n\n');

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

function getMovableBlock(tile: Tile, direction: 'up' | 'down', movableBlock: Set<Tile>) {
  if (!['[', ']', '@'].includes(tile.value)) return;

  movableBlock.add(tile);

  if (tile.value === '[') {
    movableBlock.add(tile.right);
    getMovableBlock(tile.right[direction], direction, movableBlock);
  }
  if (tile.value === ']') {
    movableBlock.add(tile.left);
    getMovableBlock(tile.left[direction], direction, movableBlock);
  }

  getMovableBlock(tile[direction], direction, movableBlock);
}

function moveBlock(block: Set<Tile>, direction: 'up' | 'down') {
  const sortedBlock = [...block].sort((tileA, tileB) => {
    return direction === 'down' ? tileB.position[1] - tileA.position[1] : tileA.position[1] - tileB.position[1];
  });

  for (const tile of sortedBlock) {
    tile[direction].value = tile.value;
    tile.value = '.';
  }
}

function move2(tile: Tile, direction: 'right' | 'left' | 'up' | 'down') {
  if (tile[direction].value === '[' || tile[direction].value === ']') {
    if (direction === 'right' || direction === 'left') {
      move2(tile[direction], direction);
    } else {
      const movableBlock = new Set<Tile>();
      getMovableBlock(tile, direction, movableBlock);

      // Not movable
      if ([...movableBlock].some((t) => t[direction].value === '#')) {
        return;
      }
      moveBlock(movableBlock, direction);
      return;
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

const part02 = [...map2.values()].reduce((total, tile) => {
  if (tile.value !== '[') return total;

  return tile.position[1] * 100 + total + tile.position[0];
}, 0);

process.stdout.write(`Part 02: ${part02}\n`);
