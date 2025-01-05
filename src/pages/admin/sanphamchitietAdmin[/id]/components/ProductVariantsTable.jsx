import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ImeiModal from './ImeiModal';

const ProductVariantsTable = ({ variants }) => {
  const [isImeiModalOpen, setIsImeiModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  return (
    <>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mã SPCT</th>
            <th className="border px-4 py-2">Hình ảnh</th>
            <th className="border px-4 py-2">CPU</th>
            <th className="border px-4 py-2">RAM (GB)</th>
            <th className="border px-4 py-2">Ổ cứng (GB)</th>
            <th className="border px-4 py-2">GPU</th>
            <th className="border px-4 py-2">Màn hình</th>
            <th className="border px-4 py-2">Đơn giá (VNĐ)</th>
            <th className="border px-4 py-2">Số lượng</th>
            <th className="border px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{variant.maSpct}</td>
              <td className="border px-4 py-2">
                <img src={variant.hinhAnhMinhHoa} alt={variant.tenSanPhamChiTiet} className="w-20 h-20 object-cover"/>
              </td>
              <td className="border px-4 py-2">{variant.tenCPU}</td>
              <td className="border px-4 py-2">{variant.dungLuongRam}</td>
              <td className="border px-4 py-2">{variant.dungLuong}</td>
              <td className="border px-4 py-2">{variant.gpu}</td>
              <td className="border px-4 py-2">{variant.doPhanGiai} {variant.tanSoQuet}Hz</td>
              <td className="border px-4 py-2">{variant.donGia?.toLocaleString()}</td>
              <td className="border px-4 py-2">{variant.soLuong}</td>
              <td className="border px-4 py-2">
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    <FaEdit />
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    <FaTrash />
                  </button>
                  <button 
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => {
                      setSelectedVariant(variant);
                      setIsImeiModalOpen(true);
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ImeiModal 
        isOpen={isImeiModalOpen}
        onClose={() => setIsImeiModalOpen(false)}
        selectedVariant={selectedVariant}
      />
    </>
  );
};

export default ProductVariantsTable;