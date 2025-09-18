import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaLeaf, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import Notification from "../common/Nontification";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantityFromServer, 
  decreaseQuantityFromServer, 
  deleteCartItemFromServer,
  deleteAllFromServer
} from "../../state/Cart/Action";
import { cartItemApi } from "../../utils/api/cart-item.api";
import { getProfileByUserId } from "../../state/Profile/Action";
import { useOrderStatus } from "../../hooks/useOrderStatus"; // Import the new hook

export default function Cart() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const profileState = useSelector((state) => state.profile);
  
  /* ---------- States ---------- */
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(false);
  const [voucherResponse, setVoucherResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null); // Temporary state for selected voucher
  const [voucherCodeInput, setVoucherCodeInput] = useState(""); // New state for manual voucher code input
  
  // Add new state variables for QR code modal
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Use the order status hook
  const { status: orderStatus, checkStatus, startPolling, stopPolling } = useOrderStatus(
    paymentOrderId, 
    authState?.accessToken
  );

  // Get profile data
  const profile = profileState?.profile?.data;

  // Extract shipping information from profile
  const getShippingInfo = () => {
    if (!profile) return { fullName: "", phoneNumber: "", address: "" };
    
    return {
      fullName: profile.fullName || profile.nickName || profile.username || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.addresses?.find(addr => addr.default)?.address || ""
    };
  };

  const shippingInfo = getShippingInfo();

  // Fetch cart items directly from API when component mounts
  useEffect(() => {
    // Fetch cart items - from API if authenticated, from localStorage if guest
    if (authState?.accessToken) {
      fetchCartFromAPI();
    } else {
      fetchCartFromLocalStorage();
    }
  }, [authState?.accessToken]);

  // Fetch cart data directly from API
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
        
        // If there's an applied voucher, set it as selected
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

  // Fetch cart data from localStorage for guest users
  const fetchCartFromLocalStorage = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const guestCart = localStorage.getItem('guestCart');
      const cartItems = guestCart ? JSON.parse(guestCart) : [];
      
      // Ensure items have the correct structure
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
      
      // Calculate totals for guest cart
      const subtotal = formattedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      setTotalPrice(subtotal);
      setDiscountedPrice(subtotal * (1 - discount)); // Apply any discount
      
    } catch (err) {
      console.error("Failed to fetch guest cart:", err);
      setError("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile data when component mounts and user is authenticated
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
    
    // Fetch profile if user is authenticated and we have userId
    if (authState?.accessToken && userId && token) {
      dispatch(getProfileByUserId(userId, token))
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
        });
    }
  }, [dispatch, authState?.accessToken]);

  // Fetch vouchers from API when component mounts and user is authenticated
  useEffect(() => {
    // Get user ID from localStorage
    const userId = localStorage.getItem("userId");
    
    // This will fetch vouchers when the component mounts if user is authenticated
    if (authState?.accessToken && userId) {
      fetchUserVouchers();
    }
  }, [authState?.accessToken]);

  // Fetch vouchers from API
  const fetchUserVouchers = async () => {
    // Get user ID from localStorage since authState.user might not be populated
    const userId = localStorage.getItem("userId");
    
    if (authState?.accessToken && userId) {
      setLoadingVouchers(true);
      try {
        const response = await cartItemApi.getUserVouchers(
          1, 8, "createdDate", "desc", userId, authState.accessToken
        );
        
        // Check if response has content array
        const contentArray = response?.data?.content;
        if (!contentArray || !Array.isArray(contentArray)) {
          setVoucherOptions([]);
          return;
        }
        
        // Transform API response to match existing format
        // Only show vouchers with used: false
        const vouchers = contentArray
          .filter(item => {
            // Check if item and used property exist
            return item && item.used === false; // Only show unused vouchers
          })
          .map(item => {
            // Check if voucher exists
            if (!item.voucher) {
              return null;
            }
            
            const voucherData = {
              code: item.voucher.code || "",
              label: item.voucher.code || "", // Display only the code
              discountPercentage: item.voucher.percentage ? (item.voucher.discountValue / 100) : 0,
              ...item.voucher
            };
            
            return voucherData;
          })
          .filter(voucher => voucher !== null); // Remove any null entries
        
        setVoucherOptions(vouchers);
      } catch (error) {
        setNotificationType("error");
        setNotificationMessage("Không thể tải mã giảm giá. Vui lòng thử lại sau.");
        setShowNotification(true);
      } finally {
        setLoadingVouchers(false);
      }
    }
  };

  // Apply voucher to cart
  const applyVoucherToCart = async (voucherCode) => {
    // Get the voucher object for checking minOrderValue
    const voucher = voucherOptions.find(v => v.code === voucherCode) || tempSelectedVoucher;
    
    // Check if cart total meets minimum order requirement
    const currentTotal = discountedPrice !== undefined ? discountedPrice : subtotal;
    if (voucher && voucher.minOrderValue && currentTotal < voucher.minOrderValue) {
      setNotificationType("error");
      setNotificationMessage(`Đơn hàng của bạn chưa đạt mức tối thiểu ${voucher.minOrderValue.toLocaleString("vi-VN")}₫ để áp dụng mã giảm giá này.`);
      setShowNotification(true);
      throw new Error("Minimum order value not met");
    }
    
    if (authState?.accessToken) {
      // For authenticated users, use the API
      try {
        const response = await cartItemApi.applyVoucher(voucherCode, authState.accessToken);
        
        // Update cart with the response data
        if (response?.data) {
          setCartItems(response.data.cartItems || []);
          setTotalPrice(response.data.totalPrice || 0);
          setDiscountedPrice(response.data.discountedPrice || 0);
          setAppliedVoucher(response.data.appliedVoucher || false);
          setVoucherResponse(response.data.voucherResponse || null);
        }
        
        return response;
      } catch (error) {
        setNotificationType("error");
        setNotificationMessage("Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.");
        setShowNotification(true);
        throw error;
      }
    } else {
      // For guest users, apply discount locally
      try {
        if (voucher) {
          setSelectedVoucher(voucher);
          setDiscount(voucher.discountPercentage || 0);
          
          // Recalculate discounted price
          const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
          const discountAmount = subtotal * (voucher.discountPercentage || 0);
          setDiscountedPrice(subtotal - discountAmount);
          
          setVoucherMessage(`Áp dụng thành công mã ${voucherCode}!`);
          
          // Hide the message after 2 seconds
          setTimeout(() => {
            setVoucherMessage("");
          }, 2000);
          
          return { success: true };
        } else {
          throw new Error("Voucher not found");
        }
      } catch (error) {
        setNotificationType("error");
        setNotificationMessage("Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.");
        setShowNotification(true);
        throw error;
      }
    }
  };

  // Remove voucher from cart
  const removeVoucherFromCart = async (voucherCode) => {
    if (authState?.accessToken) {
      // For authenticated users, use the API
      try {
        const response = await cartItemApi.removeVoucher(voucherCode, authState.accessToken);
        
        // Update cart with the response data
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
        setNotificationType("error");
        setNotificationMessage("Không thể hủy mã giảm giá. Vui lòng thử lại sau.");
        setShowNotification(true);
        throw error;
      }
    } else {
      // For guest users, remove discount locally
      try {
        setSelectedVoucher(null);
        setDiscount(0);
        
        // Recalculate discounted price (no discount)
        const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        setDiscountedPrice(subtotal);
        
        setVoucherMessage(`Đã hủy áp dụng mã ${voucherCode}!`);
        
        // Hide the message after 2 seconds
        setTimeout(() => {
          setVoucherMessage("");
        }, 2000);
        
        return { success: true };
      } catch (error) {
        setNotificationType("error");
        setNotificationMessage("Không thể hủy mã giảm giá. Vui lòng thử lại sau.");
        setShowNotification(true);
        throw error;
      }
    }
  };

  // Fetch vouchers when dropdown is opened and options are empty
  const handleDropdownToggle = () => {
    // Get user ID from localStorage
    const userId = localStorage.getItem("userId");
    
    if (!loadingVouchers) {
      const newState = !isVoucherDropdownOpen;
      setIsVoucherDropdownOpen(newState);
      
      // Fetch vouchers when opening the dropdown and we don't have any yet
      if (newState && voucherOptions.length === 0 && authState?.accessToken && userId) {
        fetchUserVouchers();
      }
    }
  };

  /* ---------- Computed ---------- */
  const subtotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  // Use discountedPrice from state if available, otherwise calculate with local discount
  const total = discountedPrice !== undefined ? 
    discountedPrice : 
    subtotal * (1 - discount);

  /* ---------- Handlers ---------- */
  const removeItem = (id) => {
    // Handle removal for both authenticated and guest users
    if (authState?.accessToken) {
      const item = cartItems.find((i) => i.id === id);
      
      // Use Redux action for consistency with increase/decrease functions
      dispatch(deleteCartItemFromServer(id))
        .then(() => {
          // Refresh cart data after item deletion
          fetchCartFromAPI();
          setNotificationType("success");
          setNotificationMessage(`Đã xóa “${item.productName}” khỏi giỏ hàng!`);
          setShowNotification(true);
        })
        .catch((error) => {
          console.error("Failed to delete item:", error);
          setNotificationType("error");
          setNotificationMessage("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
          setShowNotification(true);
        });
    } else {
      // Handle guest user cart item removal
      try {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
        
        // Update localStorage
        localStorage.setItem('guestCart', JSON.stringify(updatedCartItems));
        
        // Dispatch custom event to notify other components (like navbar) of cart change
        window.dispatchEvent(new Event('cartChange'));
        
        // Recalculate totals
        const subtotal = updatedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        setTotalPrice(subtotal);
        setDiscountedPrice(subtotal * (1 - discount));
        
        setNotificationType("success");
        setNotificationMessage("Đã xóa sản phẩm khỏi giỏ hàng!");
        setShowNotification(true);
      } catch (error) {
        console.error("Failed to remove item from guest cart:", error);
        setNotificationType("error");
        setNotificationMessage("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
        setShowNotification(true);
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
    
    // Check if user is authenticated before proceeding with payment
    if (!authState?.accessToken) {
      setNotificationType("error");
      setNotificationMessage("Vui lòng đăng nhập để thanh toán.");
      setShowNotification(true);
      return;
    }
    
    try {
      // Prepare payment data
      const paymentData = {
        method: paymentMethod === "cod" ? "CASH" : "BANK",
        amount: total
      };
      
      // Call the payment API
      const response = await cartItemApi.createPayment(paymentData, authState.accessToken);
      
      if (response.success) {
        const paymentInfo = response.data;
        
        if (paymentInfo.method === "CASH") {
          // For CASH method, order is successful immediately
          setNotificationType("success");
          setNotificationMessage(`Đơn hàng ${paymentInfo.ordersId} đã được xác nhận!`);
          setShowNotification(true);
          dispatch(deleteAllFromServer());
          if (paymentMethod === "cod") navigate("/history-order");
        } else if (paymentInfo.method === "BANK") {
          // For BANK method, show QR code for scanning
          // The QR code comes from the API response, not generated by the library
          setShowQRCodeModal(true);
          setQRCodeData(paymentInfo.qrCode); // This is the QR code from the API response
          setPaymentOrderId(paymentInfo.ordersId);
          // Start auto-checking immediately
          startPolling();
        }
      } else {
        // Handle API error messages
        const errorMessage = response.message?.messageDetail || "Thanh toán thất bại. Vui lòng thử lại.";
        setNotificationType("error");
        setNotificationMessage(errorMessage);
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setNotificationType("error");
      setNotificationMessage("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
      setShowNotification(true);
    }
  };

  // Effect to handle automatic status updates
  useEffect(() => {
    if (orderStatus === "COMPLETED") {
      stopPolling();
      setNotificationType("success");
      setNotificationMessage(`Đơn hàng ${paymentOrderId} đã được xác nhận!`);
      setShowNotification(true);
      setShowQRCodeModal(false);
      dispatch(deleteAllFromServer());
      navigate("/history-order");
    }
  }, [orderStatus, paymentOrderId, dispatch, navigate, stopPolling]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-opacity-50"></div>
          </div>
          <p className="mt-6 text-emerald-700 font-semibold text-lg">Đang tải giỏ hàng...</p>
          <p className="mt-2 text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="mx-auto bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          {/* Check if error is an object and extract the message */}
          <p className="text-red-600 font-semibold text-lg">
            Lỗi: {typeof error === 'object' && error !== null ? 
              (error.messageDetail || error.messageCode || JSON.stringify(error)) : 
              error}
          </p>
          <p className="text-gray-600 mt-3">
            {error && error.includes("Query did not return a unique result") 
              ? "There's an issue with your cart data. Please contact support for assistance." 
              : "Please try again or contact support if the problem persists."}
          </p>
          <button
            onClick={() => fetchCartFromAPI()}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-10 flex items-center gap-3">
          <FaLeaf className="text-emerald-600" />
          Giỏ hàng của bạn
        </h1>

        {cartItems.length > 0 ? (
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Table sản phẩm */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-100">
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4 text-center">Đơn giá</th>
                    <th className="p-4 text-center">Số lượng</th>
                    <th className="p-4 text-right">Tổng</th>
                    <th className="p-4 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-emerald-100 hover:bg-emerald-50/50 transition"
                    >
                      <td className="p-4 flex items-center gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        />
                        <span className="font-semibold text-gray-800">
                          {item.productName}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        {item.unitPrice.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (authState?.accessToken) {
                                if (item.quantity <= 1) {
                                  // If quantity is 1 or less, remove the item
                                  removeItem(item.id);
                                } else {
                                  // Otherwise, decrease the quantity
                                  dispatch(decreaseQuantityFromServer(item.id, item.quantity - 1))
                                    .then(() => {
                                      // Refresh cart data after quantity change
                                      fetchCartFromAPI();
                                    })
                                    .catch((error) => {
                                      console.error("Failed to decrease quantity:", error);
                                      setNotificationType("error");
                                      setNotificationMessage("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                      setShowNotification(true);
                                    });
                                }
                              } else {
                                // Handle guest user quantity decrease
                                try {
                                  if (item.quantity <= 1) {
                                    // If quantity is 1 or less, remove the item
                                    removeItem(item.id);
                                  } else {
                                    // Otherwise, decrease the quantity
                                    const updatedCartItems = cartItems.map(cartItem => {
                                      if (cartItem.id === item.id) {
                                        return { ...cartItem, quantity: cartItem.quantity - 1 };
                                      }
                                      return cartItem;
                                    });
                                    
                                    setCartItems(updatedCartItems);
                                    
                                    // Update localStorage
                                    localStorage.setItem('guestCart', JSON.stringify(updatedCartItems));
                                    
                                    // Dispatch custom event to notify other components (like navbar) of cart change
                                    window.dispatchEvent(new Event('cartChange'));
                                    
                                    // Recalculate totals
                                    const subtotal = updatedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                                    setTotalPrice(subtotal);
                                    setDiscountedPrice(subtotal * (1 - discount));
                                  }
                                } catch (error) {
                                  console.error("Failed to decrease quantity for guest user:", error);
                                  setNotificationType("error");
                                  setNotificationMessage("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                  setShowNotification(true);
                                }
                              }
                            }}
                            className="p-1.5 bg-emerald-200 rounded-full hover:bg-emerald-300 transition"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="font-medium text-emerald-800 w-6">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (authState?.accessToken) {
                                dispatch(increaseQuantityFromServer(item.id, item.quantity + 1))
                                  .then(() => {
                                    // Refresh cart data after quantity change
                                    fetchCartFromAPI();
                                  })
                                  .catch((error) => {
                                    console.error("Failed to increase quantity:", error);
                                    setNotificationType("error");
                                    setNotificationMessage("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                    setShowNotification(true);
                                  });
                              } else {
                                // Handle guest user quantity increase
                                try {
                                  const updatedCartItems = cartItems.map(cartItem => {
                                    if (cartItem.id === item.id) {
                                      return { ...cartItem, quantity: cartItem.quantity + 1 };
                                    }
                                    return cartItem;
                                  });
                                  
                                  setCartItems(updatedCartItems);
                                  
                                  // Update localStorage
                                  localStorage.setItem('guestCart', JSON.stringify(updatedCartItems));
                                  
                                  // Dispatch custom event to notify other components (like navbar) of cart change
                                  window.dispatchEvent(new Event('cartChange'));
                                  
                                  // Recalculate totals
                                  const subtotal = updatedCartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                                  setTotalPrice(subtotal);
                                  setDiscountedPrice(subtotal * (1 - discount));
                                } catch (error) {
                                  console.error("Failed to increase quantity for guest user:", error);
                                  setNotificationType("error");
                                  setNotificationMessage("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
                                  setShowNotification(true);
                                }
                              }
                            }}
                            className="p-1.5 bg-emerald-200 rounded-full hover:bg-emerald-300 transition"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-700">
                        {(item.unitPrice * item.quantity).toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thông tin giao hàng - Only show for authenticated users */}
            {authState?.accessToken ? (
              <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold text-emerald-700">
                    Thông tin giao hàng
                  </h3>
                  
                  {/* Display shipping info from profile */}
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium text-emerald-700">Họ và tên</label>
                            <div className="mt-1 text-gray-800 font-medium">{shippingInfo.fullName || "Chưa cập nhật"}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-emerald-700">Địa chỉ</label>
                            <div className="mt-1 text-gray-800 font-medium">{shippingInfo.address || "Chưa cập nhật"}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-emerald-700">Số điện thoại</label>
                            <div className="mt-1 text-gray-800 font-medium">{shippingInfo.phoneNumber || "Chưa cập nhật"}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("/profile")}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                        >
                          Sửa thông tin
                        </button>
                      </div>
                    </div>
                    
                    {/* Message when profile info is incomplete */}
                    {(!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phoneNumber) && (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-yellow-800">
                              Vui lòng cập nhật đầy đủ thông tin giao hàng trong hồ sơ của bạn để có thể thanh toán.
                            </p>
                            <button
                              onClick={() => navigate("/profile")}
                              className="mt-2 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                            >
                              Cập nhật ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-emerald-700">Tóm tắt</h3>
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính</span>
                    <span>
                      {totalPrice !== undefined ? 
                        totalPrice.toLocaleString("vi-VN") : 
                        subtotal.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  {(appliedVoucher && voucherResponse) || discount > 0 ? (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>
                        {voucherResponse ? (
                          <span>- {voucherResponse.discountValue?.toLocaleString("vi-VN") || 0}{voucherResponse.percentage ? '%' : '₫'}</span>
                        ) : (
                          <span>- {(subtotal * discount).toLocaleString("vi-VN")} ₫</span>
                        )}
                      </span>
                    </div>
                  ) : null}
                  <div className="border-t border-emerald-200 pt-4 flex justify-between font-bold text-emerald-800 text-xl">
                    <span>Tổng</span>
                    <span>
                      {discountedPrice !== undefined ? 
                        discountedPrice.toLocaleString("vi-VN") : 
                        total.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  {/* ===== VOUCHER SELECTION ===== */
                  }
                  <div className="relative w-full">
                    <label className="text-sm font-semibold text-emerald-700">
                      Mã giảm giá
                    </label>

                    {/* Loading indicator */}
                    {loadingVouchers && (
                      <div className="text-sm text-emerald-600 mt-1">
                        Đang tải mã giảm giá...
                      </div>
                    )}

                    {/* Voucher code input and dropdown toggle */}
                    <div className="relative mt-1 w-full flex gap-2">
                      <input
                        type="text"
                        value={selectedVoucher?.code || tempSelectedVoucher?.code || voucherCodeInput || ""}
                        onChange={(e) => {
                          setVoucherCodeInput(e.target.value);
                          // Clear temp selection when user types
                          if (tempSelectedVoucher) {
                            setTempSelectedVoucher(null);
                          }
                        }}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 p-2 border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-none outline-none"
                        disabled={loadingVouchers || (!authState?.accessToken) || (!!selectedVoucher)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // Only allow dropdown to open if no voucher is applied
                          if (!selectedVoucher) {
                            handleDropdownToggle();
                          }
                        }}
                        className={`px-3 text-left border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-none outline-none flex items-center ${selectedVoucher ? 'cursor-default bg-gray-100' : 'cursor-pointer bg-white hover:bg-emerald-50'}`}
                        disabled={loadingVouchers || (!authState?.accessToken) || (!!selectedVoucher)}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform text-gray-500 ${isVoucherDropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Dropdown list */}
                    {isVoucherDropdownOpen && !loadingVouchers && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-auto">
                        {/* Default option to clear selection */}
                        <li
                          key="none"
                          onClick={async () => {
                            // Clear the temporary selected voucher
                            setTempSelectedVoucher(null);
                            setVoucherCodeInput("");
                            setIsVoucherDropdownOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-gray-600"
                        >
                          Không sử dụng mã giảm giá
                        </li>
                        
                        {voucherOptions && voucherOptions.length > 0 ? (
                          voucherOptions.map((voucher) => (
                            <li
                              key={voucher.code || voucher.id || `voucher-${Math.random()}`}
                              onClick={async () => {
                                // Set the temporary selected voucher
                                setTempSelectedVoucher(voucher);
                                setVoucherCodeInput(voucher.code);
                                setIsVoucherDropdownOpen(false);
                              }}
                              className="px-3 py-2 hover:bg-emerald-50 cursor-pointer"
                            >
                              <div className="font-medium text-gray-800">
                                {voucher.code || "Unknown code"}
                              </div>
                              <div className="text-sm text-gray-600">
                                Giảm: {voucher.discountValue?.toLocaleString("vi-VN") || 0}{voucher.percentage ? '%' : '₫'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Đơn tối thiểu: {voucher.minOrderValue?.toLocaleString("vi-VN") || 0} ₫
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500">
                            Không có mã giảm giá khả dụng
                          </li>
                        )}
                      </ul>
                    )}
                    
                    {/* Apply/Remove buttons */
                    }
                    <div className="flex gap-2 mt-2">
                      {!selectedVoucher && (
                        <button
                          onClick={async () => {
                            // Use the input value or temp selected voucher
                            const codeToApply = tempSelectedVoucher?.code || voucherCodeInput;
                            if (!codeToApply) {
                              setNotificationType("error");
                              setNotificationMessage("Vui lòng nhập mã giảm giá.");
                              setShowNotification(true);
                              return;
                            }
                            
                            try {
                              // Find the voucher in options if it exists there
                              let voucherToApply = tempSelectedVoucher;
                              if (!voucherToApply) {
                                voucherToApply = voucherOptions.find(v => v.code === codeToApply);
                              }
                              
                              // Apply the voucher
                              const response = await applyVoucherToCart(codeToApply);
                              
                              // Set the selected voucher (either from options or a minimal object for manual codes)
                              if (voucherToApply) {
                                setSelectedVoucher(voucherToApply);
                                setDiscount(voucherToApply.discountPercentage || 0);
                              } else {
                                setSelectedVoucher({ code: codeToApply });
                              }
                              
                              setVoucherMessage(`Áp dụng thành công mã ${codeToApply}!`);
                              
                              // Hide the message after 2 seconds
                              setTimeout(() => {
                                setVoucherMessage("");
                              }, 2000);
                            } catch (error) {
                              // Error handling is already done in the applyVoucherToCart function
                              console.error("Error applying voucher:", error);
                            }
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                          disabled={!authState?.accessToken || loadingVouchers}
                        >
                          Áp dụng
                        </button>
                      )}
                      
                      {/* Always show the remove button when a voucher is applied */
                      }
                      {selectedVoucher && (
                        <button
                          onClick={async () => {
                            try {
                              // Remove the currently applied voucher
                              await removeVoucherFromCart(selectedVoucher.code);
                              
                              setSelectedVoucher(null);
                              setTempSelectedVoucher(null);
                              setVoucherCodeInput("");
                              setDiscount(0);
                              setVoucherMessage(`Đã hủy áp dụng mã ${selectedVoucher.code}!`);
                              
                              // Hide the message after 2 seconds
                              setTimeout(() => {
                                setVoucherMessage("");
                              }, 2000);
                            } catch (error) {
                              // Error handling is already done in the removeVoucherFromCart function
                              console.error("Error removing voucher:", error);
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Hủy áp dụng
                        </button>
                      )}
                    </div>
                    
                    {/* Warning message for minimum order value */}
                    {(tempSelectedVoucher || (voucherCodeInput && !selectedVoucher)) && 
                     (tempSelectedVoucher?.minOrderValue || voucherOptions.find(v => v.code === voucherCodeInput)?.minOrderValue) && 
                     (discountedPrice !== undefined ? discountedPrice : subtotal) < 
                     (tempSelectedVoucher?.minOrderValue || voucherOptions.find(v => v.code === voucherCodeInput)?.minOrderValue) && (
                      <div className="text-sm text-red-500 mt-2">
                        Tổng đơn hàng chưa đạt mức tối thiểu {
                          (tempSelectedVoucher?.minOrderValue || voucherOptions.find(v => v.code === voucherCodeInput)?.minOrderValue)?.toLocaleString("vi-VN")
                        }₫ để áp dụng mã giảm giá này.
                      </div>
                    )}
                    
                    {/* Voucher message */
                    }
                    {voucherMessage && (
                      <div className="text-sm mt-2 text-green-600">
                        {voucherMessage}
                      </div>
                    )}
                    
                    {/* Message when no vouchers available */
                    }
                    {!loadingVouchers && isVoucherDropdownOpen && voucherOptions.length === 0 && authState?.accessToken && (
                      <div className="text-sm text-gray-500 mt-1">
                        Không có mã giảm giá khả dụng
                      </div>
                    )}
                    
                    {/* Message when user is not logged in */
                    }
                    {!authState?.accessToken && (
                      <div className="text-sm text-gray-500 mt-1">
                        Vui lòng đăng nhập để xem mã giảm giá
                      </div>
                    )}
                  </div>

                  {/* Phương thức thanh toán – radio cards */
                  }
                  <div className="mt-6">
                    <h4 className="text-base font-semibold text-emerald-700 mb-3">
                      Phương thức thanh toán
                    </h4>
                    <div className="space-y-2">
                      {[
                        { id: "cod", label: "Thanh toán khi nhận hàng" },
                        { id: "qr", label: "Thanh toán bằng mã QR" },
                      ].map((m) => (
                        <label
                          key={m.id}
                          className={`block p-3 rounded-xl border-2 cursor-pointer transition
            ${
              paymentMethod === m.id
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-gray-200 hover:border-emerald-300"
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
                          <span className="font-medium text-gray-800">
                            {m.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentPreview}
                    disabled={
                      !paymentMethod || 
                      !shippingInfo.fullName || 
                      !shippingInfo.address || 
                      !shippingInfo.phoneNumber
                    }
                    className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Xác nhận thanh toán
                  </button>
                </div>
              </section>
            ) : (
              // Show login prompt for unauthenticated users
              <div className="mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Vui lòng đăng nhập để thanh toán</h3>
                    <p className="mt-2 text-yellow-700">
                      Bạn có thể xem và chỉnh sửa giỏ hàng, nhưng cần đăng nhập để tiến hành thanh toán.
                    </p>
                    <Link
                      to="/login"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      <FaLeaf />
                      Đăng nhập ngay
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              Giỏ hàng của bạn đang trống.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg"
            >
              <FaLeaf />
              Mua sắm ngay
            </Link>
          </div>
        )}

        {/* Notification */
        }
        <Notification
          isOpen={showNotification}
          type={notificationType}
          message={notificationMessage}
          onClose={handleCloseNotification}
          action={[{ label: "OK", onClick: handleCloseNotification }]}
        />
      </div>

      {/* Preview Modal */
      }
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-6 transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-bold text-emerald-800 text-center mb-2">
              Xác nhận đơn hàng
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-emerald-100">
                <span className="text-gray-700 font-medium">Họ tên:</span>
                <span className="font-semibold text-emerald-700">{shippingInfo.fullName}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-emerald-100">
                <span className="text-gray-700 font-medium">Địa chỉ:</span>
                <span className="font-semibold text-emerald-700">{shippingInfo.address}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-emerald-100">
                <span className="text-gray-700 font-medium">SDT:</span>
                <span className="font-semibold text-emerald-700">{shippingInfo.phoneNumber}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-emerald-100">
                <span className="text-gray-700 font-medium">Thanh toán:</span>
                <span className="font-semibold text-emerald-700">
                  {paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : "Thanh toán bằng mã QR"}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-emerald-800">Tổng tiền:</span>
                <span className="text-xl font-bold text-emerald-700">
                  {total.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCodeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                Thanh toán bằng QR Code
              </h2>
              <p className="text-gray-600">
                Mã đơn hàng: <span className="font-semibold text-emerald-700">{paymentOrderId}</span>
              </p>
            </div>
            
            <div className="flex justify-center py-2">
              <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-emerald-100">
                {/* Display QR code as an image from the API response instead of generating it */}
                <img 
                  src={qrCodeData} 
                  alt="QR Code thanh toán" 
                  className="w-52 h-52 object-contain"
                />
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-center text-emerald-800 text-sm font-medium">
                Quét mã QR bằng ứng dụng ngân hàng để hoàn tất thanh toán
              </p>
            </div>
            
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  setShowCancelConfirm(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */
      }
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Xác nhận hủy thanh toán
              </h2>
              <p className="text-gray-700">
                Bạn có chắc chắn muốn hủy thanh toán đơn hàng này không?
              </p>
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Không
              </button>
              <button
                onClick={() => {
                  setShowQRCodeModal(false);
                  setShowCancelConfirm(false);
                  stopPolling(); // Stop any ongoing polling
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Có, hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}