export const useValidation = (setErrors) => {
  const validateFields = ({
    customerName,
    phoneNumber,
    email,
    deliveryMethod,
    selectedStore,
    pickupDate,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    specificAddress,
    cartItems,
    paymentMethod
  }) => {
    const newErrors = {};
    let isValid = true;

    // Validate họ tên
    if (!customerName?.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(customerName)) {
      newErrors.name = "Họ tên chỉ được chứa chữ cái và khoảng trắng";
      isValid = false;
    } else if (customerName.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
      isValid = false;
    } else if (customerName.trim().length > 50) {
      newErrors.name = "Họ tên không được vượt quá 50 ký tự";
      isValid = false;
    }

    // Validate số điện thoại
    if (!phoneNumber) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneNumber)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    // Validate email
    if (!email?.trim()) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate phương thức nhận hàng
    if (deliveryMethod === "pickup") {
      if (!selectedStore) {
        newErrors.store = "Vui lòng chọn cửa hàng";
        isValid = false;
      }
      if (!pickupDate) {
        newErrors.pickupDate = "Vui lòng chọn ngày nhận hàng";
        isValid = false;
      } else {
        const selectedDate = new Date(pickupDate);
        const today = new Date();
        if (selectedDate < today) {
          newErrors.pickupDate = "Ngày nhận hàng không được là ngày trong quá khứ";
          isValid = false;
        }
      }
    } else if (deliveryMethod === "shipping") {
      if (!selectedProvince) {
        newErrors.province = "Vui lòng chọn tỉnh/thành";
        isValid = false;
      }
      if (!selectedDistrict) {
        newErrors.district = "Vui lòng chọn quận/huyện";
        isValid = false;
      }
      if (!selectedWard) {
        newErrors.ward = "Vui lòng chọn phường/xã";
        isValid = false;
      }
      if (!specificAddress?.trim()) {
        newErrors.address = "Vui lòng nhập địa chỉ cụ thể";
        isValid = false;
      }
    }

    // Validate giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      newErrors.cart = "Giỏ hàng không được để trống";
      isValid = false;
    }

    // Validate phương thức thanh toán
    if (!paymentMethod) {
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
      isValid = false;
    } else if (!["1", "2"].includes(paymentMethod)) {
      newErrors.paymentMethod = "Phương thức thanh toán không hợp lệ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return { validateFields };
}; 