import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const VoucherTable = ({ vouchers, onEdit, onDelete }) => {
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'info'; // Chưa bắt đầu
    if (now > end) return 'error'; // Đã hết hạn
    return 'success'; // Đang hoạt động
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Chưa bắt đầu';
    if (now > end) return 'Đã hết hạn';
    return 'Đang hoạt động';
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã Voucher</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="right">Giảm giá</TableCell>
            <TableCell align="right">Điều kiện</TableCell>
            <TableCell align="center">Thời gian</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vouchers.map((voucher) => (
            <TableRow key={voucher.id} hover>
              <TableCell>
                <div className="font-medium">{voucher.maVoucher}</div>
                <div className="text-sm text-gray-500">
                  Tối đa: {formatCurrency(voucher.soTienToiDa)}
                </div>
              </TableCell>
              <TableCell align="center">{voucher.soLuong}</TableCell>
              <TableCell align="right">
                {voucher.phanTramApDung ? (
                  `${voucher.phanTramApDung}%`
                ) : (
                  formatCurrency(voucher.soTienApDung)
                )}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(voucher.dieuKienApDung)}
              </TableCell>
              <TableCell align="center">
                <div className="text-sm">
                  <div>Bắt đầu: {formatDateTime(voucher.thoiGianApDung)}</div>
                  <div>Kết thúc: {formatDateTime(voucher.thoiGianHenKet)}</div>
                </div>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={getStatusText(voucher.thoiGianApDung, voucher.thoiGianHenKet)}
                  color={getStatusColor(voucher.thoiGianApDung, voucher.thoiGianHenKet)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Chỉnh sửa">
                  <IconButton onClick={() => onEdit(voucher)} color="primary" size="small">
                    <FiEdit2 />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton onClick={() => onDelete(voucher.id)} color="error" size="small">
                    <FiTrash2 />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VoucherTable; 