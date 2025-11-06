import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../state/Authentication/Action';
import { AiOutlineUser, AiOutlineLock, AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loadingLogin, setLoadingLogin] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            return setError('Vui lòng điền đầy đủ tài khoản và mật khẩu!');
        }

        setLoadingLogin(true);
        setError('');
        try {
            const reqData = {
                userData: { username, password },
                navigate,
            };
            console.log('Gửi yêu cầu đăng nhập:', reqData);
            await dispatch(loginUser(reqData));
            setLoadingLogin(false);
            console.log('Đăng nhập thành công, chuyển hướng đến trang chờ');
            navigate("/login/redirect");
        } catch (err) {
            setLoadingLogin(false);
            const errorMessage = authState.error?.message?.messageDetail || 'Sai tài khoản hoặc mật khẩu!';
            setError(errorMessage);
            console.error('Lỗi trong handleSubmit:', { err, authStateError: authState.error });
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
                                <AiOutlineUser className="w-6 h-6 text-black" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-black mb-1">Đăng Nhập</h1>
                        <p className="text-gray-500">Chào mừng bạn quay trở lại</p>
                    </div>
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-black mb-2">
                                Tài khoản
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AiOutlineMail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                                             focus:border-green-400 focus:ring-0 outline-none
                                             transition-all duration-200 text-black placeholder-gray-400
                                             hover:border-gray-300"
                                    placeholder="Email hoặc tên đăng nhập"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AiOutlineLock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl 
                                             focus:border-green-400 focus:ring-0 outline-none
                                             transition-all duration-200 text-black placeholder-gray-400
                                             hover:border-gray-300"
                                    placeholder="Nhập mật khẩu của bạn"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible className="w-5 h-5" />
                                    ) : (
                                        <AiOutlineEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                to="/send-otp"
                                className="text-sm font-medium text-green-400 hover:text-green-500 transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loadingLogin}
                            className={`w-full py-4 rounded-xl font-bold text-lg
                                      transition-all duration-200 shadow-lg
                                      ${loadingLogin
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-400 text-black hover:bg-green-500 hover:shadow-xl active:scale-95'
                                }`}
                        >
                            {loadingLogin ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent"></div>
                                    <span>Đang xử lý...</span>
                                </div>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="px-4 text-sm text-gray-400 font-medium">HOẶC</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Google Login Button */}
                    <a
                        href="https://dextox-f9ajbedgghgvf7an.malaysiawest-01.azurewebsites.net/oauth2/authorization/google"
                        className="w-full py-4 rounded-xl font-semibold text-black
                                 bg-white border-2 border-gray-200
                                 hover:border-gray-300 hover:shadow-md
                                 transition-all duration-200 flex items-center justify-center gap-3
                                 active:scale-95"
                    >
                        <FaGoogle className="w-5 h-5 text-gray-700" />
                        <span>Tiếp tục với Google</span>
                    </a>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Chưa có tài khoản?{' '}
                            <Link 
                                to="/register" 
                                className="text-green-400 hover:text-green-500 font-semibold transition-colors"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}