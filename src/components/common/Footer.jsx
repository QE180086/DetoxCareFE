import { Link } from 'react-router-dom';
import { FaLeaf, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-100 to-emerald-200 text-green-900 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <h3 className="text-3xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <FaLeaf className="text-green-600" />
              DetoxCare
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              DetoxCare giúp bạn thanh lọc cơ thể, cải thiện sức khỏe và duy trì lối sống lành mạnh thông qua các sản phẩm và phương pháp detox tự nhiên, an toàn.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/about', label: 'Giới thiệu' },
                { to: '/contact', label: 'Liên hệ' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-green-600 hover:underline transition duration-200 ease-in-out"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-gray-600 text-sm mb-6">
              <li>
                <a
                  href="mailto:detoxcare.qn@gmail.com"
                  className="hover:text-green-600 hover:underline transition duration-200 ease-in-out"
                >
                  Email: detoxcare.qn@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+84379560889"
                  className="hover:text-green-600 hover:underline transition duration-200 ease-in-out"
                >
                  Điện thoại: +84 379 560 889
                </a>
              </li>
              <li>
                <span>Địa chỉ: Quy Nhơn, Bình Định</span>
              </li>
            </ul>
            {/* Google Map */}
            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247992.53885729308!2d109.06289033273319!3d13.785900662971352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6c65736eabd9%3A0xd362348e5af3d559!2zUXV5IE5oxqFuLCBCw6xuaCDEkOG7i25oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1746858415560!5m2!1svi!2s"
                height="150"
                style={{ border: 0, borderRadius: '8px', width: '100%' }}
                allowFullScreen=""
                loading="lazy"
                title="DetoxCare Location"
              ></iframe>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4">
              {[
                {
                  href: 'https://www.facebook.com/van.thuong.654838',
                  icon: <FaFacebookF className="w-6 h-6" />,
                },
            
                {
                  href: 'https://www.instagram.com/vt.patu/',
                  icon: <FaInstagram className="w-6 h-6" />,
                },
              ].map(({ href, icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transform hover:scale-110 transition duration-200 ease-in-out"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-green-300 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} DetoxCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}