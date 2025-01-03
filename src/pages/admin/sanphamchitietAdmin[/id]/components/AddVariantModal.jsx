import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import uploadImage from '../../../../../utils/imageUpload';

const AddVariantModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit,
  cpus,
  rams,
  storages,
  gpus,
  displays,
  colors,
  idSanPham
}) => {
  const [uploading, setUploading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [imeis, setImeis] = useState([]);
  const [isCheckingMaSpct, setIsCheckingMaSpct] = useState(false);
  const [isCheckingImei, setIsCheckingImei] = useState(false);

  useEffect(() => {
    const quantity = formData.sanPhamChiTiet.soLuong || 0;
    setImeis(Array(Number(quantity)).fill(''));
  }, [formData.sanPhamChiTiet.soLuong]);

  const handleImeiChange = async (index, value) => {
    const newImeis = [...imeis];
    newImeis[index] = value;
    setImeis(newImeis);
    
    // Check trùng IMEI trong form
    const currentImeis = newImeis.filter(imei => imei !== '');
    const uniqueImeis = new Set(currentImeis);
    if (uniqueImeis.size !== currentImeis.length) {
      toast.warning('IMEI này đã được nhập trong form');
    }

    // Check trùng với database
    if (value && value.length > 5) { // Chỉ check khi IMEI đủ dài
      const isValid = await checkImei(value);
      if (!isValid) {
        toast.warning('IMEI này đã tồn tại trong hệ thống');
      }
    }

    setFormData(prev => ({
      ...prev,
      listImei: newImeis
    }));
  };

  const resetForm = () => {
    setFormData({
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
    setImeis([]);
    setAdditionalImages([]);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Validate mã SPCT
    const maSpct = formData.sanPhamChiTiet.maSpct;
    const isMaSpctValid = await checkMaSpct(maSpct);
    if (!isMaSpctValid) {
      toast.error('Mã sản phẩm chi tiết đã tồn tại');
      return;
    }

    // Validate IMEI
    const imeis = formData.listImei;
    for (const imei of imeis) {
      const isImeiValid = await checkImei(imei);
      if (!isImeiValid) {
        toast.error(`IMEI ${imei} đã tồn tại trong hệ thống`);
        return;
      }
    }

    // Kiểm tra IMEI trùng nhau trong form
    const uniqueImeis = new Set(imeis);
    if (uniqueImeis.size !== imeis.length) {
      toast.error('Các IMEI không được trùng nhau');
      return;
    }

    const result = await onSubmit(e);
    if (result?.success) {
      resetForm();
    }
  };

  // Kiểm tra mã SPCT
  const checkMaSpct = async (maSpct) => {
    try {
      setIsCheckingMaSpct(true);
      const response = await axios.get(`http://localhost:8080/rest/spctDTO/check-maSpct/${maSpct}`);
      return !response.data; // true nếu mã không tồn tại (hợp lệ)
    } catch (error) {
      console.error('Error checking maSpct:', error);
      return false;
    } finally {
      setIsCheckingMaSpct(false);
    }
  };

  // Kiểm tra IMEI
  const checkImei = async (imei) => {
    try {
      setIsCheckingImei(true);
      const response = await axios.get(`http://localhost:8080/rest/spctDTO/check-imei/${imei}`);
      return !response.data; // true nếu IMEI không tồn tại (hợp lệ)
    } catch (error) {
      console.error('Error checking IMEI:', error);
      return false;
    } finally {
      setIsCheckingImei(false);
    }
  };

  if (!isOpen) return null;

  // Xử lý upload ảnh chính
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadImage(file);
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          sanPhamChiTiet: {
            ...prev.sanPhamChiTiet,
            hinhAnhMinhHoa: result.url
          }
        }));
        toast.success('Tải ảnh chính lên thành công');
      } else {
        toast.error(result.message || 'Lỗi khi tải ảnh lên');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  // Xử lý upload nhiều ảnh phụ
  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = files.map(file => uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results
        .filter(result => result.success)
        .map(result => result.url);

      if (successfulUploads.length > 0) {
        setAdditionalImages(prev => [...prev, ...successfulUploads]);
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...successfulUploads]
        }));
        toast.success('Tải ảnh phụ lên thành công');
      }
    } catch (error) {
      console.error('Error uploading additional images:', error);
      toast.error('Lỗi khi tải ảnh phụ lên');
    } finally {
      setUploading(false);
    }
  };

  // Xóa ảnh phụ
  const handleRemoveAdditionalImage = (indexToRemove) => {
    setAdditionalImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    if (field === 'maSpct' || field === 'hinhAnhMinhHoa') {
      // Xử lý cho các trường không phải object
      setFormData(prev => ({
        ...prev,
        sanPhamChiTiet: {
          ...prev.sanPhamChiTiet,
          [field]: value
        }
      }));
    } else if (field === 'soLuong') {
      // Xử lý cho trường số lượng
      const quantity = Number(value);
      if (quantity >= 0) {
        setFormData(prev => ({
          ...prev,
          sanPhamChiTiet: {
            ...prev.sanPhamChiTiet,
            [field]: quantity
          }
        }));
      }
    } else if (field === 'donGia') {
      // Xử lý cho trường đơn giá
      setFormData(prev => ({
        ...prev,
        sanPhamChiTiet: {
          ...prev.sanPhamChiTiet,
          [field]: Number(value)
        }
      }));
    } else {
      // Xử lý cho các trường object (cpu, ram, etc.)
      setFormData(prev => ({
        ...prev,
        sanPhamChiTiet: {
          ...prev.sanPhamChiTiet,
          [field]: {
            id: value
          }
        }
      }));
    }
  };

  // Thêm hàm mới để xử lý input text
  const handleInputChange = async (e, field) => {
    const value = e.target.value;
    
    if (field === 'maSpct' && value) {
      const isValid = await checkMaSpct(value);
      if (!isValid) {
        toast.warning('Mã sản phẩm chi tiết này đã tồn tại');
      }
    }

    setFormData(prev => ({
      ...prev,
      sanPhamChiTiet: {
        ...prev.sanPhamChiTiet,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Thêm sản phẩm chi tiết</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* Phần hình ảnh */}
          <div className="grid grid-cols-2 gap-6">
            {/* Hình ảnh đại diện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh đại diện
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className={`cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FaUpload />
                    {uploading ? 'Đang tải lên...' : 'Chọn ảnh đại diện'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {formData.sanPhamChiTiet.hinhAnhMinhHoa && (
                  <div className="relative w-48">
                    <img
                      src={formData.sanPhamChiTiet.hinhAnhMinhHoa}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          sanPhamChiTiet: {
                            ...prev.sanPhamChiTiet,
                            hinhAnhMinhHoa: ''
                          }
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Hình ảnh sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className={`cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FaUpload />
                    {uploading ? 'Đang tải lên...' : 'Thêm hình ảnh sản phẩm'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleAdditionalImagesUpload}
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    {additionalImages.length} hình ảnh đã chọn
                  </span>
                </div>

                {/* Preview hình ảnh sản phẩm */}
                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {additionalImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sản phẩm chi tiết
              </label>
              <input
                type="text"
                value={formData.sanPhamChiTiet.maSpct || ''}
                onChange={(e) => handleInputChange(e, 'maSpct')}
                className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 
                  ${isCheckingMaSpct ? 'bg-gray-100' : ''}`}
                disabled={isCheckingMaSpct}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={formData.sanPhamChiTiet.soLuong || ''}
                onChange={(e) => handleSelectChange(e, 'soLuong')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn giá
              </label>
              <input
                type="number"
                value={formData.sanPhamChiTiet.donGia || ''}
                onChange={(e) => handleSelectChange(e, 'donGia')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPU
              </label>
              <select
                value={formData.sanPhamChiTiet.cpu?.id || ''}
                onChange={(e) => handleSelectChange(e, 'cpu')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn CPU</option>
                {Array.isArray(cpus) && cpus.map(cpu => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.ten}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM
              </label>
              <select
                value={formData.sanPhamChiTiet.ram?.id || ''}
                onChange={(e) => handleSelectChange(e, 'ram')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn RAM</option>
                {Array.isArray(rams) && rams.map(ram => (
                  <option key={ram.id} value={ram.id}>
                    {ram.dungLuong}GB {ram.tocDo}MHz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ổ cứng
              </label>
              <select
                value={formData.sanPhamChiTiet.oLuuTru?.id || ''}
                onChange={(e) => handleSelectChange(e, 'oLuuTru')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn ổ cứng</option>
                {Array.isArray(storages) && storages.map(storage => (
                  <option key={storage.id} value={storage.id}>
                    {storage.dungLuong}GB {storage.loaiOCung}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPU
              </label>
              <select
                value={formData.sanPhamChiTiet.gpu?.id || ''}
                onChange={(e) => handleSelectChange(e, 'gpu')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn GPU</option>
                {Array.isArray(gpus) && gpus.map(gpu => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.ten}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màn hình
              </label>
              <select
                value={formData.sanPhamChiTiet.manHinh?.id || ''}
                onChange={(e) => handleSelectChange(e, 'manHinh')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn màn hình</option>
                {Array.isArray(displays) && displays.map(display => (
                  <option key={display.id} value={display.id}>
                    {display.doPhanGiai} {display.tanSoQuet}Hz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <select
                value={formData.sanPhamChiTiet.mauSac?.id || ''}
                onChange={(e) => handleSelectChange(e, 'mauSac')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn màu sắc</option>
                {Array.isArray(colors) && colors.map(color => (
                  <option key={color.id} value={color.id}>
                    {color.tenMau}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card đồ họa
              </label>
              <select
                value={formData.sanPhamChiTiet.cardDoHoa?.id || ''}
                onChange={(e) => handleSelectChange(e, 'cardDoHoa')}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn card đồ họa</option>
                {Array.isArray(gpus) && gpus.map(gpu => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.ten}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giới thiệu sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới thiệu
            </label>
            <textarea
              value={formData.sanPhamChiTiet.gioiThieu || ''}
              onChange={(e) => handleInputChange(e, 'gioiThieu')}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Nhập giới thiệu về sản phẩm..."
            />
          </div>

          {/* Thêm phần nhập IMEI sau phần số lượng */}
          {formData.sanPhamChiTiet.soLuong > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh sách IMEI
              </label>
              <div className="grid grid-cols-2 gap-4">
                {imeis.map((imei, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={imei}
                      onChange={(e) => handleImeiChange(index, e.target.value)}
                      placeholder={`IMEI sản phẩm ${index + 1}`}
                      className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVariantModal; 