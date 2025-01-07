import React from 'react';
import { toast } from 'react-toastify';

const AddSupplierModal = ({ showModal, setShowModal, onSuccess }) => {
  const [newSupplier, setNewSupplier] = React.useState({
    id: null,
    tenNhaCungUng: '',
    sdt: '',
    email: '',
    diaChi: '',
    ghiChu: '',
    trangThai: 1
  });

  const handleSubmit = async () => {
    try {
      if (!newSupplier.tenNhaCungUng || !newSupplier.sdt || !newSupplier.email || !newSupplier.diaChi) {
        toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
        return;
      }

      // Validate phone number
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(newSupplier.sdt)) {
        toast.error('Số điện thoại không hợp lệ');
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newSupplier.email)) {
        toast.error('Email không hợp lệ');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/nguon_nhap/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) throw new Error('Failed to add supplier');
      
      toast.success('Thêm nhà cung ứng thành công');
      setShowModal(false);
      setNewSupplier({
        id: null,
        tenNhaCungUng: '',
        sdt: '',
        email: '',
        diaChi: '',
        ghiChu: '',
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
        <h2 className="text-xl font-bold mb-4">Thêm Nhà Cung Ứng</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhà cung ứng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newSupplier.tenNhaCungUng}
              onChange={(e) => setNewSupplier({
                ...newSupplier,
                tenNhaCungUng: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập tên nhà cung ứng"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newSupplier.sdt}
              onChange={(e) => setNewSupplier({
                ...newSupplier,
                sdt: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({
                ...newSupplier,
                email: e.target.value
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={newSupplier.trangThai}
              onChange={(e) => setNewSupplier({
                ...newSupplier,
                trangThai: parseInt(e.target.value)
              })}
              className="w-full border rounded px-3 py-2"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newSupplier.diaChi}
            onChange={(e) => setNewSupplier({
              ...newSupplier,
              diaChi: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </label>
          <textarea
            value={newSupplier.ghiChu}
            onChange={(e) => setNewSupplier({
              ...newSupplier,
              ghiChu: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập ghi chú"
            rows={3}
          />
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
            disabled={!newSupplier.tenNhaCungUng || !newSupplier.sdt || !newSupplier.email || !newSupplier.diaChi}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierModal; 