import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaExchangeAlt, FaLeaf, FaGift, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Notification from "../common/Nontification";
import { productApi } from "../../utils/api/product.api";
import { profileApi } from "../../utils/api/profile.api";

const voucherData = [
  {
    id: 1,
    discountValue: 5000,
    minOrderValue: 20000,
    exchangePoint: 100,
    active: true,
    percentage: false,
    name: "Giảm 5.000đ",
    description: "Cho đơn hàng từ 20.000đ",
    code: "VOUCHER5K"
  },
  {
    id: 2,
    discountValue: 10,
    minOrderValue: 50000,
    exchangePoint: 300,
    active: true,
    percentage: true,
    name: "Giảm 10%",
    description: "Cho đơn hàng từ 50.000đ",
    code: "VOUCHER10P"
  },
  {
    id: 3,
    discountValue: 20000,
    minOrderValue: 100000,
    exchangePoint: 500,
    active: true,
    percentage: false,
    name: "Giảm 20.000đ",
    description: "Cho đơn hàng từ 100.000đ",
    code: "VOUCHER20K"
  },
  {
    id: 4,
    discountValue: 15,
    minOrderValue: 150000,
    exchangePoint: 700,
    active: true,
    percentage: true,
    name: "Giảm 15%",
    description: "Cho đơn hàng từ 150.000đ",
    code: "VOUCHER15P"
  },
  {
    id: 5,
    discountValue: 50000,
    minOrderValue: 300000,
    exchangePoint: 1200,
    active: true,
    percentage: false,
    name: "Giảm 50.000đ",
    description: "Cho đơn hàng từ 300.000đ",
    code: "VOUCHER50K"
  },
  // Adding 10 more vouchers
  {
    id: 6,
    discountValue: 30000,
    minOrderValue: 150000,
    exchangePoint: 600,
    active: true,
    percentage: false,
    name: "Giảm 30.000đ",
    description: "Cho đơn hàng từ 150.000đ",
    code: "VOUCHER30K"
  },
  {
    id: 7,
    discountValue: 20,
    minOrderValue: 200000,
    exchangePoint: 800,
    active: true,
    percentage: true,
    name: "Giảm 20%",
    description: "Cho đơn hàng từ 200.000đ",
    code: "VOUCHER20P"
  },
  {
    id: 8,
    discountValue: 100000,
    minOrderValue: 500000,
    exchangePoint: 1500,
    active: true,
    percentage: false,
    name: "Giảm 100.000đ",
    description: "Cho đơn hàng từ 500.000đ",
    code: "VOUCHER100K"
  },
  {
    id: 9,
    discountValue: 5,
    minOrderValue: 30000,
    exchangePoint: 150,
    active: true,
    percentage: true,
    name: "Giảm 5%",
    description: "Cho đơn hàng từ 30.000đ",
    code: "VOUCHER5P"
  },
  {
    id: 10,
    discountValue: 15000,
    minOrderValue: 70000,
    exchangePoint: 250,
    active: true,
    percentage: false,
    name: "Giảm 15.000đ",
    description: "Cho đơn hàng từ 70.000đ",
    code: "VOUCHER15K"
  },
  {
    id: 11,
    discountValue: 25,
    minOrderValue: 250000,
    exchangePoint: 900,
    active: true,
    percentage: true,
    name: "Giảm 25%",
    description: "Cho đơn hàng từ 250.000đ",
    code: "VOUCHER25P"
  },
  {
    id: 12,
    discountValue: 70000,
    minOrderValue: 350000,
    exchangePoint: 1300,
    active: true,
    percentage: false,
    name: "Giảm 70.000đ",
    description: "Cho đơn hàng từ 350.000đ",
    code: "VOUCHER70K"
  },
  {
    id: 13,
    discountValue: 10000,
    minOrderValue: 50000,
    exchangePoint: 200,
    active: true,
    percentage: false,
    name: "Giảm 10.000đ",
    description: "Cho đơn hàng từ 50.000đ",
    code: "VOUCHER10K"
  },
  {
    id: 14,
    discountValue: 30,
    minOrderValue: 300000,
    exchangePoint: 1000,
    active: true,
    percentage: true,
    name: "Giảm 30%",
    description: "Cho đơn hàng từ 300.000đ",
    code: "VOUCHER30P"
  },
  {
    id: 15,
    discountValue: 5000,
    minOrderValue: 25000,
    exchangePoint: 120,
    active: true,
    percentage: false,
    name: "Giảm 5.000đ",
    description: "Cho đơn hàng từ 25.000đ",
    code: "VOUCHER5KA"
  }
];

