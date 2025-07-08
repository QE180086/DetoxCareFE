import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resendOtp, verifyOtp } from '../../state/Authentication/Action';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [registerData, setRegisterData] = useState(null);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.confirmPassword || !form.email) {
      return setError('Vui lòng điền đầy đủ thông tin!');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Mật khẩu không khớp!');
    }

    setLoading(true);
    try {
      const reqData = {
        userData: {
          username: form.username,
          password: form.password,
          email: form.email,
        },
        navigate,
      };
      const result = await dispatch(registerUser(reqData));
      setRegisterData(result.registerData);
      setLoading(false);
      setShowOtpModal(true);
    } catch (err) {
      setLoading(false);
      console.log("loi :" + authState.error)
      setError(authState.error || 'Đăng ký thất bại! Vui lòng thử lại.');
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setResendMessage('');
    try {
      const result = await dispatch(resendOtp(form.email));
      setResendMessage(result.message); // Hiển thị thông báo thành công
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const errorMessage =
        typeof authState.error === 'object'
          ? authState.error.messageDetail || authState.error.message || 'Gửi lại OTP thất bại!'
          : authState.error || 'Gửi lại OTP thất bại!';
      setError(errorMessage);
      console.error('Lỗi trong handleResendOtp:', { err, authStateError: authState.error }); // Debug
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(
        verifyOtp({
          email: form.email,
          otp,
          registerData,
          navigate,
        })
      );
      setShowOtpModal(false);
      setLoading(false);
      setError('');
    } catch (err) {
      setLoading(false);
      setError(authState.error || 'Mã OTP không đúng!');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
        <div className="flex w-[850px] rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Left image */}
          <div className="w-1/2 hidden md:block">
            <img
              src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/482328756_1188534186262618_1234921397253898750_n.jpg?stp=dst-jpg_p600x600_tt6&_nc_cat=111&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGA0YXJXX4pAAi5r5G4wOhLlr3W-Wv0fYSWvdb5a_R9hLa3OqkfIegorgzDdJt6wWVFa2VJnt00C0uWWQ0h-Znj&_nc_ohc=hMzu8FgATaEQ7kNvwGfpo6A&_nc_oc=Adlkk2vxX-15BKr5nX6liE7vykAZRZa-KAqmNOSCaCpJDiQvgugZLXPtEG4FLgPcVvjef1oHXcrukKAOgiKyt1nk&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=UJppXayVJ4w--iqMssqQ8Q&oh=00_AfJ9OyGOXhTB0PUIKTFagzZMgCxUbl29o8uRG9UKsLs51Q&oe=6822A4C6"
              alt="Register Illustration"
              className="w-full h-full object-cover object-center rounded-l-2xl"
            />
          </div>

          {/* Right form */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Tạo tài khoản mới</h2>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-md">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder="Nhập tài khoản"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {loading ? 'Loading...' : 'Đăng ký'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal OTP */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">Xác minh mã OTP</h3>

            {resendMessage && (
              <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded-md">{resendMessage}</div>
            )}
            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-md">{error}</div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {loading ? 'Đang gửi...' : 'Gửi lại OTP'}
                </button>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                  >
                    {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}