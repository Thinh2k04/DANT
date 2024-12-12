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
    loaiSanPham: { id: '' }
  });
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailProductImages, setDetailProductImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spctData, setSpctData] = useState({
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
          cardDoHoaResponse
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
          axios.get('http://localhost:8080/rest/card_do_hoa/getAll')
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
        trangThai: newStatus
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
        setShowDetailModal(true);
        console.log("Product details:", response.data); // Debug log
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Không thể tải thông tin chi tiết sản phẩm');
    }
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
        loaiSanPham: { id: '' }
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
      setIsEditing(false);
      setImageUrls([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.tenSanPham) {
      toast.error('Tên sản phẩm là bắt buộc');
      return;
    }
    if (!formData.loaiSanPham.id) {
      toast.error('Vui lòng chọn loại sản phẩm');
      return;
    }
    if (!spctData.maSpct || !spctData.soLuong || !spctData.donGia) {
      toast.error('Vui lòng nhập đầy đủ thông tin chi tiết sản phẩm');
      return;
    }

    setLoading(true);

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

      // Đóng modal và reset form trước khi gọi API refresh
      setIsModalOpen(false);
      
      // Reset form và các state khác
      setFormData({
        id: '',
        tenSanPham: '',
        namSanXuat: '',
        trongLuong: '',
        thoiHanBaoHanh: '',
        pin: '',
        trangThai: 1,
        loaiSanPham: { id: '' }
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
      
      // Refresh danh sách sản phẩm
      await fetchProducts();
      
      // Hiển thị thông báo thành công sau khi mọi thứ đã hoàn tất
      toast.success(isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm s��n phẩm', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.tenSanPham) {
      toast.error('Tên sản phẩm là bắt buộc');
      return;
    }
    // ... các validation khác ...

    setLoading(true);

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
            id: formData.id
          }
        },
        imageUrls: imageUrls.filter(url => url.trim() !== '')
      };

      await axios.put(`http://localhost:8080/rest/spctDTO/update/${spctData.id}`, requestData);
      
      setIsEditModalOpen(false);
      await fetchProducts();
      
      toast.success('Cập nhật sản phẩm thành công!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (product) => {
    setFormData({
      ...product,
      loaiSanPham: product.loaiSanPham || { id: '' }
    });
    // Fetch và set spctData từ API
    setIsEditModalOpen(true);
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
    isEditModalOpen,
    setIsEditModalOpen,
    handleEdit,
    openEditForm,
    showDetailModal,
    setShowDetailModal,
    selectedProduct
  };
}; 