import React, { useState, useEffect } from 'react';
import useProductVariant from '../hooks/useProductVariant';
import { toast } from 'react-toastify';
import { FaTimes, FaUpload } from 'react-icons/fa';
import uploadImage from '../../../../../utils/imageUpload';

const EditProductVariantModal = ({ 
  isOpen, 
  onClose, 
  variant, 
  onSuccess,
  rams = [],
  cpus = [],
  gpus = [],
  storages = [],
  displays = [],
  colors = []
}) => {
  const { updateProductVariant, loading } = useProductVariant();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    sanPham: {
      id: ''
    },
    sanPhamChiTiet: {
      id: '',
      hinhAnhMinhHoa: '',
      soLuong: 0,
      trangThai: 1,
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

  useEffect(() => {
    if (variant && variant.sanPham) {
      setFormData({
        sanPham: {
          id: variant.sanPham.id || ''
        },
        sanPhamChiTiet: {
          id: variant.id || '',
          hinhAnhMinhHoa: variant.hinhAnhMinhHoa || '',
          soLuong: variant.soLuong || 0,
          trangThai: variant.trangThai ?? 1,
          donGia: variant.donGia || 0,
          maSpct: variant.maSpct || '',
          sanPham: {
            id: variant.sanPham.id || ''
          },
          ram: {
            id: variant.ram?.id || ''
          },
          oLuuTru: {
            id: variant.oLuuTru?.id || ''
          },
          manHinh: {
            id: variant.manHinh?.id || ''
          },
          cpu: {
            id: variant.cpu?.id || ''
          },
          gpu: {
            id: variant.gpu?.id || ''
          },
          mauSac: {
            id: variant.mauSac?.id || ''
          },
          cardDoHoa: {
            id: variant.cardDoHoa?.id || '',
            tenCard: variant.cardDoHoa?.tenCard || '',
            trangThai: variant.cardDoHoa?.trangThai ?? 1
          },
          gioiThieu: variant.gioiThieu || ''
        },
        imageUrls: variant.imageUrls || [],
        listImei: variant.listImei || []
      });
    }
  }, [variant]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.sanPham.id || !formData.sanPhamChiTiet.id) {
        toast.error('Thiếu thông tin ID sản phẩm hoặc ID chi tiết');
        return;
      }

      const payload = {
        ...formData,
        sanPham: {
          id: formData.sanPham.id
        },
        sanPhamChiTiet: {
          ...formData.sanPhamChiTiet,
          id: formData.sanPhamChiTiet.id,
          sanPham: {
            id: formData.sanPham.id
          }
        }
      };
      
      await updateProductVariant(payload);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating product variant:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };

  // Thêm xử lý cho ảnh phụ
  const handleAdditionalImages = (urls) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: urls
    }));
  };

  // Xử lý IMEI
  const handleImeiChange = (imeis) => {
    setFormData(prev => ({
      ...prev,
      listImei: imeis
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cập nhật sản phẩm chi tiết</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã SPCT
              </label>
              <input
                type="text"
                value={formData.sanPhamChiTiet.maSpct}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    maSpct: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn giá
              </label>
              <input
                type="number"
                value={formData.sanPhamChiTiet.donGia}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    donGia: Number(e.target.value)
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={formData.sanPhamChiTiet.soLuong}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    soLuong: Number(e.target.value)
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={formData.sanPhamChiTiet.trangThai}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    trangThai: Number(e.target.value)
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value={1}>Đang bán</option>
                <option value={0}>Đã ẩn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM
              </label>
              <select
                value={formData.sanPhamChiTiet.ram.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    ram: {
                      id: e.target.value
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn RAM</option>
                {rams?.map(ram => (
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
                value={formData.sanPhamChiTiet.oLuuTru.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    oLuuTru: {
                      id: e.target.value
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn ổ cứng</option>
                {storages?.map(storage => (
                  <option key={storage.id} value={storage.id}>
                    {storage.dungLuong}GB {storage.loaiOCung}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màn hình
              </label>
              <select
                value={formData.sanPhamChiTiet.manHinh.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    manHinh: {
                      id: e.target.value
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn màn hình</option>
                {displays?.map(display => (
                  <option key={display.id} value={display.id}>
                    {display.doPhanGiai} {display.tanSoQuet}Hz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPU
              </label>
              <select
                value={formData.sanPhamChiTiet.cpu.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    cpu: {
                      id: e.target.value
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn CPU</option>
                {cpus?.map(cpu => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.ten}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPU
              </label>
              <select
                value={formData.sanPhamChiTiet.gpu.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    gpu: {
                      id: e.target.value
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn GPU</option>
                {gpus?.map(gpu => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.ten}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <select
                value={formData.sanPhamChiTiet.mauSac.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    mauSac: {
                      id: e.target.value
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn màu sắc</option>
                {colors?.map(color => (
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
                value={formData.sanPhamChiTiet.cardDoHoa.id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sanPhamChiTiet: {
                    ...prev.sanPhamChiTiet,
                    cardDoHoa: {
                      id: e.target.value,
                      tenCard: prev.sanPhamChiTiet.cardDoHoa.tenCard,
                      trangThai: prev.sanPhamChiTiet.cardDoHoa.trangThai
                    }
                  }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Chọn card đồ họa</option>
                {gpus?.map(gpu => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.ten}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hình ảnh chính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh đại diện
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                <FaUpload />
                {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageUpload}
                  disabled={uploading}
                />
              </label>
              {formData.sanPhamChiTiet.hinhAnhMinhHoa && (
                <div className="relative w-24 h-24">
                  <img
                    src={formData.sanPhamChiTiet.hinhAnhMinhHoa}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      sanPhamChiTiet: {
                        ...prev.sanPhamChiTiet,
                        hinhAnhMinhHoa: ''
                      }
                    }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hình ảnh phụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh phụ
            </label>
            <div className="grid grid-cols-4 gap-4">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = formData.imageUrls.filter((_, i) => i !== index);
                      handleAdditionalImages(newUrls);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* IMEI List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh sách IMEI
            </label>
            <div className="grid grid-cols-2 gap-4">
              {formData.listImei.map((imei, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={imei}
                    onChange={(e) => {
                      const newImeis = [...formData.listImei];
                      newImeis[index] = e.target.value;
                      handleImeiChange(newImeis);
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`IMEI ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImeis = formData.listImei.filter((_, i) => i !== index);
                      handleImeiChange(newImeis);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Giới thiệu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới thiệu
            </label>
            <textarea
              value={formData.sanPhamChiTiet.gioiThieu}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                sanPhamChiTiet: {
                  ...prev.sanPhamChiTiet,
                  gioiThieu: e.target.value
                }
              }))}
              rows="4"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-gray-600 rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductVariantModal; 