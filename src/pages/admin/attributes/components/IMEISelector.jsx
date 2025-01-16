import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const IMEISelector = ({ isOpen, onClose, product, onConfirm, availableIMEIs }) => {
  const [selectedIMEIs, setSelectedIMEIs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIMEIs([]);
    }
  }, [isOpen]);

  const handleIMEISelect = (imei) => {
    if (selectedIMEIs.includes(imei)) {
      setSelectedIMEIs(selectedIMEIs.filter(i => i.id !== imei.id));
    } else {
      setSelectedIMEIs([...selectedIMEIs, imei]);
    }
  };

  const handleConfirm = () => {
    if (selectedIMEIs.length > 0) {
      onConfirm(selectedIMEIs);
      onClose();
    } else {
      toast.error('Vui lòng chọn ít nhất một IMEI');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chọn IMEI cho {product.tenSanPhamChiTiet}</h3>
          <span className="text-sm text-gray-500">
            Đã chọn: {selectedIMEIs.length}
          </span>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải danh sách IMEI...</p>
          </div>
        ) : availableIMEIs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có IMEI khả dụng</p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {availableIMEIs.map((imei) => (
              <div
                key={imei.id}
                onClick={() => handleIMEISelect(imei)}
                className={`p-2 border rounded mb-2 cursor-pointer transition-colors
                  ${selectedIMEIs.find(selected => selected.id === imei.id)
                    ? 'bg-blue-50 border-blue-500' 
                    : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIMEIs.find(selected => selected.id === imei.id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="flex-1">{imei.imei}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIMEIs.length === 0}
            className={`px-4 py-2 rounded ${
              selectedIMEIs.length > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}; 