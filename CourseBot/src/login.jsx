import React, { useState } from "react";
import {
  FaRobot,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import Cookies from "js-cookie";

export default function Login() {
  const [role, setRole] = useState("student");
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();
      if (data.succeeded) {
        Cookies.set("token", data.data.token, {
          path: "/",
          expires: 30 / 1440,
        });
        Cookies.set("user", JSON.stringify(data.data), {
          path: "/",
          expires: 30 / 1440,
        });
        Cookies.set("role", data.data.roles, {
          path: "/",
          expires: 30 / 1440,
        });
        if (data.data.roles == "teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        setLoading(false);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/login";
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
          {error && (
            <div className="mb-4 text-red-500 text-sm font-semibold">
              {error}
            </div>
          )}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              type="submit"
              className="w-full bg-[#3498db] text-white py-3 rounded font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/student_signup" className="text-[#3498db] font-bold">
                Sign Up
              </Link>
            </div>
          </form>
          <button
            onClick={handleGoogleLogin}
            className="w-1/2 flex items-center justify-center ml-auto mr-auto gap-2 border py-2 rounded hover:bg-gray-50"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG5FqrS9OkN5XrA5_GXcN7OV-SoLIl0KPwoQ&s"
              alt="Google"
              class="h-5"
            />
            Continue with Google
          </button>

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
