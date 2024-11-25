// Import các thư viện và components cần thiết
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Layout/DefaultLayout/Navbar";
import CustomerInformation from '../../../components/GioHangComponenst/CustomerInformation';
import DeliveryMethod from '../../../components/GioHangComponenst/DeliveryMethod';
import PickupInfo from '../../../components/GioHangComponenst/PickupInfo';
import ShippingInfo from '../../../components/GioHangComponenst/ShippingInfo';
import PaymentMethod from '../../../components/GioHangComponenst/PaymentMethod';
import OrderSummary from '../../../components/GioHangComponenst/OrderSummary';
import { sonnet } from "@cloudinary/url-gen/qualifiers/artisticFilter";
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { BsReceiptCutoff } from 'react-icons/bs';

// URL API lấy thông tin tỉnh/thành phố
const host = "https://provinces.open-api.vn/api/";

function CheckoutPage() {
  // Các state quản lý thông tin giỏ hàng
  const [cartItems, setCartItems] = useState([]); // Danh sách sản phẩm trong giỏ
  const [quantities, setQuantities] = useState({}); // Số lượng của từng sản phẩm
  const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [weight, setWeight] = useState(0); // Trọng lượng đơn hàng
  
  // Các state quản lý địa chỉ giao hàng
  const [provinces, setProvinces] = useState([]); // Danh sách tỉnh/thành
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [wards, setWards] = useState([]); // Danh sách phường/xã
  const [selectedProvince, setSelectedProvince] = useState(""); // Tỉnh/thành đã chọn
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Quận/huyện đã chọn
  const [selectedWard, setSelectedWard] = useState(""); // Phường/xã đã chọn
  const [specificAddress, setSpecificAddress] = useState(""); // Địa chỉ cụ thể
  
  // Các state quản lý thông tin khách hàng
  const [customerName, setCustomerName] = useState(""); // Tên khách hàng
  const [phoneNumber, setPhoneNumber] = useState(""); // Số điện thoại
  const [email, setEmail] = useState(""); // Email
  const [errors, setErrors] = useState({}); // Lưu trữ các lỗi
  
  // Các state quản lý phương thức nhận/thanh toán
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // Phương thức nhận hàng
  const [stores, setStores] = useState([]); // Danh sách cửa hàng
  const [selectedStore, setSelectedStore] = useState(""); // Cửa hàng đã chọn
  const [pickupDate, setPickupDate] = useState(""); // Ngày nhận hàng
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Phương thức thanh toán
  const [shippingFee, setShippingFee] = useState(0); // Phí vận chuyển

  const navigate = useNavigate();

  // Effect hook để lấy thông tin giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const savedQuantities = JSON.parse(localStorage.getItem("checkoutQuantities")) || {};
    const savedShippingFee = localStorage.getItem('shippingFee') || '0';
    
    const initialQuantities = {};
    let initialTotalAmount = 0;
    let totalWeight = 0;

    checkoutItems.forEach((item) => {
        // Sử dụng ID để lấy số lượng
        const quantity = savedQuantities[item.id] || item.soLuong || 1;
        initialQuantities[item.id] = quantity;
        
        // Tính toán tổng tiền và trọng lượng
        initialTotalAmount += quantity * parseFloat(item.donGia);
        totalWeight += quantity * parseFloat(item.trongLuong || 0);
    });

    setCartItems(checkoutItems);
    setQuantities(initialQuantities);
    setTotalAmount(initialTotalAmount);
    setWeight(totalWeight);
    setShippingFee(parseFloat(savedShippingFee));
  }, []);

  // Effect hook để lấy danh sách tỉnh/thành và khởi tạo danh sách cửa hàng
  useEffect(() => {
    callAPI(`${host}?depth=1`);
    // Dữ liệu mẫu cho danh sách cửa hàng
    setStores([
      {
        id: "1",
        name: "Cửa hàng A",
        pick_province: "Hà Nội",
        pick_district: "Quận Hoàn Kiếm",
        pick_street: "phố nhổn",
        hours: "8:00 - 17:00",
      },
      {
        id: "2",
        name: "Cửa hàng B",
        pick_province: "Hà Nội",
        pick_district: "Quận Hoàn Kiếm",
        pick_street: "phố nhổn",
        hours: "9:00 - 18:00",
      },
      {
        id: "3",
        name: "Cửa hàng C",
        pick_province: "Hà Nội",
        pick_district: "Quận Hoàn Kiếm",
        pick_street: "phố nhổn",
        hours: "10:00 - 19:00",
      },
    ]);
  }, []);

  // Hàm gọi API lấy danh sách tỉnh/thành
  const callAPI = async (api) => {
    try {
      const response = await fetch(api);
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // Hàm gọi API lấy danh sách quận/huyện
  const callApiDistrict = async (provinceId) => {
    try {
      const response = await fetch(`${host}p/${provinceId}?depth=2`);
      const data = await response.json();
      setDistricts(data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Hàm gọi API lấy danh sách phường/xã
  const callApiWard = async (districtId) => {
    try {
      const response = await fetch(`${host}d/${districtId}?depth=2`);
      const data = await response.json();
      setWards(data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  // Xử lý khi thay đổi tỉnh/thành
  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    setErrors((prev) => ({ ...prev, province: "", district: "", ward: "" }));
    callApiDistrict(provinceId);
  };

  // Xử lý khi thay đổi quận/huyện
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard("");
    setWards([]);
    setErrors((prev) => ({ ...prev, district: "", ward: "" }));
    callApiWard(districtId);
  };

  // Hàm kiểm tra tính hợp lệ của các trường thông tin
  const validateFields = () => {
    const newErrors = {};

    // Validate họ tên
    if (!customerName.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(customerName)) {
      newErrors.name = "Họ tên chỉ được chứa chữ cái và khoảng trắng";
    }

    // Validate số điện thoại  
    if (!phoneNumber) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneNumber)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Validate địa chỉ giao hàng
    if (deliveryMethod === "delivery") {
      if (!selectedProvince) {
        newErrors.province = "Vui lòng chọn tỉnh/thành";
      }
      if (!selectedDistrict) {
        newErrors.district = "Vui lòng chọn quận/huyện";  
      }
      if (!selectedWard) {
        newErrors.ward = "Vui lòng chọn phường/xã";
      }
      if (!specificAddress.trim()) {
        newErrors.address = "Vui lòng nhập địa chỉ cụ thể";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý thanh toán
  const handleCheckout = async (shippingFee) => {
    setLoading(true);
    try {
      if (validateFields()) {
        const orderData = {
          customerInfo: {
            name: customerName.trim(),
            phone: phoneNumber,
            email: email.trim(),
            address:
              deliveryMethod === "pickup"
                ? { store: selectedStore, pickupDate }
                : {
                    province: provinces.find(
                      (p) => p.code === parseInt(selectedProvince)
                    )?.name,
                    district: districts.find(
                      (d) => d.code === parseInt(selectedDistrict)
                    )?.name,
                    ward: wards.find(
                      (w) => w.code === parseInt(selectedWard)
                    )?.name,
                    specificAddress: specificAddress.trim(),
                  },
            paymentMethod: paymentMethod,
          },
          items: cartItems.map((item) => ({
            productId: item.maDinhDanh,
            quantity: quantities[item.maDinhDanh],
            price: parseFloat(item.donGia),
          })),
          shippingFee: shippingFee,
          totalAmount: totalAmount + shippingFee
        };

        // Lưu thông tin đơn hàng cuối cùng
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Chuyển hướng đến trang thành công
        navigate('/payment-success');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Có lỗi xảy ra khi xử lý đơn hàng'
      }));
    } finally {
      setLoading(false);
    }
  };

  // Render giao diện
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Thanh toán</h1>
          <Link 
            to="/cart" 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            <FaShoppingCart className="mr-2" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <div className="flex flex-wrap -mx-4">
          
          {/* Cột trái - Thông tin khách hàng */}
          <div className="w-full md:w-1/2 px-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin khách hàng
              </h2>

              <CustomerInformation
                customerName={customerName}
                setCustomerName={setCustomerName}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                email={email}
                setEmail={setEmail}
                errors={errors}
                setErrors={setErrors}
              />

              <DeliveryMethod
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                setErrors={setErrors}
                setPickupDate={setPickupDate}
              />

              {deliveryMethod === "pickup" && (
                <PickupInfo
                  stores={stores}
                  selectedStore={selectedStore}
                  setSelectedStore={setSelectedStore}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}

              {deliveryMethod === "shipping" && (
                <ShippingInfo
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  selectedProvince={selectedProvince}
                  selectedDistrict={selectedDistrict}
                  selectedWard={selectedWard}
                  specificAddress={specificAddress}
                  handleProvinceChange={handleProvinceChange}
                  handleDistrictChange={handleDistrictChange}
                  setSelectedWard={setSelectedWard}
                  setSpecificAddress={setSpecificAddress}
                  errors={errors}
                  setErrors={setErrors}
                  totalAmount={totalAmount}
                  setShippingFee={setShippingFee}
                  weight={weight}
                />
              )}

              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
          </div>

          {/* Cột phải - Tổng quan đơn hàng */}
          <div className="w-full md:w-1/2 px-4">
            <OrderSummary
              cartItems={cartItems}
              quantities={quantities}
              totalAmount={totalAmount}
              shippingFee={shippingFee}
              errors={errors}
              setErrors={setErrors}
              loading={loading}
              handleCheckout={handleCheckout}
              customerName={customerName}
              phoneNumber={phoneNumber}
              email={email}
              deliveryMethod={deliveryMethod}
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
              specificAddress={specificAddress}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
