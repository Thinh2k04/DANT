import React from 'react';
import { toast } from 'react-toastify';

const EditSizeModal = ({ editingSize, setEditingSize, onSuccess }) => {
  if (!editingSize) return null;

  const handleSubmit = async () => {
    try {
      if (!editingSize.kichThuoc) {
        toast.error('Vui lòng nhập kích thước');
        return;
      }

      const response = await fetch(`http://localhost:8080/rest/ktlt/update/${editingSize.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingSize,
          kichThuoc: parseFloat(editingSize.kichThuoc)
        }),
      });

      if (!response.ok) throw new Error('Failed to update size');
      
      toast.success('Cập nhật kích thước thành công');
      setEditingSize(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa Kích Thước</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kích thước (inch)
          </label>
          <input
            type="number"
            value={editingSize.kichThuoc}
            onChange={(e) => setEditingSize({
              ...editingSize,
              kichThuoc: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập kích thước"
            step="0.1"
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={editingSize.trangThai}
            onChange={(e) => setEditingSize({
              ...editingSize,
              trangThai: parseInt(e.target.value)
            })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Không hoạt động</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditingSize(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingSize.kichThuoc}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSizeModal; 