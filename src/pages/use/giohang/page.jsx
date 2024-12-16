import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { 
  getCartItems, 
  removeFromCart, 
  updateCartItemQuantity, 
  calculateTotal, 
  processCheckout 
} from '../../../utils/cartUtils';


import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { items, quantities, selectedItems } = getCartItems();
    setCartItems(items);
    setQuantities(quantities);
    setSelectedItems(selectedItems);
  }, []);

  const handleRemoveFromCart = (id) => {
    const result = removeFromCart(id);
    if (result.success) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      setQuantities(prevQuantities => {
        const updatedQuantities = { ...prevQuantities };
        delete updatedQuantities[id];
        return updatedQuantities;
      });
      setSelectedItems(prevSelectedItems => {
        const updatedSelectedItems = { ...prevSelectedItems };
        delete updatedSelectedItems[id];
        return updatedSelectedItems;
      });
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    console.log('hàm + được gọi')
    const result = await updateCartItemQuantity(id, newQuantity);
    if (result.success) {
      setQuantities(prev => ({
        ...prev,
        [id]: newQuantity
      }));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelectedItems = {};
    cartItems.forEach(item => {
      updatedSelectedItems[item.id] = newSelectAll;
    });
    setSelectedItems(updatedSelectedItems);
  };

  const handleCheckout = () => {
    const result = processCheckout(cartItems, selectedItems, quantities);
    if (result.success) {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link 
            to="/home"
            className="mr-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
          >
            ← Quay lại
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition-all hover:scale-105">
            <p className="text-gray-600 text-lg">Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block font-semibold">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAll} 
                className="mr-3 w-5 h-5 rounded-lg"
              />
              <span className="text-lg font-medium">Chọn tất cả ({cartItems.length})</span>
            </div>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-6 hover:bg-gray-50 p-4 rounded-xl transition duration-300">
                  <input 
                    type="checkbox" 
                    checked={selectedItems[item.id] || false} 
                    onChange={() => handleSelectItem(item.id)} 
                    className="mr-4 w-5 h-5 rounded-lg"
                  />
                  <img 
                    src={item.hinhAnhMinhHoa} 
                    alt={item.tenSanPham} 
                    className="w-28 h-28 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 ml-6">
                    <h3 className="font-semibold text-lg">{item.tenSanPhamChiTiet}</h3>
                    <p className="text-red-600 font-bold text-xl mt-2">
                      {parseFloat(item.donGia).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition duration-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.soLuong}
                      value={quantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-20 text-center border rounded-lg p-2"
                    />
                    <button 
                      onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition duration-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="ml-6 text-red-500 hover:text-red-700 transition duration-200"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">Tổng tiền:</span>
                <span className="text-2xl font-bold text-red-600">
                  {calculateTotal(cartItems, selectedItems, quantities).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  onClick={handleCheckout}
                  className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
