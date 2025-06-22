import React, { useState } from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import TeacherSidebar from "./teacher_sidebar";

const StudentsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      courses: ["Web Development 101", "Python Fundamentals"],
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      courses: ["Data Science Basics", "Advanced Mathematics"],
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma@example.com",
      courses: ["Mobile App Development", "UI/UX Design"],
    },
    {
      id: 4,
      name: "David Kim",
      email: "david@example.com",
      courses: ["Cloud Computing", "DevOps Fundamentals"],
    },
  ];

  const handleView = (studentId) => {
    console.log("View student", studentId);
  };

  const handleRemove = (studentId) => {
    console.log("Remove student", studentId);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Student Management
          </h1>
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-sm sm:text-base" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Student Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Enrolled Courses
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900 break-words max-w-xs">
                        {student.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-600 break-words max-w-xs">
                        {student.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {student.courses.map((course, index) => (
                            <span
                              key={index}
                              className="bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                        <div className="flex gap-2">
                          <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200"
                            onClick={() => handleView(student.id)}
                          >
                            View
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200"
                            onClick={() => handleRemove(student.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-500 text-sm sm:text-base"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;
