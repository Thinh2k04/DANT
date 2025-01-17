import React from 'react';
import { FaTruck } from 'react-icons/fa';

function DeliveryMethod({
  setDeliveryMethod,
  setErrors,
  setPickupDate
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
          <FaTruck className="text-xl text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Giao hàng tận nơi</h2>
          <p className="text-sm text-gray-600 mt-1">
            Đơn hàng sẽ được giao đến địa chỉ của bạn trong vòng 2-10 ngày làm việc
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryMethod; 