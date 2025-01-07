import React from 'react';
import { toast } from 'react-toastify';

const EditGraphicsCardModal = ({ editingCard, setEditingCard, onSuccess }) => {
  if (!editingCard) return null;

  const handleSubmit = async () => {
    try {
      if (!editingCard.tenCard) {
        toast.error('Vui lòng nhập tên card đồ họa');
        return;
      }

      const response = await fetch(`http://localhost:8080/rest/card_do_hoa/update/${editingCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCard),
      });

      if (!response.ok) throw new Error('Failed to update graphics card');
      
      toast.success('Cập nhật card đồ họa thành công');
      setEditingCard(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa Card Đồ Họa</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên card đồ họa
          </label>
          <input
            type="text"
            value={editingCard.tenCard}
            onChange={(e) => setEditingCard({
              ...editingCard,
              tenCard: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên card đồ họa"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={editingCard.trangThai || ''}
            onChange={(e) => setEditingCard({
              ...editingCard,
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
            onClick={() => setEditingCard(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingCard.tenCard}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGraphicsCardModal; 