import { FiAlertCircle, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  type = 'delete' // Có thể là: 'delete', 'update', 'close', 'restore'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <FiTrash2 className="h-6 w-6 text-red-600" />;
      case 'update':
        return <FiEdit2 className="h-6 w-6 text-blue-600" />;
      case 'close':
        return <FiX className="h-6 w-6 text-gray-600" />;
      case 'restore':
        return <FiCheck className="h-6 w-6 text-green-600" />;
      default:
        return <FiAlertCircle className="h-6 w-6 text-red-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'delete':
        return {
          bg: 'bg-red-100',
          button: 'bg-red-600 hover:bg-red-700',
          icon: 'text-red-600'
        };
      case 'update':
        return {
          bg: 'bg-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700',
          icon: 'text-blue-600'
        };
      case 'close':
        return {
          bg: 'bg-gray-100',
          button: 'bg-gray-600 hover:bg-gray-700',
          icon: 'text-gray-600'
        };
      case 'restore':
        return {
          bg: 'bg-green-100',
          button: 'bg-green-600 hover:bg-green-700',
          icon: 'text-green-600'
        };
      default:
        return {
          bg: 'bg-red-100',
          button: 'bg-red-600 hover:bg-red-700',
          icon: 'text-red-600'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${colors.bg}`}>
            {getIcon()}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">{title}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${colors.button} text-white text-sm font-medium rounded-md transition-colors duration-200 ease-in-out`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 