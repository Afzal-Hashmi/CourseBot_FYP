import React from "react";
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold">Student Management</h1>
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search students..."
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((course, index) => (
                          <span
                            key={index}
                            className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleView(student.id)}
                        >
                          View
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleRemove(student.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;
