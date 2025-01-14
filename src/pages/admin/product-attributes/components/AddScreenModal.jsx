import React from 'react';
import { toast } from 'react-toastify';

const AddScreenModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newScreen, setNewScreen] = React.useState({
    id: null,
    doPhanGiai: '',
    tanSoQuet: '',
    doSang: '',
    doPhuMau: '',
    tamNen: 'IPS',
    trangThai: 1
  });

  const handleSubmit = async () => {
    try {
      if (!newScreen.doPhanGiai || !newScreen.tanSoQuet || !newScreen.doSang || !newScreen.doPhuMau || !newScreen.tamNen) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        ...newScreen,
        tanSoQuet: parseInt(newScreen.tanSoQuet),
        doSang: parseInt(newScreen.doSang),
        doPhuMau: parseFloat(newScreen.doPhuMau)
      };

      const response = await fetch('http://localhost:8080/rest/man_hinh/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add screen');
      
      toast.success('Thêm màn hình thành công');
      setShowModal(false);
      setNewScreen({
        id: null,
        doPhanGiai: '',
        tanSoQuet: '',
        doSang: '',
        doPhuMau: '',
        tamNen: 'IPS',
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
        <h2 className="text-xl font-bold mb-4">Thêm Màn Hình</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ phân giải
            </label>
            <input
              type="text"
              value={newScreen.doPhanGiai}
              onChange={(e) => setNewScreen({
                ...newScreen,
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
              value={newScreen.tanSoQuet}
              onChange={(e) => setNewScreen({
                ...newScreen,
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
              value={newScreen.doSang}
              onChange={(e) => setNewScreen({
                ...newScreen,
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
              value={newScreen.doPhuMau}
              onChange={(e) => setNewScreen({
                ...newScreen,
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
              value={newScreen.tamNen}
              onChange={(e) => setNewScreen({
                ...newScreen,
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
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newScreen.doPhanGiai || !newScreen.tanSoQuet || !newScreen.doSang || !newScreen.doPhuMau || !newScreen.tamNen}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScreenModal; 