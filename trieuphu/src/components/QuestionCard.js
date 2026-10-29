import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({ question, index, total, status, selected, hidden = [], onSelect }) => {
  const getState = (i) => {
    if (status === 'locked' && i === selected) return 'locked';
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  return (
    <div>
      <h3>Câu {index + 1}/{total}</h3>
      <p className="question-text">{question.question}</p>
      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            hidden={hidden.includes(i)}
            disabled={status !== 'answering'}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;