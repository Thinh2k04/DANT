import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import ImeiModal from './ImeiModal';

const ProductVariantsTable = ({ variants }) => {
  const [isImeiModalOpen, setIsImeiModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã SPCT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cấu hình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variants.map((variant, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {variant.maSpct}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={variant.hinhAnhMinhHoa} 
                    alt={variant.tenSanPhamChiTiet} 
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <p><span className="font-medium">CPU:</span> {variant.tenCPU}</p>
                    <p><span className="font-medium">RAM:</span> {variant.dungLuongRam}GB</p>
                    <p><span className="font-medium">Ổ cứng:</span> {variant.dungLuong}GB</p>
                    <p><span className="font-medium">GPU:</span> {variant.gpu}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(variant.donGia)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    variant.soLuong > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {variant.soLuong}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Sửa"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <FaTrash size={18} />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => {
                        setSelectedVariant(variant);
                        setIsImeiModalOpen(true);
                      }}
                      title="Thêm IMEI"
                    >
                      <FaPlus size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ImeiModal 
        isOpen={isImeiModalOpen}
        onClose={() => setIsImeiModalOpen(false)}
        selectedVariant={selectedVariant}
      />
    </>
  );
};

export default ProductVariantsTable;