import { AiOutlineApple, AiOutlineMenu } from 'react-icons/ai';
import { GiKiwiFruit, GiPalmTree } from 'react-icons/gi';
import { IoWaterOutline } from 'react-icons/io5';
import { MdSupportAgent } from 'react-icons/md';

const ComboOffers = () => {
    return (
        <section className="py-8 bg-white">
            {/* Hàng icon giống menu điều hướng */}
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-24 mb-12">
                    <a href="#home" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-200 ease-in-out">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <IoWaterOutline className="text-2xl md:text-3xl" />
                        </div>
                        <span className="text-sm md:text-base">Nước Detox</span>
                    </a>
                    <a href="#philosophy" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-200 ease-in-out">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <GiKiwiFruit className="text-2xl md:text-3xl" />
                        </div>
                        <span className="text-sm md:text-base">Trái cây</span>
                    </a>
                    <a href="#vegetables" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-200 ease-in-out">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <GiPalmTree className="text-2xl md:text-3xl" />
                        </div>
                        <span className="text-sm md:text-base">Rau củ</span>
                    </a>
                    <a href="#combo" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-200 ease-in-out">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <AiOutlineApple className="text-2xl md:text-3xl" />
                        </div>
                        <span className="text-sm md:text-base">Combo Detox</span>
                    </a>
                    <a href="#menu" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-200 ease-in-out">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <AiOutlineMenu className="text-2xl md:text-3xl" />
                        </div>
                        <span className="text-sm md:text-base">Thực đơn</span>
                    </a>
                    <a href="#cart" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-200 ease-in-out">
                        <div className="bg-green-100 p-3 rounded-full mb-2">
                            <MdSupportAgent className="text-2xl md:text-3xl" />
                        </div>
                        <span className="text-sm md:text-base">Tư vấn</span>
                    </a>
                </div>
            </div>

            {/* Các ô ưu đãi */}
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-orange-600">COMBO DETOX MỚI</h2>
                    <p className="text-gray-600">Tiết kiệm 30% - Chỉ còn 250.000đ</p>
                    <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-all duration-300">
                        Mua ngay
                    </button>
                </div>
                <div className="bg-pink-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-600">GIẢM 50% TOÀN MẶT HÀNG ĐỒ ĂN</h2>
                    <p className="text-gray-600">Áp dụng từ ngày 15/06 - 30/06/2025</p>
                    <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300">
                        Mua ngay
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ComboOffers;