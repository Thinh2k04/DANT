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
  setSelectedProvince,
  setSelectedDistrict
}) {
  // State để lưu trữ tên địa chỉ đầy đủ
  const [fullAddress, setFullAddress] = useState('');

  // Hàm lấy tên địa chỉ từ mã code
  const getLocationName = (array, code) => {
    if (!array || !Array.isArray(array)) return '';
    const item = array.find(item => item.code === parseInt(code));
    return item ? item.name : '';
  };

  // Lưu danh sách địa điểm vào localStorage
  useEffect(() => {
    if (provinces) {
      localStorage.setItem('provinces', JSON.stringify(provinces));
    }
  }, [provinces]);

  useEffect(() => {
    if (districts) {
      localStorage.setItem('districts', JSON.stringify(districts));
    }
  }, [districts]);

  useEffect(() => {
    if (wards) {
      localStorage.setItem('wards', JSON.stringify(wards));
    }
  }, [wards]);

  // Hàm cập nhật địa chỉ đầy đủ
  const updateFullAddress = () => {
    const provinceName = getLocationName(provinces, selectedProvince);
    const districtName = getLocationName(districts, selectedDistrict);
    const wardName = getLocationName(wards, selectedWard);

    // Lưu các mã code đã chọn
    if (selectedProvince) localStorage.setItem('selectedProvinceCode', selectedProvince);
    if (selectedDistrict) localStorage.setItem('selectedDistrictCode', selectedDistrict);
    if (selectedWard) localStorage.setItem('selectedWardCode', selectedWard);

    // Lưu tên các địa điểm đã chọn
    if (provinceName) localStorage.setItem('selectedProvinceName', provinceName);
    if (districtName) localStorage.setItem('selectedDistrictName', districtName);
    if (wardName) localStorage.setItem('selectedWardName', wardName);

    const addressParts = [
      specificAddress,
      wardName,
      districtName,
      provinceName
    ].filter(part => part);

    const fullAddr = addressParts.join(', ');
    setFullAddress(fullAddr);
    localStorage.setItem('shippingAddress', fullAddr);
  };

  // Cập nhật địa chỉ đầy đủ khi có thay đổi
  useEffect(() => {
    updateFullAddress();
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress]);

  // Hàm tính phí vận chuyển
  const calculateShippingFee = async () => {
    if (!selectedProvince || !selectedDistrict) return;

    try {
      const provinceName = getLocationName(provinces, selectedProvince);
      const districtName = getLocationName(districts, selectedDistrict);

      const requestData = {
        pick_province: "Hà Nội",
        pick_district: "Cầu Giấy",
        province: provinceName,
        district: districtName,
        address: fullAddress,
        weight: weight,
        value: totalAmount,
        transport: "road"
      };

      const response = await fetch('http://localhost:8080/api/ghtk/calculate-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data && data.fee) {
        setShippingFee(data.fee.fee);
        localStorage.setItem('shippingFee', data.fee.fee.toString());
      } else {
        setShippingFee(0);
        localStorage.setItem('shippingFee', '0');
      }
    } catch (error) {
      console.error('Lỗi tính phí vận chuyển:', error);
      setShippingFee(0);
      localStorage.setItem('shippingFee', '0');
    }
  };

  // Tính lại phí vận chuyển khi địa chỉ thay đổi
  useEffect(() => {
    if (fullAddress) {
      calculateShippingFee();
    }
  }, [fullAddress]);

  // Render giao diện component
  return (
    <div className="space-y-6">
      {/* Phần chọn tỉnh/thành phố */}
      <div>
        <label htmlFor="province" className="block text-lg font-semibold mb-2">
          Tỉnh/Thành phố: <span className="text-red-500">*</span>
        </label>
        <select
          id="province"
          value={selectedProvince}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              setErrors((prev) => ({ ...prev, province: "Vui lòng chọn tỉnh/thành phố" }));
            } else {
              setErrors((prev) => ({ ...prev, province: "" }));
            }
            handleProvinceChange(e);
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.province ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Chọn tỉnh/thành phố</option>
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
      <div>
        <label htmlFor="district" className="block text-lg font-semibold mb-2">
          Quận/Huyện: <span className="text-red-500">*</span>
        </label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              setErrors((prev) => ({ ...prev, district: "Vui lòng chọn quận/huyện" }));
            } else {
              setErrors((prev) => ({ ...prev, district: "" }));
            }
            handleDistrictChange(e);
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.district ? "border-red-500" : "border-gray-300"}`}
          disabled={!selectedProvince}
        >
          <option value="">Chọn quận/huyện</option>
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
      <div>
        <label htmlFor="ward" className="block text-lg font-semibold mb-2">
          Phường/Xã: <span className="text-red-500">*</span>
        </label>
        <select
          id="ward"
          value={selectedWard}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              setErrors((prev) => ({ ...prev, ward: "Vui lòng chọn phường/xã" }));
            } else {
              setErrors((prev) => ({ ...prev, ward: "" }));
            }
            setSelectedWard(e.target.value);
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.ward ? "border-red-500" : "border-gray-300"}`}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường/xã</option>
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
      <div>
        <label htmlFor="specificAddress" className="block text-lg font-semibold mb-2">
          Địa chỉ cụ thể: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="specificAddress"
          value={specificAddress}
          onChange={(e) => {
            const value = e.target.value;
            if (!value.trim()) {
              setErrors((prev) => ({ ...prev, address: "Vui lòng nhập địa chỉ cụ thể" }));
            } else {
              setErrors((prev) => ({ ...prev, address: "" }));
            }
            setSpecificAddress(value);
            localStorage.setItem('specificAddress', value);
          }}
          placeholder="Số nhà, tên đường..."
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.address ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* Hiển thị địa chỉ đầy đủ */}
      {fullAddress && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-700">Địa chỉ giao hàng:</p>
          <p className="text-gray-600 mt-1">{fullAddress}</p>
        </div>
      )}
    </div>
  );
}

// Export component để sử dụng ở nơi khác
export default ShippingInfo;