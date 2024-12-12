import React from 'react';
import { toast } from 'react-toastify';
import uploadImageUtil from '../../../../utils/imageUpload';

const EditProductModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  spctData,
  setSpctData,
  onSubmit,
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
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cập nhật sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Thông tin cơ bản */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({ ...formData, tenSanPham: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Các trường thông tin cơ bản khác */}
                {/* ... */}
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiết</h3>
              <div className="space-y-4">
                {/* Các trường thông tin chi tiết */}
                {/* ... */}
              </div>
            </div>
          </div>

          {/* Phần upload ảnh */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Ảnh minh họa */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Ảnh minh họa chính</h4>
                {spctData.hinhAnhMinhHoa ? (
                  <div className="relative group">
                    <img
                      src={spctData.hinhAnhMinhHoa}
                      alt="Main product"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSpctData(prev => ({ ...prev, hinhAnhMinhHoa: '' }))}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
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
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-600">Chọn ảnh minh họa</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Ảnh khác */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Ảnh sản phẩm khác</h4>
                <div className="grid grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImageUrls(urls => urls.filter((_, i) => i !== index))}
                          className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
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
                      className="cursor-pointer flex flex-col items-center h-full justify-center"
                    >
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="mt-1 text-xs text-gray-600">Thêm ảnh</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-md text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal; 