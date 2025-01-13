import React, { useState } from 'react';
import { FaTicketAlt, FaCheck, FaTimes } from 'react-icons/fa';

function VoucherInput({ onApplyVoucher, appliedVoucher, setAppliedVoucher }) {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8080/api/vouchers/check/${voucherCode}`);
      const data = await response.json();

      if (response.ok && data) {
        onApplyVoucher(data);
        setAppliedVoucher(data);
        setError('');
      } else {
        setError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        setAppliedVoucher(null);
      }
    } catch (error) {
      console.error('Voucher error:', error);
      setError('Có lỗi xảy ra khi kiểm tra mã giảm giá');
      setAppliedVoucher(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherCode('');
    setAppliedVoucher(null);
    onApplyVoucher(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaTicketAlt className="mr-2 text-blue-600" />
        Mã giảm giá
      </h2>

      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã giảm giá"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${error ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading || appliedVoucher}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        {appliedVoucher ? (
          <button
            onClick={handleRemoveVoucher}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <FaTimes className="mr-2" />
            Hủy
          </button>
        ) : (
          <button
            onClick={handleApplyVoucher}
            disabled={loading || !voucherCode.trim()}
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center
              ${(loading || !voucherCode.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang kiểm tra
              </span>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Áp dụng
              </>
            )}
          </button>
        )}
      </div>

      {appliedVoucher && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-700">
                Mã giảm giá đã áp dụng: {appliedVoucher.maVoucher}
              </p>
              <p className="text-sm text-green-600">
                Giảm: {appliedVoucher.giaTriGiam.toLocaleString('vi-VN')}
                {appliedVoucher.loaiGiam === 'PERCENTAGE' ? '%' : 'đ'}
              </p>
            </div>
            <FaCheck className="text-green-500 text-xl" />
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherInput; 