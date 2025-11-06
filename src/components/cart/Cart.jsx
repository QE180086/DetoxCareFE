import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaLeaf, FaTrash, FaMinus, FaPlus, FaShoppingCart, FaCheckCircle, FaTimes, FaTicketAlt, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import Notification from "../common/Nontification";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantityFromServer,
  decreaseQuantityFromServer,
  deleteCartItemFromServer,
  deleteAllFromServer
} from "../../state/Cart/Action";
import { cartItemApi } from "../../utils/api/cart-item.api";
import { cartApi } from "../../utils/api/cart.api";
import { getProfileByUserId } from "../../state/Profile/Action";
import { useOrderStatus } from "../../hooks/useOrderStatus";

export default function Cart() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const profileState = useSelector((state) => state.profile);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(false);
  const [voucherResponse, setVoucherResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [voucherOptions, setVoucherOptions] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [isVoucherDropdownOpen, setIsVoucherDropdownOpen] = useState(false);
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);
  const [voucherCodeInput, setVoucherCodeInput] = useState("");

  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const { status: orderStatus, checkStatus, startPolling, stopPolling } = useOrderStatus(
    null,
    authState?.accessToken
  );

  useEffect(() => {
    if (paymentOrderId && authState?.accessToken && showQRCodeModal) {
      startPolling(paymentOrderId);
    }

    return () => {
      stopPolling();
    };
  }, [paymentOrderId, authState?.accessToken, showQRCodeModal, startPolling, stopPolling]);

  const profile = profileState?.profile?.data;

  const getShippingInfo = () => {
    if (!profile) return { fullName: "", phoneNumber: "", address: "" };

    return {
      fullName: profile.fullName || profile.nickName || profile.username || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.addresses?.find(addr => addr.default)?.address || ""
    };
  };

  const shippingInfo = getShippingInfo();

  useEffect(() => {
    if (authState?.accessToken) {
      fetchCartFromAPI();
    } else {
      fetchCartFromLocalStorage();
    }
  }, [authState?.accessToken]);

  const fetchCartFromAPI = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cartItemApi.createCart({}, authState.accessToken);

      if (response?.data) {
        setCartItems(response.data.cartItems || []);
        setTotalPrice(response.data.totalPrice || 0);
        setDiscountedPrice(response.data.discountedPrice || 0);
        setAppliedVoucher(response.data.appliedVoucher || false);
        setVoucherResponse(response.data.voucherResponse || null);
        setCartId(response.data.id || null);

        if (response.data.appliedVoucher && response.data.voucherResponse) {
          setSelectedVoucher({
            code: response.data.voucherResponse.code,
            ...response.data.voucherResponse
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError(err.message || "Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartFromLocalStorage = () => {
    setIsLoading(true);
    setError(null);

    try {
      const guestCart = sessionStorage.getItem('guestCart');
      const cartItems = guestCart ? JSON.parse(guestCart) : [];

      const formattedCartItems = cartItems.map(item => ({
        id: item.id || item.cartItemId,
        productId: item.productId || item.id,
        productName: item.name || item.productName || "Sản phẩm",
        productImage: item.image || item.productImage || "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg",
        unitPrice: item.price || item.unitPrice || 0,
        price: item.price || item.unitPrice || 0,
        quantity: item.quantity || 1
      }));

      setCartItems(formattedCartItems);

      const subtotal = formattedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      setTotalPrice(subtotal);
      setDiscountedPrice(subtotal * (1 - discount));

    } catch (err) {
      console.error("Failed to fetch guest cart:", err);
      setError("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("accessToken");

    if (authState?.accessToken && userId && token) {
      dispatch(getProfileByUserId(userId, token))
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
        });
    }
  }, [dispatch, authState?.accessToken]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (authState?.accessToken && userId) {
      fetchUserVouchers();
    }
  }, [authState?.accessToken]);

  const fetchUserVouchers = async () => {
    const userId = sessionStorage.getItem("userId");

    if (authState?.accessToken && userId) {
      setLoadingVouchers(true);
      try {
        const response = await cartItemApi.getUserVouchers(
          1, 8, "createdDate", "desc", userId, authState.accessToken
        );

        const contentArray = response?.data?.content;
        if (!contentArray || !Array.isArray(contentArray)) {
          setVoucherOptions([]);
          return;
        }

        const vouchers = contentArray
          .filter(item => {
            return item && item.used === false;
          })
          .map(item => {
            if (!item.voucher) {
              return null;
            }

            const voucherData = {
              code: item.voucher.code || "",
              label: item.voucher.code || "",
              discountPercentage: item.voucher.percentage ? (item.voucher.discountValue / 100) : 0,
              ...item.voucher
            };

            return voucherData;
          })
          .filter(voucher => voucher !== null);

        setVoucherOptions(vouchers);
      } catch (error) {
        // Show alert for errors
        alert("Không thể tải mã giảm giá. Vui lòng thử lại sau.");
      } finally {
        setLoadingVouchers(false);
      }
    }
  };

  const applyVoucherToCart = async (voucherCode) => {
    const voucher = voucherOptions.find(v => v.code === voucherCode) || tempSelectedVoucher;

    const currentTotal = discountedPrice !== undefined ? discountedPrice : subtotal;
    if (voucher && voucher.minOrderValue && currentTotal < voucher.minOrderValue) {
      // Show alert for errors
      alert(`Đơn hàng của bạn chưa đạt mức tối thiểu ${voucher.minOrderValue.toLocaleString("vi-VN")}₫ để áp dụng mã giảm giá này.`);
      throw new Error("Minimum order value not met");
    }

    if (authState?.accessToken) {
      try {
        const response = await cartItemApi.applyVoucher(voucherCode, authState.accessToken);

        if (response?.data) {
          setCartItems(response.data.cartItems || []);
          setTotalPrice(response.data.totalPrice || 0);
          setDiscountedPrice(response.data.discountedPrice || 0);
          setAppliedVoucher(response.data.appliedVoucher || false);
          setVoucherResponse(response.data.voucherResponse || null);
        }

        return response;
      } catch (error) {
        // Show alert for errors instead of modal
        alert("Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.");
        throw error;
      }
    } else {
      try {
        if (voucher) {
          setSelectedVoucher(voucher);
          setDiscount(voucher.discountPercentage || 0);

          const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
          const discountAmount = subtotal * (voucher.discountPercentage || 0);
          setDiscountedPrice(subtotal - discountAmount);

          setVoucherMessage(`Áp dụng thành công mã ${voucherCode}!`);

          setTimeout(() => {
            setVoucherMessage("");
          }, 2000);

          return { success: true };
        } else {
          // Show alert for errors
          alert("Mã giảm giá không hợp lệ.");
          throw new Error("Voucher not found");
        }
      } catch (error) {
        // Show alert for errors instead of modal
        alert("Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.");
        throw error;
      }
    }
  };

  const removeVoucherFromCart = async (voucherCode) => {
    if (authState?.accessToken) {
      try {
        const response = await cartItemApi.removeVoucher(voucherCode, authState.accessToken);

        if (response?.data) {
          setCartItems(response.data.cartItems || []);
          setTotalPrice(response.data.totalPrice || 0);
          setDiscountedPrice(response.data.discountedPrice || 0);
          setAppliedVoucher(response.data.appliedVoucher || false);
          setVoucherResponse(response.data.voucherResponse || null);
          setSelectedVoucher(null);
        }

        return response;
      } catch (error) {
        // Show alert for errors instead of modal
        alert("Không thể hủy mã giảm giá. Vui lòng thử lại sau.");
        throw error;
      }
    } else {
      try {
        setSelectedVoucher(null);
        setDiscount(0);

        const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        setDiscountedPrice(subtotal);

        setVoucherMessage(`Đã hủy áp dụng mã ${voucherCode}!`);

        setTimeout(() => {
          setVoucherMessage("");
        }, 2000);

        return { success: true };
      } catch (error) {
        // Show alert for errors instead of modal
        alert("Không thể hủy mã giảm giá. Vui lòng thử lại sau.");
        throw error;
      }
    }
  };

  const handleDropdownToggle = () => {
    const userId = sessionStorage.getItem("userId");

    if (!loadingVouchers) {
      const newState = !isVoucherDropdownOpen;
      setIsVoucherDropdownOpen(newState);

      if (newState && voucherOptions.length === 0 && authState?.accessToken && userId) {
        fetchUserVouchers();
      }
    }
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const total = (discountedPrice !== undefined ?
    discountedPrice :
    subtotal * (1 - discount)) + shippingFee;

  const removeItem = (id) => {
    // Use browser's native confirm dialog instead of custom modal
    const shouldRemove = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
    
    if (!shouldRemove) {
      return; // User cancelled the removal
    }
    
    if (authState?.accessToken) {
      const item = cartItems.find((i) => i.id === id);

      dispatch(deleteCartItemFromServer(id))
        .then(() => {
          fetchCartFromAPI();
          // Use alert instead of modal for success message
          alert(`Đã xóa "${item.productName}" khỏi giỏ hàng!`);
        })
        .catch((error) => {
          console.error("Failed to delete item:", error);
          // Show alert for errors
          alert("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
        });
    } else {
      try {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);

        sessionStorage.setItem('guestCart', JSON.stringify(updatedCartItems));

        window.dispatchEvent(new Event('cartChange'));

        const subtotal = updatedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        setTotalPrice(subtotal);
        setDiscountedPrice(subtotal * (1 - discount));

        // Use alert instead of modal for success message
        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
      } catch (error) {
        console.error("Failed to remove item from guest cart:", error);
        // Show alert for errors
        alert("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      }
    }
  };

  const handlePaymentPreview = () => {
    if (
      paymentMethod &&
      shippingInfo.fullName.trim() &&
      shippingInfo.address.trim() &&
      shippingInfo.phoneNumber.trim()
    ) {
      setShowPreview(true);
    }
  };

  const handlePayment = async () => {
    setShowPreview(false);
    setIsProcessingPayment(true);

    if (!authState?.accessToken) {
      // Show alert for errors
      alert("Vui lòng đăng nhập để thanh toán.");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const paymentData = {
        method: paymentMethod === "cod" ? "CASH" : "BANK",
        amount: total
      };

      const response = await cartItemApi.createPayment(paymentData, authState.accessToken);

      if (response.success) {
        const paymentInfo = response.data;

        // Store order details for success screen
        setOrderDetails({
          orderId: paymentInfo.ordersId,
          amount: total,
          paymentMethod: paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng mã QR",
          shippingInfo,
          items: cartItems,
          voucher: selectedVoucher,
          shippingFee,
          discountedPrice
        });

        if (paymentInfo.method === "CASH") {
          dispatch(deleteAllFromServer());
          setIsProcessingPayment(false);
          setPaymentSuccess(true);
          // For success, just show the success section without alert
        } else if (paymentInfo.method === "BANK") {
          setQRCodeData(paymentInfo.qrCode);
          setPaymentOrderId(paymentInfo.ordersId);
          setShowQRCodeModal(true);
          setIsProcessingPayment(false);
          startPolling(paymentInfo.ordersId);
        }
      } else {
        const errorMessage = response.message?.messageDetail || "Thanh toán thất bại. Vui lòng thử lại.";
        // Show alert for errors
        alert(errorMessage);
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      // Show alert for errors
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (orderStatus === "COMPLETED") {
      stopPolling();
      // For success, just show the success section without alert
      setShowQRCodeModal(false);
      dispatch(deleteAllFromServer());
      setPaymentSuccess(true);
    }
  }, [orderStatus, paymentOrderId, dispatch, stopPolling]);

  useEffect(() => {
    const calculateShippingFee = async () => {
      if (cartId && shippingInfo.fullName && shippingInfo.address && shippingInfo.phoneNumber) {
        // Check if address contains "Thành phố Quy Nhơn" and display fixed fee of 10,000₫
        if (shippingInfo.address.includes("Thành phố Quy Nhơn")) {
          setShippingFee(10000);
          return;
        }
        
        try {
          const fullAddress = `${shippingInfo.address}, ${shippingInfo.fullName}, ${shippingInfo.phoneNumber}`;
          const response = await cartApi.calculateGhnFee(fullAddress, cartId);

          if (response?.data) {
            setShippingFee(response.data);
          }
        } catch (error) {
          console.error("Failed to calculate shipping fee:", error);
          setShippingFee(0);
        }
      } else {
        setShippingFee(0);
      }
    };

    calculateShippingFee();
  }, [cartId, shippingInfo]);

  const paymentInfo = {
    orderId: "ORD" + Date.now(),
    amount: total.toLocaleString("vi-VN"),
    bank: "DetoxCare Bank",
    accountNumber: "1234567890",
    accountHolder: "DetoxCare",
    userName: shippingInfo.fullName,
    address: shippingInfo.address,
    phoneNumber: shippingInfo.phoneNumber,
  };

  const handleCloseNotification = () => setShowNotification(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-400 mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">
            {typeof error === 'object' && error !== null ?
              (error.messageDetail || error.messageCode || JSON.stringify(error)) :
              error}
          </p>
          <button
            onClick={() => fetchCartFromAPI()}
            className="px-6 py-2.5 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
            <FaShoppingCart className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
        </div>

        {paymentSuccess ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-green-400 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
              <p className="text-gray-600">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.</p>
            </div>

            {orderDetails && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin đơn hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Mã đơn hàng</p>
                      <p className="font-semibold">#{orderDetails.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                      <p className="font-semibold">{orderDetails.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="font-semibold text-green-400">{orderDetails.amount.toLocaleString("vi-VN")}₫</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p className="font-semibold text-green-500">Đã xác nhận</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin giao hàng</h3>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Họ tên:</span> {orderDetails.shippingInfo.fullName}</p>
                    <p><span className="font-semibold">Địa chỉ:</span> {orderDetails.shippingInfo.address}</p>
                    <p><span className="font-semibold">Số điện thoại:</span> {orderDetails.shippingInfo.phoneNumber}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm đã đặt</h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                          <p className="text-gray-600">{item.quantity} x {item.unitPrice.toLocaleString("vi-VN")}₫</p>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt thanh toán</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{(orderDetails.discountedPrice !== undefined ? orderDetails.discountedPrice : 
                        orderDetails.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)).toLocaleString("vi-VN")}₫</span>
                    </div>
                    {orderDetails.voucher && (
                      <div className="flex justify-between text-green-500">
                        <span>Giảm giá ({orderDetails.voucher.code})</span>
                        <span>-{(orderDetails.voucher.discountValue?.toLocaleString("vi-VN") || 0)}{orderDetails.voucher.percentage ? '%' : '₫'}</span>
                      </div>
                    )}
                    {orderDetails.shippingFee > 0 && (
                      <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{orderDetails.shippingFee.toLocaleString("vi-VN")}₫</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Tổng cộng</span>
                      <span className="text-green-400">{orderDetails.amount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/history-order")}
                className="px-8 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium inline-flex items-center gap-2"
              >
                <FaLeaf />
                Quản lý đơn hàng
              </button>
            </div>
          </div>
        ) : showQRCodeModal ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán bằng QR Code</h2>
              <p className="text-gray-600">
                Mã đơn hàng: <span className="font-semibold text-green-400">{paymentOrderId}</span>
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <img
                  src={qrCodeData}
                  alt="QR Code thanh toán"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-6">
              <p className="text-center text-green-700 font-medium">
                Quét mã QR bằng ứng dụng ngân hàng để hoàn tất thanh toán
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-medium"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        ) : (
          <>
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-bold text-gray-900">Sản phẩm</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                          <div className="flex gap-4">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-2">{item.productName}</h3>
                              <p className="text-green-400 font-bold text-lg mb-3">
                                {item.unitPrice.toLocaleString("vi-VN")}₫
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="inline-flex items-center gap-3 bg-gray-100 rounded-lg p-1.5">
                                  <button
                                    onClick={() => {
                                      if (authState?.accessToken) {
                                        if (item.quantity <= 1) {
                                          removeItem(item.id);
                                        } else {
                                          dispatch(decreaseQuantityFromServer(item.id, item.quantity - 1))
                                            .then(() => fetchCartFromAPI())
                                            .catch((error) => {
                                              console.error("Failed to decrease quantity:", error);
                                              // Show alert for errors
                                              alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                            });
                                        }
                                      } else {
                                        try {
                                          if (item.quantity <= 1) {
                                            removeItem(item.id);
                                          } else {
                                            const updatedCartItems = cartItems.map(cartItem => {
                                              if (cartItem.id === item.id) {
                                                return { ...cartItem, quantity: cartItem.quantity - 1 };
                                              }
                                              return cartItem;
                                            });

                                            setCartItems(updatedCartItems);
                                            sessionStorage.setItem('guestCart', JSON.stringify(updatedCartItems));
                                            window.dispatchEvent(new Event('cartChange'));

                                            const subtotal = updatedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                                            setTotalPrice(subtotal);
                                            setDiscountedPrice(subtotal * (1 - discount));
                                          }
                                        } catch (error) {
                                          console.error("Failed to decrease quantity for guest user:", error);
                                          // Show alert for errors
                                          alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                        }
                                      }
                                    }}
                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                                  >
                                    <FaMinus className="text-gray-600 text-xs" />
                                  </button>
                                  <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => {
                                      if (authState?.accessToken) {
                                        dispatch(increaseQuantityFromServer(item.id, item.quantity + 1))
                                          .then(() => fetchCartFromAPI())
                                          .catch((error) => {
                                            console.error("Failed to increase quantity:", error);
                                            // Show alert for errors
                                            alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                          });
                                      } else {
                                        try {
                                          const updatedCartItems = cartItems.map(cartItem => {
                                            if (cartItem.id === item.id) {
                                              return { ...cartItem, quantity: cartItem.quantity + 1 };
                                            }
                                            return cartItem;
                                          });

                                          setCartItems(updatedCartItems);
                                          sessionStorage.setItem('guestCart', JSON.stringify(updatedCartItems));
                                          window.dispatchEvent(new Event('cartChange'));

                                          const subtotal = updatedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                                          setTotalPrice(subtotal);
                                          setDiscountedPrice(subtotal * (1 - discount));
                                        } catch (error) {
                                          console.error("Failed to increase quantity for guest user:", error);
                                          // Show alert for errors
                                          alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                        }
                                      }
                                    }}
                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                                  >
                                    <FaPlus className="text-gray-600 text-xs" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition group"
                                >
                                  <FaTrash className="text-red-500 group-hover:text-red-600 text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {authState?.accessToken && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FaMapMarkerAlt className="text-green-400" />
                        <h3 className="text-lg font-bold text-gray-900">Thông tin giao hàng</h3>
                      </div>

                      {shippingInfo.fullName && shippingInfo.address && shippingInfo.phoneNumber ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <FaUser className="text-gray-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
                              <p className="font-semibold text-gray-900">{shippingInfo.fullName}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <FaPhone className="text-gray-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                              <p className="font-semibold text-gray-900">{shippingInfo.phoneNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <FaMapMarkerAlt className="text-gray-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                              <p className="font-semibold text-gray-900">{shippingInfo.address}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate("/profile")}
                            className="w-full py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-green-400 hover:text-green-400 transition font-medium"
                          >
                            Chỉnh sửa thông tin
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaMapMarkerAlt className="text-gray-400 text-2xl" />
                          </div>
                          <p className="text-gray-600 mb-4">Vui lòng cập nhật thông tin giao hàng</p>
                          <button
                            onClick={() => navigate("/profile")}
                            className="px-6 py-2.5 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium"
                          >
                            Cập nhật ngay
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  {authState?.accessToken && shippingInfo.fullName && shippingInfo.address && shippingInfo.phoneNumber ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                          <span>Tạm tính</span>
                          <span className="font-semibold">
                            {(totalPrice !== undefined ? totalPrice : subtotal).toLocaleString("vi-VN")}₫
                          </span>
                        </div>

                        {((appliedVoucher && voucherResponse) || discount > 0) && (
                          <div className="flex justify-between text-green-500">
                            <span>Giảm giá</span>
                            <span className="font-semibold">
                              {voucherResponse ? (
                                <span>-{voucherResponse.discountValue?.toLocaleString("vi-VN") || 0}{voucherResponse.percentage ? '%' : '₫'}</span>
                              ) : (
                                <span>-{(subtotal * discount).toLocaleString("vi-VN")}₫</span>
                              )}
                            </span>
                          </div>
                        )}

                        {shippingFee > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển</span>
                            <span className="font-semibold">{shippingFee.toLocaleString("vi-VN")}₫</span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex justify-between text-gray-900">
                            <span className="font-bold text-lg">Tổng cộng</span>
                            <span className="font-bold text-lg text-green-400">
                              {(discountedPrice !== undefined ? (discountedPrice + shippingFee) : total).toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <FaTicketAlt className="text-green-400" />
                          <label className="font-semibold text-gray-900">Mã giảm giá</label>
                        </div>

                        <div className="relative">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={selectedVoucher?.code || tempSelectedVoucher?.code || voucherCodeInput || ""}
                              onChange={(e) => {
                                setVoucherCodeInput(e.target.value);
                                if (tempSelectedVoucher) {
                                  setTempSelectedVoucher(null);
                                }
                              }}
                              placeholder="Nhập mã giảm giá"
                              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 transition"
                              disabled={loadingVouchers || (!authState?.accessToken) || (!!selectedVoucher)}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedVoucher) {
                                  handleDropdownToggle();
                                }
                              }}
                              className={`px-3 border border-gray-200 rounded-lg transition ${selectedVoucher ? 'cursor-default bg-gray-100' : 'cursor-pointer hover:border-green-400'}`}
                              disabled={loadingVouchers || (!authState?.accessToken) || (!!selectedVoucher)}
                            >
                              <svg
                                className={`w-5 h-5 transition-transform text-gray-500 ${isVoucherDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                          </div>

                          {isVoucherDropdownOpen && !loadingVouchers && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                              <div
                                onClick={() => {
                                  setTempSelectedVoucher(null);
                                  setVoucherCodeInput("");
                                  setIsVoucherDropdownOpen(false);
                                }}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                              >
                                <span className="text-gray-600">Không sử dụng mã</span>
                              </div>

                              {voucherOptions && voucherOptions.length > 0 ? (
                                voucherOptions.map((voucher) => (
                                  <div
                                    key={voucher.code || voucher.id || `voucher-${Math.random()}`}
                                    onClick={() => {
                                      setTempSelectedVoucher(voucher);
                                      setVoucherCodeInput(voucher.code);
                                      setIsVoucherDropdownOpen(false);
                                    }}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                  >
                                    <div className="font-semibold text-gray-900 mb-1">{voucher.code}</div>
                                    <div className="text-sm text-green-500 mb-1">
                                      Giảm {voucher.discountValue?.toLocaleString("vi-VN") || 0}{voucher.percentage ? '%' : '₫'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Đơn tối thiểu: {voucher.minOrderValue?.toLocaleString("vi-VN") || 0}₫
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-gray-500">Không có mã giảm giá</div>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {!selectedVoucher && (
                              <button
                                onClick={async () => {
                                  const codeToApply = tempSelectedVoucher?.code || voucherCodeInput;
                                  if (!codeToApply) {
                                    // Show alert for errors instead of modal
                                    alert("Vui lòng nhập mã giảm giá.");
                                    return;
                                  }

                                  try {
                                    let voucherToApply = tempSelectedVoucher;
                                    if (!voucherToApply) {
                                      voucherToApply = voucherOptions.find(v => v.code === codeToApply);
                                    }

                                    const response = await applyVoucherToCart(codeToApply);

                                    if (voucherToApply) {
                                      setSelectedVoucher(voucherToApply);
                                      setDiscount(voucherToApply.discountPercentage || 0);
                                    } else {
                                      setSelectedVoucher({ code: codeToApply });
                                    }

                                    setVoucherMessage(`Áp dụng thành công mã ${codeToApply}!`);

                                    setTimeout(() => {
                                      setVoucherMessage("");
                                    }, 2000);
                                  } catch (error) {
                                    console.error("Error applying voucher:", error);
                                  }
                                }}
                                className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium text-sm"
                                disabled={!authState?.accessToken || loadingVouchers}
                              >
                                Áp dụng
                              </button>
                            )}

                            {selectedVoucher && (
                              <button
                                onClick={async () => {
                                  try {
                                    await removeVoucherFromCart(selectedVoucher.code);

                                    setSelectedVoucher(null);
                                    setTempSelectedVoucher(null);
                                    setVoucherCodeInput("");
                                    setDiscount(0);
                                    setVoucherMessage(`Đã hủy áp dụng mã ${selectedVoucher.code}!`);

                                    setTimeout(() => {
                                      setVoucherMessage("");
                                    }, 2000);
                                  } catch (error) {
                                    console.error("Error removing voucher:", error);
                                  }
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                              >
                                Hủy
                              </button>
                            )}
                          </div>

                          {voucherMessage && (
                            <p className="text-sm text-green-500 mt-2">{voucherMessage}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Phương thức thanh toán</h4>
                        <div className="space-y-2">
                          {[
                            { id: "cod", label: "Thanh toán khi nhận hàng" },
                            { id: "qr", label: "Thanh toán bằng mã QR" },
                          ].map((m) => (
                            <label
                              key={m.id}
                              className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                                paymentMethod === m.id
                                  ? "border-green-400 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={m.id}
                                checked={paymentMethod === m.id}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="hidden"
                              />
                              <span className="font-medium text-gray-900">{m.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handlePaymentPreview}
                        disabled={!paymentMethod || !shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phoneNumber}
                        className="w-full py-3.5 bg-green-400 text-white rounded-xl hover:bg-green-500 transition font-bold text-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Xác nhận thanh toán
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaMapMarkerAlt className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          {authState?.accessToken ? "Cập nhật thông tin giao hàng" : "Đăng nhập để thanh toán"}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                          {authState?.accessToken
                            ? "Vui lòng cập nhật thông tin để tiếp tục"
                            : "Bạn cần đăng nhập để thanh toán"}
                        </p>
                        {authState?.accessToken ? (
                          <button
                            onClick={() => navigate("/profile")}
                            className="px-6 py-2.5 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium"
                          >
                            Cập nhật ngay
                          </button>
                        ) : (
                          <Link
                            to="/login"
                            className="inline-block px-6 py-2.5 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium"
                          >
                            Đăng nhập
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingCart className="text-gray-400 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h2>
                <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition font-medium"
                >
                  <FaLeaf />
                  Mua sắm ngay
                </Link>
              </div>
            )}
          </>
        )}

        {showPreview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-green-400 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FaLeaf className="text-white text-lg" />
                    </div>
                    <h2 className="text-2xl font-bold">Xác nhận đơn hàng</h2>
                  </div>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                  >
                    <FaTimes className="text-white" />
                  </button>
                </div>
                <p className="mt-2 text-green-100">Vui lòng kiểm tra lại thông tin trước khi xác nhận</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Order Items Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShoppingCart className="text-green-400" />
                    Sản phẩm trong đơn hàng
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
                          <p className="text-sm text-gray-500">{item.quantity} x {item.unitPrice.toLocaleString("vi-VN")}₫</p>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Information */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-400" />
                      Thông tin giao hàng
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FaUser className="text-gray-400 mt-1 text-sm" />
                        <div>
                          <p className="text-xs text-gray-500">Họ tên</p>
                          <p className="font-medium text-gray-900">{shippingInfo.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaPhone className="text-gray-400 mt-1 text-sm" />
                        <div>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="font-medium text-gray-900">{shippingInfo.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-gray-400 mt-1 text-sm" />
                        <div>
                          <p className="text-xs text-gray-500">Địa chỉ</p>
                          <p className="font-medium text-gray-900">{shippingInfo.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaTicketAlt className="text-green-400" />
                      Tóm tắt đơn hàng
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="font-medium text-gray-900">
                          {(totalPrice !== undefined ? totalPrice : subtotal).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      
                      {selectedVoucher && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã giảm giá</span>
                          <span className="font-medium text-green-500">
                            -{selectedVoucher.discountValue?.toLocaleString("vi-VN") || 0}{selectedVoucher.percentage ? '%' : '₫'}
                          </span>
                        </div>
                      )}
                      
                      {shippingFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phí vận chuyển</span>
                          <span className="font-medium text-gray-900">{shippingFee.toLocaleString("vi-VN")}₫</span>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-gray-200 flex justify-between">
                        <span className="font-bold text-gray-900">Tổng cộng</span>
                        <span className="text-xl font-bold text-green-400">{total.toLocaleString("vi-VN")}₫</span>
                      </div>
                      
                      <div className="pt-2 flex justify-between">
                        <span className="text-gray-600">Phương thức thanh toán</span>
                        <span className="font-medium text-gray-900">
                          {paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng mã QR"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition font-medium"
                >
                  Kiểm tra lại
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaCheckCircle className="text-white" />
                  Xác nhận đặt hàng
                </button>
              </div>
            </div>
          </div>
        )}

        {isProcessingPayment && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-400 mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý thanh toán</h2>
              <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        )}

        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimes className="text-red-500 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận hủy thanh toán</h2>
              <p className="text-gray-600 mb-8">Bạn có chắc chắn muốn hủy thanh toán đơn hàng này không?</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition font-medium"
                >
                  Không
                </button>
                <button
                  onClick={() => {
                    setShowQRCodeModal(false);
                    setShowCancelConfirm(false);
                    stopPolling();
                    // Reset to show normal cart view
                    setPaymentMethod("");
                    setCartItems([]);
                    fetchCartFromAPI();
                  }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
                >
                  Có, hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <Notification
          isOpen={showNotification}
          type={notificationType}
          message={notificationMessage}
          onClose={handleCloseNotification}
          action={[{ label: "OK", onClick: handleCloseNotification }]}
        />
      </div>
    </div>
  );
}
