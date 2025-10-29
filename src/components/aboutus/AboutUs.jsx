import { Link } from "react-router-dom";

export default function About() {
  const coreValues = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "100% Tự nhiên",
      description: "Không chất bảo quản, không đường tinh luyện, chỉ dùng nguyên liệu hữu cơ từ nông trại đạt chuẩn.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Tiện lợi mỗi ngày",
      description: "Đóng chai sẵn, bảo quản lạnh, chỉ cần mở nắp và uống – phù hợp cho người bận rộn.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Được tin dùng",
      description: "Hơn 5.000 khách hàng hài lòng và đồng hành cùng DetoxCare trong hành trình sống xanh.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Hiệu quả rõ rệt",
      description: "Cảm nhận sự thay đổi chỉ sau 3–7 ngày: da sáng hơn, tiêu hóa tốt, tinh thần sảng khoái.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="text-green-400 text-sm font-semibold tracking-widest uppercase">Về chúng tôi</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              DetoxCare
            </h1>
            <div className="w-24 h-1 bg-green-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              DetoxCare bắt đầu từ mong muốn mang lại lựa chọn detox lành mạnh – tiện lợi – hiệu quả cho những người bận rộn và quan tâm đến sức khỏe mỗi ngày.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-green-400 text-sm font-semibold tracking-widest uppercase mb-4">
                Sứ mệnh
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                Mang đến cuộc sống cân bằng từ những điều <span className="text-green-400">tự nhiên nhất</span>
              </h2>

              <div className="space-y-8 mt-12">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-black group-hover:bg-green-400 transition-colors duration-300 flex items-center justify-center mr-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Nguyên liệu thuần tự nhiên</h3>
                    <p className="text-gray-600 leading-relaxed">
                      100% nguyên liệu hữu cơ, không chất bảo quản, nguồn gốc rõ ràng
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-black group-hover:bg-green-400 transition-colors duration-300 flex items-center justify-center mr-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Công thức dễ uống</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Được pha chế với tỉ lệ hợp lý, dễ uống và tốt cho sức khỏe
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-black group-hover:bg-green-400 transition-colors duration-300 flex items-center justify-center mr-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Cộng đồng lành mạnh</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Kết nối và chia sẻ kinh nghiệm sống xanh cùng 1.000+ thành viên
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                  alt="Detox drinks"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-green-400 -z-0 rounded-lg"></div>

              <div className="absolute -top-6 -left-6 bg-black text-white p-6 max-w-xs z-20 rounded-lg">
                <div className="text-5xl font-bold text-green-400 mb-2">1K+</div>
                <p className="text-gray-300 text-sm uppercase tracking-wider">Khách hàng hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us? Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block text-green-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Vì sao chọn DetoxCare?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Giá trị làm nên sự khác biệt
            </h2>
            <div className="w-24 h-1 bg-green-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6 group-hover:bg-green-400 group-hover:text-white transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                5K+
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Khách hàng</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                20+
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Sản phẩm</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                10+
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Nông trại</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                98%
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-black p-12 md:p-16 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Sẵn sàng bắt đầu hành trình detox?
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Đăng ký ngay để nhận ưu đãi 15% cho đơn hàng đầu tiên và bộ tài liệu hướng dẫn detox tại nhà!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/products"
                  className="bg-green-400 hover:bg-green-500 text-black px-10 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg rounded-full"
                >
                  Khám phá sản phẩm
                </Link>
                <Link
                  to="/contact"
                  className="bg-transparent hover:bg-white text-white hover:text-black border-2 border-white px-10 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 rounded-full"
                >
                  Nhận tư vấn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}