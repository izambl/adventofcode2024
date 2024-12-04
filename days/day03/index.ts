// https://adventofcode.com/2024/day/3
// Day 3: Mull It Over

import path from 'node:path';

import { readInput } from '../../common/index';

const [corruptedProgram] = readInput(path.join(__dirname, 'input01'), '/n/n/n/n');

const findMulInstructionsRegExp = /mul\(\d{1,3},\d{1,3}\)/g;
const matches = [...corruptedProgram.matchAll(findMulInstructionsRegExp)].map((match) => match[0]);

const result01 = matches.reduce((total, instruction) => {
  const [a, b] = instruction.replace('mul(', '').replace(')', '').split(',').map(Number);

  return total + a * b;
}, 0);

const findAllInstructionsRegExp = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g;
const part2Matches = [...corruptedProgram.matchAll(findAllInstructionsRegExp)].map((match) => match[0]);

let isCounting = true;
const result02 = part2Matches.reduce((total, instruction) => {
  if (instruction === 'do()') {
    isCounting = true;
    return total;
  }
  if (instruction === "don't()") {
    isCounting = false;
    return total;
  }

  if (isCounting === false) {
    return total;
  }

  const [a, b] = instruction.replace('mul(', '').replace(')', '').split(',').map(Number);

  return total + a * b;
}, 0);

process.stdout.write(`Part 01: ${result01}\n`);
process.stdout.write(`Part 02: ${result02}\n`);
