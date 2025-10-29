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
  const [userPoints, setUserPoints] = useState(0);

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);

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
      const voucherPayload = {
        discountValue: selectedVoucher.discountValue,
        minOrderValue: selectedVoucher.minOrderValue,
        image: "",
        exchangePoint: selectedVoucher.exchangePoint,
        active: selectedVoucher.active,
        percentage: selectedVoucher.percentage
      };
      
      await productApi.exchangeVoucher(voucherPayload, auth.accessToken);
      
      setNotificationType("success");
      setNotificationMessage(`Đổi voucher "${selectedVoucher.name}" thành công!`);
      setShowNotification(true);
      
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
    <div className="max-w-6xl mx-auto bg-green-400 rounded-2xl shadow-lg p-6 md:p-8 mb-12">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {voucherData.map((voucher) => (
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
              <div className="absolute -top-2 -right-2 bg-green-400 rounded-full p-1.5">
                <FaCheck className="text-black text-xs font-bold" />
              </div>
            )}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-green-400 rounded-full p-3 w-12 h-12 flex items-center justify-center">
                  <FaLeaf className="text-black text-xl" />
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
            <p className="text-sm bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow">
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