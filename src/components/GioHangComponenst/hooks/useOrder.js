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

      // Kiểm tra response và chuyển hướng
      if (orderResponse.ok) {
        // Xóa giỏ hàng
        await clearCart(cartItems);

        // Hiển thị thông báo thành công
        toast.success('Đặt hàng thành công!');

        // Chuyển hướng với dữ liệu đơn hàng
        navigate('/payment-success', {
          state: {
            orderInfo: {
              hoaDon: {
                id: responseData.id,
                maHoaDon: responseData.maHoaDon,
                tongTien: totalAmount + shippingFee,
                phiVanChuyen: shippingFee,
                diaChiNhanHang: orderData.hd.diaChiNhanHang,
                hinhThucThanhToan: paymentMethod === "1" ? "Thanh toán khi nhận hàng" : "Thanh toán qua ZaloPay",
                thoiGianLapHoaDon: new Date().toISOString(),
                trangThaiThanhToan: 1
              },
              listHDCT: cartItems.map(item => ({
                id: item.id,
                tenSanPham: item.tenSanPhamChiTiet,
                donGia: item.donGia,
                soLuong: quantities[item.id] || 1
              }))
            }
          },
          replace: true
        });

        // Gửi email xác nhận
        if (email) {
          try {
            await sendOrderConfirmationEmail({
              email,
              customerName,
              cartItems,
              quantities,
              totalAmount,
              shippingFee,
              orderData,
              paymentMethod
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