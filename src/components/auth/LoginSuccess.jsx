import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { loginGoogle, setAccessToken } from '../../state/Authentication/Action';

export default function LoginSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Extract token from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            // Dispatch loginGoogle với token
            console.log("Token from URL:", token);
            sessionStorage.setItem("accessToken", token);
            // Also dispatch setAccessToken to update Redux store immediately
            dispatch(setAccessToken(token));
            
            // Handle Google login and navigation
            dispatch(loginGoogle(token)).then((userData) => {
                // Log the user data to see its structure
                console.log("User data from loginGoogle:", userData);
                
                // Dispatch a custom event to notify other components that Google login is complete
                console.log("Dispatching googleLoginComplete event"); // Debug log
                window.dispatchEvent(new CustomEvent('googleLoginComplete'));
                
                // Navigate to the shared LoginRedirect component instead of handling redirect here
                navigate("/login/redirect");
            }).catch((error) => {
                console.error("Google login failed:", error);
                navigate("/login");
            });
        } else {
            console.error("No token found in URL");
            navigate("/login");
        }
    }, [location, dispatch, navigate]);

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