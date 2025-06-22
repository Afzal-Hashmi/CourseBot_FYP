import React, { useState } from "react";
import { FaRobot, FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const StudentSignUp = () => {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a JPEG, PNG, or GIF image.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setFormData({ ...formData, profilePicture: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, profilePicture: null });
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      (formData.profilePicture);
      if (formData.profilePicture) {
        ("Uploading profile picture:", formData.profilePicture);
        data.append("profilePicture", formData.profilePicture);
      }

      const response = await fetch("http://127.0.0.1:8000/student-signup", {
        method: "POST",
        body: data,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      setSuccess(responseData.message || "Registration successful!");
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Sidebar */}
      <div className="md:w-1/3 bg-gradient-to-b from-gray-900 to-gray-700 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-center shadow-md">
        <div className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-extrabold tracking-tight mb-4 sm:mb-6 animate-fade">
          <FaRobot className="text-blue-500" />
          <span>CourseBot</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 sm:mb-4 tracking-tight">
          Start Your Learning Journey
        </h1>
        <p className="text-sm sm:text-base font-medium">
          Join Thousands of Students and Teachers <strong>Worldwide</strong>
        </p>
        <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold">
          Hello, <strong>Students</strong>! 🎓
        </h2>
      </div>

      {/* Main Content */}
      <div className="md:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full animate-fade">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3 sm:mb-4 tracking-tight">
            Create Account
          </h2>

          {error && (
            <div
              className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-red-100 text-red-700 text-sm sm:text-base font-medium shadow-sm"
              id="error-message"
            >
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-green-100 text-green-700 text-sm sm:text-base font-medium shadow-sm">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4"
            aria-busy={loading}
          >
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-3 sm:mb-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-400" />
                )}
              </div>
              <label className="w-full flex items-center justify-center px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm sm:text-base font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload Profile Picture"
                />
                {imagePreview
                  ? "Change Picture"
                  : "Upload Profile Picture (Optional)"}
              </label>
            </div>

            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                aria-label="First Name"
                aria-describedby="error-message"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                aria-label="Last Name"
                aria-describedby="error-message"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
              aria-label="Email Address"
              aria-describedby="error-message"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base pr-8 sm:pr-10 transition-all duration-200 placeholder-gray-400"
                aria-label="Password"
                aria-describedby="error-message"
              />
              <button
                type="button"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base pr-8 sm:pr-10 transition-all duration-200 placeholder-gray-400"
                aria-label="Confirm Password"
                aria-describedby="error-message"
              />
              <button
                type="button"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Sign Up"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-3 sm:mt-4 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-600 hover:underline font-semibold"
              aria-label="Log In"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp;
