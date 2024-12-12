// https://adventofcode.com/2024/day/12
// Day 12: Garden Groups

import path from 'node:path';

import { MakeTuple, readInput } from '../../common';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));

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
  tilesArray: Tile[];
  size: number;
  plant: string;
  map: TileMap;
};
const regions: Region[] = [];

for (const [_, tile] of map.entries()) {
  const isAlreadyInABlock = regions.some((block) => block.tilesArray.includes(tile));

  if (isAlreadyInABlock) continue;

  const newRegion: Region = { map: new Map(), plant: tile.value, size: 0, tilesArray: [] };

  walkBlock(map, tile);

  function walkBlock(map: TileMap, startTile: Tile) {
    newRegion.size += 1;
    newRegion.tilesArray.push(startTile);
    newRegion.map.set(startTile.position, startTile);

    for (const direction of ['up', 'down', 'right', 'left'] as const) {
      const nextTile = startTile[direction];

      if (nextTile === null) continue;
      if (nextTile.value !== startTile.value) continue;
      if (newRegion.tilesArray.includes(nextTile)) continue;

      walkBlock(map, nextTile);
    }
  }

  regions.push(newRegion);
}

const part01 = regions.reduce((total, block) => {
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

let part02 = 0;
for (const region of regions) {
  const allXs = region.tilesArray.map((tile) => Number(tile.position[0]));
  const allYs = region.tilesArray.map((tile) => Number(tile.position[1]));
  const minX = Math.min(...allXs);
  const maxX = Math.max(...allXs);
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);

  // X scan
  let xSides = 0;
  for (let y = minY; y <= maxY; y++) {
    let sideUpstart = false;
    let sideDownStart = false;

    for (let x = minX; x <= maxX; x++) {
      const tile = region.map.get(T([x, y]));

      if (!tile) {
        if (sideUpstart) xSides++;
        sideUpstart = false;
        if (sideDownStart) xSides++;
        sideDownStart = false;
        continue;
      }
      if (tile.up?.value !== tile.value) {
        sideUpstart = true;
      } else {
        if (sideUpstart) xSides++;
        sideUpstart = false;
      }
      if (tile.down?.value !== tile.value) {
        sideDownStart = true;
      } else {
        if (sideDownStart) xSides++;
        sideDownStart = false;
      }
    }

    if (sideUpstart) xSides++;
    if (sideDownStart) xSides++;
  }

  // Y scan
  let ySides = 0;
  for (let x = minX; x <= maxX; x++) {
    let sideLeftStart = false;
    let sideRightStart = false;

    for (let y = minY; y <= maxY; y++) {
      const tile = region.map.get(T([x, y]));

      if (!tile) {
        if (sideLeftStart) ySides++;
        sideLeftStart = false;
        if (sideRightStart) ySides++;
        sideRightStart = false;
        continue;
      }
      if (tile.left?.value !== tile.value) {
        sideLeftStart = true;
      } else {
        if (sideLeftStart) ySides++;
        sideLeftStart = false;
      }
      if (tile.right?.value !== tile.value) {
        sideRightStart = true;
      } else {
        if (sideRightStart) ySides++;
        sideRightStart = false;
      }
    }

    if (sideLeftStart) ySides++;
    if (sideRightStart) ySides++;
  }

  console.log(region.plant, xSides, ySides, region.size);

  part02 += (xSides + ySides) * region.size;
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
