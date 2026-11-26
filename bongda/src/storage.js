const KEY = 'ltw_bongda_matches';

const isMatch = (m) =>
  m !== null &&
  typeof m === 'object' &&
  ['id', 'round', 'home', 'away', 'homeGoals', 'awayGoals'].every((k) => Number.isInteger(m[k]));

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isMatch) ? parsed : null;
  } catch (err) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(matches));
  } catch (err) {
  }
};