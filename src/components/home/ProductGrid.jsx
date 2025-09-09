/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaFire,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { getHotProducts } from "../../data/products";
import { useDispatch } from "react-redux";
import { addToCart } from "../../state/Cart/Action";
import { useEffect, useState } from "react";
import { productApi } from "../../utils/api/product.api";

const ProductGrid = () => {
  const dispatch = useDispatch();
  // Lấy tất cả sản phẩm hot
  // const products = getHotProducts();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  // Hàm render sao đánh giá
  // const renderStars = (rating) => {
  //   const full = Math.floor(rating);
  //   const half = rating % 1 >= 0.5;
  //   const empty = 5 - full - (half ? 1 : 0);
  //   return (
  //     <div className="flex items-center space-x-0.5">
  //       {Array(full)
  //         .fill()
  //         .map((_, i) => (
  //           <FaStar key={`f-${i}`} className="w-5 h-5 text-yellow-400" />
  //         ))}
  //       {half && <FaStarHalfAlt className="w-5 h-5 text-yellow-400" />}
  //       {Array(empty)
  //         .fill()
  //         .map((_, i) => (
  //           <FaRegStar key={`e-${i}`} className="w-5 h-5 text-yellow-400" />
  //         ))}
  //       <span className="ml-2 text-sm text-gray-500">({rating})</span>
  //     </div>
  //   );
  // };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
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
  }, [products, page, size]);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FaLeaf className="text-green-600" /> Sản Phẩm Nổi Bật
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative"
            >
              {/* Badge HOT */}
              {product.hot && (
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
                  src={product.image}
                  alt={product.name}
                  className="block w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Thông tin */}
              <div className="p-5">
                <h3
                  onClick={() =>
                    (window.location.href = `/product/${product.id}`)
                  }
                  className="text-lg font-bold text-green-800 truncate cursor-pointer hover:text-green-600 transition"
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-gray-500 mt-1 mb-2 truncate">
                    {product.description}
                  </p>
                )}
                <p className="text-sm text-green-600 font-medium">
                  {product.category}
                </p>

                {/* <div className="mt-3 mb-3">{renderStars(product.rating)}</div> */}

                <p className="text-sm text-gray-500">
                  Đã bán: {product.purchases}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold text-green-800">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <FiShoppingCart />
                    <span className="text-xs font-semibold">Thêm</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl"
          >
            <FaLeaf className="w-5 h-5" /> Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
