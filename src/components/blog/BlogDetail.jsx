import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaUser,
  FaCalendarAlt,
  FaArrowLeft,
  FaComments,
  FaEdit,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { getBlogById } from "../../data/blogs";
import { blogApi } from "../../utils/api/blog.api";
import Notification from '../common/Nontification';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Add this helper function to safely render HTML content
const renderHTMLContent = (content) => {
  if (!content) return null;
  
  return (
    <div 
      className="text-lg leading-8"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function BlogDetail() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    created_at: "",
    author: "",
    image: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Comment states
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Editing states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  
  // Reply states
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyComment, setReplyComment] = useState("");

  // Expanded replies state
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        // Try to get blog by slug name first, then by ID if needed
        let res;
        try {
          res = await blogApi.getBySlugName(blogId);
        } catch (slugError) {
          // If getBySlugName fails, try getById
          res = await blogApi.getById(blogId);
        }

        const data = res?.data || res;
        // Map fields if backend uses different naming
        const mapped = {
          id: data.id,
          title: data.title || data.name || "Không có tiêu đề",
          content: data.content || data.body || "",
          created_at:
            data.createdDate || data.created_at || data.createdAt || data.created_date || "",
          author: data.userName || data.fullname || data.author || data.createdBy || "Admin DetoxCare",
          image:
            data.image ||
            data.imageUrl ||
            data.thumbnail ||
            "https://images.unsplash.com/photo-1506784361845-3903a963b3b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: data.categoryName || "Chưa phân loại"
        };
        setBlog(mapped);
      } catch (e) {
        setError(e?.message || "Không tải được bài viết");
        setBlog({
          title: "Không tìm thấy",
          content: "Bài viết không tồn tại.",
          created_at: "",
          author: "Admin DetoxCare",
          image:
            "https://images.unsplash.com/photo-1506784361845-3903a963b3b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "Chưa phân loại"
        });
      } finally {
        setLoading(false);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId]);

  // Fetch comments when blog is loaded or when page changes
  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments for blog ID:", blog.id);
      console.log("Access token available:", !!accessToken);
      
      // Only fetch comments if we have a blog ID
      // We don't necessarily need accessToken to fetch comments, but we need it to post them
      if (blog.id) {
        try {
          // If user is logged in, use their access token, otherwise fetch comments without auth
          const token = accessToken || null;
          
          const response = await blogApi.getComments(
            blog.id, 
            token, 
            currentPage, 
            pageSize, 
            "createdDate", 
            "desc"
          );
          
          console.log("Comments API response:", response);
          
          // Assuming the response has data and pagination info
          if (response?.data?.content) {
            // Process comments to organize them hierarchically
            const processedComments = processComments(response.data.content);
            setComments(processedComments);
            setTotalPages(response.data.totalPages || 1);
          } else {
            setComments([]);
          }
        } catch (error) {
          console.error("Failed to fetch comments:", error);
          setComments([]);
        }
      }
    };

    fetchComments();
  }, [blog.id, accessToken, currentPage, pageSize]);

  // Function to process comments and organize them hierarchically
  const processComments = (commentsList) => {
    // The API already returns comments in a hierarchical structure with commentChild
    // We just need to map the fields to what our render function expects
    
    const mapComment = (comment) => {
      // Map the comment fields to our expected structure
      const mappedComment = {
        id: comment.id,
        content: comment.content,
        createdDate: comment.createdDate,
        userName: comment.userCreated,
        avatar: comment.avatar,
        // Preserve the userId for ownership checks if it exists
        userId: comment.userId || null,
        // Add any other fields you need from the API response
        replies: []
      };
      
      // Recursively map child comments
      if (comment.commentChild && comment.commentChild.length > 0) {
        mappedComment.replies = comment.commentChild.map(mapComment);
      }
      
      return mappedComment;
    };
    
    // Map all top-level comments
    return commentsList.map(mapComment);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Check if comment has content (not just whitespace or empty HTML tags)
    const strippedContent = comment.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      alert('Vui lòng nhập bình luận!');
      return;
    }

    // Check if user is logged in
    if (!accessToken) {
      alert('Vui lòng đăng nhập để bình luận!');
      return;
    }

    try {
      // Get userId directly from sessionStorage
      const userId = sessionStorage.getItem('userId');

      // Prepare comment data including userId from sessionStorage
      const commentData = {
        content: comment,
        userId: userId // Include userId from sessionStorage
      };

      // Submit comment using the new postComment API
      await blogApi.postComment(blog.id, commentData, accessToken);

      // Reset form
      setComment("");
      
      // Refresh comments
      setCurrentPage(1); // Go back to first page to see the new comment
      
      // Re-fetch comments to show the new one
      const response = await blogApi.getComments(
        blog.id, 
        accessToken, 
        1, 
        pageSize, 
        "createdDate", 
        "desc"
      );
      
      if (response?.data?.content) {
        const processedComments = processComments(response.data.content);
        setComments(processedComments);
      }
      
      // Remove success alert - no alert on success
    } catch (error) {
      console.error("Failed to submit comment:", error);
      // Show error modal only when there's an actual error
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage('Không thể gửi bình luận. Vui lòng thử lại sau!');
    }
  };

  // Function to start editing a comment
  const startEditingComment = (comment) => {
    // Check if the comment belongs to the current user
    if (user && comment.userId === user.id) {
      setEditingCommentId(comment.id);
      setEditingCommentText(comment.content);
    }
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  // Function to start replying to a comment
  const startReplying = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyComment("");
  };

  // Function to cancel replying
  const cancelReplying = () => {
    setReplyingToCommentId(null);
    setReplyComment("");
  };

  // Function to submit a reply
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    // Check if reply has content (not just whitespace or empty HTML tags)
    const strippedContent = replyComment.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      alert('Vui lòng nhập phản hồi!');
      return;
    }

    // Check if user is logged in
    if (!accessToken) {
      alert('Vui lòng đăng nhập để phản hồi!');
      return;
    }

    try {
      // Get userId directly from sessionStorage
      const userId = sessionStorage.getItem('userId');

      // Prepare reply data including userId and parent comment ID
      const replyData = {
        content: replyComment,
        userId: userId,
        commentParentId: replyingToCommentId // Reference to the parent comment
      };

      // Submit reply using the same postComment API
      await blogApi.postComment(blog.id, replyData, accessToken);

      // Reset reply form
      setReplyingToCommentId(null);
      setReplyComment("");
      
      // Refresh comments to show the new reply
      const response = await blogApi.getComments(
        blog.id, 
        accessToken, 
        currentPage, 
        pageSize, 
        "createdDate", 
        "desc"
      );
      
      if (response?.data?.content) {
        const processedComments = processComments(response.data.content);
        setComments(processedComments);
      }
      
      // Remove success alert - no alert on success
    } catch (error) {
      console.error("Failed to submit reply:", error);
      // Show error modal only when there's an actual error
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage('Không thể gửi phản hồi. Vui lòng thử lại sau!');
    }
  };

  // Function to save edited comment
  const saveEditedComment = async () => {
    // Check if comment has content (not just whitespace or empty HTML tags)
    const strippedContent = editingCommentText.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      alert('Bình luận không được để trống!');
      return;
    }

    try {
      // Prepare updated comment data
      const updatedCommentData = {
        content: editingCommentText
      };

      // Update comment using the updateComment API
      await blogApi.updateComment(editingCommentId, updatedCommentData, accessToken);

      // Refresh comments
      const response = await blogApi.getComments(
        blog.id, 
        accessToken, 
        currentPage, 
        pageSize, 
        "createdDate", 
        "desc"
      );
      
      if (response?.data?.content) {
        const processedComments = processComments(response.data.content);
        setComments(processedComments);
      }
      
      // Reset editing state
      setEditingCommentId(null);
      setEditingCommentText('');
      
      // Remove success alert - no alert on success
    } catch (error) {
      console.error("Failed to update comment:", error);
      // Show error modal only when there's an actual error
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage('Không thể cập nhật bình luận. Vui lòng thử lại sau!');
    }
  };

  // Function to render comments recursively to handle replies
  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((c) => (
      <div 
        key={c.id} 
        className={`${level > 0 ? 'ml-8 mt-4' : 'mb-6'}`}
      >
        <div
          className={`bg-white rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${
            level > 0 
              ? 'border-l-2 border-l-green-400 shadow-sm' 
              : 'border border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <img
              src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                c.userName || 'Người dùng'
              )}&background=000&color=fff&size=48`}
              alt={`${c.userName || 'Người dùng'}'s avatar`}
              className={`rounded-full flex-shrink-0 object-cover ${
                level > 0 ? 'w-10 h-10' : 'w-12 h-12'
              }`}
            />
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold text-black ${level > 0 ? 'text-sm' : 'text-base'}`}>
                    {c.userName || 'Người dùng'}
                  </h4>
                  {/* Show edit indicator for user's own comments */}
                  {user && c.userId === user.id && (
                    <span className="text-xs bg-green-400 text-black px-2 py-0.5 rounded-full font-medium">
                      Bạn
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-gray-500 ${level > 0 ? 'text-xs' : 'text-sm'}`}>
                    {c.createdDate ? formatDate(c.createdDate) : ''}
                  </span>
                  {/* Edit button for user's own comments */}
                  {user && c.userId === user.id && (
                    <button
                      onClick={() => startEditingComment(c)}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                      title="Chỉnh sửa bình luận"
                    >
                      <FaEdit className={` ${level > 0 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Comment content - Editable */}
              {editingCommentId === c.id ? (
                <div className="mt-3">
                  <ReactQuill
                    value={editingCommentText}
                    onChange={setEditingCommentText}
                    modules={{
                      toolbar: [
                        [{ 'header': [2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'header',
                      'bold', 'italic', 'underline',
                      'list', 'bullet',
                      'link'
                    ]}
                    className="bg-white text-black"
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <FaTimes className="inline mr-1" /> Hủy
                    </button>
                    <button
                      onClick={saveEditedComment}
                      className="px-4 py-2 text-sm bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium"
                    >
                      <FaSave className="inline mr-1" /> Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={`text-gray-800 leading-relaxed ${level > 0 ? 'text-sm' : 'text-base'}`}>
                    {renderHTMLContent(c.content)}
                  </div>
                  {/* Reply button for level 1 comments only (not for level 2 replies) */}
                  {accessToken && level < 1 && (
                    <div className="mt-3">
                      <button
                        onClick={() => startReplying(c.id)}
                        className={`text-green-400 hover:text-green-500 font-medium flex items-center gap-1 ${level > 0 ? 'text-xs' : 'text-sm'}`}
                      >
                        <FaComments className={` ${level > 0 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        Phản hồi
                      </button>
                    </div>
                  )}
                  
                  {/* Reply form for this comment */}
                  {replyingToCommentId === c.id && (
                    <div className={`mt-4 bg-gray-100 rounded-xl p-4 ${level > 0 ? 'ml-2' : ''}`}>
                      <form onSubmit={handleReplySubmit} className="space-y-3">
                        <div>
                          <ReactQuill
                            value={replyComment}
                            onChange={setReplyComment}
                            modules={{
                              toolbar: [
                                [{ 'header': [2, 3, false] }],
                                ['bold', 'italic', 'underline'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link'],
                                ['clean']
                              ]
                            }}
                            formats={[
                              'header',
                              'bold', 'italic', 'underline',
                              'list', 'bullet',
                              'link'
                            ]}
                            className="bg-white text-black"
                            placeholder="Viết phản hồi của bạn..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelReplying}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-200"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-sm bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium"
                          >
                            Gửi phản hồi
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Render child comments if they exist */}
        {c.replies && c.replies.length > 0 && (
          <div className="mt-4">
            {renderLimitedChildComments(c.replies, level + 1, c.id)}
          </div>
        )}
      </div>
    ));
  };

  // Function to render child comments with limit and expand/collapse functionality
  const renderLimitedChildComments = (childComments, level, parentId) => {
    const maxRepliesToShow = 2;
    
    // Show only first 2 replies by default, or all if expanded
    const isExpanded = expandedReplies[parentId] || false;
    const visibleReplies = isExpanded 
      ? childComments 
      : childComments.slice(0, maxRepliesToShow);
    
    const toggleReplies = () => {
      setExpandedReplies(prev => ({
        ...prev,
        [parentId]: !prev[parentId]
      }));
    };
    
    return (
      <div>
        {/* Show expand/collapse button if there are more than 2 replies */}
        {childComments.length > maxRepliesToShow && (
          <div className="flex justify-center mb-3">
            <button
              onClick={toggleReplies}
              className="flex items-center gap-1 text-green-400 hover:text-green-500 text-sm font-medium"
            >
              {isExpanded ? (
                <>
                  <FaChevronUp className="w-3 h-3" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <>
                  <FaChevronDown className="w-3 h-3" />
                  <span>Xem thêm {childComments.length - maxRepliesToShow} phản hồi</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {visibleReplies.map((reply) => (
          <div key={reply.id} className="ml-8 mt-4">
            <div className="bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-md border-l-2 border-l-green-400 shadow-sm">
              <div className="flex items-start gap-3">
                <img
                  src={reply.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    reply.userName || 'Người dùng'
                  )}&background=000&color=fff&size=48`}
                  alt={`${reply.userName || 'Người dùng'}'s avatar`}
                  className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-black text-sm">
                        {reply.userName || 'Người dùng'}
                      </h4>
                      {/* Show edit indicator for user's own comments */}
                      {user && reply.userId === user.id && (
                        <span className="text-xs bg-green-400 text-black px-2 py-0.5 rounded-full font-medium">
                          Bạn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">
                        {reply.createdDate ? formatDate(reply.createdDate) : ''}
                      </span>
                      {/* Edit button for user's own comments */}
                      {user && reply.userId === user.id && (
                        <button
                          onClick={() => startEditingComment(reply)}
                          className="text-gray-400 hover:text-green-400 transition-colors"
                          title="Chỉnh sửa bình luận"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Comment content - Editable */}
                  {editingCommentId === reply.id ? (
                    <div className="mt-2">
                      <ReactQuill
                        value={editingCommentText}
                        onChange={setEditingCommentText}
                        modules={{
                          toolbar: [
                            [{ 'header': [3, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                          ]
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline',
                          'list', 'bullet',
                          'link'
                        ]}
                        className="bg-white text-black"
                      />
                      <div className="flex justify-end gap-3 mt-3">
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                        >
                          <FaTimes className="inline mr-1" /> Hủy
                        </button>
                        <button
                          onClick={saveEditedComment}
                          className="px-4 py-2 text-sm bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium"
                        >
                          <FaSave className="inline mr-1" /> Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-800 leading-relaxed text-sm">
                      {renderHTMLContent(reply.content)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to get visible comments based on showAllComments state
  const getVisibleComments = () => {
    if (showAllComments) {
      return comments;
    }
    
    // When not showing all comments, show only first 3 top-level comments
    // but still show all replies to those comments
    return comments.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-green-400">
                <FaLeaf className="text-xs" />
                {blog.category}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                {loading ? "Đang tải..." : blog.title || "Không tìm thấy"}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-400" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-400" />
                  <span>{blog.author}</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <article className="bg-white">
              {/* Content */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                {loading ? (
                  <div className="text-gray-500">Đang tải nội dung...</div>
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : (
                  <div className="text-lg leading-8">
                    {renderHTMLContent(blog.content)}
                  </div>
                )}
              </div>


            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Author Card */}
              <div className="bg-gray-100 rounded-2xl p-6">
                <h3 className="font-semibold text-black mb-4">Về tác giả</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      blog.author
                    )}&background=000&color=fff&size=64`}
                    alt={blog.author}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-black">{blog.author}</p>
                    <p className="text-sm text-gray-700">Chuyên gia Detox</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FaComments className="text-green-400 text-2xl" />
              <h2 className="text-2xl font-bold text-black">
                Bình luận ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <div className="bg-gray-100 rounded-2xl p-8 mb-12">
              <h3 className="text-lg font-semibold text-black mb-6">
                Chia sẻ ý kiến của bạn
              </h3>
              {accessToken ? (
                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bình luận *
                    </label>
                    <ReactQuill
                      value={comment}
                      onChange={setComment}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                      formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike',
                        'list', 'bullet',
                        'link'
                      ]}
                      className="bg-white text-black"
                      placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-green-400 text-black px-6 py-3 rounded-xl font-medium hover:bg-green-500 transition-colors shadow-sm hover:shadow-md"
                  >
                    <FaLeaf />
                    Gửi bình luận
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700 mb-4">
                    Vui lòng đăng nhập để bình luận
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-green-400 text-black px-6 py-3 rounded-xl font-medium hover:bg-green-500 transition-colors shadow-sm hover:shadow-md"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <FaComments className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
                  </p>
                </div>
              ) : (
                <>
                  {/* Show comments based on visibility logic */}
                  {renderComments(getVisibleComments())}
                  
                  {/* Show expand/collapse button if there are more than 3 top-level comments */}
                  {comments.length > 3 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowAllComments(!showAllComments)}
                        className="flex items-center gap-2 text-green-400 hover:text-green-500 font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        {showAllComments ? (
                          <>
                            <span>Thu gọn</span>
                            <FaChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Xem thêm {comments.length - 3} bình luận</span>
                            <FaChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification */}
      <Notification
        isOpen={showNotification}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        action={[{ label: 'OK', onClick: () => setShowNotification(false) }]}
      />
    </div>
  );
}