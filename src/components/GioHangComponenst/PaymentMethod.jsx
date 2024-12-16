import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaMobileAlt, FaCreditCard } from 'react-icons/fa';

function PaymentMethod({ paymentMethod, setPaymentMethod, errors, setErrors }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);

  // Validate khi component mount và khi selectedPaymentMethod thay đổi
  useEffect(() => {
    validatePaymentMethod(selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  // Validate payment method selection
  const validatePaymentMethod = (method) => {
    if (!method) {
      setErrors(prev => ({
        ...prev,
        paymentMethod: "Vui lòng chọn phương thức thanh toán"
      }));
      return false;
    }

    // Clear error when valid selection is made
    setErrors(prev => ({
      ...prev,
      paymentMethod: ""
    }));
    return true;
  };

  // Handle payment method selection with validation
  const handlePaymentMethodSelect = (method) => {
    // Nếu click vào phương thức đang chọn, không cho hủy chọn
    if (method === selectedPaymentMethod) {
      return;
    }
    
    setSelectedPaymentMethod(method);
    setPaymentMethod(method);
    validatePaymentMethod(method);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaMoneyBillWave className="mr-2 text-blue-600" />
        Phương thức thanh toán <span className="text-red-500 ml-1">*</span>
      </h2>

      <div className="grid grid-cols-1 gap-4">
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

      {/* Hiển thị lỗi nếu có */}
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

export default PaymentMethod;