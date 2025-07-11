import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaLeaf } from 'react-icons/fa';

const Notification = ({ isOpen, type = 'info', message, onClose, action }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: FaCheckCircle, color: 'text-green-600 bg-green-100' };
      case 'error':
        return { icon: FaExclamationCircle, color: 'text-red-600 bg-red-100' };
      case 'info':
      default:
        return { icon: FaInfoCircle, color: 'text-blue-600 bg-blue-100' };
    }
  };

  const { icon: Icon, color } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full ${color}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-green-800 font-semibold flex items-center gap-2">
              <FaLeaf className="text-green-600" />
              DetoxCare Thông Báo
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-start gap-4 mt-2">
            <Icon className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-800 text-sm sm:text-base">{message}</p>
              {action && (
                <div className="mt-4 flex justify-end gap-3">
                  {action.map(({ label, onClick, type: btnType = 'button' }, index) => (
                    <button
                      key={index}
                      type={btnType}
                      onClick={onClick}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        btnType === 'submit' || btnType === 'button'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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