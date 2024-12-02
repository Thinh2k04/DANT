import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Sidebar from '../../Navbar/NavbarAdmin';

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
        const ramsResponse = await axios.get('http://localhost:8080/rest/ram');
        setRams(ramsResponse.data);

        const cpusResponse = await axios.get('http://localhost:8080/api/cpus'); 
        setCpus(cpusResponse.data);

        const gpusResponse = await axios.get('http://localhost:8080/api/gpus');
        setGpus(gpusResponse.data);

        const storagesResponse = await axios.get('http://localhost:8080/api/storages');
        setStorages(storagesResponse.data);

        const displaysResponse = await axios.get('http://localhost:8080/api/displays');
        setDisplays(displaysResponse.data);

        const colorsResponse = await axios.get('http://localhost:8080/api/colors');
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

        {/* Product Details Table */}
        {productDetails && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
            <table className="min-w-full bg-white border border-gray-300 mb-8">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Tên Sản Phẩm</th>
                  <th className="border px-4 py-2">Chất Liệu</th>
                  <th className="border px-4 py-2">Trọng Lượng</th>
                  <th className="border px-4 py-2">Pin</th>
                  <th className="border px-4 py-2">Thời Hạn Bảo Hành</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{productDetails.tenSanPham}</td>
                  <td className="border px-4 py-2">{productDetails.chatLieu?.tenChatLieu}</td>
                  <td className="border px-4 py-2">{productDetails.trongLuong}</td>
                  <td className="border px-4 py-2">{productDetails.pin}</td>
                  <td className="border px-4 py-2">{productDetails.thoiHanBaoHanh}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Product Variants Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm chi tiết</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Mã SPCT</th>
                <th className="border px-4 py-2">Hình ảnh</th>
                <th className="border px-4 py-2">CPU</th>
                <th className="border px-4 py-2">RAM</th>
                <th className="border px-4 py-2">Ổ cứng</th>
                <th className="border px-4 py-2">GPU</th>
                <th className="border px-4 py-2">Màn hình</th>
                <th className="border px-4 py-2">Đơn giá</th>
                <th className="border px-4 py-2">Số lượng</th>
                <th className="border px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((variant, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{variant.maSpct}</td>
                  <td className="border px-4 py-2">
                    <img src={variant.hinhAnhMinhHoa} alt={variant.maSpct} className="w-20 h-20 object-cover"/>
                  </td>
                  <td className="border px-4 py-2">{variant.cpu?.ten}</td>
                  <td className="border px-4 py-2">{variant.ram?.dungLuong}GB {variant.ram?.tocDo}MHz</td>
                  <td className="border px-4 py-2">{variant.oluuTru?.dungLuong}GB {variant.oluuTru?.loaiOCung}</td>
                  <td className="border px-4 py-2">{variant.gpu?.ten}</td>
                  <td className="border px-4 py-2">{variant.manHinh?.doPhanGiai} {variant.manHinh?.tanSoQuet}Hz</td>
                  <td className="border px-4 py-2">{variant.donGia?.toLocaleString()} VNĐ</td>
                  <td className="border px-4 py-2">{variant.soLuong}</td>
                  <td className="border px-4 py-2">
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                      <FaEdit />
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Variant Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Thêm sản phẩm chi tiết</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2">Mã SPCT</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData.sanPhamChiTiet.maSpct}
                      onChange={(e) => setFormData({
                        ...formData,
                        sanPhamChiTiet: {
                          ...formData.sanPhamChiTiet,
                          maSpct: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Hình ảnh minh họa</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData.sanPhamChiTiet.hinhAnhMinhHoa}
                      onChange={(e) => setFormData({
                        ...formData,
                        sanPhamChiTiet: {
                          ...formData.sanPhamChiTiet,
                          hinhAnhMinhHoa: e.target.value
                        }
                      })}
                      placeholder="URL hình ảnh"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Giới thiệu</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={formData.sanPhamChiTiet.gioiThieu}
                      onChange={(e) => setFormData({
                        ...formData,
                        sanPhamChiTiet: {
                          ...formData.sanPhamChiTiet,
                          gioiThieu: e.target.value
                        }
                      })}
                    />
                  </div>

                  {/* Component Selection */}
                  <div>
                    <label className="block mb-2">CPU</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.sanPhamChiTiet.cpu.id}
                        onChange={(e) => setFormData({
                          ...formData,
                          sanPhamChiTiet: {
                            ...formData.sanPhamChiTiet,
                            cpu: { id: e.target.value }
                          }
                        })}
                      >
                        <option value="">Chọn CPU</option>
                        {cpus.map(cpu => (
                          <option key={cpu.id} value={cpu.id}>{cpu.ten}</option>
                        ))}
                      </select>
                      <button type="button" className="px-3 py-1 bg-green-500 text-white rounded">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">RAM</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.sanPhamChiTiet.ram.id}
                        onChange={(e) => setFormData({
                          ...formData,
                          sanPhamChiTiet: {
                            ...formData.sanPhamChiTiet,
                            ram: { id: e.target.value }
                          }
                        })}
                      >
                        <option value="">Chọn RAM</option>
                        {rams.map(ram => (
                          <option key={ram.id} value={ram.id}>{ram.dungLuong}GB {ram.tocDo}MHz</option>
                        ))}
                      </select>
                      <button type="button" className="px-3 py-1 bg-green-500 text-white rounded">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Ổ cứng</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.sanPhamChiTiet.oLuuTru.id}
                        onChange={(e) => setFormData({
                          ...formData,
                          sanPhamChiTiet: {
                            ...formData.sanPhamChiTiet,
                            oLuuTru: { id: e.target.value }
                          }
                        })}
                      >
                        <option value="">Chọn ổ cứng</option>
                        {storages.map(storage => (
                          <option key={storage.id} value={storage.id}>
                            {storage.dungLuong}GB {storage.loaiOCung}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="px-3 py-1 bg-green-500 text-white rounded">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">GPU</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.sanPhamChiTiet.gpu.id}
                        onChange={(e) => setFormData({
                          ...formData,
                          sanPhamChiTiet: {
                            ...formData.sanPhamChiTiet,
                            gpu: { id: e.target.value }
                          }
                        })}
                      >
                        <option value="">Chọn GPU</option>
                        {gpus.map(gpu => (
                          <option key={gpu.id} value={gpu.id}>{gpu.ten}</option>
                        ))}
                      </select>
                      <button type="button" className="px-3 py-1 bg-green-500 text-white rounded">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Màn hình</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.sanPhamChiTiet.manHinh.id}
                        onChange={(e) => setFormData({
                          ...formData,
                          sanPhamChiTiet: {
                            ...formData.sanPhamChiTiet,
                            manHinh: { id: e.target.value }
                          }
                        })}
                      >
                        <option value="">Chọn màn hình</option>
                        {displays.map(display => (
                          <option key={display.id} value={display.id}>
                            {display.doPhanGiai} {display.tanSoQuet}Hz
                          </option>
                        ))}
                      </select>
                      <button type="button" className="px-3 py-1 bg-green-500 text-white rounded">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Màu sắc</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.sanPhamChiTiet.mauSac.id}
                        onChange={(e) => setFormData({
                          ...formData,
                          sanPhamChiTiet: {
                            ...formData.sanPhamChiTiet,
                            mauSac: { id: e.target.value }
                          }
                        })}
                      >
                        <option value="">Chọn màu sắc</option>
                        {colors.map(color => (
                          <option key={color.id} value={color.id}>{color.ten}</option>
                        ))}
                      </select>
                      <button type="button" className="px-3 py-1 bg-green-500 text-white rounded">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div>
                    <label className="block mb-2">Đơn giá</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={formData.sanPhamChiTiet.donGia}
                      onChange={(e) => setFormData({
                        ...formData,
                        sanPhamChiTiet: {
                          ...formData.sanPhamChiTiet,
                          donGia: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Số lượng</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={formData.sanPhamChiTiet.soLuong}
                      onChange={(e) => setFormData({
                        ...formData,
                        sanPhamChiTiet: {
                          ...formData.sanPhamChiTiet,
                          soLuong: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChiTietSanPhamAdmin;
