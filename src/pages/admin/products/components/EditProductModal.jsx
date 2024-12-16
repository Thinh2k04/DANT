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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
        sanPham: {
            id: formData.id,
            loaiSanPham: {
                id: formData.loaiSanPham.id
            },
            nguonNhap: {
                id: formData.nguonNhap.id
            },
            chatLieu: {
                id: formData.chatLieu.id
            },
            kichThuocLaptop: {
                id: formData.kichThuocLaptop.id
            },
            tenSanPham: formData.tenSanPham,
            namSanXuat: formData.namSanXuat,
            trongLuong: formData.trongLuong,
            thoiHanBaoHanh: formData.thoiHanBaoHanh,
            pin: formData.pin,
            trangThai: formData.trangThai
        },
        sanPhamChiTiet: {
            id: spctData.id,
            hinhAnhMinhHoa: spctData.hinhAnhMinhHoa,
            soLuong: parseInt(spctData.soLuong),
            trangThai: spctData.trangThai,
            donGia: parseFloat(spctData.donGia),
            maSpct: spctData.maSpct,
            sanPham: {
                id: formData.id
            },
            ram: {
                id: spctData.ram.id
            },
            oLuuTru: {
                id: spctData.oLuuTru.id
            },
            manHinh: {
                id: spctData.manHinh.id
            },
            cpu: {
                id: spctData.cpu.id
            },
            gpu: {
                id: spctData.gpu.id
            },
            mauSac: {
                id: parseInt(spctData.mauSac.id)
            },
            trangThaiSpct: spctData.trangThaiSpct,
            gioiThieu: spctData.gioiThieu,
            cardDoHoa: {
                id: spctData.cardDoHoa.id
            }
        },
        imageUrls: imageUrls
    };

    try {
        const response = await fetch(`http://localhost:8080/rest/spctDTO/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            toast.success('Cập nhật sản phẩm thành công');
            onClose();
            window.location.reload();
        } else {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            toast.error(errorData.message || 'Lỗi khi cập nhật sản phẩm');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cập nhật sản phẩm</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản sản phẩm */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={formData.tenSanPham}
                onChange={(e) => setFormData({...formData, tenSanPham: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm sản xuất
              </label>
              <input
                type="number"
                value={formData.namSanXuat}
                onChange={(e) => setFormData({...formData, namSanXuat: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trọng lượng
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.trongLuong}
                onChange={(e) => setFormData({...formData, trongLuong: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời hạn bảo hành (tháng)
              </label>
              <input
                type="number"
                value={formData.thoiHanBaoHanh}
                onChange={(e) => setFormData({...formData, thoiHanBaoHanh: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin (Wh)
              </label>
              <input
                type="number"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại sản phẩm
              </label>
              <select
                value={formData.loaiSanPham.id}
                onChange={(e) => setFormData({
                  ...formData,
                  loaiSanPham: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {loaiSanPhams.map(loai => (
                  <option key={loai.id} value={loai.id}>
                    {loai.tenLoai}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thông tin chi tiết sản phẩm */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sản phẩm chi tiết
              </label>
              <input
                type="text"
                value={spctData.maSpct || ''}
                onChange={(e) => setSpctData({...spctData, maSpct: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={spctData.soLuong || ''}
                onChange={(e) => setSpctData({...spctData, soLuong: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn giá
              </label>
              <input
                type="number"
                value={spctData.donGia || ''}
                onChange={(e) => setSpctData({...spctData, donGia: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM
              </label>
              <select
                value={spctData.ram.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  ram: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {rams.map(ram => (
                  <option key={ram.id} value={ram.id}>
                    {ram.dungLuong}GB
                  </option>
                ))}
              </select>
            </div>

            {/* Thêm các trường select khác tương tự */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ổ cứng
              </label>
              <select
                value={spctData.oLuuTru.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  oLuuTru: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {oLuuTrus.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.dungLuong}GB {o.loaiOCung}
                  </option>
                ))}
              </select>
            </div>

            {/* Thêm các trường còn thiếu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nguồn nhập
              </label>
              <select
                value={formData.nguonNhap.id}
                onChange={(e) => setFormData({
                  ...formData,
                  nguonNhap: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {nguonNhaps.map(nguon => (
                  <option key={nguon.id} value={nguon.id}>
                    {nguon.tenNhaCungUng}
                  </option>
                ))}

              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chất liệu
              </label>
              <select
                value={formData.chatLieu.id}
                onChange={(e) => setFormData({
                  ...formData,
                  chatLieu: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {chatLieus.map(cl => (
                  <option key={cl.id} value={cl.id}>
                    {cl.tenChatLieu}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kích thước laptop
              </label>
              <select
                value={formData.kichThuocLaptop.id}
                onChange={(e) => setFormData({
                  ...formData,
                  kichThuocLaptop: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {ktlts.map(kt => (
                  <option key={kt.id} value={kt.id}>
                    {kt.kichThuoc} inch
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màn hình
              </label>
              <select
                value={spctData.manHinh.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  manHinh: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {manHinhs.map(mh => (
                  <option key={mh.id} value={mh.id}>
                    {mh.doPhanGiai} - {mh.tanSoQuet}Hz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPU
              </label>
              <select
                value={spctData.cpu.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  cpu: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {cpus.map(cpu => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.hangSanXuat} {cpu.ten}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPU
              </label>
              <select
                value={spctData.gpu.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  gpu: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {gpus.map(gpu => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.hangSanXuat} {gpu.ten}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <select
                value={spctData.mauSac.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  mauSac: { id: parseInt(e.target.value) }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {mauSacs.map(ms => (
                  <option key={ms.id} value={ms.id}>
                    {ms.tenMau}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card đồ họa
              </label>
              <select
                value={spctData.cardDoHoa.id}
                onChange={(e) => setSpctData({
                  ...spctData,
                  cardDoHoa: { id: e.target.value }
                })}
                className="w-full p-2 border rounded-lg"
                required
              >
                {cardDoHoas.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.tenCard}
                  </option>
                ))}
              </select>
            </div>

            {/* Giữ lại phần giới thiệu ở cuối */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới thiệu
              </label>
              <textarea
                value={spctData.gioiThieu}
                onChange={(e) => setSpctData({...spctData, gioiThieu: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="4"
                required
              />
            </div>
          </div>

          {/* Phần upload ảnh */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh minh họa
              </label>
              <input
                type="file"
                onChange={handleMainImageUpload}
                className="w-full"
                accept="image/*"
              />
              {spctData.hinhAnhMinhHoa && (
                <div className="relative mt-2 inline-block">
                  <img 
                    src={spctData.hinhAnhMinhHoa} 
                    alt="Main product" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setSpctData(prev => ({...prev, hinhAnhMinhHoa: ''}))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh sản phẩm
              </label>
              <input
                type="file"
                multiple
                onChange={handleMultipleImagesUpload}
                className="w-full"
                accept="image/*"
              />
            </div>

            {/* Hiển thị ảnh đã upload */}
            <div className="grid grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrls(urls => urls.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;