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
  FaSearch,
  FaFileAlt,
  FaFileVideo,
  FaFileCode,
  FaPoll,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaCommentAlt,
} from "react-icons/fa";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";

const CourseContentPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    file: null,
  });
  const [expandedSections, setExpandedSections] = useState({
    filters: true,
    recent: true,
    chats: true,
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
      date: "2023-10-15",
      url: "https://example.com/advanced-java-guide.pdf",
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
      date: "2023-10-10",
      url: "https://example.com/oop-concepts-lecture.mp4",
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
      date: "2023-10-05",
      url: "https://example.com/midterm-quiz",
    },
    {
      id: 4,
      title: "Spring Framework Tutorial",
      type: "pdf",
      views: 189,
      downloads: 102,
      duration: null,
      attempts: null,
      avgScore: null,
      date: "2023-09-28",
      url: "https://example.com/spring-framework-tutorial.pdf",
    },
    {
      id: 5,
      title: "Database Design Video",
      type: "video",
      views: 312,
      duration: "45 min",
      downloads: null,
      attempts: null,
      avgScore: null,
      date: "2023-09-20",
      url: "https://example.com/database-design-video.mp4",
    },
  ]);

  const recentChats = [
    { id: 1, title: "AI Content Ideas", date: "2025-06-14" },
    { id: 2, title: "Quiz Generation", date: "2025-06-13" },
    { id: 3, title: "Course Outline Help", date: "2025-06-12" },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setContentItems(contentItems.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookie.get("token");

    if (!formData.title || !formData.type || !formData.file) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    let formDataToSend = new FormData();
    formDataToSend.append("content_title", formData.title); // Match backend field name
    formDataToSend.append("content_type", formData.type);
    formDataToSend.append("file", formData.file);

    try {
      const response = await fetch(
        "http://localhost:8000/teacher/uploadcontent",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Failed to publish content: ${
            errorData.message || response.statusText
          }`
        );
        console.error("Failed to publish content:", errorData);
        return;
      }

      const data = await response.json();

      const newContent = {
        id: contentItems.length + 1,
        title: formData.title,
        type: formData.type.toLowerCase(),
        views: 0,
        downloads: 0,
        duration: null,
        attempts: null,
        avgScore: null,
        date: new Date().toISOString().split("T")[0],
        url: URL.createObjectURL(formData.file), // Mock URL for new content
      };

      setContentItems([...contentItems, newContent]);
      setFormData({ title: "", type: "", file: null });
      setShowModal(false);
      alert(
        `Content published successfully! "${newContent.title}" has been added.`
      );
    } catch (error) {
      console.error("Error publishing content:", error);
      alert(
        "An error occurred while publishing content. Please check console for details."
      );
    }
  };

  const handleCardClick = (item) => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else if (item.file) {
      const url = URL.createObjectURL(item.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getTypeIcon = (type, size = 16) => {
    switch (type) {
      case "pdf":
        return <FaFilePdf size={size} />;
      case "video":
        return <FaVideo size={size} />;
      case "quiz":
        return <FaQuestionCircle size={size} />;
      case "code":
        return <FaFileCode size={size} />;
      default:
        return <FaFileAlt size={size} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "pdf":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-100",
          hover: "hover:bg-red-100",
          gradient: "from-red-50 to-red-100",
        };
      case "video":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-100",
          hover: "hover:bg-blue-100",
          gradient: "from-blue-50 to-blue-100",
        };
      case "quiz":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          border: "border-yellow-100",
          hover: "hover:bg-yellow-100",
          gradient: "from-yellow-50 to-yellow-100",
        };
      case "code":
        return {
          bg: "bg-purple-50",
          text: "text-purple-600",
          border: "border-purple-100",
          hover: "hover:bg-purple-100",
          gradient: "from-purple-50 to-purple-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-100",
          hover: "hover:bg-gray-100",
          gradient: "from-gray-50 to-gray-100",
        };
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "pdf":
        return "PDF";
      case "video":
        return "Video";
      case "quiz":
        return "Quiz";
      case "code":
        return "Code";
      default:
        return "Resource";
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const filteredContent = contentItems
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white fixed h-full p-6 shadow-2xl flex flex-col z-20">
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 8px;
              transition: background 0.3s;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
            .animate-bounce-slow {
              animation: bounce 3s infinite;
            }
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-5px);
              }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-slide-up {
              animation: slideUp 0.3s ease-in-out;
            }
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .group:hover .group-hover\\:scale-105 {
              transform: scale(1.05);
            }
            .tooltip {
              visibility: hidden;
              opacity: 0;
              transition: opacity 0.2s ease-in-out;
            }
            .group:hover .tooltip {
              visibility: visible;
              opacity: 1;
            }
          `}
        </style>
        <div className="pb-4 border-b border-gray-700">
          <Link to="/teacher/dashboard" className="block">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 cursor-pointer hover:text-blue-300 transition-colors">
              <FaChalkboardTeacher className="text-blue-400" size={24} />
              <span>Course Hub</span>
            </h2>
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm font-semibold transform hover:scale-105"
          >
            <FaPlus size={14} />
            <span>Add New Content</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar">
          {/* Filters Section */}
          <div className="mb-8">
            <div
              className="flex justify-between items-center cursor-pointer py-3 text-gray-300 hover:text-white transition-colors"
              onClick={() => toggleSection("filters")}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Content Filters
              </h3>
              {expandedSections.filters ? (
                <FaChevronUp size={12} className="text-gray-400" />
              ) : (
                <FaChevronDown size={12} className="text-gray-400" />
              )}
            </div>
            {expandedSections.filters && (
              <div className="space-y-2 mt-3">
                {[
                  {
                    key: "all",
                    label: "All Content",
                    icon: FaFileAlt,
                    color: "blue",
                  },
                  {
                    key: "pdf",
                    label: "PDF Documents",
                    icon: FaFilePdf,
                    color: "red",
                  },
                  {
                    key: "video",
                    label: "Video Lectures",
                    icon: FaFileVideo,
                    color: "blue",
                  },
                  {
                    key: "quiz",
                    label: "Quizzes",
                    icon: FaPoll,
                    color: "yellow",
                  },
                  {
                    key: "code",
                    label: "Code Packages",
                    icon: FaFileCode,
                    color: "purple",
                  },
                ].map((filter) => {
                  const isActive = activeFilter === filter.key;
                  const bgColor = isActive
                    ? `bg-${filter.color}-700`
                    : "hover:bg-gray-700";
                  return (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-medium ${bgColor} ${
                        isActive ? "text-white" : "text-gray-200"
                      } shadow-sm hover:shadow-md`}
                    >
                      <filter.icon
                        size={14}
                        className={
                          isActive ? "text-white" : `text-${filter.color}-300`
                        }
                      />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Content Section */}
          <div className="mb-8">
            <div
              className="flex justify-between items-center cursor-pointer py-3 text-gray-300 hover:text-white transition-colors"
              onClick={() => toggleSection("recent")}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Recent Content
              </h3>
              {expandedSections.recent ? (
                <FaChevronUp size={12} className="text-gray-400" />
              ) : (
                <FaChevronDown size={12} className="text-gray-400" />
              )}
            </div>
            {expandedSections.recent && (
              <div className="space-y-2 mt-3 max-h-64 overflow-y-auto custom-scrollbar">
                {contentItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all cursor-pointer text-sm group"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        getTypeColor(item.type).bg
                      } ${getTypeColor(item.type).text}`}
                    >
                      {getTypeIcon(item.type, 14)}
                    </div>
                    <div className="truncate flex-1">
                      <h4 className="font-medium truncate text-gray-100 group-hover:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Chats Section */}
          <div className="mb-8">
            <div
              className="flex justify-between items-center cursor-pointer py-3 text-gray-300 hover:text-white transition-colors"
              onClick={() => toggleSection("chats")}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Recent Chats
              </h3>
              {expandedSections.chats ? (
                <FaChevronUp size={12} className="text-gray-400" />
              ) : (
                <FaChevronDown size={12} className="text-gray-400" />
              )}
            </div>
            {expandedSections.chats && (
              <div className="space-y-2 mt-3 max-h-64 overflow-y-auto custom-scrollbar">
                {recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all cursor-pointer text-sm group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FaCommentAlt size={14} />
                    </div>
                    <div className="truncate flex-1">
                      <h4 className="font-medium truncate text-gray-100 group-hover:text-white">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(chat.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Course Content
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Curate and manage your teaching resources with ease.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search content..."
              className="pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all shadow-md hover:shadow-lg bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Total Content",
              value: contentItems.length,
              icon: FaFileAlt,
              color: "blue",
            },
            {
              label: "PDF Documents",
              value: contentItems.filter((item) => item.type === "pdf").length,
              icon: FaFilePdf,
              color: "red",
            },
            {
              label: "Video Lectures",
              value: contentItems.filter((item) => item.type === "video")
                .length,
              icon: FaVideo,
              color: "blue",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between transform hover:scale-105 transition-transform"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </section>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group border ${
                  getTypeColor(item.type).border
                } cursor-pointer transform hover:scale-105`}
                onClick={() => handleCardClick(item)}
              >
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="relative group/button">
                    <button
                      className={`p-1.5 rounded-full bg-white/90 text-blue-600 ${
                        getTypeColor(item.type).hover
                      } shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-110`}
                      title="Edit"
                      onClick={(e) => e.stopPropagation()} // Prevent card click
                    >
                      <FaEdit size={12} />
                    </button>
                    <span className="tooltip absolute top-full mt-1 right-0 bg-gray-800 text-white text-xs rounded-md px-2 py-1">
                      Edit
                    </span>
                  </div>
                  <div className="relative group/button">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDelete(item.id);
                      }}
                      className={`p-1.5 rounded-full bg-white/90 text-red-600 ${
                        getTypeColor(item.type).hover
                      } shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-110`}
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                    <span className="tooltip absolute top-full mt-1 right-0 bg-gray-800 text-white text-xs rounded-md px-2 py-1">
                      Delete
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex items-center gap-3">
                  <div
                    className={`p-2 rounded-md ${getTypeColor(item.type).bg} ${
                      getTypeColor(item.type).text
                    }`}
                  >
                    {getTypeIcon(item.type, 16)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-medium text-gray-800 truncate"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTypeLabel(item.type)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="p-4 inline-block bg-gray-100 rounded-full mb-4">
                <FaFileAlt size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                No content found
              </h3>
              <p className="text-md text-gray-500 mb-6">
                {searchQuery
                  ? `No content matches your search for "${searchQuery}"`
                  : activeFilter !== "all"
                  ? `You haven't uploaded any ${activeFilter} content yet.`
                  : "You haven't uploaded any content yet. Start by adding a new resource!"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-md font-semibold mx-auto"
              >
                <FaPlus size={14} />
                <span>Add New Content</span>
              </button>
            </div>
          </div>
        )}

        {/* AI Search Bar */}
        <section className="mt-12 max-w-4xl mx-auto">
          <div className="relative bg-white rounded-full shadow-xl p-2 border border-blue-100 overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaRobot className="text-blue-500 text-xl animate-bounce-slow" />
            </div>
            <input
              type="text"
              placeholder="Ask AI about your course content or generate new ideas..."
              className="w-full pl-12 pr-16 py-3 focus:outline-none bg-transparent rounded-full text-md text-gray-700 placeholder-gray-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
              <FaSearch size={16} />
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Powered by AI to enhance content creation and discovery.
          </p>
        </section>
      </main>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative animate-slide-up">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Content
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="contentTitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contentTitle"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm shadow-sm"
                  placeholder="e.g., Introduction to React Hooks"
                />
              </div>

              <div>
                <label
                  htmlFor="contentType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="contentType"
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm shadow-sm bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video Lecture</option>
                  <option value="quiz">Quiz/Assignment</option>
                  <option value="code">Code Package</option>
                  <option value="other">Other Resource</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-gray-200 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a2 2 0 00-2 2v28a2 2 0 002 2h24a2 2 0 002-2V16m-4-4l-4-4H28v4m0 0h-8M12 28h8m-8 4h12m-12 4h16m-4-10v-4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 text-sm"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file"
                          type="file"
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              file: e.target.files[0],
                            })
                          }
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 text-gray-500">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formData.type === "pdf" && "PDF files up to 25MB"}
                      {formData.type === "video" &&
                        "MP4, MOV, WEBM files up to 500MB"}
                      {formData.type === "quiz" &&
                        "DOCX, PDF, XLSX files up to 10MB"}
                      {formData.type === "code" &&
                        "ZIP, TAR.GZ, or individual files up to 50MB"}
                      {formData.type === "other" && "Any file type up to 100MB"}
                      {!formData.type &&
                        "Select a type to see file requirements"}
                    </p>
                  </div>
                </div>
                {formData.file && (
                  <div className="mt-2 text-sm text-gray-700 text-center">
                    Selected:{" "}
                    <span className="font-medium">{formData.file.name}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-semibold transform hover:scale-105"
                >
                  <FaPlus size={14} />
                  <span>Publish Content</span>
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
