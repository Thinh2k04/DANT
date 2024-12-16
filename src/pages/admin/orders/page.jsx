import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from '../Navbar/NavbarAdmin';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/rest/hoa_don/getAll');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải danh sách đơn hàng', {
          position: "top-right",
          autoClose: 3000
        });
      }
    };
    fetchOrders();
  }, []);

  const handleOrderClick = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/rest/hdct/Byidhd/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setOrderDetails(data);
      const order = orders.find(o => o.id === orderId);
      setSelectedOrder(order);
      setShowStatusModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Không thể tải chi tiết đơn hàng', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || selectedStatus === null) {
      toast.warning('Vui lòng chọn trạng thái mới', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    if (selectedOrder.trangThaiThanhToan === 0) {
      toast.error('Không thể cập nhật đơn hàng đã hủy', {
        position: "top-right",
        autoClose: 3000
      });
      setShowStatusModal(false);
      setSelectedStatus(null);
      return;
    }

    if (selectedOrder.trangThaiThanhToan === 1) {
      toast.error('Không thể cập nhật đơn hàng đã thành công', {
        position: "top-right",
        autoClose: 3000
      });
      setShowStatusModal(false);
      setSelectedStatus(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/rest/hoa_don/update/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedOrder.id,
          trangThaiThanhToan: selectedStatus,
          tongTien: selectedOrder.tongTien,
          thoiGianLapHoaDon: selectedOrder.thoiGianLapHoaDon,
          diaChiNhanHang: selectedOrder.diaChiNhanHang,
          thongTinTaiKhoan: selectedOrder.thongTinTaiKhoan,
          cuaHang: selectedOrder.cuaHang,
          hinhThucThanhToan: selectedOrder.hinhThucThanhToan,
          voucher: selectedOrder.voucher
        })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? {...order, trangThaiThanhToan: selectedStatus}
          : order
      ));
      
      setSelectedOrder({...selectedOrder, trangThaiThanhToan: selectedStatus});
      setShowStatusModal(false);
      setSelectedStatus(null);
      setOrderDetails([]);

      toast.success('Cập nhật trạng thái đơn hàng thành công', {
        position: "top-right",
        autoClose: 2000
      });

    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Cập nhật trạng thái đơn hàng thất bại', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    setSelectedStatus(null);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Quản lý đơn hàng</h1>
        
        <div className="mt-4 overflow-hidden shadow-xl rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tên khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Thời gian lập hóa đơn</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr 
                  key={order.id}
                  className="hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleOrderClick(order.id)}>{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleOrderClick(order.id)}>{order.thongTinTaiKhoan?.hoTen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleOrderClick(order.id)}>{order.tongTien?.toLocaleString()}₫</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleOrderClick(order.id)}>{order.thoiGianLapHoaDon}</td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleOrderClick(order.id)}>
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full 
                      ${order.trangThaiThanhToan === 0 ? 'bg-red-100 text-red-800' : 
                        order.trangThaiThanhToan === 1 ? 'bg-green-100 text-green-800' : 
                        order.trangThaiThanhToan === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.trangThaiThanhToan === 0 ? 'Đã hủy' :
                       order.trangThaiThanhToan === 1 ? 'Thành công' :
                       order.trangThaiThanhToan === 2 ? 'Chờ thanh toán' : 'Không xác định'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.trangThaiThanhToan === 2 && (
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowStatusModal(true);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Cập nhật trạng thái
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showStatusModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg w-96 shadow-2xl transform transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Cập nhật trạng thái</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="status-success"
                      name="status"
                      value={1}
                      checked={selectedStatus === 1}
                      onChange={(e) => setSelectedStatus(Number(e.target.value))}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="status-success" className="text-gray-700">Thành công</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="status-cancel"
                      name="status"
                      value={0}
                      checked={selectedStatus === 0}
                      onChange={(e) => setSelectedStatus(Number(e.target.value))}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="status-cancel" className="text-gray-700">Hủy đơn</label>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedOrder && orderDetails.length > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg w-4/5 max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder.id}</h2>
                  <button 
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Thông tin khách hàng</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700"><span className="font-semibold">Họ tên:</span> {selectedOrder.thongTinTaiKhoan?.hoTen}</p>
                      <p className="text-gray-700"><span className="font-semibold">Số điện thoại:</span> {selectedOrder.thongTinTaiKhoan?.soDienThoai}</p>
                      <p className="text-gray-700"><span className="font-semibold">Email:</span> {selectedOrder.thongTinTaiKhoan?.email}</p>
                      <p className="text-gray-700"><span className="font-semibold">CCCD:</span> {selectedOrder.thongTinTaiKhoan?.soCccd}</p>
                      <p className="text-gray-700"><span className="font-semibold">Địa chỉ:</span> {selectedOrder.thongTinTaiKhoan?.diaChi}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Thông tin đơn hàng</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700"><span className="font-semibold">Ngày đ���t:</span> {selectedOrder.thoiGianLapHoaDon}</p>
                      <p className="text-gray-700"><span className="font-semibold">Trạng thái:</span> 
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold
                          ${selectedOrder.trangThaiThanhToan === 0 ? 'bg-red-100 text-red-800' : 
                            selectedOrder.trangThaiThanhToan === 1 ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {selectedOrder.trangThaiThanhToan === 0 ? 'Đã hủy' :
                           selectedOrder.trangThaiThanhToan === 1 ? 'Thành công' :
                           selectedOrder.trangThaiThanhToan === 2 ? 'Chờ thanh toán' : 'Không xác định'}
                        </span>
                      </p>
                      <p className="text-gray-700"><span className="font-semibold">Địa chỉ nhận hàng:</span> {selectedOrder.diaChiNhanHang}</p>
                      <p className="text-gray-700"><span className="font-semibold">Hình thức thanh toán:</span> {selectedOrder.hinhThucThanhToan?.tenHinhThuc}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Thông tin cửa hàng</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 mb-2"><span className="font-semibold">Tỉnh/Thành phố:</span> {selectedOrder.cuaHang?.tinh}</p>
                      <p className="text-gray-700 mb-2"><span className="font-semibold">Quận/Huyện:</span> {selectedOrder.cuaHang?.huyen}</p>
                      <p className="text-gray-700"><span className="font-semibold">Phường/Xã:</span> {selectedOrder.cuaHang?.phuong}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-2"><span className="font-semibold">Địa chỉ:</span> {selectedOrder.cuaHang?.soNha}</p>
                      <p className="text-gray-700"><span className="font-semibold">Thời gian hoạt động:</span> {selectedOrder.cuaHang?.thoiGianMoCua} - {selectedOrder.cuaHang?.thoiGianDongCua}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.voucher && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Thông tin voucher</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Mã voucher:</span> {selectedOrder.voucher.maVoucher}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Số tiền giảm tối đa:</span> {selectedOrder.voucher.soTienToiDa?.toLocaleString()}₫</p>
                        <p className="text-gray-700"><span className="font-semibold">Phần trăm giảm:</span> {(selectedOrder.voucher.phanTramApDung * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Điều kiện áp dụng:</span> Đơn hàng từ {selectedOrder.voucher.dieuKienApDung?.toLocaleString()}₫</p>
                        <p className="text-gray-700"><span className="font-semibold">Thời gian hết hạn:</span> {selectedOrder.voucher.thoiGianHenKet}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Sản phẩm</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Thông số</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Số lượng</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Đơn giá</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderDetails.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 mb-1">{detail.sanPhamChiTiet?.sanPham?.tenSanPham}</p>
                            <p className="text-sm text-gray-600">Mã SP: {detail.sanPhamChiTiet?.maSpct}</p>
                            <p className="text-sm text-gray-600">Năm SX: {detail.sanPhamChiTiet?.sanPham?.namSanXuat}</p>
                            <p className="text-sm text-gray-600">Bảo hành: {detail.sanPhamChiTiet?.sanPham?.thoiHanBaoHanh}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm mb-1"><span className="font-semibold">CPU:</span> {detail.sanPhamChiTiet?.cpu?.hangSanXuat} {detail.sanPhamChiTiet?.cpu?.ten}</p>
                            <p className="text-sm mb-1"><span className="font-semibold">RAM:</span> {detail.sanPhamChiTiet?.ram?.dungLuong}GB</p>
                            <p className="text-sm mb-1"><span className="font-semibold">Ổ cứng:</span> {detail.sanPhamChiTiet?.oluuTru?.dungLuong}GB {detail.sanPhamChiTiet?.oluuTru?.loaiOCung}</p>
                            <p className="text-sm mb-1"><span className="font-semibold">GPU:</span> {detail.sanPhamChiTiet?.gpu?.hangSanXuat} {detail.sanPhamChiTiet?.gpu?.ten}</p>
                            <p className="text-sm"><span className="font-semibold">Màn hình:</span> {detail.sanPhamChiTiet?.manHinh?.doPhanGiai}, {detail.sanPhamChiTiet?.manHinh?.tanSoQuet}Hz</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{detail.soLuong}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{detail.gia?.toLocaleString()}₫</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{(detail.soLuong * detail.gia)?.toLocaleString()}₫</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4 text-right font-bold text-lg">Tổng cộng:</td>
                        <td className="px-6 py-4 font-bold text-lg text-blue-600">{selectedOrder.tongTien?.toLocaleString()}₫</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderManagement;