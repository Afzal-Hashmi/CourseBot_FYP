import React, { useEffect, useState } from "react";
import { FaCamera, FaUserEdit, FaLock, FaEye } from "react-icons/fa";
import StudentSidebar from "./student_sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const user = Cookies.get("user");
    if (!token || role !== "student") {
      navigate("/");
    }
    setUser(JSON.parse(user));
    setRole(role);
  }, []);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar />
      {/* Main Content */}
      <div className="ml-64 w-full p-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-8 bg-white p-8 rounded-lg shadow-md flex-col md:flex-row text-center md:text-left">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
            />
            <div className="flex-1">
              <h1 className="text-2xl text-gray-800 font-semibold mb-1">
                {user.firstName?.charAt(0).toUpperCase() +
                  user.firstName?.slice(1) +
                  " " +
                  user.lastName?.charAt(0).toUpperCase() +
                  user.lastName?.slice(1)}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4 relative inline-block">
                <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center gap-2 hover:bg-gray-300">
                  <FaCamera /> Change Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl text-gray-800 font-semibold flex items-center gap-3 mb-6">
              <FaUserEdit /> Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-3 rounded focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-3 rounded focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-3 rounded focus:border-blue-400"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded hover:opacity-90"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl text-gray-800 font-semibold flex items-center gap-3 mb-6">
              <FaLock /> Security Settings
            </h2>
            <form className="space-y-6">
              {["current", "new", "confirm"].map((field, i) => (
                <div key={i} className="relative">
                  <label className="block text-gray-700 font-bold mb-2">
                    {field === "current"
                      ? "Current Password"
                      : field === "new"
                      ? "New Password"
                      : "Confirm New Password"}
                  </label>
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    className="w-full border-2 border-gray-200 p-3 rounded focus:border-blue-400"
                  />
                  <FaEye
                    className="absolute right-3 top-10 cursor-pointer text-gray-500"
                    onClick={() => togglePassword(field)}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded hover:opacity-90"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
