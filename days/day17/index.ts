// https://adventofcode.com/2024/day/17
// Day 17: Chronospatial Computer

import path from 'node:path';

import { readInput } from '../../common';

const [rawRegisters, rawInstructions] = readInput(path.join(__dirname, 'input01'), '\n\n');

const instructions = rawInstructions.split(': ')[1].split(',').map(Number);
const [a, b, c] = rawRegisters.split('\n').map((registerRow) => Number(registerRow.split(': ')[1]));

function runProgram(instructions: number[], registerValues: { A: number; B: number; C: number }): number[] {
  const Registers: Record<string, number> = {
    ...registerValues,
  };
  function Combo(operand: number): number {
    if (operand === 7) throw new Error('Reserved operand');
    if (operand === 6) return Registers.C;
    if (operand === 5) return Registers.B;
    if (operand === 4) return Registers.A;
    return operand;
  }

  const output: number[] = [];
  let pointer = 0;
  while (instructions[pointer] !== undefined) {
    const opcode = instructions[pointer];
    const operand = instructions[pointer + 1];

    switch (opcode) {
      case 0:
        Registers.A = Math.floor(Registers.A / 2 ** Combo(operand));
        break;
      case 1:
        Registers.B = Registers.B ^ operand;
        break;
      case 2:
        Registers.B = (Combo(operand) % 8) & 7;
        break;
      case 3:
        if (Registers.A > 0) pointer = operand - 2;
        break;
      case 4:
        Registers.B = Registers.B ^ Registers.C;
        break;
      case 5:
        output.push(Combo(operand) % 8);
        break;
      case 6:
        Registers.B = Math.floor(Registers.A / 2 ** Combo(operand));
        break;
      case 7:
        Registers.C = Math.floor(Registers.A / 2 ** Combo(operand));
        break;
      default:
        throw new Error('Unknown opcode');
    }

    pointer += 2;
  }

  return output;
}

function runProgram2(instructions: number[], registerValues: { A: bigint; B: bigint; C: bigint }): number[] {
  const Registers: Record<string, bigint> = {
    ...registerValues,
  };
  function Combo(operand: number): bigint {
    if (operand === 7) throw new Error('Reserved operand');
    if (operand === 6) return Registers.C;
    if (operand === 5) return Registers.B;
    if (operand === 4) return Registers.A;

    return BigInt(operand);
  }

  const output: number[] = [];
  let pointer = 0;
  while (instructions[pointer] !== undefined) {
    const opcode = instructions[pointer];
    const operand = instructions[pointer + 1];

    switch (opcode) {
      case 0:
        Registers.A = Registers.A >> Combo(operand);
        break;
      case 1:
        Registers.B = Registers.B ^ BigInt(operand);
        break;
      case 2:
        Registers.B = Combo(operand) & 7n;
        break;
      case 3:
        if (Registers.A > 0) pointer = operand - 2;
        break;
      case 4:
        Registers.B = Registers.B ^ Registers.C;
        break;
      case 5:
        output.push(Number(Combo(operand) & 7n));
        break;
      case 6:
        Registers.B = Registers.A >> Combo(operand);
        break;
      case 7:
        Registers.C = Registers.A >> Combo(operand);
        break;
      default:
        throw new Error('Unknown opcode');
    }

    pointer += 2;
  }

  return output;
}

const part01 = runProgram([...instructions], { A: a, B: b, C: c }).join(',');

const part2Results: bigint[] = [];
function walk(currentA: string, instructionSet: number[], round: number) {
  if (round > instructionSet.length) return;
  const finding = instructionSet.slice(round * -1);

  for (let i = 7; i >= 0; i--) {
    const currA = BigInt(`0b${currentA}${i.toString(2).padStart(3, '0')}`);

    process.stdout.write(`    Try with ${currentA}${i.toString(2).padStart(3, '0')} [${currA}]: `);

    const result = runProgram2([...instructions], { A: currA, B: 0n, C: 0n });

    process.stdout.write(`${result.join(',')} -- `);

    if (result.join(',') === finding.join(',')) {
      const nextA = currentA + i.toString(2).padStart(3, '0');
      process.stdout.write(`FOUND, A = ${nextA}\n`);

      if (result.join(',') === instructionSet.join(',')) {
        part2Results.push(BigInt(`0b${nextA}`));
      }

      walk(nextA, instructionSet, round + 1);
    } else {
      process.stdout.write('FAIL\n');
    }
  }
}

walk('000', instructions, 1);

const part02 = Math.min(...part2Results.map(Number));

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
