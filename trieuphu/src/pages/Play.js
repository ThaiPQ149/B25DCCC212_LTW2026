import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize, makeAudience } from '../utils';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('answering');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [used, setUsed] = useState({ fifty: false, audience: false });
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);

  const question = questions[index];

  const finish = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({ name: playerName, prize, correctCount });
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  const handleFifty = () => {
    const wrong = [0, 1, 2, 3].filter((i) => i !== question.answer);
    const shuffled = [...wrong].sort(() => Math.random() - 0.5);
    setHidden(shuffled.slice(0, 2));
    setUsed({ ...used, fifty: true });
  };

  const handleAudience = () => {
    setAudience(makeAudience(question.answer, hidden));
    setUsed({ ...used, audience: true });
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
          setHidden([]);
          setAudience(null);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [status]);

  useEffect(() => {
    const handleKey = (e) => {
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i === -1 || status !== 'answering' || hidden.includes(i)) return;
      handleSelect(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, hidden]);

  useEffect(() => {
    document.title = `Câu ${index + 1}/${questions.length} – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index]);

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <Lifelines
          used={used}
          disabled={status !== 'answering'}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onQuit={() => finish(index, 'quit')}
        />
        {audience && <AudienceChart percents={audience} />}
        <QuestionCard
          question={question}
          index={index}
          total={questions.length}
          status={status}
          selected={selected}
          hidden={hidden}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

export default Play;