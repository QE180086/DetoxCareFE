const ProductGrid = () => {
  const products = [
    { name: "Nước Detox Táo Xanh", price: "45.000đ", image: "https://cdn.pixabay.com/photo/2024/06/16/16/34/celery-8833805_640.jpg" },
    { name: "Nước Detox Chanh Leo", price: "45.000đ", image: "https://images.unsplash.com/photo-1507281736761-614baa217ed3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { name: "Combo 3 Ngày Detox", price: "280.000đ", image: "https://images.unsplash.com/photo-1593182037593-126b2b7c4332?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { name: "Nước Detox Cà Mướp", price: "45.000đ", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { name: "Combo 7 Ngày Thanh Lọc", price: "280.000đ", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { name: "Nước Detox Cà Đen", price: "45.000đ", image: "https://images.unsplash.com/photo-1507281736761-614baa217ed3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { name: "Combo Rau Củ Detox", price: "280.000đ", image: "https://images.unsplash.com/photo-1593182037593-126b2b7c4332?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { name: "Nước Detox Cà Rốt", price: "45.000đ", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  ];

  return (
    <section className="py-8 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sản phẩm nổi bật</h2>
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center border border-gray-200">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
            <p className="text-green-600 font-bold mb-2">{product.price}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
      <div className="container mx-auto px-4 flex justify-center mt-6">
        <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
          Xem thêm
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;