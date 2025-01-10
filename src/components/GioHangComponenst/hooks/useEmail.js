import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInvoicePDF = (orderData) => {
    const doc = new jsPDF();
    
    // Thêm tiêu đề
    doc.setFontSize(20);
    doc.text('HÓA ĐƠN BÁN HÀNG', 105, 20, { align: 'center' });
    
    // Thông tin khách hàng
    doc.setFontSize(12);
    doc.text(`Khách hàng: ${orderData.customerName}`, 20, 40);
    doc.text(`Email: ${orderData.email}`, 20, 50);
    doc.text(`Ngày đặt hàng: ${new Date().toLocaleDateString('vi-VN')}`, 20, 60);
    
    // Tạo bảng sản phẩm
    const tableData = orderData.cartItems.map(item => [
      item.sanPhamChiTiet?.tenSanPham,
      item.soLuong,
      `${item.donGia.toLocaleString('vi-VN')}đ`,
      `${(item.soLuong * item.donGia).toLocaleString('vi-VN')}đ`
    ]);

    doc.autoTable({
      startY: 70,
      head: [['Sản phẩm', 'Số lượng', 'Đơn giá', 'Thành tiền']],
      body: tableData,
    });

    // Thông tin tổng tiền
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Tổng tiền hàng: ${orderData.totalAmount.toLocaleString('vi-VN')}đ`, 20, finalY);
    doc.text(`Phí vận chuyển: ${orderData.shippingFee.toLocaleString('vi-VN')}đ`, 20, finalY + 10);
    doc.text(`Tổng thanh toán: ${(orderData.totalAmount + orderData.shippingFee).toLocaleString('vi-VN')}đ`, 20, finalY + 20);
    
    // Convert PDF to blob
    return doc.output('blob');
  };

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

      // Tạo form-data object
      const formData = new FormData();
      
      // Thêm các trường dữ liệu vào form-data
      formData.append('to', email);
      formData.append('subject', 'Xác nhận đơn hàng - LaptopStore');
      
      // Tạo nội dung email
      const emailContent = `
        Kính gửi ${customerName},
        
        Cảm ơn bạn đã đặt hàng tại LaptopStore.
        
        Chi tiết đơn hàng:
        ${cartItems.map(item => `
          - ${item.sanPhamChiTiet?.tenSanPham}: ${item.soLuong} x ${item.donGia.toLocaleString('vi-VN')}đ
        `).join('\n')}
        
        Tổng tiền hàng: ${totalAmount.toLocaleString('vi-VN')}đ
        Phí vận chuyển: ${shippingFee.toLocaleString('vi-VN')}đ
        Tổng thanh toán: ${(totalAmount + shippingFee).toLocaleString('vi-VN')}đ
        
        Phương thức thanh toán: ${paymentMethod}
        
        Trân trọng,
        LaptopStore
      `;
      
      formData.append('text', emailContent);

      // Tạo và thêm file PDF
      const pdfBlob = generateInvoicePDF({
        customerName,
        email,
        cartItems,
        totalAmount,
        shippingFee,
        paymentMethod
      });
      formData.append('file', pdfBlob, 'hoadon.pdf');

      // Gọi API backend
      const response = await axios.post('http://localhost:8080/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        return true;
      }
      return false;
      
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