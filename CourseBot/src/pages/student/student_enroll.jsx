import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaImage, FaArrowLeft, FaUserTie, FaEnvelope } from "react-icons/fa";

const Enroll = ({ course_id, onBack }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setMessage("");
      const token = Cookies.get("token");
      const role = Cookies.get("role");

      if (!token || role !== "student") {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/student/fetchCourse/${course_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setCourse(responseData.data || null);
        } else {
          console.error("Error fetching course.");
          setMessage("Unable to fetch course details.");
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [navigate, course_id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setMessage("");
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        `http://localhost:8000/student/enrollcourse/${course_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage("Successfully enrolled in the course!");
        setTimeout(() => {
          navigate(`/student/ai/${course_id}`);
        }, 2000); // 2-second delay
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to enroll in the course.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during enrollment.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2 transition-all duration-200 transform hover:scale-105 mb-2 sm:mb-3"
            aria-label="Back to course list"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-left">
            {course ? course.course_name : "Course Details"}
          </h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg mb-3 sm:mb-4 shadow-sm text-base animate-fade ${
              message.includes("Successfully")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            } transition-all duration-300`}
          >
            {message}
          </div>
        )}

        {/* Course Card */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Left: Course Details Skeleton */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse">
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="w-full sm:max-w-80 h-48 sm:h-64 bg-gray-200 rounded-lg mb-3"></div>
              <div className="space-y-2 mb-3">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-5/6"></div>
                <div className="h-5 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            {/* Right: Sidebar Skeleton */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        ) : course ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Left: Course Details */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 animate-fade">
              {/* Thumbnail */}
              <div className="mb-3 sm:mb-4">
                {course.course_image ? (
                  <img
                    src={course.course_image}
                    alt={`${course.course_name} Thumbnail`}
                    className="w-full sm:max-w-80 h-auto rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <FaImage className="w-full sm:max-w-80 h-48 sm:h-64 text-gray-300" />
                )}
              </div>

              {/* Description */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 text-left">
                  About This Course
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-prose leading-relaxed whitespace-pre-wrap break-words text-left">
                  {course.course_description}
                </p>
              </div>

              {/* Last Updated */}
              <p className="text-sm text-gray-500 text-left">
                Last Updated: {new Date(course.updated_at).toLocaleDateString()}
              </p>
            </div>

            {/* Right: Sidebar (Teacher Details + Enroll Button) */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 text-left">
                Instructor Details
              </h3>
              <div className="grid grid-cols-1 gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <FaUserTie className="text-purple-600" />
                  <span>{course.teacher_name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <FaEnvelope className="text-purple-600" />
                  <span>{course.teacher_email || "N/A"}</span>
                </div>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 enroll-button"
                aria-label={`Enroll in ${course.course_name}`}
              >
                {enrolling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enrolling...
                  </>
                ) : (
                  "Enroll Now"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-left text-gray-500 text-base animate-fade">
            Course not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Enroll;
