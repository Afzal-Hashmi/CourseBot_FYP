import React, { useState, useEffect } from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaBars,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("role");
      navigate("/");
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleKeyDown = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavClick(path);
    }
  };

  const navItems = [
    { path: "/teacher/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/teacher/myCourses", label: "My Courses", icon: FaBookOpen },
    { path: "/teacher/students-management", label: "Students", icon: FaUsers },
    { path: "/teacher/feedback", label: "Feedback", icon: FaStar },
    { path: "/teacher/profile", label: "Profile", icon: FaCog },
  ];

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous"
    : "Anonymous";
  const email = user ? user.email || "No email" : "No email";
  const profilePicture = user ? user.profilePicture || null : null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-gray-800 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:z-0 lg:w-72 lg:shadow-lg animate-slide-in`}
      >
        <div className="flex flex-col justify-between h-full px-4">
          <div>
            <div className="flex items-center gap-3 p-6 text-2xl font-bold text-white">
              <FaRobot className="text-blue-500" />
              <span className="tracking-tight">CourseBot</span>
            </div>
            <nav className="mt-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      onKeyDown={(e) => handleKeyDown(e, item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-gray-700/50 text-blue-500"
                          : "text-gray-200 hover:bg-gray-700/50 hover:text-blue-400"
                      }`}
                      aria-label={`Navigate to ${item.label}`}
                      role="button"
                      tabIndex={0}
                    >
                      <item.icon className="text-lg" />
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleLogout();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm sm:text-base font-semibold text-gray-200 rounded-xl hover:bg-gray-700/50 hover:text-blue-400 transition-all duration-200"
                    aria-label="Logout"
                    role="button"
                    tabIndex={0}
                  >
                    <FaSignOutAlt className="text-lg" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Profile Section */}
          {user && (
            <button
              onClick={() => {
                handleNavClick("/teacher/profile");
              }}
              onKeyDown={(e) => handleKeyDown(e, "/teacher/profile")}
              className="w-full p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/10 hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/20 text-left transition-all duration-200 mb-4 animate-fade-in"
              aria-label={`View Profile for ${fullName}`}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={`${fullName}'s Profile Picture`}
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-500/50 hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                    loading="lazy"
                  />
                ) : (
                  <FaUserCircle className="h-12 w-12 text-gray-400 hover:text-blue-400 transition-all duration-200" />
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {fullName}
                  </p>
                  <p className="text-xs font-medium text-gray-400 truncate">
                    {email}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* CSS for Animations */}
      <style>
        {`
          .animate-slide-in {
            animation: slideIn 0.2s ease-in-out;
          }
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default TeacherSidebar;
