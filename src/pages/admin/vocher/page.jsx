import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Container,
} from '@mui/material';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import VoucherTable from './VoucherTable';
import VoucherFormDialog from './VoucherFormDialog';
import VoucherUpdate from './VoucherUpdate';

const VoucherPage = () => {
  const token = localStorage.getItem('Authorization'); // Lấy token từ localStorage
  const [vouchers, setVouchers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [formData, setFormData] = useState({
    maVoucher: '',
    soLuong: 0,
    thoiGianHenKet: '',
    thoiGianApDung: '',
    soTienToiDa: 0,
    dieuKienApDung: 0,
    soTienApDung: 0,
    phanTramApDung: null,
    trangThai: 1
  });
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rest/voucher/getAll', {
        headers: {
          Authorization: `${token}`
        }
      });
      setVouchers(response.data);
    } catch (error) {
      showMessage('Lỗi khi tải danh sách voucher', 'error');
    }
  };

  const handleOpenDialog = (voucher = null) => {
    if (voucher) {
      setSelectedVoucher(voucher);
      setFormData({
        id: voucher.id,
        maVoucher: voucher.maVoucher,
        soLuong: voucher.soLuong,
        thoiGianHenKet: formatDateTimeForInput(voucher.thoiGianHenKet),
        thoiGianApDung: formatDateTimeForInput(voucher.thoiGianApDung),
        soTienToiDa: voucher.soTienToiDa,
        dieuKienApDung: voucher.dieuKienApDung,
        soTienApDung: voucher.soTienApDung,
        phanTramApDung: voucher.phanTramApDung,
        trangThai: voucher.trangThai
      });
    } else {
      setSelectedVoucher(null);
      setFormData({
        maVoucher: '',
        soLuong: 0,
        thoiGianHenKet: '',
        thoiGianApDung: '',
        soTienToiDa: 0,
        dieuKienApDung: 0,
        soTienApDung: 0,
        phanTramApDung: null,
        trangThai: 1
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVoucher(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    try {
      // Validate dữ liệu
      if (!formData.maVoucher) {
        showMessage('Vui lòng nhập mã voucher', 'error');
        return;
      }
      if (formData.soLuong <= 0) {
        showMessage('Số lượng phải lớn hơn 0', 'error');
        return;
      }
      if (!formData.thoiGianApDung) {
        showMessage('Vui lòng chọn thời gian bắt đầu', 'error');
        return;
      }
      if (!formData.thoiGianHenKet) {
        showMessage('Vui lòng chọn thời gian kết thúc', 'error');
        return;
      }
      if (new Date(formData.thoiGianHenKet) <= new Date(formData.thoiGianApDung)) {
        showMessage('Thời gian kết thúc phải sau thời gian bắt đầu', 'error');
        return;
      }
      if (formData.soTienToiDa <= 0) {
        showMessage('Số tiền tối đa phải lớn hơn 0', 'error');
        return;
      }
      if (formData.dieuKienApDung <= 0) {
        showMessage('Điều kiện áp dụng phải lớn hơn 0', 'error');
        return;
      }
      if (formData.soTienApDung <= 0) {
        showMessage('Số tiền áp dụng phải lớn hơn 0', 'error');
        return;
      }

      const voucherData = {
        ...formData
      };

      if (selectedVoucher) {
        voucherData.id = selectedVoucher.id;
        await axios.put(`http://localhost:8080/rest/voucher/update`, voucherData, {
          headers: {
            Authorization: `${token}`
          }
        });
        showMessage('Cập nhật voucher thành công');
      } else {
        await axios.post('http://localhost:8080/rest/voucher/create', voucherData, {
          headers: {
            Authorization: `${token}`
          }
        });
        showMessage('Thêm voucher mới thành công');
      }
      handleCloseDialog();
      fetchVouchers();
    } catch (error) {
      showMessage('Có lỗi xảy ra: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      try {
        await axios.delete(`http://localhost:8080/rest/voucher/delete/${id}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        showMessage('Xóa voucher thành công');
        fetchVouchers();
      } catch (error) {
        showMessage('Lỗi khi xóa voucher', 'error');
      }
    }
  };

  const formatDateTimeForInput = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    return dateTimeStr.split('+')[0]; // Removes the timezone offset
  };

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setOpenUpdateDialog(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavbarAdmin />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          marginTop: '64px'
        }}
      >
        <Container maxWidth="xl">
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Quản lý Voucher
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpenDialog()}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2'
                }}
              >
                Thêm Voucher Mới
              </Button>
            </Box>

            <VoucherTable 
              vouchers={vouchers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Paper>
        </Container>

        <VoucherFormDialog
          open={openDialog}
          onClose={handleCloseDialog}
          formData={formData}
          selectedVoucher={selectedVoucher}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />

        <VoucherUpdate
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          voucher={selectedVoucher}
          onSuccess={fetchVouchers}
          showMessage={showMessage}
        />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default VoucherPage;
