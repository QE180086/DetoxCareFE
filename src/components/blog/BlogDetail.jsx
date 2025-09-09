import { Link, useParams } from "react-router-dom";
import {
  FaLeaf,
  FaUser,
  FaCalendarAlt,
  FaArrowLeft,
  FaComments,
} from "react-icons/fa";
import { useState, useEffect } from "react";
// import { getBlogById } from "../../data/blogs";
import { blogApi } from "../../utils/api/blog.api";

export default function BlogDetail() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    created_at: "",
    author: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isLoggedIn] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        // Try to get blog by ID first, then by slug if needed
        let res;
        try {
          res = await blogApi.getById(blogId);
        } catch (idError) {
          // If getById fails, try getBySlugName
          res = await blogApi.getBySlugName(blogId);
        }

        const data = res?.data || res;
        // Map fields if backend uses different naming
        const mapped = {
          id: data.id,
          title: data.title || data.name || "Không có tiêu đề",
          content: data.content || data.body || "",
          created_at:
            data.created_at || data.createdAt || data.created_date || "",
          author: data.author || data.createdBy || "Admin DetoxCare",
          image:
            data.image ||
            data.imageUrl ||
            data.thumbnail ||
            "https://images.unsplash.com/photo-1506784361845-3903a963b3b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
        });
      } finally {
        setLoading(false);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        name,
        comment,
        created_at: new Date().toLocaleDateString("vi-VN"),
      };
      setComments([newComment, ...comments]);
      setName("");
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm" />
            Quay lại danh sách Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <FaLeaf className="text-xs" />
                Detox Blog
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {loading ? "Đang tải..." : blog.title || "Không tìm thấy"}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-600" />
                  <span>{blog.created_at}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-600" />
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
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {loading ? (
                  <div className="text-gray-500">Đang tải nội dung...</div>
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : (
                  <div className="text-lg leading-8 whitespace-pre-wrap">
                    {blog.content}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-12"></div>

              {/* Tags/Categories (Optional) */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                  <FaLeaf className="text-xs" />
                  Detox
                </span>
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Sức khỏe
                </span>
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Làm đẹp
                </span>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Author Card */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Về tác giả</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      blog.author
                    )}&background=10B981&color=fff&size=64`}
                    alt={blog.author}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{blog.author}</p>
                    <p className="text-sm text-gray-600">Chuyên gia Detox</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thống kê</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lượt xem</span>
                    <span className="font-medium text-gray-900">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chia sẻ</span>
                    <span className="font-medium text-gray-900">56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bình luận</span>
                    <span className="font-medium text-gray-900">
                      {comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 border-t border-gray-100 pt-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <FaComments className="text-green-600 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">
                Bình luận ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Chia sẻ ý kiến của bạn
              </h3>
              {isLoggedIn ? (
                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tên của bạn *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bình luận *
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors resize-none"
                      placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <FaLeaf />
                    Gửi bình luận
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Vui lòng đăng nhập để bình luận
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
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
                  <FaComments className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">
                    Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
                  </p>
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          c.name
                        )}&background=10B981&color=fff&size=48`}
                        alt={`${c.name}'s avatar`}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {c.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {c.created_at}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {c.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
