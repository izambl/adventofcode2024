// https://adventofcode.com/2024/day/7
// Day 7: Bridge Repair

import path from 'node:path';

import { readInput } from '../../common/index';

type Equation = [number, number[]];

const input: Equation[] = readInput(path.join(__dirname, 'input01'), '\n').map((row) => {
  const [result, operators] = row.split(': ');

  return [Number(result), operators.split(' ').map(Number)];
});

const goodEquationsPart01 = input.filter((equation) => {
  return isEquationGood(equation, 'part01');
});
const goodEquationsPart02 = input.filter((equation) => {
  return isEquationGood(equation, 'part02');
});

function isEquationGood(equation: Equation, part: string): boolean {
  const [expectedResult, constants] = equation;

  const possibleResults =
    part === 'part01'
      ? getResult(constants[0], 1, equation, [])
      : getResultWithThirdOperator(constants[0], 1, equation, []);

  return possibleResults.some((result) => result === expectedResult);
}

function getResult(
  currentValue: number,
  currentOperator: number,
  equation: Equation,
  currentResults: number[],
): number[] {
  const number = equation[1][currentOperator];

  if (number === undefined) {
    return [...currentResults, currentValue];
  }

  const nextValuePlus = currentValue + number;
  const nextValueMult = currentValue * number;

  return [
    ...getResult(nextValuePlus, currentOperator + 1, equation, currentResults),
    ...getResult(nextValueMult, currentOperator + 1, equation, currentResults),
  ];
}

function getResultWithThirdOperator(
  currentValue: number,
  currentOperator: number,
  equation: Equation,
  currentResults: number[],
): number[] {
  const number = equation[1][currentOperator];

  if (number === undefined) {
    return [...currentResults, currentValue];
  }

  const nextValuePlus = currentValue + number;
  const nextValueMult = currentValue * number;
  const nextValueConcat = Number(`${currentValue}${number}`);

  return [
    ...getResultWithThirdOperator(nextValuePlus, currentOperator + 1, equation, currentResults),
    ...getResultWithThirdOperator(nextValueMult, currentOperator + 1, equation, currentResults),
    ...getResultWithThirdOperator(nextValueConcat, currentOperator + 1, equation, currentResults),
  ];
}

const part01 = goodEquationsPart01.reduce((total, equation) => equation[0] + total, 0);
const part02 = goodEquationsPart02.reduce((total, equation) => equation[0] + total, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
