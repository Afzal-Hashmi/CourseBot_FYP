import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const MyCourses = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!token || !role == "teacher") {
      navigate("/");
    } else {
      const fetchcourse = async () => {
        if (user) {
          const response = await fetch(
            "http://localhost:8000/teacher/fetchcourses",
            {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            setCourse(responseData.data);
            setLoading(false);
          } else {
            console.error("Error fetching courses:");
          }
        }
      };
      fetchcourse();
    }
  }, []);

  const handleEdit = (courseId) => {
    console.log("Edit course", courseId);
  };

  const handleDelete = async (courseId) => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:8000/teacher/deletecourse/${courseId}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      setCourse(responseData.data);
      setLoading(false);
    } else {
      setLoading(false);
      console.error("Error deleting course:", response.statusText);
    }
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
                    Status Description
                  </th>
                  {/*<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Rating
                  </th> */}
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {course.length > 0 ? (
                  course.map((course) => (
                    <tr key={course.course_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course?.course_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === "published"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        } text-white`}
                      >
                        {course.status === "published" ? "Published" : "Draft"}
                      </span> */}
                        {course?.course_description}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      45
                    </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.rating ? (
                        <span className="flex items-center gap-1">
                          {course.rating} <FaStar className="text-yellow-400" />{" "}
                          ({course.reviews})
                        </span>
                      ) : (
                        "-"
                      )}
                      55
                    </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course?.updated_at.split(" ")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleEdit(course.course_id)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleDelete(course.course_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    {loading ? "Loading..." : "No courses available."}
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
