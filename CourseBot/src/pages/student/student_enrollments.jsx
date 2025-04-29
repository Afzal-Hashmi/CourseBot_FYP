import React, { useEffect, useState } from "react";
import StudentSidebar from "./student_sidebar";
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

const dummyEnrollments = [
  {
    id: 1,
    title: "Introduction to Web Development",
    professor: "Prof. Afzal",
    date: "01 Sep 2023",
  },
  {
    id: 2,
    title: "Python Programming Basics",
    professor: "Dr. Yousaf",
    date: "15 Aug 2023",
  },
  {
    id: 3,
    title: "Mobile App Development",
    professor: "Prof. Hamid",
    date: "20 Aug 2023",
  },
];

const MyEnrollments = () => {
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(dummyEnrollments);

  useEffect(() => {
    setFilteredCourses(
      dummyEnrollments.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleEnrollClick = () => {
    window.location.href = "enroll_page.html";
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
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <div className="text-gray-600 my-4">
                <p className="flex items-center gap-2">
                  <FaUserTie /> {course.professor}
                </p>
                <p>Enrollment Date: {course.date}</p>
              </div>
              <button
                className="w-full py-2 bg-[#3498db] text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
                onClick={handleEnrollClick}
              >
                <FaPlus /> Open Course
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyEnrollments;
