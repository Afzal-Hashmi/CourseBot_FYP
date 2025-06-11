import React, { useEffect, useState } from "react";
import StudentSidebar from "./student_sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ResponsiveAvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy API to simulate course data
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!token || Cookies.get("role") !== "student") {
      navigate("/");
    } else {
      if (user) {
        async function fetchCourses() {
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

          if (!response.ok) {
            console.error("Failed to fetch courses");
            setLoading(false);
            return;
          }
          const responseData = await response.json();

          setCourses(responseData.data);
          setUser(user);
          setLoading(false);
        }
        fetchCourses();
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        <h1 className="text-3xl font-semibold">Available Courses</h1>

        <table className="min-w-full bg-white rounded-lg shadow-lg mt-6 border-radius-lg overflow-hidden">
          <thead className="bg-[#2c3e50] text-white">
            <tr>
              <th className="py-4 px-6 ">Course Name</th>
              <th className="py-4 px-6 ">Instructor</th>
              <th className="py-4 px-6 ">Contact</th>
              <th className="py-4 px-6 ">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-16 text-center text-lg text-gray-500"
                >
                  Loading courses...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-16 text-gray-500">
                  No courses available at the moment.
                </td>
              </tr>
            ) : (
              courses?.map((course) => (
                <tr
                  key={course.course_id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-4 px-6">{course.course_name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">
                          {course.teacher_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.teacher_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="bg-[#2c3e50] text-white p-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-200">
                      <i className="fas fa-envelope"></i>
                      <a
                        href={`mailto:${course.teacher_email}?subject=Inquiry Regarding Your Course: ${course.course_name}&body=Hello ${course.teacher_name},%0D%0A%0D%0AI would like to inquire about the course: ${course.course_name}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="email-button"
                      >
                        Contact Us
                      </a>
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    {course.updated_at.split(" ")[0]}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveAvailableCourses;
