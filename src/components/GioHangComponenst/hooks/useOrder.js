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
    
    // Kiểm tra và lấy tên địa chỉ an toàn
    const getLocationName = (array, code) => {
      if (!array || !Array.isArray(array)) return '';
      const item = array.find(item => item.code === parseInt(code));
      return item ? item.name : '';
    };

    // Lấy tên địa chỉ an toàn
    const provinceName = getLocationName(provinces, selectedProvince);
    const districtName = getLocationName(districts, selectedDistrict);
    
    // Tạo địa chỉ đầy đủ
    const deliveryAddress = `${specificAddress || ''}, ${selectedWard || ''}, ${districtName}, ${provinceName}`.replace(/^[\s,]+|[\s,]+$/g, '');

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      tttk: {
        id: "",
        hoTen: customerName?.trim() || '',
        diaChi: specificAddress?.trim() || '',
        soCCCD: "",
        soDienThoai: phoneNumber || '',
        email: email?.trim() || '',
        taiKhoanNguoiDung: null,
        trangThai: null
      },
      hd: {
        thoiGianLapHoaDon: now.toISOString(),
        tongTien: (totalAmount || 0) + (shippingFee || 0),
        phiVanChuyen: shippingFee || 0,
        hinhThucThanhToan: {
          id: parseInt(paymentMethod) || 1
        },
        diaChiNhanHang: deliveryAddress,
        cuaHang: {
          id: 1,
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
      lhdct: (cartItems || []).map(item => ({
        hoaDon: {
          id: ""
        },
        sanPhamChiTiet: {
          id: item?.id?.toString() || ''
        },
        soLuong: quantities?.[item?.id] || 1,
        gia: parseFloat(item?.donGia || 0)
      }))
    };

    return orderData;
  };

  const clearCart = async (purchasedItems) => {
    try {
      // Xóa toàn bộ giỏ hàng vì chỉ có một đơn hàng
      localStorage.removeItem('cartItems');
      localStorage.removeItem('quantities');
      localStorage.removeItem('shippingFee');

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
    cartItems,
    quantities, 
    totalAmount, 
    shippingFee, 
    paymentMethod
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

      const responseData = await orderResponse.json();

      if (orderResponse.ok) {
        // Xóa giỏ hàng
        await clearCart(cartItems);

        // Hiển thị thông báo thành công
        toast.success('Đặt hàng thành công!');

        const orderInfo = {
          hoaDon: {
            maHoaDon: responseData.hoaDon.maHoaDon,
            tenCuaHang: responseData.hoaDon.tenCuaHang,
            thoiGianLapHoaDon: responseData.hoaDon.thoiGianLapHoaDon,
            tongTien: responseData.hoaDon.tongTien,
            phiVanChuyen: responseData.hoaDon.phiVanChuyen,
            hinhThucThanhToan: responseData.hoaDon.hinhThucThanhToan,
            diaChiNhanHang: responseData.hoaDon.diaChiNhanHang,
            trangThaiThanhToan: responseData.hoaDon.trangThaiThanhToan,
            trangThai: responseData.hoaDon.trangThai
          },
          listHDCT: responseData.listHDCT,
          timeline: responseData.timeline
        };

        // Chuyển hướng với dữ liệu đơn hàng
        navigate('/payment-success', {
          state: { orderInfo },
          replace: true
        });

        // Gửi email xác nhận nếu có email
        if (email) {
          try {
            await sendOrderConfirmationEmail({
              email,
              customerName,
              orderDetails: {
                products: orderInfo.listHDCT,
                totalAmount: orderInfo.hoaDon.tongTien,
                shippingFee: orderInfo.hoaDon.phiVanChuyen,
                orderNumber: orderInfo.hoaDon.maHoaDon,
                shippingAddress: orderInfo.hoaDon.diaChiNhanHang,
                paymentMethod: orderInfo.hoaDon.hinhThucThanhToan,
                orderTime: orderInfo.hoaDon.thoiGianLapHoaDon
              }
            });
            toast.success('Đã gửi email xác nhận đơn hàng');
          } catch (emailError) {
            console.error('Email error:', emailError);
            toast.warning('Không thể gửi email xác nhận. Đơn hàng vẫn được tạo thành công');
          }
        }
      } else {
        throw new Error(responseData.message || 'Có lỗi xảy ra khi tạo đơn hàng');
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