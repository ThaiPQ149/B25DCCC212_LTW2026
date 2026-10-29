import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [level, setLevel] = useState('0');
  const [query, setQuery] = useState('');

  const handleQueryShift = (e) => setQuery(e.target.value);

  const filtered = questions.filter(
    (q) =>
      (level === '0' || q.level === Number(level)) &&
      q.question.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="0">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>
        <input
          type="text"
          placeholder="Tìm theo nội dung câu hỏi"
          value={query}
          onChange={handleQueryShift}
        />
      </div>
      <p>Có {filtered.length} câu hỏi</p>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;