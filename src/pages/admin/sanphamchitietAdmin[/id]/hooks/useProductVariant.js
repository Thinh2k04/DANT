import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const useProductVariant = () => {
  const [loading, setLoading] = useState(false);

  const updateProductVariant = async (data) => {
    try {
      setLoading(true);
      // Tạo payload từ dữ liệu hiện tại của sản phẩm
      const payload = {
        sanPham: {
          ...data.sanPham
        },
        sanPhamChiTiet: {
          ...data.sanPhamChiTiet,
          sanPham: data.sanPham,
          ram: data.sanPhamChiTiet.ram,
          oLuuTru: data.sanPhamChiTiet.oLuuTru,
          manHinh: data.sanPhamChiTiet.manHinh,
          cpu: data.sanPhamChiTiet.cpu,
          gpu: data.sanPhamChiTiet.gpu,
          mauSac: data.sanPhamChiTiet.mauSac,
          cardDoHoa: data.sanPhamChiTiet.cardDoHoa
        },
        imageUrls: data.imageUrls
      };

      const response = await axios.post(
        'http://localhost:8080/rest/spctDTO/update',
        payload
      );

      if (response.status === 200) {
        toast.success('Cập nhật sản phẩm chi tiết thành công');
        return response.data;
      }
    } catch (error) {
      console.error('Error updating product variant:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProductVariant,
    loading
  };
};

export default useProductVariant; 