// Import các thư viện và components cần thiết
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import Sidebar from '../../Navbar/NavbarAdmin';
import ProductDetails from './components/ProductDetails';
import ProductVariantsTable from './components/ProductVariantsTable';
import AddVariantModal from './components/AddVariantModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component chính để hiển thị chi tiết sản phẩm admin
const ChiTietSanPhamAdmin = () => {
  // Lấy id sản phẩm từ params URL
  const { idSanPham } = useParams();
  
  // Khai báo các state cần thiết
  const [productDetails, setProductDetails] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State lưu trữ danh sách các thành phần
  const [rams, setRams] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [storages, setStorages] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [colors, setColors] = useState([]);

  // State lưu trữ form data với giá trị rỗng
  const [formData, setFormData] = useState({
    sanPham: {
      id: idSanPham
    },
    sanPhamChiTiet: {
      id: '',
      hinhAnhMinhHoa: '',
      soLuong: '',
      trangThai: 1,
      donGia: '',
      maSpct: '',
      sanPham: {
        id: idSanPham
      },
      ram: {
        id: ''
      },
      oLuuTru: {
        id: ''
      },
      manHinh: {
        id: ''
      },
      cpu: {
        id: ''
      },
      gpu: {
        id: ''
      },
      mauSac: {
        id: ''
      },
      gioiThieu: '',
      cardDoHoa: {
        id: '',
        tenCard: '',
        trangThai: 1
      }
    },
    imageUrls: [],
    listImei: []
  });

  const fetchData = async () => {
    try {
      // Fetch thông tin chi tiết sản phẩm
      const productResponse = await axios.get(`http://localhost:8080/rest/san_pham/getById/${idSanPham}`);
      setProductDetails(productResponse.data);

      // Fetch danh sách biến thể sản phẩm
      const variantsResponse = await axios.get(`http://localhost:8080/rest/san_pham_chi_tiet/getSPCTByIdSP/${idSanPham}`);
      setProductVariants(variantsResponse.data);

      // Fetch danh sách các thành phần
      const ramsResponse = await axios.get('http://localhost:8080/rest/ram/getAll');
      setRams(ramsResponse.data);

      const cpusResponse = await axios.get('http://localhost:8080/rest/cpu/getAll'); 
      setCpus(cpusResponse.data);

      const gpusResponse = await axios.get('http://localhost:8080/rest/gpu/getAll');
      setGpus(gpusResponse.data);

      const storagesResponse = await axios.get('http://localhost:8080/rest/o_luu_tru/getAll');
      setStorages(storagesResponse.data);

      const displaysResponse = await axios.get('http://localhost:8080/rest/man_hinh/getAll');
      setDisplays(displaysResponse.data);

      const colorsResponse = await axios.get('http://localhost:8080/rest/mau_sac/getAll');
      setColors(colorsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
      setLoading(false);
    }
  };

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, [idSanPham]);

  // Sửa lại hàm handleSubmit để tạo IMEI theo số lượng nhập vào
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra số lượng
      const soLuong = formData.sanPhamChiTiet.soLuong;
      if (!soLuong || soLuong <= 0) {
        toast.error('Vui lòng nhập số lượng hợp lệ');
        return { success: false };
      }

      // Kiểm tra hình ảnh
      if (!formData.sanPhamChiTiet.hinhAnhMinhHoa) {
        toast.error('Vui lòng chọn hình ảnh đại diện');
        return { success: false };
      }

      // Filter out empty IMEI values
      const validImeis = formData.listImei.filter(imei => imei);

      // Tạo payload với đầy đủ thông tin
      const payload = {
        sanPham: {
          id: formData.sanPham.id
        },
        sanPhamChiTiet: {
          ...formData.sanPhamChiTiet,
          trangThai: 1,
          cardDoHoa: {
            ...formData.sanPhamChiTiet.cardDoHoa,
            trangThai: 1
          }
        },
        imageUrls: [
          formData.sanPhamChiTiet.hinhAnhMinhHoa,
          ...formData.imageUrls
        ],
        listImei: validImeis // Only include valid IMEIs
      };

      const response = await axios.post('http://localhost:8080/rest/spctDTO/add', payload);
      
      if (response.status === 200) {
        toast.success('Thêm sản phẩm chi tiết thành công!');
        const variantsResponse = await axios.get(`http://localhost:8080/rest/san_pham_chi_tiet/getSPCTByIdSP/${idSanPham}`);
        setProductVariants(variantsResponse.data);
        setIsModalOpen(false);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error('Error:', err);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm chi tiết');
      return { success: false };
    }
  };

  // Lọc danh sách biến thể theo từ khóa tìm kiếm và trạng thái
  const filteredVariants = productVariants
    .filter(variant => {
      // Chỉ hiện sản phẩm có trạng thái 1
      const isActive = variant.trangThai === 1;
      // Kiểm tra từ khóa tìm kiếm
      const matchesSearch = searchTerm === '' || 
        (variant.maSpct?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (variant.sanPham?.tenSanPham?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      return isActive && matchesSearch;
    });

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Đang tải...</div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // Render giao diện chính
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-hidden">
        <ToastContainer />
        
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý thông tin và biến thể sản phẩm
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Thêm biến thể mới
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã định danh, tên sản phẩm..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4">
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Trạng thái</option>
                  <option value="1">Đang bán</option>
                  <option value="0">Đã ẩn</option>
                </select>
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Sắp xếp theo</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="quantity">Số lượng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Thông tin sản phẩm</h2>
                <p className="text-sm text-gray-500">Chi tiết và thông số kỹ thuật</p>
              </div>
            </div>
            <ProductDetails productDetails={productDetails} />
          </div>

          {/* Product Variants Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Danh sách biến thể</h2>
                  <p className="text-sm text-gray-500">Quản lý các phiên bản sản phẩm</p>
                </div>
              </div>
            </div>
            <ProductVariantsTable variants={filteredVariants} fetchData={fetchData} />
          </div>
        </div>

        {/* Modals */}
        <AddVariantModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          cpus={cpus}
          rams={rams}
          storages={storages}
          gpus={gpus}
          displays={displays}
          colors={colors}
          idSanPham={idSanPham}
        />
      </div>
    </div>
  );
};

export default ChiTietSanPhamAdmin;
