import React, { useState, useEffect } from 'react';
import useProductVariant from '../hooks/useProductVariant';
import { toast } from 'react-toastify';

const EditProductVariantModal = ({ isOpen, onClose, variant, onSuccess }) => {
  const { updateProductVariant, loading } = useProductVariant();
  const [formData, setFormData] = useState({
    sanPham: {
      id: '',
      loaiSanPham: '',
      nguonNhap: '',
      chatLieu: '',
      kichThuocLaptop: '',
      tenSanPham: '',
      namSanXuat: '',
      trongLuong: '',
      thuongHieu: '',
      thoiHanBaoHanh: '',
      pin: '',
      trangThai: 1
    },
    sanPhamChiTiet: {
      id: '',
      hinhAnhMinhHoa: '',
      soLuong: 0,
      trangThai: 1,
      donGia: 0,
      maSpct: '',
      sanPham: {
        id: ''
      },
      ram: {
        id: '',
        dungLuong: '',
        tocDo: '',
        trangThai: 1
      },
      oLuuTru: {
        id: '',
        dungLuong: '',
        loaiOCung: '',
        trangThai: 1
      },
      manHinh: {
        id: '',
        doPhanGiai: '',
        tanSoQuet: '',
        doSang: '',
        doPhuMau: '',
        tamNen: '',
        trangThai: 1
      },
      cpu: {
        id: '',
        hangSanXuat: '',
        kienTrucCongNghe: '',
        tocDoToiThieu: '',
        tocDoToiDa: '',
        soNhan: '',
        soLuong: '',
        boNhoDem: '',
        ten: '',
        trangThai: 1
      },
      gpu: {
        id: '',
        hangSanXuat: '',
        xungNhipToiThieu: '',
        xungNhipToiDa: '',
        vram: '',
        dienAp: '',
        kienTrucCongNghe: '',
        ten: '',
        trangThai: 1
      },
      mauSac: {
        id: '',
        tenMau: '',
        maHex: '',
        trangThai: 1
      },
      gioiThieu: '',
      cardDoHoa: {
        id: '',
        tenCard: '',
        trangThai: 1
      }
    },
    imageUrls: []
  });

  useEffect(() => {
    if (variant && variant.sanPham) {
      setFormData({
        sanPham: {
          id: variant.sanPham.id,
          loaiSanPham: variant.sanPham.loaiSanPham || '',
          nguonNhap: variant.sanPham.nguonNhap || '',
          chatLieu: variant.sanPham.chatLieu || '',
          kichThuocLaptop: variant.sanPham.kichThuocLaptop || '',
          tenSanPham: variant.sanPham.tenSanPham || '',
          namSanXuat: variant.sanPham.namSanXuat || '',
          trongLuong: variant.sanPham.trongLuong || '',
          thuongHieu: variant.sanPham.thuongHieu || '',
          thoiHanBaoHanh: variant.sanPham.thoiHanBaoHanh || '',
          pin: variant.sanPham.pin || '',
          trangThai: variant.sanPham.trangThai || 1
        },
        sanPhamChiTiet: {
          id: variant.id,
          hinhAnhMinhHoa: variant.hinhAnhMinhHoa || '',
          soLuong: variant.soLuong || 0,
          trangThai: variant.trangThai || 1,
          donGia: variant.donGia || 0,
          maSpct: variant.maSpct || '',
          sanPham: {
            id: variant.sanPham.id
          },
          ram: {
            id: variant.ram?.id || '',
            dungLuong: variant.ram?.dungLuong || '',
            tocDo: variant.ram?.tocDo || '',
            trangThai: variant.ram?.trangThai || 1
          },
          oLuuTru: {
            id: variant.oLuuTru?.id || '',
            dungLuong: variant.oLuuTru?.dungLuong || '',
            loaiOCung: variant.oLuuTru?.loaiOCung || '',
            trangThai: variant.oLuuTru?.trangThai || 1
          },
          manHinh: {
            id: variant.manHinh?.id || '',
            doPhanGiai: variant.manHinh?.doPhanGiai || '',
            tanSoQuet: variant.manHinh?.tanSoQuet || '',
            doSang: variant.manHinh?.doSang || '',
            doPhuMau: variant.manHinh?.doPhuMau || '',
            tamNen: variant.manHinh?.tamNen || '',
            trangThai: variant.manHinh?.trangThai || 1
          },
          cpu: {
            id: variant.cpu?.id || '',
            hangSanXuat: variant.cpu?.hangSanXuat || '',
            kienTrucCongNghe: variant.cpu?.kienTrucCongNghe || '',
            tocDoToiThieu: variant.cpu?.tocDoToiThieu || '',
            tocDoToiDa: variant.cpu?.tocDoToiDa || '',
            soNhan: variant.cpu?.soNhan || '',
            soLuong: variant.cpu?.soLuong || '',
            boNhoDem: variant.cpu?.boNhoDem || '',
            ten: variant.cpu?.ten || '',
            trangThai: variant.cpu?.trangThai || 1
          },
          gpu: {
            id: variant.gpu?.id || '',
            hangSanXuat: variant.gpu?.hangSanXuat || '',
            xungNhipToiThieu: variant.gpu?.xungNhipToiThieu || '',
            xungNhipToiDa: variant.gpu?.xungNhipToiDa || '',
            vram: variant.gpu?.vram || '',
            dienAp: variant.gpu?.dienAp || '',
            kienTrucCongNghe: variant.gpu?.kienTrucCongNghe || '',
            ten: variant.gpu?.ten || '',
            trangThai: variant.gpu?.trangThai || 1
          },
          mauSac: {
            id: variant.mauSac?.id || '',
            tenMau: variant.mauSac?.tenMau || '',
            maHex: variant.mauSac?.maHex || '',
            trangThai: variant.mauSac?.trangThai || 1
          },
          gioiThieu: variant.gioiThieu || '',
          cardDoHoa: {
            id: variant.cardDoHoa?.id || '',
            tenCard: variant.cardDoHoa?.tenCard || '',
            trangThai: variant.cardDoHoa?.trangThai || 1
          }
        },
        imageUrls: variant.imageUrls || []
      });
    }
  }, [variant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProductVariant(formData);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cập nhật sản phẩm chi tiết</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã SPCT</label>
                <input
                  type="text"
                  value={formData.sanPhamChiTiet.maSpct}
                  onChange={(e) => setFormData({
                    ...formData,
                    sanPhamChiTiet: {
                      ...formData.sanPhamChiTiet,
                      maSpct: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá</label>
                <input
                  type="number"
                  value={formData.sanPhamChiTiet.donGia}
                  onChange={(e) => setFormData({
                    ...formData,
                    sanPhamChiTiet: {
                      ...formData.sanPhamChiTiet,
                      donGia: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  value={formData.sanPhamChiTiet.soLuong}
                  onChange={(e) => setFormData({
                    ...formData,
                    sanPhamChiTiet: {
                      ...formData.sanPhamChiTiet,
                      soLuong: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.sanPham.tenSanPham}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
                <input
                  type="text"
                  value={formData.sanPham.thuongHieu}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Năm sản xuất</label>
                <input
                  type="text"
                  value={formData.sanPham.namSanXuat}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Thông số kỹ thuật */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Thông số kỹ thuật</h3>
            
            {/* CPU */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">CPU</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên CPU</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.cpu.ten}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hãng sản xuất</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.cpu.hangSanXuat}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số nhân</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.cpu.soNhan}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">RAM</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dung lượng</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.ram.dungLuong}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tốc độ</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.ram.tocDo}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Ổ cứng */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">Ổ cứng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dung lượng</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.oLuuTru.dungLuong}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại ổ cứng</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.oLuuTru.loaiOCung}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Màn hình */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">Màn hình</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Độ phân giải</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.manHinh.doPhanGiai}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tần số quét</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.manHinh.tanSoQuet}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Độ sáng</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.manHinh.doSang}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Card đồ họa */}
            <div>
              <h4 className="text-md font-medium mb-3">Card đồ họa</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên card</label>
                  <input
                    type="text"
                    value={formData.sanPhamChiTiet.cardDoHoa.tenCard}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Giới thiệu sản phẩm</h3>
            <textarea
              value={formData.sanPhamChiTiet.gioiThieu}
              onChange={(e) => setFormData({
                ...formData,
                sanPhamChiTiet: {
                  ...formData.sanPhamChiTiet,
                  gioiThieu: e.target.value
                }
              })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Hình ảnh */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Hình ảnh sản phẩm</h3>
            <textarea
              value={formData.imageUrls.join('\n')}
              onChange={(e) => setFormData({
                ...formData,
                imageUrls: e.target.value.split('\n').filter(url => url.trim())
              })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập URLs hình ảnh, mỗi URL một dòng"
            />
            {/* Preview hình ảnh */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
                    })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Trạng thái</h3>
            <select
              value={formData.sanPhamChiTiet.trangThai}
              onChange={(e) => setFormData({
                ...formData,
                sanPhamChiTiet: {
                  ...formData.sanPhamChiTiet,
                  trangThai: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={1}>Đang bán</option>
              <option value={0}>Đã ẩn</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductVariantModal; 