import React from 'react';

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
    <>
      <div className="mb-4">
        <label htmlFor="store" className="block text-lg font-semibold mb-2">
          Chọn cửa hàng:
        </label>
        <select
          id="store"
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
            setErrors((prev) => ({ ...prev, store: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.store ? "border-red-500" : ""}`}
        >
          <option value="" disabled>
            Chọn cửa hàng
          </option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.address} (Giờ mở cửa: {store.hours})
            </option>
          ))}
        </select>
        {errors.store && (
          <p className="text-red-500 text-sm mt-1">{errors.store}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="pickupDate" className="block text-lg font-semibold mb-2">
          Chọn thời gian tới lấy hàng:
        </label>
        <input
          type="date"
          id="pickupDate"
          value={pickupDate}
          onChange={(e) => {
            setPickupDate(e.target.value);
            setErrors((prev) => ({ ...prev, pickupDate: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.pickupDate ? "border-red-500" : ""}`}
          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
          max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
        />
        {errors.pickupDate && (
          <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
        )}
      </div>
    </>
  );
}

export default PickupInfo; 