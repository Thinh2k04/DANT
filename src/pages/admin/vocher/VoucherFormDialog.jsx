import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Grid
} from '@mui/material';
import { FiX } from 'react-icons/fi';

const VoucherFormDialog = ({ 
  open, 
  onClose, 
  formData, 
  selectedVoucher, 
  onInputChange, 
  onSubmit 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {selectedVoucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FiX />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="maVoucher"
                label="Mã Voucher"
                value={formData.maVoucher}
                onChange={onInputChange}
                helperText="Ví dụ: SUMMER2024"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="soLuong"
                label="Số Lượng"
                type="number"
                value={formData.soLuong}
                onChange={onInputChange}
                inputProps={{ min: 1 }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="thoiGianApDung"
                label="Thời Gian Bắt Đầu"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={formData.thoiGianApDung}
                onChange={onInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="thoiGianHenKet"
                label="Thời Gian Kết Thúc"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={formData.thoiGianHenKet}
                onChange={onInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="soTienToiDa"
                label="Số Tiền Tối Đa (VNĐ)"
                type="number"
                value={formData.soTienToiDa}
                onChange={onInputChange}
                inputProps={{ min: 0 }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="dieuKienApDung"
                label="Điều Kiện Áp Dụng (VNĐ)"
                type="number"
                value={formData.dieuKienApDung}
                onChange={onInputChange}
                inputProps={{ min: 0 }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="soTienApDung"
                label="Số Tiền Giảm (VNĐ)"
                type="number"
                value={formData.soTienApDung}
                onChange={onInputChange}
                inputProps={{ min: 0 }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="inherit"
        >
          Hủy
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained"
          sx={{ 
            minWidth: 100,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          {selectedVoucher ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherFormDialog; 