import React from 'react';
import { toast } from 'react-toastify';

const EditScreenModal = ({ editingScreen, setEditingScreen, onSuccess }) => {
  if (!editingScreen) return null;

  const handleSubmit = async () => {
    try {
      if (!editingScreen.doPhanGiai || !editingScreen.tanSoQuet || !editingScreen.doSang || !editingScreen.doPhuMau || !editingScreen.tamNen) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        ...editingScreen,
        tanSoQuet: parseInt(editingScreen.tanSoQuet),
        doSang: parseInt(editingScreen.doSang),
        doPhuMau: parseFloat(editingScreen.doPhuMau)
      };

      const response = await fetch(`http://localhost:8080/rest/man_hinh/update/${editingScreen.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update screen');
      
      toast.success('Cập nhật màn hình thành công');
      setEditingScreen(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa Màn Hình</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ phân giải
            </label>
            <input
              type="text"
              value={editingScreen.doPhanGiai}
              onChange={(e) => setEditingScreen({
                ...editingScreen,
                doPhanGiai: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: 1920x1080"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tần số quét (Hz)
            </label>
            <input
              type="number"
              value={editingScreen.tanSoQuet}
              onChange={(e) => setEditingScreen({
                ...editingScreen,
                tanSoQuet: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: 60"
              min="0"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ sáng (nits)
            </label>
            <input
              type="number"
              value={editingScreen.doSang}
              onChange={(e) => setEditingScreen({
                ...editingScreen,
                doSang: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: 300"
              min="0"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ phủ màu (0-1)
            </label>
            <input
              type="number"
              value={editingScreen.doPhuMau}
              onChange={(e) => setEditingScreen({
                ...editingScreen,
                doPhuMau: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: 0.5"
              step="0.1"
              min="0"
              max="1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tấm nền
            </label>
            <select
              value={editingScreen.tamNen}
              onChange={(e) => setEditingScreen({
                ...editingScreen,
                tamNen: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="IPS">IPS</option>
              <option value="VA">VA</option>
              <option value="TN">TN</option>
              <option value="OLED">OLED</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditingScreen(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingScreen.doPhanGiai || !editingScreen.tanSoQuet || !editingScreen.doSang || !editingScreen.doPhuMau || !editingScreen.tamNen}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditScreenModal; 