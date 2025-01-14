import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { sendOrderConfirmationEmail } from '../EmailOrder';

export const useOrder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const prepareOrderData = ({
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
    paymentMethod,
    appliedVoucher
  }) => {
    const now = new Date();
    const selectedProvinceName = provinces.find(
      p => p.code === parseInt(selectedProvince)
    )?.name || '';
    
    const selectedDistrictName = districts.find(
      d => d.code === parseInt(selectedDistrict)
    )?.name || '';

    let deliveryAddress;
    if (deliveryMethod === "pickup") {
      const selectedStoreInfo = stores.find(store => store.id === parseInt(selectedStore));
      if (selectedStoreInfo) {
        deliveryAddress = `${selectedStoreInfo.soNha}, ${selectedStoreInfo.phuong}, ${selectedStoreInfo.huyen}, ${selectedStoreInfo.tinh}`;
      }
    } else {
      deliveryAddress = `${specificAddress || ''}, ${selectedWard || ''}, ${selectedDistrictName}, ${selectedProvinceName}`;
    }

    // Tính phí vận chuyển dựa trên phương thức giao hàng
    const calculatedShippingFee = deliveryMethod === "pickup" ? 0 : (shippingFee || 0);

    return {
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
      hd: {
        thoiGianLapHoaDon: now.toISOString(),
        tongTien: totalAmount + calculatedShippingFee,
        phiVanChuyen: calculatedShippingFee,
        hinhThucThanhToan: {
          id: parseInt(paymentMethod) || 1
        },
        diaChiNhanHang: deliveryAddress,
        cuaHang: {
          id: deliveryMethod === "pickup" ? parseInt(selectedStore) : 1,
          tinh: "Hà Nội",
          huyen: "Hoàn Kiếm",
          phuong: "Phường 1",
          soNha: "Số 123, Đường ABC",
          thoiGianMoCua: "08:00",
          thoiGianDongCua: "18:00",
          trangThai: 1
        },
        voucher: appliedVoucher ? {
          id: appliedVoucher.id,
          maVoucher: appliedVoucher.maVoucher,
          soLuong: appliedVoucher.soLuong || 100,
          thoiGianHenKet: appliedVoucher.thoiGianHenKet,
          soTienToiDa: appliedVoucher.soTienToiDa || 500000.0,
          dieuKienApDung: appliedVoucher.dieuKienApDung || 300000.0,
          soTienApDung: appliedVoucher.soTienApDung || 100000.0,
          phanTramApDung: appliedVoucher.phanTramApDung || null,
          thoiGianApDung: now.toISOString(),
          trangThai: null
        } : null,
        trangThaiThanhToan: 2,
        trangThai: 0
      },
      lhdct: cartItems.map(item => ({
        hoaDon: {
          id: ""
        },
        sanPhamChiTiet: {
          id: item?.id?.toString() || ''
        },
        soLuong: quantities[item?.id] || 1,
        gia: parseFloat(item?.donGia || 0)
      }))
    };
  };

  const clearCart = async (purchasedItems) => {
    try {
      // Lấy danh sách sản phẩm hiện tại trong giỏ hàng
      const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      
      // Lọc ra các sản phẩm không nằm trong đơn hàng
      const remainingItems = currentCartItems.filter(cartItem => 
        !purchasedItems.some(purchasedItem => purchasedItem.id === cartItem.id)
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
      throw error;
    }
  };

  const handleOrderSubmit = async (
    orderData, 
    email, 
    customerName, 
    cartItems, // Danh sách sản phẩm được mua
    quantities, 
    totalAmount, 
    shippingFee, 
    paymentMethod,
    phoneNumber,
    specificAddress
  ) => {
    try {
      setIsProcessing(true);
      setIsButtonDisabled(true);
      
      const orderResponse = await fetch('http://localhost:8080/rest/hoa_don/addHD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const orderResponseData = await orderResponse.json();

      // Kiểm tra response có thành công không
      if (!orderResponse.ok || !orderResponseData.success) {
        throw new Error(orderResponseData.message || 'Failed to create order');
      }

      // Xóa chỉ những sản phẩm đã mua khỏi giỏ hàng
      await clearCart(cartItems);

      // Hiển thị thông báo thành công
      toast.success('Đặt hàng thành công!');

      // Chuyển hướng với dữ liệu từ API response
      navigate('/payment-success', {
        state: {
          orderInfo: {
            id: orderResponseData.hoaDon.id,
            maHoaDon: orderResponseData.hoaDon.maHoaDon,
            tongTienHang: orderResponseData.hoaDon.tongTien - orderResponseData.hoaDon.phiVanChuyen,
            phiVanChuyen: orderResponseData.hoaDon.phiVanChuyen,
            tttk: {
              hoTen: orderResponseData.hoaDon.thongTinTaiKhoan.hoTen,
              soDienThoai: orderResponseData.hoaDon.thongTinTaiKhoan.soDienThoai,
              email: orderResponseData.hoaDon.thongTinTaiKhoan.email,
              diaChi: orderResponseData.hoaDon.thongTinTaiKhoan.diaChi
            },
            diaChiNhanHang: orderResponseData.hoaDon.diaChiNhanHang,
            hinhThucThanhToan: {
              id: orderResponseData.hoaDon.hinhThucThanhToan.id,
              tenHinhThuc: orderResponseData.hoaDon.hinhThucThanhToan.tenHinhThuc
            },
            trangThaiDonHang: orderResponseData.hoaDon.trangThai === 0 ? "Chờ xác nhận" : "Đã xác nhận",
            thoiGianLapHoaDon: new Date(orderResponseData.hoaDon.thoiGianLapHoaDon).toISOString(),
            cartItems: orderResponseData.listHDCT.map(item => ({
              id: item.id,
              tenSanPhamChiTiet: item.tenSanPhamChiTiet,
              donGia: item.donGia,
              soLuong: item.soLuong,
              hinhAnhMinhHoa: item.hinhAnhMinhHoa,
              sanPhamChiTiet: {
                id: item.idSanPham,
                tenSanPham: item.tenSanPham,
                thuongHieu: item.thuongHieu,
                // Thêm các thông tin chi tiết khác nếu cần
                chatLieu: item.chatLieu,
                dungLuongRam: item.dungLuongRam,
                dungLuong: item.dungLuong,
                doPhanGiai: item.doPhanGiai,
                kichThuocLaptop: item.kichThuocLaptop,
                tamNen: item.tamNen,
                tanSoQuet: item.tanSoQuet,
                cpu: item.tenCPU,
                gpu: item.gpu,
                trongLuong: item.trongLuong,
                pin: item.pin,
                thoiHanBaoHanh: item.thoiHanBaoHanh
              }
            })),
            voucher: orderResponseData.hoaDon.voucher,
            cuaHang: orderResponseData.hoaDon.cuaHang,
            trangThaiThanhToan: orderResponseData.hoaDon.trangThaiThanhToan
          }
        },
        replace: true
      });

      // Gửi email xác nhận
      if (email) {
        try {
          const emailData = {
            email,
            customerName,
            cartItems,
            quantities,
            totalAmount,
            shippingFee,
            orderData,
            paymentMethod
          };

          const emailResult = await sendOrderConfirmationEmail(emailData);
          if (emailResult) {
            toast.success('Đã gửi email xác nhận đơn hàng');
          }
        } catch (emailError) {
          console.error('Email error:', emailError);
          toast.warning('Không thể gửi email xác nhận. Đơn hàng vẫn được tạo thành công');
        }
      }

    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xử lý đơn hàng');
    } finally {
      setIsProcessing(false);
      setIsButtonDisabled(false);
    }
  };

  return {
    isProcessing,
    isButtonDisabled,
    prepareOrderData,
    handleOrderSubmit
  };
}; 