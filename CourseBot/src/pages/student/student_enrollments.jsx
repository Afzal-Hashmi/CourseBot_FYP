import React, { useEffect, useState, Component, useRef } from "react";
import StudentSidebar from "./student_sidebar";
import {
  FaSearch,
  FaUserTie,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaTimes,
  FaBookOpen,
  FaStar,
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

// Course Feedback Form Component (Modified for Modal)
const CourseFeedbackForm = ({ courseId, courses, onClose }) => {
  const [formData, setFormData] = useState({
    course_id: courseId || "",
    rating: 0,
    feedback: "",
    anonymous: false,
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [touched, setTouched] = useState({ course_id: false, rating: false });

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("FeedbackForm - Error parsing user cookie:", error);
        setError("Invalid user data");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "course_id" || name === "rating") {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    setTouched((prev) => ({ ...prev, rating: true }));
  };

  const validateForm = () => {
    if (!formData.course_id) {
      return "Please select a course.";
    }
    if (!formData.rating) {
      return "Please provide a rating.";
    }
    if (formData.feedback.length > 500) {
      return "Feedback cannot exceed 500 characters.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = Cookies.get("token");
      const course_Id = formData.course_id;
      const response = await fetch(
        `http://localhost:8000/student/feedback/${course_Id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: formData.rating,
            feedback: formData.feedback || "",
            anonymous: formData.anonymous,
            user_id: formData.anonymous ? null : user.id,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Feedback submitted successfully!");
        setFormData({
          course_id: courseId || "",
          rating: 0,
          feedback: "",
          anonymous: false,
        });
        setTouched({ course_id: false, rating: false });
        setTimeout(onClose, 2000); // Close modal after success
      } else {
        const errorData = await response.json();
        console.error("Submit Feedback Failed:", errorData);
        setError(errorData.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setError("An error occurred while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Feedback</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100 transition-all duration-200"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg shadow-sm text-base bg-red-100 text-red-700 border border-red-200 animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg shadow-sm text-base bg-green-100 text-green-700 border border-green-200 animate-fade-in">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!courseId && (
          <div>
            <label
              htmlFor="course_id"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Course <span className="text-red-500">*</span>
            </label>
            {courses.length > 0 ? (
              <select
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all shadow-sm"
                aria-describedby="course_id-error"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">
                No enrolled courses available
              </p>
            )}
            {touched.course_id && !formData.course_id && (
              <p id="course_id-error" className="text-xs text-red-500 mt-1">
                Please select a course.
              </p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Course Rating <span className="text-red-500">*</span>
          </label>
          <div
            className="flex items-center gap-2"
            role="radiogroup"
            aria-labelledby="rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStarClick(star);
                  }
                }}
                className={`text-2xl transition-all duration-200 ${formData.rating >= star
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-500"
                  }`}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                role="radio"
                aria-checked={formData.rating === star}
                tabindex="0"
              >
                <FaStar />
              </button>
            ))}
          </div>
          {touched.rating && !formData.rating && (
            <p className="text-xs text-red-500 mt-1">Please select a rating.</p>
          )}
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Feedback (Optional)
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y transition-all shadow-sm"
            placeholder="Share your thoughts about the course..."
            aria-describedby="feedback-count"
          />
          <p
            id="feedback-count"
            className="text-xs text-gray-500 mt-1 text-right"
          >
            {formData.feedback.length}/500 characters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange}
            className="custom-checkbox"
            aria-label="Submit feedback anonymously"
          />
          <label
            htmlFor="anonymous"
            className="text-sm font-medium text-gray-700"
          >
            Submit anonymously
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm"
            aria-label="Cancel feedback"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (!courseId && !formData.course_id)}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 text-sm hover:scale-105 ${loading || (!courseId && !formData.course_id)
              ? "opacity-50 cursor-not-allowed"
              : ""
              }`}
            aria-label="Submit feedback"
            onKeyDown={handleKeyDown}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

const MyEnrollments = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    if (!token || role !== "student") {
      navigate("/");
      return;
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          "http://localhost:8000/student/fetchenrolledcourses",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
          setFilteredCourses(data.data || []);
          setError(data.data.length === 0 ? "No enrolled courses found" : "");
        } else {
          const errorData = await response.json();
          console.error(
            "Fetch Enrollments Failed:",
            response.status,
            errorData
          );
          setError(errorData.message || "Failed to fetch enrolled courses");
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [navigate]);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.course_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [search, courses]);

  // Focus Trap for Modal
  useEffect(() => {
    if (modalOpen) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        if (e.key === "Escape") {
          setModalOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      firstElement.focus();

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [modalOpen]);

  const handleEnrollClick = (courseId) => {
    navigate(`/student/ai/${courseId}`);
  };

  const handleExploreCourses = () => {
    navigate("/student/dashboard");
  };

  const handleDeleteEnrollment = async (e, enrollmentId) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to unenroll from this course?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8000/student/unenrollcourse/${enrollmentId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.ok) {
        setCourses(
          courses.filter((course) => course.enrollment_id !== enrollmentId)
        );
        setFilteredCourses(
          filteredCourses.filter(
            (course) => course.enrollment_id !== enrollmentId
          )
        );
        alert("Enrollment deleted successfully.");
      } else {
        const errorData = await response.json();
        console.error("Delete Enrollment Failed:", errorData);
        alert(errorData.message || "Failed to delete enrollment.");
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      alert("An error occurred while deleting the enrollment.");
    }
  };

  const handleFeedbackClick = (courseId) => {
    setSelectedCourseId(courseId);
    setModalOpen(true);
  };

  const handleFeedbackKeyDown = (e, courseId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFeedbackClick(courseId);
    }
  };
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
        <StudentSidebar />
        <main className="flex-1 p-6 md:p-10 lg:ml-64 w-full animate-fade-in">
          <style>
            {`
              .animate-fade-in {
                animation: fadeIn 0.3s ease-in-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-slide-up {
                animation: slideUp 0.3s ease-out;
              }
              @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .animate-slide-down {
                animation: slideDown 0.3s ease-out;
              }
              @keyframes slideDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(20px); opacity: 0; }
              }
              .custom-checkbox {
                appearance: none;
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid #d1d5db;
                border-radius: 0.375rem;
                background-color: transparent;
                cursor: pointer;
                transition: all 0.2s;
              }
              .custom-checkbox:checked {
                background-color: #3b82f6;
                border-color: #3b82f6;
              }
              .custom-checkbox:checked::after {
                content: "✔";
                color: white;
                font-size: 0.875rem;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
              }
              .custom-checkbox:focus {
                outline: none;
                ring: 2px solid #3b82f6;
              }
            `}
          </style>
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
                My Enrollments
              </h1>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
                <FaSearch
                  className="text-gray-400 mr-3 text-lg"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search enrolled courses..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base font-medium"
                  aria-label="Search enrolled courses"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            </div>
            {error && !loading && filteredCourses.length === 0 && (
              <div className="p-3 rounded-lg mb-6 shadow-sm text-base bg-red-100 text-red-700 border border-red-200 animate-fade-in">
                {error}
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100"
                  >
                    <div className="h-48 bg-gray-200 rounded-t-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-3">
                      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FaBookOpen
                  className="text-6xl text-gray-300 mb-4"
                  aria-hidden="true"
                />
                <p className="text-xl font-semibold text-gray-600 mb-4">
                  No enrolled courses found.
                </p>
                <p className="text-gray-500 mb-6">
                  Start your learning journey by exploring available courses!
                </p>
                <button
                  onClick={handleExploreCourses}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200"
                  title="Explore available courses"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.enrollment_id}
                    className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-2 border border-gray-100 transition-all duration-300 animate-fade-in"
                  >
                    <button
                      onClick={() => handleFeedbackClick(course.course_id)}
                      onKeyDown={(e) =>
                        handleFeedbackKeyDown(e, course.course_id)
                      }
                      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-yellow-400 hover:bg-yellow-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
                      aria-label={`Give feedback for ${course.course_name}`}
                      title="Give Feedback"
                      role="button"
                      tabindex="0"
                    >
                      <FaStar size={18} />
                    </button>
                    <div className="h-48 rounded-t-xl overflow-hidden mb-4 bg-gray-100">
                      {course.course_image ? (
                        <img
                          src={course.course_image}
                          alt={course.course_name}
                          className="w-full h-full object-center transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 truncate">
                      {course.course_name}
                    </h3>
                    <div className="text-gray-600 mb-4 space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <FaUserTie
                          className="text-blue-500"
                          aria-hidden="true"
                        />
                        <span>{course.teacher_name || "Unknown"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt
                          className="text-blue-500"
                          aria-hidden="true"
                        />
                        <span>
                          Enrolled:{" "}
                          {course.enrolled_at
                            ? new Date(course.enrolled_at).toLocaleDateString(
                              "en-GB"
                            )
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEnrollClick(course.course_id)}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200"
                        aria-label={`Open ${course.course_name}`}
                        title={`Open ${course.course_name}`}
                      >
                        <FaPlus /> Open
                      </button>
                      <button
                        onClick={(e) =>
                          handleDeleteEnrollment(e, course.enrollment_id)
                        }
                        className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
                        aria-label={`Unenroll from ${course.course_name}`}
                        title={`Unenroll from ${course.course_name}`}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Modal */}
          {modalOpen && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setModalOpen(false);
              }}
              role="dialog"
              aria-modal="true"
            >
              <div
                ref={modalRef}
                className={`bg-white rounded-2xl p-6 w-full max-w-[90vw] sm:max-w-lg shadow-2xl ${modalOpen ? "animate-slide-up" : "animate-slide-down"
                  } overflow-y-auto max-h-[90vh]`}
              >
                <CourseFeedbackForm
                  courseId={selectedCourseId}
                  courses={courses}
                  onClose={() => setModalOpen(false)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(MyEnrollments);
