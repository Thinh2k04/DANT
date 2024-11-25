import React from 'react';
import { FaTruck, FaStore } from 'react-icons/fa';

function DeliveryMethod({
  deliveryMethod,
  setDeliveryMethod,
  setErrors,
  setPickupDate
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaTruck className="mr-2 text-blue-600" />
        Phương thức nhận hàng
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center
            ${deliveryMethod === "pickup" 
              ? "bg-blue-50 border-2 border-blue-500" 
              : "border-2 border-gray-200 hover:border-blue-300"}`}
          onClick={() => {
            setDeliveryMethod("pickup");
            setErrors((prev) => ({
              ...prev,
              store: "",
              province: "",
              district: "",
              ward: "",
              address: "",
              pickupDate: "",
            }));
            if (deliveryMethod === "pickup") {
              const today = new Date();
              const nextDay = new Date(today);
              nextDay.setDate(today.getDate() + 1);
              const maxDate = new Date(today);
              maxDate.setDate(today.getDate() + 7);
              setPickupDate(nextDay.toISOString().split("T")[0]);
            } else {
              setPickupDate("");
            }
          }}
        >
          <FaStore className="text-2xl mr-3 text-blue-600" />
          <div>
            <h3 className="font-semibold">Nhận tại cửa hàng</h3>
            <p className="text-sm text-gray-600">Nhận hàng sau 1-2 ngày</p>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center
            ${deliveryMethod === "shipping" 
              ? "bg-blue-50 border-2 border-blue-500" 
              : "border-2 border-gray-200 hover:border-blue-300"}`}
          onClick={() => {
            setDeliveryMethod("shipping");
            setPickupDate("");
          }}
        >
          <FaTruck className="text-2xl mr-3 text-blue-600" />
          <div>
            <h3 className="font-semibold">Giao hàng tận nơi</h3>
            <p className="text-sm text-gray-600">Giao hàng trong 2-5 ngày</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryMethod; 