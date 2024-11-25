import React from 'react';
import { FaStore, FaCalendarAlt } from 'react-icons/fa';

function PickupInfo({
  stores,
  selectedStore,
  setSelectedStore,
  pickupDate,
  setPickupDate,
  errors,
  setErrors
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaStore className="mr-2 text-blue-600" />
        Thông tin nhận hàng
      </h2>

      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="store" className="block text-lg font-semibold mb-2 text-gray-700">
            Chọn cửa hàng:
          </label>
          <div className="relative">
            <FaStore className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="store"
              value={selectedStore}
              onChange={(e) => {
                setSelectedStore(e.target.value);
                setErrors((prev) => ({ ...prev, store: "" }));
              }}
              className={`pl-10 border rounded-lg p-3 w-full appearance-none bg-white
                ${errors.store ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="" disabled>Chọn cửa hàng</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.address} (Giờ mở cửa: {store.hours})
                </option>
              ))}
            </select>
          </div>
          {errors.store && (
            <p className="text-red-500 text-sm mt-1">{errors.store}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="pickupDate" className="block text-lg font-semibold mb-2 text-gray-700">
            Chọn thời gian tới lấy hàng:
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                setErrors((prev) => ({ ...prev, pickupDate: "" }));
              }}
              className={`pl-10 border rounded-lg p-3 w-full
                ${errors.pickupDate ? "border-red-500" : "border-gray-300"}`}
              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </div>
          {errors.pickupDate && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PickupInfo; 