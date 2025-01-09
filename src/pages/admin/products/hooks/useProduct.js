import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  
  // Form data state
  const [formData, setFormData] = useState({
    id: '',
    tenSanPham: '',
    namSanXuat: '',
    trongLuong: '',
    thoiHanBaoHanh: '',
    pin: '',
    trangThai: 1,
    loaiSanPham: null,
    nguonNhap: null,
    chatLieu: null,
    kichThuocLaptop: null,
    thuongHieu: null
  });

  // Product detail state
  const [spctData, setSpctData] = useState({
    id: '',
    hinhAnhMinhHoa: '',
    soLuong: '',
    trangThai: 1,
    donGia: '',
    maSpct: '',
    ram: null,
    oLuuTru: null,
    manHinh: null,
    cpu: null,
    gpu: null,
    mauSac: null,
    gioiThieu: '',
    cardDoHoa: null
  });

  // Options data state
  const [loaiSanPhams, setLoaiSanPhams] = useState([]);
  const [nguonNhaps, setNguonNhaps] = useState([]);
  const [chatLieus, setChatLieus] = useState([]);
  const [ktlts, setKtlts] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [rams, setRams] = useState([]);
  const [oLuuTrus, setOLuuTrus] = useState([]);
  const [manHinhs, setManHinhs] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);
  const [cardDoHoas, setCardDoHoas] = useState([]);

  // Fetch products based on showDeleted state
  const fetchProducts = async () => {
    try {
      const url = showDeleted 
        ? 'http://localhost:8080/rest/san_pham/ThungRac'
        : 'http://localhost:8080/rest/san_pham/getAll';
      
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(showDeleted 
        ? 'Lỗi khi tải danh sách sản phẩm đã xóa'
        : 'Lỗi khi tải danh sách sản phẩm'
      );
    }
  };

  // Fetch all options data
  const fetchOptionsData = async () => {
    try {
      const [
        loaiSPResponse,
        nguonNhapResponse,
        chatLieuResponse,
        ktltResponse,
        thuongHieuResponse,
        ramResponse,
        oLuuTruResponse,
        manHinhResponse,
        cpuResponse,
        gpuResponse,
        mauSacResponse,
        cardDoHoaResponse
      ] = await Promise.all([
        axios.get('http://localhost:8080/rest/loai_san_pham/getAll'),
        axios.get('http://localhost:8080/rest/nguon_nhap/getAll'),
        axios.get('http://localhost:8080/rest/chat_lieu/getAll'),
        axios.get('http://localhost:8080/rest/ktlt/getAll'),
        axios.get('http://localhost:8080/rest/thuong-hieu/getAll'),
        axios.get('http://localhost:8080/rest/ram/getAll'),
        axios.get('http://localhost:8080/rest/o_luu_tru/getAll'),
        axios.get('http://localhost:8080/rest/man_hinh/getAll'),
        axios.get('http://localhost:8080/rest/cpu/getAll'),
        axios.get('http://localhost:8080/rest/gpu/getAll'),
        axios.get('http://localhost:8080/rest/mau_sac/getAll'),
        axios.get('http://localhost:8080/rest/card_do_hoa/getAll')
      ]);

      setLoaiSanPhams(loaiSPResponse.data);
      setNguonNhaps(nguonNhapResponse.data);
      setChatLieus(chatLieuResponse.data);
      setKtlts(ktltResponse.data);
      setThuongHieus(thuongHieuResponse.data);
      setRams(ramResponse.data);
      setOLuuTrus(oLuuTruResponse.data);
      setManHinhs(manHinhResponse.data);
      setCpus(cpuResponse.data);
      setGpus(gpuResponse.data);
      setMauSacs(mauSacResponse.data);
      setCardDoHoas(cardDoHoaResponse.data);
    } catch (error) {
      console.error('Error fetching options data:', error);
      toast.error('Lỗi khi tải dữ liệu tùy chọn');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchOptionsData();
  }, [showDeleted]);

  // Handle product status toggle
  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.trangThai === 1 ? 0 : 1;
      const updatedProduct = {
        ...product,
        trangThai: newStatus
      };

      await axios.put(
        `http://localhost:8080/rest/san_pham/update/${product.id}`,
        updatedProduct
      );

      await fetchProducts();
      
      toast.success(
        newStatus === 1 
          ? 'Khôi phục sản phẩm thành công!' 
          : 'Đã chuyển sản phẩm vào thùng rác!'
      );
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Lỗi khi thay đổi trạng thái sản phẩm');
    }
  };

  // Handle product detail view
  const handleViewDetail = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/san_pham/getById/${productId}`);
      setSelectedProduct(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Lỗi khi tải thông tin chi tiết sản phẩm');
    }
  };

  // Handle edit modal
  const openEditModal = async (product) => {
    setFormData({
      ...product,
      namSanXuat: product.namSanXuat || '',
      trongLuong: product.trongLuong || '',
      thoiHanBaoHanh: product.thoiHanBaoHanh || '',
      pin: product.pin || '',
      loaiSanPham: product.loaiSanPham || null,
      nguonNhap: product.nguonNhap || null,
      chatLieu: product.chatLieu || null,
      kichThuocLaptop: product.kichThuocLaptop || null,
      thuongHieu: product.thuongHieu || null
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({
      id: '',
      tenSanPham: '',
      namSanXuat: '',
      trongLuong: '',
      thoiHanBaoHanh: '',
      pin: '',
      trangThai: 1,
      loaiSanPham: null,
      nguonNhap: null,
      chatLieu: null,
      kichThuocLaptop: null,
      thuongHieu: null
    });
  };

  // Handle product edit submission
  const handleEdit = async (requestData) => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `http://localhost:8080/rest/san_pham/update/${requestData.sanPham.id}`,
        requestData.sanPham
      );

      if (response.status === 200) {
        await fetchProducts();
        closeEditModal();
        toast.success('Cập nhật sản phẩm thành công!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Lỗi khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Handle add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      id: '',
      tenSanPham: '',
      namSanXuat: '',
      trongLuong: '',
      thoiHanBaoHanh: '',
      pin: '',
      trangThai: 1,
      loaiSanPham: null,
      nguonNhap: null,
      chatLieu: null,
      kichThuocLaptop: null,
      thuongHieu: null
    });
    setSpctData({
      id: '',
      hinhAnhMinhHoa: '',
      soLuong: '',
      trangThai: 1,
      donGia: '',
      maSpct: '',
      ram: null,
      oLuuTru: null,
      manHinh: null,
      cpu: null,
      gpu: null,
      mauSac: null,
      gioiThieu: '',
      cardDoHoa: null
    });
    setImageUrls([]);
  };

  // Handle product submission
  const handleSubmit = async (requestData) => {
    try {
      setLoading(true);
      
      // Prepare the request data in the correct format
      const formattedData = {
        sanPham: {
          id: "",  // Empty for new product
          loaiSanPham: {
            id: parseInt(requestData.sanPham.loaiSanPham.id)
          },
          nguonNhap: {
            id: parseInt(requestData.sanPham.nguonNhap.id)
          },
          chatLieu: {
            id: parseInt(requestData.sanPham.chatLieu.id)
          },
          kichThuocLaptop: {
            id: parseInt(requestData.sanPham.kichThuocLaptop.id)
          },
          thuongHieu: {
            id: parseInt(requestData.sanPham.thuongHieu.id)
          },
          tenSanPham: requestData.sanPham.tenSanPham,
          namSanXuat: parseInt(requestData.sanPham.namSanXuat),
          trongLuong: parseFloat(requestData.sanPham.trongLuong),
          thoiHanBaoHanh: requestData.sanPham.thoiHanBaoHanh.toString(),
          pin: parseInt(requestData.sanPham.pin),
          trangThai: 1
        },
        sanPhamChiTiet: {
          id: "",  // Empty for new product
          hinhAnhMinhHoa: requestData.sanPhamChiTiet.hinhAnhMinhHoa,
          soLuong: parseInt(requestData.sanPhamChiTiet.soLuong),
          trangThai: 1,
          donGia: parseFloat(requestData.sanPhamChiTiet.donGia),
          maSpct: requestData.sanPhamChiTiet.maSpct,
          sanPham: {
            id: ""  // This will be set by the backend
          },
          ram: {
            id: parseInt(requestData.sanPhamChiTiet.ram.id)
          },
          oLuuTru: {
            id: parseInt(requestData.sanPhamChiTiet.oLuuTru.id)
          },
          manHinh: {
            id: parseInt(requestData.sanPhamChiTiet.manHinh.id)
          },
          cpu: {
            id: parseInt(requestData.sanPhamChiTiet.cpu.id)
          },
          gpu: {
            id: parseInt(requestData.sanPhamChiTiet.gpu.id)
          },
          mauSac: {
            id: parseInt(requestData.sanPhamChiTiet.mauSac.id)
          },
          gioiThieu: requestData.sanPhamChiTiet.gioiThieu,
          cardDoHoa: {
            id: parseInt(requestData.sanPhamChiTiet.cardDoHoa.id)
          }
        },
        imageUrls: requestData.imageUrls,
        listImei: []
      };

      const response = await axios.post(
        'http://localhost:8080/rest/san_pham/addOrUpdate',
        formattedData
      );

      if (response.status === 200) {
        await fetchProducts();
        closeAddModal();
        toast.success('Thêm sản phẩm thành công!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Lỗi khi thêm sản phẩm: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    showDeleted,
    formData,
    setFormData,
    spctData,
    setSpctData,
    selectedProduct,
    loading,
    imageUrls,
    setImageUrls,
    handleToggleStatus,
    handleViewDetail,
    openAddModal,
    closeAddModal,
    handleSubmit,
    openEditModal,
    closeEditModal,
    handleEdit,
    setShowDeleted,
    closeDetailModal: () => setIsDetailModalOpen(false),
    // Options data
    loaiSanPhams,
    nguonNhaps,
    chatLieus,
    ktlts,
    rams,
    oLuuTrus,
    manHinhs,
    cpus,
    gpus,
    mauSacs,
    cardDoHoas,
    thuongHieus
  };
}; 