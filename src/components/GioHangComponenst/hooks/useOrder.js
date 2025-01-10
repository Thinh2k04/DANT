import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEmail } from './useEmail';

export const useOrder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const { sendOrderEmail } = useEmail();

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
    paymentMethod
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
        deliveryAddress = `${selectedStoreInfo.tenCuaHang}, ${selectedStoreInfo.phuong}, ${selectedStoreInfo.huyen}, ${selectedStoreInfo.tinh}`;
      }
    } else {
      deliveryAddress = `${specificAddress || ''}, ${selectedWard || ''}, ${selectedDistrictName}, ${selectedProvinceName}`;
    }

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
  };

  const clearCart = () => {
    try {
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
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

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderResponseData = await orderResponse.json();

      // 2. Xóa giỏ hàng
      await clearCart();

      // 3. Chuyển hướng đến trang thành công
      navigate('/payment-success', {
        state: {
          orderInfo: {
            id: orderResponseData?.id || '',
            tongTienHang: totalAmount,
            phiVanChuyen: shippingFee || 0,
            tttk: {
              hoTen: customerName,
              soDienThoai: phoneNumber,
              email: email,
              diaChi: specificAddress
            },
            diaChiNhanHang: orderResponseData?.diaChiNhanHang,
            hinhThucThanhToan: {
              id: paymentMethod,
              tenHinhThuc: paymentMethod === "1" ? "Thanh toán khi nhận hàng" : "Thanh toán qua ZaloPay"
            },
            trangThaiDonHang: "Chờ xác nhận",
            thoiGianLapHoaDon: new Date().toISOString(),
            cartItems: cartItems.map(item => ({
              ...item,
              soLuong: quantities[item.id] || 1
            }))
          }
        },
        replace: true
      });

      toast.success('Đặt hàng thành công!');

      // 4. Gửi email sau khi đã chuyển trang
      if (email) {
        try {
          const emailData = {
            email,
            customerName,
            cartItems,
            quantities,
            totalAmount,
            shippingFee,
            orderData: {
              id: orderResponseData.id,
              diaChiNhanHang: orderResponseData.diaChiNhanHang,
              tongTien: orderResponseData.tongTien
            },
            paymentMethod
          };

          // Sử dụng setTimeout để đảm bảo email được gửi sau khi đã chuyển trang
          setTimeout(async () => {
            try {
              const emailResult = await sendOrderEmail(emailData);
              if (emailResult) {
                toast.success('Đã gửi email xác nhận đơn hàng');
              }
            } catch (emailError) {
              console.error('Email error:', emailError);
              toast.warning('Không thể gửi email xác nhận. Đơn hàng vẫn được tạo thành công');
            }
          }, 1000); // Delay 1 giây để đảm bảo trang đã chuyển xong
        } catch (emailError) {
          console.error('Email error:', emailError);
          toast.warning('Không thể gửi email xác nhận. Đơn hàng vẫn được tạo thành công');
        }
      }

    } catch (error) {
      console.error('Order error:', error);
      toast.error('Có lỗi xảy ra khi xử lý đơn hàng');
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