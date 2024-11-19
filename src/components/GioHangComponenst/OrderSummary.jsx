// Import thư viện React
import React from 'react';

// Component OrderSummary nhận vào các props để hiển thị thông tin đơn hàng
function OrderSummary({ cartItems, quantities, totalAmount, shippingFee, errors, loading, handleCheckout }) {
  return (
    // Container chính chứa toàn bộ thông tin đơn hàng
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Tiêu đề của phần thông tin đơn hàng */}
      <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
      {/* Hiển thị lỗi giỏ hàng nếu có */}
      {errors.cart && (
        <p className="text-red-500 mb-4">{errors.cart}</p>
      )}
      {/* Phần hiển thị danh sách sản phẩm */}
      <div className="space-y-4">
        {/* Map qua từng sản phẩm trong giỏ hàng */}
        {cartItems.map((item) => (
          // Container cho mỗi sản phẩm
          <div key={item.maDinhDanh} className="flex items-center border-b pb-4">
            {/* Phần hiển thị hình ảnh sản phẩm */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item.hinhAnh}
                alt={item.tenSanPham}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Phần hiển thị thông tin sản phẩm */}
            <div className="flex-1 ml-4">
              {/* Tên sản phẩm */}
              <h3 className="font-semibold text-lg">
                {item.tenSanPhamCh}
              </h3>
              {/* Chi tiết giá và số lượng */}
              <div className="mt-2 text-gray-600">
                {/* Đơn giá sản phẩm */}
                <p>
                  Đơn giá:{" "}
                  <span className="text-red-600 font-semibold">
                    {parseFloat(item.donGia).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
                {/* Số lượng sản phẩm */}
                <p>
                  Số lượng:{" "}
                  <span className="font-semibold">
                    {quantities[item.maDinhDanh] || 1}
                  </span>
                </p>
                {/* Thành tiền cho sản phẩm */}
                <p>
                  Thành tiền:{" "}
                  <span className="text-red-600 font-semibold">
                    {((quantities[item.maDinhDanh] || 1) * parseFloat(item.donGia)).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phần tổng kết đơn hàng */}
      <div className="mt-6">
        {/* Hiển thị tạm tính */}
        <div className="flex justify-between items-center border-b pb-4">
          <span className="text-lg font-semibold">Tạm tính:</span>
          <span className="text-xl font-bold text-red-600">
            {totalAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>

        {/* Hiển thị phí vận chuyển */}
        <div className="flex justify-between items-center border-b py-4">
          <span className="text-lg font-semibold">Phí vận chuyển:</span>
          <span className="text-xl font-bold text-gray-600">
            {shippingFee && !isNaN(shippingFee) ? 
              Number(shippingFee).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) 
              : ''
            }
          </span>
        </div>

        {/* Hiển thị tổng cộng */}
        <div className="flex justify-between items-center pt-4">
          <span className="text-xl font-bold">Tổng cộng:</span>
          <span className="text-2xl font-bold text-red-600">
            {(totalAmount + (shippingFee && !isNaN(shippingFee) ? Number(shippingFee) : 0))
              .toLocaleString("vi-VN", {
                style: "currency", 
                currency: "VND",
              })
            }
          </span>
        </div>
      </div>

      {/* Phần nút xác nhận đơn hàng */}
      <div className="mt-6">
        {/* Hiển thị lỗi khi submit nếu có */}
        {errors.submit && (
          <p className="text-red-500 mb-4">{errors.submit}</p>
        )}
        {/* Nút xác nhận đơn hàng */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
        </button>
      </div>
    </div>
  );
}

// Export component để sử dụng ở nơi khác
export default OrderSummary; 