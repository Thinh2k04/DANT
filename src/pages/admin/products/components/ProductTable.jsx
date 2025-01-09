import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductTable = ({ products, onToggleStatus, onEdit, onViewDetail, showDeleted }) => {
  const navigate = useNavigate();

  // Lọc sản phẩm theo trạng thái
  const filteredProducts = products.filter(product => 
    showDeleted ? product.trangThai === 0 : product.trangThai === 1
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Sản Phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thương hiệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại Sản Phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Năm SX
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
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => onViewDetail(product.id)}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {product.tenSanPham}
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => onViewDetail(product.id)}
                  >
                    <div className="text-sm text-gray-500">
                      {product.thuongHieu?.ten}
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => onViewDetail(product.id)}
                  >
                    <div className="text-sm text-gray-500">
                      {product.loaiSanPham?.tenLoai}
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => onViewDetail(product.id)}
                  >
                    <div className="text-sm text-gray-500">
                      {product.namSanXuat}
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => onViewDetail(product.id)}
                  >
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${product.trangThai === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}
                    >
                      <span className={`w-2 h-2 mr-1 rounded-full
                        ${product.trangThai === 1 
                          ? 'bg-green-400' 
                          : 'bg-red-400'}`}
                      />
                      {product.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {!showDeleted && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (product && product.id) {
                            onEdit(product);
                          } else {
                            toast.error('Không thể sửa sản phẩm này');
                          }
                        }}
                        className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => onToggleStatus(product)}
                      className={`inline-flex items-center px-3 py-1 rounded-md transition-colors
                        ${product.trangThai === 1 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {product.trangThai === 1 ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        )}
                      </svg>
                      {product.trangThai === 1 ? 'Chuyển vào thùng rác' : 'Khôi phục'}
                    </button>
                    {!showDeleted && (
                      <button
                        onClick={() => navigate(`/admin/chitietsanpham/${product.id}`)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Chi tiết
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 text-sm">
                  {showDeleted 
                    ? 'Không có sản phẩm nào trong thùng rác' 
                    : 'Không có sản phẩm nào đang bán'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable; 