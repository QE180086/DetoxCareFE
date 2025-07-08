import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, forgetPassword, resetPassword } from '../../state/Authentication/Action';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [errorSendOTP, setErrorSendOTP] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showPlacePassword, setShowPlacePassword] = useState(false);


    const [resetEmail, setResetEmail] = useState('');
    const [resetUsername, setResetUsername] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resetMessage, setResetMessage] = useState('');
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

    const handleSendResetOtp = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            return setErrorSendOTP('Vui lòng nhập email!');
        }
        if (!resetUsername) {
            return setErrorSendOTP('Vui lòng nhập tên đăng nhập!');
        }

        setLoading(true);
        setError('');
        setResetMessage('');
        try {
            console.log("api start -------------")
            const result = await dispatch(forgetPassword({ email: resetEmail, username: resetUsername }));
            console.log("api success")
            setLoading(false);
            if (result?.error) {
                setErrorSendOTP(result?.error)
            } else {
                setShowResetModal(false);
                setShowPlacePassword(true)
                setErrorSendOTP('')
            }


        } catch (err) {
            setLoading(false);
            const errorMessage = 'Gửi  OTP thất bại!';
            setErrorSendOTP(errorMessage);
            console.error('Lỗi trong handleSendResetOtp:', { err, authStateError: authState.error });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!resetOtp || !newPassword || !confirmNewPassword) {
            return setErrorSendOTP('Vui lòng điền đầy đủ thông tin!');
        }
        if (newPassword !== confirmNewPassword) {
            return setErrorSendOTP('Mật khẩu mới không khớp!');
        }

        setLoading(true);
        setErrorSendOTP('');
        setResetMessage('');
        try {
            const result = await dispatch(
                resetPassword({
                    email: resetEmail,
                    otp: resetOtp,
                    newPassword,
                })
            );
            if (result?.error) {
                setErrorSendOTP(result?.error)
            } else {
                setShowModal(false)
                setShowPlacePassword(false)
                setErrorSendOTP('')
                setLoading(false);
            }
            setTimeout(() => {
                setShowModal(false)
                setShowPlacePassword(false)
                setResetEmail('');
                setResetUsername('');
                setResetOtp('');
                setNewPassword('');
                setConfirmNewPassword('');
                setResetMessage('');
            }, 2000);
        
        } catch (err) {
            setLoading(false);
            console.log("ten loi: "+ authState?.message)
            const errorMessage = authState?.message || 'Đặt lại mật khẩu thất bại!'
            setErrorSendOTP(errorMessage);
            console.error('Lỗi trong handleResetPassword:', { err, authStateError: authState.error });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="flex w-[850px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                {/* Image section */}
                <div className="w-1/2 hidden md:block">
                    <img
                        src="https://gaming.vn/wp-content/uploads/2024/02/anh-ly-mo-uyen-4k.jpg"
                        alt="Login Illustration"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Login form */}
                <div className="w-full md:w-1/2 p-10">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Chào mừng trở lại 👋</h2>

                    {error && (
                        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-md">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Tài khoản
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Nhập tài khoản"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingLogin}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${loadingLogin ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loadingLogin ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(true)
                                setShowResetModal(true)
                            }
                            }
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Quên mật khẩu?
                        </button>
                    </p>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        Bạn chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>

            {/* Modal Quên mật khẩu */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            {showModal === 'email' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
                        </h3>

                        {resetMessage && (
                            <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded-md">{resetMessage}</div>
                        )}
                        {errorSendOTP && (
                            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-md">{errorSendOTP}</div>
                        )}

                        {showResetModal && (
                            <form onSubmit={handleSendResetOtp} className="space-y-4">
                                <div>
                                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="resetEmail"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nhập email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="resetUsername" className="block text-sm font-medium text-gray-700">
                                        Tên đăng nhập
                                    </label>
                                    <input
                                        id="resetUsername"
                                        type="text"
                                        value={resetUsername}
                                        onChange={(e) => setResetUsername(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nhập tên đăng nhập"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {loading ? 'Đang gửi...' : 'Gửi OTP'}
                                    </button>
                                </div>
                            </form>
                        )}
                        {showPlacePassword &&
                            (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <label htmlFor="resetOtp" className="block text-sm font-medium text-gray-700">
                                            Mã OTP
                                        </label>
                                        <input
                                            id="resetOtp"
                                            type="text"
                                            value={resetOtp}
                                            onChange={(e) => setResetOtp(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Nhập mã OTP"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            id="confirmNewPassword"
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false)
                                                setShowPlacePassword(false)
                                            }}
                                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                        >
                                            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                                        </button>
                                    </div>
                                </form>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}