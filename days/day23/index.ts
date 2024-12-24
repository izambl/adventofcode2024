// https://adventofcode.com/2024/day/23
// Day 23: LAN Party

import path from 'node:path';

import { readInput } from '../../common';

const connections = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split('-'));

type Computer = {
  name: string;
  connections: Set<Computer>;
};

const computers: Map<string, Computer> = new Map();

for (const [comp1, comp2] of connections) {
  if (!computers.get(comp1)) computers.set(comp1, { name: comp1, connections: new Set() });
  if (!computers.get(comp2)) computers.set(comp2, { name: comp2, connections: new Set() });

  computers.get(comp1).connections.add(computers.get(comp2));
  computers.get(comp2).connections.add(computers.get(comp1));
}

const tComps = [...computers.values()].filter((computer) => computer.name[0] === 't');

const lanPartiesOfThree: Set<string> = new Set();
for (const tComp of tComps) {
  for (const conn1 of tComp.connections) {
    for (const conn2 of tComp.connections) {
      if (conn1 === conn2) continue;
      if (conn1.connections.has(conn2)) {
        lanPartiesOfThree.add([tComp.name, conn1.name, conn2.name].sort().join(','));
      }
    }
  }
}

const possibleParties: Set<string> = new Set();
for (const tComp of [...computers.values()]) {
  const parties: string[][] = [];
  for (const conn1 of tComp.connections) {
    const party = [tComp.name, conn1.name];

    for (const conn2 of tComp.connections) {
      if (conn1 === conn2) continue;
      if (conn1.connections.has(conn2)) {
        party.push(conn2.name);
      }
    }

    parties.push(party);
  }

  for (const party of parties.map((party) => party.sort().join(','))) {
    possibleParties.add(party);
  }
}

const validParties = [...possibleParties].filter((party) => {
  const comps = party.split(',');

  for (const comp1Name of comps) {
    const comp1 = computers.get(comp1Name);
    for (const comp2Name of comps) {
      const comp2 = computers.get(comp2Name);
      if (comp1 === comp2) continue;
      if (!comp1.connections.has(comp2)) {
        return false;
      }
    }
  }

  return true;
});

const part02 = validParties.sort((partyA, partyB) => partyB.length - partyA.length)[0];

process.stdout.write(`Part 01: ${lanPartiesOfThree.size}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
