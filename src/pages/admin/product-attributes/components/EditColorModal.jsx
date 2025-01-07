import React from 'react';
import { toast } from 'react-toastify';

const EditColorModal = ({ editingColor, setEditingColor, onSuccess }) => {
  if (!editingColor) return null;

  const handleSubmit = async () => {
    try {
      if (!editingColor.tenMau || !editingColor.maHex) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const response = await fetch(`http://localhost:8080/rest/mau_sac/update/${editingColor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingColor),
      });

      if (!response.ok) throw new Error('Failed to update color');
      
      toast.success('Cập nhật màu sắc thành công');
      setEditingColor(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa Màu Sắc</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên màu
          </label>
          <input
            type="text"
            value={editingColor.tenMau}
            onChange={(e) => setEditingColor({
              ...editingColor,
              tenMau: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên màu"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã màu (HEX)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={editingColor.maHex}
              onChange={(e) => setEditingColor({
                ...editingColor,
                maHex: e.target.value
              })}
              className="w-12 h-12 p-1 rounded border"
            />
            <input
              type="text"
              value={editingColor.maHex}
              onChange={(e) => setEditingColor({
                ...editingColor,
                maHex: e.target.value
              })}
              className="flex-1 border rounded px-3 py-2"
              placeholder="#000000"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditingColor(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingColor.tenMau || !editingColor.maHex}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditColorModal; 