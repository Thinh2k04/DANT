// Import các thư viện và components cần thiết
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingInfo from './ShippingInfo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { sendOrderConfirmationEmail } from './EmailOrder';
import { useOrder } from './hooks/useOrder';
import { useValidation } from './hooks/useValidation';
import { useShipping } from './hooks/useShipping';
import { useEmail } from './hooks/useEmail';

// Component OrderSummary để hiển thị và xử lý thông tin đơn hàng
function OrderSummary({ 
  provinces, // Danh sách tỉnh/thành phố
  districts, // Danh sách quận/huyện
  wards, // Danh sách phường/xã
  cartItems, // Danh sách sản phẩm trong giỏ hàng
  quantities, // Số lượng của từng sản phẩm
  totalAmount, // Tổng tiền đơn hàng
  shippingFee, // Phí vận chuyển
  errors, // Các lỗi validation
  setErrors, // Hàm set lỗi
  loading, // Trạng thái loading
  handleCheckout, // Hàm xử lý thanh toán
  customerName, // Tên khách hàng
  phoneNumber, // Số điện thoại
  email, // Email
  deliveryMethod, // Phương thức giao hàng
  selectedProvince, // Tỉnh/thành đã chọn
  selectedDistrict, // Quận/huyện đã chọn
  selectedWard, // Phường/xã đã chọn
  specificAddress, // Địa chỉ cụ thể
  paymentMethod, // Phương thức thanh toán
  selectedStore, // Cửa hàng đã chọn (cho pickup)
  stores, // Danh sách cửa hàng
  pickupDate, // Ngày nhận hàng (cho pickup)
  userEmail, // Email của khách hàng
  setShippingFee
}) {
  // Khởi tạo state cho modal QR và navigation
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const navigate = useNavigate();

  // Thêm state để theo dõi trạng thái disable của nút
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Thêm state để quản lý trạng thái loading
  const [isProcessing, setIsProcessing] = useState(false);

  const { 
    isProcessing: orderProcessing, 
    isButtonDisabled: orderButtonDisabled, 
    prepareOrderData, 
    handleOrderSubmit 
  } = useOrder();
  
  const { validateFields } = useValidation(setErrors);
  const { calculateShippingFee } = useShipping(setShippingFee);
  const { sendOrderEmail } = useEmail();

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Thiết lập font chữ để hỗ trợ tiếng Việt
    doc.setFont('helvetica');
    
    // Thêm tiêu đề
    doc.setFontSize(20);
    doc.text('HÓA ĐƠN BÁN HÀNG', 105, 20, { align: 'center' });
    
    // Thông tin khách hàng
    doc.setFontSize(12);
    doc.text(`Khách hàng: ${customerName}`, 20, 40);
    doc.text(`Số điện thoại: ${phoneNumber}`, 20, 50);
    doc.text(`Email: ${email}`, 20, 60);
    doc.text(`Địa chỉ: ${specificAddress || 'N/A'}`, 20, 70);
    doc.text(`Ngày đặt hàng: ${new Date().toLocaleDateString('vi-VN')}`, 20, 80);

    // Header cho bảng sản phẩm
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 90, 170, 10, 'F');
    doc.text('STT', 25, 97);
    doc.text('Tên sản phẩm', 45, 97);
    doc.text('Số lượng', 120, 97);
    doc.text('Đơn giá', 145, 97);
    doc.text('Thành tiền', 170, 97);

    // Chi tiết sản phẩm
    let yPos = 105;
    cartItems.forEach((item, index) => {
      doc.text(`${index + 1}`, 25, yPos);
      doc.text(item.tenSanPhamChiTiet.substring(0, 40), 45, yPos);
      doc.text(`${quantities[item.id] || item.soLuong || 1}`, 120, yPos);
      doc.text(`${parseFloat(item.donGia).toLocaleString('vi-VN')}đ`, 145, yPos);
      const thanhTien = (quantities[item.id] || item.soLuong || 1) * parseFloat(item.donGia);
      doc.text(`${thanhTien.toLocaleString('vi-VN')}đ`, 170, yPos);
      yPos += 10;
    });

    // Tổng tiền
    yPos += 10;
    doc.line(20, yPos - 5, 190, yPos - 5); // Vẽ đường kẻ
    doc.text(`Tổng tiền hàng: ${totalAmount.toLocaleString('vi-VN')}đ`, 130, yPos);
    doc.text(`Phí vận chuyển: ${(shippingFee || 0).toLocaleString('vi-VN')}đ`, 130, yPos + 10);
    doc.text(`Tổng cộng: ${(totalAmount + (shippingFee || 0)).toLocaleString('vi-VN')}đ`, 130, yPos + 20);

    // Chuyển PDF thành blob
    return doc.output('blob');
  };

  const handleBankPayment = async () => {
    // ... rest of handleBankPayment code
  };

  const handleOrderConfirmation = async () => {
    try {
        const orderData = prepareOrderData();
        const orderResult = await handleOrderSubmit(orderData);

        if (orderResult.success) {
            const emailSuccess = await sendOrderEmail({
                email: userEmail,
                subject: "Order Confirmation",
                body: "Your order has been confirmed."
            });

            if (emailSuccess) {
                toast.success("Order confirmed and email sent!");
            } else {
                toast.error("Order confirmed but email failed to send.");
            }

            navigate('/payment-success');
        } else {
            toast.error("Failed to process order.");
        }
    } catch (error) {
        console.error('Order processing error:', error);
        toast.error("Error processing order.");
    }
  };

  // Thêm hàm clearCart để xóa giỏ hàng
  const clearCart = () => {
    try {
      // Lấy danh sách sản phẩm hiện tại trong giỏ hàng
      const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      
      // Lọc ra các sản phẩm không nằm trong đơn hàng hiện tại
      const remainingItems = currentCartItems.filter(cartItem => 
        !cartItems.some(orderItem => orderItem.id === cartItem.id)
      );

      // Cập nhật lại localStorage với các sản phẩm còn lại
      if (remainingItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(remainingItems));
      } else {
        localStorage.removeItem('cartItems');
      }

      // Trigger event để cập nhật số lượng trong navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Sử dụng các hooks trong component
  const handleOrder = async () => {
    if (!validateFields({
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
    })) {
      return;
    }

    const orderData = prepareOrderData({
      customerName,
      phoneNumber,
      email,
      deliveryMethod,
      selectedStore,
      stores,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      specificAddress,
      provinces,
      districts,
      cartItems,
      quantities,
      totalAmount,
      shippingFee,
      paymentMethod
    });

    await handleOrderSubmit(
      orderData,
      email,
      customerName,
      cartItems,
      quantities,
      totalAmount,
      shippingFee,
      paymentMethod,
      phoneNumber,
      specificAddress
    );
  };

  // Render component
  return (
    <>
      {/* Container chính */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Thông tin đơn hàng
        </h2>

        {/* Hiển thị lỗi giỏ hàng nếu có */}
        {errors.cart && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {errors.cart}
          </div>
        )}

        {/* Danh sách sản phẩm trong giỏ hàng */}
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

          {errors.paymentMethod && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.paymentMethod}
            </div>
          )}

          <button
            onClick={() => {
              if (validateFields({
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
              })) {
                handleOrder();
              }
            }}
            disabled={loading || isButtonDisabled || isProcessing || !paymentMethod}
            className={`w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-xl
              hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${(loading || isButtonDisabled || isProcessing || !paymentMethod) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Đang xử lý..." : 
             isProcessing ? "Vui lòng đợi..." :
             !paymentMethod ? "Vui lòng chọn phương thức thanh toán" :
             isButtonDisabled ? "Vui lòng đợi" : 
             "Xác nhận đơn hàng"}
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;