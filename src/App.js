import {useState} from 'react';
import StudentList from './StudentList';

const App = () => {
    const [students, setStudents] = useState([
        {
        id: 1,
        name: "Phạm Hoài An",
        score: 8,
        class: "D25CQCC02-B"
        },
        {
        id: 2,
        name: "Nguyễn Nhật Minh",
        score: 9,
        class: "D25CQCC02-B"
        },
        {
        id: 3,
        name: "Trần Thu Hồng",
        score: 10,
        class: "D25CQCC02-B"
        } 
    ]);
    const [name, setName] = useState("");
    const [score, setScore] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [filter, setFilter] = useState("all");
    
    const addStudent = () => {
        if (name.trim() === "") {
            alert("Vui lòng nhập tên sinh viên");
            return;
        }
        if (studentClass.trim() === "") {
            alert("Nhập lớp của sinh viên");
            return;
        }
        if (score.trim() === "" || isNaN(score) || score < 0 || score > 10) {
            alert("Nhập điểm");
            return;
        }

        const studentScore = Number(score);
        const newStudent = {
            id: students.length + 1,
            name: name,
            score: studentScore,
            class: studentClass
        };
        setStudents([...students, newStudent]);
        setName("");
        setScore("");
        setStudentClass("");
    };

    const deleteStudent = (id) => {
        const newStudents = students.filter(student => {
            return student.id !== id;
        });
        setStudents(newStudents);
    }

    const getFilteredStudents = () => {
        if (filter === "tot") {
            return students.filter(student => {
                return student.score >= 8;
            });
        }
        else if (filter === "truot mon") {
            return students.filter(student => {
                return student.score < 5;
            });
        }
        return students;
    };
    
    const filteredStudents = getFilteredStudents();
    const totalScore = students.reduce((total, student) => {
        return total + student.score;
    }, 0);

    let averageScore = 0;
    if (students.length > 0) {
        averageScore = totalScore / students.length;
    }



    return (
    <div>
      <h1>Quản Lí Điểm Sinh Viên</h1>

      <h2>Thêm sinh viên</h2>

      <div>
        <label>Họ tên: </label>
        <input
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          placeholder="Nhập họ tên"
        />
      <br />

        <label>Điểm: </label>
        <input
          type="number"
          value={score}
          onChange={(event) => {
            setScore(event.target.value);
          }}
          placeholder="Nhập điểm"
        />
      <br />

        <label>Lớp: </label>
        <input
          type="text"
          value={studentClass}
          onChange={(event) => {
            setStudentClass(event.target.value);
          }}
          placeholder="Nhập lớp"
        />
      </div>
      <br />

      <button onClick={addStudent}>
        Thêm
      </button>

      <h2>Lọc sinh viên</h2>

      <button onClick={() => {setFilter("all");}}>
        Tất cả
      </button>

      <button onClick={() => {setFilter("tot");}}>
        Sinh viên Giỏi
      </button>

      <button onClick={() => {setFilter("truot mon");}}>
        Sinh viên trượt
      </button>

      <h2>Thống kê</h2>

      <p>
        Tổng số sinh viên: {students.length}
      </p>

      <p>
        Điểm trung bình: {averageScore.toFixed(2)}
      </p>

      <StudentList
        students={filteredStudents}
        deleteStudent={deleteStudent}/>
    </div>
  );
}

export default App;