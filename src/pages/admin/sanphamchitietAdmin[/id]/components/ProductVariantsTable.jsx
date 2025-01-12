import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import ImeiModal from './ImeiModal';
import EditProductVariantModal from './EditProductVariantModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductVariantsTable = ({ 
  variants, 
  fetchData,
  rams,
  cpus,
  gpus,
  storages,
  displays,
  colors
}) => {
  const [isImeiModalOpen, setIsImeiModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleDelete = async (variant) => {
    try {
      const response = await axios.post('http://localhost:8080/rest/san_pham_chi_tiet/del', {
        id: variant.id,
        hinhAnhMinhHoa: variant.hinhAnhMinhHoa,
        soLuong: variant.soLuong,
        trangThai: variant.trangThai,
        donGia: variant.donGia,
        maSpct: variant.maSpct,
        sanPham: {
          id: variant.sanPham.id,
          loaiSanPham: variant.sanPham.loaiSanPham,
          nguonNhap: variant.sanPham.nguonNhap,
          chatLieu: variant.sanPham.chatLieu,
          kichThuocLaptop: variant.sanPham.kichThuocLaptop,
          tenSanPham: variant.sanPham.tenSanPham,
          namSanXuat: variant.sanPham.namSanXuat,
          trongLuong: variant.sanPham.trongLuong,
          thuongHieu: variant.sanPham.thuongHieu,
          thoiHanBaoHanh: variant.sanPham.thoiHanBaoHanh,
          pin: variant.sanPham.pin,
          trangThai: variant.sanPham.trangThai
        },
        ram: {
          id: variant.ram.id,
          dungLuong: variant.ram.dungLuong,
          tocDo: variant.ram.tocDo,
          trangThai: variant.ram.trangThai
        },
        manHinh: {
          id: variant.manHinh.id,
          doPhanGiai: variant.manHinh.doPhanGiai,
          tanSoQuet: variant.manHinh.tanSoQuet,
          doSang: variant.manHinh.doSang,
          doPhuMau: variant.manHinh.doPhuMau,
          tamNen: variant.manHinh.tamNen,
          trangThai: variant.manHinh.trangThai
        },
        cpu: {
          id: variant.cpu.id,
          hangSanXuat: variant.cpu.hangSanXuat,
          kienTrucCongNghe: variant.cpu.kienTrucCongNghe,
          tocDoToiThieu: variant.cpu.tocDoToiThieu,
          tocDoToiDa: variant.cpu.tocDoToiDa,
          soNhan: variant.cpu.soNhan,
          soLuong: variant.cpu.soLuong,
          boNhoDem: variant.cpu.boNhoDem,
          ten: variant.cpu.ten,
          trangThai: variant.cpu.trangThai
        },
        gpu: {
          id: variant.gpu.id,
          hangSanXuat: variant.gpu.hangSanXuat,
          xungNhipToiThieu: variant.gpu.xungNhipToiThieu,
          xungNhipToiDa: variant.gpu.xungNhipToiDa,
          vram: variant.gpu.vram,
          dienAp: variant.gpu.dienAp,
          kienTrucCongNghe: variant.gpu.kienTrucCongNghe,
          ten: variant.gpu.ten,
          trangThai: variant.gpu.trangThai
        },
        cuaHang: variant.cuaHang,
        mauSac: {
          id: variant.mauSac.id,
          tenMau: variant.mauSac.tenMau,
          maHex: variant.mauSac.maHex,
          trangThai: variant.mauSac.trangThai
        },
        gioiThieu: variant.gioiThieu,
        cardDoHoa: {
          id: variant.cardDoHoa.id,
          tenCard: variant.cardDoHoa.tenCard,
          trangThai: variant.cardDoHoa.trangThai
        },
        oLuuTru: {
          id: variant.oLuuTru.id,
          dungLuong: variant.oLuuTru.dungLuong,
          loaiOCung: variant.oLuuTru.loaiOCung,
          trangThai: variant.oLuuTru.trangThai
        }
      });

      if (response.status === 200) {
        toast.success('Cập nhật trạng thái thành công');
        fetchData(); // Refresh the data after successful update
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
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
                Trạng thái
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
                    <p><span className="font-medium">CPU:</span> {variant.cpu?.ten}</p>
                    <p><span className="font-medium">RAM:</span> {variant.ram?.dungLuong}GB</p>
                    <p><span className="font-medium">Ổ cứng:</span> {variant.oLuuTru?.dungLuong}GB</p>
                    <p><span className="font-medium">GPU:</span> {variant.gpu?.ten}</p>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    variant.trangThai === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {variant.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Sửa"
                      onClick={() => {
                        setSelectedVariant(variant);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm này?')) {
                          handleDelete(variant);
                        }
                      }}
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

      <EditProductVariantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        variant={selectedVariant}
        onSuccess={() => {
          fetchData();
          setIsEditModalOpen(false);
        }}
        rams={rams}
        cpus={cpus}
        gpus={gpus}
        storages={storages}
        displays={displays}
        colors={colors}
      />
    </>
  );
};

export default ProductVariantsTable;