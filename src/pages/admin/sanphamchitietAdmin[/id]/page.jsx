import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import Sidebar from '../../Navbar/NavbarAdmin';
import ProductDetails from './components/ProductDetails';
import ProductVariantsTable from './components/ProductVariantsTable';
import AddVariantModal from './components/AddVariantModal';

const ChiTietSanPhamAdmin = () => {
  const { idSanPham } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rams, setRams] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [storages, setStorages] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [colors, setColors] = useState([]);
  const [formData, setFormData] = useState({
    sanPhamChiTiet: {
      id: '',
      hinhAnhMinhHoa: '',
      soLuong: '',
      trangThai: '',
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
      trangThaiSpct: 1,
      gioiThieu: "Laptop Dell Latitude L3540 với bộ vi xử lý Intel i5, RAM 8GB, ổ cứng SSD 256GB, màn hình 15.6\" FHD, thích hợp cho công việc văn phòng và học tập.",
      cardDoHoa: {
        id: 1,
        tenCard: "Card đồ họa NVIDIA GTX 1650",
        trangThai: 1
      }
    },
    imageUrls: [
      "https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg",
      "https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg",
      "https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg"
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productResponse = await axios.get(`http://localhost:8080/rest/san_pham/getById/${idSanPham}`);
        setProductDetails(productResponse.data);

        // Fetch product variants
        const variantsResponse = await axios.get(`http://localhost:8080/rest/san_pham_chi_tiet/getSPCTByIdSP/${idSanPham}`);
        setProductVariants(variantsResponse.data);

        // Fetch component options
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/rest/san_pham_chi_tiet/add', formData);
      const variantsResponse = await axios.get(`http://localhost:8080/rest/san_pham_chi_tiet/getSPCTByIdSP/${idSanPham}`);
      setProductVariants(variantsResponse.data);
      setIsModalOpen(false);
      setFormData({
        sanPhamChiTiet: {
          id: '',
          hinhAnhMinhHoa: 'https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg',
          soLuong: 5,
          trangThai: '1',
          donGia: 20000.0,
          maSpct: 'Dell_01',
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
          trangThaiSpct: 1,
          gioiThieu: "Laptop Dell Latitude L3540 với bộ vi xử lý Intel i5, RAM 8GB, ổ cứng SSD 256GB, màn hình 15.6\" FHD, thích hợp cho công việc văn phòng và học tập.",
          cardDoHoa: {
            id: 1,
            tenCard: "Card đồ họa NVIDIA GTX 1650",
            trangThai: 1
          }
        },
        imageUrls: [
          "https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg",
          "https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg",
          "https://i.postimg.cc/J47PBp3b/mbp-16-spaceblack-cto-hero-202310.jpg"
        ]
      });
    } catch (err) {
      console.error('Error adding product variant:', err);
    }
  };

  const filteredVariants = productVariants.filter(variant =>
    (variant.maSpct?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (variant.sanPham?.tenSanPham?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Chi Tiết Sản Phẩm</h1>

        {/* Search Filter */}
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

        <ProductDetails productDetails={productDetails} />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm chi tiết</h2>
          <ProductVariantsTable variants={filteredVariants} />
        </div>

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
        />
      </div>
    </div>
  );
};

export default ChiTietSanPhamAdmin;
