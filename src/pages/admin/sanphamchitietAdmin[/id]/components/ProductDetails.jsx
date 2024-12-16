import React from 'react';

const ProductDetails = ({ productDetails }) => {
  if (!productDetails) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
      <table className="min-w-full bg-white border border-gray-300 mb-8">
        <thead>
          <tr>
            <th className="border px-4 py-2">Tên Sản Phẩm</th>
            <th className="border px-4 py-2">Chất Liệu</th>
            <th className="border px-4 py-2">Trọng Lượng</th>
            <th className="border px-4 py-2">Pin</th>
            <th className="border px-4 py-2">Thời Hạn Bảo Hành</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{productDetails.tenSanPham}</td>
            <td className="border px-4 py-2">{productDetails.chatLieu?.tenChatLieu}</td>
            <td className="border px-4 py-2">{productDetails.trongLuong}</td>
            <td className="border px-4 py-2">{productDetails.pin}</td>
            <td className="border px-4 py-2">{productDetails.thoiHanBaoHanh}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetails; 