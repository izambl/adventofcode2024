// https://adventofcode.com/2024/day/5
// Day 5: Print Queue

import path from 'node:path';
import _ from 'lodash';

import { readInput } from '../../common/index';

const [orderInput, pagesInput] = readInput(path.join(__dirname, 'input01'), '\n\n');

const rules = orderInput.split('\n').map((pair) => pair.split('|'));
const updates = pagesInput.split('\n').map((pair) => pair.split(','));

function findFirstElement(rules: string[][]): string | null {
  const leftElements = new Set(rules.map((orderElement) => orderElement[0]));
  const rightElements = new Set(rules.map((orderElement) => orderElement[1]));

  for (const leftElement of leftElements) {
    if (!rightElements.has(leftElement)) {
      return leftElement;
    }
  }

  return null;
}

function orderRuleSet(rules: string[][]): string[] {
  let ruleSet: string[][] = JSON.parse(JSON.stringify(rules));
  const orderedPages: string[] = [];

  while (ruleSet.length !== 0) {
    const firstElement = findFirstElement(ruleSet);
    orderedPages.push(firstElement);

    ruleSet = ruleSet.filter((orderElement) => orderElement[0] !== firstElement);
  }

  return orderedPages;
}

let part01Sum = 0;
let part02Sum = 0;

for (const update of updates) {
  const ruleSet = rules.filter((rule) => update.includes(rule[0]) && update.includes(rule[1]));

  const orderedPages = orderRuleSet(ruleSet);

  const [toSort] = _.difference(update, orderedPages);
  const rulesForElement = rules.filter((rule) => rule[0] === toSort || rule[1] === toSort);

  const fullOrderedPages = [...new Set([...orderRuleSet([...ruleSet, ...rulesForElement]), toSort])];

  const sortedUpdate = fullOrderedPages.filter((element) => update.includes(element));

  if (sortedUpdate.join('') === update.join('')) {
    part01Sum += Number(update[Math.floor(update.length / 2)]);
  } else {
    part02Sum += Number(sortedUpdate[Math.floor(sortedUpdate.length / 2)]);
  }
}

process.stdout.write(`Part 01: ${part01Sum}\n`);
process.stdout.write(`Part 02: ${part02Sum}\n`);
