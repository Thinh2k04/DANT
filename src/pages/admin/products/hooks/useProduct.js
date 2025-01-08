import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImageUtil from '../../../../utils/imageUpload';

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    tenSanPham: '',
    namSanXuat: '',
    trongLuong: '',
    thoiHanBaoHanh: '',
    pin: '',
    trangThai: 1,
    loaiSanPham: { id: '' },
    nguonNhap: { id: '' },
    chatLieu: { id: '' },
    kichThuocLaptop: { id: '' },
    thuongHieu: { id: '' }
  });
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailProductImages, setDetailProductImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spctData, setSpctData] = useState({
    id: '',
    hinhAnhMinhHoa: '',
    soLuong: '',
    trangThai: 1,
    donGia: '',
    maSpct: '',
    ram: { id: '' },
    oLuuTru: { id: '' },
    manHinh: { id: '' },
    cpu: { id: '' },
    gpu: { id: '' },
    mauSac: { id: '' },
    gioiThieu: '',
    cardDoHoa: { id: '' }
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [loaiSanPhams, setLoaiSanPhams] = useState([]);
  const [nguonNhaps, setNguonNhaps] = useState([]);
  const [chatLieus, setChatLieus] = useState([]);
  const [ktlts, setKtlts] = useState([]);
  const [rams, setRams] = useState([]);
  const [oLuuTrus, setOLuuTrus] = useState([]);
  const [manHinhs, setManHinhs] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);
  const [cardDoHoas, setCardDoHoas] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imeiList, setImeiList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Định nghĩa fetchProducts ở ngoài useEffect
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rest/san_pham/getAll');
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Lỗi khi tải danh sách sản phẩm');
    }
  };

  // Fetch products khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch dữ liệu cho các combobox
  useEffect(() => {
    const fetchComboboxData = async () => {
      try {
        const [
          loaiSPResponse,
          nguonNhapResponse,
          chatLieuResponse,
          ktltResponse,
          ramResponse,
          oLuuTruResponse,
          manHinhResponse,
          cpuResponse,
          gpuResponse,
          mauSacResponse,
          cardDoHoaResponse,
          thuongHieuResponse
        ] = await Promise.all([
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
          axios.get('http://localhost:8080/rest/card_do_hoa/getAll'),
          axios.get('http://localhost:8080/rest/thuong-hieu/getAll')
        ]);

        setLoaiSanPhams(loaiSPResponse.data);
        setNguonNhaps(nguonNhapResponse.data);
        setChatLieus(chatLieuResponse.data);
        setKtlts(ktltResponse.data);
        setRams(ramResponse.data);
        setOLuuTrus(oLuuTruResponse.data);
        setManHinhs(manHinhResponse.data);
        setCpus(cpuResponse.data);
        setGpus(gpuResponse.data);
        setMauSacs(mauSacResponse.data);
        setCardDoHoas(cardDoHoaResponse.data);
        setThuongHieus(thuongHieuResponse.data);
      } catch (error) {
        console.error('Error fetching combobox data:', error);
        toast.error('Lỗi khi tải dữ liệu cho các tùy chọn');
      }
    };

    fetchComboboxData();
  }, []);

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.trangThai === 1 ? 0 : 1;
      const updatedProduct = {
        ...product,
        trangThai: newStatus,
        loaiSanPham: {
          id: product.loaiSanPham.id
        },
        nguonNhap: {
          id: product.nguonNhap.id
        },
        chatLieu: {
          id: product.chatLieu.id
        },
        kichThuocLaptop: {
          id: product.kichThuocLaptop.id
        },
        thuongHieu: {
          id: product.thuongHieu.id
        }
      };

      const response = await axios.put(
        `http://localhost:8080/rest/san_pham/update/${product.id}`,
        updatedProduct
      );

      if (response.status === 200) {
        // Cập nhật lại danh sách sản phẩm
        setProducts(products.map(p => 
          p.id === product.id ? {...p, trangThai: newStatus} : p
        ));

        toast.success(
          newStatus === 1 
            ? 'Khôi phục sản phẩm thành công!' 
            : 'Ẩn sản phẩm thành công!',
          {
            position: "top-right",
            autoClose: 2000
          }
        );
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái sản phẩm');
    }
  };

  const handleViewDetail = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/san_pham/getById/${productId}`);
      if (response.data) {
        setSelectedProduct(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Không thể tải thông tin chi tiết sản phẩm');
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const openProductForm = (product = null) => {
    if (product) {
      setFormData({
        ...product,
        loaiSanPham: product.loaiSanPham || { id: '' }
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: '',
        tenSanPham: '',
        namSanXuat: '',
        trongLuong: '',
        thoiHanBaoHanh: '',
        pin: '',
        trangThai: 1,
        loaiSanPham: { id: '' },
        nguonNhap: { id: '' },
        chatLieu: { id: '' },
        kichThuocLaptop: { id: '' },
        thuongHieu: { id: '' }
      });
      setSpctData({
        id: '',
        hinhAnhMinhHoa: '',
        soLuong: '',
        trangThai: 1,
        donGia: '',
        maSpct: '',
        ram: { id: '' },
        oLuuTru: { id: '' },
        manHinh: { id: '' },
        cpu: { id: '' },
        gpu: { id: '' },
        mauSac: { id: '' },
        gioiThieu: '',
        cardDoHoa: { id: '' }
      });
      setIsEditing(false);
      setImageUrls([]);
    }
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    resetForms();
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetForms();
  };

  const handleSubmit = async (requestData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/rest/san_pham/addOrUpdate',
        requestData
      );

      if (response.status === 200) {
        toast.success('Thêm sản phẩm thành công!');
        closeAddModal();
        await fetchProducts();
        resetForms();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setFormData({
      id: '',
      tenSanPham: '',
      namSanXuat: '',
      trongLuong: '',
      thoiHanBaoHanh: '',
      pin: '',
      trangThai: 1,
      loaiSanPham: { id: '' },
      nguonNhap: { id: '' },
      chatLieu: { id: '' },
      kichThuocLaptop: { id: '' },
      thuongHieu: { id: '' }
    });

    setSpctData({
      id: '',
      hinhAnhMinhHoa: '',
      soLuong: '',
      trangThai: 1,
      donGia: '',
      maSpct: '',
      ram: { id: '' },
      oLuuTru: { id: '' },
      manHinh: { id: '' },
      cpu: { id: '' },
      gpu: { id: '' },
      mauSac: { id: '' },
      gioiThieu: '',
      cardDoHoa: { id: '' }
    });

    setImageUrls([]);
  };

  const openEditModal = async (product) => {
    try {
      // Fetch chi tiết sản phẩm
      const response = await axios.get(`http://localhost:8080/rest/spctDTO/getById/${product.id}`);
      if (response.data) {
        const spct = response.data;
        
        // Log dữ liệu để debug
        console.log('Original product data:', product);
        console.log('Original spct data:', spct);

        // Set form data cho sản phẩm c� bản
        setFormData({
          id: product.id,
          tenSanPham: product.tenSanPham,
          namSanXuat: product.namSanXuat,
          trongLuong: product.trongLuong,
          thoiHanBaoHanh: product.thoiHanBaoHanh,
          pin: product.pin,
          trangThai: product.trangThai,
          loaiSanPham: product.loaiSanPham,
          nguonNhap: product.nguonNhap,
          chatLieu: product.chatLieu,
          kichThuocLaptop: product.kichThuocLaptop,
          thuongHieu: product.thuongHieu
        });

        // Set data cho sản phẩm chi tiết
        setSpctData({
          id: spct.id,
          maSpct: spct.maSpct,
          soLuong: spct.soLuong,
          donGia: spct.donGia,
          trangThai: spct.trangThai,
          gioiThieu: spct.gioiThieu,
          hinhAnhMinhHoa: spct.hinhAnhMinhHoa,
          ram: spct.ram,
          oLuuTru: spct.oLuuTru,
          manHinh: spct.manHinh,
          cpu: spct.cpu,
          gpu: spct.gpu,
          mauSac: spct.mauSac,
          cardDoHoa: spct.cardDoHoa
        });

        // Set ảnh sản phẩm
        setImageUrls(spct.imageUrls || []);

        // Mở modal
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading product for edit:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    resetForms();
  };

  const handleEdit = async (requestData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/rest/san_pham/Update`,
        {
          sanPham: {
            id: requestData.sanPham.id,
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
            trangThai: requestData.sanPham.trangThai
          },
          sanPhamChiTiet: {
            id: requestData.sanPhamChiTiet.id,
            hinhAnhMinhHoa: requestData.sanPhamChiTiet.hinhAnhMinhHoa,
            soLuong: parseInt(requestData.sanPhamChiTiet.soLuong),
            trangThai: requestData.sanPhamChiTiet.trangThai,
            donGia: parseFloat(requestData.sanPhamChiTiet.donGia),
            maSpct: requestData.sanPhamChiTiet.maSpct,
            sanPham: {
              id: requestData.sanPham.id
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
              id: parseInt(requestData.sanPhamChiTiet.cardDoHoa.id),
              tenCard: "Card đồ họa NVIDIA GTX 1650",
              trangThai: 1
            }
          },
          imageUrls: requestData.imageUrls,
          listImei: null
        }
      );

      if (response.status === 200) {
        toast.success('Cập nhật sản phẩm thành công!');
        setIsEditModalOpen(false);
        await fetchProducts(); // Refresh danh sách
        resetForms(); // Reset form
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    isModalOpen,
    isDetailModalOpen,
    showDeleted,
    formData,
    detailProduct,
    detailProductImages,
    setIsModalOpen,
    setIsDetailModalOpen,
    setFormData,
    setShowDeleted,
    openProductForm,
    handleToggleStatus,
    handleViewDetail,
    isEditing,
    loading,
    spctData,
    setSpctData,
    imageUrls,
    setImageUrls,
    handleSubmit,
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
    thuongHieus,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEdit,
    openEditModal,
    showDetailModal,
    setShowDetailModal,
    selectedProduct,
    imeiList,
    setImeiList,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    handleSubmit,
    closeDetailModal,
    closeEditModal
  };
}; 