import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCartFromServer } from "../../state/Cart/Action";
import { productApi } from "../../utils/api/product.api";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query =
    new URLSearchParams(location.search).get("query")?.toLowerCase() || "";
  const hasQuery = query.trim().length > 0;

  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState(["Tất cả"]); // Initialize with "Tất cả"
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Price & Rating filters (áp dụng ở chế độ không có query)
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // Draft inputs to avoid instant filtering; apply on button click
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(""); // '' | 1..5
  const [sortByPurchases, setSortByPurchases] = useState(""); // '' | 'asc' | 'desc'

  // Collapsible controls for sidebar (chỉ hiển thị khi không có query)
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [showRatingOptions, setShowRatingOptions] = useState(false);
  const [showPurchasesOptions, setShowPurchasesOptions] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productApi.getTypeProducts(1, 100, "createdDate", "desc");
        if (res?.data?.content) {
          // Map API response to category names and prepend "Tất cả"
          const categoryNames = ["Tất cả", ...res.data.content.map(cat => cat.name)];
          setCategories(categoryNames);
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        // Fallback to default categories if API fails
        setCategories([
          "Tất cả",
          "Detox",
          "Combo 3 ngày",
          "Combo 5 ngày",
          "Combo 7 ngày",
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all products (without pagination) to handle client-side filtering correctly
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch all products without pagination for proper filtering
        // We'll fetch a larger number to ensure we get all products
        const res = await productApi.getAll(
          1,
          1000, // Fetch a large number to get all products
          "createdDate",
          "desc",
          hasQuery ? query : undefined
        );
        
        const allProductsData = res?.data?.content || [];
        setAllProducts(allProductsData);
      } catch (e) {
        setError(e?.message || "Có lỗi xảy ra khi tải sản phẩm");
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [query, hasQuery]);

  // Reset to first page when query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryFilter, minPrice, maxPrice, minRating, sortByPurchases]);

  // Apply client-side filters and pagination
  useEffect(() => {
    let result = [...allProducts];
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "Tất cả") {
      result = result.filter((p) => p.typeProduct?.name === categoryFilter);
    }
    
    // Apply price filters
    const minP = parseInt(minPrice, 10);
    const maxP = parseInt(maxPrice, 10);
    if (!isNaN(minP)) {
      result = result.filter((p) => (p.salePrice > 0 ? p.salePrice : p.price) >= minP);
    }
    if (!isNaN(maxP)) {
      result = result.filter((p) => (p.salePrice > 0 ? p.salePrice : p.price) <= maxP);
    }
    
    // Apply rating filter
    const minR = parseFloat(minRating);
    if (!isNaN(minR)) {
      result = result.filter((p) => (p.statisticsRate?.averageRate || 0) >= minR);
    }
    

    
    // Apply sorting
    if (sortByPurchases === "asc") {
      result = [...result].sort(
        (a, b) => (a.statisticsRate?.totalSale ?? 0) - (b.statisticsRate?.totalSale ?? 0)
      );
    } else if (sortByPurchases === "desc") {
      result = [...result].sort(
        (a, b) => (b.statisticsRate?.totalSale ?? 0) - (a.statisticsRate?.totalSale ?? 0)
      );
    }
    
    // Update filtered products and calculate pagination
    setFilteredProducts(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage) || 1);
  }, [
    allProducts,
    categoryFilter,
    minPrice,
    maxPrice,
    minRating,
    sortByPurchases,
  ]);

  // Scroll to top whenever search query changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  // Get current page items
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    dispatch(addToCartFromServer(product));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const clearAllFilters = () => {
    setCategoryFilter("");
    setMinPrice("");
    setMaxPrice("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setMinRating("");
    setSortByPurchases("");
  };

  /* ======= Render sao ======= */
  const renderStars = (rating, totalRate) => {
    const numericRating = Number(rating);
    const safeRating = Number.isFinite(numericRating)
      ? Math.max(0, Math.min(5, numericRating))
      : 0;
    const full = Math.floor(safeRating);
    const half = safeRating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <div className="flex items-center space-x-0.5">
        {full > 0 && Array(full)
          .fill()
          .map((_, i) => (
            <FaStar key={`f-${i}`} className="text-yellow-400" />
          ))}
        {half && <FaStarHalfAlt className="text-yellow-400" />}
        {empty > 0 && Array(empty)
          .fill()
          .map((_, i) => (
            <FaRegStar key={`e-${i}`} className="text-yellow-400" />
          ))}
        <span className="ml-1 text-sm text-gray-500">({safeRating})</span>
        {totalRate !== undefined && (
          <span className="ml-1 text-sm text-gray-400">[{totalRate}]</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        {hasQuery ? (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Kết quả tìm kiếm</h1>
                <p className="text-gray-300">
                  Từ khóa: <span className="text-green-400 font-semibold">{query}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            {/* Hero Section - Updated to match Blog.jsx style */}
            <div className="relative h-96 overflow-hidden rounded-3xl">
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
                      <FaStar className="text-white text-3xl drop-shadow-lg" />
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    Khám phá sản phẩm
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                    Tìm kiếm các sản phẩm detox tốt nhất cho sức khỏe của bạn
                  </p>

                  {/* Decorative elements */}
                  <div className="flex justify-center items-center mt-8 gap-4">
                    <div className="w-16 h-0.5 bg-white/50"></div>
                    <FaStar className="text-white/70 text-xl" />
                    <div className="w-16 h-0.5 bg-white/50"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements for decoration */}
              <div className="absolute top-20 left-10 opacity-20">
                <FaStar className="text-white text-2xl animate-pulse" />
              </div>
              <div className="absolute bottom-20 right-10 opacity-20">
                <FaStar
                  className="text-white text-3xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>
              <div className="absolute top-32 right-1/4 opacity-15">
                <FaStar
                  className="text-white text-xl animate-pulse"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {!hasQuery && (
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-8 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-md font-bold text-gray-900">Danh mục</h2>
                    <button
                      onClick={() => setShowAllFilters((v) => !v)}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition"
                    >
                      {showAllFilters ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {showAllFilters ? (
                      <>
                        {categories.map((cat) => {
                          const value = cat === "Tất cả" ? "" : cat;
                          const active = categoryFilter === value;
                          return (
                            <button
                              key={cat}
                              onClick={() => setCategoryFilter(value)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                                active
                                  ? "bg-green-400 text-white shadow-sm"
                                  : "text-gray-700 hover:bg-white"
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </>
                    ) : (
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-green-400 text-white shadow-sm"
                      >
                        {categoryFilter || "Tất cả"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-md font-bold text-gray-900">Đánh giá</h2>
                    <button
                      onClick={() => setShowRatingOptions((v) => !v)}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition"
                    >
                      {showRatingOptions ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  {showRatingOptions ? (
                    <div className="space-y-1.5">
                      {[
                        { label: "Tất cả", value: "" },
                        { label: "4.5", value: "4.5" },
                        { label: "4", value: "4" },
                        { label: "3.5", value: "3.5" },
                        { label: "3", value: "3" },
                      ].map((opt) => (
                        <button
                          key={opt.value || "all"}
                          onClick={() => setMinRating(opt.value)}
                          className={`w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                            minRating === opt.value
                              ? "bg-green-400 text-white shadow-sm"
                              : "text-gray-700 hover:bg-white"
                          }`}
                        >
                          {opt.value === "" ? (
                            <span>Tất cả</span>
                          ) : (
                            <span className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const v = parseFloat(opt.value);
                                const rem = v - i;
                                if (rem >= 1)
                                  return (
                                    <FaStar
                                      key={i}
                                      className={`w-3 h-3 ${minRating === opt.value ? 'fill-white text-white' : 'fill-green-400 text-green-400'}`}
                                    />
                                  );
                                if (rem >= 0.5)
                                  return (
                                    <FaStarHalfAlt
                                      key={i}
                                      className={`w-3 h-3 ${minRating === opt.value ? 'fill-white text-white' : 'fill-green-400 text-green-400'}`}
                                    />
                                  );
                                return (
                                  <FaRegStar
                                    key={i}
                                    className={`w-3 h-3 ${minRating === opt.value ? 'text-white/40' : 'text-gray-300'}`}
                                  />
                                );
                              })}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-green-400 text-white shadow-sm">
                      {minRating === "" ? (
                        <span>Tất cả</span>
                      ) : (
                        <span className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const v = parseFloat(minRating);
                            const rem = v - i;
                            if (rem >= 1)
                              return <FaStar key={i} className="w-3 h-3 fill-white text-white" />;
                            if (rem >= 0.5)
                              return <FaStarHalfAlt key={i} className="w-3 h-3 fill-white text-white" />;
                            return <FaRegStar key={i} className="w-3 h-3 text-white/40" />;
                          })}
                        </span>
                      )}
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-md font-bold text-gray-900">Lượt mua</h2>
                    <button
                      onClick={() => setShowPurchasesOptions((v) => !v)}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition"
                    >
                      {showPurchasesOptions ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  {showPurchasesOptions ? (
                    <div className="space-y-1.5">
                      {[
                        { label: "Mặc định", value: "" },
                        { label: "Tăng dần", value: "asc" },
                        { label: "Giảm dần", value: "desc" },
                      ].map((opt) => (
                        <button
                          key={opt.value || "default"}
                          onClick={() => setSortByPurchases(opt.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                            sortByPurchases === opt.value
                              ? "bg-green-400 text-white shadow-sm"
                              : "text-gray-700 hover:bg-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-green-400 text-white shadow-sm">
                      {sortByPurchases === "asc"
                        ? "Tăng dần"
                        : sortByPurchases === "desc"
                        ? "Giảm dần"
                        : "Mặc định"}
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h2 className="text-md font-bold text-gray-900 mb-3">Giá cả</h2>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={draftMinPrice}
                        onChange={(e) => setDraftMinPrice(e.target.value)}
                        placeholder="Từ"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-xs"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        min="0"
                        value={draftMaxPrice}
                        onChange={(e) => setDraftMaxPrice(e.target.value)}
                        placeholder="Đến"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-xs"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setMinPrice(draftMinPrice);
                        setMaxPrice(draftMaxPrice);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium text-xs"
                    >
                      <AiOutlineSearch className="w-3 h-3" />
                      Áp dụng
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearAllFilters}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-xs"
                >
                  <FiX className="w-3 h-3" />
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </aside>
          )}

          <main className={`${hasQuery ? "w-full" : "flex-1"}`}>
            {loading ? (
              <div className="text-center py-32">
                <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-green-400 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="text-center py-32">
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : currentItems.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((p) => (
                    <article
                      key={p.id}
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-400 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-block px-3 py-1 bg-green-400 text-white rounded-lg text-xs font-bold truncate shadow-md">
                            {p.typeProduct?.name}
                          </span>
                        </div>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-green-400 transition cursor-pointer">
                          {p.name}
                        </h3>

                        {p.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3 truncate">
                            {p.description}
                          </p>
                        )}

                        <div className="mb-3">{renderStars(p.statisticsRate?.averageRate, p.statisticsRate?.totalRate)}</div>

                        <p className="text-sm text-gray-500 mb-4">
                          Đã bán: <span className="font-semibold text-gray-700">{p.statisticsRate?.totalSale || 0}</span>
                        </p>

                        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                          <div className="flex flex-col">
                            {p.salePrice > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                {(p.price || 0).toLocaleString("vi-VN")}₫
                              </span>
                            )}
                            <span className="text-2xl font-bold text-gray-900">
                              {(p.salePrice > 0 ? p.salePrice : p.price || 0).toLocaleString("vi-VN")}₫
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(p);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all font-medium shadow-sm hover:shadow-md"
                          >
                            <FiShoppingCart className="w-4 h-4" />
                            <span className="text-sm">Thêm</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage((x) => Math.max(x - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
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
                      onClick={() => setCurrentPage((x) => Math.min(x + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    >
                      Sau
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-32">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <AiOutlineSearch className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xl text-gray-600 font-medium">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
