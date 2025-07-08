import { useParams } from "react-router-dom";

// Dữ liệu giả lập cho bài blog (thay bằng API thực tế sau)
const blogData = {
  1: {
    id: 1,
    title: "Lợi ích của Detox đối với sức khỏe",
    content:
      "Detox là một phương pháp giúp cơ thể loại bỏ độc tố, cải thiện sức khỏe và tăng cường năng lượng. Trong bài viết này, chúng ta sẽ khám phá những lợi ích chính của detox, bao gồm cải thiện tiêu hóa, tăng cường hệ miễn dịch, và nâng cao tinh thần. Hãy bắt đầu hành trình detox của bạn ngay hôm nay!",
    created_at: "2025-06-20",
    author: "Admin DetoxCare",
  },
  2: {
    id: 2,
    title: "5 Công thức Detox đơn giản tại nhà",
    content:
      "Bạn không cần phải chi nhiều tiền để detox. Bài viết này giới thiệu 5 công thức detox đơn giản mà bạn có thể làm tại nhà với các nguyên liệu như chanh, gừng, và rau xanh. Hãy thử ngay để cảm nhận sự khác biệt!",
    created_at: "2025-06-18",
    author: "Admin DetoxCare",
  },
  3: {
    id: 3,
    title: "Hành trình Detox: Câu chuyện thực tế",
    content:
      "Nghe những câu chuyện thực tế từ những người đã thay đổi cuộc sống nhờ detox. Từ việc giảm cân đến cải thiện sức khỏe tổng thể, những câu chuyện này sẽ truyền cảm hứng cho bạn bắt đầu hành trình của riêng mình.",
    created_at: "2025-06-15",
    author: "Admin DetoxCare",
  },
};

export default function BlogDetail() {
  const { blogId } = useParams();
  const blog = blogData[blogId] || { title: "Không tìm thấy", content: "Bài viết không tồn tại.", created_at: "", author: "" };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-2">Đăng ngày: {blog.created_at} | Tác giả: {blog.author}</p>
      <div className="prose max-w-none text-gray-700">
        <p>{blog.content}</p>
      </div>
      <a
        href="/blog"
        className="mt-6 inline-block text-green-700 hover:text-green-800 font-medium"
      >
        &larr; Quay lại danh sách Blog
      </a>
    </div>
  );
}