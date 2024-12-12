// https://adventofcode.com/2024/day/12
// Day 12: Garden Groups

import path from 'node:path';

import { MakeTuple, readInput } from '../../common';

const input = readInput(path.join(__dirname, 'inputTest'), '\n').map((row) => row.split(''));

type Position = [number, number];
type Tile = {
  up: Tile | null;
  right: Tile | null;
  down: Tile | null;
  left: Tile | null;
  value: string;
  position: Position;
};
type TileMap = Map<Position, Tile>;

const T = MakeTuple<[number, number]>();

function buildMap(rawMap: string[][]): TileMap {
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

type Region = {
  tiles: Map<Position, Tile>;
  tilesArray: Tile[];
  size: number;
};
const blocks: Region[] = [];

for (const [_, tile] of map.entries()) {
  const isAlreadyInABlock = blocks.some((block) => block.tilesArray.includes(tile));

  if (isAlreadyInABlock) continue;

  const newBlock: Region = { tiles: new Map(), size: 0, tilesArray: [] };

  walkBlock(map, tile);

  function walkBlock(map: TileMap, startTile: Tile) {
    newBlock.tiles.set(startTile.position, startTile);
    newBlock.size += 1;
    newBlock.tilesArray.push(startTile);

    for (const direction of ['up', 'down', 'right', 'left'] as const) {
      const nextTile = startTile[direction];

      if (nextTile === null) continue;
      if (nextTile.value !== startTile.value) continue;
      if (newBlock.tilesArray.includes(nextTile)) continue;

      walkBlock(map, nextTile);
    }
  }

  blocks.push(newBlock);
}

const part01 = blocks.reduce((total, block) => {
  const fences = block.tilesArray.reduce((fences, tile) => {
    let sum = 0;
    sum += tile?.up?.value !== tile.value ? 1 : 0;
    sum += tile?.right?.value !== tile.value ? 1 : 0;
    sum += tile?.down?.value !== tile.value ? 1 : 0;
    sum += tile?.left?.value !== tile.value ? 1 : 0;

    return fences + sum;
  }, 0);

  return total + fences * block.size;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
