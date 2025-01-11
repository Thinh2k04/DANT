import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaShoppingCart, FaRegHeart, FaSearch } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';

const ProductGrid = ({ products, onProductClick, onAddToCart }) => {
  const { t } = useTranslation();

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.maDinhDanh}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative"
          onClick={() => onProductClick(product)}
        >
          {/* Badge - New Product */}
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              Mới
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <FaRegHeart className="text-gray-600 text-lg" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <FaSearch className="text-gray-600 text-lg" />
            </button>
          </div>

          {/* Product Image */}
          <div className="relative h-[200px] overflow-hidden bg-gray-50 p-4">
            <img
              src={product.sanPham.hinhAnh}
              alt={product.sanPham.tenSanPham}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Product Name */}
            <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
              {product.sanPham.tenSanPham}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, index) => (
                <AiFillStar key={index} className="text-yellow-400 text-sm" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(5.0)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(product.donGia)}
              </span>
              {product.giaGoc && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.giaGoc)}
                </span>
              )}
              {product.giamGia && (
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  -{product.giamGia}%
                </span>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span className="text-xs">CPU: Intel Core i5</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span className="text-xs">RAM: 8GB</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span className="text-xs">SSD: 512GB</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaShoppingCart className="text-sm" />
              {t('addToCart')}
            </button>
          </div>

          {/* Progress Bar for Stock */}
          <div className="px-4 pb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '70%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Còn lại: 7 sản phẩm
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
