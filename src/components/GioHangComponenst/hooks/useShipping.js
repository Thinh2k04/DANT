export const useShipping = (setShippingFee) => {
  const calculateShippingFee = async ({
    selectedProvince,
    selectedDistrict,
    provinces,
    districts,
    specificAddress,
    weight,
    totalAmount
  }) => {
    if (!selectedProvince || !selectedDistrict) {
      return;
    }

    try {
      const selectedProvinceName = provinces.find(
        p => p.code === parseInt(selectedProvince)
      )?.name;
      
      const selectedDistrictName = districts.find(
        d => d.code === parseInt(selectedDistrict)
      )?.name;

      const requestData = {
        pick_province: "Hà Nội",
        pick_district: "Cầu Giấy",
        province: selectedProvinceName,
        district: selectedDistrictName,
        address: specificAddress || "",
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
      console.error('Shipping fee calculation error:', error);
      setShippingFee(0);
      localStorage.setItem('shippingFee', '0');
    }
  };

  return { calculateShippingFee };
}; 