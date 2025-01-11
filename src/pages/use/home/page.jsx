// Import các thư viện và components cần thiết từ React và các nguồn khác
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { addToCart } from '../../../utils/cartUtils';
import Footer from '../../../components/Layout/DefaultLayout/Footer';
import { FaShoppingCart, FaSearch, FaFilter, FaLaptop, FaMemory, FaHdd, FaMicrochip, FaDesktop, FaFire, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdPricetag } from 'react-icons/io';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCartItemQuantity } from '../../../utils/cartUtils';
import CartToast from '../../../components/Toast/CartToast';

// Tạo hàm định dạng tiền Việt Nam
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Định nghĩa component HomePage
const HomePage = () => {
  // Khai báo các state cần thiết
  const [products, setProducts] = useState([]); // State lưu trữ danh sách sản phẩm
  const [currentPage, setCurrentPage] = useState(1); // State quản lý trang hiện tại
  const itemsPerPage = 12; // Số sản phẩm hiển thị trên mỗi trang
  const [loading, setLoading] = useState(true); // State quản lý trạng thái loading
  const [hasMore, setHasMore] = useState(true); // State kiểm tra còn sản phẩm để load không
  const [filters, setFilters] = useState({ // State quản lý các bộ lọc
    priceRange: '',
    thuongHieu: '',
    ram: '',
    oCung: '',
    cpu: '',
    manHinh: '' // Thêm filter cho màn hình
  });
  const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
  const [selectedProduct, setSelectedProduct] = useState(null); // Thêm state cho sản phẩm được chọn
  const [showToast, setShowToast] = useState(false); // Thêm state cho toast notification
  const [thuongHieus, setThuongHieus] = useState([]); // State cho thương hiệu
  const [rams, setRams] = useState([]); // State cho RAM
  const [oCungs, setOCungs] = useState([]); // State cho ổ cứng  
  const [cpus, setCpus] = useState([]); // State cho CPU
  const [manHinhs, setManHinhs] = useState([]); // State cho màn hình

  // Hàm fetch dữ liệu sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/rest/discount/active');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm tìm kiếm laptop
  useEffect(() => {
    const searchLaptops = async () => {
      try {
        setLoading(true);
        let response;
        if (searchTerm.trim() === '') {
          response = await fetch('http://localhost:8080/rest/spctDTO/getAll');
        } else {
          response = await fetch(`http://localhost:8080/rest/san_pham_chi_tiet/tim_kiem/${searchTerm}`);
        }
        if (!response.ok) throw new Error('Failed to search laptops');
        const searchResults = await response.json();
        setProducts(searchResults);
        setCurrentPage(1);
        setHasMore(searchResults.length > itemsPerPage);
      } catch (error) {
        console.error('Error searching laptops:', error);
        toast.error('Có lỗi xảy ra khi tìm kiếm sản phẩm!');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchLaptops();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Hàm lọc laptop dựa trên các bộ lọc đã chọn
  const filterLaptops = async (newFilters) => {
    try {
      setLoading(true);
      
      let minPrice = '';
      let maxPrice = '';
      if (newFilters.priceRange) {
        [minPrice, maxPrice] = newFilters.priceRange.split('-');
      }

      const url = `http://localhost:8080/rest/san_pham_chi_tiet/loc/${minPrice || ''}&${maxPrice || ''}&${newFilters.thuongHieu || ''}&${newFilters.oCung || ''}&${newFilters.cpu || ''}&${newFilters.ram || ''}&${newFilters.manHinh || ''}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to filter laptops');
      
      const filteredData = await response.json();
      setProducts(filteredData);
      setCurrentPage(1);
      setHasMore(filteredData.length > itemsPerPage);
      
    } catch (error) {
      console.error('Error filtering laptops:', error);
      toast.error('Có lỗi xảy ra khi lọc sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý dữ liệu để hiển thị
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = products.slice(0, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Hàm xử lý khi click nút "Xem thêm"
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      setHasMore(currentPage + 1 < totalPages);
    }
  };

  // Hàm xử lý khi thay đổi bộ lọc
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    setFilters(newFilters);
    filterLaptops(newFilters);
  };

  // Hàm xử lý khi thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (laptop) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItem = currentCart.find(item => item.id === laptop.id);
      const newQuantity = existingItem ? (existingItem.quantity || 1) + 1 : 1;

      const result = await updateCartItemQuantity(laptop.id, newQuantity);
      if (result.success) {
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
          <div className="relative rounded-2xl overflow-hidden h-[500px] shadow-lg mb-8">
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
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm laptop..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-6 py-3 rounded-full w-96 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thêm phần categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaLaptop className="text-blue-600 text-xl" />
              </div>
              <span className="text-sm font-medium">Gaming Laptop</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaLaptop className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium">Business Laptop</span>
            </div>
            {/* Thêm các categories khác tương tự */}
          </div>
        </div>

        {/* Thêm section sản phẩm mới sau phần categories và trước phần khuyến mãi hot */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Sản Phẩm Mới
            </h2>
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Xem tất cả</a>
          </div>

          {/* Slider sản phẩm mới */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentItems.slice(0, 4).map((laptop) => (
                <div key={laptop.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative"
                  onClick={() => window.location.href = `/chitietsanpham/${laptop.id}`}
                >
                  {/* Badge "Mới" - Điều chỉnh lại style */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                      <FaStar className="text-yellow-300 text-xs" />
                      Mới ra mắt
                    </div>
                  </div>

                  <div className="relative h-[200px] overflow-hidden">
                    <img 
                      src={laptop.hinhAnhMinhHoa} 
                      alt={laptop.tenSanPhamChiTiet}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors">
                      {laptop.tenSanPhamChiTiet}
                    </h3>
                    
                    {/* Đánh giá sao */}
                    <div className="flex items-center gap-0.5 mb-2">
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiOutlineStar className="text-yellow-400 text-sm" />
                      <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                    </div>

                    {/* Giá */}
                    <div className="flex items-baseline gap-2 mb-3">
                      {laptop.discountPercentage > 0 ? (
                        <>
                          <span className="text-xl font-bold text-red-600">
                            {formatCurrency(laptop.discountedPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(laptop.donGia)}
                          </span>
                          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            -{laptop.discountPercentage}%
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-red-600">
                          {formatCurrency(laptop.donGia)}
                        </span>
                      )}
                    </div>

                    {/* Thông số kỹ thuật */}
                    <div className="space-y-1.5 mb-4">
                      {laptop.specs && laptop.specs.map((spec, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                          <span className="text-xs">{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Nút thêm vào giỏ hàng */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(laptop);
                      }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FaShoppingCart className="text-xs" />
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Nút điều hướng (tùy chọn) */}
            <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Thêm section khuyến mãi hot */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaFire className="text-orange-500" />
              Khuyến Mãi Hot
            </h2>
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Xem tất cả</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hiển thị 4 sản phẩm khuyến mãi hot */}
            {currentItems.slice(0, 4).map((laptop) => (
              <div key={laptop.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                onClick={() => window.location.href = `/chitietsanpham/${laptop.id}`}
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img 
                    src={laptop.hinhAnhMinhHoa} 
                    alt={laptop.tenSanPhamChiTiet}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors">
                    {laptop.tenSanPhamChiTiet}
                  </h3>
                  
                  <div className="flex items-center gap-0.5 mb-2">
                    <AiFillStar className="text-yellow-400 text-sm" />
                    <AiFillStar className="text-yellow-400 text-sm" />
                    <AiFillStar className="text-yellow-400 text-sm" />
                    <AiFillStar className="text-yellow-400 text-sm" />
                    <AiOutlineStar className="text-yellow-400 text-sm" />
                    <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    {laptop.discountPercentage > 0 ? (
                      <>
                        <span className="text-xl font-bold text-red-600">
                          {formatCurrency(laptop.discountedPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(laptop.donGia)}
                        </span>
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                          -{laptop.discountPercentage}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(laptop.donGia)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {laptop.specs && laptop.specs.map((spec, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        <span className="text-xs">{spec}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("đã click vào nút thêm")
                      handleAddToCart(laptop);
                    }}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FaShoppingCart className="text-xs" />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thêm banner quảng cáo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="relative rounded-xl overflow-hidden h-[200px] shadow-sm group">
            <img 
              src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440677/u9hh2q6oqqeqeaewwnvl.png" 
              alt="Promo 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">Laptop Gaming</h3>
                <p className="text-sm mb-4">Giảm đến 20% cho laptop gaming cao cấp</p>
                <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100">
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
          {/* Banner thứ 2 tương tự */}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Phần Sidebar chứa các bộ lọc */}
          <div className="col-span-12">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                Bộ lọc tìm kiếm
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Bộ lọc theo giá */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <IoMdPricetag className="text-blue-600" />
                    Khoảng giá
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    value={filters.thuongHieu}
                    onChange={(e) => handleFilterChange('thuongHieu', e.target.value)}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {thuongHieus.map(th => (
                      <option key={th.id} value={th.id}>{th.ten}</option>
                    ))}
                  </select>
                </div>

                {/* Bộ lọc RAM */}
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
                    {rams.map(ram => (
                      <option key={ram.id} value={ram.id}>{ram.dungLuong}</option>
                    ))}
                  </select>
                </div>

                {/* Bộ lọc ổ cứng */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaHdd className="text-blue-600" />
                    Ổ cứng
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.oCung}
                    onChange={(e) => handleFilterChange('oCung', e.target.value)}
                  >
                    <option value="">Tất cả ổ cứng</option>
                    {oCungs.map(oc => (
                      <option key={oc.id} value={oc.id}>{oc.dungLuong}</option>
                    ))}
                  </select>
                </div>

                {/* Bộ lọc CPU */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaMicrochip className="text-blue-600" />
                    CPU
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.cpu}
                    onChange={(e) => handleFilterChange('cpu', e.target.value)}
                  >
                    <option value="">Tất cả CPU</option>
                    {cpus.map(cpu => (
                      <option key={cpu.id} value={cpu.id}>{cpu.ten}</option>
                    ))}
                  </select>
                </div>

                {/* Bộ lọc màn hình */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <FaDesktop className="text-blue-600" />
                    Màn hình
                  </label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.manHinh}
                    onChange={(e) => handleFilterChange('manHinh', e.target.value)}
                  >
                    <option value="">Tất cả màn hình</option>
                    {manHinhs.map(mh => (
                      <option key={mh.id} value={mh.id}>{mh.doPhanGiai}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Phần hiển thị lưới sản phẩm */}
          <div className="col-span-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Laptop cao cấp chính hãng</h2>
                <p className="text-gray-600 mt-2">Hiển thị {currentItems.length} trên {products.length} sản phẩm</p>
              </div>
              <div className="flex items-center gap-4">
                <select className="p-2 border rounded-lg text-sm">
                  <option>Mới nhất</option>
                  <option>Giá thấp đến cao</option>
                  <option>Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            {/* Grid sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentItems.map((laptop) => (
                <div key={laptop.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                  onClick={() => window.location.href = `/chitietsanpham/${laptop.id}`}
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img 
                      src={laptop.hinhAnhMinhHoa} 
                      alt={laptop.tenSanPhamChiTiet}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors">
                      {laptop.tenSanPhamChiTiet}
                    </h3>
                    
                    <div className="flex items-center gap-0.5 mb-2">
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiFillStar className="text-yellow-400 text-sm" />
                      <AiOutlineStar className="text-yellow-400 text-sm" />
                      <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      {laptop.discountPercentage > 0 ? (
                        <>
                          <span className="text-xl font-bold text-red-600">
                            {formatCurrency(laptop.discountedPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(laptop.donGia)}
                          </span>
                          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            -{laptop.discountPercentage}%
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-red-600">
                          {formatCurrency(laptop.donGia)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {laptop.specs && laptop.specs.map((spec, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                          <span className="text-xs">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("đã click vào nút thêm")
                        handleAddToCart(laptop);
                      }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FaShoppingCart className="text-xs" />
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>

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

        {/* Thêm section thương hiệu */}
        <div className="mt-12 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Thương Hiệu Nổi Bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/2560px-ASUS_Logo.svg.png"
                alt="Asus"
                className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group">
              <img 
                src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440454/ukjuluivcnngv6e8t6jd.png"
                alt="Dell"
                className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group">
              <img 
                src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440454/ygfawyv2nd9d5tsfoid2.jpg"
                alt="HP"
                className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group">
              <img 
                src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440455/aftzvc9xhze9icwgpeb7.jpg"
                alt="Lenovo"
                className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group">
              <img 
                src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440454/t4yutphliecvhkthczsu.jpg"
                alt="Acer"
                className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center group">
              <img 
                src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440455/tmyjpkdwq3hawxj59o2s.png"
                alt="MSI"
                className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
// Export component HomePage
export default HomePage;
