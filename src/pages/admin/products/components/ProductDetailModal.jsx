import React from 'react';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-8 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Thông tin cơ bản */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Thông tin cơ bản
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Tên sản phẩm:</span>
                  <span className="text-sm text-gray-900">{product.tenSanPham}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Thương hiệu:</span>
                  <span className="text-sm text-gray-900">{product.thuongHieu?.ten}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Loại sản phẩm:</span>
                  <span className="text-sm text-gray-900">{product.loaiSanPham?.tenLoai}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Năm sản xuất:</span>
                  <span className="text-sm text-gray-900">{product.namSanXuat}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Trọng lượng:</span>
                  <span className="text-sm text-gray-900">{product.trongLuong} kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Pin:</span>
                  <span className="text-sm text-gray-900">{product.pin} Wh</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Bảo hành:</span>
                  <span className="text-sm text-gray-900">{product.thoiHanBaoHanh} tháng</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    product.trangThai === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thông tin chi tiết
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Nguồn nhập:</span>
                  <span className="text-sm text-gray-900">{product.nguonNhap?.tenNhaCungUng}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Chất liệu:</span>
                  <span className="text-sm text-gray-900">{product.chatLieu?.tenChatLieu}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Kích thước:</span>
                  <span className="text-sm text-gray-900">{product.kichThuocLaptop?.kichThuoc} inch</span>
                </div>
              </div>

              {/* Thông tin nhà cung cấp */}
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Thông tin nhà cung cấp</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Số điện thoại:</span>
                  <span className="text-sm text-gray-900">{product.nguonNhap?.sdt}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-sm text-gray-900">{product.nguonNhap?.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Địa chỉ:</span>
                  <span className="text-sm text-gray-900">{product.nguonNhap?.diaChi}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Ghi chú:</span>
                  <span className="text-sm text-gray-900">{product.nguonNhap?.ghiChu}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal; 