import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { productApi } from '../../utils/api/product.api';
import { ordersApi } from '../../utils/api/orders.api';



// --- PRODUCT DATA FETCHING ---
// Using the actual product API instead of mock data


// --- GEMINI API SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_API_KEY_HERE' });

const formatProductsForAI = (products) => {
  if (!products || products.length === 0) return "Hiện không có sản phẩm nào.";
  
  return products.map((p, index) => `
${index + 1}. **${p.name}**
   - Giá: ${p.salePrice && p.salePrice > 0 ? `${p.salePrice.toLocaleString("vi-VN")} VNĐ` : `${p.price.toLocaleString("vi-VN")} VNĐ`} ${p.salePrice && p.salePrice > 0 ? `(Giá gốc: ${p.price.toLocaleString("vi-VN")} VNĐ)` : ''}
   - Mô tả: ${p.shortDescription || 'Không có mô tả'}
   - Thành phần: ${p.ingredients || 'Không có thông tin'}
   - Công dụng: ${p.benefits || 'Không có thông tin'}
   - Đánh giá: ${(p.statisticsRate?.averageRate || 0).toFixed(1)}/5 (${p.statisticsRate?.totalSale || 0} đã bán)
   - [Xem chi tiết](/product/${p.id})
  `).join("\n");
};

const formatOrdersForAI = (orders) => {
  if (!orders || orders.length === 0) return "Hiện không có đơn hàng nào.";
  
  return orders.map((o, index) => {
    // Calculate total products and shipping info
    const totalProducts = o.orderItems && o.orderItems.length > 0 
      ? o.orderItems.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;
    
    const shippingInfo = o.shippingFee > 0 
      ? `Phí vận chuyển: +${o.shippingFee.toLocaleString("vi-VN")} VNĐ`
      : 'Miễn phí vận chuyển';
    
    return `
${index + 1}. **Đơn hàng #${o.id}**
   - Ngày đặt: ${new Date(o.createdDate).toLocaleDateString('vi-VN')}
   - Tổng tiền: ${o.totalAmount?.toLocaleString("vi-VN")} VNĐ
   - ${shippingInfo}
   - Số lượng sản phẩm: ${totalProducts}
   - Trạng thái: ${o.status === 'COMPLETED' ? 'Hoàn thành' : o.status === 'PENDING' ? 'Đang xử lý' : o.status === 'CANCELLED' ? 'Đã hủy' : o.status}
   - [Xem chi tiết](/order/${o.id})
  `;
  }).join("\n");
};

// Format vouchers for AI prompt
const formatVouchersForAI = (vouchers) => {
  if (!vouchers || vouchers.length === 0) return "Hiện không có voucher nào.";
  
  return vouchers.map((v, index) => `
${index + 1}. **${v.name}**
   - Giá trị: ${v.percentage ? v.discountValue + '%' : v.discountValue.toLocaleString("vi-VN") + ' VNĐ'}
   - Điều kiện: ${v.description}
   - Điểm cần đổi: ${v.exchangePoint.toLocaleString()} điểm
   - [Đổi voucher](/#voucher-exchange)
  `).join("\n");
};

const callGeminiAPI = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { temperature: 0.6, topP: 0.95 }
        });
        return response.text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "Xin lỗi, hiện tại mình không thể xử lý yêu cầu. Vui lòng thử lại sau.";
    }
};

// --- UI ICONS (SVG Components) ---
const BotIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8" /><rect x="4" y="12" width="16" height="8" rx="2" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M12 12v-2" /><path d="M9 18v-2h6v2" /></svg>
);
const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const ChatIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
);
const CloseIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
);
const RefreshIcon = (props) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);
const StarIcon = (props) => (
    <svg className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
);
const ExternalLinkIcon = (props) => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
);

// --- UI HELPER COMPONENTS ---
const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 py-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div></div>
);

const MarkdownRenderer = ({ content }) => {
  const navigate = useNavigate();
  
  // Process markdown content with proper HTML conversion
  const processMarkdown = (text) => {
    return text
      // Handle images: ![alt](src)
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-2 rounded-lg" />')
      // Handle links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // For internal anchor links (starting with # but not /#), scroll within same page
        if (url.startsWith('#') && !url.startsWith('/#')) {
          return `<a href="${url}" class="text-emerald-600 hover:text-emerald-800 underline">${text}</a>`;
        }
        // For order search links, navigate to history order page with search parameter
        if (url.startsWith('/#order-search-')) {
          const orderId = url.replace('/#order-search-', '');
          // Use onclick to handle navigation properly with React Router
          return `<a href="#" onclick="window.location.href='/history-order'; localStorage.setItem('searchOrderId', '${orderId}'); window.dispatchEvent(new Event('storage')); return false;" class="text-emerald-600 hover:text-emerald-800 underline">${text}</a>`;
        }
        // For order links, navigate to order history page with search term
        if (url.startsWith('/order/')) {
          const orderId = url.split('/').pop();
          return `<a href="#" onclick="window.location.href='/history-order'; localStorage.setItem('searchOrderId', '${orderId}'); window.dispatchEvent(new Event('storage')); return false;" class="text-emerald-600 hover:text-emerald-800 underline">${text}</a>`;
        }
        // For other internal links (starting with /), navigate within same page
        if (url.startsWith('/')) {
          return `<a href="${url}" class="text-emerald-600 hover:text-emerald-800 underline">${text}</a>`;
        }
        // For external links, open in new tab
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-800 underline">${text}</a>`;
      })
      // Handle bold: **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Handle line breaks
      .replace(/\n/g, '<br />');
  };
  
  const htmlContent = processMarkdown(content);
  return <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const ProductCard = ({ product, onClick }) => (
  <div onClick={() => onClick && onClick(product)} className="block bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group mt-2 cursor-pointer overflow-hidden">
    <div className="flex gap-4 p-4">
      <div className="relative flex-shrink-0">
        <img src={product.image || ""} alt={product.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
        {product.salePrice && product.salePrice > 0 && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Giảm
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate text-sm">{product.name}</h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.shortDescription || ""}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.salePrice && product.salePrice > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-green-600">{product.salePrice.toLocaleString('vi-VN')}₫</span>
                <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString('vi-VN')}₫</span>
              </div>
            ) : (
              <span className="text-base font-bold text-green-600">{product.price.toLocaleString('vi-VN')}₫</span>
            )}
          </div>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <StarIcon />
            <span className="ml-1 font-medium text-gray-700">{(product.statisticsRate?.averageRate || 0).toFixed(1)}</span>
          </div>
          <span className="mx-2">•</span>
          <span className="text-gray-500">{product.statisticsRate?.totalSale || 0} đã bán</span>
        </div>
      </div>
    </div>
    <div className="px-4 pb-3 pt-1">
      <div className="text-xs text-green-600 font-medium hidden group-hover:block transition-all duration-300">
        Xem chi tiết →
      </div>
    </div>
  </div>
);

