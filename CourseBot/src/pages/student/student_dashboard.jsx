import React, { useEffect, useState } from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaUserTie,
  FaPlus,
} from "react-icons/fa";
import StudentSidebar from "./student_sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Enroll from "./student_enroll";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [userDetail, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolling, setEnrolling] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!token || role !== "student") {
      navigate("/");
      return;
    }
    if (user) {
      setUser(user);
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            "http://localhost:8000/student/fetchcourses",
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
            setCourses(responseData.data);
          } else {
            console.error("Failed to fetch courses:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [navigate]);

  const handleCardClick = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  const handleEnrollClick = (event, courseId) => {
    event.stopPropagation();
    setEnrolling((prev) => ({ ...prev, [courseId]: true }));
    setSelectedCourseId(courseId);
    setEnrolling((prev) => ({ ...prev, [courseId]: false }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const teachers = [
    "All",
    ...new Set(courses.map((c) => c.teacher_name || "Unknown")),
  ];
  const ratingOptions = ["All", "4+", "3+", "2+", "1+"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.course_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTeacher =
      selectedTeacher === "All" || course.teacher_name === selectedTeacher;
    const rating = course.feedback_rating || 0;
    const matchesRating =
      selectedRating === "All" || rating >= parseInt(selectedRating);
    return matchesSearch && matchesTeacher && matchesRating;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <StudentSidebar />
      <div className="flex-1 p-4 sm:p-6 md:p-10 ml-0 lg:ml-64 w-full">
        {selectedCourseId ? (
          <Enroll
            course_id={selectedCourseId}
            onBack={() => setSelectedCourseId(null)}
          />
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-6 tracking-tight">
                Available Courses
              </h1>
              {userDetail && (
                <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
                  Welcome, {userDetail.firstName || "Student"}!
                </p>
              )}

              {/* Search Bar */}
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="flex-1 outline-none text-sm sm:text-base bg-transparent placeholder-gray-400"
                  aria-label="Search courses"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-xl shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 transition-all duration-200"
                  aria-label="Show all courses"
                >
                  All
                </button>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-xl shadow-md bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  aria-label="Filter by teacher"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher === "All" ? "All Teachers" : teacher}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-xl shadow-md bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  aria-label="Filter by rating"
                >
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating === "All" ? "All Ratings" : `${rating} Stars`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center text-lg sm:text-xl text-gray-600">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex items-center justify-center text-lg sm:text-xl text-gray-600">
                No Courses Available
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredCourses.map((course, idx) => (
                  <div
                    key={course.course_id || idx}
                    className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-200 cursor-pointer animate-fade"
                    onClick={() => handleCardClick(course.course_id)}
                  >
                    <div className="h-40 sm:h-44 bg-gray-200 rounded-md overflow-hidden mb-4">
                      <img
                        src={
                          course.course_image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={`${course.course_name || "Course"} Thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {course.course_name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-medium line-clamp-2">
                      {course.course_description ||
                        "Learn more about this course"}
                    </p>
                    <div className="flex justify-between text-gray-600 my-3 sm:my-4 text-sm sm:text-base">
                      <span className="flex items-center gap-2">
                        <FaUserTie />
                        {course.teacher_name || "Instructor"}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaCog />
                        {course.updated_at
                          ? new Date(course.updated_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <button
                      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                        enrolling[course.course_id]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(event) =>
                        handleEnrollClick(event, course.course_id)
                      }
                      disabled={enrolling[course.course_id]}
                      aria-label={`Enroll in ${course.course_name}`}
                    >
                      {enrolling[course.course_id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <FaPlus />
                          Enroll Now
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
