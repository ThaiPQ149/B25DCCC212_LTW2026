import { MILESTONES, PRIZES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'quit') return correctCount === 0 ? 0 : PRIZES[correctCount - 1];
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length === 0 ? 0 : PRIZES[Math.max(...passed) - 1];
};
const splitRandom = (total, count) => {
  const parts = [];
  let left = total;
  for (let i = 0; i < count - 1; i++) {
    const p = Math.floor(Math.random() * (left + 1));
    parts.push(p);
    left -= p;
  }
  parts.push(left);
  return parts;
};

export const makeAudience = (correctIndex, hidden) => {
  const wrong = [0, 1, 2, 3].filter((i) => i !== correctIndex && !hidden.includes(i));
  const min = wrong.length === 1 ? 51 : 40;
  const correctPercent = min + Math.floor(Math.random() * (71 - min));
  let parts;
  do {
    parts = splitRandom(100 - correctPercent, wrong.length);
  } while (Math.max(...parts) >= correctPercent);

  const result = [0, 0, 0, 0];
  result[correctIndex] = correctPercent;
  wrong.forEach((idx, k) => {
    result[idx] = parts[k];
  });
  return result;
};