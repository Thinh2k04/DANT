import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { toast } from 'react-toastify';
import { FaSearch, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaWarehouse } from 'react-icons/fa';

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

  // Thêm hàm để lấy chi tiết hóa đơn theo ID
  const getOrderById = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/rest/hoa_don/getById/${orderId}`);
      if (!response.ok) throw new Error('Không tìm thấy đơn hàng');
      
      const orderData = await response.json();
      setCurrentOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Không thể lấy thông tin đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tra cứu đơn hàng
  const handleTrackOrder = async () => {
    if (!orderCode && !phoneNumber) {
      toast.error('Vui lòng nhập mã đơn hàng hoặc số điện thoại!');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (orderCode) {
        // Nếu có mã đơn hàng, gọi trực tiếp API getById
        await getOrderById(orderCode);
      } else {
        // Nếu tìm theo số điện thoại, giữ nguyên logic cũ
        response = await fetch(`http://localhost:8080/rest/hoa_don/traCuu?soDienThoai=${phoneNumber}`);
        if (!response.ok) throw new Error('Không tìm thấy đơn hàng');
        
        const orderData = await response.json();
        const orders = Array.isArray(orderData) ? orderData : [orderData];
        
        // Cập nhật lịch sử và hiển thị đơn hàng đầu tiên
        const newHistory = [...orders, ...orderHistory.filter(order => 
          !orders.some(newOrder => newOrder.id === order.id)
        )].slice(0, 5);
        
        localStorage.setItem('orderHistory', JSON.stringify(newHistory));
        setOrderHistory(newHistory);
        setCurrentOrder(orders[0]);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Không tìm thấy đơn hàng!');
    } finally {
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

  // Thêm hàm getOrderTimeline
  const getOrderTimeline = (status) => {
    const steps = [
      { id: 1, title: 'Đặt hàng', icon: FaBox, description: 'Đơn hàng đã được đặt' },
      { id: 2, title: 'Xác nhận', icon: FaWarehouse, description: 'Đơn hàng đã được xác nhận' },
      { id: 3, title: 'Vận chuyển', icon: FaTruck, description: 'Đơn hàng đang được giao' },
      { id: 4, title: 'Hoàn thành', icon: FaCheckCircle, description: 'Đơn hàng đã giao thành công' },
    ];

    if (status === 0) {
      return [{
        id: 0,
        title: 'Đã hủy',
        icon: FaTimesCircle,
        description: 'Đơn hàng đã bị hủy'
      }];
    }

    return steps.map((step, index) => ({
      ...step,
      active: index < status,
      current: index === status - 1
    }));
  };

  // Sửa lại phần hiển thị chi tiết đơn hàng
  const renderOrderDetails = () => {
    if (!currentOrder) return null;

    const timeline = getOrderTimeline(currentOrder.trangThaiThanhToan);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
        <div className="space-y-4">
          {/* Thông tin cơ bản */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Mã đơn hàng: {currentOrder.id}</p>
              <p className="text-gray-600">Ngày đặt: {new Date(currentOrder.thoiGianLapHoaDon).toLocaleDateString('vi-VN')}</p>
              <p className="text-gray-600">Khách hàng: {currentOrder.khachHang?.hoTen || 'N/A'}</p>
              <p className="text-gray-600">SĐT: {currentOrder.khachHang?.soDienThoai || 'N/A'}</p>
            </div>
            <div className={`flex items-center gap-2 ${getOrderStatus(currentOrder.trangThaiThanhToan).color}`}>
              {React.createElement(getOrderStatus(currentOrder.trangThaiThanhToan).icon)}
              <span>{getOrderStatus(currentOrder.trangThaiThanhToan).text}</span>
            </div>
          </div>

          {/* Thêm timeline */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-1 bg-gray-200" />
              <div className="space-y-8">
                {timeline.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className="flex items-center">
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${step.active || step.current ? 'bg-blue-500' : 'bg-gray-200'}
                        ${currentOrder.trangThaiThanhToan === 0 ? 'bg-red-500' : ''}
                      `}>
                        {React.createElement(step.icon, {
                          className: `w-4 h-4 ${step.active || step.current || currentOrder.trangThaiThanhToan === 0 ? 'text-white' : 'text-gray-500'}`
                        })}
                      </div>
                      <div className="ml-4">
                        <p className={`text-sm font-medium ${step.current ? 'text-blue-500' : 'text-gray-500'}`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Chi tiết đơn hàng</h3>
            {currentOrder.hoaDonChiTiets?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div className="flex-1">
                  <p className="font-medium">{item.sanPhamChiTiet?.sanPham?.tenSanPham}</p>
                  <p className="text-sm text-gray-600">
                    {item.sanPhamChiTiet?.cpu?.ten} | 
                    RAM {item.sanPhamChiTiet?.ram?.dungLuong}GB | 
                    {item.sanPhamChiTiet?.oLuuTru?.dungLuong}GB
                  </p>
                  <p className="text-gray-600">Số lượng: {item.soLuong}</p>
                </div>
                <p className="font-medium">
                  {parseFloat(item.gia).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
              </div>
            ))}
          </div>

          {/* Tổng tiền và thông tin thanh toán */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span>Tổng tiền hàng:</span>
              <span>{parseFloat(currentOrder.tongTien).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Giảm giá:</span>
              <span>-{parseFloat(currentOrder.giamGia || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Tổng thanh toán:</span>
              <span className="text-red-600">
                {parseFloat(currentOrder.tongTien - (currentOrder.giamGia || 0)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
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

          {/* Hiển thị chi tiết đơn hàng */}
          {renderOrderDetails()}

          {/* Lịch sử tra cứu */}
          {orderHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Lịch sử tra cứu</h2>
              <div className="space-y-4">
                {orderHistory.map((order, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => getOrderById(order.id)}
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
