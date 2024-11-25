import React from 'react';
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

function CustomerInformation({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  errors,
  setErrors
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaUser className="mr-2 text-blue-600" />
        Thông tin khách hàng
      </h2>

      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="customerName" className="block text-lg font-semibold mb-2 text-gray-700">
            Họ tên:
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`pl-10 border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.name ? "border-red-500" : "border-gray-300"}`}
              maxLength={100}
              placeholder="Nhập họ tên của bạn"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="phoneNumber" className="block text-lg font-semibold mb-2 text-gray-700">
            Số điện thoại:
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhoneNumber(value);
                setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              className={`pl-10 border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              maxLength={10}
              placeholder="Nhập số điện thoại"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="email" className="block text-lg font-semibold mb-2 text-gray-700">
            Email:
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`pl-10 border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.email ? "border-red-500" : "border-gray-300"}`}
              maxLength={100}
              placeholder="Nhập email của bạn"
            />
          </div>
          <p className="text-gray-500 text-sm mt-1 italic">
            Nhập email để nhận hóa đơn online (*Không bắt buộc)
          </p>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerInformation; 