import React, { useState, useEffect } from "react";
import TeacherSidebar from "./teacher_sidebar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const MyCourses = () => {
  const navigate = useNavigate();

  // State
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("All Courses");
  const [formData, setFormData] = useState({
    course_name: "",
    course_description: "",
    file: null,
  });
  const [message, setMessage] = useState("");

  // Truncate text to a specified number of words
  const truncateText = (text, wordLimit = 10) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (
      !formData.course_name ||
      !formData.course_description ||
      !formData.file
    ) {
      setLoading(false);
      setMessage("Please fill in all fields and upload a file.");
      return;
    }

    const token = Cookies.get("token");
    const formDataToSend = new FormData();
    formDataToSend.append("course_name", formData.course_name);
    formDataToSend.append("course_description", formData.course_description);
    formDataToSend.append("file", formData.file);

    try {
      const response = await fetch(
        "http://localhost:8000/teacher/createcourse",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setCourses((prev) => [...prev, responseData.data]);
        setLoading(false);
        setModal(false);
        setFormData({ course_name: "", course_description: "", file: null });
        setMessage("Course successfully created.");
      } else {
        setLoading(false);
        setMessage("Failed to create course.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("An error occurred.");
    }
  };

  const handleEdit = async (course) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `http://localhost:8000/teacher/editcourse/${course.course_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            course_name: course.course_name,
            course_description: course.course_description,
            course_status: course.course_status,
            course_image: course.course_image,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setCourses(responseData.data);
        setLoading(false);
        setMessage("Course status updated successfully.");
      } else {
        setLoading(false);
        setMessage("Failed to update course.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("An error occurred while updating the course.");
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `http://localhost:8000/teacher/deletecourse/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.ok) {
        setCourses((prev) =>
          prev.filter((course) => course.course_id !== courseId)
        );
        setLoading(false);
        setMessage("Course successfully deleted.");
      } else {
        const errorData = await response.json();
        setLoading(false);
        setMessage(errorData.message || "Failed to delete course.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("An error occurred.");
    }
  };

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

      if (!token || role !== "teacher") {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/teacher/fetchcourses",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setCourses(responseData.data || []);
        } else {
          console.error("Error fetching courses.");
          setMessage("Unable to fetch courses.");
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // Filter courses based on selected filter
  const filteredCourses = courses.filter((course) => {
    if (filter === "All Courses") return true;
    if (filter === "Published") return course.course_status === "Published";
    if (filter === "Drafts") return course.course_status === "Draft";
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
            My Courses
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter courses"
            >
              <option>All Courses</option>
              <option>Published</option>
              <option>Drafts</option>
            </select>
            <button
              onClick={() => setModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              aria-label="Create new course"
            >
              Create Course
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl shadow-sm text-sm sm:text-base animate-fade ${
              message.includes("success")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Course Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Last Updated
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4 text-gray-500 text-sm sm:text-base animate-pulse"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.course_id}
                      className="hover:bg-gray-50 transition-all duration-200 animate-fade"
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-800 font-semibold break-words max-w-xs">
                        {course.course_name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-600 break-words max-w-md">
                        {truncateText(course.course_description)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            course.course_status === "Published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.course_status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-600">
                        {new Date(course.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm ${
                              course.course_status === "Draft"
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                : "bg-gray-500 hover:bg-gray-600 text-white"
                            } transition-all duration-200`}
                            aria-label={
                              course.course_status === "Draft"
                                ? `Publish ${course.course_name}`
                                : `Unpublish ${course.course_name}`
                            }
                          >
                            {course.course_status === "Draft"
                              ? "Publish"
                              : "Unpublish"}
                          </button>
                          <button
                            onClick={() => handleDelete(course.course_id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200"
                            aria-label={`Delete ${course.course_name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4 text-gray-500 text-sm sm:text-base"
                    >
                      No courses available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade"
          role="dialog"
          aria-modal="true"
          aria-label="Create course modal"
        >
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg shadow-lg transform transition-all duration-300 animate-fade">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-4 sm:mb-6 tracking-tight">
              Create New Course
            </h2>
            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 sm:space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  name="course_name"
                  onChange={handleChange}
                  value={formData.course_name}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter course title"
                  aria-label="Course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  name="course_description"
                  onChange={handleChange}
                  value={formData.course_description}
                  required
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter course description"
                  aria-label="Course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Upload Thumbnail
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl shadow-sm file:mr-3 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 text-sm sm:text-base"
                  aria-label="Upload course thumbnail"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm sm:text-base"
                  aria-label="Cancel course creation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center gap-2"
                  aria-label="Create course"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
