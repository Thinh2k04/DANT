import React from 'react';
import { toast } from 'react-toastify';

const AddRamModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newRam, setNewRam] = React.useState({
    id: null,
    dungLuong: '',
    tocDo: '',
    trangThai: null
  });

  const handleSubmit = async () => {
    try {
      if (!newRam.dungLuong || !newRam.tocDo) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        id: null,
        dungLuong: parseInt(newRam.dungLuong),
        tocDo: parseInt(newRam.tocDo),
        trangThai: null
      };

      const response = await fetch('http://localhost:8080/rest/ram/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add RAM');
      
      toast.success('Thêm RAM thành công');
      setShowModal(false);
      setNewRam({
        id: null,
        dungLuong: '',
        tocDo: '',
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
        <h2 className="text-xl font-bold mb-4">Thêm RAM</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dung lượng RAM (GB)
          </label>
          <input
            type="number"
            value={newRam.dungLuong}
            onChange={(e) => setNewRam({
              ...newRam,
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
            value={newRam.tocDo}
            onChange={(e) => setNewRam({
              ...newRam,
              tocDo: parseInt(e.target.value)
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tốc độ RAM"
            min="1"
          />
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
            disabled={!newRam.dungLuong || !newRam.tocDo}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRamModal; 