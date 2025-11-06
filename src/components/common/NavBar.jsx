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
import { increaseQuantity, decreaseQuantity, removeFromCart, fetchCartFromServer, increaseQuantityFromServer, decreaseQuantityFromServer, deleteCartItemFromServer } from "../../state/Cart/Action";
import { logout } from "../../state/Authentication/Action";
import { getProfileByUserId } from "../../state/Profile/Action";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartState = useSelector(state => state.cart);
  const cartItems = cartState.cartItems;
  const cartError = cartState.error;
  const auth = useSelector(state => state.auth);
  const profileState = useSelector(state => state.profile);
  const totalCartItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  const userData = profileState?.profile?.data || {};
  const userAvatar = userData.avatar || "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg";
  const username = userData.username || auth?.user?.username || "User";
  
  // Truncate username if it's too long
  const truncatedUsername = username.length > 12 ? `${username.substring(0, 12)}...` : username;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.accessToken) {
        dispatch(fetchCartFromServer());

        let attempts = 0;
        const maxAttempts = 10;
        const getUserIdWithRetry = () => {
          const userId = sessionStorage.getItem("userId");
          console.log("NavBar - Retrieved userId from sessionStorage:", userId);
          if (userId && userId !== "currentUserId") {
            dispatch(getProfileByUserId(userId, auth.accessToken));
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(getUserIdWithRetry, 100);
          } else {
            console.log("NavBar - Failed to retrieve valid userId after", maxAttempts, "attempts");
          }
        };
        getUserIdWithRetry();
      } else {
        dispatch(fetchCartFromServer());
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, auth?.accessToken]);

  useEffect(() => {
    const handleGoogleLoginComplete = () => {
      console.log("NavBar - Google login complete event received");
      setTimeout(() => {
        if (auth?.accessToken) {
          let attempts = 0;
          const maxAttempts = 20;
          const getUserIdWithRetry = () => {
            const userId = sessionStorage.getItem("userId");
            console.log("NavBar - Google login - Retrieved userId from sessionStorage:", userId);
            if (userId && userId !== "currentUserId" && userId !== "undefined" && userId !== "null" && userId.trim() !== "") {
              dispatch(getProfileByUserId(userId, auth.accessToken));
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(getUserIdWithRetry, 200);
            } else {
              console.log("NavBar - Google login - Failed to retrieve valid userId after", maxAttempts, "attempts");
            }
          };
          getUserIdWithRetry();
        }
      }, 200);
    };

    window.addEventListener('googleLoginComplete', handleGoogleLoginComplete);

    return () => {
      window.removeEventListener('googleLoginComplete', handleGoogleLoginComplete);
    };
  }, [auth?.accessToken, dispatch]);

  useEffect(() => {
    if (auth?.accessToken) {
      const handleStorageChange = () => {
        console.log("NavBar - Storage change detected");
        let attempts = 0;
        const maxAttempts = 10;
        const getUserIdWithRetry = () => {
          const userId = sessionStorage.getItem("userId");
          console.log("NavBar - Storage change - Retrieved userId from sessionStorage:", userId);
          if (userId && userId !== "currentUserId") {
            dispatch(getProfileByUserId(userId, auth.accessToken));
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(getUserIdWithRetry, 100);
          } else {
            console.log("NavBar - Storage change - Failed to retrieve valid userId after", maxAttempts, "attempts");
          }
        };
        getUserIdWithRetry();
      };

      handleStorageChange();

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [auth?.accessToken, dispatch]);

  useEffect(() => {
    if (!auth?.accessToken) {
      const handleStorageChange = (e) => {
        if (e.key === 'guestCart') {
          dispatch(fetchCartFromServer());
        }
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [dispatch, auth?.accessToken]);

  useEffect(() => {
    if (!auth?.accessToken) {
      const handleCartChange = () => {
        dispatch(fetchCartFromServer());
      };

      window.addEventListener('cartChange', handleCartChange);

      return () => {
        window.removeEventListener('cartChange', handleCartChange);
      };
    }
  }, [dispatch, auth?.accessToken]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    console.log("Logout initiated");
    dispatch(logout());
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src="http://res.cloudinary.com/dsenbweg2/image/upload/v1752324108/wiy6ivh4puq2evq4ccna.jpg"
                    alt="DetoxCare Logo"
                    className="w-10 h-10 lg:w-11 lg:h-11 object-cover rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl lg:text-2xl font-bold text-gray-900">DetoxCare</span>
                  <span className="text-xs font-medium text-green-400">Natural & Healthy</span>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {menuLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
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
                <div className="relative flex items-center">
                  <AiOutlineSearch className="absolute left-4 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm sản phẩm detox..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                      searchFocused ? 'border-green-400 bg-green-50/30' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCartOpen(!isCartOpen);
                  }}
                  className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <AiOutlineShoppingCart className="w-6 h-6 text-gray-700" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {totalCartItems}
                    </span>
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${
                    isCartOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-gray-900">Giỏ hàng</h3>
                      <span className="text-sm text-gray-500">{totalCartItems} sản phẩm</span>
                    </div>

                    {cartError ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-red-500 text-xl">!</span>
                        </div>
                        <p className="text-red-600 text-sm mb-3">
                          {typeof cartError === 'object' && cartError !== null ?
                            (cartError.messageDetail || cartError.messageCode || JSON.stringify(cartError)) :
                            cartError}
                        </p>
                        <button
                          onClick={() => dispatch(fetchCartFromServer())}
                          className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition text-sm font-medium"
                        >
                          Thử lại
                        </button>
                      </div>
                    ) : cartItems.length > 0 ? (
                      <>
                        <div className="space-y-4 max-h-80 overflow-y-auto mb-5">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                              <img
                                src={item.image || "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg"}
                                alt={item.name || "Sản phẩm"}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm truncate mb-2">
                                  {item.name || "Sản phẩm"}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(decreaseQuantityFromServer(item.id, item.quantity - 1));
                                      }}
                                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                                      disabled={item.quantity <= 1}
                                    >
                                      <AiOutlineMinus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="min-w-[1.5rem] text-center font-semibold text-sm text-gray-900">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(increaseQuantityFromServer(item.id, item.quantity + 1));
                                      }}
                                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                                    >
                                      <AiOutlinePlus className="w-3 h-3 text-gray-600" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log("Delete button clicked for item:", item.id);
                                      dispatch(deleteCartItemFromServer(item.id));
                                    }}
                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors duration-200"
                                    title="Xóa sản phẩm"
                                  >
                                    <AiOutlineDelete className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                                <p className="font-bold text-green-400 text-sm mt-2">
                                  {formatPrice((item.price || 0) * (item.quantity || 0))}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-5 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-900">Tổng cộng:</span>
                            <span className="text-xl font-bold text-green-400">
                              {formatPrice(getTotalPrice())}
                            </span>
                          </div>
                          <Link
                            to="/cart"
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full py-3 bg-green-400 text-white rounded-xl font-semibold hover:bg-green-500 transition-colors duration-200 text-center"
                          >
                            Xem giỏ hàng
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AiOutlineShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">Giỏ hàng của bạn đang trống</p>
                        <Link
                          to="/search"
                          onClick={() => setIsCartOpen(false)}
                          className="inline-block px-6 py-2.5 bg-green-400 text-white rounded-xl font-semibold hover:bg-green-500 transition-colors duration-200 text-sm"
                        >
                          Mua sắm ngay
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                {auth?.accessToken ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      className="flex items-center p-1 rounded-full hover:bg-gray-50 transition-colors duration-200 border border-gray-200 relative -top-1"
                    >
                      <img
                        src={userAvatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    </button>

                    <div
                      className={`absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${
                        isUserMenuOpen
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                          <img
                            src={userAvatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{truncatedUsername}</p>
                          </div>
                        </div>

                        <div className="py-2 space-y-1">
                          {[
                            {
                              icon: AiOutlineSetting,
                              label: "Hồ sơ cá nhân",
                              action: () => navigate("/profile"),
                            },
                            {
                              icon: AiOutlineLock,
                              label: "Lịch sử đơn hàng",
                              action: () => navigate("/history-order"),
                            },
                            {
                              icon: AiOutlineLogout,
                              label: "Đăng xuất",
                              action: handleLogout,
                              danger: true,
                            },
                          ].map((item, index) => (
                            <button
                              key={index}
                              onClick={item.action}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                                item.danger
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium text-sm">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-400 text-white rounded-xl font-semibold hover:bg-green-500 transition-colors duration-200 text-sm"
                  >
                    <AiOutlineUser className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>

              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 border-t border-gray-100 px-4 py-6 max-h-[40rem] overflow-y-auto">
            {auth?.accessToken ? (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={userAvatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{truncatedUsername}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      icon: AiOutlineSetting,
                      label: "Cập nhật hồ sơ",
                      action: () => navigate("/profile"),
                    },
                    {
                      icon: AiOutlineLock,
                      label: "Đổi mật khẩu",
                      action: () => navigate("/change-password"),
                    },
                    {
                      icon: AiOutlineLogout,
                      label: "Đăng xuất",
                      action: handleLogout,
                      danger: true,
                    },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                        item.danger
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-gray-700 hover:bg-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-400 text-white hover:bg-green-500 transition-colors duration-200 font-medium"
                >
                  <AiOutlineUser className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}

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
                <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-green-400 text-gray-900 placeholder-gray-400"
                />
              </form>
            </div>

            <div className="space-y-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-white hover:text-green-400 transition-colors duration-200 font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16 lg:h-18"></div>
    </>
  );
}