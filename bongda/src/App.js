import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import useFetch from './hooks/useFetch';
import matchesReducer from './matchesReducer';
import StandingsTable from './components/StandingsTable';
import { RESULT_LABELS, ROUNDS, TEAMS } from './data';
import {
  calcMatchStats,
  calcStandings,
  getResult,
  getTeamName,
  isValidGoals,
  pickVisibleErrors,
  validateMatch,
} from './utils';

const BUILD_TAG = 'LTW2026-TH03';

const initialValues = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const App = () => {
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const { data, loading, error } = useFetch('/data/matches.json');
  const [round, setRound] = useState('all');
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const homeRef = useRef(null);

  useEffect(() => {
    if (data) dispatch({ type: 'LOAD', payload: data });
  }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const visibleMatches = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );
  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);
  const leader = matches.length > 0 ? standings[0] : null;

  const errors = pickVisibleErrors(validateMatch(values, matches), values, submitted);

  const handleGoals = (match, side, e) => {
    const n = e.target.valueAsNumber;
    if (!isValidGoals(n)) return;
    dispatch({
      type: 'SET_GOALS',
      payload: {
        id: match.id,
        homeGoals: side === 'home' ? n : match.homeGoals,
        awayGoals: side === 'away' ? n : match.awayGoals,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateMatch(values, matches)).length > 0) return;
    dispatch({
      type: 'ADD',
      payload: {
        round: Number(values.round),
        home: Number(values.home),
        away: Number(values.away),
        homeGoals: Number(values.homeGoals),
        awayGoals: Number(values.awayGoals),
      },
    });
    setValues(initialValues);
    setSubmitted(false);
    homeRef.current.focus();
  };

  return (
    <div className="app light" data-build={BUILD_TAG}>
      <header className="header">
        <h1>Giải bóng đá khoa</h1>
      </header>

      {loading && <p>Đang tải lịch thi đấu...</p>}
      {!loading && error && <p>Không thể tải được lịch thi đấu</p>}

      {!loading && !error && (
        <main>
          <section>
            <h2>Bảng xếp hạng</h2>
            <StandingsTable standings={standings} />
          </section>

          <section>
            <h2>Thống kê</h2>
            <p>{`Số trận: ${stats.count}`}</p>
            <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
            <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
            <p>{`Đội dẫn đầu: ${leader ? `${leader.name} (${leader.points} điểm)` : '—'}`}</p>
          </section>

          <section>
            <h2>Lịch thi đấu</h2>
            <div className="filters">
              <label htmlFor="round-filter">Xem vòng</label>
              <select id="round-filter" value={round} onChange={(e) => setRound(e.target.value)}>
                <option value="all">Tất cả vòng</option>
                {ROUNDS.map((r) => (
                  <option key={r} value={String(r)}>
                    {`Vòng ${r}`}
                  </option>
                ))}
              </select>
            </div>

            {visibleMatches.length === 0 ? (
              <p>Chưa có trận đấu nào</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vòng</th>
                    <th>Đội nhà</th>
                    <th>BT nhà</th>
                    <th>BT khách</th>
                    <th>Đội khách</th>
                    <th>Kết quả</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleMatches.map((m) => {
                    const homeName = getTeamName(m.home);
                    const awayName = getTeamName(m.away);
                    const result = getResult(m);
                    return (
                      <tr key={m.id} className={result === 'draw' ? 'draw' : undefined}>
                        <td>{m.round}</td>
                        <td>{homeName}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
                            value={m.homeGoals}
                            onChange={(e) => handleGoals(m, 'home', e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
                            value={m.awayGoals}
                            onChange={(e) => handleGoals(m, 'away', e)}
                          />
                        </td>
                        <td>{awayName}</td>
                        <td>{RESULT_LABELS[result]}</td>
                        <td>
                          <button type="button" onClick={() => dispatch({ type: 'REMOVE', payload: m.id })}>
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2>Thêm trận đấu</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="add-round">Vòng</label>
                <select id="add-round" name="round" value={values.round} onChange={handleChange}>
                  {ROUNDS.map((r) => (
                    <option key={r} value={String(r)}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="add-home">Đội nhà</label>
                <select id="add-home" name="home" ref={homeRef} value={values.home} onChange={handleChange}>
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((t) => (
                    <option key={t.id} value={String(t.id)}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.home && <span role="alert" className="error">{errors.home}</span>}
              </div>
              <div className="field">
                <label htmlFor="add-away">Đội khách</label>
                <select id="add-away" name="away" value={values.away} onChange={handleChange}>
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((t) => (
                    <option key={t.id} value={String(t.id)}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.away && <span role="alert" className="error">{errors.away}</span>}
              </div>
              <div className="field">
                <label htmlFor="add-home-goals">Bàn thắng đội nhà</label>
                <input id="add-home-goals" name="homeGoals" type="number" min="0" max="20" value={values.homeGoals} onChange={handleChange} />
                {errors.homeGoals && <span role="alert" className="error">{errors.homeGoals}</span>}
              </div>
              <div className="field">
                <label htmlFor="add-away-goals">Bàn thắng đội khách</label>
                <input id="add-away-goals" name="awayGoals" type="number" min="0" max="20" value={values.awayGoals} onChange={handleChange} />
                {errors.awayGoals && <span role="alert" className="error">{errors.awayGoals}</span>}
              </div>
              <button type="submit">Thêm trận</button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;