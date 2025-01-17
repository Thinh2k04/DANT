import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const [orderData, setOrderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [updateReason, setUpdateReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showImeiModal, setShowImeiModal] = useState(false);
  const [selectedImeis, setSelectedImeis] = useState({});
  const [availableImeis, setAvailableImeis] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/rest/hoa_don/getAll');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        const sortedOrders = data.sort((a, b) => 
          new Date(b.thoiGianLapHoaDon) - new Date(a.thoiGianLapHoaDon)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải danh sách đơn hàng', {
          position: "top-right",
          autoClose: 3000
        });
      }
    };

    fetchOrders();

    let pollInterval;
    if (isPolling) {
      pollInterval = setInterval(fetchOrders, 10000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isPolling]);

  useEffect(() => {
    if (showStatusModal) {
      setIsPolling(false);
    } else {
      setIsPolling(true);
    }
  }, [showStatusModal]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setUserInfo(user);
    } else {
      toast.error('Vui lòng đăng nhập để tiếp tục', {
        position: "top-right",
        autoClose: 3000
      });
      navigate('/login');
    }
  }, [navigate]);

  const fetchTimeline = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/rest/timeline/getByHoaDonId/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch timeline');
      const data = await response.json();
      setTimelineData(data);
    } catch (error) {
      console.error('Lỗi khi tải timeline:', error);
    }
  };

  const fetchImeis = async (spctId) => {
    try {
      const response = await fetch(`http://localhost:8080/rest/imei/getById/${spctId}`);
      if (!response.ok) throw new Error('Failed to fetch IMEIs');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching IMEIs:', error);
      return [];
    }
  };

  const handleOrderClick = async (orderId) => {
    try {
      const [orderResponse, timelineResponse] = await Promise.all([
        fetch(`http://localhost:8080/rest/hoa_don/getById/${orderId}`),
        fetch(`http://localhost:8080/rest/timeline/getByHoaDonId/${orderId}`)
      ]);

      if (!orderResponse.ok) throw new Error('Failed to fetch order details');
      if (!timelineResponse.ok) throw new Error('Failed to fetch timeline');

      const [orderData, timelineData] = await Promise.all([
        orderResponse.json(),
        timelineResponse.json()
      ]);

      setOrderData(orderData);
      setOrderDetails(orderData.chiTietHoaDon);
      setTimelineData(timelineData);
      setSelectedOrder(orderData.hoaDon);

      // Xử lý hiển thị modal IMEI nếu đơn hàng ở trạng thái chờ xác nhận
      if (orderData.hoaDon.trangThai === 1) {
        // Lấy danh sách IMEI cho từng sản phẩm
        const imeiPromises = orderData.chiTietHoaDon.map(detail => 
          fetchImeis(detail.id)
        );
        const imeiResults = await Promise.all(imeiPromises);
        
        // Tạo map IMEI với key là id sản phẩm
        const imeiMap = {};
        orderData.chiTietHoaDon.forEach((detail, index) => {
          imeiMap[detail.id] = imeiResults[index];
        });

        setAvailableImeis(imeiMap);
        setSelectedImeis({});
        setShowImeiModal(true);
      } else {
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Không thể tải thông tin đơn hàng');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || selectedStatus === null || !updateReason) {
      toast.warning('Vui lòng điền đầy đủ thông tin', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    if (!userInfo) {
      toast.error('Vui lòng đăng nhập lại', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    // Kiểm tra logic chuyển trạng thái
    let isValidTransition = false;
    switch (selectedOrder.trangThai) {
      case 0: // Hủy đơn hàng
      case 7: // Hoàn thành đơn hàng  
      case 8: // Yêu cầu hoàn trả hàng
        isValidTransition = false;
        break;
      case 1: // Chờ xác nhận
        isValidTransition = selectedStatus === 2 || selectedStatus === 0;
        break;
      case 2: // Xác nhận đơn hàng
        isValidTransition = selectedStatus === 3 || selectedStatus === 0;
        break;
      case 3: // Đơn vị vận chuyển đang giao
        isValidTransition = selectedStatus === 4 || selectedStatus === 0;
        break;
      case 4: // Đang được giao tới bạn
        isValidTransition = selectedStatus === 5;
        break;
      case 5: // Đơn hàng đã được giao thành công
        isValidTransition = selectedStatus === 6;
        break;
      case 6: // Xác nhận giao hàng thành công
        isValidTransition = selectedStatus === 7;
        break;
      default:
        isValidTransition = false;
    }

    if (!isValidTransition) {
      toast.error('Không thể chuyển sang trạng thái này', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    // Nếu hủy đơn hàng, yêu cầu nhập lý do
    if (selectedStatus === 0 && !updateReason) {
      setShowReasonInput(true);
      return;
    }

    try {
      // Add timeline entry
      const timelineResponse = await fetch('http://localhost:8080/rest/timeline/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hoaDonId: selectedOrder.id,
          trangThai: selectedStatus.toString(),
          nguoiCapNhat: userInfo.username,
          lyDo: updateReason,
          role: userInfo.role
        })
      });

      if (!timelineResponse.ok) throw new Error('Failed to add timeline entry');

      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? {...order, trangThai: selectedStatus}
          : order
      ));
      
      setSelectedOrder({...selectedOrder, trangThai: selectedStatus});
      setShowStatusModal(false);
      setSelectedStatus(null);
      setOrderDetails([]);
      setUpdateReason('');
      setShowReasonInput(false);
      setIsPolling(true);

      toast.success('Cập nhật trạng thái đơn hàng thành công', {
        position: "top-right",
        autoClose: 2000
      });

    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
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
    setIsPolling(true);
  };

  const exportToExcel = () => {
    const excelData = orders.map(order => ({
      'Mã đơn hàng': order.id,
      'Tên khách hàng': order.thongTinTaiKhoan?.hoTen,
      'Số điện thoại': order.thongTinTaiKhoan?.soDienThoai,
      'Email': order.thongTinTaiKhoan?.email,
      'Địa chỉ nhận hàng': order.diaChiNhanHang,
      'Tổng tiền': order.tongTien,
      'Thời gian đặt hàng': order.thoiGianLapHoaDon,
      'Trạng thái': 
                    order.trangThai === 0 ? 'Đã hủy' :
                    order.trangThai === 1 ? 'Chờ xác nhận' :
                    order.trangThai === 2 ? 'Xác nhận đơn hàng' :
                    order.trangThai === 3 ? 'Đơn vị vận chuyển đang giao' :
                    order.trangThai === 4 ? 'Đang được giao tới bạn' :
                    order.trangThai === 5 ? 'Đơn hàng đã được giao thành công' :
                    order.trangThai === 6 ? 'Xác nhận giao hàng thành công' :
                    order.trangThai === 7 ? 'Hoàn thành đơn hàng' :
                    order.trangThai === 8 ? 'Yêu cầu hoàn trả hàng' : 'Không xác định',
      'Hình thức thanh toán': order.hinhThucThanhToan?.tenHinhThuc,
      'Cửa hàng': `${order.cuaHang?.soNha}, ${order.cuaHang?.phuong}, ${order.cuaHang?.huyen}, ${order.cuaHang?.tinh}`
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const colWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
      { wch: 40 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 50 },
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đơn hàng');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `danh_sach_don_hang_${timestamp}.xlsx`;

    XLSX.writeFile(wb, fileName);

    toast.success('Xuất file Excel thành công!', {
      position: "top-right",
      autoClose: 2000
    });
  };

  const generatePDF = (order, details) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Thiết lập font Times New Roman
    doc.setFont('times', 'normal');
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text("LAPTOP SHOP", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text("H O A   D O N   B A N   H A N G", 105, 30, { align: "center" });
    doc.text(`#${order.maHoaDon}`, 105, 37, { align: "center" });
    
    // Đường kẻ phân cách
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);
    
    // Thông tin công ty
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text([
      "CONG TY TNHH LAPTOP SHOP",
      `${order.cuaHang?.soNha}, ${order.cuaHang?.phuong}, ${order.cuaHang?.huyen}, ${order.cuaHang?.tinh}`,
      "Hotline: 0123.456.789 - Email: shoplaptop@gmail.com",
      "MST: 0123456789"
    ], 105, 55, { align: "center" });

    // Thông tin khách hàng
    const customerInfo = {
      startY: 75,
      head: [['THONG TIN KHACH HANG']], 
      body: [
        ['Khach hang:', order.thongTinTaiKhoan?.hoTen || 'N/A'],
        ['So dien thoai:', order.thongTinTaiKhoan?.soDienThoai || 'N/A'],
        ['Email:', order.thongTinTaiKhoan?.email || 'N/A'],
        ['CCCD:', order.thongTinTaiKhoan?.soCccd || 'N/A'],
        ['Dia chi:', order.thongTinTaiKhoan?.diaChi || 'N/A'],
        ['Dia diem giao hang:', order.diaChiNhanHang || 'N/A'],
        ['Ngay dat hang:', new Date(order.thoiGianLapHoaDon).toLocaleDateString('vi-VN')],
        ['Hinh thuc thanh toan:', order.hinhThucThanhToan?.tenHinhThuc || 'N/A'],
        ['Trang thai don hang:', order.trangThai === 0 ? 'Da huy' :
                               order.trangThai === 1 ? 'Cho xac nhan' :
                               order.trangThai === 2 ? 'Xac nhan don hang' :
                               order.trangThai === 3 ? 'Don vi van chuyen dang giao' :
                               order.trangThai === 4 ? 'Dang duoc giao toi ban' :
                               order.trangThai === 5 ? 'Don hang da duoc giao thanh cong' :
                               order.trangThai === 6 ? 'Xac nhan giao hang thanh cong' :
                               order.trangThai === 7 ? 'Hoan thanh don hang' :
                               order.trangThai === 8 ? 'Yeu cau hoan tra hang' : 'N/A'],
        ['Trang thai thanh toan:', order.trangThaiThanhToan === 1 ? 'Chua thanh toan' : 
                                  order.trangThaiThanhToan === 2 ? 'Da thanh toan' : 'N/A']
      ],
      theme: 'plain',
      styles: { 
        fontSize: 11,
        cellPadding: 4,
        font: 'times',
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
        fontSize: 13,
        fontStyle: 'bold',
        halign: 'left',
        font: 'times'
      },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 100 }
      }
    };

    doc.autoTable(customerInfo);

    // Chi tiết sản phẩm
    const productDetails = {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['STT', 'Sản phẩm', 'Số lượng', 'Đơn giá', 'Thành tiền']],
      body: details.map((detail, index) => [
        index + 1,
        detail.tenSanPham,
        detail.soLuong,
        detail.donGia?.toLocaleString('vi-VN'),
        (detail.soLuong * detail.donGia)?.toLocaleString('vi-VN')
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center',
        font: 'times'
      },
      styles: {
        fontSize: 11,
        cellPadding: 4,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        font: 'times',
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 60 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' }
      }
    };

    doc.autoTable(productDetails);

    // Tổng tiền và thông tin voucher
    const summaryData = {
      startY: doc.lastAutoTable.finalY + 5,
      body: [
        ['Tổng tiền hàng:', order.tongTien?.toLocaleString('vi-VN') || '0'],
        ['Phí vận chuyển:', order.phiVanChuyen?.toLocaleString('vi-VN') || '0'],
        ['Tổng thanh toán:', order.tongTien?.toLocaleString('vi-VN') || '0']
      ],
      theme: 'plain',
      styles: { 
        fontSize: 11,
        cellPadding: 4,
        font: 'times',
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 160, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 30, halign: 'right', fontStyle: 'bold'}
      }
    };

    // Thêm thông tin voucher nếu có
    if (order.voucher) {
      summaryData.body.push(
        ['Giam gia:', `${(order.voucher.phanTramApDung * 100)}%`],
        ['Tien giam toi da:', order.voucher.soTienToiDa?.toLocaleString('vi-VN')]
      );
    }

    // Thêm tổng thanh toán
    summaryData.body.push(
      ['Tong thanh toan:', order.tongTien?.toLocaleString('vi-VN') || '0']
    );

    doc.autoTable(summaryData);

    // Footer
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, doc.lastAutoTable.finalY + 10, 195, doc.lastAutoTable.finalY + 10);

    // Thông tin thời gian in
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    const currentDate = new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Ngay in: ${currentDate}`, 15, doc.lastAutoTable.finalY + 20);

    // Lời cảm ơn
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text(
      "Cam on quy khach da tin tuong va mua san pham o LAPTOP SHOP",
      105, doc.lastAutoTable.finalY + 20, { align: "center" }
    );

    // Lưu file PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`hoa_don_${order.maHoaDon}_${timestamp}.pdf`);
  };

  const handleAddImeis = async () => {
    try {
      // Kiểm tra số lượng IMEI đã chọn cho mỗi sản phẩm
      for (const detail of orderDetails) {
        const selectedImeiList = selectedImeis[detail.id] || [];
        if (selectedImeiList.length !== detail.soLuong) {
          toast.error(`Vui lòng chọn đủ ${detail.soLuong} IMEI cho sản phẩm ${detail.tenSanPham}`, {
            position: "top-right",
            autoClose: 3000
          });
          return;
        }
      }

      // Format dữ liệu theo yêu cầu API
      const requestData = {
        username: userInfo.username,
        listImei: []
      };

      // Tạo danh sách IMEI theo format mới
      for (const spctId in selectedImeis) {
        const selectedImeiIds = selectedImeis[spctId];
        const imeis = availableImeis[spctId].filter(imei => selectedImeiIds.includes(imei.id));
        
        imeis.forEach(imei => {
          requestData.listImei.push({
            id: imei.id,
            imei: imei.imei,
            spct: {
              id: parseInt(spctId)
            }
          });
        });
      }

      const response = await fetch(`http://localhost:8080/rest/hoa_don/xac-nhan/${selectedOrder.maHoaDon}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error('Failed to update order');

      toast.success('Cập nhật IMEI thành công', {
        position: "top-right",
        autoClose: 2000
      });

      setShowImeiModal(false);
      setSelectedImeis({});
      
      // Refresh order list
      const updatedOrders = orders.map(order => 
        order.maHoaDon === selectedOrder.maHoaDon 
          ? {...order, trangThai: 2}
          : order
      );
      setOrders(updatedOrders);

    } catch (error) {
      console.error('Error updating IMEIs:', error);
      toast.error('Không thể cập nhật IMEI', {
        position: "top-right",
        autoClose: 3000
      });
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            Xuất Excel
          </button>
        </div>
        
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
                      ${order.trangThai === 0 ? 'bg-red-100 text-red-800' : 
                        order.trangThai === 1 ? 'bg-yellow-100 text-yellow-800' :
                        order.trangThai === 2 ? 'bg-blue-100 text-blue-800' :
                        order.trangThai === 3 ? 'bg-indigo-100 text-indigo-800' :
                        order.trangThai === 4 ? 'bg-purple-100 text-purple-800' :
                        order.trangThai === 5 ? 'bg-pink-100 text-pink-800' :
                        order.trangThai === 6 ? 'bg-green-100 text-green-800' :
                        order.trangThai === 7 ? 'bg-emerald-100 text-emerald-800' :
                        order.trangThai === 8 ? 'bg-orange-100 text-orange-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {order.trangThai === 0 ? 'Đã hủy' :
                       order.trangThai === 1 ? 'Chờ xác nhận' :
                       order.trangThai === 2 ? 'Xác nhận đơn hàng' :
                       order.trangThai === 3 ? 'Đơn vị vận chuyển đang giao' :
                       order.trangThai === 4 ? 'Đang được giao tới bạn' :
                       order.trangThai === 5 ? 'Đơn hàng đã được giao thành công' :
                       order.trangThai === 6 ? 'Xác nhận giao hàng thành công' :
                       order.trangThai === 7 ? 'Hoàn thành đơn hàng' :
                       order.trangThai === 8 ? 'Yêu cầu hoàn trả hàng' : 
                       'Không xác định'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.trangThai === 1 ? (
                      <span className="text-yellow-600 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Cần thêm IMEI
                      </span>
                    ) : ![0, 7, 8].includes(order.trangThai) && (
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Cập nhật trạng thái đơn hàng</h2>
                <div className="space-y-4">
                  {selectedOrder && !showReasonInput && (
                    <>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={`status-${selectedOrder.trangThai + 1}`}
                          name="status"
                          value={selectedOrder.trangThai + 1}
                          checked={selectedStatus === selectedOrder.trangThai + 1}
                          onChange={(e) => setSelectedStatus(Number(e.target.value))}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <label htmlFor={`status-${selectedOrder.trangThai + 1}`} className="text-gray-700">
                          {selectedOrder.trangThai === 1 && "Xác nhận đơn hàng"}
                          {selectedOrder.trangThai === 2 && "Bàn giao cho đơn vị vận chuyển"}
                          {selectedOrder.trangThai === 3 && "Đang giao tới khách hàng"}
                          {selectedOrder.trangThai === 4 && "Đã giao hàng thành công"}
                          {selectedOrder.trangThai === 5 && "Khách hàng xác nhận nhận hàng"}
                          {selectedOrder.trangThai === 6 && "Hoàn thành đơn hàng"}
                        </label>
                      </div>

                      {[1, 2, 3].includes(selectedOrder.trangThai) && (
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="status-0"
                            name="status"
                            value={0}
                            checked={selectedStatus === 0}
                            onChange={(e) => setSelectedStatus(Number(e.target.value))}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <label htmlFor="status-0" className="text-gray-700">Hủy đơn hàng</label>
                        </div>
                      )}

                      <div className="space-y-2 mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Lý do cập nhật
                        </label>
                        <textarea
                          value={updateReason}
                          onChange={(e) => setUpdateReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                          placeholder="Vui lòng nhập lý do cập nhật trạng thái..."
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      handleCloseModal();
                      setShowReasonInput(false);
                      setUpdateReason('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={!updateReason}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors
                      ${!updateReason ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedOrder && orderDetails.length > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg w-4/5 max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder.id}</h2>
                    <button 
                      onClick={() => generatePDF(selectedOrder, orderDetails)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      In hóa đơn
                    </button>
                  </div>
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
                      <p className="text-gray-700">
                        <span className="font-semibold">Họ tên:</span> {orderData?.thongTinTaiKhoan?.hoTen}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Số điện thoại:</span> {orderData?.thongTinTaiKhoan?.soDienThoai}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {orderData?.thongTinTaiKhoan?.email}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Thông tin đơn hàng</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700"><span className="font-semibold">Mã đơn hàng:</span> {selectedOrder.maHoaDon}</p>
                      <p className="text-gray-700"><span className="font-semibold">Thời gian đặt:</span> {
                        new Date(...selectedOrder.thoiGianLapHoaDon).toLocaleString('vi-VN')
                      }</p>
                      <p className="text-gray-700"><span className="font-semibold">Cửa hàng:</span> {selectedOrder.tenCuaHang}</p>
                      <p className="text-gray-700"><span className="font-semibold">Địa chỉ nhận hàng:</span> {selectedOrder.diaChiNhanHang}</p>
                      <p className="text-gray-700"><span className="font-semibold">Hình thức thanh toán:</span> {selectedOrder.hinhThucThanhToan}</p>
                      <p className="text-gray-700"><span className="font-semibold">Trạng thái thanh toán:</span> {
                        selectedOrder.trangThaiThanhToan === 1 ? 'Chưa thanh toán' : 
                        selectedOrder.trangThaiThanhToan === 2 ? 'Đã thanh toán' : 'N/A'
                      }</p>
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sản phẩm</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Số lượng</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">IMEI</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn giá</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={detail.hinhAnhMinhHoa || 'https://placehold.co/80x80'} 
                                alt={detail.tenSanPham}
                                className="w-20 h-20 object-contain rounded border border-gray-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/80x80';
                                }}
                              />
                              <div>
                                <p className="font-bold text-gray-900">{detail.tenSanPham}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{detail.soLuong}</td>
                          <td className="px-6 py-4">
                            {detail.listImei?.map((imei, idx) => (
                              <div key={idx} className="text-sm text-gray-600">{imei}</div>
                            ))}
                          </td>
                          <td className="px-6 py-4">{detail.donGia?.toLocaleString()}₫</td>
                          <td className="px-6 py-4">{(detail.soLuong * detail.donGia)?.toLocaleString()}₫</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4 text-right font-bold">Tổng tiền hàng:</td>
                        <td className="px-6 py-4 font-bold">{selectedOrder.tongTien?.toLocaleString()}₫</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4 text-right font-bold">Phí vận chuyển:</td>
                        <td className="px-6 py-4 font-bold">{selectedOrder.phiVanChuyen?.toLocaleString()}₫</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4 text-right font-bold text-lg">Tổng thanh toán:</td>
                        <td className="px-6 py-4 font-bold text-lg text-blue-600">
                          {(selectedOrder.tongTien + selectedOrder.phiVanChuyen)?.toLocaleString()}₫
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-6 text-gray-800">Lịch sử đơn hàng</h3>
                  <div className="relative">
                    {timelineData.map((item, index) => (
                      <div key={index} className="mb-8 flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`rounded-full h-8 w-8 flex items-center justify-center
                            ${item.trangThai === 0 ? 'bg-red-100 text-red-800' :
                              item.trangThai === 1 ? 'bg-yellow-100 text-yellow-800' :
                              item.trangThai === 2 ? 'bg-blue-100 text-blue-800' :
                              item.trangThai === 3 ? 'bg-indigo-100 text-indigo-800' :
                              item.trangThai === 4 ? 'bg-purple-100 text-purple-800' :
                              item.trangThai === 5 ? 'bg-pink-100 text-pink-800' :
                              item.trangThai === 6 ? 'bg-green-100 text-green-800' :
                              item.trangThai === 7 ? 'bg-emerald-100 text-emerald-800' :
                              item.trangThai === 8 ? 'bg-orange-100 text-orange-800' : 
                              'bg-gray-100 text-gray-800'}`}
                          >
                            <span className="text-sm font-semibold">{item.trangThai}</span>
                          </div>
                          {index < timelineData.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-200 my-2"></div>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {item.trangThai === 0 ? 'Đã hủy' :
                                 item.trangThai === 1 ? 'Chờ xác nhận' :
                                 item.trangThai === 2 ? 'Xác nhận đơn hàng' :
                                 item.trangThai === 3 ? 'Đơn vị vận chuyển đang giao' :
                                 item.trangThai === 4 ? 'Đang được giao tới bạn' :
                                 item.trangThai === 5 ? 'Đơn hàng đã được giao thành công' :
                                 item.trangThai === 6 ? 'Xác nhận giao hàng thành công' :
                                 item.trangThai === 7 ? 'Hoàn thành đơn hàng' :
                                 item.trangThai === 8 ? 'Yêu cầu hoàn trả hàng' : 
                                 'Không xác định'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Cập nhật bởi: {item.nguoiCapNhat} ({item.role})
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(item.thoiGianCapNhat).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{item.lyDo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showImeiModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg w-4/5 max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Thêm IMEI cho đơn hàng #{selectedOrder.maHoaDon}</h2>
                  <button 
                    onClick={() => setShowImeiModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {orderDetails.map((detail, index) => (
                  <div key={detail.id} className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      {detail.tenSanPham}
                      <span className="ml-2 text-sm text-gray-500">
                        (Cần chọn {detail.soLuong} IMEI)
                      </span>
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {availableImeis[detail.id]?.map((imei, imeiIndex) => (
                        <div key={imeiIndex} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`imei-${imei.id}`}
                            checked={(selectedImeis[detail.id] || []).includes(imei.id)}
                            onChange={(e) => {
                              const currentSelected = selectedImeis[detail.id] || [];
                              if (e.target.checked) {
                                if (currentSelected.length < detail.soLuong) {
                                  setSelectedImeis({
                                    ...selectedImeis,
                                    [detail.id]: [...currentSelected, imei.id]
                                  });
                                }
                              } else {
                                setSelectedImeis({
                                  ...selectedImeis,
                                  [detail.id]: currentSelected.filter(id => id !== imei.id)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`imei-${imei.id}`}>{imei.imei}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowImeiModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddImeis}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Xác nhận
                  </button>
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