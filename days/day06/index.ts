// https://adventofcode.com/2024/day/6
// Day 6: Guard Gallivant

import path from 'node:path';
import _ from 'lodash';

import { readInput } from '../../common/index';

const input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(''));
const map: Record<string, string> = {};
let guardPosition = '';

// Build the map
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input.length; x++) {
    const currentTile = input[y][x];
    map[`${x}:${y}`] = currentTile;
    if (currentTile === '^') {
      guardPosition = `${x}:${y}`;
      map[`${x}:${y}`] = '.';
    }
  }
}

const directions: Record<string, string> = {
  NORTH: 'EAST',
  EAST: 'SOUTH',
  SOUTH: 'WEST',
  WEST: 'NORTH',
};

function walk(startPosition = '', startDirection = 'NORTH', addedPosition = 'NONE') {
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

    if (map[`${newX}:${newY}`] === '#' || addedPosition === `${newX}:${newY}`) {
      newX = Number(x);
      newY = Number(y);
      guardDirection = directions[guardDirection];

      if (guardDirection === 'NORTH') newY -= 1;
      if (guardDirection === 'EAST') newX += 1;
      if (guardDirection === 'SOUTH') newY += 1;
      if (guardDirection === 'WEST') newX -= 1;
    }

    guardPosition = `${newX}:${newY}`;

    if (map[`${newX}:${newY}`] === undefined) {
      break;
    }
  }

  return [visitedLocations, false];
}

const [visitedLocations] = walk(guardPosition);
const part01 = Object.keys(visitedLocations).length;

// Check with objects in all possible locations
const part02 = Object.keys(visitedLocations).reduce((loopPositions, tile) => {
  if (tile === guardPosition) return loopPositions;
  if (map[tile] !== '.') return loopPositions;

  const [_, inALoop] = walk(guardPosition, 'NORTH', tile);
  if (inALoop) {
    return loopPositions + 1;
  }
  return loopPositions;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
