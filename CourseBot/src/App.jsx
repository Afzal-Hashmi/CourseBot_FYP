import { useState } from "react";
import Login from "./login";
import SignUpPage from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
