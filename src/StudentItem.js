const StudentItem = ({ student, deleteStudent }) => {
  let rank = "";

  if (student.score >= 8) {rank = "Giỏi";}
  else if (student.score >= 5) { rank = "Đạt";}
  else {rank = "Trượt";}
  return (
    <tr>
      <td>{student.id}</td>
      <td>{student.name}</td>
      <td>{student.score}</td>
      <td>{student.class}</td>
      <td>{rank}</td>
      <td>
        <button onClick={() => {deleteStudent(student.id);}}>
          Xóa
        </button>
      </td>
    </tr>
  );
};
export default StudentItem;