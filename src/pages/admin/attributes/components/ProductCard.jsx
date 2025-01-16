import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { BiChip, BiMemoryCard, BiDesktop } from 'react-icons/bi';
import { IMEISelector } from './IMEISelector';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductCard = ({ product, addToCart }) => {
  const [showIMEISelector, setShowIMEISelector] = useState(false);
  const [availableIMEIs, setAvailableIMEIs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIMEIs = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/rest/imei/getById/${product.id}`);
        const unusedIMEIs = response.data.filter(imei => !imei.trangThai);
        setAvailableIMEIs(unusedIMEIs);
      } catch (error) {
        console.error('Error fetching IMEIs:', error);
        toast.error('Không thể tải danh sách IMEI');
      } finally {
        setLoading(false);
      }
    };
    fetchIMEIs();
  }, [product.id]);

  const handleAddToCart = () => {
    if (availableIMEIs.length > 0) {
      setShowIMEISelector(true);
    } else {
      toast.error('Sản phẩm đã hết hàng');
    }
  };

  const handleIMEIConfirm = (selectedIMEIs) => {
    if (selectedIMEIs.length > 0) {
      const quantity = selectedIMEIs.length;
      addToCart(product, quantity, selectedIMEIs);
      setShowIMEISelector(false);
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    } else {
      toast.error('Vui lòng chọn ít nhất một IMEI');
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all duration-300">
      <div className="relative group">
        <img 
          src={product.hinhAnhMinhHoa} 
          alt={product.tenSanPhamChiTiet} 
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {loading ? (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            Đang tải...
          </div>
        ) : availableIMEIs.length === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            Hết hàng
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={loading || availableIMEIs.length === 0}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-white text-sm font-medium transition-colors
              ${loading || availableIMEIs.length === 0
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            <FiPlus size={14} />
            Thêm vào giỏ
          </button>
        </div>
        
        <IMEISelector
          isOpen={showIMEISelector}
          onClose={() => setShowIMEISelector(false)}
          product={product}
          onConfirm={handleIMEIConfirm}
          availableIMEIs={availableIMEIs}
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 text-gray-800 line-clamp-2">
          {product.tenSanPhamChiTiet}
        </h3>
        
        <div className="space-y-1 mb-2 text-xs">
          <div className="flex items-center text-gray-600">
            <BiChip className="mr-1 text-blue-500" size={12} />
            <span>Intel Core i7-1165G7</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BiMemoryCard className="mr-1 text-blue-500" size={12} />
            <span>16GB RAM</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BiDesktop className="mr-1 text-blue-500" size={12} />
            <span>512GB SSD</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-base font-bold text-blue-600">
            {product.donGia.toLocaleString()}₫
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 