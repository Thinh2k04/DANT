import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadImageUtil from '../../../../utils/imageUpload';

const AddProductModal = ({ 
  isOpen, 
  onClose, 
  onAdd,
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
  if (!isOpen) return null;

  console.log('Props received:', { 
    isOpen, 
    onAdd, 
    formData, 
    spctData, 
    loading 
  });

  const handleMainImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const result = await uploadImageUtil(file);
        setSpctData(prev => ({
          ...prev,
          hinhAnhMinhHoa: result.url
        }));
        toast.success('Tải ảnh minh họa thành công', {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error uploading main image:', error);
      toast.error('Lỗi khi tải ảnh minh họa', {
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored'
      });
    }
  };

  const handleMultipleImagesUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(uploadImageUtil);
      const results = await Promise.all(uploadPromises);
      setImageUrls(prevUrls => [...prevUrls, ...results.map(result => result.url)]);
      toast.success('Tải ảnh sản phẩm thành công', {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored'
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Lỗi khi tải ảnh sản phẩm', {
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.tenSanPham?.trim()) {
        toast.error('Vui lòng nhập tên sản phẩm', {
          toastId: 'error1',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: 'colored'
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
      if (!formData.thoiHanBaoHanh || formData.thoiHanBaoHanh >= 36){
        toast.error('Thời hạn bảo hành không được lớn hơn 36 tháng');
        return;
      }
      
      if (!formData.pin || formData.pin <= 0) {
        toast.error('Dung lượng pin phải lớn hơn 0');
        return;
      }

      if (!formData.pin || formData.pin >= 100000) {
        toast.error('Dung lượng pin phải bé hơn 100000');
        return;
      }

      if (!spctData.maSpct?.trim()) {
        toast.error('Vui lòng nhập mã sản phẩm chi tiết');
        return;
      }

      if (!spctData.soLuong || spctData.soLuong < 0) {
        toast.error('Số lượng không hợp lệ');
        return;
      }
      if (!spctData.soLuong || spctData.soLuong >= 1000) {
        toast.error('Số lượng không hợp lệ');
        return;
      }

      if (!spctData.donGia || spctData.donGia <= 0) {
        toast.error('Đơn giá phải lớn hơn 0');
        return;
      }

      if (!spctData.donGia || spctData.donGia >= 1000000000) {
        toast.error('Đơn giá phải bé hơn 1000000000');
        return;
      }

      if (!spctData.gioiThieu?.trim() || spctData.gioiThieu.length < 10) {
        toast.error('Giới thiệu sản phẩm phải có ít nhất 10 ký tự');
        return;
      }

      if (!spctData.gioiThieu?.trim() || spctData.gioiThieu.length >= 4000) {
        toast.error('Giới thiệu sản phẩm không được lớn hơn 4000 ký tự');
        return;
      }

      if (!spctData.ram?.id) {
        toast.error('Vui lòng chọn RAM');
        return;
      }

      if (!spctData.cpu?.id) {
        toast.error('Vui lòng chọn CPU');
        return;
      }

      if (!spctData.gpu?.id) {
        toast.error('Vui lòng chọn GPU');
        return;
      }

      if (!spctData.oLuuTru?.id) {
        toast.error('Vui lòng chọn ổ lưu trữ');
        return;
      }

      if (!spctData.manHinh?.id) {
        toast.error('Vui lòng chọn màn hình');
        return;
      }

      if (!spctData.mauSac?.id) {
        toast.error('Vui lòng chọn màu sắc');
        return;
      }

      if (!spctData.cardDoHoa?.id) {
        toast.error('Vui lòng chọn card đồ họa');
        return;
      }

      if (!spctData.hinhAnhMinhHoa) {
        toast.error('Vui lòng tải lên ảnh minh họa');
        return;
      }

      if (imageUrls.length === 0) {
        toast.error('Vui lòng tải lên ít nhất một ảnh sản phẩm');
        return;
      }

      const requestData = {
        sanPham: {
          id: "",
          loaiSanPham: {
            id: parseInt(formData.loaiSanPham.id)
          },
          nguonNhap: {
            id: parseInt(formData.nguonNhap.id)
          },
          chatLieu: {
            id: parseInt(formData.chatLieu.id)
          },
          kichThuocLaptop: {
            id: parseInt(formData.kichThuocLaptop.id)
          },
          thuongHieu: {
            id: parseInt(formData.thuongHieu.id)
          },
          tenSanPham: formData.tenSanPham,
          namSanXuat: parseInt(formData.namSanXuat),
          trongLuong: parseFloat(formData.trongLuong),
          thoiHanBaoHanh: formData.thoiHanBaoHanh.toString(),
          pin: parseInt(formData.pin),
          trangThai: 1
        },
        sanPhamChiTiet: {
          id: "",
          hinhAnhMinhHoa: spctData.hinhAnhMinhHoa,
          soLuong: parseInt(spctData.soLuong),
          trangThai: 1,
          donGia: parseFloat(spctData.donGia),
          maSpct: spctData.maSpct,
          sanPham: {
            id: ""
          },
          ram: {
            id: parseInt(spctData.ram.id)
          },
          oLuuTru: {
            id: parseInt(spctData.oLuuTru.id)
          },
          manHinh: {
            id: parseInt(spctData.manHinh.id)
          },
          cpu: {
            id: parseInt(spctData.cpu.id)
          },
          gpu: {
            id: parseInt(spctData.gpu.id)
          },
          mauSac: {
            id: parseInt(spctData.mauSac.id)
          },
          gioiThieu: spctData.gioiThieu,
          cardDoHoa: {
            id: parseInt(spctData.cardDoHoa.id),
            tenCard: "Card đồ họa NVIDIA GTX 1650",
            trangThai: 1
          }
        },
        imageUrls: imageUrls,
        listImei: null
      };

      console.log('Form submitted');
      console.log('Request data:', requestData);

      await onAdd(requestData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm', {
        toastId: 'error-submit',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored'
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Thông tin cơ bản</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                    <input
                      type="text"
                      value={formData.tenSanPham}
                      onChange={(e) => setFormData({...formData, tenSanPham: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu *</label>
                    <select
                      value={formData.thuongHieu?.id || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        thuongHieu: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn thương hiệu</option>
                      {thuongHieus?.map(th => (
                        <option key={th.id} value={th.id}>{th.ten}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm *</label>
                    <select
                      value={formData.loaiSanPham?.id || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        loaiSanPham: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn loại sản phẩm</option>
                      {loaiSanPhams?.map(loai => (
                        <option key={loai.id} value={loai.id}>{loai.tenLoai}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất *</label>
                    <input
                      type="number"
                      value={formData.namSanXuat}
                      onChange={(e) => setFormData({...formData, namSanXuat: parseInt(e.target.value)})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trọng lượng (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.trongLuong}
                      onChange={(e) => setFormData({...formData, trongLuong: parseFloat(e.target.value)})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn bảo hành (tháng) *</label>
                    <input
                      type="number"
                      value={formData.thoiHanBaoHanh}
                      onChange={(e) => setFormData({...formData, thoiHanBaoHanh: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pin (Wh) *</label>
                    <input
                      type="number"
                      value={formData.pin}
                      onChange={(e) => setFormData({...formData, pin: parseInt(e.target.value)})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn nhập *</label>
                    <select
                      value={formData.nguonNhap?.id || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        nguonNhap: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn nguồn nhập</option>
                      {nguonNhaps?.map(nguon => (
                        <option key={nguon.id} value={nguon.id}>{nguon.tenNhaCungUng}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chất liệu *</label>
                    <select
                      value={formData.chatLieu?.id || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        chatLieu: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn chất liệu</option>
                      {chatLieus?.map(cl => (
                        <option key={cl.id} value={cl.id}>{cl.tenChatLieu}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước laptop *</label>
                    <select
                      value={formData.kichThuocLaptop?.id || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        kichThuocLaptop: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn kích thước</option>
                      {ktlts?.map(kt => (
                        <option key={kt.id} value={kt.id}>{kt.kichThuoc} inch</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Thông tin chi tiết</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm chi tiết *</label>
                    <input
                      type="text"
                      value={spctData.maSpct}
                      onChange={(e) => setSpctData({...spctData, maSpct: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                    <input
                      type="number"
                      value={spctData.soLuong}
                      onChange={(e) => setSpctData({...spctData, soLuong: parseInt(e.target.value)})}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá *</label>
                  <input
                    type="number"
                    value={spctData.donGia}
                    onChange={(e) => setSpctData({...spctData, donGia: parseFloat(e.target.value)})}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RAM *</label>
                    <select
                      value={spctData.ram?.id || ''}
                      onChange={(e) => setSpctData({
                        ...spctData,
                        ram: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn RAM</option>
                      {rams?.map(ram => (
                        <option key={ram.id} value={ram.id}>{ram.dungLuong}GB</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPU *</label>
                    <select
                      value={spctData.cpu?.id || ''}
                      onChange={(e) => setSpctData({
                        ...spctData,
                        cpu: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn CPU</option>
                      {cpus?.map(cpu => (
                        <option key={cpu.id} value={cpu.id}>{cpu.ten}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPU *</label>
                    <select
                      value={spctData.gpu?.id || ''}
                      onChange={(e) => setSpctData({
                        ...spctData,
                        gpu: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn GPU</option>
                      {gpus?.map(gpu => (
                        <option key={gpu.id} value={gpu.id}>{gpu.ten}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc *</label>
                    <select
                      value={spctData.mauSac?.id || ''}
                      onChange={(e) => setSpctData({
                        ...spctData,
                        mauSac: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn màu sắc</option>
                      {mauSacs?.map(ms => (
                        <option key={ms.id} value={ms.id}>{ms.tenMau}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu *</label>
                  <textarea
                    value={spctData.gioiThieu}
                    onChange={(e) => setSpctData({...spctData, gioiThieu: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ổ lưu trữ *</label>
                    <select
                      value={spctData.oLuuTru?.id || ''}
                      onChange={(e) => setSpctData({
                        ...spctData,
                        oLuuTru: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn ổ lưu trữ</option>
                      {oLuuTrus?.map(o => (
                        <option key={o.id} value={o.id}>{o.dungLuong}GB {o.loaiOCung}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Màn hình *</label>
                    <select
                      value={spctData.manHinh?.id || ''}
                      onChange={(e) => setSpctData({
                        ...spctData,
                        manHinh: { id: parseInt(e.target.value) }
                      })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn màn hình</option>
                      {manHinhs?.map(mh => (
                        <option key={mh.id} value={mh.id}>
                          {`${mh.doPhanGiai} - ${mh.tanSoQuet}Hz`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card đồ họa *</label>
                  <select
                    value={spctData.cardDoHoa?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      cardDoHoa: { id: parseInt(e.target.value) }
                    })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn card đồ họa</option>
                    {cardDoHoas?.map(card => (
                      <option key={card.id} value={card.id}>{card.tenCard}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section - Cải tiến */}
          <div className="mt-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                Hình ảnh sản phẩm
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Image Upload */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Ảnh chính của sản phẩm *</span>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <input
                              type="file"
                              className="sr-only"
                              onChange={handleMainImageUpload}
                              accept="image/*"
                              id="main-image-upload"
                            />
                            <label
                              htmlFor="main-image-upload"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                            >
                              <span>Tải ảnh lên</span>
                            </label>
                            <p className="pl-1">hoặc kéo thả vào đây</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {spctData.hinhAnhMinhHoa && (
                    <div className="relative group">
                      <img 
                        src={spctData.hinhAnhMinhHoa} 
                        alt="Main product preview" 
                        className="w-full h-64 object-contain rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setSpctData({...spctData, hinhAnhMinhHoa: ''})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Images Upload */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Ảnh bổ sung</span>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <input
                              type="file"
                              className="sr-only"
                              onChange={handleMultipleImagesUpload}
                              accept="image/*"
                              multiple
                              id="additional-images-upload"
                            />
                            <label
                              htmlFor="additional-images-upload"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                            >
                              <span>Tải nhiều ảnh</span>
                            </label>
                            <p className="pl-1">hoặc kéo thả vào đây</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB mỗi ảnh</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setImageUrls(urls => urls.filter((_, i) => i !== index))}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                            {index + 1}/{imageUrls.length}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;