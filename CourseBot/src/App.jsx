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
import TeacherDashboard from "./pages/Teacher/teacher_dashboard";
import MyCourses from "./pages/Teacher/my_courses";
import StudentsManagement from "./pages/Teacher/students_management";
import TeacherProfile from "./pages/Teacher/teacher_profile";
import CourseContentPage from "./pages/Teacher/teacher_ai";
import CourseContentPageStudent from "./pages/student/student_ai";
import Enroll from "./pages/student/student_enroll";
import CourseFeedbackForm from "./pages/student/course_feedback_form";
import Teacher_feedback from "./pages/Teacher/teacher_feedback";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student_signup" element={<StudentSignUpPage />} />
          <Route path="/teacher_signup" element={<TeacherSignUp />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/myCourses" element={<MyCourses />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/enrollments" element={<MyEnrollments />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/enroll" element={<Enroll />} />
          <Route
            path="/teacher/students-management"
            element={<StudentsManagement />}
          />
          <Route path="/teacher/ai/:course_id" element={<CourseContentPage />} />
          <Route path="/teacher/feedback" element={<Teacher_feedback />} />
          <Route
            path="/student/ai/:course_id"
            element={<CourseContentPageStudent />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