const OrderCard = ({ order, onClick }) => (
  <div onClick={() => onClick && onClick(order)} className="block bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group mt-2 cursor-pointer overflow-hidden">
    <div className="p-4">
      <div className="mb-3">
        <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate text-sm mb-1">Đơn hàng #{order.id}</h4>
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${order.status === 'COMPLETED' ? 'bg-green-500 text-white' : 
             order.status === 'PENDING' ? 'bg-yellow-500 text-white' : 
             order.status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
          {order.status === 'COMPLETED' ? 'Hoàn thành' : 
           order.status === 'PENDING' ? 'Đang xử lý' : 
           order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
        </span>
      </div>
      
      <div className="flex gap-4">
        {/* Product images preview */}
        <div className="flex-shrink-0">
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={order.orderItems[0].image || ""} 
                  alt={order.orderItems[0].productName} 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
                />
              </div>
              {order.orderItems.length > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                  +{order.orderItems.length - 1}
                </div>
              )}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-600">
              {order.orderItems && order.orderItems.length > 0 
                ? `${order.orderItems.reduce((total, item) => total + (item.quantity || 0), 0)} sản phẩm` 
                : '0 sản phẩm'}
            </span>
            {order.shippingFee > 0 && (
              <span className="text-xs text-green-600 font-medium">
                +{order.shippingFee.toLocaleString('vi-VN')}đ phí ship
              </span>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mb-2">Ngày đặt: {new Date(order.createdDate).toLocaleDateString('vi-VN')}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product details */}
      {order.orderItems && order.orderItems.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs font-medium text-gray-700 mb-2">Sản phẩm:</div>
          <div className="space-y-2">
            {order.orderItems.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="truncate max-w-[100px]">{item.productName}</span>
                </div>
                <span className="font-medium">x{item.quantity}</span>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <div className="text-xs text-gray-500">+{order.orderItems.length - 2} sản phẩm khác</div>
            )}
          </div>
        </div>
      )}
    </div>
    <div className="px-4 pb-3 pt-1">
      <div className="text-xs text-green-600 font-medium hidden group-hover:block transition-all duration-300">
        Xem chi tiết đơn hàng →
      </div>
    </div>
  </div>
);

// ProductDetail component removed as it's no longer needed

// --- MAIN CHAT COMPONENT ---
const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(scrollToBottom, [messages, isLoading]);

  const parseAIResponse = useCallback((responseText, allProducts, allOrders) => {
      const parts = [];
      const productNames = allProducts.map(p => p.name);
      const orderIds = allOrders.map(o => o.id.toString());
      
      // Regex to find bolded text (potential product names)
      const productRegex = new RegExp(`\\*\\*(${productNames.join('|')})\\*\\*`, 'g');
      // Regex to find order references
      const orderRegex = new RegExp(`\\*\\*Đơn hàng #(${orderIds.join('|')})\\*\\*`, 'g');
      
      // First check if there are any order references
      const hasOrderRefs = orderRegex.test(responseText);
      
      // Reset regex lastIndex for product checking
      orderRegex.lastIndex = 0;
      
      let lastIndex = 0;
      let match;

      // If there are order references, prioritize them and skip product parsing
      if (hasOrderRefs) {
          // Check for order matches
          while ((match = orderRegex.exec(responseText)) !== null) {
              if (match.index > lastIndex) {
                  parts.push({ type: 'text', content: responseText.substring(lastIndex, match.index) });
              }
              const orderId = match[1];
              const order = allOrders.find(o => o.id.toString() === orderId);
              if (order) {
                  parts.push({ type: 'order', order: order });
              }
              lastIndex = orderRegex.lastIndex;
          }
      } else {
          // Check for product matches only if no order references
          while ((match = productRegex.exec(responseText)) !== null) {
              if (match.index > lastIndex) {
                  parts.push({ type: 'text', content: responseText.substring(lastIndex, match.index) });
              }
              const productName = match[1];
              const product = allProducts.find(p => p.name === productName);
              if (product) {
                  parts.push({ type: 'product', product: product });
              }
              lastIndex = productRegex.lastIndex;
          }
      }

      if (lastIndex < responseText.length) {
          parts.push({ type: 'text', content: responseText.substring(lastIndex) });
      }
      
      // If no products or orders were found, return the full text as a single part
      if (parts.length === 0) {
        return [{ type: 'text', content: responseText }];
      }

      return parts.filter(p => (p.type === 'text' && p.content.trim() !== '') || p.type === 'product' || p.type === 'order');
  }, []);

  const initializeChat = useCallback(async () => {
    if (messages.length > 0) return;
    setIsInitializing(true);
    try {
      const res = await productApi.getAll(1, 20, "createdDate", "desc");
      const productList = res?.data?.content || [];
      setProducts(productList);

      // Try to fetch orders if user is logged in
      let orderList = [];
      try {
        const orderRes = await ordersApi.getAll(1, 10, "createdDate", "desc");
        orderList = orderRes?.data?.content || [];
        setOrders(orderList);
      } catch (err) {
        // User not logged in or error fetching orders
        console.log("User not logged in or error fetching orders");
      }

      // Get voucher data from VoucherExchange component
      const voucherData = [
        { id: 1, discountValue: 5000, minOrderValue: 20000, exchangePoint: 100, active: true, percentage: false, name: "Giảm 5.000đ", description: "Cho đơn hàng từ 20.000đ", code: "VOUCHER5K" },
        { id: 2, discountValue: 10, minOrderValue: 50000, exchangePoint: 300, active: true, percentage: true, name: "Giảm 10%", description: "Cho đơn hàng từ 50.000đ", code: "VOUCHER10P" },
        { id: 3, discountValue: 20000, minOrderValue: 100000, exchangePoint: 500, active: true, percentage: false, name: "Giảm 20.000đ", description: "Cho đơn hàng từ 100.000đ", code: "VOUCHER20K" },
        { id: 4, discountValue: 15, minOrderValue: 150000, exchangePoint: 700, active: true, percentage: true, name: "Giảm 15%", description: "Cho đơn hàng từ 150.000đ", code: "VOUCHER15P" },
        { id: 5, discountValue: 50000, minOrderValue: 300000, exchangePoint: 1200, active: true, percentage: false, name: "Giảm 50.000đ", description: "Cho đơn hàng từ 300.000đ", code: "VOUCHER50K" },
        { id: 6, discountValue: 30000, minOrderValue: 150000, exchangePoint: 600, active: true, percentage: false, name: "Giảm 30.000đ", description: "Cho đơn hàng từ 150.000đ", code: "VOUCHER30K" },
        { id: 7, discountValue: 20, minOrderValue: 200000, exchangePoint: 800, active: true, percentage: true, name: "Giảm 20%", description: "Cho đơn hàng từ 200.000đ", code: "VOUCHER20P" },
        { id: 8, discountValue: 100000, minOrderValue: 500000, exchangePoint: 1500, active: true, percentage: false, name: "Giảm 100.000đ", description: "Cho đơn hàng từ 500.000đ", code: "VOUCHER100K" },
        { id: 9, discountValue: 5, minOrderValue: 30000, exchangePoint: 150, active: true, percentage: true, name: "Giảm 5%", description: "Cho đơn hàng từ 30.000đ", code: "VOUCHER5P" },
        { id: 10, discountValue: 15000, minOrderValue: 70000, exchangePoint: 250, active: true, percentage: false, name: "Giảm 15.000đ", description: "Cho đơn hàng từ 70.000đ", code: "VOUCHER15K" },
        { id: 11, discountValue: 25, minOrderValue: 250000, exchangePoint: 900, active: true, percentage: true, name: "Giảm 25%", description: "Cho đơn hàng từ 250.000đ", code: "VOUCHER25P" },
        { id: 12, discountValue: 70000, minOrderValue: 350000, exchangePoint: 1300, active: true, percentage: false, name: "Giảm 70.000đ", description: "Cho đơn hàng từ 350.000đ", code: "VOUCHER70K" },
        { id: 13, discountValue: 10000, minOrderValue: 50000, exchangePoint: 200, active: true, percentage: false, name: "Giảm 10.000đ", description: "Cho đơn hàng từ 50.000đ", code: "VOUCHER10K" },
        { id: 14, discountValue: 30, minOrderValue: 300000, exchangePoint: 1000, active: true, percentage: true, name: "Giảm 30%", description: "Cho đơn hàng từ 300.000đ", code: "VOUCHER30P" },
        { id: 15, discountValue: 5000, minOrderValue: 25000, exchangePoint: 120, active: true, percentage: false, name: "Giảm 5.000đ", description: "Cho đơn hàng từ 25.000đ", code: "VOUCHER5KA" }
      ];

      const systemPrompt = `Bạn là trợ lý AI và chuyên gia sức khỏe của "Detox Heaven", một thương hiệu nước detox tự nhiên.
      
      Nhiệm vụ: Tạo một lời chào mừng nồng nhiệt, chuyên nghiệp cho khách hàng.
      
      Yêu cầu:
      1. Bắt đầu bằng lời chào thân thiện (ví dụ: "Xin chào! Chào mừng bạn đến với Detox Heaven!").
      2. Giới thiệu ngắn gọn bạn là trợ lý AI, sẵn sàng tư vấn về sức khỏe và sản phẩm.
      3. Không cần liệt kê sản phẩm cụ thể ngay từ đầu.
      4. Kết thúc bằng một câu hỏi mở để khuyến khích tương tác (ví dụ: "Hôm nay, mình có thể giúp bạn tìm kiếm điều gì để cải thiện sức khỏe?").
      
      Danh sách sản phẩm để tham khảo (định dạng đẹp mắt):
      ${formatProductsForAI(productList)}
      
      ${orderList.length > 0 ? `Danh sách đơn hàng của khách hàng (định dạng đẹp mắt):
      ${formatOrdersForAI(orderList)}
      
      ` : ''}
      Danh sách voucher để tham khảo (định dạng đẹp mắt):
      ${formatVouchersForAI(voucherData)}
      
      Hướng dẫn quan trọng: Khi đề cập đến việc đổi voucher, hãy sử dụng liên kết sau để dẫn người dùng đến trang đổi voucher: /#voucher-exchange
      `;

      const welcomeText = await callGeminiAPI(systemPrompt);
      const initialParts = parseAIResponse(welcomeText, productList, orderList);
      setMessages([{ id: Date.now(), sender: 'ai', parts: initialParts }]);
    } catch (err) {
      console.error(err);
      setMessages([{ id: 1, sender: 'ai', parts: [{ type: 'text', content: "Xin chào! Mình là trợ lý AI của Detox Heaven. Mình có thể giúp gì cho bạn hôm nay?" }] }]);
    } finally {
      setIsInitializing(false);
    }
  }, [parseAIResponse, messages.length]);
  
  useEffect(() => {
      if (isOpen && products.length === 0) {
          initializeChat();
      }
  }, [isOpen, products, initializeChat]);


  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now(), sender: 'user', parts: [{ type: 'text', content: input }] };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Fetch products from API if not already loaded
      let productList = products;
      if (products.length === 0) {
        const res = await productApi.getAll(1, 20, "createdDate", "desc");
        productList = res?.data?.content || [];
        setProducts(productList);
      }

      // Try to fetch orders if not already loaded
      let orderList = orders;
      if (orders.length === 0) {
        try {
          const orderRes = await ordersApi.getAll(1, 10, "createdDate", "desc");
          orderList = orderRes?.data?.content || [];
          setOrders(orderList);
        } catch (err) {
          // User not logged in or error fetching orders
          console.log("User not logged in or error fetching orders");
        }
      }

      // Get voucher data from VoucherExchange component
      const voucherData = [
        { id: 1, discountValue: 5000, minOrderValue: 20000, exchangePoint: 100, active: true, percentage: false, name: "Giảm 5.000đ", description: "Cho đơn hàng từ 20.000đ", code: "VOUCHER5K" },
        { id: 2, discountValue: 10, minOrderValue: 50000, exchangePoint: 300, active: true, percentage: true, name: "Giảm 10%", description: "Cho đơn hàng từ 50.000đ", code: "VOUCHER10P" },
        { id: 3, discountValue: 20000, minOrderValue: 100000, exchangePoint: 500, active: true, percentage: false, name: "Giảm 20.000đ", description: "Cho đơn hàng từ 100.000đ", code: "VOUCHER20K" },
        { id: 4, discountValue: 15, minOrderValue: 150000, exchangePoint: 700, active: true, percentage: true, name: "Giảm 15%", description: "Cho đơn hàng từ 150.000đ", code: "VOUCHER15P" },
        { id: 5, discountValue: 50000, minOrderValue: 300000, exchangePoint: 1200, active: true, percentage: false, name: "Giảm 50.000đ", description: "Cho đơn hàng từ 300.000đ", code: "VOUCHER50K" },
        { id: 6, discountValue: 30000, minOrderValue: 150000, exchangePoint: 600, active: true, percentage: false, name: "Giảm 30.000đ", description: "Cho đơn hàng từ 150.000đ", code: "VOUCHER30K" },
        { id: 7, discountValue: 20, minOrderValue: 200000, exchangePoint: 800, active: true, percentage: true, name: "Giảm 20%", description: "Cho đơn hàng từ 200.000đ", code: "VOUCHER20P" },
        { id: 8, discountValue: 100000, minOrderValue: 500000, exchangePoint: 1500, active: true, percentage: false, name: "Giảm 100.000đ", description: "Cho đơn hàng từ 500.000đ", code: "VOUCHER100K" },
        { id: 9, discountValue: 5, minOrderValue: 30000, exchangePoint: 150, active: true, percentage: true, name: "Giảm 5%", description: "Cho đơn hàng từ 30.000đ", code: "VOUCHER5P" },
        { id: 10, discountValue: 15000, minOrderValue: 70000, exchangePoint: 250, active: true, percentage: false, name: "Giảm 15.000đ", description: "Cho đơn hàng từ 70.000đ", code: "VOUCHER15K" },
        { id: 11, discountValue: 25, minOrderValue: 250000, exchangePoint: 900, active: true, percentage: true, name: "Giảm 25%", description: "Cho đơn hàng từ 250.000đ", code: "VOUCHER25P" },
        { id: 12, discountValue: 70000, minOrderValue: 350000, exchangePoint: 1300, active: true, percentage: false, name: "Giảm 70.000đ", description: "Cho đơn hàng từ 350.000đ", code: "VOUCHER70K" },
        { id: 13, discountValue: 10000, minOrderValue: 50000, exchangePoint: 200, active: true, percentage: false, name: "Giảm 10.000đ", description: "Cho đơn hàng từ 50.000đ", code: "VOUCHER10K" },
        { id: 14, discountValue: 30, minOrderValue: 300000, exchangePoint: 1000, active: true, percentage: true, name: "Giảm 30%", description: "Cho đơn hàng từ 300.000đ", code: "VOUCHER30P" },
        { id: 15, discountValue: 5000, minOrderValue: 25000, exchangePoint: 120, active: true, percentage: false, name: "Giảm 5.000đ", description: "Cho đơn hàng từ 25.000đ", code: "VOUCHER5KA" }
      ];

      const prompt = `Bạn là trợ lý AI và chuyên gia sức khỏe của "Detox Heaven".
      
      Bối cảnh: Khách hàng đang hỏi: "${currentInput}".
      
      Danh sách sản phẩm đầy đủ để bạn tham khảo (định dạng đẹp mắt):
      ${formatProductsForAI(productList)}
      
      ${orderList.length > 0 ? `Danh sách đơn hàng của khách hàng (định dạng đẹp mắt):
      ${formatOrdersForAI(orderList)}
      
      ` : ''}
      Danh sách voucher để tham khảo (định dạng đẹp mắt):
      ${formatVouchersForAI(voucherData)}
      
      Hướng dẫn quan trọng: Khi đề cập đến việc đổi voucher, hãy sử dụng liên kết sau để dẫn người dùng đến trang đổi voucher: /#voucher-exchange

      ${orderList.length === 0 && (currentInput.toLowerCase().includes('đơn hàng') || currentInput.toLowerCase().includes('order')) ? 'Nếu khách hàng hỏi về đơn hàng nhưng chưa đăng nhập, hãy yêu cầu khách hàng đăng nhập để xem thông tin đơn hàng.' : ''}

      Nhiệm vụ: Trả lời câu hỏi của khách hàng một cách chuyên nghiệp, thân thiện và hữu ích.
      
      QUY TẮC VÀNG:
      1.  **Phân tích & Thấu hiểu:** Đọc kỹ câu hỏi để hiểu rõ nhu cầu của khách (ví dụ: giảm cân, tăng năng lượng, đẹp da).
      2.  **Tư vấn chính xác:** Dựa HOÀN TOÀN vào thông tin sản phẩm và voucher được cung cấp. KHÔNG bịa đặt thông tin.
      3.  **Đề xuất thông minh:** Nếu phù hợp, hãy đề xuất 1-2 sản phẩm liên quan nhất. Giải thích ngắn gọn LÝ DO tại sao sản phẩm đó phù hợp.
      4.  **Định dạng chuyên nghiệp:"
          -   Sử dụng Markdown in đậm tên sản phẩm: \`**Tên sản phẩm**\`. Đây là cách duy nhất để hiển thị thẻ sản phẩm.
          -   Sử dụng gạch đầu dòng (-) cho các danh sách để dễ đọc.
          -   Định dạng danh sách sản phẩm và voucher theo mẫu đẹp mắt như đã cung cấp.
      5.  **Giọng văn:** Luôn thân thiện, tích cực, và chuyên nghiệp.
      6.  **Kết thúc:** Luôn kết thúc bằng một câu hỏi mở để tiếp tục cuộc trò chuyện, ví dụ: "Bạn có cần mình tư vấn thêm gì không ạ?".
      `;

      const aiResponseText = await callGeminiAPI(prompt);
      const aiParts = parseAIResponse(aiResponseText, productList, orderList);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', parts: aiParts };
      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', parts: [{ type: 'text', content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại." }] }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
      setMessages([]);
      setProducts([]);
      setOrders([]);
      setInput('');
      
      // Fetch products from API
      try {
        const res = await productApi.getAll(1, 20, "createdDate", "desc");
        const productList = res?.data?.content || [];
        setProducts(productList);
      } catch (err) {
        console.error("Failed to refresh products:", err);
      }
      
      // Try to fetch orders if user is logged in
      try {
        const orderRes = await ordersApi.getAll(1, 10, "createdDate", "desc");
        const orderList = orderRes?.data?.content || [];
        setOrders(orderList);
      } catch (err) {
        // User not logged in or error fetching orders
        console.log("User not logged in or error fetching orders");
      }
  }
  
  const handleProductClick = async (product) => {
    // Add user message to show the question
    const userQuestion = `Tôi muốn biết chi tiết về sản phẩm ${product.name}`;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      parts: [{ type: 'text', content: userQuestion }]
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    try {
      // Create a detailed prompt for the AI to provide product advice
      const productInfo = `
        Tên sản phẩm: ${product.name}
        Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
        ${product.salePrice ? `Giá khuyến mãi: ${product.salePrice.toLocaleString('vi-VN')} VNĐ` : ''}
        Mô tả: ${product.description || product.shortDescription || 'Không có mô tả'}
        ${product.ingredients ? `Thành phần: ${product.ingredients}` : ''}
        ${product.benefits ? `Công dụng: ${product.benefits}` : ''}
        Đánh giá: ${(product.statisticsRate?.averageRate || 0).toFixed(1)}/5 (${product.statisticsRate?.totalSale || 0} đã bán)
        ${product.image ? `Hình ảnh: ${product.image}` : ''}
      `;
      
      const prompt = `Bạn là chuyên gia dinh dưỡng và sức khỏe của "Detox Heaven".
      
      Nhiệm vụ: Cung cấp tư vấn chi tiết và chuyên sâu về sản phẩm detox này.
      
      Thông tin sản phẩm:
      ${productInfo}
      
      Yêu cầu:
      1. Bắt đầu bằng tiêu đề "## Tư vấn chi tiết về ${product.name}"
      2. Phân tích chi tiết về thành phần và công dụng của từng thành phần
      3. Giải thích cụ thể lợi ích sức khỏe mà sản phẩm mang lại
      4. Đề xuất đối tượng phù hợp sử dụng sản phẩm này
      5. Hướng dẫn sử dụng hiệu quả (liều lượng, thời điểm uống, liệu trình)
      6. Kết hợp với các sản phẩm khác nếu có thể
      7. Trả lời bằng tiếng Việt chuẩn, rõ ràng và dễ hiểu
      8. Sử dụng markdown để định dạng đẹp mắt (tiêu đề, danh sách, in đậm)
      9. Nếu có thông tin hình ảnh, hãy hiển thị hình ảnh sản phẩm bằng cú pháp: ![Hình ảnh ${product.name}]({link_hình_ảnh})
      10. Luôn kết thúc bằng một liên kết đến trang chi tiết sản phẩm với văn bản "[Xem chi tiết sản phẩm](/product/${product.id})"
      11. Đảm bảo tất cả các liên kết đều ở định dạng markdown có thể nhấp chuột được
      `;
      
      const adviceText = await callGeminiAPI(prompt);
      
      // Add the product advice to messages
      const adviceMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        parts: [{ type: 'text', content: adviceText }]
      };
      
      setMessages(prev => [...prev, adviceMsg]);
    } catch (err) {
      console.error("Failed to get product advice:", err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        parts: [{ type: 'text', content: "Xin lỗi, hiện tại không thể cung cấp tư vấn chi tiết cho sản phẩm này. Vui lòng thử lại sau." }]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleOrderClick = async (order) => {
    // Add user message to show the question
    const userQuestion = `Tôi muốn biết chi tiết về đơn hàng #${order.id}`;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      parts: [{ type: 'text', content: userQuestion }]
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    try {
      // Create a detailed prompt for the AI to provide order advice
      const orderInfo = `
        Mã đơn hàng: #${order.id}
        Ngày đặt: ${new Date(order.createdDate).toLocaleDateString('vi-VN')}
        Tổng tiền: ${order.totalAmount?.toLocaleString('vi-VN')} VNĐ
        ${order.shippingFee > 0 ? `Phí vận chuyển: +${order.shippingFee.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí vận chuyển'}
        Trạng thái: ${order.status === 'COMPLETED' ? 'Hoàn thành' : order.status === 'PENDING' ? 'Đang xử lý' : order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
        ${order.note ? `Ghi chú: ${order.note}` : ''}
        
        Sản phẩm trong đơn hàng:
        ${order.orderItems && order.orderItems.length > 0 
          ? order.orderItems.map((item, idx) => 
              `${idx + 1}. ${item.productName} (x${item.quantity})
                 - Giá: ${(parseFloat(item.salePrice) > 0 
                   ? parseFloat(item.salePrice) 
                   : parseFloat(item.priceProduct)).toLocaleString('vi-VN')} VNĐ
                 - Thành tiền: ${(parseFloat(item.salePrice) > 0 
                   ? parseFloat(item.salePrice) * item.quantity
                   : parseFloat(item.priceProduct) * item.quantity).toLocaleString('vi-VN')} VNĐ
                 ${item.image ? `![Hình ảnh sản phẩm](${item.image})` : ''}`
            ).join('\n        ')
          : 'Không có sản phẩm nào trong đơn hàng'}
      `;
      
      const prompt = `Bạn là trợ lý khách hàng của "Detox Heaven".
      
      Nhiệm vụ: Cung cấp thông tin chi tiết và hỗ trợ về đơn hàng này.
      
      Thông tin đơn hàng:
      ${orderInfo}
      
      Yêu cầu:
      1. Bắt đầu bằng tiêu đề "## Thông tin chi tiết đơn hàng #${order.id}"
      2. Giải thích rõ ràng về trạng thái đơn hàng
      3. Nếu đơn hàng đang xử lý, thông báo thời gian dự kiến giao hàng
      4. Nếu đơn hàng đã hoàn thành, cảm ơn khách hàng
      5. Nếu đơn hàng bị hủy, giải thích lý do (nếu có) và hướng dẫn đặt lại
      6. Trả lời bằng tiếng Việt chuẩn, rõ ràng và dễ hiểu
      7. Sử dụng markdown để định dạng đẹp mắt (tiêu đề, danh sách, in đậm)
      8. Hiển thị hình ảnh sản phẩm nếu có
      9. Luôn kết thúc bằng một liên kết để xem chi tiết đơn hàng với văn bản "[Xem chi tiết đơn hàng](/#order-search-${order.id})" để khi người dùng click vào sẽ được chuyển đến trang tìm kiếm đơn hàng với mã đơn hàng này
      10. Đảm bảo tất cả các liên kết đều ở định dạng markdown có thể nhấp chuột được
      `;
      
      const adviceText = await callGeminiAPI(prompt);
      
      // Add the order advice to messages
      const adviceMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        parts: [{ type: 'text', content: adviceText }]
      };
      
      setMessages(prev => [...prev, adviceMsg]);
    } catch (err) {
      console.error("Failed to get order advice:", err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        parts: [{ type: 'text', content: "Xin lỗi, hiện tại không thể cung cấp thông tin chi tiết cho đơn hàng này. Vui lòng thử lại sau." }]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSuggestionMessage = async (suggestionText) => {
    if (isLoading || isInitializing) return;

    const userMsg = { id: Date.now(), sender: 'user', parts: [{ type: 'text', content: suggestionText }] };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Fetch products from API if not already loaded
      let productList = products;
      if (products.length === 0) {
        const res = await productApi.getAll(1, 20, "createdDate", "desc");
        productList = res?.data?.content || [];
        setProducts(productList);
      }

      // Try to fetch orders if not already loaded
      let orderList = orders;
      if (orders.length === 0) {
        try {
          const orderRes = await ordersApi.getAll(1, 10, "createdDate", "desc");
          orderList = orderRes?.data?.content || [];
          setOrders(orderList);
        } catch (err) {
          // User not logged in or error fetching orders
          console.log("User not logged in or error fetching orders");
        }
      }

      // Get voucher data from VoucherExchange component
      const voucherData = [
        { id: 1, discountValue: 5000, minOrderValue: 20000, exchangePoint: 100, active: true, percentage: false, name: "Giảm 5.000đ", description: "Cho đơn hàng từ 20.000đ", code: "VOUCHER5K" },
        { id: 2, discountValue: 10, minOrderValue: 50000, exchangePoint: 300, active: true, percentage: true, name: "Giảm 10%", description: "Cho đơn hàng từ 50.000đ", code: "VOUCHER10P" },
        { id: 3, discountValue: 20000, minOrderValue: 100000, exchangePoint: 500, active: true, percentage: false, name: "Giảm 20.000đ", description: "Cho đơn hàng từ 100.000đ", code: "VOUCHER20K" },
        { id: 4, discountValue: 15, minOrderValue: 150000, exchangePoint: 700, active: true, percentage: true, name: "Giảm 15%", description: "Cho đơn hàng từ 150.000đ", code: "VOUCHER15P" },
        { id: 5, discountValue: 50000, minOrderValue: 300000, exchangePoint: 1200, active: true, percentage: false, name: "Giảm 50.000đ", description: "Cho đơn hàng từ 300.000đ", code: "VOUCHER50K" },
        { id: 6, discountValue: 30000, minOrderValue: 150000, exchangePoint: 600, active: true, percentage: false, name: "Giảm 30.000đ", description: "Cho đơn hàng từ 150.000đ", code: "VOUCHER30K" },
        { id: 7, discountValue: 20, minOrderValue: 200000, exchangePoint: 800, active: true, percentage: true, name: "Giảm 20%", description: "Cho đơn hàng từ 200.000đ", code: "VOUCHER20P" },
        { id: 8, discountValue: 100000, minOrderValue: 500000, exchangePoint: 1500, active: true, percentage: false, name: "Giảm 100.000đ", description: "Cho đơn hàng từ 500.000đ", code: "VOUCHER100K" },
        { id: 9, discountValue: 5, minOrderValue: 30000, exchangePoint: 150, active: true, percentage: true, name: "Giảm 5%", description: "Cho đơn hàng từ 30.000đ", code: "VOUCHER5P" },
        { id: 10, discountValue: 15000, minOrderValue: 70000, exchangePoint: 250, active: true, percentage: false, name: "Giảm 15.000đ", description: "Cho đơn hàng từ 70.000đ", code: "VOUCHER15K" },
        { id: 11, discountValue: 25, minOrderValue: 250000, exchangePoint: 900, active: true, percentage: true, name: "Giảm 25%", description: "Cho đơn hàng từ 250.000đ", code: "VOUCHER25P" },
        { id: 12, discountValue: 70000, minOrderValue: 350000, exchangePoint: 1300, active: true, percentage: false, name: "Giảm 70.000đ", description: "Cho đơn hàng từ 350.000đ", code: "VOUCHER70K" },
        { id: 13, discountValue: 10000, minOrderValue: 50000, exchangePoint: 200, active: true, percentage: false, name: "Giảm 10.000đ", description: "Cho đơn hàng từ 50.000đ", code: "VOUCHER10K" },
        { id: 14, discountValue: 30, minOrderValue: 300000, exchangePoint: 1000, active: true, percentage: true, name: "Giảm 30%", description: "Cho đơn hàng từ 300.000đ", code: "VOUCHER30P" },
        { id: 15, discountValue: 5000, minOrderValue: 25000, exchangePoint: 120, active: true, percentage: false, name: "Giảm 5.000đ", description: "Cho đơn hàng từ 25.000đ", code: "VOUCHER5KA" }
      ];

      const prompt = `Bạn là trợ lý AI và chuyên gia sức khỏe của "Detox Heaven".
      
      Bối cảnh: Khách hàng đang hỏi: "${suggestionText}".
      
      Danh sách sản phẩm đầy đủ để bạn tham khảo (định dạng đẹp mắt):
      ${formatProductsForAI(productList)}
      
      ${orderList.length > 0 ? `Danh sách đơn hàng của khách hàng (định dạng đẹp mắt):
      ${formatOrdersForAI(orderList)}
      
      ` : ''}
      Danh sách voucher để tham khảo (định dạng đẹp mắt):
      ${formatVouchersForAI(voucherData)}
      
      Hướng dẫn quan trọng: Khi đề cập đến việc đổi voucher, hãy sử dụng liên kết sau để dẫn người dùng đến trang đổi voucher: /#voucher-exchange

      ${orderList.length === 0 && (suggestionText.toLowerCase().includes('đơn hàng') || suggestionText.toLowerCase().includes('order')) ? 'Nếu khách hàng hỏi về đơn hàng nhưng chưa đăng nhập, hãy yêu cầu khách hàng đăng nhập để xem thông tin đơn hàng.' : ''}

      Nhiệm vụ: Trả lời câu hỏi của khách hàng một cách chuyên nghiệp, thân thiện và hữu ích.
      
      QUY TẮC VÀNG:
      1.  **Phân tích & Thấu hiểu:** Đọc kỹ câu hỏi để hiểu rõ nhu cầu của khách (ví dụ: giảm cân, tăng năng lượng, đẹp da).
      2.  **Tư vấn chính xác:** Dựa HOÀN TOÀN vào thông tin sản phẩm và voucher được cung cấp. KHÔNG bịa đặt thông tin.
      3.  **Đề xuất thông minh:** Nếu phù hợp, hãy đề xuất 1-2 sản phẩm liên quan nhất. Giải thích ngắn gọn LÝ DO tại sao sản phẩm đó phù hợp.
      4.  **Định dạng chuyên nghiệp:"
          -   Sử dụng Markdown in đậm tên sản phẩm: \`**Tên sản phẩm**\`. Đây là cách duy nhất để hiển thị thẻ sản phẩm.
          -   Sử dụng gạch đầu dòng (-) cho các danh sách để dễ đọc.
          -   Định dạng danh sách sản phẩm và voucher theo mẫu đẹp mắt như đã cung cấp.
      5.  **Giọng văn:** Luôn thân thiện, tích cực, và chuyên nghiệp.
      6.  **Kết thúc:** Luôn kết thúc bằng một câu hỏi mở để tiếp tục cuộc trò chuyện, ví dụ: "Bạn có cần mình tư vấn thêm gì không ạ?".
      `;

      const aiResponseText = await callGeminiAPI(prompt);
      const aiParts = parseAIResponse(aiResponseText, productList, orderList);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', parts: aiParts };
      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', parts: [{ type: 'text', content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 bg-green-400 text-white p-4 rounded-full shadow-2xl hover:bg-green-500 transform transition-all duration-300 z-50 focus:outline-none focus:ring-4 focus:ring-green-400/50" aria-label="Toggle chat">
        {isOpen ? <CloseIcon className="w-6 h-6"/> : <ChatIcon className="w-6 h-6"/>}
      </button>

      <div className={`fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-300 flex flex-col transition-all duration-300 ease-in-out z-40 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white text-gray-800 p-4 rounded-t-2xl flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center border-2 border-green-400"><BotIcon className="w-7 h-7 text-white"/></div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Detox AI</h3>
              <p className="text-gray-500 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={handleRefresh} className="text-gray-500 hover:bg-green-100 hover:text-green-700 p-2 rounded-full transition-colors" title="Bắt đầu lại"><RefreshIcon className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
          {(isInitializing) ? (
            <div className="flex items-center justify-center h-full"><div className="text-center text-gray-500"><BotIcon className="w-12 h-12 mx-auto animate-bounce mb-2 text-green-400" /><p>Đang khởi tạo trợ lý AI...</p></div></div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && <div className="w-8 h-8 bg-green-400 text-white rounded-full flex-shrink-0 flex items-center justify-center"><BotIcon className="w-5 h-5" /></div>}
                  <div className={`w-auto max-w-[85%] space-y-2`}>
                    {msg.parts.map((part, index) => (
                      <div key={index} className={`px-4 py-3 rounded-2xl break-words ${ msg.sender === 'user' ? 'bg-green-400 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
                        {part.type === 'text' && <MarkdownRenderer content={part.content} />}
                        {part.type === 'product' && <ProductCard product={part.product} onClick={handleProductClick} />}
                        {part.type === 'order' && <OrderCard order={part.order} onClick={handleOrderClick} />}
                      </div>
                    ))}
                  </div>
                  {msg.sender === 'user' && <div className="w-8 h-8 bg-green-400 text-white rounded-full flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>}
                </div>
              ))
              }
            </>
          )}
          {isLoading && !isInitializing && (
            <div className="flex items-end gap-3 justify-start">
               <div className="w-8 h-8 bg-green-400 text-white rounded-full flex-shrink-0 flex items-center justify-center"><BotIcon className="w-5 h-5" /></div>
              <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-none border border-gray-200"><TypingIndicator /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
          {/* Suggestion prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={() => sendSuggestionMessage("Tôi muốn biết về các sản phẩm detox giảm cân")}
              disabled={isLoading || isInitializing}
              className="text-xs bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-green-400 shadow-sm"
            >
              detox giảm cân
            </button>
            <button 
              onClick={() => sendSuggestionMessage("Có voucher nào đang khuyến mãi không?")}
              disabled={isLoading || isInitializing}
              className="text-xs bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-green-400 shadow-sm"
            >
              voucher khuyến mãi
            </button>
            <button 
              onClick={() => sendSuggestionMessage("Sản phẩm nào tốt cho da?")}
              disabled={isLoading || isInitializing}
              className="text-xs bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-green-400 shadow-sm"
            >
              tốt cho da
            </button>
            <button 
              onClick={() => sendSuggestionMessage("Cách sử dụng detox đúng cách?")}
              disabled={isLoading || isInitializing}
              className="text-xs bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-green-400 shadow-sm"
            >
              cách sử dụng
            </button>
            <button 
              onClick={() => sendSuggestionMessage("Đơn hàng của tôi thế nào rồi?")}
              disabled={isLoading || isInitializing}
              className="text-xs bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-green-400 shadow-sm"
            >
              đơn hàng của tôi
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Hỏi về detox, giảm cân..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm transition-shadow" disabled={isLoading || isInitializing} />
            <button onClick={sendMessage} disabled={isLoading || isInitializing || !input.trim()} className="bg-green-400 text-white p-3 rounded-xl hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all" aria-label="Send message">
              <SendIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


// --- APP ENTRY POINT ---
const App = () => {
    return (
        <main className="relative w-full h-screen font-sans bg-gray-50">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/detox-bg/1920/1080')", filter: 'blur(4px)'}}></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>
                    Welcome to Detox Heaven
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
                    Your journey to a healthier you starts here. Ask our AI assistant anything!
                </p>
            </div>
            
            <AIChat />
        </main>
    );
};

export default AIChat;

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<React.StrictMode><App /></React.StrictMode>);
}
