import React from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaStar,
} from "react-icons/fa";
import TeacherSidebar from "./teacher_sidebar";

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      name: "Web Development Fundamentals",
      status: "published",
      students: 45,
      rating: 4.8,
      reviews: 28,
      lastUpdated: "2 days ago",
    },
    {
      id: 2,
      name: "Python Programming Basics",
      status: "draft",
      students: 0,
      rating: null,
      reviews: 0,
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      name: "Mobile App Development",
      status: "published",
      students: 28,
      rating: 4.5,
      reviews: 15,
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      name: "Data Science Fundamentals",
      status: "published",
      students: 62,
      rating: 4.7,
      reviews: 34,
      lastUpdated: "5 days ago",
    },
  ];

  const handleEdit = (courseId) => {
    console.log("Edit course", courseId);
  };

  const handleDelete = (courseId) => {
    console.log("Delete course", courseId);
  };

  const handleCreateCourse = () => {
    console.log("Create new course");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold">My Courses</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2"
              onClick={handleCreateCourse}
            >
              <FaPlus />
              <span>New Course</span>
            </button>
            <select className="border-2 border-gray-200 rounded-md px-4 py-2 bg-white cursor-pointer">
              <option>All Courses</option>
              <option>Published</option>
              <option>Drafts</option>
            </select>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === "published"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        } text-white`}
                      >
                        {course.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.rating ? (
                        <span className="flex items-center gap-1">
                          {course.rating} <FaStar className="text-yellow-400" />{" "}
                          ({course.reviews})
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleEdit(course.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
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

export default MyCourses;
