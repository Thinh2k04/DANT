import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaMicrochip, FaTrash } from 'react-icons/fa';
import CartImeiModal from './CartImeiModal';

const Cart = ({ cartItems, onCreateOrder, onUpdateCart, onRemoveFromCart }) => {
  const [showImeiModal, setShowImeiModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleImeiSelect = (item) => {
    setSelectedItem(item);
    setShowImeiModal(true);
  };

  const handleImeiConfirm = (imeis) => {
    const updatedItems = cartItems.map(item => 
      item.id === selectedItem.id 
        ? { ...item, imeis: imeis }
        : item
    );
    onUpdateCart(updatedItems);
    setShowImeiModal(false);
    setSelectedItem(null);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.donGia * item.soLuong), 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>
      
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <img 
                src={item.hinhAnhMinhHoa} 
                alt={item.tenSanPham}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{item.tenSanPham}</h3>
                <p className="text-blue-600">{item.donGia?.toLocaleString()}₫</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded">
                <input
                  type="number"
                  value={item.soLuong}
                  min="1"
                  onChange={(e) => onUpdateCart(cartItems.map(cartItem => 
                    cartItem.id === item.id 
                      ? { ...cartItem, soLuong: parseInt(e.target.value) }
                      : cartItem
                  ))}
                  className="w-16 text-center p-1 border-none focus:ring-0"
                />
              </div>

              <div className="flex items-center space-x-2">
                {(!item.imeis || item.imeis.length < item.soLuong) && (
                  <button
                    onClick={() => handleImeiSelect(item)}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Chọn IMEI"
                  >
                    <FaMicrochip className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-lg font-medium">
            <span>Tạm tính:</span>
            <span>{calculateTotal().toLocaleString()}₫</span>
          </div>
          
          <div className="flex justify-between text-xl font-bold text-blue-600">
            <span>Tổng cộng:</span>
            <span>{calculateTotal().toLocaleString()}₫</span>
          </div>

          <button
            onClick={onCreateOrder}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thanh toán
          </button>
        </div>
      )}

      <CartImeiModal
        isOpen={showImeiModal}
        onClose={() => {
          setShowImeiModal(false);
          setSelectedItem(null);
        }}
        product={selectedItem}
        quantity={selectedItem?.soLuong || 0}
        onConfirm={handleImeiConfirm}
      />
    </div>
  );
};

export default Cart; 