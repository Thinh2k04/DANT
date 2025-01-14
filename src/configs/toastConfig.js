export const toastConfig = {
  position: "top-right",
  autoClose: 500,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: "light",
  style: {
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    padding: '12px 24px'
  }
};

export const successConfig = {
  position: "top-right",
  autoClose: 500,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  theme: "light",
  style: {
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    padding: '12px 24px',
    background: '#10B981',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
};

export const errorConfig = {
  position: "top-right",
  autoClose: 500,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  theme: "light",
  style: {
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    padding: '12px 24px',
    background: '#EF4444',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
};

export const warningConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#ff9800',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
};

export const infoConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#2196f3',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
}; 