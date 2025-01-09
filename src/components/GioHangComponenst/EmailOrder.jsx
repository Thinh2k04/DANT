import axios from 'axios';
import { jsPDF } from 'jspdf';

const generateOrderPDF = ({
  customerName,
  cartItems,
  quantities,
  totalAmount,
  shippingFee,
  orderData,
  paymentMethod
}) => {
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  doc.setFontSize(20);
  doc.text('HÓA ĐƠN BÁN HÀNG', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Khách hàng: ${customerName}`, 20, 40);
  doc.text(`Địa chỉ: ${orderData.hd.diaChiNhanHang}`, 20, 50);
  doc.text(`Ngày đặt hàng: ${new Date().toLocaleDateString('vi-VN')}`, 20, 60);

  // Header cho bảng sản phẩm
  doc.setFillColor(230, 230, 230);
  doc.rect(20, 70, 170, 10, 'F');
  doc.text('STT', 25, 77);
  doc.text('Tên sản phẩm', 45, 77);
  doc.text('Số lượng', 120, 77);
  doc.text('Đơn giá', 145, 77);
  doc.text('Thành tiền', 170, 77);

  let yPos = 85;
  cartItems.forEach((item, index) => {
    doc.text(`${index + 1}`, 25, yPos);
    doc.text(item.tenSanPhamChiTiet.substring(0, 40), 45, yPos);
    doc.text(`${quantities[item.id] || item.soLuong || 1}`, 120, yPos);
    doc.text(`${parseFloat(item.donGia).toLocaleString('vi-VN')}đ`, 145, yPos);
    const thanhTien = (quantities[item.id] || item.soLuong || 1) * parseFloat(item.donGia);
    doc.text(`${thanhTien.toLocaleString('vi-VN')}đ`, 170, yPos);
    yPos += 10;
  });

  yPos += 10;
  doc.line(20, yPos - 5, 190, yPos - 5);
  doc.text(`Tổng tiền hàng: ${totalAmount.toLocaleString('vi-VN')}đ`, 130, yPos);
  doc.text(`Phí vận chuyển: ${(shippingFee || 0).toLocaleString('vi-VN')}đ`, 130, yPos + 10);
  doc.text(`Tổng cộng: ${(totalAmount + (shippingFee || 0)).toLocaleString('vi-VN')}đ`, 130, yPos + 20);

  return doc.output('blob');
};

export const sendOrderConfirmationEmail = async ({
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
    const pdfBlob = generateOrderPDF({
      customerName,
      cartItems,
      quantities,
      totalAmount,
      shippingFee,
      orderData,
      paymentMethod
    });

    const formData = new FormData();
    formData.append('to', email);
    formData.append('subject', 'Xác nhận đơn hàng từ LaptopStore');
    
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

    const response = await axios.post('http://localhost:8080/api/send-email', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;

  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw error;
  }
};

// Export các hàm
export { generateOrderPDF }; 