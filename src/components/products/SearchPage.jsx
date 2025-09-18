import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaLeaf,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaFire,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
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
  const [filterHot, setFilterHot] = useState(false);
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
  }, [query, categoryFilter, minPrice, maxPrice, minRating, sortByPurchases, filterHot]);

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
      result = result.filter((p) => (p.salePrice || p.price) >= minP);
    }
    if (!isNaN(maxP)) {
      result = result.filter((p) => (p.salePrice || p.price) <= maxP);
    }
    
    // Apply rating filter
    const minR = parseFloat(minRating);
    if (!isNaN(minR)) {
      result = result.filter((p) => (p.statisticsRate?.averageRate || 0) >= minR);
    }
    
    // Apply HOT filter
    if (filterHot) {
      result = result.filter((p) => p.active === true);
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
    filterHot,
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

  /* ======= UI ======= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header / Banner */}
        {hasQuery ? (
          <div className="mb-10">
            <div className="w-full bg-gradient-to-r from-green-600 to-lime-500 rounded-2xl py-10 px-6 text-center text-white shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3">
                <FaLeaf className="animate-pulse" />
                Kết quả tìm kiếm
              </h1>
              <p className="mt-3 text-white/90">
                Từ khóa:{" "}
                <span className="font-semibold underline decoration-white/80">
                  {query}
                </span>
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setCategoryFilter("");
                    navigate("/search");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white/90 text-green-700 rounded-full hover:bg-white transition shadow font-semibold"
                >
                  <FaLeaf className="text-green-600" />
                  Xem tất cả sản phẩm
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <div className="w-full bg-gradient-to-r from-green-600 to-lime-500 rounded-2xl py-10 px-6 text-center text-white shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3">
                <FaLeaf className="animate-pulse" />
                Tất cả sản phẩm
              </h1>
              <p className="mt-3 text-white/90">
                Khám phá các sản phẩm tốt nhất từ DetoxCare
              </p>
            </div>
          </div>
        )}

        {/* No filter bar when searching (requested) */}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* === Sidebar === */}
          {!hasQuery && (
            <aside className="lg:w-1/4">
              <div className="sticky top-24 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-green-700">Danh mục</h2>
                  <button
                    onClick={() => setShowAllFilters((v) => !v)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full text-green-700 hover:bg-green-100 hover:shadow transition"
                    aria-label={
                      showAllFilters ? "Thu gọn danh mục" : "Mở rộng danh mục"
                    }
                    title={
                      showAllFilters ? "Thu gọn danh mục" : "Mở rộng danh mục"
                    }
                  >
                    {showAllFilters ? <FaMinus /> : <FaPlus />}
                  </button>
                </div>
                <ul className="space-y-3">
                  {showAllFilters ? (
                    // Mở rộng: hiển thị toàn bộ danh mục (bao gồm 'Tất cả')
                    <>
                      {categories.map((cat) => {
                        const value = cat === "Tất cả" ? "" : cat;
                        const active = categoryFilter === value;
                        return (
                          <li key={cat}>
                            <button
                              onClick={() => setCategoryFilter(value)}
                              className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                                ${
                                  active
                                    ? "bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md"
                                    : "text-green-700 hover:bg-green-100 hover:shadow"
                                }`}
                            >
                              {cat}
                            </button>
                          </li>
                        );
                      })}
                    </>
                  ) : (
                    // Thu gọn: chỉ hiển thị hạng mục đang chọn
                    <li>
                      <button
                        onClick={() => setCategoryFilter(categoryFilter)}
                        className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                          ${"bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md"}`}
                      >
                        {categoryFilter || "Tất cả"}
                      </button>
                    </li>
                  )}
                </ul>

                {/* Giá cả đã chuyển xuống cuối */}

                {/* Đánh giá (thu gọn/mở rộng giống danh mục) */}
                <div className="mt-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-green-700">
                      Đánh giá
                    </h2>
                    <button
                      onClick={() => setShowRatingOptions((v) => !v)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-green-700 hover:bg-green-100 hover:shadow transition"
                      aria-label={
                        showRatingOptions
                          ? "Thu gọn đánh giá"
                          : "Mở rộng đánh giá"
                      }
                      title={
                        showRatingOptions
                          ? "Thu gọn đánh giá"
                          : "Mở rộng đánh giá"
                      }
                    >
                      {showRatingOptions ? <FaMinus /> : <FaPlus />}
                    </button>
                  </div>
                  {showRatingOptions ? (
                    <ul className="space-y-3">
                      {[
                        { label: "Tất cả", value: "" },
                        { label: "4.5", value: "4.5" },
                        { label: "4", value: "4" },
                        { label: "3.5", value: "3.5" },
                        { label: "3", value: "3" },
                      ].map((opt) => (
                        <li key={opt.value || "all"}>
                          <button
                            onClick={() => setMinRating(opt.value)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                              ${
                                minRating === opt.value
                                  ? "bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md"
                                  : "text-green-700 hover:bg-green-100 hover:shadow"
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
                                        className="text-yellow-400"
                                      />
                                    );
                                  if (rem >= 0.5)
                                    return (
                                      <FaStarHalfAlt
                                        key={i}
                                        className="text-yellow-400"
                                      />
                                    );
                                  return (
                                    <FaRegStar
                                      key={i}
                                      className="text-yellow-400"
                                    />
                                  );
                                })}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <button
                      onClick={() => setMinRating(minRating)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md`}
                    >
                      {minRating === "" ? (
                        <span>Tất cả</span>
                      ) : (
                        <span className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const v = parseFloat(minRating);
                            const rem = v - i;
                            if (rem >= 1)
                              return (
                                <FaStar key={i} className="text-yellow-300" />
                              );
                            if (rem >= 0.5)
                              return (
                                <FaStarHalfAlt
                                  key={i}
                                  className="text-yellow-300"
                                />
                              );
                            return (
                              <FaRegStar key={i} className="text-yellow-300" />
                            );
                          })}
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {/* Lượt mua (thu gọn/mở rộng giống đánh giá) */}
                <div className="mt-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-green-700">
                      Lượt mua
                    </h2>
                    <button
                      onClick={() => setShowPurchasesOptions((v) => !v)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-green-700 hover:bg-green-100 hover:shadow transition"
                      aria-label={
                        showPurchasesOptions
                          ? "Thu gọn lượt mua"
                          : "Mở rộng lượt mua"
                      }
                      title={
                        showPurchasesOptions
                          ? "Thu gọn lượt mua"
                          : "Mở rộng lượt mua"
                      }
                    >
                      {showPurchasesOptions ? <FaMinus /> : <FaPlus />}
                    </button>
                  </div>
                  {showPurchasesOptions ? (
                    <ul className="space-y-3">
                      {[
                        { label: "Mặc định", value: "" },
                        { label: "Tăng dần", value: "asc" },
                        { label: "Giảm dần", value: "desc" },
                      ].map((opt) => (
                        <li key={opt.value || "default"}>
                          <button
                            onClick={() => setSortByPurchases(opt.value)}
                            className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                              ${
                                sortByPurchases === opt.value
                                  ? "bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md"
                                  : "text-green-700 hover:bg-green-100 hover:shadow"
                              }`}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                      {/* Toggle HOT */}
                      <li>
                        <button
                          onClick={() => setFilterHot((v) => !v)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                            ${
                              filterHot
                                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md"
                                : "text-red-600 bg-red-50 hover:bg-red-100 hover:shadow"
                            }`}
                          title="Chỉ hiển thị sản phẩm HOT"
                        >
                          <span className="flex items-center gap-2">
                            <FaFire />
                            HOT
                          </span>
                          {/* Không cần chữ 'Bật' khi active */}
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSortByPurchases(sortByPurchases)}
                        className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-md`}
                      >
                        {sortByPurchases === "asc"
                          ? "Tăng dần"
                          : sortByPurchases === "desc"
                          ? "Giảm dần"
                          : "Mặc định"}
                      </button>
                      {filterHot && (
                        <div className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow">
                          <FaFire className="text-sm" /> HOT
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Giá cả (đưa xuống cuối) */}
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-green-700 mb-5">
                    Giá cả
                  </h2>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      placeholder="Từ (đ)"
                      className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      placeholder="Đến (đ)"
                      className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setMinPrice(draftMinPrice);
                        setMaxPrice(draftMaxPrice);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
                    >
                      <AiOutlineSearch className="w-4 h-4" />
                      <span>Lọc giá</span>
                    </button>
                  </div>
                </div>

                {/* Nút xóa lọc */}
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setMinPrice("");
                      setMaxPrice("");
                      setMinRating("");
                      setSortByPurchases("");
                      setFilterHot(false);
                      setDraftMinPrice("");
                      setDraftMaxPrice("");
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Xóa lọc
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* === Product Grid === */}
          <main className={`${hasQuery ? "w-full" : "lg:w-3/4"}`}>
            {loading ? (
              <div className="text-center py-20">
                <FaLeaf className="mx-auto text-7xl text-green-200 mb-4 animate-pulse" />
                <p className="text-xl text-gray-500">Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <FaLeaf className="mx-auto text-7xl text-red-200 mb-4" />
                <p className="text-xl text-red-500">{error}</p>
              </div>
            ) : currentItems.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentItems.map((p) => (
                    <article
                      key={p.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300
                                 transform hover:-translate-y-2 overflow-hidden group relative"
                    >
                      {/* Badge HOT */}
                      {p.active && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <FaFire className="text-sm" />
                            HOT
                          </div>
                        </div>
                      )}

                      {/* Ảnh */}
                      <div className="relative rounded-2xl overflow-hidden leading-[0]">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="block w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Thông tin */}
                      <div className="p-5">
                        <h3
                          onClick={() => navigate(`/product/${p.id}`)}
                          className="text-lg font-bold text-green-800 truncate cursor-pointer hover:text-green-600 transition"
                        >
                          {p.name}
                        </h3>
                        {p.description && (
                          <p className="text-xs text-gray-500 mt-1 mb-2 truncate">
                            {p.description}
                          </p>
                        )}
                        <p className="text-sm text-green-600 font-medium">
                          {p.typeProduct?.name}
                        </p>

                        <div className="mt-3 mb-3">{renderStars(p.statisticsRate?.averageRate, p.statisticsRate?.totalRate)}</div>

                        <p className="text-sm text-gray-500">
                          Đã bán: {p.statisticsRate?.totalSale || 0}
                        </p>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex flex-col">
                            <span className="text-lg text-red-500 line-through font-medium">
                              {(p.price || 0).toLocaleString("vi-VN")}₫
                            </span>
                            <span className="text-2xl font-bold text-green-800">
                              {(p.salePrice || p.price || 0).toLocaleString("vi-VN")}₫
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(p)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-full
                                     hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                          >
                            <FiShoppingCart />
                            <span className="text-xs font-semibold">Thêm</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <nav className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage((x) => Math.max(x - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition
                        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                        bg-green-600 text-white hover:bg-green-700 shadow"
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-full text-sm font-bold transition
                          ${
                            currentPage === i + 1
                              ? "bg-green-700 text-white scale-110 shadow-md"
                              : "bg-white text-green-700 border border-green-300 hover:bg-green-100"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((x) => Math.min(x + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition
                        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                        bg-green-600 text-white hover:bg-green-700 shadow"
                    >
                      Sau
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <FaLeaf className="mx-auto text-7xl text-green-200 mb-4" />
                <p className="text-xl text-gray-500">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}