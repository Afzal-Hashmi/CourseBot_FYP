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
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    courseUpdates: true,
    enrollmentNotifications: true,
    marketingCommunications: false,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const userData = Cookies.get("user")
      ? JSON.parse(Cookies.get("user"))
      : null;
    if (!token || role !== "teacher") {
      navigate("/");
    } else if (userData) {
      setUser({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        profilePicture: userData.profilePicture || "",
      });
    }
  }, [navigate]);

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (e) => {
    const { id, checked } = e.target;
    setNotificationPrefs((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "http://localhost:8000/teacher/update-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        Cookies.set("user", JSON.stringify(updatedUser.data));
        setMessage("Profile updated successfully.");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }
    // Add API call to update password
    setMessage("Password update submitted (API call needed).");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    // Add API call to update notification preferences
    setMessage("Notification preferences saved (API call needed).");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl shadow-sm ${
                message.includes("success")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              } transition-all duration-300`}
            >
              {message}
            </div>
          )}

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-6 sm:mb-8">
            {user.profilePicture && (
              <div className="relative">
                <img
                  src={user.profilePicture}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-indigo-500 object-cover"
                  alt="Profile"
                />
                <div className="relative mt-4">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 text-sm sm:text-base">
                    <FaCamera />
                    <span>Change Photo</span>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {user.firstName?.charAt(0).toUpperCase() +
                  user.firstName?.slice(1)}{" "}
                {user.lastName?.charAt(0).toUpperCase() +
                  user.lastName?.slice(1)}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaUserEdit className="text-indigo-600" />
              <span>Personal Information</span>
            </h2>
            <form
              onSubmit={handleProfileSubmit}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  onChange={handleProfileChange}
                  value={user.firstName}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  onChange={handleProfileChange}
                  value={user.lastName}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleProfileChange}
                  value={user.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter email address"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaLock className="text-indigo-600" />
              <span>Security Settings</span>
            </h2>
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5 sm:space-y-6"
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  onChange={handlePasswordChange}
                  value={passwordData.currentPassword}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-500"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  onChange={handlePasswordChange}
                  value={passwordData.newPassword}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-500"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handlePasswordChange}
                  value={passwordData.confirmPassword}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-500"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaBell className="text-indigo-600" />
              <span>Notification Preferences</span>
            </h2>
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="courseUpdates"
                  checked={notificationPrefs.courseUpdates}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 text-indigo-500 rounded focus:ring-indigo-400"
                />
                <label
                  htmlFor="courseUpdates"
                  className="ml-2 text-gray-700 text-sm sm:text-base"
                >
                  Course Updates
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enrollmentNotifications"
                  checked={notificationPrefs.enrollmentNotifications}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 text-indigo-500 rounded focus:ring-indigo-400"
                />
                <label
                  htmlFor="enrollmentNotifications"
                  className="ml-2 text-gray-700 text-sm sm:text-base"
                >
                  Student Enrollment Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketingCommunications"
                  checked={notificationPrefs.marketingCommunications}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 text-indigo-500 rounded focus:ring-indigo-400"
                />
                <label
                  htmlFor="marketingCommunications"
                  className="ml-2 text-gray-700 text-sm sm:text-base"
                >
                  Marketing Communications
                </label>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
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
