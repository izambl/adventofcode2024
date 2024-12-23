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
const secretSequences: Array<number[]> = [];
for (const secret of secrets) {
  const secretSequence: number[] = [];
  let secretNumber = secret;
  let count = 2000;
  secretSequence.push(Number(String(secretNumber).at(-1)));
  while (count--) {
    secretNumber = getNextSecretNumber(secretNumber);
    secretSequence.push(Number(String(secretNumber).at(-1)));
  }
  secretSequences.push(secretSequence);
  total += secretNumber;
}

const changes: Array<number[]> = [];

for (const secretSequence of secretSequences) {
  const changeArray = [];
  for (let i = 1; i < secretSequence.length; i++) {
    const change = secretSequence[i] - secretSequence[i - 1];
    changeArray.push(change);
  }

  changes.push(changeArray);
}

const differentSequences = new Set<string>();
const sequencesQuantity: Record<string, number> = {};
for (const change of changes) {
  for (let i = 0; i < change.length - 3; i++) {
    const seq = [change[i], change[i + 1], change[i + 2], change[i + 3]].join('|');
    differentSequences.add(seq);
    if (!sequencesQuantity[seq]) sequencesQuantity[seq] = 0;
    sequencesQuantity[seq]++;
  }
}

let part2 = 0;
for (const [key, value] of Object.entries(sequencesQuantity)) {
  if (value <= 2) continue;
  const seq = key.split('|').map(Number);

  let totalForSeq = 0;

  for (const [index, change] of changes.entries()) {
    for (let i = 0; i < change.length - 3; i++) {
      if (change[i] === seq[0] && change[i + 1] === seq[1] && change[i + 2] === seq[2] && change[i + 3] === seq[3]) {
        //console.log('Found match for', seq, 'at index', i, 'for change', index);
        totalForSeq += secretSequences[index][i + 4];
        break;
      }
    }
  }

  if (totalForSeq > part2) {
    part2 = totalForSeq;
    console.log(part2);
  }
}

process.stdout.write(`Part 01: ${total}\n`);
process.stdout.write(`Part 02: ${part2}\n`);
