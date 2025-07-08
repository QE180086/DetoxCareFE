import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-green-100 to-emerald-200 text-green-900 py-12">
            <div className="container mx-auto max-w-7xl flex justify-center">
                {/* Logo & Description */}
                <div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">DetoxCare</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        DetoxCare giúp bạn thanh lọc cơ thể, cải thiện sức khỏe và duy trì lối sống lành mạnh thông qua các sản phẩm và phương pháp detox tự nhiên, an toàn.
                    </p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Liên kết nhanh</h4>
                    <ul className="space-y-3">
                        {[
                            { to: '/', label: 'Trang chủ' },
                            { to: '/dashboard', label: 'Dashboard' },
                            { to: '/about', label: 'Giới thiệu' },
                            { to: '/contact', label: 'Liên hệ' },
                        ].map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="text-gray-600 hover:text-primary hover:underline transition duration-200 ease-in-out"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Liên hệ</h4>
                    <ul className="space-y-3 text-gray-600 text-sm mb-6">
                        <li>
                            <a
                                href="mailto:notmposophin@gmail.com"
                                className="hover:text-primary hover:underline transition duration-200 ease-in-out"
                            >
                                Email: notmposophin@gmail.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="tel:+1234567890"
                                className="hover:text-primary hover:underline transition duration-200 ease-in-out"
                            >
                                Điện thoại: +84379560889
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
                            style={{ border: 0, borderRadius: '8px' }}
                            allowFullScreen=""
                            loading="lazy"
                            title="BookEasy Location"
                        ></iframe>
                    </div>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Theo dõi chúng tôi</h4>
                    <div className="flex space-x-4">
                        {[
                            {
                                href: 'https://www.facebook.com/van.thuong.654838',
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                ),
                            },
                            {
                                href: 'https://twitter.com',
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.141-5.144-.424.729-.666 1.574-.666 2.475 0 1.708.87 3.214 2.188 4.099-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.621 1.943 2.419 3.355 4.557 3.396-1.669 1.309-3.769 2.089-6.049 2.089-.393 0-.779-.023-1.159-.067 2.154 1.382 4.712 2.188 7.468 2.188 8.958 0 13.863-7.414 13.863-13.863 0-.211-.005-.421-.014-.63.951-.689 1.778-1.548 2.43-2.527z" />
                                    </svg>
                                ),
                            },
                            {
                                href: 'https://www.instagram.com/vt.patu/',
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.453.066-2.895.399-4.118 1.622-1.223 1.223-1.556 2.665-1.622 4.118-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.066 1.453.399 2.895 1.622 4.118 1.223 1.223 2.665 1.556 4.118 1.622 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.453-.066 2.895-.399 4.118-1.622 1.223-1.223 1.556-2.665 1.622-4.118.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.066-1.453-.399-2.895-1.622-4.118-1.223-1.223-2.665-1.556-4.118-1.622-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" />
                                    </svg>
                                ),
                            },
                        ].map(({ href, icon }, index) => (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary transform hover:scale-110 transition duration-200 ease-in-out"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-300 text-center">
                <p className="text-gray-600 text-sm">
                    © {new Date().getFullYear()} DetoxCare. All rights reserved.
                </p>
            </div>
        </footer>
    );
}