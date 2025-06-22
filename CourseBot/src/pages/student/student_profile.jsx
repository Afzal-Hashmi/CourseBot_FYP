import React, { useEffect, useState } from "react";
import {
  FaUserEdit,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
} from "react-icons/fa";
import StudentSidebar from "./student_sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState({ profile: false, password: false });
  // const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const user = Cookies.get("user");
    if (!token || role !== "student") {
      navigate("/");
      return;
    }
    if (user) {
      setUser(JSON.parse(user));
      setRole(role);
    }
  }, [navigate]);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));

    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      if (user.firstName) formData.append("firstName", user.firstName);
      if (user.lastName) formData.append("lastName", user.lastName);
      if (user.email) formData.append("email", user.email);
      const response = await fetch(
        "http://localhost:8000/student/updateprofile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedUser = {
          ...user,
          firstName: user.firstName || user.firstName,
          lastName: user.lastName || user.lastName,
          email: user.email || user.email,
          profileImage: data.imageUrl || user.profileImage,
        };
        setUser(updatedUser);
        Cookies.set("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully!");
        setProfileImage(null);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.current.value;
    const newPassword = e.target.new.value;
    const confirmPassword = e.target.confirm.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "http://localhost:8000/student/updatepassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password updated successfully!");
        e.target.reset();
        setShowPassword({ current: false, new: false, confirm: false });
      } else {
        alert("Failed to update password. Please check your current password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating your password.");
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 ml-0 lg:ml-64 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg mb-6 sm:mb-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative group">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-24 sm:w-32 md:w-36 h-24 sm:h-32 md:h-36 rounded-full object-cover border-4 border-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                {loading.profile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="w-4 sm:w-6 h-4 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
                  {user.firstName?.charAt(0).toUpperCase() +
                    (user.firstName?.slice(1) || "") +
                    " " +
                    user.lastName?.charAt(0).toUpperCase() +
                    (user.lastName?.slice(1) || "")}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg mb-6 sm:mb-10 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-4 sm:mb-6">
              <FaUserEdit className="text-blue-600" /> Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold text-xs sm:text-sm mb-2">
                  First Name (Optional)
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName || ""}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full border border-gray-200 p-2 sm:p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-xs sm:text-sm mb-2">
                  Last Name (Optional)
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName || ""}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full border border-gray-200 p-2 sm:p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-xs sm:text-sm mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full border border-gray-200 p-2 sm:p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading.profile}
                  className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading.profile ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.profile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-4 sm:mb-6">
              <FaLock className="text-blue-600" /> Security Settings
            </h2>
            <form
              onSubmit={handlePasswordUpdate}
              className="space-y-4 sm:space-y-6"
            >
              {["current", "new", "confirm"].map((field) => (
                <div key={field} className="relative">
                  <label className="block text-gray-700 font-semibold text-xs sm:text-sm mb-2">
                    {field === "current"
                      ? "Current Password"
                      : field === "new"
                      ? "New Password"
                      : "Confirm New Password"}{" "}
                    {field !== "current" && "(Optional)"}
                  </label>
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    name={field}
                    placeholder={`Enter ${field} password`}
                    className="w-full border border-gray-200 p-2 sm:p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base pr-10 sm:pr-12 transition-all duration-200 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-2 sm:right-3 top-8 sm:top-10 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={() => togglePassword(field)}
                    aria-label={`Toggle ${field} password visibility`}
                  >
                    {showPassword[field] ? (
                      <FaEyeSlash size={16} sm:size={18} />
                    ) : (
                      <FaEye size={16} sm:size={18} />
                    )}
                  </button>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading.password}
                  className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading.password ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading.password ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* CSS for Animations */}
        <style>
          {`
            .animate-fade-in {
              animation: fadeIn 0.3s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default StudentProfile;
