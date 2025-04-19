import React, { useState } from "react";
import {
  FaRobot,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./index.css"; // TailwindCSS is assumed to be set up

export default function Login() {
  const [role, setRole] = useState("student");

  const handleLogin = () => {
    if (role === "teacher") {
      window.location.href = "/teacher-dashboard";
    } else {
      window.location.href = "/student-dashboard";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-2/5 bg-[#2c3e50] text-white p-8 flex flex-col">
        <div className="text-2xl flex items-center gap-2 mb-12">
          <FaRobot className="text-blue-400" /> CourseBot
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Customize Your Learning Experience
        </h1>
        <p className="text-lg">
          Making Education Better <strong>Inside and Out</strong>
        </p>

        <div className="mt-8">
          <button
            className={`flex items-center gap-2 w-full p-4 border-2 rounded mb-2 transition-all ${
              role === "student"
                ? "bg-[#3498db] border-blue-500"
                : "border-white"
            } text-white`}
            onClick={() => setRole("student")}
          >
            <FaUserGraduate /> STUDENT
          </button>
          <button
            className={`flex items-center gap-2 w-full p-4 border-2 rounded transition-all ${
              role === "teacher"
                ? "bg-[#3498db] border-blue-500"
                : "border-white"
            } text-white`}
            onClick={() => setRole("teacher")}
          >
            <FaChalkboardTeacher /> TEACHER
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-3/5 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-semibold mb-6">Sign In</h2>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border-2 border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border-2 border-gray-300 rounded"
              required
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                Remember username
              </label>
              <a href="#" className="text-blue-500">
                Forgot Password?
              </a>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[#3498db] text-white py-3 rounded font-semibold"
            >
              Log In
            </button>

            <div className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/student_signup" className="text-[#3498db] font-bold">
                Sign Up
              </Link>
            </div>
          </form>

          <div className="flex items-center gap-4 mt-8">
            <span>Follow Us:</span>
            <a href="#">
              <FaFacebook className="text-xl text-gray-700" />
            </a>
            <a href="#">
              <FaTwitter className="text-xl text-gray-700" />
            </a>
            <a href="#">
              <FaLinkedin className="text-xl text-gray-700" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
