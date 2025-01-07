import React from 'react';
import { toast } from 'react-toastify';

const EditRamModal = ({ editingRam, setEditingRam, onSuccess }) => {
  if (!editingRam) return null;

  const handleSubmit = async () => {
    try {
      if (!editingRam.dungLuong || !editingRam.tocDo) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        id: editingRam.id,
        dungLuong: parseInt(editingRam.dungLuong),
        tocDo: parseInt(editingRam.tocDo),
        trangThai: null
      };

      const response = await fetch(`http://localhost:8080/rest/ram/update/${editingRam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update RAM');
      
      toast.success('Cập nhật RAM thành công');
      setEditingRam(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sửa RAM</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dung lượng RAM (GB)
          </label>
          <input
            type="number"
            value={editingRam.dungLuong}
            onChange={(e) => setEditingRam({
              ...editingRam,
              dungLuong: parseInt(e.target.value)
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập dung lượng RAM"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tốc độ RAM (MHz)
          </label>
          <input
            type="number"
            value={editingRam.tocDo}
            onChange={(e) => setEditingRam({
              ...editingRam,
              tocDo: parseInt(e.target.value)
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tốc độ RAM"
            min="1"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingRam(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingRam.dungLuong || !editingRam.tocDo}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRamModal; 