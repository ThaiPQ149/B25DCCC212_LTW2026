import StudentItem from "./StudentItem";

const StudentList = ({ students, deleteStudent }) => {
  return (
    <div>
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Không có sinh viên nào.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Điểm</th>
              <th>Lớp</th>
              <th>Xếp loại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentItem
                key={student.id}
                student={student}
                deleteStudent={deleteStudent}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default StudentList;