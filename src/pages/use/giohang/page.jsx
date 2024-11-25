import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const uniqueItems = [];
    const initialQuantities = {};
    const initialSelectedItems = {};

    storedCartItems.forEach(item => {
      if (!initialQuantities[item.id]) {
        uniqueItems.push(item);
        initialQuantities[item.id] = 1;
        initialSelectedItems[item.id] = false;
      } else {
        initialQuantities[item.id] += 1;
      }
    });

    setCartItems(uniqueItems);
    setQuantities(initialQuantities);
    setSelectedItems(initialSelectedItems);
  }, []);

  const handleRemoveFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    
    // Update localStorage with filtered items
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = currentCartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[id];
    setQuantities(updatedQuantities);

    const updatedSelectedItems = { ...selectedItems };
    delete updatedSelectedItems[id];
    setSelectedItems(updatedSelectedItems);
  };

  const handleQuantityChange = (id, newQuantity) => {
    const item = cartItems.find(item => item.id === id);
    if (newQuantity > 0 && newQuantity <= item.soLuong) {
      setQuantities(prev => ({
        ...prev,
        [id]: newQuantity
      }));
      
      // Update localStorage with new quantity
      const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const updatedCartItems = currentCartItems.map(cartItem => {
        if (cartItem.id === id) {
          return { ...cartItem, soLuong: newQuantity };
        }
        return cartItem;
      });
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      alert(`Số lượng sản phẩm không được vượt quá số lượng trong kho`);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // hàm chọn tất cả 
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelectedItems = {};
    cartItems.forEach(item => {
      updatedSelectedItems[item.id] = newSelectAll;
    });
    setSelectedItems(updatedSelectedItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.id]) {
        const quantity = quantities[item.id] || 1;
        return total + (parseFloat(item.donGia) * quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckout = () => {
    const itemsToCheckout = cartItems.filter(item => selectedItems[item.id]);
    if (itemsToCheckout.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
        return;
    }
    
    // Tạo object mới với số lượng chính xác
    const checkoutData = itemsToCheckout.map(item => {
        const quantity = quantities[item.id] || 1;
        return {
            ...item,
            id: item.id,
            maDinhDanh: item.id,
            soLuong: quantity,
            thanhTien: quantity * parseFloat(item.donGia)
        };
    });

    // Lưu thông tin chi tiết về số lượng
    const quantityData = {};
    checkoutData.forEach(item => {
        quantityData[item.id] = item.soLuong;
    });

    localStorage.setItem('checkoutItems', JSON.stringify(checkoutData));
    localStorage.setItem('checkoutQuantities', JSON.stringify(quantityData));
    navigate('/checkout');
  };

  const handleRemoveSelectedItems = () => {
    const itemsToKeep = cartItems.filter(item => !selectedItems[item.id]);
    setCartItems(itemsToKeep);
    
    // Update localStorage with remaining items
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = currentCartItems.filter(item => !selectedItems[item.id]);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    const updatedQuantities = { ...quantities };
    const updatedSelectedItems = { ...selectedItems };

    cartItems.forEach(item => {
      if (selectedItems[item.id]) {
        delete updatedQuantities[item.id];
        delete updatedSelectedItems[item.id];
      }
    });

    setQuantities(updatedQuantities);
    setSelectedItems(updatedSelectedItems);
    setSelectAll(false);
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
                  {calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  onClick={handleRemoveSelectedItems}
                  className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition duration-300"
                >
                  Xóa các mục đã chọn
                </button>
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
