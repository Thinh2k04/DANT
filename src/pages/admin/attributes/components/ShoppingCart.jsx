import React, { useState } from 'react';
import { FiShoppingCart, FiUser, FiTrash2, FiCreditCard, FiMapPin, FiTag } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

// Add validation functions
const validatePhone = (phone) => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  if (!email) return true; // Email có thể để trống
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ShoppingCart = ({ 
  cart, 
  customerInfo, 
  setCustomerInfo, 
  updateQuantity, 
  removeFromCart, 
  calculateTotal, 
  handleCheckout, 
  loading,
  checkCustomerInfo,
  stores,
  selectedStore,
  setSelectedStore,
  voucherCode,
  setVoucherCode,
  checkVoucher,
  voucherInfo
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <FiShoppingCart className="text-lg" />
          <h2 className="font-semibold">Thông tin đơn hàng</h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Customer Info Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <FiUser className="text-base text-blue-500" />
            <h3 className="font-medium text-gray-800">Thông tin khách hàng</h3>
          </div>
          <CustomerInfo 
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            checkCustomerInfo={checkCustomerInfo}
          />
        </section>

        {/* Store Selection */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <FiMapPin className="text-base text-blue-500" />
            <h3 className="font-medium text-gray-800">Cửa hàng</h3>
          </div>
          <StoreSelector 
            stores={stores}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
          />
        </section>

        {/* Cart Items */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FiShoppingCart className="text-base text-blue-500" />
              <h3 className="font-medium text-gray-800">Giỏ hàng</h3>
            </div>
            <span className="text-xs text-gray-500">{cart.length} sản phẩm</span>
          </div>
          <CartItems 
            cart={cart}
            removeFromCart={removeFromCart}
          />
        </section>

        {/* Voucher Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <FiTag className="text-base text-blue-500" />
            <h3 className="font-medium text-gray-800">Mã giảm giá</h3>
          </div>
          <VoucherInput 
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            checkVoucher={checkVoucher}
            voucherInfo={voucherInfo}
          />
        </section>
      </div>

      {/* Checkout Section - Sticky Bottom */}
      <div className="border-t bg-white sticky bottom-0 p-4">
        <CheckoutSection 
          cart={cart}
          calculateTotal={calculateTotal}
          handleCheckout={handleCheckout}
          loading={loading}
          voucherInfo={voucherInfo}
          customerInfo={customerInfo}
          selectedStore={selectedStore}
        />
      </div>
    </div>
  );
};

const CustomerInfo = ({ customerInfo, setCustomerInfo, checkCustomerInfo }) => {
  const [errors, setErrors] = useState({
    soDienThoai: '',
    hoten: '',
    email: ''
  });

  const handlePhoneChange = async (e) => {
    const phoneNumber = e.target.value;
    setCustomerInfo(prev => ({...prev, soDienThoai: phoneNumber}));
    
    if (!phoneNumber) {
      setErrors(prev => ({...prev, soDienThoai: 'Số điện thoại là bắt buộc'}));
    } else if (!validatePhone(phoneNumber)) {
      setErrors(prev => ({...prev, soDienThoai: 'Số điện thoại không hợp lệ'}));
    } else {
      setErrors(prev => ({...prev, soDienThoai: ''}));
      if (phoneNumber.length === 10) {
        await checkCustomerInfo(phoneNumber);
      }
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setCustomerInfo(prev => ({...prev, hoten: name}));
    
    if (!name.trim()) {
      setErrors(prev => ({...prev, hoten: 'Họ tên là bắt buộc'}));
    } else if (name.trim().length < 2) {
      setErrors(prev => ({...prev, hoten: 'Họ tên phải có ít nhất 2 ký tự'}));
    } else {
      setErrors(prev => ({...prev, hoten: ''}));
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCustomerInfo(prev => ({...prev, email: email}));
    
    if (email && !validateEmail(email)) {
      setErrors(prev => ({...prev, email: 'Email không hợp lệ'}));
    } else {
      setErrors(prev => ({...prev, email: ''}));
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <input
          type="tel"
          placeholder="Số điện thoại"
          value={customerInfo.soDienThoai}
          onChange={handlePhoneChange}
          maxLength={10}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-400
            ${errors.soDienThoai ? 'border-red-500' : ''}`}
        />
        {errors.soDienThoai && (
          <p className="text-red-500 text-xs mt-1">{errors.soDienThoai}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Họ tên khách hàng"
          value={customerInfo.hoten}
          onChange={handleNameChange}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-400
            ${errors.hoten ? 'border-red-500' : ''}`}
        />
        {errors.hoten && (
          <p className="text-red-500 text-xs mt-1">{errors.hoten}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={customerInfo.email}
          onChange={handleEmailChange}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-400
            ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
    </div>
  );
};

const CartItems = ({ cart, removeFromCart }) => {
  if (cart.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <FiShoppingCart className="mx-auto text-3xl mb-2" />
        <p className="text-sm">Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 -mr-2">
      {cart.map(item => (
        <div key={item.id} className="bg-gray-50 rounded-lg hover:bg-gray-100">
          <div className="flex items-center gap-3 p-2">
            <img 
              src={item.hinhAnhMinhHoa || '/placeholder.png'} 
              alt={item.tenSanPhamChiTiet}
              className="w-14 h-14 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-800 truncate">
                {item.tenSanPhamChiTiet}
              </h4>
              <p className="text-blue-600 font-semibold text-sm mt-0.5">
                {item.donGia.toLocaleString()}₫ × {item.quantity}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
          
          <div className="px-2 pb-2">
            <div className="text-xs text-gray-500 space-y-1">
              {item.selectedIMEIs.map((imei, index) => (
                <div key={imei.id} className="flex items-center">
                  <span className="w-5 text-center">{index + 1}.</span>
                  <span className="font-mono">{imei.imei}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StoreSelector = ({ stores, selectedStore, setSelectedStore }) => {
  return (
    <select
      value={selectedStore?.id || ''}
      onChange={(e) => setSelectedStore(stores.find(s => s.id === parseInt(e.target.value)))}
      className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-400"
    >
      <option value="">Chọn cửa hàng</option>
      {stores.map(store => (
        <option key={store.id} value={store.id}>
          {store.soNha}, {store.phuong}, {store.huyen}, {store.tinh}
        </option>
      ))}
    </select>
  );
};

const VoucherInput = ({ voucherCode, setVoucherCode, checkVoucher, voucherInfo }) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={() => checkVoucher(voucherCode)}
          className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 min-w-[80px]"
        >
          Áp dụng
        </button>
      </div>
      {voucherInfo && (
        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-2 rounded-lg text-xs">
          <FiTag size={12} />
          <span>
            Giảm {voucherInfo.phanTramApDung 
              ? `${voucherInfo.phanTramApDung}%` 
              : `${voucherInfo.soTienApDung.toLocaleString()}₫`}
          </span>
        </div>
      )}
    </div>
  );
};

const CheckoutSection = ({ cart, calculateTotal, handleCheckout, loading, voucherInfo, customerInfo, selectedStore }) => {
  const validateCheckout = () => {
    if (cart.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return false;
    }

    if (!selectedStore) {
      toast.error('Vui lòng chọn cửa hàng');
      return false;
    }

    if (!customerInfo.soDienThoai || !validatePhone(customerInfo.soDienThoai)) {
      toast.error('Số điện thoại không hợp lệ');
      return false;
    }

    if (!customerInfo.hoten || customerInfo.hoten.trim().length < 2) {
      toast.error('Họ tên không hợp lệ');
      return false;
    }

    if (customerInfo.email && !validateEmail(customerInfo.email)) {
      toast.error('Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handleCheckoutClick = () => {
    if (validateCheckout()) {
      handleCheckout();
    }
  };

  const subtotal = calculateTotal();
  const discount = voucherInfo 
    ? (voucherInfo.phanTramApDung 
      ? (subtotal * voucherInfo.phanTramApDung / 100) 
      : voucherInfo.soTienApDung)
    : 0;
  const total = subtotal - discount;

  return (
    <div className="space-y-3 pt-3 border-t">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString()}₫</span>
        </div>
        {voucherInfo && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá:</span>
            <span>-{discount.toLocaleString()}₫</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-gray-800 pt-1.5 border-t">
          <span>Tổng cộng:</span>
          <span className="text-blue-600 text-base">{total.toLocaleString()}₫</span>
        </div>
      </div>

      <button 
        onClick={handleCheckoutClick}
        disabled={cart.length === 0 || loading}
        className={`w-full py-2.5 rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2
          ${cart.length === 0 || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        <FiCreditCard size={16} />
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </button>
    </div>
  );
};

export default ShoppingCart; 