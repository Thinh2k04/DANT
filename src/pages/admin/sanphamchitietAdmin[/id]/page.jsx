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

  // State lưu trữ form data cho việc thêm mới sản phẩm chi tiết
  const [formData, setFormData] = useState({
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
    imageUrls: []
  });

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
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

    fetchData();
  }, [idSanPham]);

  // Xử lý submit form thêm mới sản phẩm chi tiết
  const handleSubmit = async (formPayload) => {
    try {
      const response = await axios.post('http://localhost:8080/rest/spctDTO/add', formPayload);
      if (response.status === 200) {
        // Fetch lại danh sách biến thể sau khi thêm thành công
        const variantsResponse = await axios.get(`http://localhost:8080/rest/san_pham_chi_tiet/getSPCTByIdSP/${idSanPham}`);
        setProductVariants(variantsResponse.data);
        setIsModalOpen(false);
        
        // Reset form về trạng thái ban đầu
        setFormData({
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
          imageUrls: []
        });
      }
    } catch (err) {
      console.error('Error adding product variant:', err);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm chi tiết');
    }
  };

  // Lọc danh sách biến thể theo từ khóa tìm kiếm
  const filteredVariants = productVariants.filter(variant =>
    (variant.maSpct?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (variant.sanPham?.tenSanPham?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <ToastContainer />
        <h1 className="text-2xl font-bold mb-6">Chi Tiết Sản Phẩm</h1>

        {/* Thanh tìm kiếm và nút thêm mới */}
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã định danh hoặc tên sản phẩm..."
            className="w-3/4 p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Thêm sản phẩm chi tiết
          </button>
        </div>

        {/* Hiển thị thông tin chi tiết sản phẩm */}
        <ProductDetails productDetails={productDetails} />
        
        {/* Hiển thị danh sách biến thể sản phẩm */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm chi tiết</h2>
          <ProductVariantsTable variants={filteredVariants} />
        </div>

        {/* Modal thêm mới sản phẩm chi tiết */}
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
          productDetails={productDetails}
        />
      </div>
    </div>
  );
};

export default ChiTietSanPhamAdmin;
