import { Link } from "react-router-dom";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const blogList = [
  {
    id: 1,
    title: "Lợi ích của Detox đối với sức khỏe",
    excerpt: "Tìm hiểu cách detox giúp cải thiện sức khỏe và năng lượng.",
    created_at: "2025-06-20",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    title: "5 Công thức Detox đơn giản tại nhà",
    excerpt: "Học cách làm các món detox dễ dàng với nguyên liệu sẵn có.",
    created_at: "2025-06-18",
    image: "https://images.unsplash.com/photo-1540420828642-fca2c5c98abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    title: "Hành trình Detox: Câu chuyện thực tế",
    excerpt: "Chia sẻ kinh nghiệm từ những người đã thử detox.",
    created_at: "2025-06-15",
    image: "https://images.unsplash.com/photo-1506784361845-3903a963b3b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 2; // Số bài blog trên mỗi trang

  // Lọc blog dựa trên title
  const filteredBlogs = blogList.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán chỉ số bài blog cho trang hiện tại
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      {/* Tiêu đề và ô tìm kiếm nằm ngang hàng */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-green-700 text-center sm:text-left">Blog Chia Sẻ Từ Các Chuyên Gia</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="text-gray-700 font-medium">
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Tìm kiếm bài blog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 pl-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Danh sách blog */}
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col sm:flex-row gap-4"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full sm:w-32 h-32 object-cover rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-green-700 mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <p className="text-sm text-gray-500">Đăng ngày: {blog.created_at}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 text-center">Không tìm thấy bài blog nào.</p>
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page ? "bg-green-700 text-white" : "bg-white text-green-700 border border-green-500 hover:bg-green-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}