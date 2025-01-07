import React from 'react';
import { toast } from 'react-toastify';

const AddColorModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newColor, setNewColor] = React.useState({
    id: null,
    tenMau: '',
    maHex: '#000000'
  });

  const handleSubmit = async () => {
    try {
      if (!newColor.tenMau || !newColor.maHex) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/mau_sac/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newColor),
      });

      if (!response.ok) throw new Error('Failed to add color');
      
      toast.success('Thêm màu sắc thành công');
      setShowModal(false);
      setNewColor({
        id: null,
        tenMau: '',
        maHex: '#000000'
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
        <h2 className="text-xl font-bold mb-4">Thêm Màu Sắc</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên màu
          </label>
          <input
            type="text"
            value={newColor.tenMau}
            onChange={(e) => setNewColor({
              ...newColor,
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
              value={newColor.maHex}
              onChange={(e) => setNewColor({
                ...newColor,
                maHex: e.target.value
              })}
              className="w-12 h-12 p-1 rounded border"
            />
            <input
              type="text"
              value={newColor.maHex}
              onChange={(e) => setNewColor({
                ...newColor,
                maHex: e.target.value
              })}
              className="flex-1 border rounded px-3 py-2"
              placeholder="#000000"
            />
          </div>
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
            disabled={!newColor.tenMau || !newColor.maHex}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColorModal; 