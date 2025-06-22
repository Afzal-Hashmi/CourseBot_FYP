import React, { useState, useEffect } from "react";
import StudentSidebar from "./student_sidebar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaUserCircle, FaTimes } from "react-icons/fa";

const AvailableCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All Teachers");
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

      if (!token || role !== "student") {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/student/fetchcourses",
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
          const uniqueTeachers = [
            ...new Set(responseData.data.map((course) => course.teacher_name)),
          ];
          setTeachers(uniqueTeachers);
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

  const filteredCourses =
    filter === "All Teachers"
      ? courses
      : courses.filter((course) => course.teacher_name === filter);

  const handleContact = (teacherEmail, teacherName, courseName) => {
    window.location.href = `mailto:${teacherEmail}?subject=Question about ${courseName}&body=Dear ${teacherName},%0D%0A%0D%0AI have a question about your course "${courseName}".%0D%0A%0D%0A`;
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedImage) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <StudentSidebar />
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 ml-0 lg:ml-64 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
              Available Courses
            </h1>
            <div className="w-full sm:w-auto">
              <select
                className="w-full sm:w-auto border border-gray-200 rounded-xl px-3 sm:px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base font-medium text-gray-700"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter by teacher"
              >
                <option>All Teachers</option>
                {teachers.map((teacher, index) => (
                  <option key={index} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-2 sm:p-3 rounded-xl mb-3 sm:mb-4 shadow-sm text-sm sm:text-base animate-fade ${
                message.includes("success")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Desktop: Table Layout */}
          <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Course Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Instructor
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Last Updated
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    [...Array(5)].map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-200 rounded-full"></div>
                            <div className="ml-3 sm:ml-4 space-y-2">
                              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <div className="h-6 sm:h-8 bg-gray-200 rounded-md w-16 sm:w-20 mx-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr
                        key={course.course_id}
                        className="hover:bg-gray-50 transition-all duration-200 animate-fade"
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-800 font-semibold">
                          {course.course_name}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center">
                            <button
                              className="flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10 rounded-full border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={() =>
                                handleImageClick(course.teacher_profile_picture)
                              }
                              aria-label={`View ${course.teacher_name}'s profile picture`}
                            >
                              {course.teacher_profile_picture ? (
                                <img
                                  src={course.teacher_profile_picture}
                                  alt={`${course.teacher_name}'s Profile`}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                <FaUserCircle className="h-full w-full text-gray-400" />
                              )}
                            </button>
                            <div className="ml-3 sm:ml-4">
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {course.teacher_name}
                              </div>
                              <div className="text-gray-500 text-xs sm:text-sm">
                                {course.teacher_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm text-gray-600">
                          {new Date(course.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              handleContact(
                                course.teacher_email,
                                course.teacher_name,
                                course.course_name
                              )
                            }
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold text-sm shadow-sm hover:from-indigo-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
                            aria-label={`Contact ${course.teacher_name} about ${course.course_name}`}
                          >
                            Contact
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-500 text-sm sm:text-base font-medium"
                      >
                        No courses available for selected teacher.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Card Layout */}
          <div className="md:hidden flex flex-col gap-3 sm:gap-4">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-md animate-pulse"
                >
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="ml-3 space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded-md w-20 mx-auto"></div>
                </div>
              ))
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.course_id}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 animate-fade"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-3">
                    {course.course_name}
                  </h3>
                  <div className="flex items-center mb-2 sm:mb-3">
                    <button
                      className="flex-shrink-0 h-8 w-8 rounded-full border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() =>
                        handleImageClick(course.teacher_profile_picture)
                      }
                      aria-label={`View ${course.teacher_name}'s profile picture`}
                    >
                      {course.teacher_profile_picture ? (
                        <img
                          src={course.teacher_profile_picture}
                          alt={`${course.teacher_name}'s Profile`}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="h-full w-full text-gray-400" />
                      )}
                    </button>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-gray-900">
                        {course.teacher_name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {course.teacher_email}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 text-center">
                    Updated: {new Date(course.updated_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() =>
                      handleContact(
                        course.teacher_email,
                        course.teacher_name,
                        course.course_name
                      )
                    }
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 py-1 sm:py-2 rounded-xl font-semibold text-sm shadow-sm hover:from-indigo-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
                    aria-label={`Contact ${course.teacher_name} about ${course.course_name}`}
                  >
                    Contact
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md text-center text-gray-500 text-sm sm:text-base font-medium">
                No courses available for selected teacher.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Profile Picture */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade"
          role="dialog"
          aria-modal="true"
          aria-label="Profile picture modal"
        >
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 relative shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors duration-200"
              onClick={handleCloseModal}
              aria-label="Close profile picture modal"
            >
              <FaTimes size={20} />
            </button>
            <div className="flex justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Teacher Profile"
                  className="max-h-96 w-auto rounded-lg object-cover"
                  loading="lazy"
                />
              ) : (
                <FaUserCircle className="h-64 w-64 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;
