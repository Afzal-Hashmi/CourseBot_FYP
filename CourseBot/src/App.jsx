import { useState } from "react";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import StudentSignUpPage from "./student_signup";
import TeacherSignUp from "./teacher_signup";
import TeacherDashboard from "./pages/Teacher/teacher_dashboard";
import MyCourses from "./pages/Teacher/my_courses";
import StudentsManagement from "./pages/Teacher/students_management";
import TeacherProfile from "./pages/Teacher/teacher_profile";
import CourseContentPage from "./pages/Teacher/teacher_ai";

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
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-myCourses" element={<MyCourses />} />
          <Route path="/students-management" element={<StudentsManagement />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/teacher-ai" element={<CourseContentPage />} />

          {/* <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
