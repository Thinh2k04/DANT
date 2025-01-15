export const sendOrderConfirmationEmail = async ({
  email,
  customerName,
  orderDetails
}) => {
  try {
    const formData = new FormData();
    formData.append('to', email);
    formData.append('subject', 'Xác nhận đơn hàng - LaptopStore');

    // Tạo nội dung text cho email
    const emailText = `
Xác nhận đơn hàng
Mã đơn hàng: #${orderDetails.orderNumber}

Kính gửi ${customerName},
Cảm ơn quý khách đã đặt hàng tại LaptopStore. Dưới đây là chi tiết đơn hàng của quý khách:

Chi tiết đơn hàng:
${orderDetails.products.map(item => `
- ${item.tenSanPham}
  Số lượng: ${item.soLuong}
  Đơn giá: ${parseFloat(item.donGia).toLocaleString('vi-VN')}đ
`).join('\n')}

Tổng tiền hàng: ${orderDetails.totalAmount.toLocaleString('vi-VN')}đ
Phí vận chuyển: ${orderDetails.shippingFee.toLocaleString('vi-VN')}đ
Tổng thanh toán: ${(orderDetails.totalAmount + orderDetails.shippingFee).toLocaleString('vi-VN')}đ

Địa chỉ nhận hàng: ${orderDetails.shippingAddress}
Phương thức thanh toán: ${orderDetails.paymentMethod}

Mọi thắc mắc xin vui lòng liên hệ:
Hotline: 0123456789
Email: support@laptopstore.com
    `;

    formData.append('text', emailText);

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