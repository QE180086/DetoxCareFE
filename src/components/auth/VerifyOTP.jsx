import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../../state/Authentication/Action';
import { AiOutlineLock, AiOutlineArrowLeft, AiOutlineReload } from 'react-icons/ai';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
      setOtp(newOtp);
      
      // Focus last filled input or next empty input
      const nextIndex = Math.min(pastedData.length, 5);
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      return setError('Vui lòng nhập đầy đủ 6 số OTP!');
    }

    if (!email) {
      return setError('Email không hợp lệ! Vui lòng quay lại trang gửi OTP.');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await dispatch(verifyOtp({
        email,
        otp: otpValue,
        registerData: { role: 'USER' },
        navigate
      }));
      
      setLoading(false);
      setSuccess('Xác thực thành công! Đang chuyển hướng...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setLoading(false);
      const errorMessage = authState.error || 'Mã OTP không đúng! Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Lỗi trong handleSubmit:', err);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;

    setResendLoading(true);
    setError('');
    setResendMessage('');

    try {
      const result = await dispatch(resendOtp(email));
      setResendLoading(false);
      
      if (result.success) {
        setResendMessage('Mã OTP mới đã được gửi!');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } catch (err) {
      setResendLoading(false);
      const errorMessage = authState.error || 'Gửi lại OTP thất bại!';
      setError(errorMessage);
      console.error('Lỗi trong handleResendOtp:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo/Brand Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4 shadow-lg">
              <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                <AiOutlineLock className="w-6 h-6 text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black mb-1">Xác Thực OTP</h1>
            <p className="text-gray-500">
              Mã xác thực đã được gửi đến
            </p>
            <p className="text-green-400 font-semibold mt-1">{email}</p>
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

          {/* Resend message */}
          {resendMessage && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-sm text-blue-700">{resendMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-black mb-4 text-center">
                Nhập mã OTP (6 số)
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 
                             rounded-xl focus:border-green-400 focus:ring-0 outline-none
                             transition-all duration-200 text-black hover:border-gray-300"
                    maxLength="1"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg
                        transition-all duration-200 shadow-lg
                        ${loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-400 text-black hover:bg-green-500 hover:shadow-xl active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent"></div>
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                'Xác Thực OTP'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 
                          rounded-xl font-medium transition-all duration-200 ${
                  resendLoading
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'text-green-400 hover:text-green-500 hover:bg-green-50'
                }`}
              >
                <AiOutlineReload className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                <span>{resendLoading ? 'Đang gửi...' : 'Gửi lại mã OTP'}</span>
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Gửi lại mã sau: <span className="font-semibold text-green-400">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Navigation links */}
          <div className="mt-8 space-y-3">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 text-gray-500 
                       hover:text-black transition-colors duration-200 font-medium"
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng ký</span>
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