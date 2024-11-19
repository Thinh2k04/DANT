import React from 'react';
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 text-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <h3 className="font-bold mb-2">Chính sách</h3>
              <ul>
                <li>Trả góp lãi suất 0%</li>
                <li>Giao hàng</li>
                <li>Đổi trả hàng</li>
                <li>Sửa chữa</li>
                <li>Bảo hành</li>
                <li>Chính sách bảo mật</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Thông tin</h3>
              <ul>
                <li>Tuyển dụng</li>
                <li>Góp ý kiến</li>
                <li>Phương thức thanh toán</li>
                <li>Bảo hành sản phẩm</li>
                <li>Liên hệ hợp tác kinh doanh</li>
                <li>Truyền thông</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Hỗ trợ khách hàng</h3>
              <ul>
                <li>Tư vấn mua hàng</li>
                <li>Đơn đặt hàng</li>
                <li>Hướng dẫn sử dụng</li>
                <li>Tìm trung tâm bảo hành</li>
                <li>Tra cứu hóa đơn</li>
                <li>Hỗ trợ kỹ thuật</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-4">
            <p>&copy; 2024 Shop thịnh ngựa .</p>
          </div>
        </div>
      </footer>
    )
}
export default Footer;
