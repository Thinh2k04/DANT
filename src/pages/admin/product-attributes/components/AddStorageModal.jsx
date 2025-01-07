import React from 'react';
import { toast } from 'react-toastify';

const AddStorageModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newStorage, setNewStorage] = React.useState({
    id: null,
    dungLuong: '',
    loaiOCung: 'SSD',
    trangThai: null
  });

  const handleSubmit = async () => {
    try {
      if (!newStorage.dungLuong) {
        toast.error('Vui lòng nhập dung lượng');
        return;
      }

      const payload = {
        ...newStorage,
        dungLuong: parseInt(newStorage.dungLuong)
      };

      const response = await fetch('http://localhost:8080/rest/o_luu_tru/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add storage');
      
      toast.success('Thêm ổ cứng thành công');
      setShowModal(false);
      setNewStorage({
        id: null,
        dungLuong: '',
        loaiOCung: 'SSD',
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
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Thêm Ổ cứng</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dung lượng (GB)
          </label>
          <input
            type="number"
            value={newStorage.dungLuong}
            onChange={(e) => setNewStorage({
              ...newStorage,
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
            value={newStorage.loaiOCung}
            onChange={(e) => setNewStorage({
              ...newStorage,
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
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newStorage.dungLuong}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStorageModal; 