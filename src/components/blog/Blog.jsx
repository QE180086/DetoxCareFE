import { Link } from "react-router-dom";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

const blogList = [
  {
    id: 1,
    title: "Lợi ích của Detox đối với sức khỏe",
    excerpt: "Tìm hiểu cách detox giúp cải thiện sức khỏe và năng lượng.",
    created_at: "2025-06-20",
    image: "https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg",
  },
  {
    id: 2,
    title: "5 Công thức Detox đơn giản tại nhà",
    excerpt: "Học cách làm các món detox dễ dàng với nguyên liệu sẵn có.",
    created_at: "2025-06-18",
    image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/cach-pha-che-detox-chanh-dua-leo.jpg",
  },
  {
    id: 3,
    title: "Hành trình Detox: Câu chuyện thực tế",
    excerpt: "Chia sẻ kinh nghiệm từ những người đã thử detox.",
    created_at: "2025-06-15",
    image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg",
  },
  {
    id: 4,
    title: "Detox và Giấc Ngủ: Bí Mật Cho Sức Khỏe Toàn Diện",
    excerpt: "Khám phá cách detox hỗ trợ cải thiện chất lượng giấc ngủ.",
    created_at: "2025-06-10",
    image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg",
  },
  {
    id: 5,
    title: "Thực Đơn Detox 7 Ngày Cho Người Mới Bắt Đầu",
    excerpt: "Lên kế hoạch detox 7 ngày dễ dàng với hướng dẫn chi tiết.",
    created_at: "2025-06-05",
    image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/cach-pha-che-detox-chanh-dua-leo.jpg",
  },
  {
    id: 6,
    title: "Tầm Quan Trọng Của Nước Trong Quá Trình Detox",
    excerpt: "Hiểu rõ vai trò của nước trong việc thanh lọc cơ thể.",
    created_at: "2025-06-01",
    image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("created_at_desc"); // Default sort: newest first
  const blogsPerPage = 5;

  // Sort and filter blogs
  const sortedBlogs = [...blogList].sort((a, b) => {
    if (sortOption === "created_at_desc") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOption === "created_at_asc") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortOption === "title_asc") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "title_desc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const filteredBlogs = sortedBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-green-800 flex items-center gap-2">
            <FaLeaf className="text-green-600" /> Blog Detox Của Sự Khỏe Mạnh
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Tìm kiếm bài blog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-3 pl-10 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700 shadow-sm bg-white"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-3 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700 bg-white shadow-sm"
            >
              <option value="created_at_desc">Mới nhất</option>
              <option value="created_at_asc">Cũ nhất</option>
              <option value="title_asc">Tên (A-Z)</option>
              <option value="title_desc">Tên (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 gap-8">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row gap-6 p-6">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full sm:w-48 h-48 object-cover rounded-lg border border-green-200"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-green-700 mb-3">{blog.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                    <p className="text-sm text-gray-500">Đăng ngày: {blog.created_at}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 text-center text-lg">Không tìm thấy bài blog nào.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentPage === 1
                  ? "bg-green-200 text-green-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              } transition`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  currentPage === page
                    ? "bg-green-700 text-white"
                    : "bg-white text-green-700 border border-green-500 hover:bg-green-100"
                } transition`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-green-200 text-green-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              } transition`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}