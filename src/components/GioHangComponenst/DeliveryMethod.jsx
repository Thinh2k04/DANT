import React from 'react';

function DeliveryMethod({
  deliveryMethod,
  setDeliveryMethod,
  setErrors,
  setPickupDate
}) {
  return (
    <div className="mb-4">
      <label htmlFor="deliveryMethod" className="block text-lg font-semibold mb-2">
        Phương thức nhận hàng:
      </label>
      <select
        id="deliveryMethod"
        value={deliveryMethod}
        onChange={(e) => {
          setDeliveryMethod(e.target.value);
          setErrors((prev) => ({
            ...prev,
            store: "",
            province: "",
            district: "",
            ward: "",
            address: "",
            pickupDate: "",
          }));
          if (e.target.value === "pickup") {
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
        className={`border rounded p-2 w-full`}
      >
        <option value="pickup">Nhận hàng tại quầy</option>
        <option value="shipping">Gửi đi</option>
      </select>
    </div>
  );
}

export default DeliveryMethod; 