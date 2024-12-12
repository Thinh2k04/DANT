import React from 'react';
import { toast } from 'react-toastify';
import uploadImageUtil from '../../../../utils/imageUpload';

const ProductModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  spctData,
  setSpctData,
  onSubmit,
  isEditing,
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
  cardDoHoas
}) => {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({ ...formData, tenSanPham: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Loại sản phẩm</label>
                  <select
                    value={formData.loaiSanPham.id}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      loaiSanPham: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    {loaiSanPhams?.map(loai => (
                      <option key={loai.id} value={loai.id}>{loai.tenLoai}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nguồn nhập</label>
                  <select
                    value={formData.nguonNhap?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      nguonNhap: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn nguồn nhập</option>
                    {nguonNhaps?.map(nguon => (
                      <option key={nguon.id} value={nguon.id}>{nguon.tenNhaCungUng}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Chất liệu</label>
                  <select
                    value={formData.chatLieu?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      chatLieu: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn chất liệu</option>
                    {chatLieus?.map(cl => (
                      <option key={cl.id} value={cl.id}>{cl.tenChatLieu}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kích thước</label>
                  <select
                    value={formData.kichThuocLaptop?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      kichThuocLaptop: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn kích thước</option>
                    {ktlts?.map(kt => (
                      <option key={kt.id} value={kt.id}>{kt.kichThuoc} inch</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Năm sản xuất</label>
                  <input
                    type="number"
                    value={formData.namSanXuat}
                    onChange={(e) => setFormData({ ...formData, namSanXuat: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Trọng lượng (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.trongLuong}
                    onChange={(e) => setFormData({ ...formData, trongLuong: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Thời hạn bảo hành (tháng)</label>
                  <input
                    type="number"
                    value={formData.thoiHanBaoHanh}
                    onChange={(e) => setFormData({ ...formData, thoiHanBaoHanh: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pin (Wh)</label>
                  <input
                    type="number"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin chi tiết</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã sản phẩm chi tiết</label>
                  <input
                    type="text"
                    value={spctData.maSpct}
                    onChange={(e) => setSpctData({ ...spctData, maSpct: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng</label>
                  <input
                    type="number"
                    value={spctData.soLuong}
                    onChange={(e) => setSpctData({ ...spctData, soLuong: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Đơn giá</label>
                  <input
                    type="number"
                    value={spctData.donGia}
                    onChange={(e) => setSpctData({ ...spctData, donGia: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">RAM</label>
                  <select
                    value={spctData.ram.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      ram: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn RAM</option>
                    {rams?.map(ram => (
                      <option key={ram.id} value={ram.id}>{ram.dungLuong}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ổ lưu trữ</label>
                  <select
                    value={spctData.oLuuTru.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      oLuuTru: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn ổ lưu trữ</option>
                    {oLuuTrus?.map(o => (
                      <option key={o.id} value={o.id}>{o.dungLuong}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Màn hình</label>
                  <select
                    value={spctData.manHinh.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      manHinh: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn màn hình</option>
                    {manHinhs?.map(mh => (
                      <option key={mh.id} value={mh.id}>
                        {`${mh.loaiManHinh} - ${mh.doPhanGiai} - ${mh.tanSoQuet}Hz`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CPU</label>
                  <select
                    value={spctData.cpu.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      cpu: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn CPU</option>
                    {cpus?.map(cpu => (
                      <option key={cpu.id} value={cpu.id}>{cpu.ten}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GPU</label>
                  <select
                    value={spctData.gpu.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      gpu: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn GPU</option>
                    {gpus?.map(gpu => (
                      <option key={gpu.id} value={gpu.id}>{gpu.ten}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <select
                    value={spctData.mauSac.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      mauSac: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn màu sắc</option>
                    {mauSacs?.map(ms => (
                      <option key={ms.id} value={ms.id}>{ms.tenMau}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Card đồ họa</label>
                  <select
                    value={spctData.cardDoHoa.id}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      cardDoHoa: { id: e.target.value }
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn card đồ họa</option>
                    {cardDoHoas?.map(card => (
                      <option key={card.id} value={card.id}>{card.tenCard}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Giới thiệu</label>
                  <textarea
                    value={spctData.gioiThieu}
                    onChange={(e) => setSpctData({ ...spctData, gioiThieu: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload ảnh */}
          <div className="space-y-6">
            {/* Ảnh minh họa */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ảnh minh họa</h3>
              <div className="space-y-4">
                {spctData.hinhAnhMinhHoa ? (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={spctData.hinhAnhMinhHoa}
                      alt="Main product"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setSpctData(prev => ({ ...prev, hinhAnhMinhHoa: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 px-3 rounded-b-lg">
                      <p className="text-sm">Ảnh minh họa chính</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-xs">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      id="mainImageInput"
                    />
                    <label
                      htmlFor="mainImageInput"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-gray-600">Chọn ảnh minh họa</span>
                      <span className="text-sm text-gray-500 mt-2">PNG, JPG, GIF tối đa 5MB</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Ảnh sản phẩm khác */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ảnh sản phẩm khác</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImagesUpload}
                  className="hidden"
                  id="multipleImagesInput"
                />
                <label
                  htmlFor="multipleImagesInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600">Chọn nhiều ảnh</span>
                  <span className="text-sm text-gray-500 mt-2">PNG, JPG, GIF tối đa 5MB mỗi ảnh</span>
                </label>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrls(urls => urls.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-1 px-2 text-xs rounded-b-lg opacity-0 group-hover:opacity-100">
                      Ảnh {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {loading ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Thêm'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal; 