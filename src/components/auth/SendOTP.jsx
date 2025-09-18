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
        // Navigate to verify OTP page with email parameter
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="flex w-[450px] rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Send OTP form */}
        <div className="w-full p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <AiOutlineMail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Gửi mã OTP</h2>
            <p className="text-gray-600">Nhập email để nhận mã xác thực</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 text-center">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                           focus:ring-2 focus:ring-green-500 focus:border-green-500 
                           transition-all duration-200 text-gray-800 bg-gray-50 
                           hover:bg-white focus:bg-white"
                  placeholder="example@email.com"
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
                  Đang gửi...
                </div>
              ) : (
                'Gửi mã OTP'
              )}
            </button>
          </form>

          {/* Navigation links */}
          <div className="mt-8 space-y-4">
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 text-gray-600 
                       hover:text-green-600 transition-colors duration-200 font-medium"
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </Link>
            
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}