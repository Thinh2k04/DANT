import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductVariantsTable = ({ variants }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="border px-4 py-2">Mã SPCT</th>
          <th className="border px-4 py-2">Hình ảnh</th>
          <th className="border px-4 py-2">CPU</th>
          <th className="border px-4 py-2">RAM</th>
          <th className="border px-4 py-2">Ổ cứng</th>
          <th className="border px-4 py-2">GPU</th>
          <th className="border px-4 py-2">Màn hình</th>
          <th className="border px-4 py-2">Đơn giá</th>
          <th className="border px-4 py-2">Số lượng</th>
          <th className="border px-4 py-2">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {variants.map((variant, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{variant.maSpct}</td>
            <td className="border px-4 py-2">
              <img src={variant.hinhAnhMinhHoa} alt={variant.maSpct} className="w-20 h-20 object-cover"/>
            </td>
            <td className="border px-4 py-2">{variant.cpu?.ten}</td>
            <td className="border px-4 py-2">{variant.ram?.dungLuong}GB {variant.ram?.tocDo}MHz</td>
            <td className="border px-4 py-2">{variant.oluuTru?.dungLuong}GB {variant.oluuTru?.loaiOCung}</td>
            <td className="border px-4 py-2">{variant.gpu?.ten}</td>
            <td className="border px-4 py-2">{variant.manHinh?.doPhanGiai} {variant.manHinh?.tanSoQuet}Hz</td>
            <td className="border px-4 py-2">{variant.donGia?.toLocaleString()} VNĐ</td>
            <td className="border px-4 py-2">{variant.soLuong}</td>
            <td className="border px-4 py-2">
              <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                <FaEdit />
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductVariantsTable; 