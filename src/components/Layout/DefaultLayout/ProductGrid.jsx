import React from 'react';

const ProductGrid = ({ products, onProductClick, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.maDinhDanh}
          className="bg-white rounded-lg shadow-md p-4"
          onClick={() => onProductClick(product)}
        >
          <img
            src={product.sanPham.hinhAnh}
            alt={product.sanPham.tenSanPham}
            className="w-full h-32 object-cover mb-2"
          />
          <h3 className="font-semibold">{product.sanPham.tenSanPham}</h3>
          <p className="text-red-600 font-bold">{product.donGia} VNĐ</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Thêm vào giỏ
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
