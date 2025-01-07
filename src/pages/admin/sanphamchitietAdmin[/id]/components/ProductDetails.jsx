import React from 'react';

const ProductDetails = ({ productDetails }) => {
  if (!productDetails) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
          Chi tiết sản phẩm
        </span>
        {productDetails.tenSanPham}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Chất liệu</h3>
          <p className="text-gray-900">{productDetails.chatLieu?.tenChatLieu || 'Chưa có'}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Trọng lượng</h3>
          <p className="text-gray-900">{productDetails.trongLuong || 'Chưa có'}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pin</h3>
          <p className="text-gray-900">{productDetails.pin || 'Chưa có'}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Thời hạn bảo hành</h3>
          <p className="text-gray-900">{productDetails.thoiHanBaoHanh || 'Chưa có'}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Trạng thái</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            productDetails.trangThai === 1 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {productDetails.trangThai === 1 ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 