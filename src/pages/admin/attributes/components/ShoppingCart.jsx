import React from 'react';
import { FiShoppingCart, FiUser, FiTrash2, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShoppingCart = ({ 
  cart, 
  customerInfo, 
  setCustomerInfo, 
  updateQuantity, 
  removeFromCart, 
  calculateTotal, 
  handleCheckout, 
  loading,
  checkCustomerInfo 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-fit sticky top-8">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b">
        <FiShoppingCart className="text-2xl text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
      </div>

      <CustomerInfo 
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        checkCustomerInfo={checkCustomerInfo}
      />

      <CartItems 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <CheckoutSection 
        cart={cart}
        calculateTotal={calculateTotal}
        handleCheckout={handleCheckout}
        loading={loading}
      />
    </div>
  );
};

const CustomerInfo = ({ customerInfo, setCustomerInfo, checkCustomerInfo }) => {
  const handlePhoneChange = async (e) => {
    const phoneNumber = e.target.value;
    setCustomerInfo(prev => ({...prev, soDienThoai: phoneNumber}));
    
    // Kiểm tra khi đủ 10 số
    if (phoneNumber.length === 10) {
      try {
        const response = await axios.get(`http://localhost:8080/rest/tttk/timSDT/${phoneNumber}`);
        if (response.data) {
          // Nếu tìm thấy thông tin khách hàng, tự động điền
          setCustomerInfo({
            soDienThoai: phoneNumber,
            hoten: response.data.hoten || '',
            email: response.data.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching customer info:', error);
        toast.error('Lỗi khi tìm thông tin khách hàng');
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FiUser className="text-xl text-blue-500" />
        <h3 className="font-semibold text-lg text-gray-800">Thông tin khách hàng</h3>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={customerInfo.soDienThoai}
            onChange={handlePhoneChange}
            maxLength={10}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          />
        </div>
        <input
          type="text"
          placeholder="Họ tên khách hàng"
          value={customerInfo.hoten}
          onChange={(e) => setCustomerInfo(prev => ({...prev, hoten: e.target.value}))}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />
        <input
          type="email"
          placeholder="Email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />
      </div>
    </div>
  );
};

const CartItems = ({ cart, updateQuantity, removeFromCart }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {cart.map(item => (
        <div key={item.id} 
          className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.tenSanPhamChiTiet}</h3>
            <p className="text-blue-600 font-bold">{item.donGia.toLocaleString()}₫</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max={item.soLuong}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, e.target.value)}
              className="w-20 px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CheckoutSection = ({ cart, calculateTotal, handleCheckout, loading }) => {
  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
        <span className="text-3xl font-bold text-blue-600">{calculateTotal().toLocaleString()}₫</span>
      </div>
      <button 
        onClick={handleCheckout}
        disabled={cart.length === 0 || loading}
        className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3
          ${cart.length === 0 || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 transform hover:-translate-y-1'}`}
      >
        <FiCreditCard size={20} />
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </button>
    </div>
  );
};

export default ShoppingCart; 