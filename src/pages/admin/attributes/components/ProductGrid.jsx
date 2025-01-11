import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { BiChip, BiMemoryCard, BiDesktop } from 'react-icons/bi';

const ProductGrid = ({ products, searchTerm, addToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products
        .filter(product => 
          product.tenSanPhamChiTiet.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
    </div>
  );
};

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all duration-300">
      <div className="relative group">
        <img 
          src={product.hinhAnhMinhHoa} 
          alt={product.tenSanPhamChiTiet} 
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.soLuong === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            Hết hàng
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => addToCart(product)}
            disabled={product.soLuong === 0}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-white text-sm font-medium transition-colors
              ${product.soLuong === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            <FiPlus size={14} />
            Thêm vào giỏ
          </button>
        </div>
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
          <p className="text-xs text-gray-500">
            Còn {product.soLuong} sản phẩm
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid; 