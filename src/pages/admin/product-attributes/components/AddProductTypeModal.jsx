import React from 'react';
import { toast } from 'react-toastify';

const AddProductTypeModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newProductType, setNewProductType] = React.useState({
    id: null,
    tenLoai: '',
    trangThai: null
  });

  const handleSubmit = async () => {
    try {
      if (!newProductType.tenLoai) {
        toast.error('Vui lòng nhập tên loại sản phẩm');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/loai_san_pham/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductType),
      });

      if (!response.ok) throw new Error('Failed to add product type');
      
      toast.success('Thêm loại sản phẩm thành công');
      setShowModal(false);
      setNewProductType({
        id: null,
        tenLoai: '',
        trangThai: null
      });
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi thêm: ' + error.message);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Thêm Loại Sản Phẩm</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên loại sản phẩm
          </label>
          <input
            type="text"
            value={newProductType.tenLoai}
            onChange={(e) => setNewProductType({
              ...newProductType,
              tenLoai: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên loại sản phẩm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={newProductType.trangThai || ''}
            onChange={(e) => setNewProductType({
              ...newProductType,
              trangThai: e.target.value ? parseInt(e.target.value) : null
            })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Chọn trạng thái</option>
            <option value={1}>Hoạt động</option>
            <option value={0}>Không hoạt động</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newProductType.tenLoai}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductTypeModal; 