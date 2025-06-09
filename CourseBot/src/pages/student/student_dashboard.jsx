// CourseEnrollment.jsx

import React from "react";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [userDetail, setUser] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (event) => {
    if (!event.target.closest(".enroll-btn")) {
      window.location.href = "enroll_page.html";
    }
  };

  const handleEnrollClick = async (event, id) => {
    event.preventDefault();
    fetch(`http://localhost:8000/student/enrollcourse/${id}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Successfully enrolled in the course!");
        }
      })
      .catch((error) => {
        console.error("Error enrolling in course:", error);
        alert(
          "An error occurred while enrolling in the course. Please try again."
        );
      });
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!token || !Cookies.get("role") === "student") {
      navigate("/");
    } else {
      if (user) {
        setUser(user);
        const fetchCourses = async () => {
          setLoading(true);
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
          setLoading(false);
        };

        fetchCourses();
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      {/* Main Content */}
      <div className="ml-70 p-8 w-[calc(100%-250px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
          {/* <p className="text-gray-600 mb-4">Welcome! {userDetail?.firstName}</p> */}

          {/* Search Bar */}
          <div className="flex items-center gap-4 bg-white border-2 border-blue-500 rounded-full p-4 mb-8">
            <FaSearch />
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 outline-none border-none text-lg"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="px-6 py-2 border-2 border-blue-500 rounded-full bg-blue-500 text-white">
              All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center text-3xl justify-center ">
            Loading...
          </div>
        ) : courses.length === 0 ? (
          <div className="flex items-center justify-center ml-auto mr-auto text-2xl">
            No Courses Available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div
                key={course.id || idx}
                className="bg-white rounded-lg p-6 shadow-md hover:-translate-y-1 transition cursor-pointer relative overflow-hidden"
                onClick={handleCardClick}
              >
                <a href="enroll_page.html" className="absolute inset-0 z-0"></a>
                <div className="h-44 bg-gray-200 rounded-md overflow-hidden mb-4">
                  <img
                    src="https://via.placeholder.com/400x250"
                    alt={course.course_name || "Course"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{course.course_name}</h3>
                <p className="text-gray-600">
                  {course.course_description || "Learn more about this course"}
                </p>
                <div className="flex justify-between text-gray-600 my-4">
                  <span className="flex items-center gap-2">
                    <FaUserTie />
                    {course.teacher_name || "Instructor"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 my-4">
                  <span className="text-gray-500 text-sm flex item-center gap-2 align-center">
                    <FaCog />
                    {course.updated_at.split(" ")[0]}
                  </span>
                </div>
                <button
                  className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center gap-2 enroll-btn relative z-10"
                  onClick={(event) =>
                    handleEnrollClick(event, course.course_id)
                  }
                >
                  <FaPlus /> Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
