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
        registerData: { role: 'USER' }, // Default role
        navigate
      }));
      
      setLoading(false);
      setSuccess('Xác thực thành công! Đang chuyển hướng...');
      
      // Navigate after success
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
        // Clear previous OTP
        setOtp(['', '', '', '', '', '']);
        // Focus first input
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="flex w-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Verify OTP form */}
        <div className="w-full p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <AiOutlineLock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Xác thực OTP</h2>
            <p className="text-gray-600">
              Mã xác thực đã được gửi đến<br />
              <span className="font-semibold text-green-600">{email}</span>
            </p>
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

          {/* Resend message */}
          {resendMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700 text-center">{resendMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                Nhập mã OTP (6 số)
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-bold border border-gray-300 
                             rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                    maxLength="1"
                  />
                ))}
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
                  Đang xác thực...
                </div>
              ) : (
                'Xác thực OTP'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className={`flex items-center justify-center space-x-2 mx-auto px-4 py-2 
                          rounded-lg font-medium transition-all duration-200 ${
                  resendLoading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <AiOutlineReload className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                <span>{resendLoading ? 'Đang gửi...' : 'Gửi lại mã OTP'}</span>
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Gửi lại mã sau: <span className="font-semibold text-green-600">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Navigation links */}
          <div className="mt-8 space-y-4">
            <Link
              to={`/register`}
              className="flex items-center justify-center space-x-2 text-gray-600 
                       hover:text-green-600 transition-colors duration-200 font-medium"
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng ký</span>
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