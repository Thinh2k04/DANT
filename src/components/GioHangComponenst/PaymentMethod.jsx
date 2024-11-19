import React from 'react';

function PaymentMethod({ paymentMethod, setPaymentMethod, errors, setErrors }) {
  return (
    <div className="mb-4">
      <label htmlFor="paymentMethod" className="block text-lg font-semibold mb-2">
        Phương thức thanh toán:
      </label>
      <select
        id="paymentMethod"
        value={paymentMethod}
        onChange={(e) => {
          setPaymentMethod(e.target.value);
          setErrors((prev) => ({ ...prev, payment: "" }));
        }}
        className={`border rounded p-2 w-full ${errors.payment ? "border-red-500" : ""}`}
      >
        <option value="1">Thanh toán khi nhận hàng</option>
        <option value="2">Thanh toán qua Momo</option>
        <option value="3">Thanh toán qua VNPay</option>
      </select>
      {errors.payment && (
        <p className="text-red-500 text-sm mt-1">{errors.payment}</p>
      )}
    </div>
  );
}

export default PaymentMethod;