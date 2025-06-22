import React, { useState, useEffect, Component } from "react";
import {
  FaStar,
  FaRobot,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

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

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Sidebar - Failed to parse user cookie:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("role");
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: "/student/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/student/courses", label: "Available Courses", icon: FaBookOpen },
    {
      path: "/student/enrollments",
      label: "My Enrollments",
      icon: FaClipboardList,
    },
    { path: "/student/profile", label: "Profile", icon: FaCog },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-gray-800 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:z-0 lg:w-72 lg:shadow-lg animate-slide-in`}
      >
        <div className="flex flex-col justify-between h-full px-4">
          <div>
            <div className="flex items-center gap-3 p-6 text-2xl font-bold text-white">
              <FaRobot className="text-blue-500" />
              <span className="tracking-tight">CourseBot</span>
            </div>
            <nav className="mt-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-gray-700/50 text-blue-500"
                          : "text-gray-200 hover:bg-gray-700/50 hover:text-blue-400"
                      }`}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <item.icon className="text-lg" />
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm sm:text-base font-semibold text-gray-200 rounded-xl hover:bg-gray-700/50 hover:text-blue-400 transition-all duration-200"
                    aria-label="Logout"
                  >
                    <FaSignOutAlt className="text-lg" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {user && (
            <button
              onClick={() => {
                navigate("/student/profile");
                setIsOpen(false);
              }}
              className="w-full p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/10 hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/20 text-left transition-all duration-200 mb-4 animate-fade-in"
              aria-label="View Profile"
            >
              <div className="flex items-center gap-3">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile Picture"
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-500/50 hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                    loading="lazy"
                  />
                ) : (
                  <FaUserCircle className="h-12 w-12 text-gray-400 hover:text-blue-400 transition-all duration-200" />
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs font-medium text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

const CourseFeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course_id: "",
    rating: 0,
    feedback: "",
    anonymous: false,
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState([]);
  const [touched, setTouched] = useState({ course_id: false, rating: false });

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const userData = Cookies.get("user");
    if (!token || role !== "student" || !userData) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      setError("Invalid user data");
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/student/enrollments",
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
          setCourses(responseData.data || []);
          setError(
            responseData.data.length === 0 ? "No enrolled courses found" : ""
          );
        } else {
          const errorData = await response.json();
          console.error(
            "Fetch Enrollments Failed:",
            response.status,
            errorData
          );
          setError(errorData.message || "Failed to load enrolled courses");
        }
      } catch (error) {
        console.error("Fetch Enrollments Error:", error);
        setError("Failed to connect to server");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

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
      const response = await fetch(
        `http://localhost:8000/student/feedback/${formData.course_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: formData.rating,
            feedback: formData.feedback || null,
            anonymous: formData.anonymous,
            userId: formData.anonymous ? null : user?.userId,
            userName: formData.anonymous
              ? null
              : `${user?.firstName} ${user?.lastName}`,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Feedback submitted successfully!");
        setFormData({
          course_id: "",
          rating: 0,
          feedback: "",
          anonymous: false,
        });
        setTouched({ course_id: false, rating: false });
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

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
        <StudentSidebar />
        <main className="flex-1 ml-0 lg:ml-72 p-6 sm:p-10 animate-fade-in">
          <style>
            {`
              .animate-fade-in {
                animation: fadeIn 0.3s ease-in-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
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
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight animate-fade-in">
              Course Feedback
            </h1>

            {error && (
              <div className="p-3 rounded-lg mb-6 shadow-sm text-base bg-red-100 text-red-700 border border-red-200 animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg mb-6 shadow-sm text-base bg-green-100 text-green-700 border border-green-200 animate-fade-in">
                {success}
              </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="course_id"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Select Course <span className="text-red-500">*</span>
                  </label>
                  {coursesLoading ? (
                    <p className="text-sm text-gray-500">Loading courses...</p>
                  ) : courses.length > 0 ? (
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
                    <p
                      id="course_id-error"
                      className="text-xs text-red-500 mt-1"
                    >
                      Please select a course.
                    </p>
                  )}
                </div>

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
                        className={`text-2xl transition-all duration-200 ${
                          formData.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-500"
                        }`}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        role="radio"
                        aria-checked={formData.rating === star}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  {touched.rating && !formData.rating && (
                    <p className="text-xs text-red-500 mt-1">
                      Please select a rating.
                    </p>
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

                <button
                  type="submit"
                  disabled={loading || !formData.course_id || coursesLoading}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ${
                    loading || !formData.course_id || coursesLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Submit feedback"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-pulse">Submitting...</span>
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default CourseFeedbackForm;
