import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const successToast = (message) => {
  toast.success(
    <div className="flex items-center">
      <FiCheck className="mr-2 h-5 w-5" />
      <span>{message}</span>
    </div>,
    toastConfig
  );
};

export const errorToast = (message) => {
  toast.error(
    <div className="flex items-center">
      <FiX className="mr-2 h-5 w-5" />
      <span>{message}</span>
    </div>,
    toastConfig
  );
};

export const warningToast = (message) => {
  toast.warning(
    <div className="flex items-center">
      <FiAlertCircle className="mr-2 h-5 w-5" />
      <span>{message}</span>
    </div>,
    toastConfig
  );
}; 