import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 text-gray-800 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <section className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-green-100 rounded-full opacity-75 blur-lg"></div>
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Về DetoxCare
            </h1>
          </div>
          <p className="text-lg md:text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
          DetoxCare bắt đầu từ mong muốn mang lại lựa chọn detox lành mạnh – tiện lợi – hiệu quả cho những người bận rộn và quan tâm đến sức khỏe mỗi ngày. Chúng tôi mang đến nước ép detox từ nguyên liệu tự nhiên, đi kèm hướng dẫn sử dụng cá nhân hoá – dễ áp dụng ngay tại nhà
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                SỨ MỆNH CỦA CHÚNG TÔI
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 leading-tight">
                Mang đến cuộc sống cân bằng từ những điều <span className="text-emerald-600">tự nhiên nhất</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Nguyên liệu thuần tự nhiên</h3>
                    <p className="text-green-700 mt-1">100% nguyên liệu hữu cơ, không chất bảo quản, nguồn gốc rõ ràng</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Công thức dễ uống</h3>
                    <p className="text-green-700 mt-1">Được pha chế với tỉ lệ hợp lý, dễ uống và tốt cho sức khỏe</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Cộng đồng lành mạnh</h3>
                    <p className="text-green-700 mt-1">Kết nối và chia sẻ kinh nghiệm sống xanh cùng 1.000+ thành viên</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                  alt="Detox drinks"
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-green-100 hidden lg:block">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-800">+1.000 Khách hàng</p>
                    <p className="text-sm text-green-600">Hài lòng mỗi tháng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
<section className="mb-20 px-4">
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-3">Đội Ngũ Của Chúng Tôi</h2>
    <p className="text-lg text-green-600 max-w-2xl mx-auto">
      Những con người tâm huyết đằng sau những sản phẩm chất lượng
    </p>
  </div>
  
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
    {[
      {
        name: "Nguyễn Văn Thương",
        role: "CEO & Nhà sáng lập",
        description: "Người tiên phong trong lĩnh vực detox tự nhiên",
        image: "https://fap.fpt.edu.vn/temp/ImageRollNumber/QN/66c237e2-4357-4117-ab46-e0d82dcd8b6f.jpg",
        social: ["linkedin", "facebook"]
      },
      {
        name: "Đặng Thị Tường Vy",
        role: "CEO & Nhà sáng lập",
        description: "Chuyên gia sản xuất nước detox",
        image: "https://fap.fpt.edu.vn/temp/ImageRollNumber/QN/0dc32fe0-f9e9-417f-8e15-354009027966.jpg",
        social: ["twitter", "instagram"]
      },
      {
        name: "Nguyễn Quỳnh Diễm My",
        role: "Quản lý Cộng đồng",
        description: "Xây dựng cộng đồng sống xanh",
        image: "https://fap.fpt.edu.vn/temp/ImageRollNumber/QN/5a6ccd88-9e73-4884-ad2f-4b3e3c1a8451.jpg",
        social: ["facebook", "youtube"]
      },
      {
        name: "Lê Ngọc Hiếu",
        role: "CSKH & Tư vấn",
        description: "Tư vấn chế độ detox cá nhân hóa",
        image: "https://fap.fpt.edu.vn/temp/ImageRollNumber/QN/f25441c6-e408-4896-b9a9-c06e2f8da75c.jpg",
        social: ["instagram", "tiktok"]
      },
      {
        name: "Phan Thị Minh Phương",
        role: "Quản lí sản xuất và đánh giá sản phẩm",
        description: "Đảm bảo chất lượng sản phẩm",
        image: "https://fap.fpt.edu.vn/temp/ImageRollNumber/QN/5a829f66-1c1e-4cdb-af13-30d76d1126c1.jpg",
        social: ["facebook", "linkedin"]
      }
    ].map((member, index) => (
      <div 
        key={index} 
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-green-50 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col"
      >
        <div className="relative pt-[100%] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-3 md:p-4 flex-grow">
          <h3 className="text-sm md:text-base font-semibold text-green-800 mb-1 line-clamp-1">{member.name}</h3>
          <p className="text-xs md:text-sm text-green-600 font-medium mb-2 line-clamp-1">{member.role}</p>
          <p className="text-xs text-green-700 mb-3 line-clamp-2">{member.description}</p>
          <div className="flex justify-center space-x-2">
            {member.social.map((social, i) => (
              <div key={i} className="bg-green-50 p-1.5 rounded-full text-green-600 hover:bg-green-100 cursor-pointer">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  {social === "facebook" && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>}
                  {social === "twitter" && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>}
                  {social === "instagram" && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>}
                  {social === "linkedin" && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>}
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
        {/* Stats Section */}
        <section className="mb-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">5K+</div>
              <div className="text-green-100">Khách hàng</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">20+</div>
              <div className="text-green-100">Sản phẩm</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">0+</div>
              <div className="text-green-100">Nông trại</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-green-100">Hài lòng</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-white rounded-2xl shadow-xl border border-green-100">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
              Sẵn sàng bắt đầu hành trình detox của bạn?
            </h2>
            <p className="text-lg text-green-700 mb-8">
              Đăng ký ngay để nhận ưu đãi 15% cho đơn hàng đầu tiên và bộ tài liệu hướng dẫn detox tại nhà!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                to="/contact"
                className="bg-white hover:bg-green-50 text-green-700 border-2 border-green-600 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Nhận tư vấn miễn phí
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}