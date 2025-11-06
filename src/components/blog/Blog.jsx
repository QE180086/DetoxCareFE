// import { Link } from "react-router-dom"; // Removed for demo purposes
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";
import { FaLeaf, FaHeart, FaStar } from "react-icons/fa";
// import { allBlogs } from "../../data/blogs";
import { blogApi } from "../../utils/api/blog.api";

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Blog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("created_at_desc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const dropdownRef = useRef(null);
  const blogsPerPage = 8;
  const maxVisibleCategories = 7;

  // Blog list from API
  const [allBlogs, setAllBlogs] = useState([]); // Store all blogs
  const [blogList, setBlogList] = useState([]); // Store filtered blogs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverTotalPages, setServerTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Get unique categories from current list
  const categories = [
    "all",
    ...new Set((blogList || []).map((blog) => blog.categoryName).filter(Boolean)),
  ];

  // Category display logic
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, maxVisibleCategories);
  const hiddenCategoriesCount = categories.length - maxVisibleCategories;
  const hasHiddenCategories = hiddenCategoriesCount > 0;

  // Featured articles - always visible, get first 2 blogs
  const featuredBlogs = (allBlogs || []).slice(0, 2);

  // Regular articles - affected by search, category, and sorting
  const filteredRegularBlogs = blogList.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || blog.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination - only for regular articles
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredRegularBlogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog
  );
  const totalPages = Math.ceil(filteredRegularBlogs.length / blogsPerPage);
  const effectiveTotalPages = serverTotalPages || totalPages;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Các tùy chọn sắp xếp
  const sortOptions = [
    { id: 1, name: "Mới nhất", value: "created_at_desc" },
    { id: 2, name: "Cũ nhất", value: "created_at_asc" },
    { id: 3, name: "A-Z", value: "title_asc" },
    { id: 4, name: "Z-A", value: "title_desc" },
  ];

  const selectedOption =
    sortOptions.find((option) => option.value === sortOption) || sortOptions[0];

  const handleSortChange = (value) => {
    setSortOption(value);
    setIsDropdownOpen(false);
  };

  // Fetch all blogs (without pagination) to handle client-side filtering correctly
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch all blogs without pagination for proper filtering
        // We'll fetch a larger number to ensure we get all blogs
        const res = await blogApi.getAll(
          1,
          1000, // Fetch a large number to get all blogs
          "createdDate",
          "desc"
        );
        
        const allBlogsData = res?.data?.content || [];
        setAllBlogs(Array.isArray(allBlogsData) ? allBlogsData : []);
        setServerTotalPages(0); // We're fetching all data, so we should use client-side pagination
        setTotalElements(res?.data?.totalElements || allBlogsData.length || 0);
      } catch (e) {
        setError(e?.message || "Không tải được danh sách blog");
        setAllBlogs([]);
        setServerTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBlogs();
  }, []);

  // Apply client-side filters and sorting
  useEffect(() => {
    let result = [...allBlogs];
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortOption === "created_at_desc") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      } else if (sortOption === "created_at_asc") {
        return new Date(a.createdDate) - new Date(b.createdDate);
      } else if (sortOption === "title_asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "title_desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
    
    setBlogList(result);
  }, [allBlogs, sortOption]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-gray-800/30" />

        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
                <FaLeaf className="text-white text-3xl drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Blog Detox
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Khám phá những bí quyết detox hiệu quả cho sức khỏe và sự sống
              động của bạn
            </p>

            {/* Decorative elements */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <div className="w-16 h-0.5 bg-white/50"></div>
              <FaHeart className="text-white/70 text-xl" />
              <div className="w-16 h-0.5 bg-white/50"></div>
            </div>
          </div>
        </div>

        {/* Floating elements for decoration */}
        <div className="absolute top-20 left-10 opacity-20">
          <FaLeaf className="text-white text-2xl animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <FaLeaf
            className="text-white text-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="absolute top-32 right-1/4 opacity-15">
          <FaLeaf
            className="text-white text-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Articles - Luôn hiển thị khi có bài viết nổi bật phù hợp */}
        {featuredBlogs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <FaStar className="text-yellow-500 text-2xl" />
              <h2 className="text-3xl font-bold text-gray-900">
                Bài viết nổi bật
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => navigate(`/blog/${blog.slugName}`)}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-400 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {blog.categoryName}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-gray-900 p-2 rounded-full">
                        <FaStar className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(blog.createdDate)}
                        </div>
                        <span>{blog.readTime}</span>
                      </div>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-700 transition-all duration-200 bg-white"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <div className="flex flex-wrap gap-2">
                {visibleCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-green-400 text-white shadow-md transform scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {category === "all" ? "Tất cả" : category}
                  </button>
                ))}

                {/* Show +N... button if there are hidden categories */}
                {hasHiddenCategories && !showAllCategories && (
                  <button
                    onClick={() => setShowAllCategories(true)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white text-green-400 border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    +{hiddenCategoriesCount}
                  </button>
                )}

                {/* Show collapse button when all categories are visible */}
                {showAllCategories && hasHiddenCategories && (
                  <button
                    onClick={() => setShowAllCategories(false)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white text-green-400 border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="w-full lg:w-auto relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full lg:w-48 px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 bg-white cursor-pointer transition-all duration-200 hover:border-green-300 hover:shadow-sm text-left"
                >
                  {selectedOption.name}
                </button>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Custom Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                          sortOption === option.value
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:text-green-600"
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Regular Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Tất cả bài viết
          </h2>
          {loading ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-gray-400 text-3xl animate-pulse" />
              </div>
              <p className="text-gray-500">Đang tải bài viết...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-red-400 text-3xl" />
              </div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : currentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => navigate(`/blog/${blog.slugName}`)}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-400 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {blog.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(blog.createdDate)}
                      </div>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-gray-400 text-3xl" />
              </div>
              <p className="text-xl text-gray-600 mb-2">
                Không tìm thấy bài viết
              </p>
              <p className="text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {effectiveTotalPages > 0 && (
          <nav className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((x) => Math.max(x - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            >
              Trước
            </button>

            {Array.from({ length: effectiveTotalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                  currentPage === i + 1
                    ? "bg-green-400 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-400"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((x) => Math.min(x + 1, effectiveTotalPages))
              }
              disabled={currentPage === effectiveTotalPages}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            >
              Sau
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
