import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import useLocalStorage from './hooks/useLocalStorage';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { hasSaved } from './store';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import { RESULT_LABELS, ROUNDS } from './data';
import { calcMatchStats, calcStandings, getTeamName } from './utils';

const BUILD_TAG = 'LTW2026-TH03';
const BASE_TITLE = 'Giải bóng đá khoa';

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const { data, loading, error } = useFetch('/data/matches.json');
  const [round, setRound] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    if (data && !hasSaved) dispatch(setMatches(data));
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const leader = matches.length > 0 ? standings[0] : null;
  const leaderName = leader ? leader.name : null;

  useEffect(() => {
    document.title = leaderName ? `${leaderName} dẫn đầu – ${BASE_TITLE}` : BASE_TITLE;
  }, [leaderName]);

  const roundMatches = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );
  const keyword = debouncedSearch.trim().toLowerCase();
  const visibleMatches = useMemo(
    () =>
      keyword === ''
        ? roundMatches
        : roundMatches.filter(
            (m) =>
              getTeamName(m.home).toLowerCase().includes(keyword) ||
              getTeamName(m.away).toLowerCase().includes(keyword)
          ),
    [roundMatches, keyword]
  );
  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const handleTeamShift = (e) => setSearch(e.target.value);

  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => dispatch(setGoals({ id, homeGoals, awayGoals })),
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleReset = () => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };

  const waiting = !hasSaved && loading;
  const failed = !hasSaved && !loading && Boolean(error);

  return (
    <div className={`app ${theme === 'dark' ? 'dark' : 'light'}`} data-build={BUILD_TAG}>
      <header className="header">
        <h1>Giải bóng đá khoa</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      {waiting && <p>Đang tải lịch thi đấu...</p>}
      {failed && <p>Không thể tải được lịch thi đấu</p>}

      {!waiting && !failed && (
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
            <h3>Phân bố kết quả</h3>
            <ul>
              {Object.entries(RESULT_LABELS).map(([key, label]) => (
                <li key={key}>
                  {`${label}: ${stats.counts[key]}`}
                  <span className="bar" style={{ width: `${24 * stats.counts[key]}px` }} />
                </li>
              ))}
            </ul>
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

              <label htmlFor="team-search">Tìm đội</label>
              <input
                id="team-search"
                type="text"
                ref={searchRef}
                value={search}
                onChange={handleTeamShift}
              />
              {keyword !== '' && <span>{`Tìm thấy ${visibleMatches.length} trận`}</span>}
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
                    <th>Số lần render</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleMatches.map((m) => (
                    <MatchRow key={m.id} match={m} onGoals={handleGoals} onRemove={handleRemove} />
                  ))}
                </tbody>
              </table>
            )}

            <p>
              <button type="button" onClick={handleReset} disabled={!data}>
                Đặt lại dữ liệu mẫu
              </button>
            </p>
          </section>

          <AddMatchForm />
          <GoalPlanner standings={standings} />
        </main>
      )}
    </div>
  );
};

export default App;