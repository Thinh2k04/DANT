import React from 'react';
import { toast } from 'react-toastify';

const EditCpuModal = ({ editingCpu, setEditingCpu, onSuccess }) => {
  if (!editingCpu) return null;

  const handleSubmit = async () => {
    try {
      if (!editingCpu.ten || !editingCpu.hangSanXuat || !editingCpu.kienTrucCongNghe) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      const payload = {
        ...editingCpu,
        tocDoToiThieu: parseFloat(editingCpu.tocDoToiThieu),
        tocDoToiDa: parseFloat(editingCpu.tocDoToiDa),
        soNhan: parseInt(editingCpu.soNhan),
        soLuong: parseInt(editingCpu.soLuong),
        boNhoDem: parseInt(editingCpu.boNhoDem)
      };

      const response = await fetch(`http://localhost:8080/rest/cpu/update/${editingCpu.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update CPU');
      
      toast.success('Cập nhật CPU thành công');
      setEditingCpu(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa CPU</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên CPU
            </label>
            <input
              type="text"
              value={editingCpu.ten}
              onChange={(e) => setEditingCpu({
                ...editingCpu,
                ten: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập tên CPU"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hãng sản xuất
            </label>
            <input
              type="text"
              value={editingCpu.hangSanXuat}
              onChange={(e) => setEditingCpu({
                ...editingCpu,
                hangSanXuat: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập hãng sản xuất"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kiến trúc công nghệ
            </label>
            <input
              type="text"
              value={editingCpu.kienTrucCongNghe}
              onChange={(e) => setEditingCpu({
                ...editingCpu,
                kienTrucCongNghe: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập kiến trúc"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tốc độ (GHz)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={editingCpu.tocDoToiThieu}
                onChange={(e) => setEditingCpu({
                  ...editingCpu,
                  tocDoToiThieu: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Tối thiểu"
                min="0"
                step="0.1"
              />
              <span>-</span>
              <input
                type="number"
                value={editingCpu.tocDoToiDa}
                onChange={(e) => setEditingCpu({
                  ...editingCpu,
                  tocDoToiDa: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Tối đa"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhân/Luồng
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={editingCpu.soNhan}
                onChange={(e) => setEditingCpu({
                  ...editingCpu,
                  soNhan: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Số nhân"
                min="1"
              />
              <span>/</span>
              <input
                type="number"
                value={editingCpu.soLuong}
                onChange={(e) => setEditingCpu({
                  ...editingCpu,
                  soLuong: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Số luồng"
                min="1"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bộ nhớ đệm (MB)
            </label>
            <input
              type="number"
              value={editingCpu.boNhoDem}
              onChange={(e) => setEditingCpu({
                ...editingCpu,
                boNhoDem: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập bộ nhớ đệm"
              min="1"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditingCpu(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingCpu.ten || !editingCpu.hangSanXuat || !editingCpu.kienTrucCongNghe}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCpuModal; 