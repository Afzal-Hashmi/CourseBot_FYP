import React, { useState, useRef, useEffect } from "react";
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
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaCommentAlt,
  FaUser,
  FaSpinner,
  FaExpand,
  FaCompress,
  FaPaperPlane,
  FaBars, // Added for mobile toggle
} from "react-icons/fa";
import Cookie from "js-cookie";
import { Link, useParams } from "react-router-dom";

const CourseContentPage = () => {
  const { course_id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({ title: "", type: "", file: null });
  const [expandedSections, setExpandedSections] = useState({
    filters: true,
    recent: true,
    chats: true,
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [contentItems, setContentItems] = useState([])
  const [chatQuestion, setChatQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentTurnId, setCurrentTurnId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [contentError, setContentError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added for mobile toggle

  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Focus chat input when expanded
  useEffect(() => {
    if (isChatExpanded && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [isChatExpanded]);

  // Fetch recent chats
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        setIsLoadingChats(true);
        const token = Cookie.get("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`http://localhost:8000/teacher/list/chats/${course_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch recent chats");
        }

        const data = await response.json();
        // Map endpoint response to recentChats format
        const formattedChats = (data.chats || []).map((chat) => ({
          chat_id: chat.chat_id,
          title: chat.title ? chat.title.slice(0, 30) + (chat.title.length > 30 ? "..." : "") : "Untitled Chat",
          date: chat.date,
        }));
        setRecentChats(formattedChats);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
        setRecentChats([]);
      } finally {
        setIsLoadingChats(false);
      }
    };

    fetchRecentChats();
  }, []);

  // Fetch content (unchanged)
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsContentLoading(true);
        setContentError(null);

        const token = Cookie.get("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`http://localhost:8000/teacher/getcontent/${course_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch content");
        }

        const data = await response.json();
        setContentItems(data.data || []);
      } catch (error) {
        console.error("Error fetching content:", error);
        setContentError(error.message);
        setContentItems([]);
      } finally {
        setIsContentLoading(false);
      }
    };

    if (course_id) {
      fetchContent();
    }
  }, [course_id]);

  // Load existing chat
  const loadChat = async (chatId) => {
    try {
      const token = Cookie.get("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      // chatId = "cht_994b92e5-05ed-4b71-9b95-cbc74d009258"
      const response = await fetch(`http://localhost:8000/teacher/chat/${chatId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load chat");
      }

      const data = await response.json();
      // Map turns to chatMessages format
      const formattedMessages = (data.messages || []).map((turn) => ({
        question: turn.question,
        answer: turn.answer,
        timestamp: new Date(turn.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chat_id: turn.chat_id,
        turn_id: turn.turn_id,
      }));
      // setContentItems(formattedMessages)
      setCurrentChatId(chatId);
      setCurrentTurnId(data.turns && data.turns.length > 0 ? data.turns[data.turns.length - 1].id : null);
      setCurrentChatTitle(
        data.turns && data.turns.length > 0
          ? data.turns[0].query.slice(0, 50) + (data.turns[0].query.length > 50 ? "..." : "")
          : "Untitled Chat"
      );
      setChatMessages(formattedMessages);
      setIsChatMode(true);
      setIsChatExpanded(true);
    } catch (error) {
      console.error("Error loading chat:", error);
      alert("Failed to load chat: " + error.message);
    }
  };

  // Handle asking a question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (!isChatMode) {
      setIsChatMode(true);
      setIsChatExpanded(true);
    }

    const token = Cookie.get("token");
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    const newMessage = {
      question: chatQuestion,
      isLoading: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setIsLoading(true);
    setChatMessages((prev) => [...prev, newMessage]);
    const currentQuestion = chatQuestion;
    setChatQuestion("");

    try {
      const requestBody = {
        question: currentQuestion,
        course_id: course_id,
      };

      if (currentChatId) {
        requestBody.chat_id = currentChatId;
      }
      if (currentTurnId) {
        requestBody.turn_id = currentTurnId;
      }

      const response = await fetch(`http://localhost:8000/teacher/ask/${course_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get answer");
      }

      const data = await response.json();

      if (data.chat_id && !currentChatId) {
        setCurrentChatId(data.chat_id);
        setCurrentChatTitle(currentQuestion.slice(0, 50) + (currentQuestion.length > 50 ? "..." : ""));
      }
      if (data.turn_id) {
        setCurrentTurnId(data.turn_id);
      }

      setChatMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? {
              ...msg,
              isLoading: false,
              answer: data.answer || "No answer provided",
              chat_id: data.chat_id,
              turn_id: data.turn_id,
            }
            : msg
        )
      );

      // Update recent chats
      if (data.chat_id) {
        const newChatEntry = {
          chat_id: data.chat_id,
          title: currentQuestion.slice(0, 30) + (currentQuestion.length > 30 ? "..." : ""),
          date: new Date().toISOString(),
          last_message: currentQuestion,
        };

        setRecentChats((prev) => {
          const existingChatIndex = prev.findIndex((chat) => chat.chat_id === data.chat_id);
          if (existingChatIndex >= 0) {
            // Update existing chat
            const updatedChats = [...prev];
            updatedChats[existingChatIndex] = {
              ...updatedChats[existingChatIndex],
              last_message: currentQuestion,
              date: new Date().toISOString(),
            };
            return updatedChats;
          } else {
            // Add new chat
            return [newChatEntry, ...prev];
          }
        });
      }
    } catch (error) {
      console.error("Question error:", error);
      alert("Failed to get answer: " + error.message);
      setChatMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? {
              ...msg,
              isLoading: false,
              answer: "Error: Failed to get response",
            }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Other utility functions (unchanged)
  const getTypeIcon = (type, size = 16) => {
    const icons = {
      pdf: <FaFilePdf size={size} />,
      video: <FaVideo size={size} />,
      quiz: <FaQuestionCircle size={size} />,
      default: <FaFileAlt size={size} />,
    };
    return icons[type] || icons.default;
  };

  const getTypeColor = (type) => {
    const colors = {
      pdf: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", hover: "hover:bg-red-100" },
      video: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", hover: "hover:bg-blue-100" },
      quiz: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100", hover: "hover:bg-yellow-100" },
      default: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-100", hover: "hover:bg-gray-200" },
    };
    return colors[type] || colors.default;
  };

  const getTypeLabel = (type) => {
    const labels = { pdf: "PDF", video: "Video", quiz: "Quiz", default: "Resource" };
    return labels[type] || labels.default;
  };

  const filteredContent = contentItems
    .filter(
      (item) =>
        item.content_title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeFilter === "all" || item.content_type === activeFilter)
    )
    .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

  const deleteContent = async (id) => {
    try {
      const token = Cookie.get("token");
      const response = await fetch(`http://localhost:8000/teacher/deletecontent/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete content");
      }
      const data = await response.json();
      alert(data.message);
      setContentItems((prev) => prev.filter((item) => item.content_id !== id));
    } catch (e) {
      console.error("Error deleting content:", e);
      alert("Failed to delete content: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteContent(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploadLoading(true);
      const token = Cookie.get("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      if (!formData.title || !formData.type || !formData.file) {
        throw new Error("Please fill in all fields and select a file.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("content_title", formData.title);
      formDataToSend.append("content_type", formData.type);
      formDataToSend.append("file", formData.file);
      formDataToSend.append("course_id", course_id);

      const response = await fetch("http://localhost:8000/teacher/uploadcontent/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload content");
      }

      const data = await response.json();
      const newContent = {
        content_id: data.data?.content_id || Date.now(),
        content_title: formData.title,
        content_type: formData.type.toLowerCase(),
        content_url: data.data?.content_url,
        created_at: new Date().toISOString(),
      };

      setContentItems((prev) => [newContent, ...prev]);
      setFormData({ title: "", type: "", file: null });
      setShowModal(false);
      alert("Content uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload content: " + error.message);
    } finally {
      setIsUploadLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setCurrentTurnId(null);
    setCurrentChatTitle("");
    setChatMessages([]);
    setIsChatMode(true);
    setIsChatExpanded(true);
  };

  const handleCardClick = (item) => {
    if (item.content_url) {
      window.open(`${item.content_url}`, "_blank", "noopener,noreferrer");
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const exitChatMode = () => {
    setIsChatMode(false);
    setIsChatExpanded(false);
  };

  const renderMarkdown = (text) => {
    if (!text) return text;

    const lines = text.split("\n");
    let inList = false;
    const elements = [];
    let listItems = [];

    lines.forEach((line, index) => {
      let formattedLine = line.trim();
      if (!formattedLine) return;

      if (formattedLine.startsWith("# ")) {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-4 space-y-1 mb-4">
              {listItems}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h1 key={`h1-${index}`} className="text-xl font-bold text-gray-900 mb-3 mt-4">
            {formattedLine.replace(/^# /, "")}
          </h1>
        );
        return;
      }

      if (formattedLine.startsWith("## ")) {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-4 space-y-1 mb-4">
              {listItems}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h2 key={`h2-${index}`} className="text-lg font-semibold text-gray-800 mb-2 mt-3">
            {formattedLine.replace(/^## /, "")}
          </h2>
        );
        return;
      }

      if (formattedLine.startsWith("### ")) {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-4 space-y-1 mb-4">
              {listItems}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h3 key={`h3-${index}`} className="text-md font-semibold text-gray-700 mb-2 mt-2">
            {formattedLine.replace(/^### /, "")}
          </h3>
        );
        return;
      }

      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");
      formattedLine = formattedLine.replace(/`(.*?)`/g, "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm'>$1</code>");

      if (formattedLine.startsWith("- ") || formattedLine.startsWith("* ")) {
        if (!inList) {
          listItems = [];
          inList = true;
        }
        listItems.push(
          <li key={`li-${index}`} className="text-sm text-gray-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[*-] /, "") }} />
          </li>
        );
      } else if (formattedLine.match(/^\d+\. /)) {
        if (!inList) {
          listItems = [];
          inList = true;
        }
        listItems.push(
          <li key={`li-${index}`} className="text-sm text-gray-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\. /, "") }} />
          </li>
        );
      } else {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-4 space-y-1 mb-4">
              {listItems}
            </ul>
          );
          inList = false;
          listItems = [];
        }

        elements.push(
          <p
            key={`p-${index}`}
            className="text-sm text-gray-700 mb-3 leading-relaxed text-left"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
    });

    if (inList) {
      elements.push(
        <ul key="ul-end" className="list-disc pl-4 space-y-1 mb-4">
          {listItems}
        </ul>
      );
    }

    return <div className="text-left">{elements}</div>;
  };

  const LoadingSpinner = ({ size = 20, className = "" }) => (
    <FaSpinner className={`animate-spin ${className}`} size={size} />
  );

  const ContentSkeleton = () => (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .font-inter { font-family: 'Inter', sans-serif; }

        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { 
          background: rgba(0, 0, 0, 0.1); 
          border-radius: 3px; 
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.2); }

        .chat-message { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gradient-border {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
          padding: 1px;
          border-radius: 12px;
        }

        .gradient-border-inner {
          background: white;
          border-radius: 11px;
        }

        @media (max-width: 640px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Enhanced Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-transform duration-300 z-50 sidebar ${isSidebarOpen ? "open" : ""
          }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Toggle Button for Mobile */}
          <button
            className="sm:hidden mb-4 p-2 text-white hover:bg-slate-700 rounded-lg"
            onClick={toggleSidebar}
          >
            <FaBars size={20} />
          </button>

          {/* Header */}
          <div className="pb-6 border-b border-slate-700">
            <div className="block group cursor-pointer">
              <Link to="/teacher/dashboard" className="block">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 cursor-pointer hover:text-blue-300 transition-colors">
                  <FaChalkboardTeacher className="text-blue-400" size={24} />
                  <span>Course Hub</span>
                </h2>
              </Link>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <FaPlus size={14} />
                Add New Content
              </button>
              <button
                onClick={startNewChat}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <FaCommentAlt size={14} />
                New Chat
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto mt-6 custom-scroll space-y-6">
            {/* Filters Section */}
            <div>
              <button
                className="flex justify-between items-center w-full py-3 text-slate-300 hover:text-white transition-colors"
                onClick={() => toggleSection("filters")}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider">Content Filters</h3>
                {expandedSections.filters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              {expandedSections.filters && (
                <div className="space-y-2 mt-3">
                  {[
                    { key: "all", label: "All Content", icon: FaFileAlt, color: "blue" },
                    { key: "pdf", label: "PDF Documents", icon: FaFilePdf, color: "red" },
                    { key: "video", label: "Video Lectures", icon: FaVideo, color: "blue" },
                    { key: "quiz", label: "Quizzes", icon: FaQuestionCircle, color: "yellow" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeFilter === filter.key
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-slate-200 hover:bg-slate-700/50"
                        }`}
                    >
                      <filter.icon size={14} />
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Content Section */}
            <div>
              <button
                className="flex justify-between items-center w-full py-3 text-slate-300 hover:text-white transition-colors"
                onClick={() => toggleSection("recent")}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider">Recent Content</h3>
                {expandedSections.recent ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              {expandedSections.recent && (
                <div className="space-y-2 mt-3 max-h-64 overflow-y-auto custom-scroll">
                  {isContentLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size={16} className="text-slate-400" />
                      <span className="ml-2 text-sm text-slate-400">Loading content...</span>
                    </div>
                  ) : contentItems.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">
                      No content available
                    </div>
                  ) : (
                    contentItems.slice(0, 5).map((item) => (
                      <div
                        key={item.content_id}
                        className="group flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl cursor-pointer transition-all hover:transform hover:scale-105"
                        onClick={() => handleCardClick(item)}
                      >
                        <div
                          className={`p-2 rounded-lg ${getTypeColor(item.content_type).bg} ${getTypeColor(item.content_type).text
                            }`}
                        >
                          {getTypeIcon(item.content_type, 14)}
                        </div>
                        <div className="truncate flex-1">
                          <h4 className="font-medium truncate text-slate-100 group-hover:text-white transition-colors">
                            {item.content_title}
                          </h4>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Recent Chats Section */}
            <div>
              <button
                className="flex justify-between items-center w-full py-3 text-slate-300 hover:text-white transition-colors"
                onClick={() => toggleSection("chats")}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider">Recent Chats</h3>
                {expandedSections.chats ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              {expandedSections.chats && (
                <div className="space-y-2 mt-3 max-h-64 overflow-y-auto custom-scroll">
                  {isLoadingChats ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size={16} className="text-slate-400" />
                      <span className="ml-2 text-sm text-slate-400">Loading chats...</span>
                    </div>
                  ) : recentChats.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">
                      No recent chats
                    </div>
                  ) : (
                    recentChats.map((chat) => (
                      <div
                        key={chat.chat_id}
                        className="group flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl cursor-pointer transition-all"
                        onClick={() => loadChat(chat.chat_id)}
                      >
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          <FaCommentAlt size={14} />
                        </div>
                        <div className="truncate flex-1">
                          <h4 className="font-medium truncate text-slate-100 group-hover:text-white transition-colors">
                            {chat.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {new Date(chat.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64 sm:ml-80" : "ml-0 sm:ml-80"
          } ${isChatExpanded ? "p-0" : "p-4 sm:p-10"}`}
      >
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="sm:hidden fixed top-4 left-4 p-2 bg-slate-800 text-white rounded-lg z-50"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>

        {!isChatMode && (
          <>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Course Content
                </h1>
                <p className="text-xl text-slate-600 mt-3 font-medium">
                  Curate and manage your teaching resources with AI assistance
                </p>
              </div>
              <div className="relative w-full lg:w-96">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your content library..."
                  className="pl-12 pr-4 py-4 border-0 rounded-2xl w-full text-sm shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isContentLoading}
                />
              </div>
            </div>

            {/* Content Grid */}
            {isContentLoading ? (
              <ContentSkeleton />
            ) : contentError ? (
              <div className="glass-effect rounded-3xl p-12 text-center border shadow-xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <FaTimes size={32} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Error Loading Content</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">{contentError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center gap-3 text-sm font-semibold mx-auto hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Try Again
                </button>
              </div>
            ) : filteredContent.length > 0 ? (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
                {filteredContent.map((item) => (
                  <div
                    key={item.content_id}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border ${getTypeColor(item.content_type).border
                      } cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1`}
                    onClick={() => handleCardClick(item)}
                  >
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className="p-2 rounded-full bg-white/90 text-blue-600 hover:bg-blue-50 shadow-md transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.content_id);
                        }}
                        className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-50 shadow-md transition-all"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl ${getTypeColor(item.content_type).bg} ${getTypeColor(item.content_type).text
                            } shadow-sm`}
                        >
                          {getTypeIcon(item.content_type, 20)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2"
                            title={item.content_title}
                          >
                            {item.content_title}
                          </h3>
                          <p className="text-xs text-slate-500 mb-2">{getTypeLabel(item.content_type)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <div className="glass-effect rounded-3xl p-12 text-center border shadow-xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <FaFileAlt size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">No content found</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? `No matches found for "${searchQuery}". Try different keywords.`
                    : "Ready to add your first piece of content? Start building your course library!"}
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center gap-3 text-sm font-semibold mx-auto hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaPlus size={16} />
                  Add Your First Content
                </button>
              </div>
            )}
          </>
        )}

        {/* Chat Interface */}
        <section
          className={`transition-all duration-500 ${isChatExpanded ? "fixed inset-0 left-80 sm:left-80 bg-white z-40" : isChatMode ? "mt-6" : "mt-12 max-w-4xl mx-auto"
            }`}
        >
          <div
            className={`${isChatExpanded ? "h-full flex flex-col" : "glass-effect rounded-3xl border shadow-xl"
              } ${!isChatExpanded ? "p-8" : ""}`}
          >
            <div
              className={`flex items-center justify-between ${isChatExpanded ? "p-6 border-b bg-white/95 backdrop-blur-sm" : "mb-6"}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <FaRobot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{currentChatTitle || "AI Assistant"}</h3>
                  <p className="text-sm text-slate-500">Ask anything about your course content</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isChatMode && (
                  <button
                    onClick={() => setIsChatExpanded(!isChatExpanded)}
                    className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                    title={isChatExpanded ? "Minimize chat" : "Expand chat"}
                  >
                    {isChatExpanded ? <FaCompress size={16} /> : <FaExpand size={16} />}
                  </button>
                )}
                {isChatMode && (
                  <button
                    onClick={exitChatMode}
                    className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Exit chat mode"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            <div
              className={`${isChatExpanded ? "flex-1 overflow-y-auto px-6" : "max-h-96 overflow-y-auto"
                } custom-scroll ${chatMessages.length > 0 ? "mb-6" : ""}`}
            >
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <FaRobot size={24} className="text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-2">Ready to help!</h4>
                  <p className="text-slate-500">Ask me anything about your course content, and I'll provide insights and answers.</p>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className="chat-message">
                      <div className="flex justify-end mb-4">
                        <div className="flex items-start gap-3 max-w-[80%]">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rounded-br-md px-4 py-3 text-white shadow-lg">
                            <p className="text-sm font-medium">{message.question}</p>
                            <p className="text-xs text-blue-100 mt-2">{message.timestamp}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <FaUser className="text-white" size={12} />
                          </div>
                        </div>
                      </div>
                      {(message.answer || message.isLoading) && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center shadow-md">
                              <FaRobot className="text-white" size={12} />
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-md">
                              {message.isLoading ? (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <FaSpinner className="animate-spin" size={14} />
                                  <span className="text-sm">Thinking...</span>
                                </div>
                              ) : (
                                <div className="prose prose-sm max-w-none">{renderMarkdown(message.answer)}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            <div className={`${isChatExpanded ? "p-6 border-t bg-white/95" : ""}`}>
              <div className="relative">
                <div className="gradient-border">
                  <div className="gradient-border-inner">
                    <div className="flex items-center p-2">
                      <FaRobot className="ml-4 text-slate-400" size={18} />
                      <input
                        ref={chatInputRef}
                        type="text"
                        placeholder="Ask about your course content..."
                        className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent"
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAskQuestion(e)}
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleAskQuestion}
                        className="mr-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        disabled={isLoading || !chatQuestion.trim()}
                      >
                        <FaPaperPlane size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Press Enter to send • AI can make mistakes, verify important information
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Create New Content</h2>
                  <p className="text-slate-600 mt-1">Upload and organize your teaching materials</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isUploadLoading}
                  className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Content Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
                      placeholder="e.g., Advanced React Patterns and Best Practices"
                      disabled={isUploadLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Content Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all disabled:opacity-50"
                      disabled={isUploadLoading}
                    >
                      <option value="">Choose content type</option>
                      <option value="pdf">📄 PDF Document</option>
                      <option value="video">🎥 Video Lecture</option>
                      <option value="quiz">📝 Quiz/Assignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Upload File <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50 ${isUploadLoading ? "opacity-50" : ""
                        }`}
                    >
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          {isUploadLoading ? (
                            <LoadingSpinner size={24} className="text-blue-600" />
                          ) : (
                            <FaPlus className="text-blue-600" size={24} />
                          )}
                        </div>
                        <div>
                          <label className={`cursor-pointer ${isUploadLoading ? "pointer-events-none" : ""}`}>
                            <span className="text-blue-600 hover:text-blue-700 font-semibold">Choose file</span>
                            <span className="text-slate-600"> or drag and drop</span>
                            <input
                              type="file"
                              required
                              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                              className="hidden"
                              disabled={isUploadLoading}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-slate-500">
                          {formData.type === "pdf" && "PDF files up to 25MB"}
                          {formData.type === "video" && "MP4, MOV, WEBM files up to 500MB"}
                          {formData.type === "quiz" && "DOCX, PDF, XLSX files up to 10MB"}
                          {!formData.type && "Select content type to see file requirements"}
                        </p>
                        {formData.file && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">
                              ✓ Selected: {formData.file.name}
                            </p>
                          </div>
                        )}
                        {isUploadLoading && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size={16} className="text-blue-600" />
                              <p className="text-sm text-blue-800 font-medium">
                                Uploading content... Please wait.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={isUploadLoading}
                      className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadLoading || !formData.title || !formData.type || !formData.file}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center gap-2 font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploadLoading ? (
                        <>
                          <LoadingSpinner size={14} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaPlus size={14} />
                          Publish Content
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseContentPage;