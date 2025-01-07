import React from 'react';
import { toast } from 'react-toastify';

const EditSupplierModal = ({ editingSupplier, setEditingSupplier, onSuccess }) => {
  if (!editingSupplier) return null;

  const handleSubmit = async () => {
    try {
      if (!editingSupplier.tenNhaCungUng || !editingSupplier.sdt || !editingSupplier.email || !editingSupplier.diaChi) {
        toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
        return;
      }

      // Validate phone number
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(editingSupplier.sdt)) {
        toast.error('Số điện thoại không hợp lệ');
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editingSupplier.email)) {
        toast.error('Email không hợp lệ');
        return;
      }

      const response = await fetch(`http://localhost:8080/rest/nguon_nhap/update/${editingSupplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSupplier),
      });

      if (!response.ok) throw new Error('Failed to update supplier');
      
      toast.success('Cập nhật nhà cung ứng thành công');
      setEditingSupplier(null);
      onSuccess();
    } catch (error) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Sửa Nhà Cung Ứng</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhà cung ứng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingSupplier.tenNhaCungUng}
              onChange={(e) => setEditingSupplier({
                ...editingSupplier,
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
              value={editingSupplier.sdt}
              onChange={(e) => setEditingSupplier({
                ...editingSupplier,
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
              value={editingSupplier.email}
              onChange={(e) => setEditingSupplier({
                ...editingSupplier,
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
              value={editingSupplier.trangThai}
              onChange={(e) => setEditingSupplier({
                ...editingSupplier,
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
            value={editingSupplier.diaChi}
            onChange={(e) => setEditingSupplier({
              ...editingSupplier,
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
            value={editingSupplier.ghiChu}
            onChange={(e) => setEditingSupplier({
              ...editingSupplier,
              ghiChu: e.target.value
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập ghi chú"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setEditingSupplier(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!editingSupplier.tenNhaCungUng || !editingSupplier.sdt || !editingSupplier.email || !editingSupplier.diaChi}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierModal; 