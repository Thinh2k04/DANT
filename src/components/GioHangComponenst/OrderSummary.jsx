// Import các thư viện và components cần thiết
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingInfo from './ShippingInfo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';

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
  userEmail // Email của khách hàng
}) {
  // Khởi tạo state cho modal QR và navigation
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const navigate = useNavigate();

  // Thêm state để theo dõi trạng thái disable của nút
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Hàm chuẩn bị dữ liệu đơn hàng để gửi lên server
  const prepareOrderData = () => {
    const now = new Date();
    // Lấy tên tỉnh/thành phố từ mã code
    const selectedProvinceName = provinces.find(
      p => p.code === parseInt(selectedProvince)
    )?.name || '';
 
    // Lấy tên quận/huyện từ mã code
    const selectedDistrictName = districts.find(
      d => d.code === parseInt(selectedDistrict)
    )?.name || '';

    // Xác định địa chỉ nhận hàng dựa trên phương thức giao hàng
    let deliveryAddress;
    
    // Nếu là pickup thì lấy địa chỉ cửa hàng
    if (deliveryMethod === "pickup") {
      const selectedStoreInfo = stores.find(store => store.id === parseInt(selectedStore));
      if (selectedStoreInfo) {
        deliveryAddress = `${selectedStoreInfo.tenCuaHang}, ${selectedStoreInfo.phuong}, ${selectedStoreInfo.huyen}, ${selectedStoreInfo.tinh}`;
      }
    } else {
      // Nếu là giao hàng thì sử dụng địa chỉ khách hàng nhập
      deliveryAddress = `${specificAddress || ''}, ${selectedWard || ''}, ${selectedDistrictName}, ${selectedProvinceName}`;
    }

    // Tạo object chứa thông tin đơn hàng
    const orderData = {
      // Thông tin tài khoản khách hàng
      tttk: {
        id: "",
        hoTen: customerName || '',
        diaChi: specificAddress || '',
        soCCCD: "",
        soDienThoai: phoneNumber || '',
        email: email || '',
        taiKhoanNguoiDung: null,
        trangThai: null
      },
      // Thông tin hóa đơn
      hd: {
        thoiGianLapHoaDon: now.toISOString(),
        tongTien: totalAmount + (shippingFee || 0),
        hinhThucThanhToan: {
          id: parseInt(paymentMethod) || 1
        },
        diaChiNhanHang: deliveryAddress,
        cuaHang: {
          id: deliveryMethod === "pickup" ? parseInt(selectedStore) : 1,
          trangThai: 1
        },
        voucher: null,
        trangThaiThanhToan: 2,
        trangThai: 0
      },
      // Chi tiết hóa đơn
      lhdct: cartItems.map(item => ({
        hoaDon: {
          id: ""
        },
        sanPhamChiTiet: {
          id: item?.id?.toString() || ''
        },
        soLuong: quantities[item?.id] || item?.soLuong || 1,
        gia: parseFloat(item?.donGia || 0)
      }))
    };
    return orderData;
  };
  console.log('hiển thị danh sách các phần tử trong hóa dơn chi tiết ')
  console.log(cartItems);

  // Hàm xử lý khi submit đơn hàng
  const handleOrderSubmit = async () => {
    try {
      setIsButtonDisabled(true);
      const orderData = prepareOrderData();
      
      // Gọi API tạo đơn hàng
      const response = await fetch('http://localhost:8080/rest/hoa_don/addHD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Sau khi tạo đơn hàng thành công, gửi email
      const pdfBlob = generatePDF();
      const formData = new FormData();
      
      formData.append('to', email);
      formData.append('subject', 'Xác nhận đơn hàng từ LaptopStore');
      
      // Tạo nội dung email
      const emailText = `
        Kính gửi ${customerName},

        Cảm ơn quý khách đã đặt hàng tại LaptopStore!

        THÔNG TIN ĐƠN HÀNG:
        ${cartItems.map(item => 
          `- ${item.tenSanPhamChiTiet}
           Số lượng: ${quantities[item.id] || item.soLuong || 1}
           Đơn giá: ${parseFloat(item.donGia).toLocaleString('vi-VN')}đ`
        ).join('\n')}

        Tổng tiền hàng: ${totalAmount.toLocaleString('vi-VN')}đ
        Phí vận chuyển: ${(shippingFee || 0).toLocaleString('vi-VN')}đ
        Tổng thanh toán: ${(totalAmount + (shippingFee || 0)).toLocaleString('vi-VN')}đ

        Địa chỉ nhận hàng: ${orderData.hd.diaChiNhanHang}
        Phương thức thanh toán: ${
          paymentMethod === "1" ? "Thanh toán khi nhận hàng" : 
          paymentMethod === "2" ? "Thanh toán qua MoMo" : 
          "Thanh toán qua ZaloPay"
        }

        Mọi thắc mắc xin vui lòng liên hệ:
        Hotline: 0123456789
        Email: support@laptopstore.com
        
        Trân trọng,
        LaptopStore
      `;

      formData.append('text', emailText);
      formData.append('file', pdfBlob, 'hoadon.pdf');

      // Gọi API gửi email
      const emailResponse = await axios.post('http://localhost:8080/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!emailResponse.data.success) {
        console.error('Lỗi gửi email:', emailResponse.data.message);
      }

      // Hiển thị thông báo thành công
      toast.success('Đặt hàng thành công!', {
        position: "top-center",
        autoClose: 2000,
      });

      // Chuyển hướng sang trang PaymentSuccess sau khi hiển thị toast
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            orderInfo: {
              tongTienHang: totalAmount,
              phiVanChuyen: shippingFee || 0,
              tttk: {
                hoTen: customerName,
                soDienThoai: phoneNumber,
                email: email
              },
              diaChiNhanHang: `${specificAddress}, ${wards.find(w => w.code === parseInt(selectedWard))?.name || ''}, ${districts.find(d => d.code === parseInt(selectedDistrict))?.name || ''}, ${provinces.find(p => p.code === parseInt(selectedProvince))?.name || ''}`,
              hinhThucThanhToan: {
                id: parseInt(paymentMethod),
                tenHinhThuc: paymentMethod === "1" ? "Thanh toán khi nhận hàng" : 
                            paymentMethod === "2" ? "Thanh toán qua MoMo" : 
                            "Thanh toán qua ZaloPay"
              },
              trangThaiDonHang: "Chờ xác nhận",
              cartItems: cartItems.map(item => ({
                ...item,
                soLuong: quantities[item?.id] || item?.soLuong || 1
              }))
            }
          },
          replace: true
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi xử lý đơn hàng', {
        position: "top-center",
        autoClose: 2000
      });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Hàm validate các trường dữ liệu
  const validateFields = () => {
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

    // Validate email (nếu có nhập)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      } else if (specificAddress.trim().length > 200) {
        newErrors.address = "Địa chỉ không được vượt quá 200 ký tự";
        isValid = false;
      }
    }

    // Validate giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      newErrors.cart = "Giỏ hàng không được để trống";
      isValid = false;
    }

    // Validate phương thức thanh toán
    if (!paymentMethod || paymentMethod === "") {
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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

  const handleOrderConfirmation = async () => {
    try {
      const pdfBlob = generatePDF();
      
      const formData = new FormData();
      formData.append('to', userEmail);
      formData.append('subject', 'Xác nhận đơn hàng từ LaptopStore');
      
      // Tạo nội dung email
      const emailText = `
        Cảm ơn bạn đã đặt hàng tại LaptopStore!
        
        Chi tiết đơn hàng:
        ${cartItems.map(item => `
          - ${item.name}
          Số lượng: ${item.quantity}
          Giá: ${item.price.toLocaleString('vi-VN')}đ
        `).join('\n')}
        
        Tổng tiền: ${totalAmount.toLocaleString('vi-VN')}đ
        
        Địa chỉ cửa hàng: [Địa chỉ của bạn]
        Hotline: [Số điện thoại]
      `;
      
      formData.append('text', emailText);
      formData.append('file', pdfBlob, 'hoadon.pdf');

      await axios.post('http://localhost:8080/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Hiển thị thông báo thành công
      alert('Đơn hàng đã được xác nhận và email đã được gửi!');
      
      // Xử lý sau khi gửi email thành công (ví dụ: clear giỏ hàng, chuyển hướng...)

    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      alert('Có lỗi xảy ra khi gửi email xác nhận đơn hàng');
    }
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
            <div className="text-red-500 text-sm mb-4">
              {errors.paymentMethod}
            </div>
          )}

          <button
            onClick={() => {
              if (validateFields()) {
                handleOrderSubmit();
              }
            }}
            disabled={loading || isButtonDisabled}
            className={`w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-xl
              hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${(loading || isButtonDisabled) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Đang xử lý..." : 
             isButtonDisabled ? "Vui lòng đợi" : 
             "Xác nhận đơn hàng"}
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;