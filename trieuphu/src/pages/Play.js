import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('answering');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];

  const finish = (correctCount, reason) => {
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        prize: calcPrize(correctCount, reason),
        correctCount,
        reason,
      },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  useEffect(() => {
    if (status !== 'answering') return;
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [status, index]);

  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      finish(index, 'timeout');
    }
  }, [timeLeft]);

  useEffect(() => {
    if (status === 'locked') {
      const t = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(t);
    }
    if (status === 'revealed') {
      const t = setTimeout(() => {
        if (selected !== question.answer) {
          finish(index, 'wrong');
        } else if (index === questions.length - 1) {
          finish(questions.length, 'win');
        } else {
          setIndex(index + 1);
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          question={question}
          index={index}
          total={questions.length}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

export default Play;