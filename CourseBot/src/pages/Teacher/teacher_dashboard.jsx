import React, { useState, useEffect } from "react";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TeacherSidebar from "./teacher_sidebar"; // Adjust path as needed

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

class ErrorBoundary extends React.Component {
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
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
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

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    course_name: "",
    course_description: "",
    file: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
    const role = Cookies.get("role");

    if (!token || role !== "teacher" || !userData) {
      setError("Authentication required");
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser.firstName) throw new Error("Invalid user data");
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setError("Invalid user data");
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      try {
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
          setCourses(responseData.data || []);
          setMessage(responseData.data.length === 0 ? "No courses found" : "");
        } else {
          const errorData = await response.json();
          console.error("Fetch Courses Failed:", response.status, errorData);
          setMessage(errorData.message || "Failed to load courses");
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Fetch Courses Error:", error);
        setMessage("Failed to connect to server");
        setError(error.message);
        setCourses([
          {
            id: 1,
            course_name: "Math 101",
            course_description: "Introduction to Mathematics",
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    };

    const fetchFeedbackCount = async () => {
      try {
        const response = await fetch("http://localhost:8000/teacher/feedback", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFeedbackCount(data.data?.length || 0);
        } else {
          console.error("Fetch Feedback Failed:", response.status);
          setFeedbackCount(0);
        }
      } catch (error) {
        console.error("Fetch Feedback Error:", error);
        setFeedbackCount(5);
      }
    };

    Promise.all([fetchCourses(), fetchFeedbackCount()]).finally(() =>
      setLoading(false)
    );

    // Debug card alignment
    const logCardHeights = () => {
      document.querySelectorAll(".course-card").forEach((card, i) => {});
    };
    setTimeout(logCardHeights, 1000); // Log after render
  }, [navigate, courses]);

  const navigateToAIScreen = (courseId) => {
    navigate(`/teacher/ai/${courseId}`);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
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
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        setCourses([...courses, responseData.data]);
        setModal(false);
        setFormData({ course_name: "", course_description: "", file: null });
        setMessage("Course created successfully!");
      } else {
        console.error("Create Course Failed:", responseData);
        setMessage(responseData.message || "Failed to create course.");
      }
    } catch (error) {
      console.error("Create Course Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      days.push(
        date.toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }
    return days;
  };

  const days = getLast7Days();
  const courseCounts = days.map(
    (day) =>
      courses.filter((c) => {
        const courseDate = new Date(c.updated_at);
        return courseDate instanceof Date && !isNaN(courseDate)
          ? courseDate.toLocaleString("default", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) === day
          : false;
      }).length
  );

  const lineData = {
    labels: days.map((day) => day.split(" ")[1]),
    datasets: [
      {
        label: "Courses Created",
        data: courseCounts,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#1f2937", font: { size: 12, family: "Inter" } },
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#1f2937", font: { size: 10, family: "Inter" } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#1f2937",
          stepSize: 1,
          font: { size: 10, family: "Inter" },
        },
        grid: { color: "#e5e7eb" },
      },
    },
    animation: { duration: 1000 },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#1f2937", font: { size: 12, family: "Inter" } },
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#1f2937",
          font: { size: 10, family: "Inter" },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#1f2937",
          stepSize: 10,
          font: { size: 10, family: "Inter" },
        },
        grid: { color: "#e5e7eb" },
      },
    },
    animation: { duration: 1000 },
  };

  const highlightCourseDates = ({ date, view }) => {
    if (view !== "month") return null;
    const formattedDate = date.toLocaleString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const hasCourse = courses.some((c) => {
      const courseDate = new Date(c.updated_at);
      return courseDate instanceof Date && !isNaN(courseDate)
        ? courseDate.toLocaleString("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) === formattedDate
        : false;
    });
    return hasCourse ? (
      <div className="w-2 h-2 bg-indigo-600 rounded-full mx-auto mt-1" />
    ) : null;
  };

  if (error && !loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-100 font-sans">
        <TeacherSidebar />
        <main className="flex-1 ml-0 lg:ml-80 p-6 sm:p-8">
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              .font-sans { font-family: 'Inter', sans-serif; }
              .animate-fade-in {
                animation: fadeIn 0.5s ease-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-slide-up {
                animation: slideUp 0.5s ease-out;
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .course-card {
                perspective: 1000px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .course-card:hover {
                transform: perspective(1000px) rotateX(2deg) rotateY(2deg) scale(1.05);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
              }
              .react-calendar {
                border: none !important;
                border-radius: 1rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                background: white;
                padding: 1rem;
                font-family: 'Inter', sans-serif;
              }
              .react-calendar__tile--active {
                background: #4f46e5 !important;
                color: white !important;
                border-radius: 0.5rem;
              }
              .react-calendar__tile--now {
                background: #e0e7ff !important;
                border-radius: 0.5rem;
              }
              .react-calendar__navigation button {
                color: #1f2937;
                font-weight: 600;
                font-size: 0.875rem;
              }
            `}
          </style>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome,{" "}
              <span className="text-indigo-600">
                {user ? user.firstName : "Teacher"}!
              </span>
            </h1>
            <button
              onClick={() => setModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm font-semibold"
            >
              <FaPlus className="text-sm" />
              Create New Course
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl shadow-sm animate-slide-up ${
                message.includes("Failed")
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-green-50 text-green-700 border border-green-100"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Statistics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col transition-all duration-200 gap-4 animate-slide-up">
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up">
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-xl font-bold text-indigo-600">
                    {courses.length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up">
                  <p className="text-sm font-medium text-gray-600">
                    Feedback Received
                  </p>
                  <p className="text-xl font-bold text-indigo-600">
                    {feedbackCount}
                  </p>
                </div>
              </div>
              {courses.length > 0 && (
                <>
                  <div
                    className="bg-white p-4 rounded-xl shadow-sm col-span-2 animate-slide-up w-80 h-full"
                    role="img"
                    aria-label="Courses created by day line graph"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Courses Created (Last 7 Days)
                    </h3>
                    <Line data={lineData} options={lineOptions} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="flex items-center justify-center h-64 col-span-full">
                <p className="text-gray-500 text-lg font-medium">
                  Loading courses...
                </p>
              </div>
            ) : courses.length > 0 ? (
              courses.map((c, index) => (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer course-card min-h-[400px] flex flex-col"
                  onClick={() => navigateToAIScreen(c.id)}
                >
                  <div className="h-48 rounded-xl mb-3 overflow-hidden relative">
                    {c.course_image ? (
                      <img
                        src={c.course_image}
                        alt={c.course_name}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent rounded-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 flex-shrink-0">
                    {c.course_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                    {c.course_description}
                  </p>
                  <div className="flex justify-end text-gray-500 text-sm mt-auto">
                    <p className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-indigo-600 text-xs" />
                      {c.updated_at?.split(" ")[0] || "N/A"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 col-span-full">
                <p className="text-gray-500 text-lg font-medium">
                  No Courses Available
                </p>
              </div>
            )}
          </div>

          {modal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Create New Course
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Enter course title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="course_description"
                      value={formData.course_description}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Enter course description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Thumbnail
                    </label>
                    <input
                      type="file"
                      name="file"
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 text-sm font-medium hover:scale-105"
                    >
                      {loading ? "Creating..." : "Create Course"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default TeacherDashboard;
