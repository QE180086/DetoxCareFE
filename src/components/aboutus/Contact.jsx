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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 text-gray-800 py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold text-teal-800 text-center mb-8">
                    Liên Hệ Detox Care
                </h1>
                <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                   Bạn đang tìm hiểu về các gói detox? Cần tư vấn để chọn liệu trình phù hợp với nhu cầu của mình? Hãy nhắn cho chúng tôi – đội ngũ DetoxCare luôn sẵn sàng hỗ trợ bạn!
                </p>

                {/* Contact Form & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                            Để lại thông tin
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Họ và Tên *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Số Điện Thoại *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Thông tin tư vấn mong muốn *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 resize-y focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="Vui lòng mô tả loại hình bạn quan tâm mong muốn tư vấn (hình ảnh sản phẩm, giá cả,...)"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                            >
                                Gửi yêu cầu tư vấn
                            </button>
                            {status.message && (
                                <p
                                    className={`mt-4 text-center ${status.type === "success"
                                            ? "text-teal-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {status.message}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                            Thông Tin Liên Hệ
                        </h2>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <a href="mailto:detoxcare.qn@gmail.com" className="hover:text-teal-600 transition duration-200">
                                         detoxcare.qn@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    <a href="tel:+842435678902" className="hover:text-teal-600 transition duration-200">
                                        (+84) 379 560 889 (Bộ phận hợp tác)
                                    </a>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span>Quy Nhơn - Bình Định - Việt Name</span>
                                </li>
                            </ul>
                        </div>

                        {/* Giờ làm việc */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-teal-700 mb-3">Giờ tiếp nhận hồ sơ hợp tác</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex justify-between">
                                    <span>Thứ 2 - Thứ 6:</span>
                                    <span>8:30 - 17:30</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Thứ 7:</span>
                                    <span>8:30 - 12:00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Chủ Nhật:</span>
                                    <span>Nghỉ</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                        <h3 className="text-xl font-semibold text-teal-700 mb-3">Trở thành đối tác của Detox Care</h3>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Chúng tôi luôn tìm kiếm các đối tác tiềm năng để cùng phát triển hệ thống chăm sóc sức khỏe chất lượng cao.
                        </p>
                        <Link
                            to="/become-partner"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 inline-block"
                        >
                            Đăng ký làm đối tác
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}