export default function VoucherExchange() {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isExchanging, setIsExchanging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);

  // Calculate number of slides (5 vouchers per slide)
  const vouchersPerSlide = 5;
  const totalSlides = Math.ceil(voucherData.length / vouchersPerSlide);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (auth?.accessToken) {
        try {
          const response = await profileApi.getPointDetail(auth.accessToken);
          if (response && response.data && response.data.currentPoints !== undefined) {
            setUserPoints(response.data.currentPoints);
          }
        } catch (error) {
          console.error("Error fetching user points:", error);
        }
      }
    };

    fetchUserPoints();
  }, [auth?.accessToken]);

  const handleVoucherSelect = (voucher) => {
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
  };

  const handleExchangeVoucher = async () => {
    if (!selectedVoucher) {
      // Use alert instead of modal
      alert("Vui lòng chọn một voucher để đổi điểm!");
      return;
    }

    if (userPoints < selectedVoucher.exchangePoint) {
      // Use alert instead of modal
      alert(`Bạn cần ít nhất ${selectedVoucher.exchangePoint} điểm để đổi voucher này!`);
      return;
    }

    if (!auth?.accessToken) {
      // Use alert instead of modal
      alert("Vui lòng đăng nhập để đổi voucher!");
      return;
    }

    setIsExchanging(true);
    try {
      const voucherPayload = {
        discountValue: selectedVoucher.discountValue,
        minOrderValue: selectedVoucher.minOrderValue,
        image: "",
        exchangePoint: selectedVoucher.exchangePoint,
        active: selectedVoucher.active,
        percentage: selectedVoucher.percentage
      };
      
      await productApi.exchangeVoucher(voucherPayload, auth.accessToken);
      
      // Use alert instead of modal for success
      alert(`Đổi voucher "${selectedVoucher.name}" thành công!`);
      
      try {
        const response = await profileApi.getPointDetail(auth.accessToken);
        if (response && response.data && response.data.currentPoints !== undefined) {
          setUserPoints(response.data.currentPoints);
        }
      } catch (error) {
        console.error("Error refreshing user points:", error);
      }
      
      setSelectedVoucher(null);
    } catch (error) {
      console.error("Failed to exchange voucher:", error);
      // Use alert instead of modal for error
      alert("Không thể đổi voucher. Vui lòng thử lại sau!");
    } finally {
      setIsExchanging(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const formatPercentage = (value) => {
    return value + "%";
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get vouchers for current slide
  const getCurrentVouchers = () => {
    const startIndex = currentSlide * vouchersPerSlide;
    const endIndex = startIndex + vouchersPerSlide;
    return voucherData.slice(startIndex, endIndex);
  };

  return (
    <div className="w-full bg-white p-6 md:p-8 mb-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center justify-center gap-3">
          <FaGift className="text-black" />
          Đổi Điểm Lấy Ưu Đãi
        </h2>
        <p className="text-black/80 mt-2 text-sm md:text-base font-medium">
          Đổi điểm tích lũy để nhận các voucher hấp dẫn
        </p>
        <div className="mt-5 p-4 bg-black rounded-xl inline-block border border-gray-200 shadow-lg">
          <p className="text-white font-medium">
            Điểm hiện tại: <span className="text-green-400 font-bold text-lg">{userPoints.toLocaleString()}</span> điểm
          </p>
        </div>
      </div>

      {/* Voucher grid with carousel - buttons on sides */}
      <div 
        className="flex items-center justify-between gap-4"
        onMouseEnter={() => setShowNavButtons(true)}
        onMouseLeave={() => setShowNavButtons(false)}
      >
        {/* Previous button on the left */}
        <button 
          onClick={prevSlide}
          className={`p-2 rounded-full bg-black text-green-400 hover:bg-gray-800 transition-all duration-300 ${
            showNavButtons ? 'opacity-100 visible' : 'opacity-0 invisible'
          } disabled:opacity-50 self-center`}
          disabled={totalSlides <= 1}
        >
          <FaChevronLeft className="text-xl" />
        </button>
        
        {/* Voucher grid in the center */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 flex-grow">
          {getCurrentVouchers().map((voucher) => (
            <div
              key={voucher.id}
              onClick={() => handleVoucherSelect(voucher)}
              className={`relative rounded-xl p-5 cursor-pointer transition-all duration-300 border-2 bg-black shadow-lg ${
                selectedVoucher?.id === voucher.id
                  ? "border-green-400 shadow-md"
                  : "border-gray-700 hover:border-gray-600 hover:shadow-xl"
              }`}
            >
              {selectedVoucher?.id === voucher.id && (
                <div className="absolute -top-2 -right-2 bg-green-400 rounded-full p-1.5 border-2 border-green-400">
                  <FaCheck className="text-black text-xs font-bold" />
                </div>
              )}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-green-400 rounded-full p-3 w-12 h-12 flex items-center justify-center">
                    <FaGift className="text-black text-xl" />
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg">
                  {voucher.percentage 
                    ? formatPercentage(voucher.discountValue) 
                    : formatCurrency(voucher.discountValue)}
                </h3>
                <p className="text-xs text-gray-300 mt-1.5 font-medium">{voucher.description}</p>
                <div className="mt-4 py-2 bg-gray-800 rounded-lg">
                  <p className="font-semibold text-white text-sm">
                    {voucher.exchangePoint.toLocaleString()} điểm
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Next button on the right */}
        <button 
          onClick={nextSlide}
          className={`p-2 rounded-full bg-black text-green-400 hover:bg-gray-800 transition-all duration-300 ${
            showNavButtons ? 'opacity-100 visible' : 'opacity-0 invisible'
          } disabled:opacity-50 self-center`}
          disabled={totalSlides <= 1}
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>
      
      {/* Dot indicators below the vouchers */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index 
                  ? "bg-black" 
                  : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={handleExchangeVoucher}
          disabled={isExchanging || !selectedVoucher}
          className={`px-6 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center mx-auto transition-all duration-300 shadow-lg ${
            isExchanging || !selectedVoucher
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 active:bg-gray-900 border border-gray-600 hover:border-green-400 hover:shadow-xl"
          }`}
        >
          {isExchanging ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            <>
              <FaExchangeAlt className="mr-2" />
              Đổi Voucher
            </>
          )}
        </button>
        
        {selectedVoucher && (
          <div className="mt-4 text-black font-medium max-w-md mx-auto">
            <p className="text-sm bg-gray-100 backdrop-blur-sm rounded-lg p-3 shadow border border-gray-300">
              Bạn sẽ đổi{" "}
              <span className="font-bold text-green-600">{selectedVoucher.exchangePoint.toLocaleString()} điểm</span>{" "}
              lấy voucher{" "}
              <span className="font-bold">
                {selectedVoucher.percentage 
                  ? formatPercentage(selectedVoucher.discountValue) 
                  : formatCurrency(selectedVoucher.discountValue)}
              </span>
            </p>
          </div>
        )}
      </div>

      <Notification
        isOpen={showNotification}
        type={notificationType}
        message={notificationMessage}
        onClose={handleCloseNotification}
        action={[{ label: "OK", onClick: handleCloseNotification }]}
      />
    </div>
  );
}