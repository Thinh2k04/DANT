import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaUser, FaMapMarkerAlt, FaTruck, FaMoneyBill, FaShoppingBag } from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const orderInfo = location.state?.orderInfo;
  const navigate = useNavigate();

  // Kiểm tra và hiển thị dữ liệu
  console.log('Order Info:', orderInfo); // Để debug

  const handleBankPayment = async () => {
    try {
      const paymentData = {
        userId: orderInfo.hoaDon?.maHoaDon || '',
        totalAmount: orderInfo.hoaDon.tongTien ,
        items: orderInfo.listHDCT.map(item => ({
          product_id: item.tenSanPham,
          quantity: item.soLuong,
          price: item.donGia
        }))
      };

      const response = await fetch('http://localhost:8080/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const result = await response.json();
      
      if (result.order_url) {
        window.open(result.order_url, '_blank');
        navigate('/home');
      }

    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };
  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy thông tin đơn hàng
          </h1>
          <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
          <div className="relative">
            <FaCheckCircle className="text-white text-7xl mx-auto mb-4 animate-bounce" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-400 rounded-full filter blur-xl opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Đặt hàng thành công!</h1>
          <p className="text-white text-xl opacity-90">Cảm ơn bạn đã tin tưởng LaptopStore</p>
        </div>

        {/* Order Status */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 border-b border-green-100">
          <div className="flex items-center justify-center space-x-3 text-green-700">
            <FaShoppingBag className="text-2xl" />
            <span className="font-semibold text-xl">Trạng thái: {orderInfo.timeline?.lyDo || "Chờ xác nhận"}</span>
          </div>
        </div>

        {/* Order Info */}
        <div className="p-8">
          {/* Order ID and Date */}
          <div className="mb-8 text-center bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-700 text-lg">
              Mã đơn hàng: <span className="font-bold text-green-600">
                {orderInfo.hoaDon.maHoaDon}
              </span>
            </p>
            <p className="text-gray-600">
              Thời gian đặt: {new Date(orderInfo.hoaDon.thoiGianLapHoaDon[0],
                orderInfo.hoaDon.thoiGianLapHoaDon[1] - 1,
                orderInfo.hoaDon.thoiGianLapHoaDon[2],
                orderInfo.hoaDon.thoiGianLapHoaDon[3],
                orderInfo.hoaDon.thoiGianLapHoaDon[4]).toLocaleString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
            </p>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <FaTruck className="mr-3 text-green-500" />
              Thông tin giao hàng
            </h2>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-700 flex items-start">
                <FaMapMarkerAlt className="mr-3 text-green-500 mt-1 flex-shrink-0" />
                <span>{orderInfo.hoaDon.diaChiNhanHang}</span>
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <FaBox className="mr-3 text-green-500" />
              Chi tiết đơn hàng
            </h2>
            <div className="space-y-4">
              {orderInfo.listHDCT && orderInfo.listHDCT.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{item.tenSanPham}</h3>
                    <p className="text-gray-600">Số lượng: {item.soLuong}</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{item.donGia?.toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <FaMoneyBill className="mr-3 text-green-500" />
              Thông tin thanh toán
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold">{orderInfo.hoaDon.tongTien.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">{orderInfo.hoaDon.phiVanChuyen.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-green-600 pt-3 border-t">
                <span>Tổng thanh toán:</span>
                <span>{orderInfo.hoaDon.tongTien.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between pt-2 text-gray-600">
                <span>Phương thức thanh toán:</span>
                <span className="font-semibold">{orderInfo.hoaDon.hinhThucThanhToan}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg text-center font-semibold"
            >
              Tiếp tục mua sắm
            </Link>
            {orderInfo.hoaDon.hinhThucThanhToan === "Thanh toán qua ZALOPAY" && orderInfo.hoaDon.trangThaiThanhToan === 2 && (
              <button
                onClick={handleBankPayment}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-0.5 shadow-lg text-center font-semibold"
              >
                Thanh toán ngân hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;