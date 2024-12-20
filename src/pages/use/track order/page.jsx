import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { toast } from 'react-toastify';
import { FaSearch, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

const TrackOrderPage = () => {
  const [orderCode, setOrderCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load order history from localStorage when component mounts
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    setOrderHistory(savedOrders);
  }, []);

  // Hàm tra cứu đơn hàng
  const handleTrackOrder = async () => {
    if (!orderCode || !phoneNumber) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/rest/hoa_don/track?maHoaDon=${orderCode}&soDienThoai=${phoneNumber}`);
      if (!response.ok) throw new Error('Không tìm thấy đơn hàng');
      
      const orderData = await response.json();
      
      // Thêm đơn hàng vào lịch sử
      const newHistory = [orderData, ...orderHistory.filter(order => order.id !== orderData.id)].slice(0, 5);
      localStorage.setItem('orderHistory', JSON.stringify(newHistory));
      setOrderHistory(newHistory);
      
      setCurrentOrder(orderData);
      setLoading(false);
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Không tìm thấy đơn hàng!');
      setLoading(false);
    }
  };

  // Hàm lấy trạng thái đơn hàng
  const getOrderStatus = (status) => {
    switch (status) {
      case 0: return { text: 'Đã hủy', color: 'text-red-500', icon: FaBox };
      case 1: return { text: 'Chờ xác nhận', color: 'text-yellow-500', icon: FaBox };
      case 2: return { text: 'Đang giao hàng', color: 'text-blue-500', icon: FaTruck };
      case 3: return { text: 'Đã giao hàng', color: 'text-green-500', icon: FaCheckCircle };
      default: return { text: 'Không xác định', color: 'text-gray-500', icon: FaBox };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Tra cứu đơn hàng</h1>
          
          {/* Form tra cứu */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã đơn hàng
                </label>
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mã đơn hàng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <button
              onClick={handleTrackOrder}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
            >
              <FaSearch />
              {loading ? 'Đang tra cứu...' : 'Tra cứu'}
            </button>
          </div>

          {/* Hiển thị thông tin đơn hàng */}
          {currentOrder && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mã đơn hàng: {currentOrder.id}</p>
                    <p className="text-gray-600">Ngày đặt: {new Date(currentOrder.thoiGianLapHoaDon).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${getOrderStatus(currentOrder.trangThaiThanhToan).color}`}>
                    {React.createElement(getOrderStatus(currentOrder.trangThaiThanhToan).icon)}
                    <span>{getOrderStatus(currentOrder.trangThaiThanhToan).text}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Chi tiết đơn hàng</h3>
                  {currentOrder.hoaDonChiTiets?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.sanPhamChiTiet.tenSanPhamChiTiet}</p>
                        <p className="text-gray-600">Số lượng: {item.soLuong}</p>
                      </div>
                      <p className="font-medium">
                        {parseFloat(item.gia).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="text-xl font-bold text-red-600">
                      {parseFloat(currentOrder.tongTien).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lịch sử tra cứu */}
          {orderHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Lịch sử tra cứu</h2>
              <div className="space-y-4">
                {orderHistory.map((order, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentOrder(order)}
                  >
                    <div>
                      <p className="font-medium">Mã đơn hàng: {order.id}</p>
                      <p className="text-gray-600">Ngày đặt: {new Date(order.thoiGianLapHoaDon).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${getOrderStatus(order.trangThaiThanhToan).color}`}>
                      {React.createElement(getOrderStatus(order.trangThaiThanhToan).icon)}
                      <span>{getOrderStatus(order.trangThaiThanhToan).text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
