// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { FaLeaf } from 'react-icons/fa';

// // Giả lập danh sách sản phẩm mở rộng
// const allProducts = Array.from({ length: 30 }).map((_, i) => ({
//   id: i + 1,
//   name: ['Detox Juice', 'Smoothie', 'Trà thải độc'][i % 3] + ' ' + (i + 1),
//   category: ['Nước ép', 'Sinh tố', 'Trà detox'][i % 3],
//   price: (8 + (i % 5)) * 23000, // Convert USD to VNĐ (1 USD ~ 23,000 VNĐ)
//   image: `https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg`,
//   rating: (Math.random() * 4 + 1).toFixed(1),
//   purchases: Math.floor(Math.random() * 1000) + 100,
// }));

// export default function SearchPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   useEffect(() => {
//     let result = allProducts.filter((p) =>
//       p.name.toLowerCase().includes(query)
//     );
//     if (categoryFilter) {
//       result = result.filter((p) => p.category === categoryFilter);
//     }
//     setFilteredProducts(result);
//     setCurrentPage(1);
//   }, [query, categoryFilter]);

//   // Phân trang
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const currentItems = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const categories = ['Tất cả', 'Detox', 'Combo 3 ngày', ' Combo 5 ngày','Combo 7 ngày','Nước ép mix'];

//   const handleAddToCart = (product) => {
//     alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
//   };

//   // Hàm tạo sao đánh giá
//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

//     return (
//       <div className="flex items-center">
//         {Array(fullStars).fill().map((_, i) => (
//           <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
//             <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
//           </svg>
//         ))}
//         {halfStar && (
//           <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
//             <path d="M12 2.5l2.834 5.743 6.166.851-4.5 4.366.667 6.085L12 17.174l-5.167 2.371.667-6.085-4.5-4.366 6.166-.851z" />
//           </svg>
//         )}
//         {Array(emptyStars).fill().map((_, i) => (
//           <svg key={i + fullStars + (halfStar ? 1 : 0)} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
//             <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
//           </svg>
//         ))}
//         <span className="ml-2 text-gray-600 text-sm">({rating})</span>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <h1 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center gap-2">
//           <FaLeaf className="text-green-600" />
//           Kết quả tìm kiếm: <span className="underline decoration-green-500">{query || 'Tất cả'}</span>
//         </h1>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar danh mục */}
//           <div className="lg:w-1/4 bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold text-green-700 mb-4">Danh Mục Sản Phẩm</h2>
//             <ul className="space-y-3">
//               {categories.map((cat) => (
//                 <li key={cat}>
//                   <button
//                     onClick={() => setCategoryFilter(cat === 'Tất cả' ? '' : cat)}
//                     className={`w-full text-left px-4 py-2 rounded-full text-sm font-medium transition ${
//                       categoryFilter === cat || (cat === 'Tất cả' && categoryFilter === '')
//                         ? 'bg-green-600 text-white shadow-md'
//                         : 'bg-green-50 text-green-700 hover:bg-green-100'
//                     }`}
//                   >
//                     {cat}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Product grid */}
//           <div className="lg:w-3/4 flex flex-col gap-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {currentItems.length > 0 ? (
//                 currentItems.map((product) => (
//                   <div
//                     key={product.id}
//                     className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
//                   >
//                     <div
//                       onClick={() => navigate(`/product/${product.id}`)}
//                       className="cursor-pointer"
//                     >
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="w-full h-48 object-cover rounded-lg mb-4 border border-green-200"
//                       />
//                       <h3 className="text-xl font-semibold text-green-700 hover:underline mb-2">
//                         {product.name}
//                       </h3>
//                       {renderStars(product.rating)}
//                       <p className="text-gray-600 text-sm mt-2">Đã bán: {product.purchases}</p>
//                     </div>
//                     <p className="text-gray-600 text-sm mt-1">{product.category}</p>
//                     <p className="text-green-800 font-bold text-lg mt-2">{product.price.toLocaleString('vi-VN')} VNĐ</p>
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-sm font-semibold shadow-md"
//                     >
//                       Thêm vào giỏ hàng
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600 col-span-full text-center text-lg">
//                   Không tìm thấy sản phẩm nào phù hợp.
//                 </p>
//               )}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-3 mt-8">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//                     currentPage === 1
//                       ? 'bg-green-200 text-green-400 cursor-not-allowed'
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                 >
//                   Trước
//                 </button>
//                 {Array.from({ length: totalPages }).map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//                       currentPage === i + 1
//                         ? 'bg-green-700 text-white'
//                         : 'bg-white text-green-700 border border-green-500 hover:bg-green-100'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//                     currentPage === totalPages
//                       ? 'bg-green-200 text-green-400 cursor-not-allowed'
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                 >
//                   Sau
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaLeaf } from 'react-icons/fa';

