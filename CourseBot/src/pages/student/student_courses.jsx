import React, { useEffect, useState } from "react";
import StudentSidebar from "./student_sidebar";

const ResponsiveAvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy API to simulate course data
  const fetchCourses = async () => {
    try {
      // Simulating API call with setTimeout
      const dummyData = [
        {
          courseName: "Web Development 101",
          instructorName: "Prof. Sarah Johnson",
          instructorEmail: "sarah.johnson@university.edu",
          day: "Monday",
        },
        {
          courseName: "Python Fundamentals",
          instructorName: "Dr. Michael Chen",
          instructorEmail: "michael.chen@university.edu",
          day: "Tuesday",
        },
        {
          courseName: "Data Science Basics",
          instructorName: "Dr. Emily Wilson",
          instructorEmail: "emily.wilson@university.edu",
          day: "Wednesday",
        },
        {
          courseName: "Advanced Mathematics",
          instructorName: "Prof. James Smith",
          instructorEmail: "james.smith@university.edu",
          day: "Thursday",
        },
      ];
      setTimeout(() => {
        setCourses(dummyData);
        setLoading(false);
      }, 1000); // Simulating a delay
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-70 p-8">
        <h1 className="text-3xl font-semibold">Available Courses</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg text-gray-500">Loading courses...</span>
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg mt-6 border-radius-lg overflow-hidden">
            <thead className="bg-[#2c3e50] text-white">
              <tr>
                <th className="py-4 px-6 ">Course Name</th>
                <th className="py-4 px-6 ">Instructor</th>
                <th className="py-4 px-6 ">Contact</th>
                <th className="py-4 px-6 ">Day</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-4 px-6">{course.courseName}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">
                          {course.instructorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.instructorEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="bg-[#2c3e50] text-white p-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-200">
                      <i className="fas fa-envelope"></i> Message
                    </button>
                  </td>
                  <td className="py-4 px-6">{course.day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ResponsiveAvailableCourses;
