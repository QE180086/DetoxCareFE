import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Testimonials() {
  const scrollRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Minh Tuấn",
      role: "Khách hàng thường xuyên",
      content: "Sản phẩm chất lượng tuyệt vời, giao hàng nhanh chóng. Tôi rất hài lòng với dịch vụ của cửa hàng!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 2,
      name: "Thu Hà",
      role: "Khách hàng mới",
      content: "Giá cả hợp lý, nhiều combo ưu đãi. Chắc chắn sẽ quay lại mua hàng lần nữa.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 3,
      name: "Đức Anh",
      role: "Khách hàng VIP",
      content: "Đội ngũ tư vấn nhiệt tình, sản phẩm đa dạng. Đây là nơi mua sắm tin cậy của tôi!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 4,
      name: "Ngọc Linh",
      role: "Khách hàng thân thiết",
      content: "Chất lượng sản phẩm luôn đảm bảo, đóng gói cẩn thận. Rất đáng tin cậy!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 5,
      name: "Hữu Phước",
      role: "Khách hàng mới",
      content: "Dịch vụ chăm sóc khách hàng tận tâm, giao hàng đúng hẹn. Sẽ giới thiệu cho bạn bè!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 6,
      name: "Thanh Ngân",
      role: "Khách hàng VIP",
      content: "Sản phẩm phong phú, giá cả cạnh tranh. Tôi rất hài lòng và sẽ ủng hộ lâu dài!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
    }
  ];

  // Duplicate testimonials for infinite scroll effect
  const allTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      
      // Reset scroll when reaching halfway (since we duplicated the array)
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      
      scrollContainer.scrollLeft = scrollAmount;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Mọi Người Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với sản phẩm cũng như dịch vụ của chúng tôi
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-hidden"
              style={{ scrollBehavior: 'auto' }}
            >
              {allTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-[350px] bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col"
                >
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-5 h-5 fill-green-400 text-green-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                    "{testimonial.content}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mt-auto">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-green-400"
                    />
                    <div>
                      <h4 className="font-semibold text-black">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}