// Giả lập danh sách sản phẩm mở rộng
const allProducts = [
  // Detox (5 loại, 330ml)
  { id: 1, name: 'Củ dền + Cà rốt + Táo + Dưa leo', category: 'Detox', price: 30000, image: 'https://www.bartender.edu.vn/wp-content/uploads/2021/12/nuoc-ep-cu-den-nhieu-cong-dung.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 2, name: 'Cần tây + Táo + Dưa leo', category: 'Detox', price: 30000, image: 'https://omegajuicers.vn/wp-content/uploads/2023/11/nuoc-ep-can-tay-dua-tao-dua-chuot.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 3, name: 'Cần tây + Táo + Thơm', category: 'Detox', price: 30000, image: 'https://file.hstatic.net/200000342937/file/cach-lam-nuoc-ep-can-tay-va-tao_5c4f1de76ead47fcb48938416aca2e17_grande.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 4, name: 'Cần tây + Thơm', category: 'Detox', price: 30000, image: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/4/22/nuoc-ep-can-tay-1713756549662927698966.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 5, name: 'Thơm + Táo + Dưa leo + Cà rốt', category: 'Detox', price: 30000, image: 'https://drinkocany.com/wp-content/uploads/2023/10/detox-tao.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  // Combo 3 ngày (85k)
  { id: 6, name: 'Combo 3 ngày - Ngày 1', category: 'Combo 3 ngày', price: 85000, image: 'https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Củ dền + Cà rốt + Táo + Dưa leo' },
  { id: 7, name: 'Combo 3 ngày - Ngày 2', category: 'Combo 3 ngày', price: 85000, image: 'https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Thơm' },
  { id: 8, name: 'Combo 3 ngày - Ngày 3', category: 'Combo 3 ngày', price: 85000, image: 'https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Thơm + Táo + Dưa leo + Cà rốt' },
  // Combo 5 ngày (135k)
  { id: 9, name: 'Combo 5 ngày - Ngày 1', category: 'Combo 5 ngày', price: 135000, image: 'https://vivita.cdn.vccloud.vn/wp-content/uploads/2022/08/nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Dưa leo' },
  { id: 10, name: 'Combo 5 ngày - Ngày 2', category: 'Combo 5 ngày', price: 135000, image: 'https://vivita.cdn.vccloud.vn/wp-content/uploads/2022/08/nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Thơm + Táo + Dưa leo + Cà rốt' },
  { id: 11, name: 'Combo 5 ngày - Ngày 3', category: 'Combo 5 ngày', price: 135000, image: 'https://vivita.cdn.vccloud.vn/wp-content/uploads/2022/08/nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Củ dền + Cà rốt + Táo + Dưa leo' },
  { id: 12, name: 'Combo 5 ngày - Ngày 4', category: 'Combo 5 ngày', price: 135000, image: 'https://vivita.cdn.vccloud.vn/wp-content/uploads/2022/08/nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Thơm' },
  { id: 13, name: 'Combo 5 ngày - Ngày 5', category: 'Combo 5 ngày', price: 135000, image: 'https://vivita.cdn.vccloud.vn/wp-content/uploads/2022/08/nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Thơm' },
  // Combo 7 ngày (189k)
  { id: 14, name: 'Combo 7 ngày - Ngày 1', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Dưa leo' },
  { id: 15, name: 'Combo 7 ngày - Ngày 2', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Củ dền + Cà rốt + Táo + Dưa leo' },
  { id: 16, name: 'Combo 7 ngày - Ngày 3', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Thơm' },
  { id: 17, name: 'Combo 7 ngày - Ngày 4', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Thơm + Táo + Dưa leo + Cà rốt' },
  { id: 18, name: 'Combo 7 ngày - Ngày 5', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Thơm' },
  { id: 19, name: 'Combo 7 ngày - Ngày 6', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Củ dền + Cà rốt + Táo + Dưa leo' },
  { id: 20, name: 'Combo 7 ngày - Ngày 7', category: 'Combo 7 ngày', price: 189000, image: 'https://chaipetsaigon.com/wp-content/uploads/2021/03/10-cong-thuc-lam-nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Thơm + Táo + Dưa leo + Cà rốt' },
  // Nước ép mix (5 loại, 330ml)
  { id: 21, name: 'Ép Thơm Táo', category: 'Nước ép mix', price: 25000, image: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/nuoc_ep_tao_co_tac_dung_gi_nuoc_ep_tao_mix_voi_gi_cho_giau_dinh_duong_1_9ad02a8c5f.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 22, name: 'Ép Ổi Cóc', category: 'Nước ép mix', price: 25000, image: 'https://satrafoods.com.vn/uploads/Images/mon-ngon-moi-ngay/nuoc-ep-oi.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 23, name: 'Ép Táo Thơm', category: 'Nước ép mix', price: 25000, image: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/nuoc_ep_tao_co_tac_dung_gi_nuoc_ep_tao_mix_voi_gi_cho_giau_dinh_duong_1_9ad02a8c5f.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 24, name: 'Ép Thơm Ổi', category: 'Nước ép mix', price: 25000, image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_11_1_638344439347794038_nuoc-ep-tao-thumb.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 25, name: 'Ép Táo Lê', category: 'Nước ép mix', price: 25000, image: 'https://elmich.vn/wp-content/uploads/2023/12/nuoc-ep-le-1.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  // Thêm 5 sản phẩm ngẫu nhiên để đủ 30
  { id: 26, name: 'Detox Xanh Đặc Biệt', category: 'Detox', price: 30000, image: 'https://file.hstatic.net/200000240163/article/nuoc_detox_xanh_5y6z7a8b9c0d1e2f_1024x1024.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
  { id: 27, name: 'Combo 3 ngày - Phiên bản Đặc biệt', category: 'Combo 3 ngày', price: 85000, image: 'https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Củ dền + Cà rốt + Táo + Dưa leo' },
  { id: 28, name: 'Combo 5 ngày - Phiên bản Đặc biệt', category: 'Combo 5 ngày', price: 135000, image: 'https://vivita.cdn.vccloud.vn/wp-content/uploads/2022/08/nuoc-ep-detox.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Dưa leo' },
  { id: 29, name: 'Combo 7 ngày - Phiên bản Đặc biệt', category: 'Combo 7 ngày', price: 189000, image: 'https://file.hstatic.net/200000240163/article/combo_7_ngay_dac_biet_8b9c0d1e2f3g4h5i_1024x1024.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100, description: 'Cần tây + Táo + Dưa leo' },
  { id: 30, name: 'Ép Mix Đặc Biệt', category: 'Nước ép mix', price: 25000, image: 'https://file.hstatic.net/200000240163/article/nuoc_ep_mix_dac_biet_9c0d1e2f3g4h5i6j_1024x1024.jpg', rating: (Math.random() * 4 + 1).toFixed(1), purchases: Math.floor(Math.random() * 1000) + 100 },
];

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let result = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [query, categoryFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['Tất cả', 'Detox', 'Combo 3 ngày', 'Combo 5 ngày', 'Combo 7 ngày', 'Nước ép mix'];

  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Hàm tạo sao đánh giá
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array(fullStars).fill().map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.5l2.834 5.743 6.166.851-4.5 4.366.667 6.085L12 17.174l-5.167 2.371.667-6.085-4.5-4.366 6.166-.851z" />
          </svg>
        )}
        {Array(emptyStars).fill().map((_, i) => (
          <svg key={i + fullStars + (halfStar ? 1 : 0)} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600 text-sm">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center gap-2">
          <FaLeaf className="text-green-600" />
          Kết quả tìm kiếm: <span className="underline decoration-green-500">{query || 'Tất cả'}</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar danh mục */}
          <div className="lg:w-1/4 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Danh Mục Sản Phẩm</h2>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategoryFilter(cat === 'Tất cả' ? '' : cat)}
                    className={`w-full text-left px-4 py-2 rounded-full text-sm font-medium transition ${
                      categoryFilter === cat || (cat === 'Tất cả' && categoryFilter === '')
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product grid */}
          <div className="lg:w-3/4 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
                  >
                    <div
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4 border border-green-200"
                      />
                      <h3 className="text-xl font-semibold text-green-700 hover:underline mb-2">
                        {product.name}
                      </h3>
                      {product.description && <p className="text-gray-600 text-sm mb-2">{product.description}</p>}
                      {renderStars(product.rating)}
                      <p className="text-gray-600 text-sm mt-2">Đã bán: {product.purchases}</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{product.category}</p>
                    <p className="text-green-800 font-bold text-lg mt-2">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-sm font-semibold shadow-md"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center text-lg">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentPage === 1
                      ? 'bg-green-200 text-green-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      currentPage === i + 1
                        ? 'bg-green-700 text-white'
                        : 'bg-white text-green-700 border border-green-500 hover:bg-green-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-green-200 text-green-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}