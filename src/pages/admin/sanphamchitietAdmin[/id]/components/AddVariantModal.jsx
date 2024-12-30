import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddVariantModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit,
  cpus,
  rams,
  storages,
  gpus,
  displays,
  colors
}) => {
  if (!isOpen) return null;

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    if (field === 'maSpct' || field === 'hinhAnhMinhHoa') {
      // Xử lý cho các trường không phải object
      setFormData(prev => ({
        ...prev,
        sanPhamChiTiet: {
          ...prev.sanPhamChiTiet,
          [field]: value
        }
      }));
    } else if (field === 'soLuong' || field === 'donGia') {
      // Xử lý cho các trường số
      setFormData(prev => ({
        ...prev,
        sanPhamChiTiet: {
          ...prev.sanPhamChiTiet,
          [field]: Number(value)
        }
      }));
    } else {
      // Xử lý cho các trường object (cpu, ram, etc.)
      setFormData(prev => ({
        ...prev,
        sanPhamChiTiet: {
          ...prev.sanPhamChiTiet,
          [field]: {
            id: value
          }
        }
      }));
    }
  };

  // Thêm hàm mới để xử lý input text
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      sanPhamChiTiet: {
        ...prev.sanPhamChiTiet,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Thêm sản phẩm chi tiết</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sản phẩm chi tiết
              </label>
              <input
                type="text"
                value={formData.sanPhamChiTiet.maSpct || ''}
                onChange={(e) => handleInputChange(e, 'maSpct')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={formData.sanPhamChiTiet.soLuong || ''}
                onChange={(e) => handleSelectChange(e, 'soLuong')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn giá
              </label>
              <input
                type="number"
                value={formData.sanPhamChiTiet.donGia || ''}
                onChange={(e) => handleSelectChange(e, 'donGia')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh minh họa
              </label>
              <input
                type="text"
                value={formData.sanPhamChiTiet.hinhAnhMinhHoa || ''}
                onChange={(e) => handleSelectChange(e, 'hinhAnhMinhHoa')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Thông số kỹ thuật */}
          <div className="grid grid-cols-2 gap-6">
            {/* CPU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPU
              </label>
              <select
                value={formData.sanPhamChiTiet.cpu?.id || ''}
                onChange={(e) => handleSelectChange(e, 'cpu')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn CPU</option>
                {Array.isArray(cpus) && cpus.map(cpu => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* RAM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM
              </label>
              <select
                value={formData.sanPhamChiTiet.ram?.id || ''}
                onChange={(e) => handleSelectChange(e, 'ram')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn RAM</option>
                {Array.isArray(rams) && rams.map(ram => (
                  <option key={ram.id} value={ram.id}>
                    {ram.dungLuong}GB {ram.tocDo}MHz
                  </option>
                ))}
              </select>
            </div>

            {/* Ổ cứng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ổ cứng
              </label>
              <select
                value={formData.sanPhamChiTiet.oLuuTru?.id || ''}
                onChange={(e) => handleSelectChange(e, 'oLuuTru')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn ổ cứng</option>
                {Array.isArray(storages) && storages.map(storage => (
                  <option key={storage.id} value={storage.id}>
                    {storage.dungLuong}GB {storage.loaiOCung}
                  </option>
                ))}
              </select>
            </div>

            {/* GPU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPU
              </label>
              <select
                value={formData.sanPhamChiTiet.gpu?.id || ''}
                onChange={(e) => handleSelectChange(e, 'gpu')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn GPU</option>
                {Array.isArray(gpus) && gpus.map(gpu => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* Màn hình */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màn hình
              </label>
              <select
                value={formData.sanPhamChiTiet.manHinh?.id || ''}
                onChange={(e) => handleSelectChange(e, 'manHinh')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn màn hình</option>
                {Array.isArray(displays) && displays.map(display => (
                  <option key={display.id} value={display.id}>
                    {display.doPhanGiai} {display.tanSoQuet}Hz
                  </option>
                ))}
              </select>
            </div>

            {/* Màu sắc */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <select
                value={formData.sanPhamChiTiet.mauSac?.id || ''}
                onChange={(e) => handleSelectChange(e, 'mauSac')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn màu sắc</option>
                {Array.isArray(colors) && colors.map(color => (
                  <option key={color.id} value={color.id}>
                    {color.tenMauSac}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giới thiệu sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới thiệu
            </label>
            <textarea
              value={formData.sanPhamChiTiet.gioiThieu || ''}
              onChange={(e) => handleInputChange(e, 'gioiThieu')}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Nhập giới thiệu về sản phẩm..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVariantModal; 