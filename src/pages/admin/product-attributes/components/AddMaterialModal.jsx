import React from 'react';
import { toast } from 'react-toastify';

const AddMaterialModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newMaterial, setNewMaterial] = React.useState({
    id: null,
    tenChatLieu: '',
    trangThai: 1
  });

  const handleSubmit = async () => {
    try {
      if (!newMaterial.tenChatLieu) {
        toast.error('Vui lòng nhập tên chất liệu');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/chat_lieu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMaterial),
      });

      if (!response.ok) throw new Error('Failed to add material');
      
      toast.success('Thêm chất liệu thành công');
      setShowModal(false);
      setNewMaterial({
        id: null,
        tenChatLieu: '',
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
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Thêm Chất Liệu</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên chất liệu
          </label>
          <input
            type="text"
            value={newMaterial.tenChatLieu}
            onChange={(e) => setNewMaterial({
              ...newMaterial,
              tenChatLieu: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên chất liệu"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={newMaterial.trangThai || ''}
            onChange={(e) => setNewMaterial({
              ...newMaterial,
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
            disabled={!newMaterial.tenChatLieu}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialModal; 