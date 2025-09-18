import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaLeaf } from 'react-icons/fa';

const Notification = ({ isOpen, type = 'info', message, onClose, action }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: FaCheckCircle, color: 'text-green-600 bg-green-100', bgGradient: 'bg-gradient-to-br from-white to-green-50' };
      case 'error':
        return { icon: FaExclamationCircle, color: 'text-red-600 bg-red-100', bgGradient: 'bg-gradient-to-br from-white to-red-50' };
      case 'info':
      default:
        return { icon: FaInfoCircle, color: 'text-blue-600 bg-blue-100', bgGradient: 'bg-gradient-to-br from-white to-blue-50' };
    }
  };

  const { icon: Icon, color, bgGradient } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full ${bgGradient} border border-opacity-20 transform transition-all duration-300 scale-100`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-emerald-800 font-bold flex items-center gap-3">
              <FaLeaf className="text-emerald-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">
                DetoxCare Thông Báo
              </span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-100 shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-start gap-5 mt-2">
            <div className={`${color} rounded-full p-3 shadow-lg`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed">{message}</p>
              {action && (
                <div className="mt-6 flex justify-end gap-3">
                  {action.map(({ label, onClick, type: btnType = 'button' }, index) => (
                    <button
                      key={index}
                      type={btnType}
                      onClick={onClick}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                        btnType === 'submit' || btnType === 'button'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:from-gray-400 hover:to-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;