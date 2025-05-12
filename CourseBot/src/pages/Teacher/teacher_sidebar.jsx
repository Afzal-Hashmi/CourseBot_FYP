// import React from "react";
// import {
//   FaRobot,
//   FaHome,
//   FaBookOpen,
//   FaUsers,
//   FaCog,
//   FaSignOutAlt,
//   FaPlus,
//   FaUserFriends,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const TeacherSidebar = () => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     Cookies.remove("token", { path: "/teacher" });
//     Cookies.remove("user", { path: "/teacher" });
//     Cookies.remove("role", { path: "/teacher" });
//     navigate("/");
//   };
//   return (
//     <div className="w-70 bg-[#2c3e50] text-white fixed h-full p-8">
//       <div className="flex items-center gap-2 text-xl font-bold mb-12">
//         <FaRobot className="text-blue-500" />
//         <span>CourseBot</span>
//       </div>
//       <ul className="space-y-4">
//         <li>
//           <a
//             href="/teacher/dashboard"
//             className="flex items-center gap-3 text-lg hover:text-blue-400"
//           >
//             <FaHome />
//             <span>Dashboard</span>
//           </a>
//         </li>
//         <li>
//           <a
//             href="/teacher/myCourses"
//             className="flex items-center gap-3 text-lg hover:text-blue-400"
//           >
//             <FaBookOpen />
//             <span>My Courses</span>
//           </a>
//         </li>
//         <li>
//           <a
//             href="/teacher/students-management"
//             className="flex items-center gap-3 text-lg hover:text-blue-400"
//           >
//             <FaUsers />
//             <span>Students</span>
//           </a>
//         </li>
//         <li>
//           <a
//             href="/teacher/profile"
//             className="flex items-center gap-3 text-lg hover:text-blue-400"
//           >
//             <FaCog />
//             <span>Profile</span>
//           </a>
//         </li>
//         <li>
//           <a
//             href="/"
//             className="flex items-center gap-3 text-lg hover:text-blue-400"
//           >
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </a>
//         </li>
//       </ul>
//     </div>
//   );
// };
// export default TeacherSidebar;

import React from "react";
import {
  FaRobot,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TeacherSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token", { path: "/teacher" });
    Cookies.remove("user", { path: "/teacher" });
    Cookies.remove("role", { path: "/teacher" });
    if (!Cookies.get("token") && !Cookies.get("user") && !Cookies.get("role")) {
      console.log("Logout successful! Redirecting...");
      navigate("/");
    } else {
      console.error("Logout failed. Cookies still exist.");
    }
  };

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: <FaBookOpen />, label: "My Courses", path: "/teacher/myCourses" },
    {
      icon: <FaUsers />,
      label: "Students",
      path: "/teacher/students-management",
    },
    { icon: <FaCog />, label: "Profile", path: "/teacher/profile" },
  ];

  return (
    <div className="w-64 bg-[#2c3e50] text-white fixed h-full p-8">
      {/* Logo and Title */}
      <div className="flex items-center gap-2 text-xl font-bold mb-12">
        <FaRobot className="text-blue-500" />
        <span>CourseBot</span>
      </div>

      {/* Menu List */}
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer flex items-center gap-3 text-lg hover:text-blue-400"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
        {/* Logout */}
        <li
          className="cursor-pointer flex items-center gap-3 text-lg hover:text-blue-400"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;
