import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { BiLaptop } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';

const BanHangTaiQuay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    hoten: '',
    soDienThoai: '',
    email: ''
  });
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherInfo, setVoucherInfo] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/rest/spctDTO/getAll');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Lỗi khi tải danh sách sản phẩm');
        }
      }
    };
    fetchProducts();
  }, []);
  
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.soLuong) {
        toast.warning('Số lượng đã đạt giới hạn trong kho!');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.soLuong) {
      toast.warning('Số lượng vượt quá tồn kho!');
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? {...item, quantity: parseInt(newQuantity)}
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.donGia * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      if (!selectedStore) {
        toast.error('Vui lòng chọn cửa hàng');
        return;
      }

      if (!customerInfo.soDienThoai || !customerInfo.hoten) {
        toast.error('Vui lòng nhập thông tin khách hàng');
        return;
      }

      setLoading(true);

      const subtotal = calculateTotal();
      const discount = voucherInfo 
        ? (voucherInfo.phanTramApDung 
          ? (subtotal * voucherInfo.phanTramApDung / 100) 
          : voucherInfo.soTienApDung)
        : 0;
      const finalTotal = subtotal - discount;

      const now = new Date();
      const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
      const thoiGianLapHoaDon = vietnamTime.toISOString();
      console.log(thoiGianLapHoaDon);

      const orderData = {
        tttk: {
          id: "",
          hoTen: customerInfo.hoten,
          diaChi: `${selectedStore.soNha}, ${selectedStore.phuong}, ${selectedStore.huyen}, ${selectedStore.tinh}`,
          soDienThoai: customerInfo.soDienThoai,
          email: customerInfo.email || "",
          taiKhoanNguoiDung: null,
          trangThai: null
        },
        hd: {
          thoiGianLapHoaDon: thoiGianLapHoaDon,
          tongTien: finalTotal,
          phiVanChuyen: 0,
          hinhThucThanhToan: {
            id: 1
          },
          diaChiNhanHang: `${selectedStore.soNha}, ${selectedStore.phuong}, ${selectedStore.huyen}, ${selectedStore.tinh}`,
          cuaHang: {
            id: selectedStore.id,
            tinh: selectedStore.tinh,
            huyen: selectedStore.huyen,
            phuong: selectedStore.phuong,
            soNha: selectedStore.soNha,
            thoiGianMoCua: selectedStore.thoiGianMoCua,
            thoiGianDongCua: selectedStore.thoiGianDongCua,
            trangThai: 1
          },
          voucher: voucherInfo ? {
            id: voucherInfo.id,
            maVoucher: voucherInfo.maVoucher,
            giaTriGiam: voucherInfo.giaTriGiam,
            loaiGiam: voucherInfo.loaiGiam
          } : null,
          trangThaiThanhToan: 1,
          trangThai: 1
        },
        lhdct: cart.map(item => ({
          hoaDon: {
            id: ""
          },
          sanPhamChiTiet: {
            id: item.id.toString()
          },
          soLuong: item.quantity,
          gia: item.donGia
        }))
      };

      const response = await axios.post('http://localhost:8080/rest/hoa_don/addHD', orderData);
      if (response.data.success) {
        toast.success('Thanh toán thành công!');
        setCart([]);
        setCustomerInfo({
          hoten: '',
          soDienThoai: '',
          email: ''
        });
        setVoucherCode('');
        setVoucherInfo(null);
      } else {
        throw new Error(response.data.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi thanh toán');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkCustomerInfo = async (phoneNumber) => {
    try {
      if (phoneNumber.length === 10) {
        const response = await axios.get(`http://localhost:8080/rest/tttk/timSDT/${phoneNumber}`);
        if (response.data) {
          setCustomerInfo({
            hoten: response.data.hoten || '',
            soDienThoai: response.data.soDienThoai || phoneNumber,
            email: response.data.email || ''
          });
        } else {
          setCustomerInfo({
            hoten: '',
            soDienThoai: phoneNumber,
            email: ''
          });
        }
      }
    } catch (error) {
      console.error('Error checking customer:', error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/rest/cuaHang/getAll');
        setStores(response.data);
        if (response.data.length > 0) {
          setSelectedStore(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Lỗi khi tải danh sách cửa hàng');
        }
      }
    };
    
    fetchStores();
  }, []);

const checkVoucher = async (code) => {
  try {
    const response = await axios.get(`http://localhost:8080/rest/voucher/${code}`);

    if (response.data) {
      setVoucherInfo(response.data);
      toast.success('Áp dụng voucher thành công!');
    } else {
      setVoucherInfo(null);
      toast.error('Voucher không hợp lệ hoặc đã hết hạn');
    }
  } catch (error) {
    console.error('Error checking voucher:', error);
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Voucher không hợp lệ hoặc đã hết hạn');
    }
    setVoucherInfo(null);
  }
};

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <NavbarAdmin />
      <ToastContainer />
      
      <main className="flex-1 overflow-hidden">
        <div className="p-6 border-b bg-white">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BiLaptop className="text-blue-600" />
            Bán Hàng Tại Quầy
          </h1>
          <p className="text-gray-500 mt-1">Quản lý bán laptop trực tiếp tại cửa hàng</p>
        </div>

        <div className="flex h-[calc(100vh-116px)]">
          <div className="flex-1 overflow-y-auto p-6">
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            <div className="mt-6">
              <ProductGrid 
                products={products}
                searchTerm={searchTerm}
                addToCart={addToCart}
              />
            </div>
          </div>

          <div className="w-[380px] border-l bg-white overflow-y-auto">
            <ShoppingCart 
              cart={cart}
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              calculateTotal={calculateTotal}
              handleCheckout={handleCheckout}
              loading={loading}
              checkCustomerInfo={checkCustomerInfo}
              stores={stores}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              checkVoucher={checkVoucher}
              voucherInfo={voucherInfo}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BanHangTaiQuay;