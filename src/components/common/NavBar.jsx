import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineLock,
} from 'react-icons/ai';
import { FaLeaf } from 'react-icons/fa';

const cartItems = [
  {
    id: 1,
    name: 'Nước Detox Chanh',
    price: 184000,
    quantity: 2,
    image: 'https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg',
  },
  {
    id: 2,
    name: 'Trà quốc mật ong',
    price: 87000,
    quantity: 1,
    image: 'https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA',
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken')); // Initialize based on accessToken
  const navigate = useNavigate();
  const user = { name: 'Thuong Nguyen' };
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Check for accessToken on mount and listen for storage changes
  useEffect(() => {
    // Initial check for accessToken
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    // Listen for storage events (e.g., accessToken removal from Profile component)
    const handleStorageChange = (event) => {
      if (event.key === 'accessToken') {
        setIsLoggedIn(!!localStorage.getItem('accessToken'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove accessToken
    setIsLoggedIn(false); // Update state
    navigate('/login'); // Redirect to login page
  };

  // Function to format price in VND
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center space-x-4 transition-transform duration-200 hover:scale-105 hover:shadow-lg rounded-md p-1">
          <Link to="/" className="flex items-center space-x-2">
            <FaLeaf className="w-8 h-8 text-white" />
            <span className="text-3xl font-extrabold tracking-tight text-white">DetoxCare</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center justify-end w-full max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value;
              navigate(`/search?query=${encodeURIComponent(query)}`);
            }}
            className="relative w-full"
          >
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center">
              <div className="bg-green-600 p-2 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
            </span>
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-12 pr-4 py-2 rounded-lg bg-green-100 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
          </form>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-base font-semibold">
          {[
            { to: '/', label: 'Trang chủ' },
            { to: '/about', label: 'Giới thiệu' },
            { to: '/search', label: 'Sản phẩm' },
            { to: '/blog', label: 'Blog' },
            { to: '/contact', label: 'Liên hệ' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative text-white hover:text-green-100
                 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-100
 edits                 after:transition-all after:duration-300 hover:after:w-full
                 transition-transform duration-200 hover:scale-110 hover:shadow-md px-2 py-1 rounded-md"
            >
              {link.label}
            </Link>
          ))}

          {/* Cart */}
          <div className="relative group hidden md:block">
            <div
              onClick={() => navigate('/cart')}
              className="relative p-2.5 rounded-full bg-green-700 cursor-pointer transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl"
            >
              <AiOutlineShoppingCart className="w-6 h-6 text-white" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </div>

            {/* Cart Popup */}
            <div className="absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-xl shadow-2xl
              opacity-0 translate-y-4 pointer-events-none
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
              transition-all duration-300 z-50">
              <div className="p-5">
                <h3 className="text-base font-bold text-green-700 mb-4">Giỏ hàng</h3>
                {cartItems.length > 0 ? (
                  <ul className="space-y-5">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-4 text-sm hover:bg-gray-100 p-2 rounded-lg transition">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <span className="font-medium">{item.name} (x{item.quantity})</span>
                          <p className="text-green-600 font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">Giỏ hàng trống</p>
                )}
                <Link
                  to="/cart"
                  className="block mt-5 text-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          </div>

          {/* User */}
          {isLoggedIn ? (
            <div className="relative group hidden md:block">
              <div
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-full bg-green-700 
                  transition-transform duration-300 transform group-hover:scale-110 group-hover:shadow-xl"
              >
                <img
                  src="https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg"
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white font-semibold text-sm">{user.name}</span>
              </div>

              {/* User Menu */}
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-2xl 
                    opacity-0 translate-y-4 pointer-events-none 
                    group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto 
                    transition-all duration-300 z-50">
                <div className="p-2 flex flex-col space-y-2 text-sm font-medium">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
                  >
                    <AiOutlineSetting className="w-5 h-5" /> Cập nhật hồ sơ
                  </button>
                  <button
                    onClick={() => navigate('/change-password')}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
                  >
                    <AiOutlineLock className="w-5 h-5" /> Đổi mật khẩu
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-red-100 p-2 text-red-600 rounded"
                  >
                    <AiOutlineLogout className="w-5 h-5" /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-5 py-2.5 bg-white text-green-700 border-2 border-green-500 rounded-lg font-semibold hover:bg-green-50 hover:text-green-800 transition-all duration-300"
            >
              <AiOutlineUser className="w-5 h-5 mr-2" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white hover:text-green-100"
          onClick={toggleMenu}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}