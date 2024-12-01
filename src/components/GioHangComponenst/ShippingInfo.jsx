// Import các thư viện React cần thiết
import React, { useEffect, useState } from 'react';

// Component ShippingInfo nhận vào các props để xử lý thông tin giao hàng
function ShippingInfo({
  provinces, // Danh sách tỉnh/thành phố
  districts, // Danh sách quận/huyện
  wards, // Danh sách phường/xã
  selectedProvince, // Tỉnh/thành phố được chọn
  selectedDistrict, // Quận/huyện được chọn  
  selectedWard, // Phường/xã được chọn
  specificAddress, // Địa chỉ cụ thể
  handleProvinceChange, // Hàm xử lý khi thay đổi tỉnh/thành phố
  handleDistrictChange, // Hàm xử lý khi thay đổi quận/huyện
  setSelectedWard, // Hàm cập nhật phường/xã được chọn
  setSpecificAddress, // Hàm cập nhật địa chỉ cụ thể
  errors, // Object chứa các lỗi
  setErrors, // Hàm cập nhật lỗi
  setShippingFee, // Hàm cập nhật phí vận chuyển
  cartItems, // Danh sách sản phẩm trong giỏ hàng
  quantities, // Số lượng sản phẩm,
  totalAmount, // Tổng tiền đơn hàng
  weight, // Trọng lượng đơn hàng
}) {

  // Hàm tính phí vận chuyển
  const calculateShippingFee = async () => {
    // Kiểm tra điều kiện trước khi tính phí
    if (!selectedProvince || !selectedDistrict) {
      return;
    }

    try {
      // Lấy tên tỉnh/thành phố từ mã code
      const selectedProvinceName = provinces.find(
        p => p.code === parseInt(selectedProvince)
      )?.name;

      
      // Lấy tên quận/huyện từ mã code
      const selectedDistrictName = districts.find(
        d => d.code === parseInt(selectedDistrict)
      )?.name;

      

      // // Tính tổng trọng lượng
      // const weight = calculateTotalWeight(); // Tính trọng lượng

      // Chuẩn bị dữ liệu gửi lên API
      const requestData = {
        pick_province: "Hà Nội", // Tỉnh/thành phố lấy hàng
        pick_district: "Cầu Giấy", // Quận/huyện lấy hàng
        province: selectedProvinceName, // Tỉnh/thành phố giao hàng
        district: selectedDistrictName, // Quận/huyện giao hàng
        address: specificAddress || "", // Địa chỉ giao hàng (có thể trống)
        weight: weight, // Khối lượng (gram) được tính toán
        value: totalAmount, // Giá trị đơn hàng
        transport: "road" // Phương thức vận chuyển
      };

      // Gọi API tính phí vận chuyển
      const response = await fetch('http://localhost:8080/api/ghtk/calculate-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      // Xử lý kết quả từ API
      const data = await response.json();
      console.log('GHTK response:', data);

      // Nếu có phí vận chuyển thì cập nhật state và localStorage
      if (data && data.fee) {
        setShippingFee(data.fee.fee);
        console.log(data.fee.fee);
        localStorage.setItem('shippingFee', data.fee.fee.toString());
      } else {
        setShippingFee(0);
        localStorage.setItem('shippingFee', '0');
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.error('Lỗi tính phí vận chuyển:', error);
      setShippingFee(0);
      localStorage.setItem('shippingFee', '0');
    }
  };

  // Gọi hàm tính phí vận chuyển khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      calculateShippingFee();
    }
  }, [selectedDistrict]);

  // Render giao diện component
  return (
    <>
      {/* Phần chọn tỉnh/thành phố */}
      <div className="mb-4">
        <label htmlFor="province" className="block text-lg font-semibold mb-2">
          Chọn tỉnh thành:
        </label>
        <select
          id="province"
          value={selectedProvince}
          onChange={handleProvinceChange}
          className={`border rounded p-2 w-full ${errors.province ? "border-red-500" : ""}`}
        >
          <option value="" disabled>Chọn tỉnh thành</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
        {errors.province && (
          <p className="text-red-500 text-sm mt-1">{errors.province}</p>
        )}
      </div>

      {/* Phần chọn quận/huyện */}
      <div className="mb-4">
        <label htmlFor="district" className="block text-lg font-semibold mb-2">
          Chọn quận huyện:
        </label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className={`border rounded p-2 w-full ${errors.district ? "border-red-500" : ""}`}
          disabled={!selectedProvince}
        >
          <option value="" disabled>Chọn quận huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
        {errors.district && (
          <p className="text-red-500 text-sm mt-1">{errors.district}</p>
        )}
      </div>

      {/* Phần chọn phường/xã */}
      <div className="mb-4">
        <label htmlFor="ward" className="block text-lg font-semibold mb-2">
          Chọn phường xã:
        </label>
        <select
          id="ward"
          value={selectedWard}
          onChange={(e) => {
            setSelectedWard(e.target.value);
            setErrors((prev) => ({ ...prev, ward: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.ward ? "border-red-500" : ""}`}
          disabled={!selectedDistrict}
        >
          <option value="" disabled>Chọn phường xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
        {errors.ward && (
          <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
        )}
      </div>

      {/* Phần nhập địa chỉ cụ thể */}
      <div className="mb-4">
        <label htmlFor="specificAddress" className="block text-lg font-semibold mb-2">
          Nhập địa chỉ số nhà cụ thể:
        </label>
        <input
          type="text"
          id="specificAddress"
          value={specificAddress}
          onChange={(e) => {
            setSpecificAddress(e.target.value);
            setErrors((prev) => ({ ...prev, address: "" }));
          }}
          className={`border rounded p-2 w-full ${errors.address ? "border-red-500" : ""}`}
          maxLength={250}
          placeholder="Nhập địa chỉ cụ thể"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>
    </>
  );
}

// Export component để sử dụng ở nơi khác
export default ShippingInfo;