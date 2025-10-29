import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../../state/Authentication/Action';

export default function LoginRedirect() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        // Check if we have accessToken in Redux store or sessionStorage
        const accessToken = authState.accessToken || sessionStorage.getItem("accessToken");
        
        if (accessToken) {
            // Dispatch setAccessToken to ensure Redux store is updated
            dispatch(setAccessToken(accessToken));
            
            // Add a small delay to show the success screen before redirecting
            const timer = setTimeout(() => {
                // Always navigate to home page, ignoring role
                navigate("/");
            }, 1500); // 1.5 second delay for better UX
            
            return () => clearTimeout(timer);
        } else {
            // If no token found, redirect to login
            navigate("/login");
        }
    }, [authState.accessToken, dispatch, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Loading Spinner */}
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                </div>
                
                {/* Success Text */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Đăng nhập thành công</h2>
                    <p className="text-gray-600">Bạn sẽ được chuyển hướng trong giây lát...</p>
                </div>
            </div>
        </div>
    );
}