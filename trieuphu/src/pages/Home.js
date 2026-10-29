import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const best = history.reduce((b, h) => (!b || h.prize > b.prize ? h : b), null);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/play');
  };

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      {best && <p>Kỷ lục: {formatMoney(best.prize)} – {best.name}</p>}
      <ul>
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm, mỗi câu có 30 giây.</li>
        <li>Trả lời đúng thì lên bậc tiền thưởng tiếp theo, câu 15 trị giá 250.000.000 đ.</li>
        <li>Câu 5, 10, 15 là các mốc an toàn.</li>
        <li>Trả lời sai hoặc hết giờ chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </label>{' '}
        <button type="submit" disabled={playerName.trim() === ''}>Bắt đầu</button>
      </form>
    </div>
  );
};

export default Home;