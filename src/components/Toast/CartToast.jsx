import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimes, FaShoppingCart } from 'react-icons/fa';

const CartToast = ({ isVisible, onClose, product }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[320px] max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 p-2 rounded-full">
              <FaCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="font-medium text-gray-800">Thêm vào giỏ thành công!</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg mb-3">
          <img 
            src={product?.hinhAnhMinhHoa} 
            alt={product?.tenSanPhamChiTiet}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-grow">
            <p className="text-gray-800 font-medium line-clamp-1">{product?.tenSanPhamChiTiet}</p>
            <p className="text-green-600 font-medium">
              {product?.donGia?.toLocaleString('vi-VN')}₫
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
          <Link
          
            to="/cart"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartToast; 