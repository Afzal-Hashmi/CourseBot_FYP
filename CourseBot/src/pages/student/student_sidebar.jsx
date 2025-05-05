import React from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const StudentSidebar = () => {
  return (
    <div className="w-70 bg-[#2c3e50] text-white p-8 fixed h-full">
      <div className="flex items-center gap-2 text-xl font-bold mb-12">
        <FaRobot className="text-blue-500" />
        <span>CourseBot</span>
      </div>
      <ul className="mt-8 space-y-4">
        <li>
          <a
            href="./student-dashboard"
            className="flex items-center gap-3 text-white"
          >
            <FaHome />
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="./student-courses"
            className="flex items-center gap-3 text-white"
          >
            <FaBookOpen />
            Available Courses
          </a>
        </li>
        <li>
          <a
            href="/student-enrollments"
            className="flex items-center gap-3 text-white"
          >
            <FaClipboardList />
            My Enrollments
          </a>
        </li>
        <li>
          <a
            href="/student-profile"
            className="flex items-center gap-3 text-white"
          >
            <FaCog />
            Profile
          </a>
        </li>
        <li>
          <a href="/login" className="flex items-center gap-3 text-white">
            <FaSignOutAlt />
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};
export default StudentSidebar;
