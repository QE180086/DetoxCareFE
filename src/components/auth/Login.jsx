import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../state/Authentication/Action';
import { AiOutlineUser, AiOutlineLock, AiOutlineMail } from 'react-icons/ai';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            console.log('Đăng nhập thành công, kiểm tra localStorage để xác nhận jwt');
        } catch (err) {
            setLoadingLogin(false);
            const errorMessage = authState.error?.message?.messageDetail || 'Sai tài khoản hoặc mật khẩu!';
            setError(errorMessage);
            console.error('Lỗi trong handleSubmit:', { err, authStateError: authState.error });
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="flex w-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                {/* Login form */}
                <div className="w-full p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <AiOutlineUser className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng trở lại 👋</h2>
                        <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-700 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Tài khoản/Email
                            </label>
                            <div className="relative">
                                <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                                             focus:ring-2 focus:ring-green-500 focus:border-green-500 
                                             transition-all duration-200 text-gray-800 bg-gray-50 
                                             hover:bg-white focus:bg-white"
                                    placeholder="Nhập tài khoản hoặc email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                                             focus:ring-2 focus:ring-green-500 focus:border-green-500 
                                             transition-all duration-200 text-gray-800 bg-gray-50 
                                             hover:bg-white focus:bg-white"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingLogin}
                            className={`w-full py-3 rounded-xl font-semibold text-white 
                                      transition-all duration-300 transform hover:scale-105 
                                      shadow-lg hover:shadow-xl ${
                                loadingLogin 
                                  ? 'bg-gray-400 cursor-not-allowed scale-100' 
                                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                              }`}
                        >
                            {loadingLogin ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </form>

                    {/* Navigation links */}
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-end items-center text-sm">
                            <Link
                                to="/send-otp"
                                className="text-green-600 hover:text-green-700 font-medium hover:underline"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <p className="text-center text-sm text-gray-600">
                            Bạn chưa có tài khoản?{' '}
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