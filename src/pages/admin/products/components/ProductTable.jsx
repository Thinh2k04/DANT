import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductTable = ({ products, onToggleStatus, onEdit, onViewDetail, showDeleted }) => {
  const navigate = useNavigate();

  // Lọc sản phẩm theo trạng thái
  const filteredProducts = products.filter(product => 
    showDeleted ? product.trangThai === 0 : product.trangThai === 1
  );

  const handleRowClick = (e, product) => {
    if (e.target.tagName === 'BUTTON') return;
    onViewDetail(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Sản Phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Năm Sản Xuất
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trọng Lượng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại Sản Phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr 
                key={product.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={(e) => handleRowClick(e, product)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{product.tenSanPham}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.namSanXuat}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.trongLuong}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.loaiSanPham?.tenLoai}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${product.trangThai === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {product.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(product);
                    }}
                    className={`${
                      product.trangThai === 1 
                        ? 'text-red-600 hover:text-red-900 bg-red-100' 
                        : 'text-green-600 hover:text-green-900 bg-green-100'
                    } px-3 py-1 rounded`}
                  >
                    {product.trangThai === 1 ? 'Ẩn' : 'Khôi phục'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/chitietsanpham/${product.id}`);
                    }}
                    className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                {showDeleted 
                  ? 'Không có sản phẩm nào đã ẩn' 
                  : 'Không có sản phẩm nào đang bán'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 