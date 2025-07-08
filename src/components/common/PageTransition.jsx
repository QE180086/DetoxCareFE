// PageTransition.js
import { motion } from 'framer-motion';
import PageLoader from './PageLoader'; // Import màn hình loading

const PageTransition = ({ children, location, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <PageLoader /> // Hiển thị màn hình loading khi đang tải
      ) : (
        <motion.div
          key={location.pathname} // Đảm bảo mỗi route có key riêng biệt
          initial={{ opacity: 0 }} // Bắt đầu với opacity bằng 0
          animate={{ opacity: 1 }} // Khi chuyển đến trang mới, opacity sẽ tăng lên
          exit={{ opacity: 0 }} // Khi trang thoát, opacity sẽ giảm xuống
          transition={{ duration: 0.5 }} // Thời gian chuyển đổi
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default PageTransition;
