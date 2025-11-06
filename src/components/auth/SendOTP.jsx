import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resendOtp } from '../../state/Authentication/Action';
import { AiOutlineMail, AiOutlineArrowLeft } from 'react-icons/ai';

export default function SendOTP() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return setError('Vui lòng nhập email!');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Email không hợp lệ!');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await dispatch(resendOtp(email));
      setLoading(false);
      
      if (result.success) {
        setSuccess('Mã OTP đã được gửi đến email của bạn!');
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = authState.error || 'Gửi OTP thất bại! Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Lỗi trong handleSubmit:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo/Brand Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4 shadow-lg">
              <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                <AiOutlineMail className="w-6 h-6 text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black mb-1">Quên Mật Khẩu</h1>
            <p className="text-gray-500">Nhập email để nhận mã xác thực</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AiOutlineMail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                           focus:border-green-400 focus:ring-0 outline-none
                           transition-all duration-200 text-black placeholder-gray-400
                           hover:border-gray-300"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg mt-6
                        transition-all duration-200 shadow-lg
                        ${loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-400 text-black hover:bg-green-500 hover:shadow-xl active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent"></div>
                  <span>Đang gửi...</span>
                </div>
              ) : (
                'Gửi Mã OTP'
              )}
            </button>
          </form>

          {/* Navigation links */}
          <div className="mt-8 space-y-3">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-500 
                       hover:text-black transition-colors duration-200 font-medium"
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </Link>
            
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-green-400 hover:text-green-500 font-semibold transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}