
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaLeaf, FaTrash } from "react-icons/fa";
import Notification from "../common/Nontification";

// Mock data for cart items (replace with real data later)
const initialCartItems = [
  {
    id: 1,
    name: "Detox Juice",
    price: 230000, // Converted from $10 (1 USD ~ 23,000 VNĐ)
    quantity: 2,
    image: "https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg",
  },
  {
    id: 2,
    name: "Green Smoothie",
    price: 184000, // Converted from $8 (1 USD ~ 23,000 VNĐ)
    quantity: 1,
    image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
  },
];

// Mock voucher data (replace with real data or API)
const validVouchers = [
  { code: "SAVE10", discount: 0.1 }, // 10% discount
  { code: "SAVE20", discount: 0.2 }, // 20% discount
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Calculate total with discount
  const total = subtotal * (1 - discount);

  // Handle quantity increase
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle quantity decrease
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Handle item removal
  const removeItem = (id) => {
    const itemName = cartItems.find(item => item.id === id).name;
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setNotificationType('success');
    setNotificationMessage(`Đã xóa "${itemName}" khỏi giỏ hàng!`);
    setShowNotification(true);
  };

  // Handle voucher application
  const applyVoucher = () => {
    const voucher = validVouchers.find((v) => v.code === voucherCode.trim().toUpperCase());
    if (voucher) {
      setDiscount(voucher.discount);
      setVoucherMessage(`Mã ${voucherCode} được áp dụng! Giảm ${voucher.discount * 100}%`);
      setNotificationType('success');
      setNotificationMessage(`Mã "${voucherCode}" đã được áp dụng thành công!`);
    } else {
      setDiscount(0);
      setVoucherMessage("Mã voucher không hợp lệ.");
      setNotificationType('error');
      setNotificationMessage('Mã voucher không hợp lệ. Vui lòng thử lại!');
    }
    setShowNotification(true);
  };

  // Handle payment preview
  const handlePaymentPreview = () => {
    if (paymentMethod && userName.trim() && address.trim() && phoneNumber.trim()) {
      setShowPreview(true);
    }
  };

  // Handle payment confirmation
  const handlePayment = () => {
    setShowPreview(false);
    setNotificationType('success');
    setNotificationMessage(`Thanh toán cho đơn hàng "${paymentInfo.orderId}" đã được xác nhận thành công!`);
    setShowNotification(true);
    if (paymentMethod === "cod") {
      navigate("/history-order");
    } else if (paymentMethod === "qr") {
      // QR code is displayed in JSX
    }
  };

  // Mock payment info for QR code (replace with real data)
  const paymentInfo = {
    orderId: "ORD" + Date.now(),
    amount: total.toLocaleString('vi-VN'),
    bank: "DetoxCare Bank",
    accountNumber: "1234567890",
    accountHolder: "DetoxCare",
    userName,
    address,
    phoneNumber,
  };

  // Generate QR code content
  const qrContent = JSON.stringify(paymentInfo);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center flex items-center justify-center gap-2">
          <FaLeaf className="text-green-600" />
          Giỏ hàng của bạn
        </h1>
        {cartItems.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-green-700">{item.name}</h2>
                    <p className="text-gray-600 font-medium">
                      Giá: {item.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="text-gray-700 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-red-500 hover:text-red-600 transition flex items-center gap-1"
                      >
                        <FaTrash />
                        <span className="text-sm">Xóa</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-green-700 font-semibold text-lg">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                  </p>
                </li>
              ))}
            </ul>
            {/* User Information Input */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin giao hàng</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 shadow-sm"
                    placeholder="Nhập họ và tên..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 shadow-sm"
                    placeholder="Nhập địa chỉ giao hàng..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 shadow-sm"
                    placeholder="Nhập số điện thoại..."
                    required
                  />
                </div>
              </div>
            </div>
            {/* Voucher Input */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Mã giảm giá</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Nhập mã voucher..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full sm:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 shadow-sm"
                />
                <button
                  onClick={applyVoucher}
                  className="w-full sm:w-auto px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 justify-center"
                >
                  <FaLeaf />
                  Áp dụng
                </button>
              </div>
              {voucherMessage && (
                <p
                  className={`mt-3 text-sm ${
                    discount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {voucherMessage}
                </p>
              )}
            </div>
            {/* Payment Method Selection */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Phương thức thanh toán</h3>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full sm:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 shadow-sm"
              >
                <option value="">-- Chọn phương thức --</option>
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="qr">Thanh toán bằng mã QR</option>
              </select>
            </div>
            {/* QR Code and Payment Info */}
            {paymentMethod === "qr" && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                  <FaLeaf />
                  Thông tin thanh toán
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Mã đơn hàng: <span className="font-medium">{paymentInfo.orderId}</span></p>
                    <p className="text-gray-600">Số tiền: <span className="font-medium">{paymentInfo.amount} VNĐ</span></p>
                    <p className="text-gray-600">Ngân hàng: <span className="font-medium">{paymentInfo.bank}</span></p>
                    <p className="text-gray-600">Số tài khoản: <span className="font-medium">{paymentInfo.accountNumber}</span></p>
                    <p className="text-gray-600">Chủ tài khoản: <span className="font-medium">{paymentInfo.accountHolder}</span></p>
                    <p className="text-gray-600">Người nhận: <span className="font-medium">{paymentInfo.userName}</span></p>
                    <p className="text-gray-600">Địa chỉ: <span className="font-medium">{paymentInfo.address}</span></p>
                    <p className="text-gray-600">Số điện thoại: <span className="font-medium">{paymentInfo.phoneNumber}</span></p>
                  </div>
                  <div className="flex justify-center items-center">
                    <QRCodeCanvas value={qrContent} size={150} className="rounded-lg shadow-sm" />
                  </div>
                </div>
              </div>
            )}
            {/* Total and Checkout */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-green-700">
                  Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ
                </h3>
                {discount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    (Giảm giá: {(subtotal * discount).toLocaleString('vi-VN')} VNĐ)
                  </p>
                )}
              </div>
              <button
                onClick={handlePaymentPreview}
                disabled={!paymentMethod || !userName.trim() || !address.trim() || !phoneNumber.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg transition flex items-center gap-2 justify-center ${
                  paymentMethod && userName.trim() && address.trim() && phoneNumber.trim()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaLeaf />
                Xác nhận thanh toán
              </button>
            </div>
            {/* Preview Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg">
                  <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                    <FaLeaf className="text-green-600" />
                    Xem lại đơn hàng
                  </h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Thông tin giao hàng</h3>
                    <div className="text-gray-600">
                      <p>Họ và tên: <span className="font-medium">{userName}</span></p>
                      <p>Địa chỉ: <span className="font-medium">{address}</span></p>
                      <p>Số điện thoại: <span className="font-medium">{phoneNumber}</span></p>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Sản phẩm</h3>
                    <ul className="space-y-2">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex justify-between text-gray-600">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>
                            {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="flex justify-between text-gray-600">
                        <span>Tạm tính:</span>
                        <span>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                      </p>
                      {discount > 0 && (
                        <p className="flex justify-between text-gray-600">
                          <span>Giảm giá ({discount * 100}%):</span>
                          <span>-{(subtotal * discount).toLocaleString('vi-VN')} VNĐ</span>
                        </p>
                      )}
                      <p className="flex justify-between text-green-700 font-bold text-lg mt-2">
                        <span>Tổng cộng:</span>
                        <span>{total.toLocaleString('vi-VN')} VNĐ</span>
                      </p>
                      <p className="flex justify-between text-gray-600 mt-2">
                        <span>Phương thức thanh toán:</span>
                        <span>
                          {paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng mã QR"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handlePayment}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <FaLeaf />
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Giỏ hàng của bạn đang trống.</p>
            <Link
              to="/search"
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaLeaf className="mr-2" />
              Mua sắm ngay
            </Link>
          </div>
        )}
        {/* Notification Component */}
        <Notification
          isOpen={showNotification}
          type={notificationType}
          message={notificationMessage}
          onClose={handleCloseNotification}
          action={[{ label: 'OK', onClick: handleCloseNotification }]}
        />
      </div>
    </div>
  );
}
