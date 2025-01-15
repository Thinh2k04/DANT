import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const IMEISelector = ({ isOpen, onClose, product, quantity, onConfirm }) => {
  const [selectedIMEIs, setSelectedIMEIs] = useState([]);
  const [availableIMEIs, setAvailableIMEIs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIMEIs([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchIMEIs = async () => {
      if (isOpen && product) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/rest/imei/getById/${product.id}`);
          const unusedIMEIs = response.data
            .filter(imei => !imei.trangThai)
            .sort((a, b) => a.imei.localeCompare(b.imei));
          setAvailableIMEIs(unusedIMEIs);
        } catch (error) {
          console.error('Error fetching IMEIs:', error);
          toast.error('Không thể tải danh sách IMEI');
        }
        setLoading(false);
      }
    };
    fetchIMEIs();
  }, [isOpen, product]);

  const handleIMEISelect = (imei) => {
    if (selectedIMEIs.includes(imei)) {
      setSelectedIMEIs(selectedIMEIs.filter(i => i !== imei));
    } else if (selectedIMEIs.length < quantity) {
      setSelectedIMEIs([...selectedIMEIs, imei]);
    }
  };

  const handleConfirm = () => {
    if (selectedIMEIs.length === quantity) {
      onConfirm(selectedIMEIs);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chọn IMEI cho {product.tenSanPhamChiTiet}</h3>
          <span className="text-sm text-gray-500">
            Đã chọn: {selectedIMEIs.length}/{quantity}
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
                  ${selectedIMEIs.includes(imei) 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'hover:bg-gray-50'
                  }
                  ${selectedIMEIs.length >= quantity && !selectedIMEIs.includes(imei)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIMEIs.includes(imei)}
                    onChange={() => {}}
                    className="mr-2"
                    disabled={selectedIMEIs.length >= quantity && !selectedIMEIs.includes(imei)}
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
            disabled={selectedIMEIs.length !== quantity}
            className={`px-4 py-2 rounded ${
              selectedIMEIs.length === quantity
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