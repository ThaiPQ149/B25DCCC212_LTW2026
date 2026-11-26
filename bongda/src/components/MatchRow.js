import { memo, useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getResult, getTeamName, isValidGoals } from '../utils';

const MatchRow = ({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);
  const result = getResult(match);

  const handleHome = (e) => {
    const n = e.target.valueAsNumber;
    if (isValidGoals(n)) onGoals(match.id, n, match.awayGoals);
  };
  const handleAway = (e) => {
    const n = e.target.valueAsNumber;
    if (isValidGoals(n)) onGoals(match.id, match.homeGoals, n);
  };

  return (
    <tr className={result === 'draw' ? 'draw' : undefined}>
      <td>{match.round}</td>
      <td>{homeName}</td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
          value={match.homeGoals}
          onChange={handleHome}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
          value={match.awayGoals}
          onChange={handleAway}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td>{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default memo(MatchRow);