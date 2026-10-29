import { MILESTONES, PRIZES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'quit') return correctCount === 0 ? 0 : PRIZES[correctCount - 1];
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length === 0 ? 0 : PRIZES[Math.max(...passed) - 1];
};