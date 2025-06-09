import React, { useState } from "react";
import { FaRobot, FaEye, FaEyeSlash } from "react-icons/fa";

const TeacherSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/teacher-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(data.message);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-2/5 bg-[#2c3e50] text-white p-8 flex flex-col">
        <div className="text-2xl flex items-center gap-2 mb-12">
          <FaRobot className="text-[#3498db] " /> CourseBot
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Start Your Learning Journey
        </h1>
        <p className="text-lg">
          Join Thousands of Students and Teachers <strong>Worldwide</strong>
        </p>
        <h1 className="mt-6 text-4xl">
          Hello, <strong>Teachers</strong>! 🎓
        </h1>
      </div>

      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Create Account
          </h2>

          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-500">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md mt-3"
            />

            <div className="relative mt-3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md"
              />
              <div
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="relative mt-3">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-md"
              />
              <div
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3498db] text-white py-3 rounded-md text-lg mt-6 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <a href="/" className="text-[#3498db] font-semibold">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignUp;
