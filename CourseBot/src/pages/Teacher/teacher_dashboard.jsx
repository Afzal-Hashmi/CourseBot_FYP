import React from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaUserFriends,
  FaCalendarAlt,
} from "react-icons/fa";

import TeacherSidebar from "./teacher_sidebar";

const TeacherDashboard = () => {
  const navigateToAIScreen = (event) => {
    if (!event.target.closest(".course-actions")) {
      console.log("Navigating to AI screen");
      window.location.href = "/teacher-ai";
    }
  };

  const editCourse = (event, courseId) => {
    event.stopPropagation();
    console.log("Edit course", courseId);
  };

  const deleteCourse = (event, courseId) => {
    event.stopPropagation();
    console.log("Delete course", courseId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      {/* <div className="w-70 bg-[#2c3e50] text-white fixed h-full p-8">
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
      </div> */}

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome Back, Professor Smith
          </h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2">
            <FaPlus />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Card 1 */}
          <div
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
            onClick={navigateToAIScreen}
          >
            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              Introduction to Web Development
            </h3>
            <p className="text-gray-600 mb-4">
              Learn HTML, CSS, and JavaScript fundamentals
            </p>
            <div className="flex justify-between text-gray-500 text-sm">
              <p className="flex items-center gap-2">
                <FaUserFriends />
                <span>45 Students</span>
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>Last updated: 2 days ago</span>
              </p>
            </div>
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={(e) => editCourse(e, 1)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                onClick={(e) => deleteCourse(e, 1)}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Course Card 2 */}
          <div
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
            onClick={navigateToAIScreen}
          >
            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              Advanced Python Programming
            </h3>
            <p className="text-gray-600 mb-4">
              Master Python and its advanced concepts
            </p>
            <div className="flex justify-between text-gray-500 text-sm">
              <p className="flex items-center gap-2">
                <FaUserFriends />
                <span>32 Students</span>
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>Last updated: 1 week ago</span>
              </p>
            </div>
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={(e) => editCourse(e, 2)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                onClick={(e) => deleteCourse(e, 2)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
