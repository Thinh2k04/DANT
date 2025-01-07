import React from 'react';
import { toast } from 'react-toastify';

const AddGraphicsCardModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newCard, setNewCard] = React.useState({
    id: null,
    tenCard: '',
    trangThai: null
  });

  const handleSubmit = async () => {
    try {
      if (!newCard.tenCard) {
        toast.error('Vui lòng nhập tên card đồ họa');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/card_do_hoa/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) throw new Error('Failed to add graphics card');
      
      toast.success('Thêm card đồ họa thành công');
      setShowModal(false);
      setNewCard({
        id: null,
        tenCard: '',
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
        <h2 className="text-xl font-bold mb-4">Thêm Card Đồ Họa</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên card đồ họa
          </label>
          <input
            type="text"
            value={newCard.tenCard}
            onChange={(e) => setNewCard({
              ...newCard,
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
            value={newCard.trangThai || ''}
            onChange={(e) => setNewCard({
              ...newCard,
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
            disabled={!newCard.tenCard}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGraphicsCardModal; 