import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.message) {
            setStatus({
                type: "success",
                message: "Thông tin của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.",
            });
            setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
            setStatus({
                type: "error",
                message: "Vui lòng điền đầy đủ các trường bắt buộc!",
            });
        }
        setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    };

    return (
         <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="text-white space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Liên hệ <span className="text-green-200">với chúng tôi</span>
                </h1>
               <p className="text-green-100 text-lg leading-relaxed">
                Bạn đang tìm hiểu về các gói detox? Cần tư vấn để chọn liệu trình phù hợp? Hãy liên hệ với chúng tôi
                ngay hôm nay!
              </p>
            </div>

            {/* Office Info */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-100 mb-2">VĂN PHÒNG</h3>
                  <p className="text-green-200">Quy Nhơn - Bình Định</p>
                  <p className="text-green-200">Việt Nam</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-100 mb-2">GIỜ LÀM VIỆC</h3>
                  <p className="text-green-200">Thứ 2 - Thứ 6:</p>
                  <p className="text-green-200">8:30 - 17:30</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-100 mb-2">LIÊN HỆ</h3>
                  <p className="text-green-200">Gọi ngay:</p>
                  <p className="text-green-200 font-medium">(+84) 379 560 889</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ*</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                     placeholder="Họ"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                             <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Tên*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                     placeholder="Tên"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                              </div>

                  {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Điện thoại*</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Điện thoại"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                             </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Các loại dịch vụ</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                                >
                                     <option value="">Loại</option>
                  <option value="detox-7-days">Gói Detox 7 ngày</option>
                  <option value="detox-14-days">Gói Detox 14 ngày</option>
                  <option value="detox-21-days">Gói Detox 21 ngày</option>
                  <option value="consultation">Tư vấn cá nhân</option>
                  <option value="partnership">Hợp tác kinh doanh</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung*</label>
                                <textarea
                                    // id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Nhập nội dung tại đây"
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                                    required
                                ></textarea>
                            </div>

                              {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"                            >
                                 Gửi
                            </button>

                             {/* Status Message */}
                            {status.message && (
                               <div
                                 className={`p-4 rounded-xl text-center font-medium ${
                                 status.type === "success"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                 : "bg-red-50 text-red-700 border border-red-200"
                                        }`}
                                >
                                   {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}