// https://adventofcode.com/2024/day/13
// Day 13: Claw Contraption

import path from 'node:path';

import { readInput } from '../../common';

const machinesPart01 = readInput(path.join(__dirname, 'input01'), '\n\n').map((machineDefinition) => {
  const [ax, ay, bx, by, fx, fy] = machineDefinition
    .replaceAll('=', '+')
    .match(/(X\+\d+)|(Y\+\d+)|(X=\d+)|(Y=\d+)/g)
    .map((element) => element.replace('X+', '').replace('Y+', ''))
    .map(Number);

  return {
    buttonAX: ax,
    buttonAY: ay,
    buttonBX: bx,
    buttonBY: by,
    prizeX: fx,
    prizeY: fy,
  };
});

const machinesPart02 = readInput(path.join(__dirname, 'input01'), '\n\n').map((machineDefinition) => {
  const [ax, ay, bx, by, fx, fy] = machineDefinition
    .replaceAll('=', '+')
    .match(/(X\+\d+)|(Y\+\d+)|(X=\d+)|(Y=\d+)/g)
    .map((element) => element.replace('X+', '').replace('Y+', ''))
    .map(Number);

  return {
    buttonAX: ax,
    buttonAY: ay,
    buttonBX: bx,
    buttonBY: by,
    prizeX: fx + 10000000000000,
    prizeY: fy + 10000000000000,
  };
});

let part01 = 0;
for (const machine of machinesPart01) {
  const timesButtonA = Math.min(
    Math.floor(machine.prizeX / machine.buttonAX),
    Math.floor(machine.prizeY / machine.buttonAY),
  );

  const options = [];
  for (let a = timesButtonA; a >= 0; a--) {
    const x = machine.buttonAX * a;
    const y = machine.buttonAY * a;

    const leftX = machine.prizeX - x;
    const leftY = machine.prizeY - y;

    if (
      leftX % machine.buttonBX === 0 &&
      leftY % machine.buttonBY === 0 &&
      leftX / machine.buttonBX === leftY / machine.buttonBY
    ) {
      options.push(a * 3 + leftX / machine.buttonBX);
    }
  }
  if (options.length > 0) {
    part01 += Math.min(...options);
  }
}

let part02 = 0;
// https://es.wikipedia.org/wiki/Regla_de_Cramer
for (const machine of machinesPart02) {
  // machine.buttonAX * a + machine.buttonBX * b = machine.prizeX
  // machine.buttonAY * a + machine.buttonBY * b = machine.prizeY

  const a =
    (machine.prizeX * machine.buttonBY - machine.buttonBX * machine.prizeY) /
    (machine.buttonAX * machine.buttonBY - machine.buttonBX * machine.buttonAY);

  const b =
    (machine.buttonAX * machine.prizeY - machine.prizeX * machine.buttonAY) /
    (machine.buttonAX * machine.buttonBY - machine.buttonBX * machine.buttonAY);

  if (a % 1 === 0 && b % 1 === 0) {
    part02 += a * 3 + b;
  }
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
