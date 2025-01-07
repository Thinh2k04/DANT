import React from 'react';
import { toast } from 'react-toastify';

const AddSizeModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newSize, setNewSize] = React.useState({
    id: null,
    kichThuoc: '',
    trangThai: 1
  });

  const handleSubmit = async () => {
    try {
      if (!newSize.kichThuoc) {
        toast.error('Vui lòng nhập kích thước');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/ktlt/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSize,
          kichThuoc: parseFloat(newSize.kichThuoc)
        }),
      });

      if (!response.ok) throw new Error('Failed to add size');
      
      toast.success('Thêm kích thước thành công');
      setShowModal(false);
      setNewSize({
        id: null,
        kichThuoc: '',
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
        <h2 className="text-xl font-bold mb-4">Thêm Kích Thước</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kích thước (inch)
          </label>
          <input
            type="number"
            value={newSize.kichThuoc}
            onChange={(e) => setNewSize({
              ...newSize,
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
            value={newSize.trangThai}
            onChange={(e) => setNewSize({
              ...newSize,
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
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newSize.kichThuoc}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSizeModal; 