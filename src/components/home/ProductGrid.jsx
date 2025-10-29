/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaFire,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCartFromServer } from "../../state/Cart/Action";
import { useEffect, useState, useRef } from "react";
import { productApi } from "../../utils/api/product.api";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [page] = useState(1);
  const [size] = useState(8);

  // Hàm render sao đánh giá
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

  const handleAddToCart = (product) => {
    dispatch(addToCartFromServer(product));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const fetchProduct = async () => {
    try {
      const result = await productApi.getAll(page, size);
      setProducts(result.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // Auto scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || products.length === 0) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      
      // Reset scroll when reaching halfway
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      
      scrollContainer.scrollLeft = scrollAmount;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [products]);

  // Duplicate products for infinite scroll
  const allProducts = [...products, ...products];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FaLeaf className="text-green-400" /> Sản Phẩm Nổi Bật
        </h2>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden mb-8"
          style={{ scrollBehavior: 'auto' }}
        >
          {allProducts.map((product, index) => (
            <article
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-[300px] group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-400 transition-all duration-300"
            >
              {/* Badge HOT */}
              {product.active && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <FaFire className="w-3.5 h-3.5" />
                    HOT
                  </div>
                </div>
              )}

              {/* Ảnh */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-block px-3 py-1 bg-green-400 text-white rounded-lg text-xs font-bold truncate shadow-md">
                    {product.typeProduct?.name}
                  </span>
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Thông tin */}
              <div className="p-5">
                <h3
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-green-400 transition cursor-pointer"
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 truncate">
                    {product.description}
                  </p>
                )}

                <div className="mb-3">{renderStars(product.statisticsRate?.averageRate, product.statisticsRate?.totalRate)}</div>

                <p className="text-sm text-gray-500 mb-4">
                  Đã bán: <span className="font-semibold text-gray-700">{product.statisticsRate?.totalSale || 0}</span>
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    {product.salePrice > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {(product.price || 0).toLocaleString("vi-VN")}₫
                      </span>
                    )}
                    <span className="text-2xl font-bold text-gray-900">
                      {(product.salePrice > 0 ? product.salePrice : product.price || 0).toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
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

        <div className="flex justify-center mt-8">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-full hover:bg-green-700 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl"
          >
            <FaLeaf className="w-5 h-5" /> Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;