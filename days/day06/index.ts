// https://adventofcode.com/2024/day/6
// Day 6: Guard Gallivant

import path from 'node:path';
import _ from 'lodash';

import { readInput } from '../../common/index';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));
const originalMap: Record<string, string> = {};
let guardPosition = '';

// Build the map
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input.length; x++) {
    const currentTile = input[y][x];
    originalMap[`${x}:${y}`] = currentTile;
    if (currentTile === '^') {
      guardPosition = `${x}:${y}`;
      originalMap[`${x}:${y}`] = '.';
    }
  }
}

const directions: Record<string, string> = {
  NORTH: 'EAST',
  EAST: 'SOUTH',
  SOUTH: 'WEST',
  WEST: 'NORTH',
};

function walk(map: Record<string, string>, startPosition = '', startDirection = 'NORTH') {
  const visitedLocations: Record<string, Record<string, boolean>> = {};

  let guardDirection = startDirection;
  let guardPosition = startPosition;

  while (true) {
    if (!visitedLocations[guardPosition]) visitedLocations[guardPosition] = {};

    // If it has visited the same place before going in the same direction means that the guard is in a loop
    if (visitedLocations[guardPosition][guardDirection]) {
      return [visitedLocations, true];
    }

    visitedLocations[guardPosition][guardDirection] = true;

    const [x, y] = guardPosition.split(':');
    let newX = Number(x);
    let newY = Number(y);

    if (guardDirection === 'NORTH') newY -= 1;
    if (guardDirection === 'EAST') newX += 1;
    if (guardDirection === 'SOUTH') newY += 1;
    if (guardDirection === 'WEST') newX -= 1;

    const newPosition = `${newX}:${newY}`;

    if (map[newPosition] === '#') {
      guardDirection = directions[guardDirection];
      continue;
    }

    guardPosition = newPosition;

    if (map[newPosition] === undefined) {
      break;
    }
  }

  return [visitedLocations, false];
}

const [visitedLocations] = walk(originalMap, guardPosition);
const part01 = Object.keys(visitedLocations).length;

// Check with objects in all possible locations
const part02 = Object.keys(visitedLocations).reduce((loopPositions, tile) => {
  const newMap = JSON.parse(JSON.stringify(originalMap));

  if (tile === guardPosition) return loopPositions;
  if (newMap[tile] !== '.') return loopPositions;

  newMap[tile] = '#';

  const [_, inALoop] = walk(newMap, guardPosition, 'NORTH');
  if (inALoop) {
    return loopPositions + 1;
  }
  return loopPositions;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
