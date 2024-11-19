// Import các thư viện cần thiết
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import axios from 'axios';

// Component quản lý sản phẩm
const ProductManagement = () => {
  // Khai báo state để lưu trữ danh sách sản phẩm
  const [products, setProducts] = useState([]);
  // State quản lý trạng thái hiển thị modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State quản lý trạng thái hiển thị modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // State lưu trữ các hình ảnh được chọn để upload
  const [selectedImages, setSelectedImages] = useState([]);
  // State lưu trữ các hình ảnh đã tồn tại
  const [existingImages, setExistingImages] = useState([]);
  // State lưu trữ preview của tất cả hình ảnh
  const [previewImages, setPreviewImages] = useState([]);
  // State xác định đang ở chế độ chỉnh sửa hay thêm mới
  const [isEditing, setIsEditing] = useState(false);
  // State lưu trữ sản phẩm đang được chọn để chỉnh sửa
  const [selectedProduct, setSelectedProduct] = useState(null);
  // State lưu trữ sản phẩm đang xem chi tiết
  const [detailProduct, setDetailProduct] = useState(null);
  // State lưu trữ hình ảnh của sản phẩm đang xem chi tiết
  const [detailProductImages, setDetailProductImages] = useState([]);
  // State quản lý việc hiển thị sản phẩm đã xóa
  const [showDeleted, setShowDeleted] = useState(false);
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    sanPham: {
      id: '',
      tenSanPham: '',
      namSanXuat: '',
      trongLuong: '',
      gioiThieu: '',
      thoiHanBaoHanh: '',
      trangThai: 1,
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
      pin: '',
    },
    imageUrls: []
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

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    // Hàm fetch danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/rest/san_pham/getAll');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Hàm fetch các options cho form
    const fetchOptions = async () => {
      try {
        const [loaiRes, nguonRes, chatLieuRes, ktltRes] = await Promise.all([
          axios.get('http://localhost:8080/rest/loai_san_pham/getAll'),
          axios.get('http://localhost:8080/rest/nguon_nhap/getAll'),
          axios.get('http://localhost:8080/rest/chat_lieu/getAll'),
          axios.get('http://localhost:8080/rest/ktlt/getAll')
        ]);
        setLoaiSanPhams(loaiRes.data);
        setNguonNhaps(nguonRes.data);
        setChatLieus(chatLieuRes.data);
        setKtlts(ktltRes.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchProducts();
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

  // Xử lý khi người dùng chọn hình ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Thêm hình ảnh mới vào preview
    const newPreviewImages = files.map(file => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file: file
    }));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  // Xóa hình ảnh khỏi preview
  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload hình ảnh lên Cloudinary
  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('api_key', '791946539476834');
      formData.append('upload_preset', 'laptop_preset');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dmtek0eaq/image/upload',
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  // Mở form thêm/sửa sản phẩm
  const openProductForm = async (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        sanPham: {
          ...product,
          loaiSanPham: product.loaiSanPham || { id: '' },
          nguonNhap: product.nguonNhap || { id: '' },
          chatLieu: product.chatLieu || { id: '' },
          kichThuocLaptop: product.kichThuocLaptop || { id: '' }
        },
        imageUrls: product.imageUrls || []
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
        sanPham: {
          tenSanPham: '',
          namSanXuat: '',
          trongLuong: '',
          gioiThieu: '',
          thoiHanBaoHanh: '',
          loaiSanPham: { id: '' },
          nguonNhap: { id: '' },
          chatLieu: { id: '' },
          kichThuocLaptop: { id: '' },
          pin: '',
          trangThai: 1
        },
        imageUrls: []
      });
      setIsEditing(false);
      setExistingImages([]);
      setPreviewImages([]);
    }
    setIsModalOpen(true);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra validation
    if (!formData.sanPham.tenSanPham) {
      setError('Tên sản phẩm là bắt buộc');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrls = [];
      
      // Upload hình ảnh mới nếu có
      if (selectedImages.length > 0) {
        const uploadedUrls = await uploadImages();
        // Thêm các URL mới vào previewImages
        const newPreviewImages = uploadedUrls.map(url => ({
          url: url,
          isNew: true
        }));
        setPreviewImages(prev => [...prev, ...newPreviewImages]);
        imageUrls = [...uploadedUrls];
      }

      // Lấy tất cả URL từ previewImages
      const allImageUrls = previewImages.map(img => img.url);

      const requestData = {
        sanPham: formData.sanPham,
        imageUrls: allImageUrls
      };

      // Gọi API tương ứng (update hoặc create)
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/rest/san_pham/update/${selectedProduct.id}`,
          requestData
        );
      } else {
        await axios.post('http://localhost:8080/rest/san_pham/add', requestData);
      }

      // Refresh danh sách sản phẩm
      const updatedResponse = await fetch('http://localhost:8080/rest/san_pham/getAll');
      const updatedData = await updatedResponse.json();
      setProducts(updatedData);

      // Reset form và đóng modal
      setFormData({
        sanPham: {
          tenSanPham: '',
          namSanXuat: '',
          trongLuong: '',
          gioiThieu: '',
          thoiHanBaoHanh: '',
          loaiSanPham: { id: '' },
          nguonNhap: { id: '' },
          chatLieu: { id: '' },
          kichThuocLaptop: { id: '' },
          pin: '',
          trangThai: 1
        },
        imageUrls: []
      });
      setSelectedImages([]);
      setExistingImages([]);
      setPreviewImages([]);
      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedProduct(null);

    } catch (error) {
      console.error('Error submitting product:', error);
      setError(`${isEditing ? 'Cập nhật' : 'Thêm'} sản phẩm thất bại. Vui lòng thử lại.`);
      if (error.response) {
        console.error('Error details:', error.response.data);
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
        {
          sanPham: updatedProduct,
          imageUrls: existingImages.map(img => img.url)
        }
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
  const filteredProducts = showDeleted 
    ? products.filter(product => product.trangThai === 0)
    : products.filter(product => product.trangThai === 1);

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
            className={`px-4 py-2 ${showDeleted ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}
          >
            {showDeleted ? 'Xem sản phẩm đang bán' : 'Xem thùng rác'}
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
              <tr key={index} onClick={() => handleViewDetail(product.id)} className="cursor-pointer hover:bg-gray-50">
                <td className="border px-4 py-2">{product.tenSanPham}</td>
                <td className="border px-4 py-2">{product.namSanXuat}</td>
                <td className="border px-4 py-2">{product.trongLuong}</td>
                <td className="border px-4 py-2">{product.loaiSanPham?.tenLoai}</td>
                <td className="border px-4 py-2">
                  {product.trangThai === 1 ? 'Đang bán' : 'Đã ẩn'}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductForm(product);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(product);
                    }}
                    className={`px-3 py-1 ${product.trangThai === 1 ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
                  >
                    {product.trangThai === 1 ? 'Ẩn' : 'Khôi phục'}
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
                <p><span className="font-bold">Giới thiệu:</span> {detailProduct.gioiThieu}</p>
                <p><span className="font-bold">Thời hạn bảo hành:</span> {detailProduct.thoiHanBaoHanh} tháng</p>
                <p><span className="font-bold">Pin:</span> {detailProduct.pin} Wh</p>
                <p><span className="font-bold">Loại sản phẩm:</span> {detailProduct.loaiSanPham?.tenLoai}</p>
                <p><span className="font-bold">Nguồn nhập:</span> {detailProduct.nguonNhap?.tenNhaCungUng}</p>
                <p><span className="font-bold">Chất liệu:</span> {detailProduct.chatLieu?.tenChatLieu}</p>
                <p><span className="font-bold">Kích thước:</span> {detailProduct.kichThuocLaptop?.kichThuoc} inch</p>
                
                {/* Hiển thị hình ảnh sản phẩm */}
                {detailProductImages.length > 0 && (
                  <div>
                    <p className="font-bold mb-2">Hình ảnh sản phẩm:</p>
                    <div className="grid grid-cols-3 gap-4">
                      {detailProductImages.map((image, index) => (
                        <img
                          key={index}
                          src={image.duongDanHinhAnh}
                          alt={`Sản phẩm ${index + 1}`}
                          className="w-full h-40 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
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
                  value={formData.sanPham.tenSanPham} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, tenSanPham: e.target.value }
                  })} 
                  className="border p-2 w-full mb-4"
                  placeholder="Tên sản phẩm"
                />
                <input 
                  type="number" 
                  value={formData.sanPham.namSanXuat} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, namSanXuat: parseInt(e.target.value) }
                  })} 
                  className="border p-2 w-full mb-4"
                  placeholder="Năm sản xuất"
                />
                <input 
                  type="number" 
                  value={formData.sanPham.trongLuong} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, trongLuong: parseFloat(e.target.value) }
                  })} 
                  className="border p-2 w-full mb-4"
                  placeholder="Trọng lượng (kg)"
                />
                <textarea
                  value={formData.sanPham.gioiThieu}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, gioiThieu: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Giới thiệu"
                  rows="3"
                />
                <input 
                  type="text"
                  value={formData.sanPham.thoiHanBaoHanh}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, thoiHanBaoHanh: e.target.value }
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Thời hạn bảo hành"
                />
                <input 
                  type="number"
                  value={formData.sanPham.pin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, pin: parseInt(e.target.value) }
                  })}
                  className="border p-2 w-full mb-4"
                  placeholder="Dung lượng pin (Wh)"
                />
                <select
                  value={formData.sanPham.loaiSanPham.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, loaiSanPham: { id: e.target.value } }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {loaiSanPhams.map((loai) => (
                    <option key={loai.id} value={loai.id}>{loai.tenLoai}</option>
                  ))}
                </select>
                <select
                  value={formData.sanPham.nguonNhap.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, nguonNhap: { id: e.target.value } }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn nguồn nhập</option>
                  {nguonNhaps.map((nguon) => (
                    <option key={nguon.id} value={nguon.id}>{nguon.tenNhaCungUng}</option>
                  ))}
                </select>
                <select
                  value={formData.sanPham.chatLieu.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, chatLieu: { id: e.target.value } }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn chất liệu</option>
                  {chatLieus.map((chatLieu) => (
                    <option key={chatLieu.id} value={chatLieu.id}>{chatLieu.tenChatLieu}</option>
                  ))}
                </select>
                <select
                  value={formData.sanPham.kichThuocLaptop.id}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sanPham: { ...formData.sanPham, kichThuocLaptop: { id: e.target.value } }
                  })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="">Chọn kích thước laptop</option>
                  {ktlts.map((ktlt) => (
                    <option key={ktlt.id} value={ktlt.id}>{ktlt.kichThuoc} inch</option>
                  ))}
                </select>

                {/* Input file để upload hình ảnh */}
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="border p-2 w-full mb-4"
                  accept="image/*"
                />

                {/* Hiển thị preview hình ảnh */}
                {previewImages.length > 0 && (
                  <div className="mb-4">
                    <p>Tất cả hình ảnh:</p>
                    <div className="flex flex-wrap gap-2">
                      {previewImages.map((image, index) => (
                        <div key={index} className="w-20 h-20 relative">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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