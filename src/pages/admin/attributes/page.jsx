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

  // Fetch sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/rest/spctDTO/getAll');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Lỗi khi tải danh sách sản phẩm');
      }
    };
    fetchProducts();
  }, []);

  // Thêm vào giỏ hàng
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

  // Xóa khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Cập nhật số lượng
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

  // Tính tổng tiền
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.donGia * item.quantity), 0);
  };

  // Xử lý thanh toán
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const orderData = {
        tttk: {
          hoten: customerInfo.hoten || "",
          soDienThoai: customerInfo.soDienThoai || "",
          email: customerInfo.email || "",
          trangThai: 1
        },
        hd: {
          thoiGianLapHoaDon: new Date().toISOString(),
          tongTien: calculateTotal(),
          hinhThucThanhToan: {
            id: 1
          },
          cuaHang: selectedStore,
          voucher: voucherInfo,
          trangThaiThanhToan: 1,
          trangThai: 1
        },
        lhdct: cart.map(item => ({
          sanPhamChiTiet: {
            id: item.id
          },
          soLuong: item.quantity,
          gia: item.donGia
        }))
      };

      const response = await axios.post('http://localhost:8080/rest/hoa_don/addHD', orderData);
      
      if (response.status === 200) {
        toast.success('Thanh toán thành công!');
        setCart([]); // Clear cart
        setCustomerInfo({ // Reset customer info
          hoten: '',
          soDienThoai: '',
          email: ''
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Có lỗi xảy ra khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm kiểm tra thông tin khách hàng
  const checkCustomerInfo = async (phoneNumber) => {
    try {
      if (phoneNumber.length === 10) {
        const response = await axios.get(`http://localhost:8080/rest/tttk/timSDT/${phoneNumber}`);
        if (response.data) {
          // Cập nhật tất cả thông tin khách hàng bao gồm họ tên
          setCustomerInfo({
            hoten: response.data.hoten || '',
            soDienThoai: response.data.soDienThoai || phoneNumber,
            email: response.data.email || ''
          });
        } else {
          // Reset form nếu không tìm thấy khách hàng
          setCustomerInfo({
            hoten: '',
            soDienThoai: phoneNumber,
            email: ''
          });
        }
      }
    } catch (error) {
      console.error('Error checking customer:', error);
    }
  };

  // Thêm useEffect để fetch danh sách cửa hàng
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/rest/cuaHang/getAll');
        setStores(response.data);
        if (response.data.length > 0) {
          setSelectedStore(response.data[0]); // Mặc định chọn cửa hàng đầu tiên
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Lỗi khi tải danh sách cửa hàng');
      }
    };
    fetchStores();
  }, []);

  // Thêm hàm check voucher
  const checkVoucher = async (code) => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/voucher/${code}`);
      if (response.data) {
        setVoucherInfo(response.data);
        toast.success('Áp dụng voucher thành công!');
      }
    } catch (error) {
      toast.error('Voucher không hợp lệ hoặc đã hết hạn');
      setVoucherInfo(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <NavbarAdmin />
      <ToastContainer />
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BiLaptop className="text-blue-600" />
            Bán Hàng Tại Quầy
          </h1>
          <p className="text-gray-500 mt-1">Quản lý bán laptop trực tiếp tại cửa hàng</p>
        </div>

        {/* Content Area */}
        <div className="flex h-[calc(100vh-116px)]">
          {/* Product Section */}
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

          {/* Cart Section - Fixed width */}
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