import { useState } from "react";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import StudentSignUpPage from "./student_signup";
import TeacherSignUp from "./teacher_signup";
import StudentDashboard from "./pages/student/student_dashboard";
import StudentCourses from "./pages/student/student_courses";
import MyEnrollments from "./pages/student/student_enrollments";
import StudentProfile from "./pages/student/student_profile";

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
          {/* {/* <Route path="/teacher-dashboard" element={<TeacherDashboard />} /> */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-courses" element={<StudentCourses />} />
          <Route path="/student-enrollments" element={<MyEnrollments />} />
          <Route path="/student-profile" element={<StudentProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
