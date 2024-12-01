import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingInfo from './ShippingInfo';

function OrderSummary({ 
  provinces, // Danh sách tỉnh/thành phố
  districts, // Danh sách quận/huyện
  wards, // Danh sách phường/xã
  cartItems, 
  quantities, 
  totalAmount, 
  shippingFee, 
  errors,
  setErrors, 
  loading, 
  handleCheckout,
  customerName,
  phoneNumber,
  email,
  deliveryMethod,
  selectedProvince,
  selectedDistrict, 
  selectedWard,
  specificAddress,
  paymentMethod
}) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const prepareOrderData = () => {
    const now = new Date();
    // Lấy tên tỉnh/thành phố từ mã code
    const selectedProvinceName = provinces.find(
      p => p.code === parseInt(selectedProvince)
    )?.name;
 
    // Lấy tên quận/huyện từ mã code
    const selectedDistrictName = districts.find(
      d => d.code === parseInt(selectedDistrict)
    )?.name;

    const orderData = {
      tttk: {
        id: "",
        hoTen: customerName,
        diaChi: specificAddress,
        soCCCD: "",
        soDienThoai: phoneNumber,
        email: email,
        taiKhoanNguoiDung: null,
        trangThai: null
      },
      hd: {
        thoiGianLapHoaDon: now.toISOString(),
        tongTien: totalAmount + (shippingFee || 0),
        hinhThucThanhToan: {
          id: parseInt(paymentMethod)
        },
        diaChiNhanHang: `${specificAddress}, ${selectedWard}, ${selectedDistrictName}, ${selectedProvinceName}`,
        cuaHang: {
          id: 1,
          tinh: selectedProvince,
          huyen: selectedDistrict,
          thoiGianMoCua: "08:00",
          thoiGianDongCua: "18:00",
          trangThai: 1
        },
        voucher: null,
        trangThaiThanhToan: 0,
        trangThai: 0
      },
      lhdct: cartItems.map(item => ({
        hoaDon: {
          id: ""
        },
        sanPhamChiTiet: {
          id: item.id.toString()
        },
        soLuong: quantities[item.id] || item.soLuong || 1,
        gia: parseFloat(item.donGia)
      }))
    };
    return orderData;
  };

  const handleOrderSubmit = async () => {
    try {
      // If payment method is MoMo or VNPay (2 or 3)
      if (paymentMethod === "2" || paymentMethod === "3") {
        // Format payment data according to API requirements
        const paymentData = {
          userId: localStorage.getItem('sub') || "1",
          totalAmount: totalAmount + (shippingFee || 0),
          items: cartItems.map(item => ({
            product_id: item.id?.toString() || "",
            quantity: quantities[item.id] || 1,
            price: parseFloat(item.donGia || 0)
          })).filter(item => item.product_id)
        };
        
        // Call payment API
        const paymentResponse = await fetch('http://localhost:8080/api/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        });
        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment');
        }

        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.order_url) {
          setPaymentUrl(paymentResult.order_url);
          try {
            const pageResponse = await fetch(paymentResult.order_url);
            const pageHtml = await pageResponse.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageHtml, 'text/html');
            
            const evaluator = new XPathEvaluator();
            const expression = evaluator.createExpression('//*[@id="zp-qr"]/div[1]/div/div');
            const result = expression.evaluate(doc, XPathResult.FIRST_ORDERED_NODE_TYPE);
            
            if (result.singleNodeValue) {
              const qrElement = result.singleNodeValue;
              setQrCodeSvg(qrElement.innerHTML);
              setShowQrModal(true);
            } else {
              throw new Error('QR code not found');
            }
          } catch (error) {
            console.error('Error extracting QR code:', error);
            window.open(paymentResult.order_url, '_blank');
          }
          return;
        }
      }

      // Continue with normal order submission for COD
      const orderData = prepareOrderData();
      
      const response = await fetch('http://localhost:8080/rest/hoa_don/addHD', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        toast.error('Có lỗi xảy ra khi tạo đơn hàng', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        throw new Error('Lỗi khi tạo đơn hàng');
      }

      const result = await response.json();
      toast.success('Đặt hàng thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleCheckout(result);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // Validate họ tên
    if (!customerName?.trim()) {
      toast.warning('Vui lòng nhập họ tên', {
        position: "top-right",
        autoClose: 3000
      });
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(customerName)) {
      toast.warning('Họ tên chỉ được chứa chữ cái và khoảng trắng', {
        position: "top-right",
        autoClose: 3000
      });
      newErrors.name = "Họ tên chỉ được chứa chữ cái và khoảng trắng";
    }

    // Validate số điện thoại  
    if (!phoneNumber) {
      toast.warning('Vui lòng nhập số điện thoại', {
        position: "top-right",
        autoClose: 3000
      });
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneNumber)) {
      toast.warning('Số điện thoại không hợp lệ', {
        position: "top-right",
        autoClose: 3000
      });
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Validate địa chỉ giao hàng nếu chọn giao hàng
    if (deliveryMethod === "delivery") {
      if (!selectedProvince) {
        toast.warning('Vui lòng chọn tỉnh/thành', {
          position: "top-right",
          autoClose: 3000
        });
        newErrors.province = "Vui lòng chọn tỉnh/thành";
      }
      if (!selectedDistrict) {
        toast.warning('Vui lòng chọn quận/huyện', {
          position: "top-right",
          autoClose: 3000
        });
        newErrors.district = "Vui lòng chọn quận/huyện";  
      }
      if (!selectedWard) {
        toast.warning('Vui lòng chọn phường/xã', {
          position: "top-right",
          autoClose: 3000
        });
        newErrors.ward = "Vui lòng chọn phường/xã";
      }
      if (!specificAddress?.trim()) {
        toast.warning('Vui lòng nhập địa chỉ cụ thể', {
          position: "top-right",
          autoClose: 3000
        });
        newErrors.address = "Vui lòng nhập địa chỉ cụ thể";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Thông tin đơn hàng
        </h2>

        {errors.cart && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {errors.cart}
          </div>
        )}

        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item?.id || Math.random()} className="flex items-start space-x-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={item?.hinhAnhMinhHoa || '/placeholder-image.jpg'}
                  alt={item?.tenSanPhamChiTiet || 'Sản phẩm'}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {item?.tenSanPhamChiTiet || 'Đang tải...'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Đơn giá:</span>
                    <span className="font-semibold text-red-600">
                      {(parseFloat(item?.donGia || 0)).toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Số lượng:</span>
                    <span className="font-semibold">
                      {quantities[item?.id] || item?.soLuong || 1}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 col-span-2">
                    <span className="text-gray-500">Thành tiền:</span>
                    <span className="font-bold text-red-600">
                      {((quantities[item?.id] || item?.soLuong || 1) * parseFloat(item?.donGia || 0)).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4 border-t pt-6">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-bold text-gray-800">
              {totalAmount.toLocaleString("vi-VN")}₫
            </span>
          </div>

          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-bold text-gray-800">
              {deliveryMethod === "pickup" ? 
                'Miễn phí' : 
                (shippingFee ? `${Number(shippingFee).toLocaleString("vi-VN")}₫` : 'Miễn phí')
              }
            </span>
          </div>

          <div className="flex justify-between items-center text-xl pt-4 border-t">
            <span className="font-bold text-gray-800">Tổng cộng:</span>
            <span className="font-bold text-2xl text-red-600">
              {(totalAmount + (deliveryMethod === "pickup" ? 0 : (shippingFee || 0)))
                .toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        <div className="mt-8">
          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {errors.submit}
            </div>
          )}
          
          {errors.name && (
            <div className="text-red-500 text-sm mb-4">
              {errors.name}
            </div>
          )}

          {errors.phone && (
            <div className="text-red-500 text-sm mb-4">
              {errors.phone} 
            </div>
          )}

          {errors.province && (
            <div className="text-red-500 text-sm mb-4">
              {errors.province}
            </div>
          )}

          {errors.district && (
            <div className="text-red-500 text-sm mb-4">
              {errors.district}
            </div>
          )}

          {errors.ward && (
            <div className="text-red-500 text-sm mb-4">
              {errors.ward}
            </div>
          )}

          {errors.address && (
            <div className="text-red-500 text-sm mb-4">
              {errors.address}
            </div>
          )}

          <button
            onClick={() => {
              if (validateFields()) {
                handleOrderSubmit();
              }
            }}
            disabled={loading}
            className={`w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-xl
              hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "đang xử lý..." : "Xác nhận đơn hàng"}
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Quét mã để thanh toán</h3>
            
            <div className="flex justify-center mb-4">
              <div 
                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                className="w-64 h-64"
              />
            </div>

            <p className="text-gray-600 text-center mb-4">
              Vui lòng quét mã QR để thanh toán số tiền{' '}
              <span className="font-semibold text-green-600">
                {(totalAmount + (shippingFee || 0)).toLocaleString('vi-VN')}₫
              </span>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Đóng
              </button>
              <button
                onClick={() => window.open(paymentUrl, '_blank')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Mở trang thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderSummary;