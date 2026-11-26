import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { ROUNDS, TEAMS } from '../data';
import { getTeamName, pickVisibleErrors, validateMatch } from '../utils';

const initialValues = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const AddMatchForm = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const showNotice = useNotice();
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const homeRef = useRef(null);

  const errors = pickVisibleErrors(validateMatch(values, matches), values, submitted);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateMatch(values, matches)).length > 0) return;

    const home = Number(values.home);
    const away = Number(values.away);
    dispatch(
      addMatch({
        round: Number(values.round),
        home,
        away,
        homeGoals: Number(values.homeGoals),
        awayGoals: Number(values.awayGoals),
      })
    );
    showNotice(`Đã thêm trận ${getTeamName(home)} - ${getTeamName(away)}`);
    setValues(initialValues);
    setSubmitted(false);
    homeRef.current.focus();
  };

  return (
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
          <input
            id="add-home-goals"
            name="homeGoals"
            type="number"
            min="0"
            max="20"
            value={values.homeGoals}
            onChange={handleChange}
          />
          {errors.homeGoals && <span role="alert" className="error">{errors.homeGoals}</span>}
        </div>

        <div className="field">
          <label htmlFor="add-away-goals">Bàn thắng đội khách</label>
          <input
            id="add-away-goals"
            name="awayGoals"
            type="number"
            min="0"
            max="20"
            value={values.awayGoals}
            onChange={handleChange}
          />
          {errors.awayGoals && <span role="alert" className="error">{errors.awayGoals}</span>}
        </div>

        <button type="submit">Thêm trận</button>
      </form>
    </section>
  );
};

export default AddMatchForm;