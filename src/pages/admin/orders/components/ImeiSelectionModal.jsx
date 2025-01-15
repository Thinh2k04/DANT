import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImeiSelectionModal = ({ 
  isOpen, 
  onClose, 
  orderDetails,
  onConfirm,
  maHoaDon 
}) => {
  const [imeiSelections, setImeiSelections] = useState({});
  const [availableImeis, setAvailableImeis] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderDetails.length > 0) {
      fetchImeiData();
    }
  }, [isOpen, orderDetails]);

  const fetchImeiData = async () => {
    setLoading(true);
    try {
      const imeiData = {};
      for (const detail of orderDetails) {
        const response = await axios.get(`http://localhost:8080/rest/imei/getById/${detail.sanPhamChiTiet.id}`);
        imeiData[detail.sanPhamChiTiet.id] = response.data;
      }
      setAvailableImeis(imeiData);
      
      const initialSelections = {};
      orderDetails.forEach(detail => {
        initialSelections[detail.sanPhamChiTiet.id] = Array(detail.soLuong).fill('');
      });
      setImeiSelections(initialSelections);
    } catch (error) {
      console.error('Error fetching IMEI data:', error);
      toast.error('Không thể tải danh sách IMEI');
    }
    setLoading(false);
  };

  const handleImeiChange = (spctId, index, imei) => {
    setImeiSelections(prev => {
      const newSelections = { ...prev };
      newSelections[spctId][index] = imei;
      return newSelections;
    });
  };

  const isSelectionComplete = () => {
    return Object.entries(imeiSelections).every(([_, imeis]) => 
      imeis.every(imei => imei !== '')
    );
  };

  const handleConfirm = () => {
    if (!isSelectionComplete()) {
      toast.warning('Vui lòng chọn đủ số IMEI theo số lượng sản phẩm');
      return;
    }

    const listImei = [];
    let id = 1;

    Object.entries(imeiSelections).forEach(([spctId, imeis]) => {
      imeis.forEach(imei => {
        if (imei) {
          listImei.push({
            id: id++,
            spct: {
              id: parseInt(spctId)
            },
            imei: imei
          });
        }
      });
    });

    onConfirm(maHoaDon, listImei);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chọn IMEI cho sản phẩm</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {orderDetails.map(detail => (
              <div key={detail.sanPhamChiTiet.id} className="mb-6 border-b pb-4">
                <h3 className="font-semibold mb-2">
                  {detail.sanPhamChiTiet.sanPham.tenSanPham} - Số lượng: {detail.soLuong}
                </h3>
                
                {Array(detail.soLuong).fill(null).map((_, index) => (
                  <div key={index} className="mb-2">
                    <select
                      value={imeiSelections[detail.sanPhamChiTiet.id]?.[index] || ''}
                      onChange={(e) => handleImeiChange(detail.sanPhamChiTiet.id, index, e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Chọn IMEI {index + 1}</option>
                      {availableImeis[detail.sanPhamChiTiet.id]?.map(imei => (
                        <option 
                          key={imei} 
                          value={imei}
                          disabled={Object.values(imeiSelections[detail.sanPhamChiTiet.id] || {})
                            .includes(imei) && imeiSelections[detail.sanPhamChiTiet.id][index] !== imei}
                        >
                          {imei}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isSelectionComplete()}
                className={`px-4 py-2 rounded text-white ${
                  isSelectionComplete() 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImeiSelectionModal; 