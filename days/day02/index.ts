// https://adventofcode.com/2024/day/2
// Day 2: Red-Nosed Reports

import path from 'node:path';

import { readInput } from '../../common/index';

const reports = readInput(path.join(__dirname, 'input01'), '\n').map((row) => row.split(' ').map(Number));

function isReportSafe(report: number[]): boolean {
  let isIncreasing = true;
  let isDecreasing = true;
  for (let i = 1; i < report.length; i++) {
    const increasingDiff = report[i] - report[i - 1];
    const decreasingDiff = report[i - 1] - report[i];

    isIncreasing = isIncreasing && increasingDiff > 0 && increasingDiff < 4;
    isDecreasing = isDecreasing && decreasingDiff > 0 && decreasingDiff < 4;

    if (isDecreasing === false && isIncreasing === false) {
      break;
    }
  }

  return isDecreasing || isIncreasing;
}

const safeReports = reports.reduce<number>((safeReportsCount, report) => {
  return isReportSafe(report) ? safeReportsCount + 1 : safeReportsCount;
}, 0);

const reportsWithVariants = reports.map((report) => {
  const reportVariants = [];

  for (let i = 0; i < report.length; i++) {
    reportVariants.push(report.toSpliced(i, 1));
  }

  return reportVariants;
});

const safeReportsWithTolerance = reportsWithVariants.reduce<number>((safeReportsCount, reportWithVariants) => {
  const isAnyReportSafe = reportWithVariants.some((report) => isReportSafe(report));

  return isAnyReportSafe ? safeReportsCount + 1 : safeReportsCount;
}, 0);

process.stdout.write(`Part 01: ${safeReports}\n`);
process.stdout.write(`Part 02: ${safeReportsWithTolerance}\n`);
