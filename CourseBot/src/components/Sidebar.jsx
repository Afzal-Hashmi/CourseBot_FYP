// src/components/Sidebar.jsx
import { FaRobot } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-full md:w-2/5 bg-[#2c3e50] text-white p-8 flex flex-col">
      <div className="flex items-center gap-2 text-2xl mb-12">
        <FaRobot className="text-[#3498db]" />
        CourseBot
      </div>
      <h1 className="text-4xl font-semibold mb-4">
        Start Your Learning Journey
      </h1>
      <p>
        Joins Thousands of Students and Teachers <strong>Worldwide</strong>
      </p>
    </div>
  );
};

export default Sidebar;
