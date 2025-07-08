const HeroSection = () => {
  return (
    <section className="relative py-16 bg-green-100 flex items-center justify-between px-8">
      <div className="w-1/2 text-center md:text-left pr-4">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800">DETOX SẠCH - SỐNG KHỎE</h1>
        <p className="mt-4 text-lg text-green-700">Giải pháp thanh lọc cơ thể từ thiên nhiên</p>
        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all duration-300">
          Khám phá ngay
        </button>
      </div>
      <div className="w-1/2 pl-4">
        <img
          src="https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/2/19/nuoc-ep-1645160589089738869548-1645271764683-1645271764899367046748.jpg"
          alt="Detox Juice"
          className="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;