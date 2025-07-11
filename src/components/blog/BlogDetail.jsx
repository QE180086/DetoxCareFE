import { Link, useParams } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { useState } from "react";

// Dữ liệu giả lập cho bài blog (thay bằng API thực tế sau)
const blogData = {
  1: {
    id: 1,
    title: "Lợi ích của Detox đối với sức khỏe",
    content:
      "Detox là một phương pháp giúp cơ thể loại bỏ độc tố, cải thiện sức khỏe và tăng cường năng lượng. Trong bài viết này, chúng ta sẽ khám phá những lợi ích chính của detox, bao gồm cải thiện tiêu hóa, tăng cường hệ miễn dịch, và nâng cao tinh thần. Detox không chỉ giúp bạn cảm thấy khỏe mạnh hơn mà còn hỗ trợ làn da sáng mịn và cải thiện giấc ngủ. Hãy bắt đầu hành trình detox của bạn ngay hôm nay với những bước đơn giản như uống đủ nước và bổ sung rau xanh vào chế độ ăn!",
    created_at: "2025-06-20",
    author: "Admin DetoxCare",
    image: "https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg",
  },
  2: {
    id: 2,
    title: "5 Công thức Detox đơn giản tại nhà",
    content:
      "Bạn không cần phải chi nhiều tiền để detox. Bài viết này giới thiệu 5 công thức detox đơn giản mà bạn có thể làm tại nhà với các nguyên liệu như chanh, gừng, và rau xanh. Ví dụ, một ly nước chanh gừng ấm vào buổi sáng có thể kích thích tiêu hóa, trong khi sinh tố rau xanh cung cấp chất xơ và vitamin. Hãy thử ngay để cảm nhận sự khác biệt trong cơ thể chỉ sau vài ngày!",
    created_at: "2025-06-18",
    author: "Admin DetoxCare",
    image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
  },
  3: {
    id: 3,
    title: "Hành trình Detox: Câu chuyện thực tế",
    content:
      "Nghe những câu chuyện thực tế từ những người đã thay đổi cuộc sống nhờ detox. Từ việc giảm cân, cải thiện năng lượng đến nâng cao sức khỏe tổng thể, những câu chuyện này sẽ truyền cảm hứng cho bạn. Một người dùng chia sẻ rằng sau 7 ngày detox, họ cảm thấy nhẹ nhàng hơn và ngủ ngon hơn. Hãy khám phá những trải nghiệm thực tế và bắt đầu hành trình detox của riêng bạn!",
    created_at: "2025-06-15",
    author: "Admin DetoxCare",
    image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/cach-pha-che-detox-chanh-dua-leo.jpg",
  },
  4: {
    id: 4,
    title: "Detox và Giấc Ngủ: Bí Mật Cho Sức Khỏe Toàn Diện",
    content:
      "Khám phá cách detox hỗ trợ cải thiện chất lượng giấc ngủ. Một cơ thể được thanh lọc sẽ giúp bạn thư giãn dễ dàng hơn, giảm căng thẳng và cải thiện giấc ngủ sâu. Bài viết này chia sẻ các mẹo như sử dụng trà thảo mộc trước khi ngủ và tránh các thực phẩm gây khó tiêu để tối ưu hóa lợi ích của detox.",
    created_at: "2025-06-10",
    author: "Admin DetoxCare",
    image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg",
  },
  5: {
    id: 5,
    title: "Thực Đơn Detox 7 Ngày Cho Người Mới Bắt Đầu",
    content:
      "Lên kế hoạch detox 7 ngày dễ dàng với hướng dẫn chi tiết. Bài viết này cung cấp thực đơn mẫu với các món ăn nhẹ nhàng như sinh tố, salad, và súp rau củ. Bạn sẽ học cách kết hợp các thực phẩm giàu chất xơ và vitamin để tối ưu hóa hiệu quả detox mà vẫn đảm bảo ngon miệng.",
    created_at: "2025-06-05",
    author: "Admin DetoxCare",
    image: "https://images.unsplash.com/photo-1543363955-2f373c6e04f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  6: {
    id: 6,
    title: "Tầm Quan Trọng Của Nước Trong Quá Trình Detox",
    content:
      "Hiểu rõ vai trò của nước trong việc thanh lọc cơ thể. Uống đủ nước không chỉ giúp loại bỏ độc tố mà còn hỗ trợ tiêu hóa và giữ cho làn da luôn tươi sáng. Bài viết này chia sẻ các mẹo để duy trì thói quen uống nước và cách kết hợp với các loại nước detox như nước chanh hoặc nước ép dưa leo.",
    created_at: "2025-06-01",
    author: "Admin DetoxCare",
    image: "https://images.unsplash.com/photo-1557170334-a9632e77b2f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
};

export default function BlogDetail() {
  const { blogId } = useParams();
  const blog = blogData[blogId] || {
    title: "Không tìm thấy",
    content: "Bài viết không tồn tại.",
    created_at: "",
    author: "",
    image: "https://images.unsplash.com/photo-1506784361845-3903a963b3b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  };

  // State to manage comments and login status
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isLoggedIn] = useState(true); // Mock login status; replace with real auth check

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        name,
        comment,
        created_at: new Date().toLocaleDateString("vi-VN"),
      };
      setComments([newComment, ...comments]);
      setName("");
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        <div className="relative">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
          <h1 className="absolute bottom-6 left-6 text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
            {blog.title}
          </h1>
        </div>

        {/* Blog Meta */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaLeaf className="text-green-600" />
            <span>Đăng ngày: {blog.created_at}</span>
            <span>|</span>
            <span>Tác giả: {blog.author}</span>
          </div>
          <Link
            to="/blog"
            className="text-green-600 font-medium hover:text-green-800 transition flex items-center gap-2"
          >
            <FaLeaf /> Quay lại danh sách Blog
          </Link>
        </div>

        {/* Blog Content */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p>{blog.content}</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Bình luận
          </h2>
          
          {/* Comment Form */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Để lại bình luận của bạn
            </h3>
            {isLoggedIn ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Bình luận
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Chia sẻ ý kiến của bạn về detox..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
                >
                  <FaLeaf className="mr-2" />
                  Gửi bình luận
                </button>
              </form>
            ) : (
              <div className="text-gray-700">
                <p>Vui lòng <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">đăng nhập</Link> để bình luận.</p>
              </div>
            )}
          </div>

          {/* Comment List */}
          <div>
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">
                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-start gap-3 mb-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=10B981&color=fff`}
                        alt={`${c.name}'s avatar`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{c.name}</span>
                          <span>|</span>
                          <span>{c.created_at}</span>
                        </div>
                        <p className="text-gray-700">{c.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}