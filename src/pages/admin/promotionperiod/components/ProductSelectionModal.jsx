import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductSelectionModal = ({ isOpen, onClose, onConfirm, selectedProducts, setSelectedProducts }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/rest/spctDTO/getAll');
      console.log('API Response:', response.data);
      
      const validProducts = response.data.filter(product => 
        product && product.trangThai === 1
      );
      
      setProducts(validProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.tenSanPham?.toLowerCase().includes(searchLower) ||
      product.maSpct?.toLowerCase().includes(searchLower) ||
      product.tenSanPhamChiTiet?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chọn sản phẩm áp dụng khuyến mãi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedProducts.includes(product.id) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                }`}
                onClick={() => handleProductSelect(product.id)}
              >
                <div className="flex items-center space-x-4">
                  {product.hinhAnhMinhHoa && (
                    <img
                      src={product.hinhAnhMinhHoa}
                      alt={product.tenSanPham}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {product.tenSanPham}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mã: {product.maSpct}
                    </p>
                    <div className="space-y-1 mt-1">
                      <p className="text-sm text-gray-600">
                        RAM: {product.dungLuongRam}GB
                      </p>
                      <p className="text-sm text-gray-600">
                        CPU: {product.tenCPU}
                      </p>
                      <p className="text-sm text-gray-600">
                        GPU: {product.gpu}
                      </p>
                      <p className="text-sm text-gray-600">
                        Màn hình: {product.doPhanGiai}, {product.tanSoQuet}Hz
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.donGia || 0)}
                    </p>
                    {product.discountPercentage && (
                      <p className="text-sm text-red-500">
                        Giảm giá: {product.discountPercentage}%
                      </p>
                    )}
                  </div>
                </div>
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
            onClick={() => {
              onConfirm(selectedProducts);
              onClose();
            }}
            disabled={selectedProducts.length === 0}
            className={`px-4 py-2 rounded text-white ${
              selectedProducts.length > 0 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Xác nhận ({selectedProducts.length} sản phẩm)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal; 