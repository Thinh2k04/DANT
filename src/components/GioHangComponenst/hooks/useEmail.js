import { useState } from 'react';
import axios from 'axios';

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendOrderEmail = async ({
    email,
    customerName,
    cartItems,
    quantities,
    totalAmount,
    shippingFee,
    orderData,
    paymentMethod
  }) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      
      formData.append('to', email);
      formData.append('subject', 'Xác nhận đơn hàng - LaptopStore');
      
      const emailContent = `
        Kính gửi ${customerName},
        
        Cảm ơn bạn đã đặt hàng tại LaptopStore.
        
        Chi tiết đơn hàng:
        ${cartItems.map(item => `
          ${item.sanPhamChiTiet.hinhAnhMinhHoa}- ${item.sanPhamChiTiet.tenSanPhamChiTiet}: ${item.soLuong} x ${item.donGia.toLocaleString('vi-VN')}đ
        `).join('\n')}
        
        Tổng tiền hàng: ${totalAmount.toLocaleString('vi-VN')}đ
        Phí vận chuyển: ${shippingFee.toLocaleString('vi-VN')}đ
        Tổng thanh toán: ${(totalAmount + shippingFee).toLocaleString('vi-VN')}đ
        
        Phương thức thanh toán: ${paymentMethod}
        
        Trân trọng,
        LaptopStore
      `;
      
      formData.append('text', emailContent);

      await axios.post('http://localhost:8080/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      setError(error.message || 'Có lỗi xảy ra khi gửi email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    sendOrderEmail,
    loading,
    error 
  };
}; 