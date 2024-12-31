// Import các thư viện và components cần thiết từ React và các nguồn khác
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import { addToCart } from '../../../utils/cartUtils';
import Footer from '../../../components/Layout/DefaultLayout/Footer';
import { FaShoppingCart, FaSearch, FaFilter, FaLaptop, FaMemory, FaHdd, FaMicrochip, FaTag, FaDesktop } from 'react-icons/fa';
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

  // useEffect hook để fetch dữ liệu laptop và các options cho bộ lọc khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch danh sách laptop
        const laptopsResponse = await fetch('http://localhost:8080/rest/spctDTO/getAll');
        if (!laptopsResponse.ok) throw new Error('Failed to fetch laptops');
        const laptopsData = await laptopsResponse.json();
        setLaptops(laptopsData);
        setHasMore(laptopsData.length > itemsPerPage);

        // Fetch danh sách thương hiệu
        const thuongHieuResponse = await fetch('http://localhost:8080/rest/thuong-hieu/getAll');
        if (!thuongHieuResponse.ok) throw new Error('Failed to fetch brands');
        const thuongHieuData = await thuongHieuResponse.json();
        setThuongHieus(thuongHieuData);

        // Fetch danh sách RAM
        const ramResponse = await fetch('http://localhost:8080/rest/ram/getAll');
        if (!ramResponse.ok) throw new Error('Failed to fetch RAM');
        const ramData = await ramResponse.json();
        setRams(ramData);

        // Fetch danh sách ổ cứng
        const oCungResponse = await fetch('http://localhost:8080/rest/o_luu_tru/getAll');
        if (!oCungResponse.ok) throw new Error('Failed to fetch storage');
        const oCungData = await oCungResponse.json();
        setOCungs(oCungData);

        // Fetch danh sách CPU
        const cpuResponse = await fetch('http://localhost:8080/rest/cpu/getAll');
        if (!cpuResponse.ok) throw new Error('Failed to fetch CPUs');
        const cpuData = await cpuResponse.json();
        setCpus(cpuData);

        // Fetch danh sách màn hình
        const manHinhResponse = await fetch('http://localhost:8080/rest/man_hinh/getAll');
        if (!manHinhResponse.ok) throw new Error('Failed to fetch screens');
        const manHinhData = await manHinhResponse.json();
        setManHinhs(manHinhData);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm tìm kiếm laptop
  const searchLaptops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/rest/san_pham_chi_tiet/tim_kiem/${searchTerm}`);
      if (!response.ok) throw new Error('Failed to search laptops');
      const searchResults = await response.json();
      setLaptops(searchResults);
      setCurrentPage(1);
      setHasMore(searchResults.length > itemsPerPage);
    } catch (error) {
      console.error('Error searching laptops:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc laptop dựa trên các bộ lọc đã chọn
  const filterLaptops = async () => {
    try {
      setLoading(true);
      
      // Tạo query params từ filters
      const params = new URLSearchParams();
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        params.append('minPrice', min);
        params.append('maxPrice', max);
      }
      if (filters.thuongHieu) params.append('thuongHieuId', filters.thuongHieu);
      if (filters.ram) params.append('ramId', filters.ram);
      if (filters.oCung) params.append('oCungId', filters.oCung);
      if (filters.cpu) params.append('cpuId', filters.cpu);
      if (filters.manHinh) params.append('manHinhId', filters.manHinh);

      // Gọi API với các params đã được lọc
      const response = await fetch(`http://localhost:8080/rest/spctDTO/filter?${params}`);
      if (!response.ok) throw new Error('Failed to filter laptops');
      
      const filteredData = await response.json();
      setLaptops(filteredData);
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
  const currentItems = laptops.slice(0, indexOfLastItem);
  const totalPages = Math.ceil(laptops.length / itemsPerPage);

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
    filterLaptops();
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
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm laptop..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-6 py-3 rounded-full w-96 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={searchLaptops}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition flex items-center gap-2"
                  >
                    <FaSearch className="text-xl" />
                    Tìm kiếm
                  </button>
                </div>
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
                    value={filters.thuongHieu}
                    onChange={(e) => handleFilterChange('thuongHieu', e.target.value)}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {thuongHieus.map(th => (
                      <option key={th.id} value={th.id}>{th.ten}</option>
                    ))}
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
                    {rams.map(ram => (
                      <option key={ram.id} value={ram.id}>{ram.dungLuong}</option>
                    ))}
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
                    value={filters.oCung}
                    onChange={(e) => handleFilterChange('oCung', e.target.value)}
                  >
                    <option value="">Tất cả dung lượng</option>
                    {oCungs.map(oc => (
                      <option key={oc.id} value={oc.id}>{oc.dungLuong}</option>
                    ))}
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
                    value={filters.cpu}
                    onChange={(e) => handleFilterChange('cpu', e.target.value)}
                  >
                    <option value="">Tất cả CPU</option>
                    {cpus.map(cpu => (
                      <option key={cpu.id} value={cpu.id}>{cpu.ten}</option>
                    ))}
                  </select>
                </div>

                {/* Bộ lọc theo màn hình */}
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
          <div className="col-span-9">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Laptop cao cấp chính hãng</h2>
              <p className="text-gray-600 mt-2">Hiển thị {currentItems.length} trên {laptops.length} sản phẩm</p>
            </div>

            {/* Hiển thị danh sách sản phẩm hoặc thông báo không tìm thấy */}
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaTag className="text-xs" />
                        -10%
                      </div>
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
                        <span className="text-xl font-bold text-red-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(laptop.donGia)}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(laptop.donGia * 1.1)}
                        </span>
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
