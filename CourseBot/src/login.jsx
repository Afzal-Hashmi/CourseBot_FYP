import React, { useState, useEffect } from "react";
import { FaRobot, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import Cookies from "js-cookie";

export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;
    if (token && role == "student" && user) {
      navigate("/student/dashboard");
      return;
    }
  }, [navigate]);

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
        Cookies.set("role", data.data.roles, { path: "/", expires: 30 / 1440 });

        navigate(
          data.data.roles === "teacher"
            ? "/teacher/dashboard"
            : "/student/dashboard"
        );
      } else {
        setLoading(false);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="md:w-2/5 bg-[#1B2430] text-white p-10 flex flex-col justify-between shadow-xl">
        <div>
          <div className="text-3xl flex items-center gap-2 mb-10 font-bold tracking-wide">
            <FaRobot className="text-[#1d72b8]" /> CourseBot
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-snug">
            Learn Smarter, Not Harder.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Personalized learning with the power of AI.
            <br />
            Your journey starts here.
          </p>
        </div>

        {/* <div className="flex items-center gap-5 mt-10">
          <span className="text-sm">Connect with us:</span>
          <FaFacebook className="text-xl text-gray-400 hover:text-white cursor-pointer transition" />
          <FaTwitter className="text-xl text-gray-400 hover:text-white cursor-pointer transition" />
          <FaLinkedin className="text-xl text-gray-400 hover:text-white cursor-pointer transition" />
        </div> */}
      </div>

      {/* Main Login Form */}
      <div className="md:w-3/5 p-10 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-8 text-[#1B2430]">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d72b8] focus:outline-none transition"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d72b8] focus:outline-none transition"
              required
            />

            <button
              type="submit"
              className="w-full bg-[#1d72b8] text-white py-3 rounded-md font-semibold shadow hover:bg-[#155a96] transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/student_signup"
              className="text-[#1d72b8] font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>

          {/* Google Login */}
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG5FqrS9OkN5XrA5_GXcN7OV-SoLIl0KPwoQ&s"
                alt="Google"
                className="h-5"
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
