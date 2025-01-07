import React from 'react';
import { toast } from 'react-toastify';

const EditStorageModal = ({ editingStorage, setEditingStorage, onSuccess }) => {
  if (!editingStorage) return null;

  const handleSubmit = async () => {
    try {
      if (!editingStorage.dungLuong) {
        toast.error('Vui lòng nhập dung lượng');
        return;
      }

      const payload = {
        id: editingStorage.id,
        dungLuong: parseInt(editingStorage.dungLuong),
        loaiOCung: editingStorage.loaiOCung,
        trangThai: null
      };

      const response = await fetch(`http://localhost:8080/rest/o_luu_tru/update/${editingStorage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update storage');
      
      toast.success('Cập nhật ổ cứng thành công');
      setEditingStorage(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sửa Ổ cứng</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dung lượng (GB)
          </label>
          <input
            type="number"
            value={editingStorage.dungLuong}
            onChange={(e) => setEditingStorage({
              ...editingStorage,
              dungLuong: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập dung lượng"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại ổ cứng
          </label>
          <select
            value={editingStorage.loaiOCung}
            onChange={(e) => setEditingStorage({
              ...editingStorage,
              loaiOCung: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="SSD">SSD</option>
            <option value="HDD">HDD</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingStorage(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingStorage.dungLuong}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStorageModal; 