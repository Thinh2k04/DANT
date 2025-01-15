import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartImeiModal = ({ 
  isOpen, 
  onClose, 
  product,
  quantity,
  onConfirm
}) => {
  const [imeiSelections, setImeiSelections] = useState([]);
  const [availableImeis, setAvailableImeis] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetchImeiData();
    }
  }, [isOpen, product]);

  const fetchImeiData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/rest/imei/getById/${product.id}`);
      setAvailableImeis(response.data || []);
      setImeiSelections(Array(quantity).fill(''));
    } catch (error) {
      console.error('Error fetching IMEI data:', error);
      toast.error('Không thể tải danh sách IMEI');
    }
    setLoading(false);
  };

  const handleImeiChange = (index, imei) => {
    const newSelections = [...imeiSelections];
    newSelections[index] = imei;
    setImeiSelections(newSelections);
  };

  const isSelectionComplete = () => {
    return imeiSelections.every(imei => imei !== '');
  };

  const handleConfirm = () => {
    if (!isSelectionComplete()) {
      toast.warning('Vui lòng chọn đủ số IMEI theo số lượng sản phẩm');
      return;
    }
    onConfirm(imeiSelections);
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chọn IMEI cho sản phẩm</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Sản phẩm:</span> {product?.tenSanPham}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Số lượng:</span> {quantity}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {Array(quantity).fill(null).map((_, index) => (
              <div key={index} className="mb-2">
                <select
                  value={imeiSelections[index]}
                  onChange={(e) => handleImeiChange(index, e.target.value)}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Chọn IMEI {index + 1}</option>
                  {availableImeis.map(imei => (
                    <option 
                      key={imei} 
                      value={imei}
                      disabled={imeiSelections.includes(imei) && imeiSelections[index] !== imei}
                    >
                      {imei}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default CartImeiModal; 