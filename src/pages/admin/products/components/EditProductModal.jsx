import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadImageUtil from '../../../../utils/imageUpload';

const EditProductModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  spctData, 
  setSpctData, 
  loading, 
  imageUrls, 
  setImageUrls,
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
}) => {
  useEffect(() => {
    if (isOpen && formData.id) {
      // Tự động chọn các thuộc tính dựa trên id của sản phẩm
      setFormData(prev => ({
        ...prev,
        thuongHieu: thuongHieus.find(th => th.id === formData.thuongHieu?.id) || null,
        loaiSanPham: loaiSanPhams.find(lsp => lsp.id === formData.loaiSanPham?.id) || null,
        nguonNhap: nguonNhaps.find(nn => nn.id === formData.nguonNhap?.id) || null,
        chatLieu: chatLieus.find(cl => cl.id === formData.chatLieu?.id) || null,
        kichThuocLaptop: ktlts.find(kt => kt.id === formData.kichThuocLaptop?.id) || null
      }));
    }
  }, [isOpen, formData.id, thuongHieus, loaiSanPhams, nguonNhaps, chatLieus, ktlts]);

  if (!isOpen) return null;

  const handleMainImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const result = await uploadImageUtil(file);
        setSpctData(prev => ({
          ...prev,
          hinhAnhMinhHoa: result.url
        }));
        toast.success('Tải ảnh minh họa thành công');
      }
    } catch (error) {
      console.error('Error uploading main image:', error);
      toast.error('Lỗi khi tải ảnh minh họa');
    }
  };

  const handleMultipleImagesUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(uploadImageUtil);
      const results = await Promise.all(uploadPromises);
      setImageUrls(prevUrls => [...prevUrls, ...results.map(result => result.url)]);
      toast.success('Tải ảnh sản phẩm thành công');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Lỗi khi tải ảnh sản phẩm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.tenSanPham?.trim()) {
        toast.error('Vui lòng nhập tên sản phẩm', {
          toastId: 'edit-error1'
        });
        return;
      }

      if (!formData.thuongHieu?.id) {
        toast.error('Vui lòng chọn thương hiệu');
        return;
      }

      if (!formData.loaiSanPham?.id) {
        toast.error('Vui lòng chọn loại sản phẩm');
        return;
      }

      if (!formData.namSanXuat || formData.namSanXuat < 2000 || formData.namSanXuat > new Date().getFullYear()) {
        toast.error('Năm sản xuất không hợp lệ');
        return;
      }

      if (!formData.trongLuong || formData.trongLuong <= 0) {
        toast.error('Trọng lượng phải lớn hơn 0');
        return;
      }

      if (!formData.thoiHanBaoHanh || formData.thoiHanBaoHanh <= 0) {
        toast.error('Thời hạn bảo hành phải lớn hơn 0');
        return;
      }

      if (!formData.pin || formData.pin <= 0) {
        toast.error('Dung lượng pin phải lớn hơn 0');
        return;
      }

      const requestData = {
        sanPham: {
          ...formData,
          loaiSanPham: formData.loaiSanPham,
          nguonNhap: formData.nguonNhap,
          chatLieu: formData.chatLieu,
          kichThuocLaptop: formData.kichThuocLaptop,
          thuongHieu: formData.thuongHieu,
          namSanXuat: parseInt(formData.namSanXuat),
          trongLuong: parseFloat(formData.trongLuong),
          thoiHanBaoHanh: formData.thoiHanBaoHanh.toString(),
          pin: parseInt(formData.pin)
        }
      };

      await onSubmit(requestData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm', {
        toastId: 'edit-error-submit'
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cập nhật sản phẩm</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({...formData, tenSanPham: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Thương hiệu</label>
                  <select
                    value={formData.thuongHieu?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      thuongHieu: thuongHieus.find(th => th.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {thuongHieus?.map(th => (
                      <option key={th.id} value={th.id}>{th.ten}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Loại sản phẩm</label>
                  <select
                    value={formData.loaiSanPham?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      loaiSanPham: loaiSanPhams.find(loai => loai.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    {loaiSanPhams?.map(loai => (
                      <option key={loai.id} value={loai.id}>{loai.tenLoai}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Nguồn nhập</label>
                  <select
                    value={formData.nguonNhap?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      nguonNhap: nguonNhaps.find(nn => nn.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn nguồn nhập</option>
                    {nguonNhaps?.map(nn => (
                      <option key={nn.id} value={nn.id}>{nn.tenNhaCungUng}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Chất liệu</label>
                  <select
                    value={formData.chatLieu?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      chatLieu: chatLieus.find(cl => cl.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn chất liệu</option>
                    {chatLieus?.map(cl => (
                      <option key={cl.id} value={cl.id}>{cl.tenChatLieu}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Kích thước laptop</label>
                  <select
                    value={formData.kichThuocLaptop?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      kichThuocLaptop: ktlts.find(kt => kt.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn kích thước</option>
                    {ktlts?.map(kt => (
                      <option key={kt.id} value={kt.id}>{kt.kichThuoc} inch</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Thông tin chi tiết</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Năm sản xuất</label>
                  <input
                    type="number"
                    value={formData.namSanXuat}
                    onChange={(e) => setFormData({...formData, namSanXuat: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Trọng lượng (kg)</label>
                  <input
                    type="number"
                    value={formData.trongLuong}
                    onChange={(e) => setFormData({...formData, trongLuong: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Thời hạn bảo hành (tháng)</label>
                  <input
                    type="number"
                    value={formData.thoiHanBaoHanh}
                    onChange={(e) => setFormData({...formData, thoiHanBaoHanh: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Pin (Wh)</label>
                  <input
                    type="number"
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;