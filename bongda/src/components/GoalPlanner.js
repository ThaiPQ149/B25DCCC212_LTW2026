import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGoal, setRemaining, setTarget, setTeamId } from '../features/goalSlice';
import { TEAMS } from '../data';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const dispatch = useDispatch();
  const { teamId, target, remaining } = useSelector(selectGoal);

  const message = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <section>
      <h2>Mục tiêu điểm</h2>
      <div className="filters">
        <label htmlFor="goal-team">Đội của bạn</label>
        <select id="goal-team" value={teamId} onChange={(e) => dispatch(setTeamId(e.target.value))}>
          {TEAMS.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.name}
            </option>
          ))}
        </select>

        <label htmlFor="goal-target">Số điểm mục tiêu</label>
        <input
          id="goal-target"
          type="number"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />

        <label htmlFor="goal-remaining">Số trận còn lại</label>
        <input
          id="goal-remaining"
          type="number"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>
      <p>{message}</p>
    </section>
  );
};

export default GoalPlanner;