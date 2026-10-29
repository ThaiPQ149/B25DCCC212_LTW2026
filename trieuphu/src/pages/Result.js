import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const MESSAGES = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  quit: 'Bạn đã dừng cuộc chơi',
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" replace />;

  return (
    <div>
      <h2>{MESSAGES[state.reason]}</h2>
      <p>Người chơi: {state.name}</p>
      <p>Số câu trả lời đúng: {state.correctCount}</p>
      <p>Tiền thưởng: {formatMoney(state.prize)}</p>
      <div className="result-buttons">
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;