// CourseEnrollment.jsx

import React from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaUserTie,
  FaPlus,
} from "react-icons/fa";
import StudentSidebar from "./student_sidebar";

const StudentDashboard = () => {
  const handleCardClick = (event) => {
    if (!event.target.closest(".enroll-btn")) {
      window.location.href = "enroll_page.html";
    }
  };

  const handleEnrollClick = (event) => {
    event.stopPropagation();
    window.location.href = "enroll_page.html";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      {/* Main Content */}
      <div className="ml-70 p-8 w-[calc(100%-250px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

          {/* Search Bar */}
          <div className="flex items-center gap-4 bg-white border-2 border-blue-500 rounded-full p-4 mb-8">
            <FaSearch />
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 outline-none border-none text-lg"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="px-6 py-2 border-2 border-blue-500 rounded-full bg-blue-500 text-white">
              All
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Course 1 */}
          <div
            className="bg-white rounded-lg p-6 shadow-md hover:-translate-y-1 transition cursor-pointer relative overflow-hidden"
            onClick={handleCardClick}
          >
            <a href="enroll_page.html" className="absolute inset-0 z-0"></a>
            <div className="h-44 bg-gray-200 rounded-md overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/400x250"
                alt="Web Development"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">
              Introduction to Web Development
            </h3>
            <p className="text-gray-600">
              Learn HTML, CSS, and JavaScript fundamentals
            </p>
            <div className="flex justify-between text-gray-600 my-4">
              <span className="flex items-center gap-2">
                <FaUserTie />
                Prof. Afzal
              </span>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center gap-2 enroll-btn relative z-10"
              onClick={handleEnrollClick}
            >
              <FaPlus /> Enroll Now
            </button>
          </div>

          {/* Course 2 */}
          <div
            className="bg-white rounded-lg p-6 shadow-md hover:-translate-y-1 transition cursor-pointer relative overflow-hidden"
            onClick={handleCardClick}
          >
            <a href="enroll_page.html" className="absolute inset-0 z-0"></a>
            <div className="h-44 bg-gray-200 rounded-md overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/400x250"
                alt="Python Programming"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Python Programming Basics</h3>
            <p className="text-gray-600">
              Master Python fundamentals and core concepts
            </p>
            <div className="flex justify-between text-gray-600 my-4">
              <span className="flex items-center gap-2">
                <FaUserTie />
                Prof. Yousaf
              </span>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center gap-2 enroll-btn relative z-10"
              onClick={handleEnrollClick}
            >
              <FaPlus /> Enroll Now
            </button>
          </div>

          {/* Course 3 */}
          <div
            className="bg-white rounded-lg p-6 shadow-md hover:-translate-y-1 transition cursor-pointer relative overflow-hidden"
            onClick={handleCardClick}
          >
            <a href="enroll_page.html" className="absolute inset-0 z-0"></a>
            <div className="h-44 bg-gray-200 rounded-md overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/400x250"
                alt="Mobile App Development"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Mobile App Development</h3>
            <p className="text-gray-600">
              Build cross-platform mobile applications
            </p>
            <div className="flex justify-between text-gray-600 my-4">
              <span className="flex items-center gap-2">
                <FaUserTie />
                Prof. Hamid
              </span>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center gap-2 enroll-btn relative z-10"
              onClick={handleEnrollClick}
            >
              <FaPlus /> Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
