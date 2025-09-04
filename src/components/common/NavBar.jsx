import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineLock,
  AiOutlineSearch,
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineAppstore,
  AiOutlineEdit,
  AiOutlinePhone,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineDelete,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "../../state/Cart/Action";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = { name: "Thuong Nguyen" };
  
  const cartItems = useSelector(state => state.cart.cartItems);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartOpen || isUserMenuOpen) {
        setIsCartOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    
    if (isCartOpen || isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCartOpen, isUserMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate("/login");
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const menuLinks = [
    { to: "/", label: "Trang chủ", icon: AiOutlineHome },
    { to: "/about", label: "Giới thiệu", icon: AiOutlineInfoCircle },
    { to: "/search", label: "Sản phẩm", icon: AiOutlineAppstore },
    { to: "/blog", label: "Blog", icon: AiOutlineEdit },
    { to: "/contact", label: "Liên hệ", icon: AiOutlinePhone },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600"
      >
        <div className="container mx-auto px-3 md:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src="http://res.cloudinary.com/dsenbweg2/image/upload/v1752324108/wiy6ivh4puq2evq4ccna.jpg"
                    alt="DetoxCare Logo"
                    className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 object-cover rounded-xl shadow-lg 
                              transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  />
                  <div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 
                                opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  ></div>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight transition-colors duration-300 text-white"
                  >
                    DetoxCare
                  </span>
                  <span
                    className="text-xs md:text-sm font-medium opacity-75 transition-colors duration-300 text-green-100"
                  >
                    Natural & Healthy
                  </span>
                </div>
              </Link>
            </div>

            {/* Enhanced Search Bar */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-lg xl:max-w-xl mx-2 md:mx-4 lg:mx-6 xl:mx-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const query = form.search.value.trim();
                  if (query) {
                    navigate(`/search?query=${encodeURIComponent(query)}`);
                  }
                  form.reset();
                }}
                className="relative w-full"
              >
                <div
                  className={`relative flex items-center transition-all duration-300 ${
                    searchFocused ? "scale-105" : ""
                  }`}
                >
                  <AiOutlineSearch
                    className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 text-green-500"
                  />
                  <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm sản phẩm detox..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-4 pr-16 py-3 rounded-2xl border-2 border-transparent
                              bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500
                              focus:outline-none focus:border-green-400 focus:bg-white focus:shadow-lg
                              transition-all duration-300 text-sm font-medium text-left
                              placeholder:text-left"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-2 bg-gradient-to-r from-green-500 to-emerald-500 
                              text-white rounded-xl hover:from-green-600 hover:to-emerald-600 
                              transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <AiOutlineSearch className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300
                    text-white/90 hover:text-white hover:bg-white/20
                    before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r 
                    before:from-green-400 before:to-emerald-400 before:opacity-0 
                    hover:before:opacity-20 before:transition-opacity before:duration-300
                    transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              {/* Enhanced Cart */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCartOpen(!isCartOpen);
                  }}
                  className="relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110 text-white/80 hover:text-white hover:bg-white/20"
                >
                  <AiOutlineShoppingCart className="w-7 h-7" />
                  {totalCartItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 
                                   text-white text-xs font-bold px-1.5 py-0.5 rounded-full 
                                   animate-bounce shadow-lg"
                    >
                      {totalCartItems}
                    </span>
                  )}
                </button>

                {/* Enhanced Cart Dropdown */}
                <div
                  className={`absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100
                  transition-all duration-300 z-50 overflow-hidden ${
                    isCartOpen 
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 
                                   bg-clip-text text-transparent"
                      >
                        Giỏ hàng của bạn
                      </h3>
                      <span className="text-sm text-gray-500">
                        {totalCartItems} sản phẩm
                      </span>
                    </div>

                    {cartItems.length > 0 ? (
                      <>
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-xl 
                                          hover:bg-gray-50 transition-colors duration-200 group/item"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-xl shadow-md 
                                         group-hover/item:scale-105 transition-transform duration-200"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 truncate">
                                  {item.name}
                                </h4>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(decreaseQuantity(item.id));
                                      }}
                                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 
                                               flex items-center justify-center transition-colors duration-200
                                               text-gray-600 hover:text-red-600"
                                      disabled={item.quantity <= 1}
                                    >
                                      <AiOutlineMinus className="w-3 h-3" />
                                    </button>
                                    <span className="min-w-[2rem] text-center font-medium text-gray-700">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(increaseQuantity(item.id));
                                      }}
                                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-green-100 
                                               flex items-center justify-center transition-colors duration-200
                                               text-gray-600 hover:text-green-600"
                                    >
                                      <AiOutlinePlus className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(removeFromCart(item.id));
                                    }}
                                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 
                                             flex items-center justify-center transition-colors duration-200
                                             text-gray-600 hover:text-red-600"
                                    title="Xóa sản phẩm"
                                  >
                                    <AiOutlineDelete className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="font-semibold text-green-600 mt-1">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-800">
                              Tổng cộng:
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(getTotalPrice())}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to="/cart"
                              onClick={() => setIsCartOpen(false)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 
                                       text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 
                                       transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                            >
                              Xem giỏ hàng
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <AiOutlineShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          Giỏ hàng của bạn đang trống
                        </p>
                        <Link
                          to="/search"
                          onClick={() => setIsCartOpen(false)}
                          className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 
                                   text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 
                                   transition-all duration-200"
                        >
                          Mua sắm ngay
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced User Menu - Hidden on mobile */}
              <div className="hidden md:block">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      className="p-1 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg 
                                 ring-2 ring-white/20 hover:ring-green-300"
                    >
                      <img
                        src="https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg"
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </button>

                    <div
                      className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100
                           transition-all duration-300 z-50 overflow-hidden ${
                             isUserMenuOpen 
                               ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                               : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                           }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                          <img
                            src="https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg"
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Thành viên VIP
                            </p>
                          </div>
                        </div>

                        <div className="py-2">
                          {[
                            {
                              icon: AiOutlineSetting,
                              label: "Hồ sơ cá nhân",
                              action: () => navigate("/profile"),
                              color: "text-blue-600",
                            },
                            {
                              icon: AiOutlineLock,
                              label: "Lịch sử đơn hàng",
                              action: () => navigate("/history-order"),
                              color: "text-purple-600",
                            },
                            {
                              icon: AiOutlineLogout,
                              label: "Đăng xuất",
                              action: handleLogout,
                              color: "text-red-600",
                            },
                          ].map((item, index) => (
                            <button
                              key={index}
                              onClick={item.action}
                              className={`w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 
                                         transition-all duration-200 ${item.color} hover:scale-105`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-6 py-2.5 bg-white text-green-700 
                               rounded-xl font-semibold hover:bg-gray-50 hover:text-green-800 
                               transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
                               border border-green-200"
                  >
                    <AiOutlineUser className="w-5 h-5" />
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-xl transition-all duration-300 text-white hover:bg-white/20"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-6 max-h-[40rem] overflow-y-auto">
            {/* Mobile User Profile */}
            {isLoggedIn ? (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg"
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">Thành viên VIP</p>
                  </div>
                </div>

                {/* Mobile User Actions */}
                <div className="mt-4 space-y-2">
                  {[
                    {
                      icon: AiOutlineSetting,
                      label: "Cập nhật hồ sơ",
                      action: () => navigate("/profile"),
                      color: "text-blue-600",
                    },
                    {
                      icon: AiOutlineLock,
                      label: "Đổi mật khẩu",
                      action: () => navigate("/change-password"),
                      color: "text-purple-600",
                    },
                    {
                      icon: AiOutlineLogout,
                      label: "Đăng xuất",
                      action: handleLogout,
                      color: "text-red-600",
                    },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 
                                 transition-all duration-200 ${item.color} hover:scale-105`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 
                            hover:bg-green-50 hover:text-green-700 transition-all duration-200 
                            font-medium"
                >
                  <AiOutlineUser className="w-6 h-6" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}

            {/* Mobile Search */}
            <div className="mb-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const query = form.search.value.trim();
                  if (query) {
                    navigate(`/search?query=${encodeURIComponent(query)}`);
                  }
                  form.reset();
                }}
                className="relative"
              >
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                            focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                            bg-white text-gray-800 text-left placeholder:text-left"
                />
              </form>
            </div>

            {/* Mobile Menu Links */}
            <div className="space-y-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 
                            hover:bg-green-50 hover:text-green-700 transition-all duration-200 
                            font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
}
