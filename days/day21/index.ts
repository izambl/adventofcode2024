// https://adventofcode.com/2024/day/21
// Day 21: Keypad Conundrum

import path from 'node:path';

import { readInput } from '../../common';
import {
  type Direction,
  P,
  type Position,
  type Tile,
  type TileMap,
  buildMap2d,
  printMap,
} from '../../common/map-builder';

const inputs = readInput(path.join(__dirname, 'input01'), '\n');

type Key = Tile;
type KeyMap = TileMap;

type NumericPadKeys = 'A' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '1' | '0';
type KeyPadKeys = 'A' | 'up' | 'right' | 'down' | 'left';

function getNumericPad(): Record<NumericPadKeys, Key> {
  const key7: Key = { value: '7', up: null, right: null, down: null, left: null, position: P(0, 0) };
  const key8: Key = { value: '8', up: null, right: null, down: null, left: null, position: P(1, 0) };
  const key9: Key = { value: '9', up: null, right: null, down: null, left: null, position: P(2, 0) };
  const key4: Key = { value: '4', up: null, right: null, down: null, left: null, position: P(0, 1) };
  const key5: Key = { value: '5', up: null, right: null, down: null, left: null, position: P(1, 1) };
  const key6: Key = { value: '6', up: null, right: null, down: null, left: null, position: P(2, 1) };
  const key1: Key = { value: '1', up: null, right: null, down: null, left: null, position: P(0, 2) };
  const key2: Key = { value: '2', up: null, right: null, down: null, left: null, position: P(1, 2) };
  const key3: Key = { value: '3', up: null, right: null, down: null, left: null, position: P(2, 2) };
  const key0: Key = { value: '0', up: null, right: null, down: null, left: null, position: P(1, 3) };
  const keyA: Key = { value: 'A', up: null, right: null, down: null, left: null, position: P(2, 3) };

  keyA.up = key3;
  keyA.left = key0;

  key0.up = key2;
  key0.right = keyA;

  key1.up = key4;
  key1.right = key2;

  key2.up = key5;
  key2.right = key3;
  key2.down = key0;
  key2.left = key1;

  key3.up = key6;
  key3.down = keyA;
  key3.left = key2;

  key4.up = key7;
  key4.right = key5;
  key4.down = key1;

  key5.up = key8;
  key5.right = key6;
  key5.down = key2;
  key5.left = key4;

  key6.up = key9;
  key6.down = key3;
  key6.left = key5;

  key7.right = key8;
  key7.down = key4;

  key8.right = key9;
  key8.down = key5;
  key8.left = key7;

  key9.down = key6;
  key9.left = key8;

  return {
    A: keyA,
    '0': key0,
    '1': key1,
    '2': key2,
    '3': key3,
    '4': key4,
    '5': key5,
    '6': key6,
    '7': key7,
    '8': key8,
    '9': key9,
  };
}
function getKeyPad(): Record<KeyPadKeys, Key> {
  const keyA: Key = { value: 'A', up: null, right: null, down: null, left: null, position: P(2, 0) };
  const keyUp: Key = { value: 'up', up: null, right: null, down: null, left: null, position: P(1, 0) };
  const keyRight: Key = { value: 'right', up: null, right: null, down: null, left: null, position: P(2, 1) };
  const keyDown: Key = { value: 'down', up: null, right: null, down: null, left: null, position: P(1, 1) };
  const keyLeft: Key = { value: 'left', up: null, right: null, down: null, left: null, position: P(0, 1) };

  keyUp.right = keyA;
  keyUp.down = keyDown;

  keyRight.up = keyA;
  keyRight.left = keyDown;

  keyDown.up = keyUp;
  keyDown.right = keyRight;
  keyDown.left = keyLeft;

  keyLeft.right = keyDown;

  keyA.down = keyRight;
  keyA.left = keyUp;

  return {
    A: keyA,
    up: keyUp,
    right: keyRight,
    down: keyDown,
    left: keyLeft,
  };
}

function getShortestPathToKey(currentKey: Key, goalKey: Key): Direction[] {
  const goodPaths: Array<[Direction[], number]> = [];

  function walk(
    currentKey: Key | null,
    searchedKey: Key,
    visitedMap: Map<string, number>,
    walkedPath: Key[],
    directionPath: Direction[],
    pathCost: number,
    currentDirection: Direction,
  ) {
    const keyKey = `${currentKey.value}-${currentDirection}`;
    // if (visitedMap.get(keyKey) <= pathCost) return;
    if (walkedPath.includes(currentKey)) return;

    walkedPath.push(currentKey);
    visitedMap.set(keyKey, pathCost);

    if (currentKey === searchedKey) {
      goodPaths.push([directionPath, pathCost]);
    }

    for (const direction of ['left', 'down', 'right', 'up'] as const) {
      if (currentKey[direction] === null) continue;

      walk(
        currentKey[direction],
        searchedKey,
        visitedMap,
        [...walkedPath],
        [...directionPath, direction],
        pathCost + 1 + (direction === currentDirection ? 1 : 5),
        direction,
      );
    }

    return goodPaths;
  }

  walk(currentKey, goalKey, new Map(), [], [], 0, null);
  const shortestPath = goodPaths.sort(([_a, costA], [_b, costB]) => costA - costB)[0][0];

  // console.log('FROM', currentKey.value, 'TO', goalKey.value, shortestPath, goodPaths);

  return shortestPath;
}

let total = 0;
const intermediateRobots = 2;
for (const codeInput of inputs) {
  console.log('Entering code', codeInput);

  // Robot at numeric pad
  const codeSequence: KeyPadKeys[] = [];
  const code = codeInput.split('');
  const numericPad = getNumericPad();
  let currentKey = numericPad.A;
  for (const key of code) {
    const nextKey = numericPad[key as NumericPadKeys];
    const shortestPath = getShortestPathToKey(currentKey, nextKey);
    currentKey = nextKey;

    codeSequence.push(...shortestPath, 'A');
  }

  //while (intermediateRobots--) {}

  // Robot at key pad
  const codeSequence2: KeyPadKeys[] = [];
  const keyPad = getKeyPad();
  let currentKey2 = keyPad.A;
  for (const key2 of codeSequence) {
    const nextKey = keyPad[key2 as KeyPadKeys];

    const shortestPath = getShortestPathToKey(currentKey2, nextKey);
    currentKey2 = nextKey;

    codeSequence2.push(...shortestPath, 'A');
  }

  // Robot at key pad 3
  const codeSequence3: KeyPadKeys[] = [];
  let currentKey3 = keyPad.A;
  for (const key2 of codeSequence2) {
    const nextKey = keyPad[key2 as KeyPadKeys];

    const shortestPath = getShortestPathToKey(currentKey3, nextKey);
    currentKey3 = nextKey;

    codeSequence3.push(...shortestPath, 'A');
  }

  total += codeSequence3.length * Number(codeInput.slice(0, -1));
}

process.stdout.write(`Part 01: ${total}\n`);
process.stdout.write(`Part 02: ${2}\n`);

// 029A
// <A^A^^>AvvvA
// <A^A>^^AvvvA
// v<<A>>^A<A>A<AAv>A^A<vAAA^>A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
// <vA<AA>>^AvAA^<A>Av<<A>>^AvA^Av<<A>>^AA<vA>A^A<A>Av<<A>A^>AAA<Av>A^A
// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A

//    <    A  ^  A  >   ^   ^  A   v v v   A
// v<<A >>^A <A >A <A   A v>A ^A <vA A A ^>A
// v<<A >>^A <A >A vA <^A   A >A <vA A A >^A
