import React from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

const VoucherUpdate = ({ 
  open, 
  onClose, 
  voucher, 
  onSuccess,
  showMessage 
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        id: voucher.id,
        maVoucher: e.target.maVoucher.value,
        soLuong: parseInt(e.target.soLuong.value),
        thoiGianHenKet: e.target.thoiGianHenKet.value,
        thoiGianApDung: e.target.thoiGianApDung.value,
        soTienToiDa: parseFloat(e.target.soTienToiDa.value),
        dieuKienApDung: parseFloat(e.target.dieuKienApDung.value),
        soTienApDung: parseFloat(e.target.soTienApDung.value),
        phanTramApDung: null,
        trangThai: voucher.trangThai
      };

      // Validation
      if (!formData.maVoucher) {
        showMessage('Vui lòng nhập mã voucher', 'error');
        return;
      }
      if (formData.soLuong <= 0) {
        showMessage('Số lượng phải lớn hơn 0', 'error');
        return;
      }
      // ... other validations

      await axios.put('http://localhost:8080/rest/voucher/update', formData);
      showMessage('Cập nhật voucher thành công');
      onSuccess();
      onClose();
    } catch (error) {
      showMessage('Có lỗi xảy ra: ' + error.message, 'error');
    }
  };

  if (!voucher) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Cập Nhật Voucher</DialogTitle>
      <DialogContent sx={{ width: 500, p: 3 }}>
        <Box component="form" id="update-form" onSubmit={handleSubmit} noValidate>
          <TextField
            required
            margin="normal"
            name="maVoucher"
            label="Mã Voucher"
            fullWidth
            defaultValue={voucher.maVoucher}
          />
          <TextField
            required
            margin="normal"
            name="soLuong"
            label="Số Lượng"
            type="number"
            fullWidth
            defaultValue={voucher.soLuong}
            inputProps={{ min: 1 }}
          />
          <TextField
            required
            margin="normal"
            name="thoiGianApDung"
            label="Thời Gian Bắt Đầu"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            defaultValue={voucher.thoiGianApDung?.split('+')[0]}
          />
          <TextField
            required
            margin="normal"
            name="thoiGianHenKet"
            label="Thời Gian Kết Thúc"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            defaultValue={voucher.thoiGianHenKet?.split('+')[0]}
          />
          <TextField
            required
            margin="normal"
            name="soTienToiDa"
            label="Số Tiền Tối Đa (VNĐ)"
            type="number"
            fullWidth
            defaultValue={voucher.soTienToiDa}
            inputProps={{ min: 0 }}
          />
          <TextField
            required
            margin="normal"
            name="dieuKienApDung"
            label="Điều Kiện Áp Dụng (VNĐ)"
            type="number"
            fullWidth
            defaultValue={voucher.dieuKienApDung}
            inputProps={{ min: 0 }}
          />
          <TextField
            required
            margin="normal"
            name="soTienApDung"
            label="Số Tiền Giảm (VNĐ)"
            type="number"
            fullWidth
            defaultValue={voucher.soTienApDung}
            inputProps={{ min: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button 
          type="submit"
          form="update-form"
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Cập Nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherUpdate; 