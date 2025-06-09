import React, { useState, useEffect } from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaUserEdit,
  FaLock,
  FaBell,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import TeacherSidebar from "./teacher_sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const TeacherProfile = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [updateProfile, setUpdateProfile] = useState([]);

  const [user, setUser] = useState({});

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!token || role !== "teacher") {
      navigate("/");
    }
    setUser(user);
  }, []);
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can send the updated user data to your backend API
    // using fetch or axios
    // Example:
    // fetch("/api/update-profile", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(user), });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProfile((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="relative">
              <img
                src="https://via.placeholder.com/150"
                className="w-36 h-36 rounded-full border-4 border-blue-500 object-cover"
                alt="Profile"
              />
              <div className="relative mt-4">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                  <FaCamera />
                  <span>Change Photo</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  // onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {user.firstName?.charAt(0).toUpperCase() +
                  user.firstName?.slice(1) +
                  " " +
                  user.lastName?.charAt(0).toUpperCase() +
                  user.lastName?.slice(1)}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaUserEdit />
              <span>Personal Information</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                  value={user.firstName}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  value={user.lastName}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={user.email}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaLock />
              <span>Security Settings</span>
            </h2>
            <form>
              <div className="mb-6 relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mb-6 relative">
                <label className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mb-6 relative">
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaBell />
              <span>Notification Preferences</span>
            </h2>
            <form>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="course-updates"
                  defaultChecked
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                />
                <label htmlFor="course-updates" className="ml-2 text-gray-700">
                  Course Updates
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="enrollment-notifications"
                  defaultChecked
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                />
                <label
                  htmlFor="enrollment-notifications"
                  className="ml-2 text-gray-700"
                >
                  Student Enrollment Notifications
                </label>
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="marketing-communications"
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                />
                <label
                  htmlFor="marketing-communications"
                  className="ml-2 text-gray-700"
                >
                  Marketing Communications
                </label>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
