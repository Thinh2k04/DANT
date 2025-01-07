import React from 'react';
import { toast } from 'react-toastify';

const AddGpuModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newGpu, setNewGpu] = React.useState({
    id: null,
    hangSanXuat: '',
    xungNhipToiThieu: '',
    xungNhipToiDa: '',
    vram: '',
    dienAp: '',
    kienTrucCongNghe: '',
    ten: '',
    trangThai: null
  });

  const handleSubmit = async () => {
    try {
      if (!newGpu.ten || !newGpu.hangSanXuat || !newGpu.kienTrucCongNghe) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        ...newGpu,
        xungNhipToiThieu: parseInt(newGpu.xungNhipToiThieu),
        xungNhipToiDa: parseInt(newGpu.xungNhipToiDa),
        vram: parseInt(newGpu.vram),
        dienAp: parseInt(newGpu.dienAp)
      };

      const response = await fetch('http://localhost:8080/rest/gpu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add GPU');
      
      toast.success('Thêm GPU thành công');
      setShowModal(false);
      setNewGpu({
        id: null,
        hangSanXuat: '',
        xungNhipToiThieu: '',
        xungNhipToiDa: '',
        vram: '',
        dienAp: '',
        kienTrucCongNghe: '',
        ten: '',
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
        <h2 className="text-xl font-bold mb-4">Thêm GPU</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên GPU
            </label>
            <input
              type="text"
              value={newGpu.ten}
              onChange={(e) => setNewGpu({
                ...newGpu,
                ten: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: RTX 3080"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hãng sản xuất
            </label>
            <input
              type="text"
              value={newGpu.hangSanXuat}
              onChange={(e) => setNewGpu({
                ...newGpu,
                hangSanXuat: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: NVIDIA"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xung nhịp (MHz)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={newGpu.xungNhipToiThieu}
                onChange={(e) => setNewGpu({
                  ...newGpu,
                  xungNhipToiThieu: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Tối thiểu"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={newGpu.xungNhipToiDa}
                onChange={(e) => setNewGpu({
                  ...newGpu,
                  xungNhipToiDa: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Tối đa"
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VRAM (GB)
            </label>
            <input
              type="number"
              value={newGpu.vram}
              onChange={(e) => setNewGpu({
                ...newGpu,
                vram: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: 8"
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điện áp (V)
            </label>
            <input
              type="number"
              value={newGpu.dienAp}
              onChange={(e) => setNewGpu({
                ...newGpu,
                dienAp: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: 12"
              min="0"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kiến trúc
            </label>
            <input
              type="text"
              value={newGpu.kienTrucCongNghe}
              onChange={(e) => setNewGpu({
                ...newGpu,
                kienTrucCongNghe: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: Ampere"
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
            disabled={!newGpu.ten || !newGpu.hangSanXuat || !newGpu.kienTrucCongNghe}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGpuModal; 