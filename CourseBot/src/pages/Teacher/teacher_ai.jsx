import React, { useState } from "react";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaFilePdf,
  FaVideo,
  FaQuestionCircle,
  FaEdit,
  FaTrash,
  FaRobot,
  FaEye,
  FaDownload,
  FaClock,
  FaUsers,
} from "react-icons/fa";

import Cookie from "js-cookie";
import { Link } from "react-router-dom";
const CourseContentPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    file: null,
  });
  const [contentItems, setContentItems] = useState([
    {
      id: 1,
      title: "Advanced Java Guide",
      type: "pdf",
      views: 156,
      downloads: 89,
      duration: null,
      attempts: null,
      avgScore: null,
    },
    {
      id: 2,
      title: "OOP Concepts Lecture",
      type: "video",
      views: 234,
      duration: "32 min",
      downloads: null,
      attempts: null,
      avgScore: null,
    },
    {
      id: 3,
      title: "Midterm Quiz",
      type: "quiz",
      attempts: 45,
      avgScore: "78%",
      views: null,
      downloads: null,
      duration: null,
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setContentItems(contentItems.filter((item) => item.id !== id));
    }
  };

  // useEffect(() => {
  //   const token = Cookie.get("token");

  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookie.get("token");
    let formDataCopy = new FormData();
    formDataCopy.append("content_title", formData.title);
    formDataCopy.append("course_type", formData.type);
    formDataCopy.append("file", formData.file);
    const response = await fetch("http://localhost:8000/teacher/upoadcontent", {
      method: "POST",
      headers: {
        // accept: "application/json",
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      },
      // body: JSON.stringify({
      //   content_title: formData.title,
      //   course_type: formData.type,
      //   file: formData.file,
      // }),
      body: formDataCopy,
    });
    if (!response.ok) {
      alert("Failed to publish content. Please try again.");
      return;
    }
    const data = await response.json();
    console.log("Content published successfully:", data);
    // Add new content item to the state
    // Assuming the response contains the new content item
    // If the response does not contain the new item, you can create it manually
    // For simplicity, we will create a new item manually here
    // You can modify this part to use the response data if needed
    // if (!formData.title || !formData.type || !formData.file) {
    //   alert("Please fill in all fields before publishing.");
    //   return;
    // }
    // if (!["pdf", "video", "code_package", "quiz", "other_resource"].includes(formData.type.toLowerCase())) {
    //   alert("Invalid content type. Please select a valid type.");
    //   return;
    // }
    // if (!formData.file) {
    //   alert("Please upload a file before publishing.");
    //   return;
    // }
    // // Create a new content item
    // // Here we assume the new content item has an ID one greater than the current length
    // // of contentItems. Adjust this logic as needed based on your backend response.
    // if (contentItems.some(item => item.title === formData.title && item.type === formData.type.toLowerCase().replace(" ", "_"))) {
    //   alert("Content with the same title and type already exists.");
    //   return;
    // }
    const newContent = {
      id: contentItems.length + 1,
      title: formData.title,
      type: formData.type.toLowerCase().replace(" ", "_"),
      views: 0,
      downloads: 0,
      duration: null,
      attempts: null,
      avgScore: null,
    };
    setContentItems([...contentItems, newContent]);
    setFormData({ title: "", type: "", file: null });
    alert(
      `Content published successfully! ${formData.title},${formData.type},${formData.file} has been added.`
    );
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-[#2c3e50] text-white fixed h-full p-6 shadow-xl">
        <div className="sidebar-header pb-4 border-b border-white/10">
          <Link to="/teacher/dashboard" className="block ">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 cursor-pointer hover:text-cyan-50">
              <FaChalkboardTeacher />
              <span>Content</span>
            </h2>
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center gap-2 transition-all"
          >
            <FaPlus />
            <span>Add New Content</span>
          </button>
        </div>

        <div className="sidebar-content mt-4 space-y-3 overflow-y-auto">
          {contentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              <div
                className={`file-icon p-3 rounded-lg ${
                  item.type === "pdf"
                    ? "bg-red-500"
                    : item.type === "video"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
              >
                {item.type === "pdf" && <FaFilePdf size={20} />}
                {item.type === "video" && <FaVideo size={20} />}
                {item.type === "quiz" && <FaQuestionCircle size={20} />}
              </div>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <div className="text-sm text-white/80">
                  {item.type === "pdf" && <span>PDF Document</span>}
                  {item.type === "video" && <span>Video Lecture</span>}
                  {item.type === "quiz" && <span>Quiz/Assignment</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        {/* AI Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <FaRobot className="text-blue-500 text-2xl" />
          </div>
          <input
            type="text"
            placeholder="Search student queries or course content..."
            className="w-full pl-14 pr-6 py-4 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {contentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all relative"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>

              <div
                className={`card-icon mb-4 p-4 rounded-xl w-max ${
                  item.type === "pdf"
                    ? "bg-red-100 text-red-600"
                    : item.type === "video"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {item.type === "pdf" && <FaFilePdf size={32} />}
                {item.type === "video" && <FaVideo size={32} />}
                {item.type === "quiz" && <FaQuestionCircle size={32} />}
              </div>

              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {item.views && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaEye />
                    <span>{item.views} views</span>
                  </div>
                )}
                {item.downloads && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaDownload />
                    <span>{item.downloads} downloads</span>
                  </div>
                )}
                {item.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock />
                    <span>{item.duration}</span>
                  </div>
                )}
                {item.attempts && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers />
                    <span>{item.attempts} attempts</span>
                  </div>
                )}
                {item.avgScore && (
                  <div className="col-span-2 text-gray-600">
                    Average Score: {item.avgScore}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Content</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content Type
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value={"pdf"}>PDF Document</option>
                    <option value={"video"}>Video Lecture</option>
                    <option value={"quiz"}>Quiz/Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload File
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, file: e.target.files[0] })
                    }
                    className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Publish Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContentPage;
