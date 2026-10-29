import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ current }) => (
  <ul className="ladder">
    {PRIZES.map((prize, i) => {
      let className = '';
      if (MILESTONES.includes(i + 1)) className += 'milestone ';
      if (i === current) className += 'active';
      return (
        <li key={i} className={className}>
          {i + 1}. {formatMoney(prize)}
        </li>
      );
    })}
  </ul>
);

export default MoneyLadder;