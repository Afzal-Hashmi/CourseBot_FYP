import React, { useEffect, useState } from "react";
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
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./teacher_sidebar";

const TeacherDashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [course, setCourse] = React.useState([]);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [user, setUser] = React.useState(null);
  const [formData, setFormData] = useState({
    course_name: "",
    course_description: "",
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("token");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!token || !Cookies.get("role") == "teacher") {
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
            setUser(user);
            setCourse(responseData.data);
            setLoading(false);
          } else {
            setLoading(false);
            console.error(response.message);
          }
        }
      };
      fetchcourse();
    }
  }, []);

  const navigateToAIScreen = (event) => {
    if (!event.target.closest(".course-actions")) {
      console.log("Navigating to AI screen");
      window.location.href = "/teacher/ai";
    }
  };

  const editCourse = (event, courseId) => {
    event.stopPropagation();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("token");
    const response = await fetch("http://localhost:8000/teacher/createcourse", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_name: formData.course_name,
        course_description: formData.course_description,
      }),
    });
    if (response.ok) {
      const responseData = await response.json();
      setCourse(responseData.data);
      setLoading(false);
      setModal(false);
      setFormData({
        course_name: "",
        course_description: "",
      });
      setMessage(responseData.message);
    } else {
      setLoading(false);
      console.error("Error creating course:", response.statusText);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome Back, {user ? user.firstName : "Teacher"}!
          </h1>
          <button
            onClick={() => setModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            <FaPlus />
            <span>Create New Course</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.length > 0 ? (
            course.map((course) => (
              <div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                onClick={navigateToAIScreen}
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">
                  {course?.course_name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {course?.course_description}
                </p>
                <div className="flex justify-between text-gray-500 text-sm">
                  <p className="flex items-center gap-2">
                    <FaUserFriends />
                    <span>45 Students</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>{course?.updated_at.split(" ")[0]}</span>
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
                    onClick={(e) => handleDelete(course?.course_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              {loading ? "Loading..." : "No Courses Avaliable"}
            </div>
          )}
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    onChange={handleChange}
                    value={formData.course_name}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="course_description"
                    onChange={handleChange}
                    value={formData.course_description}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/*<div>
                  <label className="block text-sm font-medium mb-1">
                    Upload Thumbnail
                  </label>
                  <input
                    type="file"
                    required
                    className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div> */}

                {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Status (optional)
                  </label>
                  <select
                    name="status"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Pending" selected>
                      Pending
                    </option>
                    <option value="Active">Active</option>
                  </select>
                </div> */}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
