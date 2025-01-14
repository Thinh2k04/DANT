import React from 'react';
import { toast } from 'react-toastify';

const AddCpuModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newCpu, setNewCpu] = React.useState({
    id: null,
    hangSanXuat: '',
    kienTrucCongNghe: '',
    tocDoToiThieu: '',
    tocDoToiDa: '',
    soNhan: '',
    soLuong: '',
    boNhoDem: '',
    ten: '',
    trangThai: 1
  });

  const handleSubmit = async () => {
    try {
      // Validate các trường bắt buộc
      if (!newCpu.ten.trim()) {
        toast.error('Vui lòng nhập tên CPU');
        return;
      }

      if (!newCpu.hangSanXuat.trim()) {
        toast.error('Vui lòng nhập hãng sản xuất');
        return;
      }

      if (!newCpu.kienTrucCongNghe.trim()) {
        toast.error('Vui lòng nhập kiến trúc công nghệ');
        return;
      }

      // Validate giá trị số
      if (newCpu.tocDoToiThieu <= 0 || newCpu.tocDoToiDa <= 0) {
        toast.error('Tốc độ CPU phải lớn hơn 0');
        return;
      }

      if (parseFloat(newCpu.tocDoToiThieu) >= parseFloat(newCpu.tocDoToiDa)) {
        toast.error('Tốc độ tối thiểu phải nhỏ hơn tốc độ tối đa');
        return;
      }

      if (parseInt(newCpu.soNhan) <= 0 || parseInt(newCpu.soLuong) <= 0) {
        toast.error('Số nhân và số luồng phải lớn hơn 0');
        return;
      }

      if (parseInt(newCpu.boNhoDem) <= 0) {
        toast.error('Bộ nhớ đệm phải lớn hơn 0');
        return;
      }

      // Validate độ dài
      if (newCpu.ten.length > 100) {
        toast.error('Tên CPU không được vượt quá 100 ký tự');
        return;
      }

      const payload = {
        ...newCpu,
        tocDoToiThieu: parseFloat(newCpu.tocDoToiThieu),
        tocDoToiDa: parseFloat(newCpu.tocDoToiDa),
        soNhan: parseInt(newCpu.soNhan),
        soLuong: parseInt(newCpu.soLuong),
        boNhoDem: parseInt(newCpu.boNhoDem),
        trangThai: 1
      };

      const response = await fetch('http://localhost:8080/rest/cpu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add CPU');
      
      toast.success('Thêm CPU thành công');
      setShowModal(false);
      setNewCpu({
        id: null,
        hangSanXuat: '',
        kienTrucCongNghe: '',
        tocDoToiThieu: '',
        tocDoToiDa: '',
        soNhan: '',
        soLuong: '',
        boNhoDem: '',
        ten: '',
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
        <h2 className="text-xl font-bold mb-4">Thêm CPU</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên CPU
            </label>
            <input
              type="text"
              value={newCpu.ten}
              onChange={(e) => setNewCpu({
                ...newCpu,
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
              value={newCpu.hangSanXuat}
              onChange={(e) => setNewCpu({
                ...newCpu,
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
              value={newCpu.kienTrucCongNghe}
              onChange={(e) => setNewCpu({
                ...newCpu,
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
                value={newCpu.tocDoToiThieu}
                onChange={(e) => setNewCpu({
                  ...newCpu,
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
                value={newCpu.tocDoToiDa}
                onChange={(e) => setNewCpu({
                  ...newCpu,
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
                value={newCpu.soNhan}
                onChange={(e) => setNewCpu({
                  ...newCpu,
                  soNhan: e.target.value
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Số nhân"
                min="1"
              />
              <span>/</span>
              <input
                type="number"
                value={newCpu.soLuong}
                onChange={(e) => setNewCpu({
                  ...newCpu,
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
              value={newCpu.boNhoDem}
              onChange={(e) => setNewCpu({
                ...newCpu,
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
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newCpu.ten || !newCpu.hangSanXuat || !newCpu.kienTrucCongNghe}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCpuModal; 