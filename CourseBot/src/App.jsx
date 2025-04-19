import { useState } from "react";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import StudentSignUpPage from "./student_signup";
import TeacherSignUp from "./teacher_signup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/student_signup" element={<StudentSignUpPage />} />
          <Route path="/teacher_signup" element={<TeacherSignUp />} />
          {/* <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
