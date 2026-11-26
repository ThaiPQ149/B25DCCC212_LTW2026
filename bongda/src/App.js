import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from './hooks/useFetch';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import { RESULT_LABELS, ROUNDS } from './data';
import { calcMatchStats, calcStandings, getResult, getTeamName, isValidGoals } from './utils';

const BUILD_TAG = 'LTW2026-TH03';

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const { data, loading, error } = useFetch('/data/matches.json');
  const [round, setRound] = useState('all');

  useEffect(() => {
    if (data) dispatch(setMatches(data));
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const visibleMatches = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );
  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);
  const leader = matches.length > 0 ? standings[0] : null;

  const handleGoals = (match, side, e) => {
    const n = e.target.valueAsNumber;
    if (!isValidGoals(n)) return;
    dispatch(
      setGoals({
        id: match.id,
        homeGoals: side === 'home' ? n : match.homeGoals,
        awayGoals: side === 'away' ? n : match.awayGoals,
      })
    );
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  return (
    <div className={`app ${theme === 'dark' ? 'dark' : 'light'}`} data-build={BUILD_TAG}>
      <header className="header">
        <h1>Giải bóng đá khoa</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
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
                          <button type="button" onClick={() => handleRemove(m)}>
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

          <AddMatchForm />
          <GoalPlanner standings={standings} />
        </main>
      )}
    </div>
  );
};

export default App;