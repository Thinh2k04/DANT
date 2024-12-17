import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaUser, FaMapMarkerAlt, FaTruck, FaMoneyBill, FaShoppingBag } from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const orderInfo = location.state?.orderInfo;

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin đơn hàng</h1>
          <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 p-6 text-center">
          <FaCheckCircle className="text-white text-6xl mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
          <p className="text-white text-lg">Cảm ơn bạn đã mua hàng tại LaptopStore</p>
        </div>

        {/* Order Status */}
        <div className="bg-green-50 p-4 border-b border-green-100">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <FaShoppingBag className="text-xl" />
            <span className="font-semibold">Trạng thái đơn hàng: {orderInfo.trangThaiDonHang}</span>
          </div>
        </div>

        {/* Order Info */}
        <div className="p-8">
          {/* Order ID and Date */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">Mã đơn hàng: <span className="font-semibold">#{orderInfo.id}</span></p>
            <p className="text-gray-600">Ngày đặt: {new Date(orderInfo.thoiGianLapHoaDon).toLocaleString('vi-VN')}</p>
          </div>

          {/* Customer Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaUser className="mr-2 text-green-500" />
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Họ tên: <span className="font-semibold">{orderInfo.tttk.hoTen}</span></p>
                <p className="text-gray-600">Số điện thoại: <span className="font-semibold">{orderInfo.tttk.soDienThoai}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Email: <span className="font-semibold">{orderInfo.tttk.email || 'Không có'}</span></p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaTruck className="mr-2 text-green-500" />
              Thông tin giao hàng
            </h2>
            <p className="text-gray-600">
              <FaMapMarkerAlt className="inline-block mr-2 text-green-500" />
              {orderInfo.diaChiNhanHang}
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaBox className="mr-2 text-green-500" />
              Chi tiết đơn hàng
            </h2>
            <div className="space-y-4">
              {orderInfo.cartItems && orderInfo.cartItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.hinhAnh?.[0]?.duongDan || '/placeholder-image.jpg'}
                    alt={item.tenSanPham}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.tenSanPham}</h3>
                    <p className="text-sm text-gray-600">Số lượng: {item.soLuong}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.donGia?.toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaMoneyBill className="mr-2 text-green-500" />
              Thông tin thanh toán
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền hàng:</span>
                <span className="font-semibold">{orderInfo.tongTienHang.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-semibold">{orderInfo.phiVanChuyen.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t">
                <span>Tổng thanh toán:</span>
                <span>{(orderInfo.tongTienHang + orderInfo.phiVanChuyen).toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="font-semibold">{orderInfo.hinhThucThanhToan.tenHinhThuc}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/orders"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;