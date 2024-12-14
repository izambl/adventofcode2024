// https://adventofcode.com/2024/day/14
// Day 14: Restroom Redoubt

import path from 'node:path';

import { readInput } from '../../common';

type Robot = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
};

const robots: Robot[] = readInput(path.join(__dirname, 'input01'), '\n').map((robotDefinition) => {
  const [posRaw, velRaw] = robotDefinition.split(' ');

  const pos = posRaw.replace('p=', '').split(',').map(Number);
  const vel = velRaw.replace('v=', '').split(',').map(Number);

  return {
    position: { x: pos[0], y: pos[1] },
    velocity: { x: vel[0], y: vel[1] },
  };
});

const mapX = 101;
const mapY = 103;
const seconds = 100;

const movedRobots = robots.map((robot) => {
  const newX = (robot.position.x + robot.velocity.x * seconds) % mapX;
  const newY = (robot.position.y + robot.velocity.y * seconds) % mapY;

  return {
    position: {
      x: newX >= 0 ? newX : mapX + newX,
      y: newY >= 0 ? newY : mapY + newY,
    },
    velocity: {
      x: robot.velocity.x,
      y: robot.velocity.y,
    },
  };
});

const sections = movedRobots
  .filter((robot) => robot.position.x !== mapX / 2 - 0.5 && robot.position.y !== mapY / 2 - 0.5)
  .reduce(
    (total, robot) => {
      const xLength = mapX / 2;
      const yLength = mapY / 2;

      if (robot.position.x < xLength) {
        if (robot.position.y < yLength) {
          total[0]++;
        } else {
          total[2]++;
        }
      } else {
        if (robot.position.y < yLength) {
          total[1]++;
        } else {
          total[3]++;
        }
      }

      return total;
    },
    [0, 0, 0, 0],
  );

const part01 = sections[0] * sections[1] * sections[2] * sections[3];

let timeElapsed = 1;

while (timeElapsed <= 10000) {
  console.log('Time elapsed', timeElapsed);
  const robotPositions = new Set<string>();
  robots.map((robot) => {
    const newX = (robot.position.x + robot.velocity.x * timeElapsed) % mapX;
    const newY = (robot.position.y + robot.velocity.y * timeElapsed) % mapY;

    robotPositions.add(`${newX >= 0 ? newX : mapX + newX}:${newY >= 0 ? newY : mapY + newY}`);

    return {
      position: {
        x: newX >= 0 ? newX : mapX + newX,
        y: newY >= 0 ? newY : mapY + newY,
      },
      velocity: {
        x: robot.velocity.x,
        y: robot.velocity.y,
      },
    };
  });

  let suspicious = false;

  for (let y = 0; y < mapY; y++) {
    let neighbors = 0;
    for (let x = 0; x < mapX; x++) {
      if (robotPositions.has(`${x}:${y}`)) {
        neighbors++;

        if (neighbors === 6) {
          suspicious = true;
        }
      } else {
        neighbors = 0;
      }
    }
  }

  timeElapsed++;

  if (!suspicious) continue;

  for (let y = 0; y < mapY; y++) {
    for (let x = 0; x < mapX; x++) {
      if (robotPositions.has(`${x}:${y}`)) {
        process.stdout.write('R');
      } else {
        process.stdout.write(' ');
      }
    }

    process.stdout.write('\n');
  }

  console.log('\n\n\n\n\n\n');
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);
