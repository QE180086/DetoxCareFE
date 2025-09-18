import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../state/Authentication/Action';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
      
      // Navigate to VerifyOTP page with email parameter
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setLoading(false);
      console.log("loi :" + authState.error)
      setError(authState.error || 'Đăng ký thất bại! Vui lòng thử lại.');
    }
  };



  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="flex w-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Register form */}
          <div className="w-full p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <AiOutlineUser className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h2>
              <p className="text-gray-600">Đăng ký để trải nghiệm dịch vụ detox</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
                <div className="relative">
                  <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-green-500 focus:border-green-500 
                             transition-all duration-200 text-gray-800 bg-gray-50 
                             hover:bg-white focus:bg-white"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-green-500 focus:border-green-500 
                             transition-all duration-200 text-gray-800 bg-gray-50 
                             hover:bg-white focus:bg-white"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-green-500 focus:border-green-500 
                             transition-all duration-200 text-gray-800 bg-gray-50 
                             hover:bg-white focus:bg-white"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-green-500 focus:border-green-500 
                             transition-all duration-200 text-gray-800 bg-gray-50 
                             hover:bg-white focus:bg-white"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white 
                          transition-all duration-300 transform hover:scale-105 
                          shadow-lg hover:shadow-xl ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed scale-100' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang đăng ký...
                  </div>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </form>

            {/* Navigation links */}
            <div className="mt-8">
              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}