import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { loginGoogle } from '../../state/Authentication/Action';

export default function LoginSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        // Extract token from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            // Dispatch loginGoogle với token và navigate
            dispatch(loginGoogle(token));
            navigate("/");
        } else {
            console.error("No token found in URL");
            navigate("/login");
        }
    }, [location, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="flex w-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="w-full p-10 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <AiOutlineCheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập thành công</h2>
                        <p className="text-gray-600">Bạn sẽ được chuyển hướng trong giây lát...</p>
                    </div>

                    {/* Loading Spinner */}
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}