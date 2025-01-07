import React from 'react';
import { toast } from 'react-toastify';

const EditBrandModal = ({ editingBrand, setEditingBrand, onSuccess }) => {
  if (!editingBrand) return null;

  const handleSubmit = async () => {
    try {
      if (!editingBrand.ten) {
        toast.error('Vui lòng nhập tên thương hiệu');
        return;
      }

      const response = await fetch(`http://localhost:8080/rest/thuong-hieu/update/${editingBrand.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingBrand),
      });

      if (!response.ok) throw new Error('Failed to update brand');
      
      toast.success('Cập nhật thương hiệu thành công');
      setEditingBrand(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sửa Thương Hiệu</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên thương hiệu
          </label>
          <input
            type="text"
            value={editingBrand.ten}
            onChange={(e) => setEditingBrand({
              ...editingBrand,
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
            value={editingBrand.trangThai}
            onChange={(e) => setEditingBrand({
              ...editingBrand,
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
            onClick={() => setEditingBrand(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingBrand.ten}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBrandModal; 