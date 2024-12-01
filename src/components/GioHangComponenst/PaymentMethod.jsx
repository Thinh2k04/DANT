import React, { useState } from 'react';
import { FaMoneyBillWave, FaMobileAlt, FaCreditCard } from 'react-icons/fa';

// Hàm PaymentMethod nhận vào các props paymentMethod, setPaymentMethod, errors và setErrors
function PaymentMethod({ paymentMethod, setPaymentMethod, errors, setErrors }) {
  // Sử dụng useState để lưu trữ trạng thái của phương thức thanh toán
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);

  // Trả về giao diện của component
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaMoneyBillWave className="mr-2 text-blue-600" />
        Phương thức thanh toán
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center
            ${selectedPaymentMethod === "1" 
              ? "bg-blue-50 border-2 border-blue-500" 
              : "border-2 border-gray-200 hover:border-blue-300"}`}
          onClick={() => {
            setPaymentMethod("1");
            setSelectedPaymentMethod("1");
          }}
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
          onClick={() => {
            setPaymentMethod("2");
            setSelectedPaymentMethod("2");
          }}
        >
          <FaCreditCard className="text-2xl mr-3 text-blue-600" />
          <div>
            <h3 className="font-semibold">Thanh toán qua ZALOPay</h3>
            <p className="text-sm text-gray-600">Thanh toán qua cổng ZALOPay</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">Bạn đã chọn: {selectedPaymentMethod === "1" ? "Thanh toán khi nhận hàng" : "Thanh toán qua ZALOPay"}</p>
      </div>
    </div>
  );
}

// Xuất hàm PaymentMethod để sử dụng ở các file khác
export default PaymentMethod;