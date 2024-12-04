// https://adventofcode.com/2024/day/1
// Day 1: Historian Hysteria

import path from 'node:path';

import { readInput } from '../../common/index';

const part01Input = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split('   '));

const leftList: number[] = [];
const rightList: number[] = [];

for (const [left, right] of part01Input) {
  leftList.push(Number(left));
  rightList.push(Number(right));
}

leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);

let totalDistance = 0;
for (let i = 0; i < leftList.length; i++) {
  totalDistance += Math.abs(leftList[i] - rightList[i]);
}

const rightListFrequency = rightList.reduce<Record<number, number>>((acc, location) => {
  if (!acc[location]) {
    acc[location] = 1;
  } else {
    acc[location]++;
  }
  return acc;
}, {});

let totalSimilarity = 0;
for (const leftLocation of leftList) {
  if (rightListFrequency[leftLocation]) {
    totalSimilarity += leftLocation * rightListFrequency[leftLocation];
  }
}

process.stdout.write(`Part 01: ${totalDistance}\n`);
process.stdout.write(`Part 02: ${totalSimilarity}\n`);
