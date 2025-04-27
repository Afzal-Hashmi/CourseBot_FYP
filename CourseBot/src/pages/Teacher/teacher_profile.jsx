import React, { useState } from "react";
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

const TeacherProfile = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleFileChange = (e) => {
    // Handle file upload logic here
    console.log("File selected:", e.target.files[0]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-70 bg-[#2c3e50] text-white fixed h-full p-8">
        <div className="flex items-center gap-2 text-xl font-bold mb-12">
          <FaRobot className="text-blue-500" />
          <span>CourseBot</span>
        </div>
        <ul className="space-y-4">
          <li>
            <a
              href="/teacher-dashboard"
              className="flex items-center gap-3 text-lg hover:text-blue-400"
            >
              <FaHome />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="/teacher-myCourses"
              className="flex items-center gap-3 text-lg hover:text-blue-400"
            >
              <FaBookOpen />
              <span>My Courses</span>
            </a>
          </li>
          <li>
            <a
              href="/students-management"
              className="flex items-center gap-3 text-lg hover:text-blue-400"
            >
              <FaUsers />
              <span>Students</span>
            </a>
          </li>
          <li>
            <a
              href="/teacher-profile"
              className="flex items-center gap-3 text-lg hover:text-blue-400"
            >
              <FaCog />
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="flex items-center gap-3 text-lg hover:text-blue-400"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>

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
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Prof. Yousaf
              </h1>
              <p className="text-gray-600 mb-1">Computer Science Department</p>
              <p className="text-gray-600">yousuf.j@university.edu</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaUserEdit />
              <span>Personal Information</span>
            </h2>
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="yousuf hashmi"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="yousuf.j@university.edu"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Department
                </label>
                <input
                  type="text"
                  defaultValue="Computer Science"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Bio
                </label>
                <textarea
                  defaultValue="Senior lecturer with 12 years of experience in computer science education. Specializing in AI and machine learning."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none h-32"
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
