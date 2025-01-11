import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const showToast = (type, message) => {
  const { t } = useTranslation();
  
  switch (type) {
    case 'success':
      toast.success(t(message));
      break;
    case 'error':
      toast.error(t(message));
      break;
    default:
      toast(t(message));
  }
}; 