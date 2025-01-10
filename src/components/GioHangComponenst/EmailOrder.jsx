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
  doc.text(`Địa chỉ: ${orderData.diaChiNhanHang || 'N/A'}`, 20, 50);
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
    doc.text(`${quantities[item.id] || 1}`, 120, yPos);
    doc.text(`${parseFloat(item.donGia).toLocaleString('vi-VN')}đ`, 145, yPos);
    const thanhTien = (quantities[item.id] || 1) * parseFloat(item.donGia);
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
    const pdfBlob = await generateOrderPDF({
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
    formData.append('subject', 'THÔNG TIN HÓA ĐƠN - LaptopStore - Đơn hàng của bạn');
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Xác nhận đơn hàng</h2>
        <p style="color: #7f8c8d;">Mã đơn hàng: #${orderData?.id || 'N/A'}</p>
        <p>Kính gửi ${customerName},</p>
        <p>Cảm ơn quý khách đã đặt hàng tại LaptopStore. Dưới đây là chi tiết đơn hàng của quý khách:</p>
        
        <div style="margin: 20px 0; border: 1px solid #eee; padding: 15px;">
          <h3 style="color: #2c3e50;">Chi tiết đơn hàng:</h3>
          ${cartItems.map(item => `
            <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
              <p style="margin: 5px 0;"><strong>${item.tenSanPhamChiTiet}</strong></p>
              <p style="margin: 5px 0;">Số lượng: ${quantities[item.id] || 1}</p>
              <p style="margin: 5px 0;">Đơn giá: ${parseFloat(item.donGia).toLocaleString('vi-VN')}đ</p>
            </div>
          `).join('')}
          
          <div style="margin-top: 15px;">
            <p><strong>Tổng tiền hàng:</strong> ${totalAmount.toLocaleString('vi-VN')}đ</p>
            <p><strong>Phí vận chuyển:</strong> ${(shippingFee || 0).toLocaleString('vi-VN')}đ</p>
            <p style="font-size: 18px; color: #e74c3c;"><strong>Tổng thanh toán:</strong> ${(totalAmount + (shippingFee || 0)).toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
        
        <div style="margin: 20px 0;">
          <p><strong>Địa chỉ nhận hàng:</strong> ${orderData?.diaChiNhanHang || 'Chưa cập nhật'}</p>
          <p><strong>Phương thức thanh toán:</strong> ${paymentMethod === "1" ? "Thanh toán khi nhận hàng" : "Thanh toán qua ZaloPay"}</p>
        </div>
        
        <div style="margin-top: 30px; color: #7f8c8d;">
          <p>Mọi thắc mắc xin vui lòng liên hệ:</p>
          <p>Hotline: 0123456789</p>
          <p>Email: support@laptopstore.com</p>
        </div>
      </div>
    `;

    formData.append('text', 'THÔNG TIN HÓA ĐƠN - LaptopStore - Đơn hàng của bạn');
    formData.append('html', emailHtml);
    formData.append('file', new File([pdfBlob], 'hoadon.pdf', { type: 'application/pdf' }));

    const response = await fetch('http://localhost:8080/api/send-email', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export { generateOrderPDF }; 