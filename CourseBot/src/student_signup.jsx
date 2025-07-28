import React, { useState } from "react";
import { FaRobot, FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function StudentSignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      setError("Please upload a valid image format (JPEG, PNG, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setFormData({ ...formData, profilePicture: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Enter a valid email.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/student-signup", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

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
      setError(err.message || "Registration failed.");
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
            Create Your Account
          </h1>
          <p className="text-lg text-gray-300">
            Start learning with confidence and build your future.
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Already registered?{" "}
          <Link to="/" className="text-white underline hover:text-[#1d72b8]">
            Login
          </Link>
        </div>
      </div>

      {/* Main Signup Form */}
      <div className="md:w-3/5 p-10 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-6 text-[#1B2430]">
            Student Sign Up
          </h2>
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 font-semibold text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 font-semibold text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="flex justify-center">
              <label className="relative cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-6xl" />
                  )}
                </div>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-1/2 p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-1/2 p-3 border border-gray-300 rounded-md"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#1d72b8] text-white py-3 rounded-md font-semibold shadow-md hover:bg-[#1663a3] transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
