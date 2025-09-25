import { useState, useEffect, useRef } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
    const serviceDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
                setIsServiceDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceChange = (value) => {
        setFormData({ ...formData, service: value });
        setIsServiceDropdownOpen(false);
    };

    const getServiceLabel = (value) => {
        const services = {
            "": "Chọn loại dịch vụ",
            "detox-7-days": "Gói Detox 7 ngày",
            "detox-14-days": "Gói Detox 14 ngày",
            "detox-21-days": "Gói Detox 21 ngày",
            "consultation": "Tư vấn cá nhân",
            "partnership": "Hợp tác kinh doanh"
        };
        return services[value] || "Chọn loại dịch vụ";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.message) {
            setStatus({
                type: "success",
                message: "Thông tin của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.",
            });
            setFormData({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
        } else {
            setStatus({
                type: "error",
                message: "Vui lòng điền đầy đủ các trường bắt buộc!",
            });
        }
        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-black text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Liên hệ <span className="text-green-400">với chúng tôi</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Bạn đang tìm hiểu về các gói detox? Cần tư vấn để chọn liệu trình phù hợp? 
                        Hãy liên hệ với chúng tôi ngay hôm nay!
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-500 p-3 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black ml-4">VĂN PHÒNG</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Quy Nhơn - Bình Định<br />
                                Việt Nam
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-500 p-3 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black ml-4">GIỜ LÀM VIỆC</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Thứ 2 - Thứ 6:<br />
                                <span className="font-semibold">8:30 - 17:30</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-500 p-3 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-black ml-4">LIÊN HỆ</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Gọi ngay:<br />
                                <span className="font-bold text-green-600 text-lg">(+84) 379 560 889</span>
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-200">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-black mb-4">Gửi tin nhắn cho chúng tôi</h2>
                                <p className="text-gray-600">Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.</p>
                            </div>

                            <div className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-3">Họ *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Nhập họ của bạn"
                                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-3">Tên *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Nhập tên của bạn"
                                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contact Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-3">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@email.com"
                                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-3">Điện thoại *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0123 456 789"
                                            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Service Selection */}
                                <div className="relative" ref={serviceDropdownRef}>
                                    <label className="block text-sm font-semibold text-black mb-3">Loại dịch vụ quan tâm</label>
                                    <div 
                                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-black flex justify-between items-center cursor-pointer"
                                        onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                                    >
                                        <span className={formData.service ? "text-black" : "text-gray-500"}>
                                            {getServiceLabel(formData.service)}
                                        </span>
                                        <svg 
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isServiceDropdownOpen ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                    
                                    {isServiceDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden">
                                            <div 
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200"
                                                onClick={() => handleServiceChange("")}
                                            >
                                                <span className="text-gray-500">Chọn loại dịch vụ</span>
                                            </div>
                                            <div 
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 border-t border-gray-100"
                                                onClick={() => handleServiceChange("detox-7-days")}
                                            >
                                                <span className="text-black">Gói Detox 7 ngày</span>
                                            </div>
                                            <div 
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 border-t border-gray-100"
                                                onClick={() => handleServiceChange("detox-14-days")}
                                            >
                                                <span className="text-black">Gói Detox 14 ngày</span>
                                            </div>
                                            <div 
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 border-t border-gray-100"
                                                onClick={() => handleServiceChange("detox-21-days")}
                                            >
                                                <span className="text-black">Gói Detox 21 ngày</span>
                                            </div>
                                            <div 
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 border-t border-gray-100"
                                                onClick={() => handleServiceChange("consultation")}
                                            >
                                                <span className="text-black">Tư vấn cá nhân</span>
                                            </div>
                                            <div 
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 border-t border-gray-100"
                                                onClick={() => handleServiceChange("partnership")}
                                            >
                                                <span className="text-black">Hợp tác kinh doanh</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-semibold text-black mb-3">Nội dung *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                                        rows="6"
                                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-black placeholder-gray-500"
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-2 border-black hover:border-gray-800"
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                        Gửi tin nhắn
                                    </span>
                                </button>

                                {/* Status Message */}
                                {status.message && (
                                    <div
                                        className={`p-4 rounded-xl text-center font-semibold border-2 ${
                                            status.type === "success"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                        }`}
                                    >
                                        {status.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA Section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu hành trình detox?</h3>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Tham gia cùng hàng nghìn khách hàng đã tin tưởng và đạt được kết quả tuyệt vời với các gói detox của chúng tôi.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+84379560889" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                            Gọi ngay: (+84) 379 560 889
                        </a>
                        <button className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-xl border-2 border-white transition-all duration-300">
                            Xem các gói detox
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}