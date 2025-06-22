import React, { useEffect, useState, Component } from "react";
import TeacherSidebar from "./teacher_sidebar";
import {
  FaSearch,
  FaStar,
  FaBookOpen,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TeacherFeedback = () => {
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [courseFilter, setCourseFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedFeedback, setExpandedFeedback] = useState({});
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    if (!token || role !== "teacher") {
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/teacher/courses", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchFeedback = async () => {
      try {
        setFeedbackLoading(true);
        const response = await fetch("http://localhost:8000/teacher/feedback", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFeedback(data.data || []);
          setFilteredFeedback(data.data || []);
          setError(data.data.length === 0 ? "No feedback found" : "");
          // Extract unique students for filter
          const uniqueStudents = [
            ...new Map(
              data.data.map((item) => [
                item.student_id,
                {
                  student_id: item.student_id,
                  student_name: item.student_name || "Anonymous",
                  student_email: item.student_email || "Anonymous",
                },
              ])
            ).values(),
          ];
          setStudents(uniqueStudents);
        } else {
          const errorData = await response.json();
          console.error("Fetch Feedback Failed:", response.status, errorData);
          setError(errorData.message || "Failed to fetch feedback");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to connect to server");
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchCourses();
    fetchFeedback();
  }, [navigate]);

  useEffect(() => {
    let result = [...feedback];

    // Search
    if (search) {
      result = result.filter((item) =>
        item.course_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filters
    if (courseFilter) {
      result = result.filter(
        (item) => item.course_id === parseInt(courseFilter)
      );
    }
    if (studentFilter) {
      result = result.filter(
        (item) => item.student_id === parseInt(studentFilter)
      );
    }

    // Sort
    if (sortBy === "date-desc") {
      result.sort(
        (a, b) =>
          new Date(b.submitted_at || "0") - new Date(a.submitted_at || "0")
      );
    } else if (sortBy === "date-asc") {
      result.sort(
        (a, b) =>
          new Date(a.submitted_at || "0") - new Date(a.submitted_at || "0")
      );
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "rating-asc") {
      result.sort((a, b) => a.rating - b.rating);
    }

    setFilteredFeedback(result);
    setCurrentPage(1); // Reset to page 1 on filter/sort
  }, [search, courseFilter, studentFilter, sortBy, feedback]);

  const handleSearchClear = () => {
    setSearch("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFeedback = (feedbackId) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [feedbackId]: !prev[feedbackId],
    }));
  };

  const handleFeedbackKeyDown = (e, feedbackId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFeedback(feedbackId);
    }
  };

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedback = filteredFeedback.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
        <TeacherSidebar />
        <main className="flex-1 p-6 md:p-8 lg:ml-80 w-full animate-fade-in">
          <style>
            {`
              .animate-fade-in {
                animation: fadeIn 0.3s ease-in-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .avatar-fallback {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                background-color: #3b82f6;
              }
            `}
          </style>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
              Course Feedback
            </h1>

            <div className="sticky top-0 bg-white shadow-sm rounded-xl p-4 mb-6 z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-xs">
                  <FaSearch
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-base"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by course name..."
                    className="w-full pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    aria-label="Search feedback by course name"
                  />
                  {search && (
                    <button
                      onClick={handleSearchClear}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Clear search"
                      title="Clear search"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    aria-label="Filter by course"
                  >
                    <option value="">All Courses</option>
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    aria-label="Filter by student"
                  >
                    <option value="">All Students</option>
                    {students.map((student) => (
                      <option
                        key={student.student_id}
                        value={student.student_id}
                      >
                        {student.student_name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    aria-label="Sort feedback"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {error && !feedbackLoading && filteredFeedback.length === 0 && (
              <div className="p-3 rounded-lg mb-6 shadow-sm text-sm bg-red-100 text-red-700 border border-red-200 animate-fade-in">
                {error}
              </div>
            )}

            {feedbackLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="max-w-sm p-4 bg-white rounded-xl shadow-md animate-pulse border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FaBookOpen
                  className="text-5xl text-gray-300 mb-4"
                  aria-hidden="true"
                />
                <p className="text-lg font-semibold text-gray-600 mb-3">
                  No feedback found.
                </p>
                <p className="text-gray-500 text-sm">
                  Students haven’t submitted feedback for your courses yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentFeedback.map((item) => {
                  const studentName = item.student_name || "Anonymous";
                  const feedbackText = item.feedback || "No feedback provided";
                  const isExpanded = expandedFeedback[item.feedback_id];
                  const truncatedFeedback =
                    feedbackText.length > 100 && !isExpanded
                      ? `${feedbackText.slice(0, 100)}...`
                      : feedbackText;
                  const initials = studentName.charAt(0).toUpperCase() || "A";

                  return (
                    <div
                      key={item.feedback_id}
                      className="max-w-sm p-4 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in hover:scale-105 hover:shadow-lg transition-all duration-200"
                      role="article"
                      aria-label={`Feedback for ${item.course_name}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {item.student_profilePicture ? (
                          <img
                            src={item.student_profilePicture}
                            alt={`${studentName}'s profile`}
                            className="w-10 h-10 rounded-full object-cover"
                            title={item.student_email || "No email"}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full avatar-fallback text-sm"
                            title={item.student_email || "No email"}
                          >
                            {initials}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[200px]">
                            {studentName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.course_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`text-sm ${
                              item.rating >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">
                          ({item.rating}/5)
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {truncatedFeedback}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full text-sm ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-110"
                  } transition-all duration-200`}
                  aria-label="Previous page"
                >
                  <FaChevronLeft size={14} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-100 hover:scale-110"
                    } transition-all duration-200`}
                    aria-label={`Page ${i + 1}`}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-110"
                  } transition-all duration-200`}
                  aria-label="Next page"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(TeacherFeedback);
