import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaExchangeAlt, FaLeaf, FaGift, FaCheck } from "react-icons/fa";
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
  }
];

export default function VoucherExchange() {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isExchanging, setIsExchanging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [userPoints, setUserPoints] = useState(0); // Add state for user points
  
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);

  // Fetch user points when component mounts or when auth changes
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
    // If the clicked voucher is already selected, deselect it
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
  };

  const handleExchangeVoucher = async () => {
    if (!selectedVoucher) {
      setNotificationType("error");
      setNotificationMessage("Vui lòng chọn một voucher để đổi điểm!");
      setShowNotification(true);
      return;
    }

    if (userPoints < selectedVoucher.exchangePoint) {
      setNotificationType("error");
      setNotificationMessage(`Bạn cần ít nhất ${selectedVoucher.exchangePoint} điểm để đổi voucher này!`);
      setShowNotification(true);
      return;
    }

    if (!auth?.accessToken) {
      setNotificationType("error");
      setNotificationMessage("Vui lòng đăng nhập để đổi voucher!");
      setShowNotification(true);
      return;
    }

    setIsExchanging(true);
    try {
      // Prepare the voucher data to send to the API
      const voucherPayload = {
        discountValue: selectedVoucher.discountValue,
        minOrderValue: selectedVoucher.minOrderValue,
        image: "", // Empty string as default
        exchangePoint: selectedVoucher.exchangePoint,
        active: selectedVoucher.active,
        percentage: selectedVoucher.percentage
      };
      
      // Call the exchange API with voucher data
      await productApi.exchangeVoucher(voucherPayload, auth.accessToken);
      
      setNotificationType("success");
      setNotificationMessage(`Đổi voucher "${selectedVoucher.name}" thành công!`);
      setShowNotification(true);
      
      // Refresh user points after successful exchange
      try {
        const response = await profileApi.getPointDetail(auth.accessToken);
        if (response && response.data && response.data.currentPoints !== undefined) {
          setUserPoints(response.data.currentPoints);
        }
      } catch (error) {
        console.error("Error refreshing user points:", error);
      }
      
      // Reset selection
      setSelectedVoucher(null);
    } catch (error) {
      console.error("Failed to exchange voucher:", error);
      setNotificationType("error");
      setNotificationMessage("Không thể đổi voucher. Vui lòng thử lại sau!");
      setShowNotification(true);
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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-700 flex items-center justify-center gap-3">
          <FaGift className="text-emerald-500" />
          Đổi Điểm Lấy Ưu Đãi
        </h2>
        <p className="text-gray-600 mt-2">
          Đổi điểm tích lũy để nhận các voucher hấp dẫn
        </p>
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg inline-block">
          <p className="text-emerald-800 font-semibold">
            Điểm hiện tại của bạn: <span className="text-xl">{userPoints.toLocaleString()}</span> điểm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {voucherData.map((voucher) => (
          <div
            key={voucher.id}
            onClick={() => handleVoucherSelect(voucher)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg bg-gray-100 text-gray-800 relative ${
              selectedVoucher?.id === voucher.id
                ? "ring-4 ring-emerald-300 border-emerald-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {selectedVoucher?.id === voucher.id && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <FaCheck className="text-white text-xs" />
              </div>
            )}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-white rounded-full p-3">
                  <FaLeaf className="text-emerald-600 text-2xl" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mt-2">
                {voucher.percentage 
                  ? formatPercentage(voucher.discountValue) 
                  : formatCurrency(voucher.discountValue)}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{voucher.description}</p>
              <div className="mt-3 p-2 bg-gray-200 rounded-lg">
                <p className="font-semibold text-sm text-gray-700">
                  {voucher.exchangePoint} điểm
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleExchangeVoucher}
          disabled={isExchanging || !selectedVoucher}
          className={`px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center mx-auto transition-all ${
            isExchanging || !selectedVoucher
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {isExchanging ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-4 text-gray-600">
            <p>
              Bạn sẽ đổi <span className="font-semibold">{selectedVoucher.exchangePoint} điểm</span> lấy voucher{" "}
              <span className="font-semibold">
                {selectedVoucher.percentage 
                  ? formatPercentage(selectedVoucher.discountValue) 
                  : formatCurrency(selectedVoucher.discountValue)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Notification */}
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