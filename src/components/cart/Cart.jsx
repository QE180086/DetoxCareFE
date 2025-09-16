import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaLeaf, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import Notification from "../common/Nontification";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  fetchCartFromServer,
  increaseQuantityFromServer, 
  decreaseQuantityFromServer, 
  deleteCartItemFromServer
} from "../../state/Cart/Action";

export default function Cart() {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);
  
  const cartItems = cartState.cartItems;
  const isLoading = cartState.isLoading;
  const error = cartState.error;

  /* ---------- States ---------- */
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch cart items from server when component mounts
  useEffect(() => {
    // Only fetch cart if user is authenticated
    if (authState?.accessToken) {
      dispatch(fetchCartFromServer());
    }
  }, [dispatch, authState?.accessToken]);

  // Thêm mảng các mã giảm giá mẫu
  const voucherOptions = [
    { code: "", label: "Không sử dụng mã giảm giá" },
    { code: "SAVE10", label: "Giảm 10% (SAVE10)" },
    { code: "SAVE20", label: "Giảm 20% (SAVE20)" },
  ];

  /* ---------- Computed ---------- */
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal * (1 - discount);

  /* ---------- Handlers ---------- */
  const removeItem = (id) => {
    const item = cartItems.find((i) => i.id === id);
    dispatch(deleteCartItemFromServer(id));
    setNotificationType("success");
    setNotificationMessage(`Đã xóa “${item.name}” khỏi giỏ hàng!`);
    setShowNotification(true);
  };

  const applyVoucher = () => {
    const valid = [
      { code: "SAVE10", discount: 0.1 },
      { code: "SAVE20", discount: 0.2 },
    ];
    const v = valid.find((v) => v.code === voucherCode.trim().toUpperCase());
    if (v) {
      setDiscount(v.discount);
      setVoucherMessage(`Áp dụng thành công mã ${v.code}!`);
      setNotificationMessage(`Giảm giá ${v.discount * 100}%`);
      setNotificationType("success");
    } else {
      setDiscount(0);
      setVoucherMessage("Mã không hợp lệ");
      setNotificationMessage("Mã voucher không hợp lệ!");
      setNotificationType("error");
    }
    setShowNotification(true);
  };

  const handlePaymentPreview = () => {
    if (
      paymentMethod &&
      userName.trim() &&
      address.trim() &&
      phoneNumber.trim()
    ) {
      setShowPreview(true);
    }
  };

  const handlePayment = () => {
    setShowPreview(false);
    setNotificationType("success");
    setNotificationMessage(`Đơn hàng ${paymentInfo.orderId} đã được xác nhận!`);
    setShowNotification(true);
    dispatch(clearCart());
    if (paymentMethod === "cod") navigate("/history-order");
  };

  const paymentInfo = {
    orderId: "ORD" + Date.now(),
    amount: total.toLocaleString("vi-VN"),
    bank: "DetoxCare Bank",
    accountNumber: "1234567890",
    accountHolder: "DetoxCare",
    userName,
    address,
    phoneNumber,
  };

  const handleCloseNotification = () => setShowNotification(false);

  // Show message when user is not logged in
  if (!authState?.accessToken) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Vui lòng đăng nhập để xem giỏ hàng.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg"
          >
            <FaLeaf />
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-700 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          {/* Check if error is an object and extract the message */}
          <p className="text-red-500 font-medium">
            Lỗi: {typeof error === 'object' && error !== null ? 
              (error.messageDetail || error.messageCode || JSON.stringify(error)) : 
              error}
          </p>
          <p className="text-gray-600 mt-2">
            {error && error.includes("Query did not return a unique result") 
              ? "There's an issue with your cart data. Please contact support for assistance." 
              : "Please try again or contact support if the problem persists."}
          </p>
          <button
            onClick={() => dispatch(fetchCartFromServer())}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
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
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        />
                        <span className="font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        {item.price.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => dispatch(decreaseQuantityFromServer(item.id, item.quantity - 1))}
                            className="p-1.5 bg-emerald-200 rounded-full hover:bg-emerald-300 transition"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="font-medium text-emerald-800 w-6">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantityFromServer(item.id, item.quantity + 1))}
                            className="p-1.5 bg-emerald-200 rounded-full hover:bg-emerald-300 transition"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-700">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
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

            {/* Thông tin giao hàng */}
            <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-emerald-700">
                  Thông tin giao hàng
                </h3>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-none outline-none"
                  style={{
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "#34d399",
                  }}
                />
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-lg border border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-none outline-none"
                  style={{
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "#34d399",
                  }}
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border border-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-none outline-none"
                  style={{
                    boxShadow: "none",
                    outline: "none",
                    borderColor: "#34d399",
                  }}
                />
              </div>

              {/* Tóm tắt đơn hàng */}
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-emerald-700">Tóm tắt</h3>
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>
                      - {(subtotal * discount).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                )}
                <div className="border-t border-emerald-200 pt-4 flex justify-between font-bold text-emerald-800 text-xl">
                  <span>Tổng</span>
                  <span>{total.toLocaleString("vi-VN")} ₫</span>
                </div>

                {/* ===== COMBOBOX DROPDOWN ===== */}
                <div className="relative w-full">
                  <label className="text-sm font-semibold text-emerald-700">
                    Mã giảm giá
                  </label>

                  {/* Input + dropdown toggle */}
                  <div className="relative mt-1 w-full">
                    <input
                      type="text"
                      placeholder="Nhập hoặc chọn"
                      value={voucherCode}
                      onChange={(e) => {
                        setVoucherCode(e.target.value.toUpperCase());
                        setOpen(true);
                        setIsFiltering(true);
                      }}
                      onFocus={() => {
                        setIsInputFocused(true);
                        setIsFiltering(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => {
                          setIsInputFocused(false);
                          setOpen(false); // đóng dropdown khi mất focus (click ra ngoài)
                        }, 150)
                      }
                      className="w-full p-2 pr-8 border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-none outline-none"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()} // tránh mất focus
                      onClick={() => {
                        setOpen(!open);
                        setIsFiltering(false); // mở bằng nút: hiển thị tất cả
                      }}
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
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
                  {(isInputFocused || open) && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-auto">
                      {(isFiltering
                        ? voucherOptions.filter(
                            (v) =>
                              v.code.includes(voucherCode) ||
                              v.label.includes(voucherCode)
                          )
                        : voucherOptions
                      ).map((v) => (
                        <li
                          key={v.code}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setVoucherCode(v.code);
                            setIsInputFocused(false);
                            setOpen(false);
                            setIsFiltering(false);
                            if (v.code === "") {
                              setDiscount(0);
                              setVoucherMessage("");
                              setNotificationMessage("");
                            }
                          }}
                          className="px-3 py-2 hover:bg-emerald-50 cursor-pointer"
                        >
                          {v.label}{" "}
                          <span className="text-xs text-gray-500">
                            {v.code && `(${v.code})`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Nút áp dụng */}
                <button
                  onClick={applyVoucher}
                  disabled={voucherCode.length === 0}
                  className="mt-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Áp dụng
                </button>

                {/* Phương thức thanh toán – radio cards */}
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

                {/* QR nếu chọn QR */}
                {paymentMethod === "qr" && (
                  <div className="pt-4">
                    <p className="text-sm font-medium text-emerald-700 mb-2">
                      Mã QR thanh toán
                    </p>
                    <div className="flex justify-center">
                      <QRCodeCanvas
                        value={JSON.stringify(paymentInfo)}
                        size={128}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePaymentPreview}
                  disabled={
                    !paymentMethod || !userName || !address || !phoneNumber
                  }
                  className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </section>
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

        {/* Notification */}
        <Notification
          isOpen={showNotification}
          type={notificationType}
          message={notificationMessage}
          onClose={handleCloseNotification}
          action={[{ label: "OK", onClick: handleCloseNotification }]}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-emerald-700">
              Xác nhận đơn hàng
            </h2>
            <p>
              <strong>Họ tên:</strong> {userName}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {address}
            </p>
            <p>
              <strong>SDT:</strong> {phoneNumber}
            </p>
            <p>
              <strong>Thanh toán:</strong>{" "}
              {paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng"
                : "Thanh toán bằng mã QR"}
            </p>
            <p className="text-lg font-bold text-emerald-700">
              Tổng tiền: {total.toLocaleString("vi-VN")} ₫
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}