// https://adventofcode.com/2024/day/12
// Day 12: Garden Groups

import path from 'node:path';

import { readInput } from '../../common';
import { P, type Tile, type TileMap, buildMap2d } from '../../common/map-builder';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));

const map = buildMap2d(input);

type Region = {
  plant: string;
  size: number;
  map: TileMap;
};
const regions: Region[] = [];

for (const [_, tile] of map.entries()) {
  const isAlreadyInARegion = regions.some((region) => region.map.has(tile.position));

  if (isAlreadyInARegion) continue;

  const newRegion: Region = { map: new Map(), plant: tile.value, size: 0 };

  walkRegion(map, tile);

  function walkRegion(map: TileMap, currentTile: Tile) {
    newRegion.size += 1;
    newRegion.map.set(currentTile.position, currentTile);

    for (const direction of ['up', 'down', 'right', 'left'] as const) {
      const nextTile = currentTile[direction];

      if (nextTile === null) continue;
      if (nextTile.value !== currentTile.value) continue;
      if (newRegion.map.has(nextTile.position)) continue;

      walkRegion(map, nextTile);
    }
  }

  regions.push(newRegion);
}

const part01 = regions.reduce((total, region) => {
  const fences = [...region.map.values()].reduce((fences, tile) => {
    let sum = 0;
    sum += tile?.up?.value !== tile.value ? 1 : 0;
    sum += tile?.right?.value !== tile.value ? 1 : 0;
    sum += tile?.down?.value !== tile.value ? 1 : 0;
    sum += tile?.left?.value !== tile.value ? 1 : 0;

    return fences + sum;
  }, 0);

  return total + fences * region.size;
}, 0);

let part02 = 0;
for (const region of regions) {
  const allXs = [...region.map.values()].map((tile) => Number(tile.position[0]));
  const allYs = [...region.map.values()].map((tile) => Number(tile.position[1]));
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
      const tile = region.map.get(P(x, y));

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
      const tile = region.map.get(P(x, y));

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

  console.log(`${region.plant}: ${xSides + ySides} * ${region.size} = ${(xSides + ySides) * region.size}`);

  part02 += (xSides + ySides) * region.size;
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
