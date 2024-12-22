// https://adventofcode.com/2024/day/22
// Day 22: Monkey Market

import path from 'node:path';

import { readInput } from '../../common';

const secrets = readInput(path.join(__dirname, 'input01'), '\n').map(BigInt);

function getNextSecretNumber(secretNumber: bigint): bigint {
  let newSecretNumber = secretNumber;

  newSecretNumber = ((newSecretNumber * 64n) ^ newSecretNumber) % 16777216n;

  newSecretNumber = ((newSecretNumber / 32n) ^ newSecretNumber) % 16777216n;

  newSecretNumber = ((newSecretNumber * 2048n) ^ newSecretNumber) % 16777216n;

  return newSecretNumber;
}

let total = 0n;
for (const secret of secrets) {
  let secretNumber = secret;
  let count = 2000;
  while (count--) {
    secretNumber = getNextSecretNumber(secretNumber);
  }
  total += secretNumber;
}

process.stdout.write(`Part 01: ${total}\n`);
process.stdout.write(`Part 02: ${2}\n`);
