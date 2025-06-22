import React, { useState, useEffect } from "react";
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
import { Link, useParams, useNavigate } from "react-router-dom";

const CourseContentPageStudent = () => {
  const { course_id } = useParams(); // Fetch course_id from URL
  const navigate = useNavigate();
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
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Static fallback content
  const staticContentItems = [
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
  ];

  const recentChats = [
    { id: 1, title: "AI Content Ideas", date: "2025-06-14" },
    { id: 2, title: "Quiz Generation", date: "2025-06-13" },
    { id: 3, title: "Course Outline Help", date: "2025-06-12" },
  ];

  useEffect(() => {
    const fetchCourseContent = async () => {
      const token = Cookie.get("token");
      const role = Cookie.get("role");

      if (!token || role !== "student") {
        navigate("/");
        return;
      }

      if (!course_id) {
        setError("Course ID not provided.");
        setContentItems(staticContentItems);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:8000/student/courseContent/${course_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setContentItems(responseData.data || staticContentItems);
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || `Failed to fetch course content.${course_id}`
          );
          setContentItems(staticContentItems);
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching course content.");
        setContentItems(staticContentItems);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [course_id, navigate]);

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
          <Link to="/student/dashboard" className="block">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 cursor-pointer hover:text-blue-300 transition-colors">
              <FaChalkboardTeacher className="text-blue-400" size={24} />
              <span>Course Hub</span>
            </h2>
          </Link>
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
                    onClick={() => handleCardClick(item)}
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
              Course ID: {course_id || "N/A"}
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

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg mb-6 shadow-sm text-base bg-red-100 text-red-700 border border-red-200 animate-fade-in">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-200 h-8 w-8"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <>
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
                  value: contentItems.filter((item) => item.type === "pdf")
                    .length,
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
                    <div className="p-4 flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          getTypeColor(item.type).bg
                        } ${getTypeColor(item.type).text}`}
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
                      ? `No content uploaded for ${activeFilter} yet.`
                      : "No content uploaded yet"}
                  </p>
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
          </>
        )}
      </main>
    </div>
  );
};

export default CourseContentPageStudent;
