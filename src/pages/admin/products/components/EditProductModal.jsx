import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
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

      // Tự động chọn các thuộc tính chi tiết
      setSpctData(prev => ({
        ...prev,
        ram: rams.find(r => r.id === prev.ram?.id) || null,
        oLuuTru: oLuuTrus.find(o => o.id === prev.oLuuTru?.id) || null,
        manHinh: manHinhs.find(mh => mh.id === prev.manHinh?.id) || null,
        cpu: cpus.find(c => c.id === prev.cpu?.id) || null,
        gpu: gpus.find(g => g.id === prev.gpu?.id) || null,
        mauSac: mauSacs.find(ms => ms.id === prev.mauSac?.id) || null,
        cardDoHoa: cardDoHoas.find(cdh => cdh.id === prev.cardDoHoa?.id) || null
      }));

      // Log để debug
      console.log('Current spctData:', spctData);
      console.log('Found matches:', {
        ram: rams.find(r => r.id === spctData.ram?.id),
        oLuuTru: oLuuTrus.find(o => o.id === spctData.oLuuTru?.id),
        manHinh: manHinhs.find(mh => mh.id === spctData.manHinh?.id),
        cpu: cpus.find(c => c.id === spctData.cpu?.id),
        gpu: gpus.find(g => g.id === spctData.gpu?.id),
        mauSac: mauSacs.find(ms => ms.id === spctData.mauSac?.id),
        cardDoHoa: cardDoHoas.find(cdh => cdh.id === spctData.cardDoHoa?.id)
      });
    }
  }, [
    isOpen,
    formData.id,
    thuongHieus,
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
    spctData.ram?.id,
    spctData.oLuuTru?.id,
    spctData.manHinh?.id,
    spctData.cpu?.id,
    spctData.gpu?.id,
    spctData.mauSac?.id,
    spctData.cardDoHoa?.id
  ]);

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
      // Validate required fields
      if (!formData.tenSanPham || !formData.thuongHieu?.id || !formData.loaiSanPham?.id) {
        toast.error('Vui lòng điền đầy đủ thông tin cơ bản');
        return;
      }

      if (!spctData.maSpct || !spctData.soLuong || !spctData.donGia) {
        toast.error('Vui lòng điền đầy đủ thông tin chi tiết');
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
        },
        sanPhamChiTiet: {
          ...spctData,
          soLuong: parseInt(spctData.soLuong),
          donGia: parseFloat(spctData.donGia),
          sanPham: {
            id: formData.id
          },
          ram: spctData.ram,
          oLuuTru: spctData.oLuuTru,
          manHinh: spctData.manHinh,
          cpu: spctData.cpu,
          gpu: spctData.gpu,
          mauSac: spctData.mauSac,
          cardDoHoa: spctData.cardDoHoa
        },
        imageUrls: imageUrls,
        listImei: null
      };

      await onSubmit(requestData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.tenSanPham}
                    onChange={(e) => setFormData({...formData, tenSanPham: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Thương hiệu</label>
                  <select
                    value={formData.thuongHieu?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      thuongHieu: thuongHieus.find(th => th.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {thuongHieus?.map(th => (
                      <option 
                        key={th.id} 
                        value={th.id}
                        selected={th.id === formData.thuongHieu?.id}
                      >
                        {th.ten}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Loại sản phẩm</label>
                  <select
                    value={formData.loaiSanPham?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      loaiSanPham: loaiSanPhams.find(loai => loai.id === parseInt(e.target.value))
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
                      nguonNhap: nguonNhaps.find(nguon => nguon.id === parseInt(e.target.value))
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
                      chatLieu: chatLieus.find(cl => cl.id === parseInt(e.target.value))
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
                  <label className="block text-sm font-medium mb-1">Kích thước laptop</label>
                  <select
                    value={formData.kichThuocLaptop?.id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      kichThuocLaptop: ktlts.find(kt => kt.id === parseInt(e.target.value))
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
                    onChange={(e) => setFormData({...formData, namSanXuat: parseInt(e.target.value)})}
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
                    onChange={(e) => setFormData({...formData, trongLuong: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pin (Wh)</label>
                  <input
                    type="number"
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Thời hạn bảo hành (tháng)</label>
                  <input
                    type="number"
                    value={formData.thoiHanBaoHanh}
                    onChange={(e) => setFormData({...formData, thoiHanBaoHanh: e.target.value})}
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
                    onChange={(e) => setSpctData({...spctData, maSpct: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng</label>
                  <input
                    type="number"
                    value={spctData.soLuong}
                    onChange={(e) => setSpctData({...spctData, soLuong: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Đơn giá</label>
                  <input
                    type="number"
                    value={spctData.donGia}
                    onChange={(e) => setSpctData({...spctData, donGia: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">RAM</label>
                  <select
                    value={spctData.ram?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      ram: rams.find(r => r.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.ram ? `Hiện tại: ${spctData.ram.dungLuong}GB` : 'Chọn RAM'}
                    </option>
                    {rams?.map(ram => (
                      <option key={ram.id} value={ram.id}>
                        {ram.dungLuong}GB
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ổ lưu trữ</label>
                  <select
                    value={spctData.oLuuTru?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      oLuuTru: oLuuTrus.find(o => o.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.oLuuTru ? `Hiện tại: ${spctData.oLuuTru.dungLuong}GB ${spctData.oLuuTru.loaiOCung}` : 'Chọn ổ lưu trữ'}
                    </option>
                    {oLuuTrus?.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.dungLuong}GB {o.loaiOCung}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Màn hình</label>
                  <select
                    value={spctData.manHinh?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      manHinh: manHinhs.find(mh => mh.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.manHinh ? `Hiện tại: ${spctData.manHinh.doPhanGiai} - ${spctData.manHinh.tanSoQuet}Hz` : 'Chọn màn hình'}
                    </option>
                    {manHinhs?.map(mh => (
                      <option key={mh.id} value={mh.id}>
                        {`${mh.doPhanGiai} - ${mh.tanSoQuet}Hz`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CPU</label>
                  <select
                    value={spctData.cpu?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      cpu: cpus.find(c => c.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.cpu ? `Hiện tại: ${spctData.cpu.ten}` : 'Chọn CPU'}
                    </option>
                    {cpus?.map(cpu => (
                      <option key={cpu.id} value={cpu.id}>
                        {cpu.ten}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GPU</label>
                  <select
                    value={spctData.gpu?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      gpu: gpus.find(g => g.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.gpu ? `Hiện tại: ${spctData.gpu.ten}` : 'Chọn GPU'}
                    </option>
                    {gpus?.map(gpu => (
                      <option key={gpu.id} value={gpu.id}>
                        {gpu.ten}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <select
                    value={spctData.mauSac?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      mauSac: mauSacs.find(ms => ms.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.mauSac ? `Hiện t�i: ${spctData.mauSac.tenMau}` : 'Chọn màu sắc'}
                    </option>
                    {mauSacs?.map(ms => (
                      <option key={ms.id} value={ms.id}>
                        {ms.tenMau}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Card đồ họa</label>
                  <select
                    value={spctData.cardDoHoa?.id || ''}
                    onChange={(e) => setSpctData({
                      ...spctData,
                      cardDoHoa: cardDoHoas.find(card => card.id === parseInt(e.target.value))
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">
                      {spctData.cardDoHoa ? `Hiện tại: ${spctData.cardDoHoa.tenCard}` : 'Chọn card đồ họa'}
                    </option>
                    {cardDoHoas?.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.tenCard}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Giới thiệu</label>
                  <textarea
                    value={spctData.gioiThieu}
                    onChange={(e) => setSpctData({...spctData, gioiThieu: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Phần upload ảnh */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ảnh minh họa</h3>
              <input
                type="file"
                onChange={handleMainImageUpload}
                className="w-full"
                accept="image/*"
              />
              {spctData.hinhAnhMinhHoa && (
                <div className="mt-2">
                  <img 
                    src={spctData.hinhAnhMinhHoa} 
                    alt="Main product" 
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Ảnh sản phẩm khác</h3>
              <input
                type="file"
                multiple
                onChange={handleMultipleImagesUpload}
                className="w-full"
                accept="image/*"
              />
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrls(urls => urls.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật'}
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

export default EditProductModal;