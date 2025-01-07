import React from 'react';
import { toast } from 'react-toastify';

const AddBrandModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newBrand, setNewBrand] = React.useState({
    id: null,
    ten: '',
    trangThai: 1
  });

  const handleSubmit = async () => {
    try {
      if (!newBrand.ten) {
        toast.error('Vui lòng nhập tên thương hiệu');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/thuong-hieu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBrand),
      });

      if (!response.ok) throw new Error('Failed to add brand');
      
      toast.success('Thêm thương hiệu thành công');
      setShowModal(false);
      setNewBrand({
        id: null,
        ten: '',
        trangThai: 1
      });
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi thêm: ' + error.message);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Thêm Thương Hiệu</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên thương hiệu
          </label>
          <input
            type="text"
            value={newBrand.ten}
            onChange={(e) => setNewBrand({
              ...newBrand,
              ten: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên thương hiệu"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={newBrand.trangThai}
            onChange={(e) => setNewBrand({
              ...newBrand,
              trangThai: parseInt(e.target.value)
            })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Không hoạt động</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newBrand.ten}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandModal; 