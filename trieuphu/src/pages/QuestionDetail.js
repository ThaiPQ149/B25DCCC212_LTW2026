import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const q = questions.find((item) => item.id === Number(id));

  if (!q) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi.</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Câu hỏi số {q.id} ({LEVELS[q.level]})</h2>
      <p>{q.question}</p>
      {q.options.map((option, i) => (
        <div key={i} className={i === q.answer ? 'option correct' : 'option'}>
          {LETTERS[i]}. {option}
          {i === q.answer && ' (Đáp án đúng)'}
        </div>
      ))}
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;