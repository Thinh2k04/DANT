import React from 'react';
import ProductCard from './ProductCard';

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

export default ProductGrid; 