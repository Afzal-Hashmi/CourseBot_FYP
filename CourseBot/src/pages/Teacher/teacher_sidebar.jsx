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

const TeacherSidebar = () => {
  return (
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
  );
};
export default TeacherSidebar;
