import React from 'react';
import { toast } from 'react-toastify';

const EditGpuModal = ({ editingGpu, setEditingGpu, onSuccess }) => {
  if (!editingGpu) return null;

  const handleSubmit = async () => {
    try {
      if (!editingGpu.ten || !editingGpu.hangSanXuat || !editingGpu.kienTrucCongNghe) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        ...editingGpu,
        xungNhipToiThieu: parseInt(editingGpu.xungNhipToiThieu),
        xungNhipToiDa: parseInt(editingGpu.xungNhipToiDa),
        vram: parseInt(editingGpu.vram),
        dienAp: parseInt(editingGpu.dienAp)
      };

      const response = await fetch(`http://localhost:8080/rest/gpu/update/${editingGpu.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update GPU');
      
      toast.success('Cập nhật GPU thành công');
      setEditingGpu(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa GPU</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên GPU
            </label>
            <input
              type="text"
              value={editingGpu.ten}
              onChange={(e) => setEditingGpu({
                ...editingGpu,
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
              value={editingGpu.hangSanXuat}
              onChange={(e) => setEditingGpu({
                ...editingGpu,
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
                value={editingGpu.xungNhipToiThieu}
                onChange={(e) => setEditingGpu({
                  ...editingGpu,
                  xungNhipToiThieu: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Tối thiểu"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={editingGpu.xungNhipToiDa}
                onChange={(e) => setEditingGpu({
                  ...editingGpu,
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
              value={editingGpu.vram}
              onChange={(e) => setEditingGpu({
                ...editingGpu,
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
              value={editingGpu.dienAp}
              onChange={(e) => setEditingGpu({
                ...editingGpu,
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
              value={editingGpu.kienTrucCongNghe}
              onChange={(e) => setEditingGpu({
                ...editingGpu,
                kienTrucCongNghe: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="VD: Ampere"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditingGpu(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingGpu.ten || !editingGpu.hangSanXuat || !editingGpu.kienTrucCongNghe}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGpuModal; 