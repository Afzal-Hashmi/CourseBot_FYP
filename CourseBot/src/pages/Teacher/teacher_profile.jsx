import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./teacher_sidebar";

const TeacherProfile = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileLoading, setprofileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
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


  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const userDataRaw = Cookies.get("user");

      if (!token || role !== "teacher") {
        navigate("/");
        return;
      }

      if (!userDataRaw) {
        setMessage("User data missing. Please log in again.");
        navigate("/");
        return;
      }

      const userData = JSON.parse(userDataRaw);

      if (
        !userData.id ||
        !userData.firstName ||
        !userData.lastName ||
        !userData.email
      ) {
        setMessage("User data incomplete. Please log in again.");
        navigate("/");
        return;
      }

      setUser({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profilePicture: userData.profilePicture || "",
      });
    } catch (error) {
      console.error("Failed to parse user cookie", error);
      setMessage("Error reading user data.");
      navigate("/");
    }
  }, [navigate]);

  const togglePasswordVisibility = (field) => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    else if (field === "new") setShowNewPassword(!showNewPassword);
    else if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setprofileLoading(true);
    const token = Cookies.get("token");
    const userId = user.id;

    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      return;
    }

    const formDataToSend = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/teacher/editprofile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.succeeded) {
        Cookies.set("user", JSON.stringify(responseData.data), {
          path: "/",
          expires: 30 / 1440,
        });
        setMessage(responseData.message || "Profile updated successfully.");
        setUser((prev) => ({
          ...prev,
          firstName: responseData.data.firstName,
          lastName: responseData.data.lastName,
          email: responseData.data.email,
        }));
        setprofileLoading(false);
      } else {
        setMessage(responseData.message || "Failed to update profile.");
        setprofileLoading(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred while updating profile. Please try again.");
      setprofileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setPasswordLoading(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }
    const token = Cookies.get("token");
    const response = await fetch('http://127.0.0.1:8000/reset-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }
      )
    })

    if (!response.ok) {
      const updatedUser = await response.json();
      setMessage(updatedUser.message || "Oops, we missed the password—try again, cool team! 😊");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordLoading(false);
      return;
    }
    const updatedUser = await response.json();
    console.log("Updated User:", updatedUser);
    setMessage(updatedUser.message || "Password updated successfully.");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      <div className="flex-1 ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl shadow-sm ${message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                } transition-all duration-300`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-6 sm:mb-8">
            {user.profilePicture && (
              <div className="relative">
                <img
                  src={user.profilePicture}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-indigo-500 object-cover"
                  alt="Profile"
                />
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
              {profileLoading ? (<button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Saving......
              </button>) : (<button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Save Changes
              </button>)}
            </form>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaLock className="text-indigo-600" />
              <span>Security Settings</span>
            </h2>
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5 sm:space-y-6"
            >
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (field, i) => (
                  <div key={field} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === "currentPassword"
                        ? "Current Password"
                        : field === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"}
                    </label>
                    <input
                      type={
                        field === "currentPassword"
                          ? showCurrentPassword
                            ? "text"
                            : "password"
                          : field === "newPassword"
                            ? showNewPassword
                              ? "text"
                              : "password"
                            : showConfirmPassword
                              ? "text"
                              : "password"
                      }
                      name={field}
                      onChange={handlePasswordChange}
                      value={passwordData[field]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-sm sm:text-base pr-10"
                      placeholder={`Enter ${field === "confirmPassword"
                        ? "confirm password"
                        : field === "newPassword"
                          ? "new password"
                          : "current password"
                        }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-10 text-gray-500"
                      onClick={() =>
                        togglePasswordVisibility(
                          field === "currentPassword"
                            ? "current"
                            : field === "newPassword"
                              ? "new"
                              : "confirm"
                        )
                      }
                    >
                      {(field === "currentPassword" && showCurrentPassword) ||
                        (field === "newPassword" && showNewPassword) ||
                        (field === "confirmPassword" && showConfirmPassword) ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                )
              )}
              {passwordLoading ? (<button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Updating......
              </button>) : (<button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                Update Password
              </button>)}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;


