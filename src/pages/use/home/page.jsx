// Import các thư viện và components cần thiết từ React và các nguồn khác
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { addToCart } from '../../../utils/cartUtils';
import Footer from '../../../components/Layout/DefaultLayout/Footer';
import { FaShoppingCart, FaSearch, FaFilter, FaLaptop, FaMemory, FaHdd, FaMicrochip, FaTag } from 'react-icons/fa';
import { IoMdPricetag } from 'react-icons/io';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCartItemQuantity } from '../../../utils/cartUtils';
import CartToast from '../../../components/Toast/CartToast';

// Định nghĩa component HomePage
const HomePage = () => {
  // Khai báo các state cần thiết
  const [laptops, setLaptops] = useState([]); // State lưu trữ danh sách laptop
  const [currentPage, setCurrentPage] = useState(1); // State quản lý trang hiện tại
  const itemsPerPage = 12; // Số sản phẩm hiển thị trên mỗi trang
  const [loading, setLoading] = useState(false); // State quản lý trạng thái loading
  const [hasMore, setHasMore] = useState(true); // State kiểm tra còn sản phẩm để load không
  const [filters, setFilters] = useState({ // State quản lý các bộ lọc
    priceRange: '',
    brand: '',
    ram: '',
    storage: '',
    processor: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null); // Thêm state cho sản phẩm được chọn
  const [showToast, setShowToast] = useState(false); // Thêm state cho toast notification

  // useEffect hook để fetch dữ liệu laptop khi component mount
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

  // Hàm lọc laptop dựa trên các bộ lọc đã chọn
  const filterLaptops = (laptops) => {
    return laptops.filter(laptop => {
      const price = parseFloat(laptop.donGia);
      
      // Kiểm tra điều kiện lọc theo giá
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (price < min || price > max) return false;
      }
      
      // Kiểm tra các điều kiện lọc khác
      if (filters.brand && laptop.sanPham.thuongHieu !== filters.brand) return false;
      if (filters.ram && laptop.ram !== filters.ram) return false;
      if (filters.storage && laptop.storage !== filters.storage) return false;
      if (filters.processor && laptop.processor !== filters.processor) return false;
      
      return true;
    });
  };

  // Xử lý dữ liệu để hiển thị
  const filteredLaptops = filterLaptops(laptops);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLaptops.slice(0, indexOfLastItem);
  const totalPages = Math.ceil(filteredLaptops.length / itemsPerPage);

  // Hàm xử lý khi click nút "Xem thêm"
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      setHasMore(currentPage + 1 < totalPages);
    }
  };

  // Hàm xử lý khi thay đổi bộ lọc
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
    setHasMore(true);
  };

  // Hàm xử lý khi thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (laptop) => {
    console.log("Function handleAddToCart called");
    try {
      const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItem = currentCart.find(item => item.id === laptop.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      const result = await updateCartItemQuantity(laptop.id, newQuantity);
      if (result.success) {
        if (existingItem) {
          existingItem.quantity = newQuantity;
        } else {
          currentCart.push({ ...laptop, quantity: 1 });
        }
        localStorage.setItem('cartItems', JSON.stringify(currentCart));

        // toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });

        setSelectedProduct(laptop);
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Return JSX để render giao diện
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      <CartToast 
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        product={selectedProduct}
      />
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Phần Hero Section - Banner chính */}
        <div className="mb-10">
          <div className="relative rounded-2xl overflow-hidden h-[500px] shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3"
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="text-white ml-16 max-w-xl space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Laptop Chính Hãng
                  <br />
                  <span className="text-blue-400">Chất Lượng Hàng Đầu</span>
                </h1>
                <p className="text-xl text-gray-200">
                  Khám phá bộ sưu tập laptop cao cấp với công nghệ mới nhất
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition flex items-center gap-2">
                  <FaSearch className="text-xl" />
                  Khám phá ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Phần Sidebar chứa các bộ lọc */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                Bộ lọc
              </h3>
              
              <div className="space-y-5">
                {/* Bộ lọc theo giá */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <IoMdPricetag className="text-blue-600" />
                    Khoảng giá
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="">Tất cả mức giá</option>
                    <option value="0-20000000">Dưới 20 triệu</option>
                    <option value="20000000-40000000">20 - 40 triệu</option>
                    <option value="40000000-60000000">40 - 60 triệu</option>
                    <option value="60000000-100000000">Trên 60 triệu</option>
                  </select>
                </div>

                {/* Bộ lọc theo thương hiệu */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaLaptop className="text-blue-600" />
                    Thương hiệu
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    <option value="Apple">Apple</option>
                    <option value="Dell">Dell</option>
                    <option value="HP">HP</option>
                    <option value="Lenovo">Lenovo</option>
                  </select>
                </div>

                {/* Bộ lọc theo RAM */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaMemory className="text-blue-600" />
                    RAM
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.ram}
                    onChange={(e) => handleFilterChange('ram', e.target.value)}
                  >
                    <option value="">Tất cả RAM</option>
                    <option value="8GB">8GB</option>
                    <option value="16GB">16GB</option>
                    <option value="32GB">32GB</option>
                  </select>
                </div>

                {/* Bộ lọc theo ổ cứng */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaHdd className="text-blue-600" />
                    Ổ cứng
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.storage}
                    onChange={(e) => handleFilterChange('storage', e.target.value)}
                  >
                    <option value="">Tất cả dung lượng</option>
                    <option value="256GB">256GB SSD</option>
                    <option value="512GB">512GB SSD</option>
                    <option value="1TB">1TB SSD</option>
                  </select>
                </div>

                {/* Bộ lọc theo CPU */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaMicrochip className="text-blue-600" />
                    Vi xử lý
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.processor}
                    onChange={(e) => handleFilterChange('processor', e.target.value)}
                  >
                    <option value="">Tất cả CPU</option>
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

          {/* Phần hiển thị lưới sản phẩm */}
          <div className="col-span-9">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Laptop cao cấp chính hãng</h2>
              <p className="text-gray-600 mt-2">Hiển thị {currentItems.length} trên {filteredLaptops.length} sản phẩm</p>
            </div>

            {/* Hiển thị danh sách sản phẩm hoặc thông báo không tìm thấy */}
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((laptop) => (
                  <div key={laptop.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                    onClick={() => window.location.href = `/chitietsanpham/${laptop.id}`}
                  >
                    <div className="relative aspect-w-16 aspect-h-9">
                      <img 
                        src={laptop.hinhAnhMinhHoa} 
                        alt={laptop.tenSanPhamChiTiet}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <FaTag />
                        -10%
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                        {laptop.tenSanPhamChiTiet}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <AiFillStar className="text-yellow-400" />
                        <AiFillStar className="text-yellow-400" />
                        <AiFillStar className="text-yellow-400" />
                        <AiFillStar className="text-yellow-400" />
                        <AiOutlineStar className="text-yellow-400" />
                        <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-red-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(laptop.donGia)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(laptop.donGia * 1.1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {laptop.specs && laptop.specs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2 text-gray-600">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span className="text-sm">{spec}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("đã click vào nút thêm")
                          handleAddToCart(laptop);
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart />
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm phù hợp</p>
              </div>
            )}

            {/* Nút "Xem thêm" */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg font-semibold ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors`}
                >
                  {loading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Export component HomePage
export default HomePage;
