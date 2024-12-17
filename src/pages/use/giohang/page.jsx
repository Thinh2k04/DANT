// Import các thư viện và components cần thiết
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { 
  getCartItems, // Hàm lấy danh sách sản phẩm trong giỏ hàng
  removeFromCart, // Hàm xóa sản phẩm khỏi giỏ hàng 
  updateCartItemQuantity, // Hàm cập nhật số lượng sản phẩm
  calculateTotal, // Hàm tính tổng tiền
  processCheckout // Hàm xử lý thanh toán
} from '../../../utils/cartUtils';

// Import các components từ react-router-dom
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  // Khai báo các state cần thiết
  const [cartItems, setCartItems] = useState([]); // State lưu danh sách sản phẩm
  const [quantities, setQuantities] = useState({}); // State lưu số lượng của từng sản phẩm
  const [selectedItems, setSelectedItems] = useState({}); // State lưu trạng thái chọn của từng sản phẩm
  const [selectAll, setSelectAll] = useState(false); // State lưu trạng thái chọn tất cả
  const navigate = useNavigate(); // Hook điều hướng

  // Effect hook để lấy dữ liệu giỏ hàng khi component mount
  useEffect(() => {
    const { items, quantities, selectedItems } = getCartItems();
    setCartItems(items);
    setQuantities(quantities); 
    setSelectedItems(selectedItems);
  }, []);
  
  // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = (id) => {
    const result = removeFromCart(id);
    if (result.success) {
      // Cập nhật lại state sau khi xóa thành công
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

  // Hàm xử lý thay đổi số lượng sản phẩm
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

  // Hàm xử lý chọn/bỏ chọn một sản phẩm
  const handleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Hàm xử lý chọn/bỏ chọn tất cả sản phẩm
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelectedItems = {};
    cartItems.forEach(item => {
      updatedSelectedItems[item.id] = newSelectAll;
    });
    setSelectedItems(updatedSelectedItems);
  };

  // Hàm xử lý khi nhấn nút thanh toán
  const handleCheckout = () => {
    const result = processCheckout(cartItems, selectedItems, quantities);
    if (result.success) {
      navigate('/checkout');
    }
  };

  // Add this function
  const handleRemoveSelectedItems = () => {
    const itemsToRemove = cartItems.filter(item => selectedItems[item.id]);
    itemsToRemove.forEach(item => removeFromCart(item.id));

    const updatedCartItems = cartItems.filter(item => !selectedItems[item.id]);
    setCartItems(updatedCartItems);
    setQuantities(prevQuantities => {
      const updatedQuantities = { ...prevQuantities };
      itemsToRemove.forEach(item => delete updatedQuantities[item.id]);
      return updatedQuantities;
    });
    setSelectedItems({});
    setSelectAll(false);
  };

  // Return JSX để render giao diện
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        {/* Phần header của giỏ hàng */}
        <div className="flex items-center mb-6">
          <Link 
            to="/home"
            className="mr-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
          >
            ← Quay lại
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
        </div>
        
        {/* Hiển thị nội dung giỏ hàng */}
        {cartItems.length === 0 ? (
          // Hiển thị khi giỏ hàng trống
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition-all hover:scale-105">
            <p className="text-gray-600 text-lg">Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block font-semibold">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          // Hiển thị khi có sản phẩm trong giỏ
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Phần chọn tất cả */}
            <div className="flex items-center mb-6">
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAll} 
                className="mr-3 w-5 h-5 rounded-lg"
              />
              <span className="text-lg font-medium">Chọn tất cả ({cartItems.length})</span>
            </div>
            {/* Danh sách sản phẩm */}
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
                  {/* Phần điều chỉnh số lượng */}
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
                  {/* Nút xóa sản phẩm */}
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="ml-6 text-red-500 hover:text-red-700 transition duration-200"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            
            {/* Phần tổng tiền và nút thanh toán */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">Tổng tiền:</span>
                <span className="text-2xl font-bold text-red-600">
                  {calculateTotal(cartItems, selectedItems, quantities).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleRemoveSelectedItems}
                  className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-md"
                >
                  Xóa sản phẩm đã chọn
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
