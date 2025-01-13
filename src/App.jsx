import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentSuccess from './components/GioHangComponenst/PaymentSuccess';

// Trong phần routes
<Route path="/payment-success" element={<PaymentSuccess />} /> 

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        limit={3}
        theme="colored"
      />
      {/* Rest of your app */}
    </>
  );
} 