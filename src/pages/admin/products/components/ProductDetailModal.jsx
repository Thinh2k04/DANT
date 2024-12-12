import React from 'react';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <p><span className="font-medium">Tên sản phẩm:</span> {product.tenSanPham}</p>
              <p><span className="font-medium">Năm sản xuất:</span> {product.namSanXuat}</p>
              <p><span className="font-medium">Bảo hành:</span> {product.thoiHanBaoHanh}</p>
              <p><span className="font-medium">Trọng lượng:</span> {product.trongLuong}</p>
              <p><span className="font-medium">Pin:</span> {product.pin}</p>
              <p><span className="font-medium">Loại sản phẩm:</span> {product.loaiSanPham?.tenLoai}</p>
              <p><span className="font-medium">Trạng thái:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  product.trangThai === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                </span>
              </p>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiết</h3>
            <div className="space-y-3">
              <p><span className="font-medium">Mã sản phẩm:</span> {product.id}</p>
              <p><span className="font-medium">Ngày tạo:</span> {new Date(product.ngayTao).toLocaleDateString('vi-VN')}</p>
              <p><span className="font-medium">Ngày cập nhật:</span> {product.ngayCapNhat ? new Date(product.ngayCapNhat).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Hình ảnh sản phẩm */}
        {product.hinhAnhs && product.hinhAnhs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h3>
            <div className="grid grid-cols-4 gap-4">
              {product.hinhAnhs.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.duongDan}
                    alt={`Product ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal; 