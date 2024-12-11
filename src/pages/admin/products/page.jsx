// Import các thư viện cần thiết
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import uploadImageUtil from '../../../utils/imageUpload';
import { toast } from 'react-toastify';

// Component quản lý sản phẩm
const ProductManagement = () => {
  const navigate = useNavigate();
  // Khai báo state để lưu trữ danh sách sản phẩm
  const [products, setProducts] = useState([]);
  // State quản lý trạng thái hiển thị modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State quản lý trạng thái hiển thị modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // State xác định đang ở chế độ chỉnh sửa hay thêm mới
  const [isEditing, setIsEditing] = useState(false);
  // State lưu trữ sản phẩm đang được chọn để chỉnh sửa
  const [selectedProduct, setSelectedProduct] = useState(null);
  // State lưu trữ sản phẩm đang xem chi tiết
  const [detailProduct, setDetailProduct] = useState(null);
  // State quản lý việc hiển thị sản phẩm đã xóa
  const [showDeleted, setShowDeleted] = useState(false);
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    id: '',
    loaiSanPham: {
      id: ''
    },
    nguonNhap: {
      id: ''
    },
    chatLieu: {
      id: ''
    },
    kichThuocLaptop: {
      id: ''
    },
    tenSanPham: '',
    namSanXuat: '',
    trongLuong: '',
    thoiHanBaoHanh: '',
    pin: '',
    trangThai: 1
  });

  // State lưu trữ dữ liệu sản phẩm chi tiết
  const [spctData, setSpctData] = useState({
    id: '',
    hinhAnhMinhHoa: '',
    soLuong: 0,
    trangThai: '1',
    donGia: 0,
    maSpct: '',
    sanPham: {
      id: ''
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
    gioiThieu: '',
    cardDoHoa: {
      id: ''
    }
  });

  // State quản lý trạng thái loading
  const [loading, setLoading] = useState(false);
  // State quản lý thông báo lỗi
  const [error, setError] = useState(null);
  // State lưu trữ danh sách các loại sản phẩm
  const [loaiSanPhams, setLoaiSanPhams] = useState([]);
  // State lưu trữ danh sách nguồn nhập
  const [nguonNhaps, setNguonNhaps] = useState([]);
  // State lưu trữ danh sách chất liệu
  const [chatLieus, setChatLieus] = useState([]);
  // State lưu trữ danh sách kích thước laptop
  const [ktlts, setKtlts] = useState([]);
  // State lưu trữ danh sách RAM
  const [rams, setRams] = useState([]);
  // State lưu trữ danh sách ổ lưu trữ
  const [oLuuTrus, setOLuuTrus] = useState([]);
  // State lưu trữ danh sách màn hình
  const [manHinhs, setManHinhs] = useState([]);
  // State lưu trữ danh sách CPU
  const [cpus, setCpus] = useState([]);
  // State lưu trữ danh sách GPU
  const [gpus, setGpus] = useState([]);
  // State lưu trữ danh sách màu sắc
  const [mauSacs, setMauSacs] = useState([]);
  // State lưu trữ danh sách card đồ họa
  const [cardDoHoas, setCardDoHoas] = useState([]);
  // Thêm các state mới
  const [detailProductImages, setDetailProductImages] = useState([]); 
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  // State lưu trữ danh sách năm từ 2010 đến năm hiện tại
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 2010 + 1}, (_, i) => currentYear - i);

  // Thêm hàm fetchProducts riêng để tái sử dụng
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/rest/san_pham/getAll');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Lỗi khi tải danh sách sản phẩm');
    }
  };

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    // Fetch products khi component mount
    fetchProducts();

    // Fetch các options cho form
    const fetchOptions = async () => {
      try {
        const [loaiRes, nguonRes, chatLieuRes, ktltRes, ramRes, oLuuTruRes, manHinhRes, cpuRes, gpuRes, mauSacRes, cardDoHoaRes] = await Promise.all([
          axios.get('http://localhost:8080/rest/loai_san_pham/getAll'),
          axios.get('http://localhost:8080/rest/nguon_nhap/getAll'),
          axios.get('http://localhost:8080/rest/chat_lieu/getAll'),
          axios.get('http://localhost:8080/rest/ktlt/getAll'),
          axios.get('http://localhost:8080/rest/ram/getAll'),
          axios.get('http://localhost:8080/rest/o_luu_tru/getAll'),
          axios.get('http://localhost:8080/rest/man_hinh/getAll'),
          axios.get('http://localhost:8080/rest/cpu/getAll'),
          axios.get('http://localhost:8080/rest/gpu/getAll'),
          axios.get('http://localhost:8080/rest/mau_sac/getAll'),
          axios.get('http://localhost:8080/rest/card_do_hoa/getAll')
        ]);
        setLoaiSanPhams(loaiRes.data);
        setNguonNhaps(nguonRes.data);
        setChatLieus(chatLieuRes.data);
        setKtlts(ktltRes.data);
        setRams(ramRes.data);
        setOLuuTrus(oLuuTruRes.data);
        setManHinhs(manHinhRes.data);
        setCpus(cpuRes.data);
        setGpus(gpuRes.data);
        setMauSacs(mauSacRes.data);
        setCardDoHoas(cardDoHoaRes.data);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Lỗi khi tải dữ liệu tùy chọn');
      }
    };

    fetchOptions();
  }, []);

  // Xử lý khi click vào sản phẩm để xem chi tiết
  const handleViewDetail = async (productId) => {
    try {
      const [productResponse, imagesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/rest/san_pham/getById/${productId}`),
        axios.get(`http://localhost:8080/rest/hinh_anh/getAllById/${productId}`)
      ]);
      
      setDetailProduct(productResponse.data);
      setDetailProductImages(imagesResponse.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Mở form thêm/sửa sản phẩm
  const openProductForm = async (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        ...product,
        loaiSanPham: product.loaiSanPham || { id: '' },
        nguonNhap: product.nguonNhap || { id: '' },
        chatLieu: product.chatLieu || { id: '' },
        kichThuocLaptop: product.kichThuocLaptop || { id: '' }
      });

      try {
        // Lấy hình ảnh cho sản phẩm cụ thể
        const response = await axios.get(`http://localhost:8080/rest/hinh_anh/getAllById/${product.id}`);
        const productImages = response.data.map(img => ({
          url: img.duongDanHinhAnh,
          isNew: false
        }));
        setExistingImages(productImages);
        setPreviewImages(productImages);
      } catch (error) {
        console.error('Error fetching product images:', error);
      }

      setIsEditing(true);
    } else {
      // Reset form khi thêm mới
      setSelectedProduct(null);
      setFormData({
        id: '',
        loaiSanPham: {
          id: ''
        },
        nguonNhap: {
          id: ''
        },
        chatLieu: {
          id: ''
        },
        kichThuocLaptop: {
          id: ''
        },
        tenSanPham: '',
        namSanXuat: '',
        trongLuong: '',
        thoiHanBaoHanh: '',
        pin: '',
        trangThai: 1
      });
      setSpctData({
        id: '',
        hinhAnhMinhHoa: '',
        soLuong: 0,
        trangThai: '1',
        donGia: 0,
        maSpct: '',
        sanPham: {
          id: ''
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
        gioiThieu: '',
        cardDoHoa: {
          id: ''
        }
      });
      setIsEditing(false);
      setExistingImages([]);
      setPreviewImages([]);
      setImageUrls([]);
    }
    setIsModalOpen(true);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra validation
    if (!formData.tenSanPham) {
      toast.error('Tên sản phẩm là bắt buộc');
      return;
    }
    if (!formData.loaiSanPham.id || !formData.nguonNhap.id || !formData.chatLieu.id || !formData.kichThuocLaptop.id) {
      toast.error('Vui lòng chọn đầy đủ thông tin sản phẩm');
      return;
    }
    if (!spctData.maSpct || !spctData.soLuong || !spctData.donGia) {
      toast.error('Vui lòng nhập đầy đủ thông tin chi tiết sản phẩm');
      return;
    }
    if (!spctData.ram.id || !spctData.oLuuTru.id || !spctData.manHinh.id || !spctData.cpu.id || !spctData.gpu.id || !spctData.mauSac.id || !spctData.cardDoHoa.id) {
      toast.error('Vui lòng chọn đầy đủ thông tin cấu hình');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        sanPham: {
          ...formData,
          trangThai: 1
        },
        sanPhamChiTiet: {
          ...spctData,
          trangThai: '1',
          trangThaiSpct: 1,
          sanPham: {
            id: formData.id || null
          }
        },
        imageUrls: imageUrls.filter(url => url.trim() !== '')
      };

      const response = await axios.post('http://localhost:8080/rest/spctDTO/add', requestData);

      if (response.data) {
        // Reset form
        setFormData({
          id: '',
          loaiSanPham: { id: '' },
          nguonNhap: { id: '' },
          chatLieu: { id: '' },
          kichThuocLaptop: { id: '' },
          tenSanPham: '',
          namSanXuat: '',
          trongLuong: '',
          thoiHanBaoHanh: '',
          pin: '',
          trangThai: 1
        });
        setSpctData({
          id: '',
          hinhAnhMinhHoa: '',
          soLuong: 0,
          trangThai: '1',
          donGia: 0,
          maSpct: '',
          sanPham: { id: '' },
          ram: { id: '' },
          oLuuTru: { id: '' },
          manHinh: { id: '' },
          cpu: { id: '' },
          gpu: { id: '' },
          mauSac: { id: '' },
          trangThaiSpct: 1,
          gioiThieu: '',
          cardDoHoa: { id: '' }
        });
        setImageUrls([]);
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedProduct(null);

        // Hiển thị thông báo thành công
        toast.success(isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Load lại table
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        toast.error(error.response.data.message || 'Có lỗi xảy ra khi thêm sản phẩm');
      } else {
        toast.error(isEditing ? 'Cập nhật sản phẩm thất bại!' : 'Thêm sản phẩm thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi trạng thái sản phẩm (ẩn/hiện)
  const handleToggleStatus = async (product) => {
    try {
      const updatedProduct = {
        ...product,
        trangThai: product.trangThai === 1 ? 0 : 1
      };

      await axios.put(
        `http://localhost:8080/rest/san_pham/update/${product.id}`,
        updatedProduct
      );

      // Refresh danh sách sản phẩm
      const updatedResponse = await fetch('http://localhost:8080/rest/san_pham/getAll');
      const updatedData = await updatedResponse.json();
      setProducts(updatedData);
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  // Lọc sản phẩm theo trạng thái
  const filteredProducts = showDeleted ? products.filter(product => product.trangThai === 0) : products.filter(product => product.trangThai === 1);

  // Thêm hàm xử lý upload ảnh
  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const result = await uploadImageUtil(file);
      if (result && result.url) {
        setSpctData({
          ...spctData,
          hinhAnhMinhHoa: result.url
        });
      } else {
        alert('Lỗi khi tải ảnh lên: Không nhận được URL');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  // Thêm hàm xử lý upload nhiều ảnh
  const uploadImage = async (file) => {
    try {
      const result = await uploadImageUtil(file);
      if (result && result.url) {
        return result.url;
      }
      throw new Error('Không nhận được URL từ việc tải ảnh');
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Render giao diện
  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>
        <div className="mb-4 flex justify-between">
          <button 
            onClick={() => openProductForm()} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Thêm sản phẩm
          </button>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            {showDeleted ? 'Hiển thị sản phẩm đang bán' : 'Hiển thị sản phẩm đã ẩn'}
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Tên Sản Phẩm</th>
              <th className="border px-4 py-2">Năm Sản Xuất</th>
              <th className="border px-4 py-2">Trọng Lượng</th>
              <th className="border px-4 py-2">Loại Sản Phẩm</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index} className="cursor-pointer hover:bg-gray-50">
                <td className="border px-4 py-2" onClick={() => handleViewDetail(product.id)}>{product.tenSanPham}</td>
                <td className="border px-4 py-2" onClick={() => handleViewDetail(product.id)}>{product.namSanXuat}</td>
                <td className="border px-4 py-2" onClick={() => handleViewDetail(product.id)}>{product.trongLuong}</td>
                <td className="border px-4 py-2" onClick={() => handleViewDetail(product.id)}>{product.loaiSanPham?.tenLoai}</td>
                <td className="border px-4 py-2" onClick={() => handleViewDetail(product.id)}>
                  {product.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openProductForm(product)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleStatus(product)}
                    className={`px-3 py-1 ${product.trangThai === 1 ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
                  >
                    {product.trangThai === 1 ? 'Ẩn' : 'Khôi phục'}
                  </button>
                   <button
                    onClick={() => navigate(`/admin/chitietsanpham/${product.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Sản phẩm chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal chi tiết sản phẩm */}
        {isDetailModalOpen && detailProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Chi tiết sản phẩm</h2>
              <div className="space-y-4">
                <p><span className="font-bold">Tên sản phẩm:</span> {detailProduct.tenSanPham}</p>
                <p><span className="font-bold">Năm sản xuất:</span> {detailProduct.namSanXuat}</p>
                <p><span className="font-bold">Trọng lượng:</span> {detailProduct.trongLuong} kg</p>
                <p><span className="font-bold">Thời hạn bảo hành:</span> {detailProduct.thoiHanBaoHanh} tháng</p>
                <p><span className="font-bold">Pin:</span> {detailProduct.pin} Wh</p>
                <p><span className="font-bold">Loại sản phẩm:</span> {detailProduct.loaiSanPham?.tenLoai}</p>
                <p><span className="font-bold">Nguồn nhập:</span> {detailProduct.nguonNhap?.tenNhaCungUng}</p>
                <p><span className="font-bold">Chất liệu:</span> {detailProduct.chatLieu?.tenChatLieu}</p>
                <p><span className="font-bold">Kích thước:</span> {detailProduct.kichThuocLaptop?.kichThuoc} inch</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal thêm/sửa sản phẩm */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">
                {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <input 
                  type="text" 
                  value={formData.tenSanPham} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tenSanPham: e.target.value
                  })} 
                  className="border p-2 w-full mb-4"
                  placeholder="Tên sản phẩm"
                />
                <input
                  type="number"
                  min="2010"
                  max={currentYear}
                  value={formData.namSanXuat}
                  onChange={(e) => setFormData({
                    ...formData,
                    namSanXuat: e.target.value
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Năm sản xuất"
                />
                <input 
                  type="number" 
                  value={formData.trongLuong} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    trongLuong: parseFloat(e.target.value)
                  })} 
                  className="border p-2 w-full mb-4"
                  placeholder="Trọng lượng (kg)"
                />
                <input 
                  type="text"
                  value={formData.thoiHanBaoHanh}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    thoiHanBaoHanh: e.target.value
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Thời hạn bảo hành"
                />
                <input 
                  type="number"
                  value={formData.pin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    pin: parseInt(e.target.value)
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Dung lượng pin (Wh)"
                />
                <select
                  value={formData.loaiSanPham.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    loaiSanPham: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {loaiSanPhams.map((loai) => (
                    <option key={loai.id} value={loai.id}>{loai.tenLoai}</option>
                  ))}
                </select>
                <select
                  value={formData.nguonNhap.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    nguonNhap: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn nguồn nhập</option>
                  {nguonNhaps.map((nguon) => (
                    <option key={nguon.id} value={nguon.id}>{nguon.tenNhaCungUng}</option>
                  ))}
                </select>
                <select
                  value={formData.chatLieu.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    chatLieu: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn chất liệu</option>
                  {chatLieus.map((chatLieu) => (
                    <option key={chatLieu.id} value={chatLieu.id}>{chatLieu.tenChatLieu}</option>
                  ))}
                </select>
                <select
                  value={formData.kichThuocLaptop.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    kichThuocLaptop: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn kích thước laptop</option>
                  {ktlts.map((ktlt) => (
                    <option key={ktlt.id} value={ktlt.id}>{ktlt.kichThuoc} inch</option>
                  ))}
                </select>

                {/* Thêm các trường cho sản phẩm chi tiết */}
                <input
                  type="text"
                  value={spctData.maSpct}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    maSpct: e.target.value
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Mã sản phẩm chi tiết"
                />

                <input
                  type="number"
                  value={spctData.soLuong}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    soLuong: parseInt(e.target.value)
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Số lượng"
                />

                <input
                  type="number"
                  value={spctData.donGia}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    donGia: parseFloat(e.target.value)
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Đơn giá"
                />

                <textarea
                  value={spctData.gioiThieu}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    gioiThieu: e.target.value
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Giới thiệu sản phẩm"
                  rows="4"
                />

                {/* Thêm các select cho các thuộc tính khác */}
                <select
                  value={spctData.ram.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    ram: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn RAM</option>
                  {rams.map((ram) => (
                    <option key={ram.id} value={ram.id}>{ram.dungLuong}</option>
                  ))}
                </select>

                <select
                  value={spctData.oLuuTru.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    oLuuTru: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn ổ lưu trữ</option>
                  {oLuuTrus.map((olt) => (
                    <option key={olt.id} value={olt.id}>{olt.dungLuong}</option>
                  ))}
                </select>

                <select
                  value={spctData.manHinh.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    manHinh: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn màn hình</option>
                  {manHinhs && manHinhs.map((mh) => (
                    <option key={mh.id} value={mh.id}>
                      {`${mh.loaiManHinh || ''} - ${mh.doPhanGiai || ''} - ${mh.tanSoQuet || ''}Hz`}
                    </option>
                  ))}
                </select>
                <select
                  value={spctData.cpu.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    cpu: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn CPU</option>
                  {cpus && cpus.map((cpu) => (
                    <option key={cpu.id} value={cpu.id}>
                      {cpu.ten || 'CPU không xác định'}
                    </option>
                  ))}
                </select>

                <select
                  value={spctData.gpu.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    gpu: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn GPU</option>
                  {gpus && gpus.map((gpu) => (
                    <option key={gpu.id} value={gpu.id}>
                      {gpu.ten || 'GPU không xác định'}
                    </option>
                  ))}
                </select>

                <select
                  value={spctData.mauSac.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    mauSac: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn màu sắc</option>
                  {mauSacs && mauSacs.map((mauSac) => (
                    <option key={mauSac.id} value={mauSac.id}>
                      {mauSac.tenMau|| 'Màu sắc không xác định'}
                    </option>
                  ))}
                </select>

                <select
                  value={spctData.cardDoHoa.id}
                  onChange={(e) => setSpctData({
                    ...spctData,
                    cardDoHoa: { id: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn card đồ họa</option>
                  {cardDoHoas.map((card) => (
                    <option key={card.id} value={card.id}>{card.tenCard}</option>
                  ))}
                </select>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh minh họa
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                    </label>
                    {spctData.hinhAnhMinhHoa && (
                      <div className="relative">
                        <img
                          src={spctData.hinhAnhMinhHoa}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setSpctData({
                            ...spctData,
                            hinhAnhMinhHoa: ''
                          })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thêm phần upload nhiều ảnh */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh sản phẩm
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        try {
                          setUploading(true);
                          const files = Array.from(e.target.files);
                          const uploadPromises = files.map(uploadImage);
                          const urls = await Promise.all(uploadPromises);
                          // Filter out any undefined or null values
                          const validUrls = urls.filter(url => url);
                          setImageUrls(prevUrls => [...prevUrls, ...validUrls]);
                        } catch (error) {
                          console.error('Error uploading images:', error);
                          alert('Lỗi khi tải ảnh lên: ' + error.message);
                        } finally {
                          setUploading(false);
                        }
                      }}
                      className="hidden"
                      id="multiple-image-upload"
                    />
                    <label
                      htmlFor="multiple-image-upload"
                      className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {uploading ? 'Đang tải...' : 'Chọn nhiều ảnh'}
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="h-24 w-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hiển thị thông báo lỗi nếu có */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'
                    } text-white`}
                  >
                    {loading ? 'Đang tải...' : isEditing ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditing(false);
                      setSelectedProduct(null);
                      setExistingImages([]);
                      setPreviewImages([]);
                    }} 
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;