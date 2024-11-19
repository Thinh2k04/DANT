import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { addToCart } from '../../../utils/cartUtils';
import Footer from '../../../components/Layout/DefaultLayout/Footer';

const HomePage = () => {
  const [laptops, setLaptops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Changed to 12 for better grid layout
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: '',
    brand: '',
    ram: '',
    storage: '',
    processor: ''
  });

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/rest/spctDTO/getAll');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLaptops(data);
        setHasMore(data.length > itemsPerPage);
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);

  const filterLaptops = (laptops) => {
    return laptops.filter(laptop => {
      const price = parseFloat(laptop.donGia);
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (price < min || price > max) return false;
      }
      
      if (filters.brand && laptop.sanPham.thuongHieu !== filters.brand) return false;
      if (filters.ram && laptop.ram !== filters.ram) return false;
      if (filters.storage && laptop.storage !== filters.storage) return false;
      if (filters.processor && laptop.processor !== filters.processor) return false;
      
      return true;
    });
  };

  const filteredLaptops = filterLaptops(laptops);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLaptops.slice(0, indexOfLastItem);
  const totalPages = Math.ceil(filteredLaptops.length / itemsPerPage);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      setHasMore(currentPage + 1 < totalPages);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto py-6 px-4">
        {/* Hero Banner Section */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative">
            <img 
              src="https://cdnb.artstation.com/p/assets/images/images/016/802/459/large/shuja-shuaib-banner.jpg?1553535424" 
              alt="MacBook Pro Banner" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="text-white ml-12">
                <h2 className="text-4xl font-bold mb-4">Chuyển sang dùng Mac</h2>
                <p className="text-xl">Trải nghiệm công nghệ đỉnh cao cùng MacBook</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-6">Bộ lọc tìm kiếm</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">Giá</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="0-20000000">Dưới 20 triệu</option>
                    <option value="20000000-40000000">20 - 40 triệu</option>
                    <option value="40000000-60000000">40 - 60 triệu</option>
                    <option value="60000000-100000000">Trên 60 triệu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Thương hiệu</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="Apple">Apple</option>
                    <option value="Dell">Dell</option>
                    <option value="HP">HP</option>
                    <option value="Lenovo">Lenovo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">RAM</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.ram}
                    onChange={(e) => handleFilterChange('ram', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="8GB">8GB</option>
                    <option value="16GB">16GB</option>
                    <option value="32GB">32GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Ổ cứng</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.storage}
                    onChange={(e) => handleFilterChange('storage', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="256GB">256GB SSD</option>
                    <option value="512GB">512GB SSD</option>
                    <option value="1TB">1TB SSD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Vi xử lý</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.processor}
                    onChange={(e) => handleFilterChange('processor', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="Intel i5">Intel Core i5</option>
                    <option value="Intel i7">Intel Core i7</option>
                    <option value="Intel i9">Intel Core i9</option>
                    <option value="M1">Apple M1</option>
                    <option value="M2">Apple M2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Laptop cao cấp chính hãng</h3>
            </div>
      
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((laptop) => (
                  <div key={laptop.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group" onClick={() => window.location.href = `/chitietsanpham/${laptop.id}`}>
                    <div className="relative">
                      <img src={laptop.hinhAnh} alt={laptop.tenSanPhamChiTiet} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">-10%</div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 h-14">{laptop.tenSanPhamChiTiet}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-red-600 font-bold text-xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(laptop.donGia)}</p>
                        <p className="text-gray-500 line-through text-sm">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(laptop.donGia * 1.1)}</p>
                      </div>
                      <div className="space-y-2">
                        {laptop.specs && Array.isArray(laptop.specs) && laptop.specs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-sm text-gray-600">{spec}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(laptop); }} 
                        className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-8 p-8 bg-white rounded-xl shadow">
                <p className="text-xl text-gray-600">Không tìm thấy sản phẩm phù hợp</p>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleLoadMore} 
                  disabled={loading} 
                  className={`px-6 py-3 rounded-lg font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                >
                  {loading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                </button>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-gray-600">Hiển thị {currentItems.length} trên tổng số {filteredLaptops.length} sản phẩm</p>
            </div>

          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default HomePage;
