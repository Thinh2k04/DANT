// Import các thư viện React và icons cần thiết
import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaMobileAlt, FaCreditCard } from 'react-icons/fa';

// Component PaymentMethod nhận vào các props để quản lý phương thức thanh toán
function PaymentMethod({ paymentMethod, setPaymentMethod, errors, setErrors }) {
  // State lưu trữ phương thức thanh toán được chọn
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);

  // useEffect chạy khi component mount và khi selectedPaymentMethod thay đổi
  useEffect(() => {
    validatePaymentMethod(selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  // Hàm validate phương thức thanh toán
  const validatePaymentMethod = (method) => {
    // Nếu chưa chọn phương thức, set error
    if (!method) {
      setErrors(prev => ({
        ...prev,
        paymentMethod: "Vui lòng chọn phương thức thanh toán"
      }));
      return false;
    }

    // Xóa error khi đã chọn hợp lệ
    setErrors(prev => ({
      ...prev,
      paymentMethod: ""
    }));
    return true;
  };

  // Xử lý khi chọn phương thức thanh toán
  const handlePaymentMethodSelect = (method) => {
    // Nếu click vào phương thức đang chọn, không cho hủy chọn
    if (method === selectedPaymentMethod) {
      return;
    }
    
    // Cập nhật state và validate
    setSelectedPaymentMethod(method);
    setPaymentMethod(method);
    validatePaymentMethod(method);
  };

  return (
    // Container chính của component
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      {/* Tiêu đề phần phương thức thanh toán */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaMoneyBillWave className="mr-2 text-blue-600" />
        Phương thức thanh toán <span className="text-red-500 ml-1">*</span>
      </h2>

      {/* Grid chứa các phương thức thanh toán */}
      <div className="grid grid-cols-1 gap-4">
        {/* Phương thức thanh toán khi nhận hàng */}
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center
            ${selectedPaymentMethod === "1" 
              ? "bg-blue-50 border-2 border-blue-500" 
              : "border-2 border-gray-200 hover:border-blue-300"}`}
          onClick={() => handlePaymentMethodSelect("1")}
        >
          <FaMoneyBillWave className="text-2xl mr-3 text-green-600" />
          <div>
            <h3 className="font-semibold">Thanh toán khi nhận hàng</h3>
            <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
          </div>
        </div>

        {/* Phương thức thanh toán qua ZALOPay */}
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center
            ${selectedPaymentMethod === "2" 
              ? "bg-blue-50 border-2 border-blue-500" 
              : "border-2 border-gray-200 hover:border-blue-300"}`}
          onClick={() => handlePaymentMethodSelect("2")}
        >
          <FaCreditCard className="text-2xl mr-3 text-blue-600" />
          <div>
            <h3 className="font-semibold">Thanh toán qua ZALOPay</h3>
            <p className="text-sm text-gray-600">Thanh toán qua cổng ZALOPay</p>
          </div>
        </div>
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errors?.paymentMethod && (
        <div className="mt-2 text-red-500 text-sm">
          {errors.paymentMethod}
        </div>
      )}

      {/* Hiển thị phương thức đã chọn hoặc thông báo chưa chọn */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {selectedPaymentMethod ? (
            <>
              Bạn đã chọn: {
                selectedPaymentMethod === "1" 
                  ? "Thanh toán khi nhận hàng" 
                  : "Thanh toán qua ZALOPay"
              }
            </>
          ) : (
            <span className="text-red-500">Vui lòng chọn phương thức thanh toán</span>
          )}
        </p>
      </div>
    </div>
  );
}

// Export component để sử dụng ở nơi khác
export default PaymentMethod;