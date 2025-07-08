import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Correct import

// Mock data for cart items (replace with real data later)
const initialCartItems = [
  {
    id: 1,
    name: "Detox Juice",
    price: 10,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "Green Smoothie",
    price: 8,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1629056597533-2d7a2a7b7b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
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

  // Handle voucher application
  const applyVoucher = () => {
    const voucher = validVouchers.find((v) => v.code === voucherCode.trim().toUpperCase());
    if (voucher) {
      setDiscount(voucher.discount);
      setVoucherMessage(`Mã ${voucherCode} được áp dụng! Giảm ${voucher.discount * 100}%`);
    } else {
      setDiscount(0);
      setVoucherMessage("Mã voucher không hợp lệ.");
    }
  };

  // Handle payment method selection
  const handlePayment = () => {
    if (paymentMethod === "cod") {
      // Redirect to order history page for Cash on Delivery
      navigate("/order-history");
    } else if (paymentMethod === "qr") {
      // QR code will be displayed (handled in JSX)
    }
  };

  // Mock payment info for QR code (replace with real data)
  const paymentInfo = {
    orderId: "ORD" + Date.now(),
    amount: total.toFixed(2),
    bank: "Your Bank Name",
    accountNumber: "1234567890",
    accountHolder: "Your Company Name",
  };

  // Generate QR code content
  const qrContent = JSON.stringify(paymentInfo);

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Giỏ hàng của bạn</h1>
      {cartItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-16 sm:h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-green-700">{item.name}</h2>
                  <p className="text-gray-600 font-bold">Giá: ${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-gray-600">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-green-700 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          {/* Voucher Input */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập mã voucher..."
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="w-full sm:w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
              />
              <button
                onClick={applyVoucher}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Áp dụng
              </button>
            </div>
            {voucherMessage && (
              <p
                className={`mt-2 text-sm ${
                  discount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {voucherMessage}
              </p>
            )}
          </div>
          {/* Payment Method Selection */}
          <div className="mt-6">
            <label htmlFor="payment-method" className="text-gray-700 font-medium">
              Chọn phương thức thanh toán
            </label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full sm:w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 mt-2"
            >
              <option value="">-- Chọn phương thức --</option>
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="qr">Thanh toán bằng mã QR</option>
            </select>
          </div>
          {/* QR Code and Payment Info */}
          {paymentMethod === "qr" && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Thông tin thanh toán</h3>
              <p className="text-gray-600">Mã đơn hàng: {paymentInfo.orderId}</p>
              <p className="text-gray-600">Số tiền: ${paymentInfo.amount}</p>
              <p className="text-gray-600">Ngân hàng: {paymentInfo.bank}</p>
              <p className="text-gray-600">Số tài khoản: {paymentInfo.accountNumber}</p>
              <p className="text-gray-600">Chủ tài khoản: {paymentInfo.accountHolder}</p>
              <div className="mt-4 flex justify-center">
                <QRCodeCanvas value={qrContent} size={150} />
              </div>
            </div>
          )}
          {/* Total and Checkout */}
          <div className="mt-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-green-700">
                Tổng cộng: ${total.toFixed(2)}
              </h3>
              {discount > 0 && (
                <p className="text-sm text-gray-600">
                  (Giảm giá: ${(subtotal * discount).toFixed(2)})
                </p>
              )}
            </div>
            <button
              onClick={handlePayment}
              disabled={!paymentMethod}
              className={`px-6 py-2 rounded-md transition duration-200 ease-in-out ${
                paymentMethod
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">Giỏ hàng của bạn đang trống.</p>
      )}
    </div>
  );
}