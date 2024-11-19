import React from 'react';

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
    <div>
      <div className="mb-4">
        <label htmlFor="customerName" className="block text-lg font-semibold mb-2">
          Họ tên:
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.name ? "border-red-500" : ""}`}
          maxLength={100}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-lg font-semibold mb-2">
          Số điện thoại:
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhoneNumber(value);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.phone ? "border-red-500" : ""}`}
          maxLength={10}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-lg font-semibold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.email ? "border-red-500" : ""}`}
          maxLength={100}
        />
        <p className="text-gray-500 text-sm mt-1">
          Nhập email để nhận hóa đơn online (*Không bắt buộc)
        </p>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
    </div>
  );
}

export default CustomerInformation; 