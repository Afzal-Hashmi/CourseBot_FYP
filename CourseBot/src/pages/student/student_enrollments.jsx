import React, { useEffect, useState } from "react";
import StudentSidebar from "./student_sidebar";
import { FaSearch, FaUserTie, FaPlus, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const MyEnrollments = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token || Cookies.get("role") !== "student") {
      navigate("/");
      return;
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
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
          setCourses(data.data);
          setFilteredCourses(data.data);
          setLoading(false);
        } else {
          console.error("Failed to fetch courses");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    };

    fetchEnrollments();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.course_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [search]);

  const handleEnrollClick = () => {
    window.location.href = "enroll_page.html";
  };

  const handleDeleteEnrollment = async (e, enrollmentId) => {
    e.preventDefault();

    fetch(`http://localhost:8000/student/unenrollcourse/${enrollmentId}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => {
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
          alert("Failed to delete enrollment. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting enrollment:", error);
        alert("An error occurred while deleting the enrollment.");
      });
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="ml-70 w-[calc(100%-16rem)] p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">My Enrollments</h1>
          <div className="flex items-center gap-4 bg-white border-2 border-[#3498db] px-4 py-3 rounded-full w-full">
            <FaSearch />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enrolled courses..."
              className="w-full outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">
              No courses found. Please enroll in some courses.
            </div>
          ) : (
            filteredCourses?.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold">{course.course_name}</h3>
                <div className="text-gray-600 my-4">
                  <p className="flex items-center gap-2">
                    <FaUserTie /> {course.teacher_name}
                  </p>
                  <p>
                    Enrollment Date:{" "}
                    {new Date(course.enrolled_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <button
                    className="w-full py-2 bg-[#3498db] text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
                    onClick={handleEnrollClick}
                  >
                    <FaPlus /> Open Course
                  </button>
                  <button
                    className="w-full py-2 bg-[#e13636] text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
                    onClick={(event) =>
                      handleDeleteEnrollment(event, course.enrollment_id)
                    }
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyEnrollments;
