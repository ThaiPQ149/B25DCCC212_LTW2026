import { TEAMS, POINTS, MAX_GOALS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === id);
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  const rows = TEAMS.map((team) => ({
    teamId: team.id,
    name: team.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));
  const byId = new Map(rows.map((row) => [row.teamId, row]));

  matches.forEach((match) => {
    const home = byId.get(match.home);
    const away = byId.get(match.away);
    if (!home || !away) return;
    home.played += 1;
    away.played += 1;
    home.gf += match.homeGoals;
    home.ga += match.awayGoals;
    away.gf += match.awayGoals;
    away.ga += match.homeGoals;
    const result = getResult(match);
    if (result === 'home') {
      home.won += 1;
      away.lost += 1;
      home.points += POINTS.win;
      away.points += POINTS.loss;
    } else if (result === 'away') {
      away.won += 1;
      home.lost += 1;
      away.points += POINTS.win;
      home.points += POINTS.loss;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  });

  rows.forEach((row) => {
    row.diff = row.gf - row.ga;
  });

  return [...rows].sort(
    (a, b) =>
      b.points - a.points ||
      b.diff - a.diff ||
      b.gf - a.gf ||
      a.name.localeCompare(b.name, 'vi')
  );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;
  matches.forEach((match) => {
    counts[getResult(match)] += 1;
    goals += match.homeGoals + match.awayGoals;
  });
  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};

const GOALS_ERROR = 'Số bàn thắng phải là số nguyên từ 0 đến 20';

export const validateMatch = (values, matches) => {
  const errors = {};
  const home = Number(values.home);
  const away = Number(values.away);

  if (values.home === '') errors.home = 'Hãy chọn đội nhà';
  if (values.away === '') {
    errors.away = 'Hãy chọn đội khách';
  } else if (values.home !== '' && home === away) {
    errors.away = 'Hai đội phải khác nhau';
  } else if (
    values.home !== '' &&
    matches.some(
      (m) => (m.home === home && m.away === away) || (m.home === away && m.away === home)
    )
  ) {
    errors.away = 'Hai đội đã đá với nhau rồi';
  }

  ['homeGoals', 'awayGoals'].forEach((field) => {
    const text = values[field].trim();
    if (text === '' || !isValidGoals(Number(text))) errors[field] = GOALS_ERROR;
  });
  return errors;
};

export const pickVisibleErrors = (errors, values, submitted) => {
  if (submitted) return errors;
  if (values.home !== '' && values.away !== '' && errors.away) return { away: errors.away };
  return {};
};

const INT_PATTERN = /^\d+$/;

export const calcNeeded = (standings, teamId, target, remaining) => {
  const row = standings.find((r) => String(r.teamId) === teamId);
  const targetText = String(target).trim();
  const remainingText = String(remaining).trim();
  const targetOk = INT_PATTERN.test(targetText);
  const remainingOk = INT_PATTERN.test(remainingText) && Number(remainingText) >= 1;

  if (!row || !targetOk || !remainingOk) {
    return 'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';
  }

  const need = Number(targetText) - row.points;
  const left = Number(remainingText);

  if (need <= 0) return 'Đội đã đạt mục tiêu';
  if (need > 3 * left) return 'Không thể đạt mục tiêu này';
  const wins = Math.max(0, Math.ceil((need - left) / 2));
  return `Cần thêm ${need} điểm ở ${left} trận còn lại, tối thiểu ${wins} trận thắng`;
};