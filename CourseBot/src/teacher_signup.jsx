import React, { useState } from "react";
import { FaRobot, FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function TeacherSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG or GIF allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setFormData({ ...formData, profilePicture: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
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
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const res = await fetch("http://127.0.0.1:8000/teacher-signup", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Signup failed");

      setSuccess("Registration successful!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
      });
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            Inspire Future Minds
          </h1>
          <p className="text-lg text-gray-300">
            Empower students and create meaningful learning experiences.
          </p>
        </div>
        <div className="text-sm mt-6 text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-white hover:underline font-semibold">
            Log In
          </Link>
        </div>
      </div>

      {/* Main Form */}
      <div className="md:w-3/5 p-10 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-6 text-[#1B2430]">
            Teacher Sign Up
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-sm font-semibold">
              {success}
            </div>
          )}

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden shadow">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 text-5xl" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-center text-sm text-[#1d72b8] mt-2 hover:underline">
                {imagePreview ? "Change" : "Upload"} Picture
              </div>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-1/2 p-3 border-2 border-gray-300 rounded-md shadow-sm"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-1/2 p-3 border-2 border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1d72b8] hover:bg-[#1663a3] text-white py-3 rounded-md font-semibold shadow-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
