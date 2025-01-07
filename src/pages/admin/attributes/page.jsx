import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { FiSearch, FiPlus, FiShoppingCart, FiTrash2, FiUser, FiCreditCard } from 'react-icons/fi';
import { BiLaptop, BiMemoryCard, BiChip, BiDesktop } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

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
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

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
            id: 1 // Thanh toán tiền mặt
          },
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

      const response = await axios.put('http://localhost:8080/rest/hoa_don/addHD', orderData);
      
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
          setCustomerSuggestions([]);
        } else {
          // Reset form nếu không tìm thấy khách hàng
          setCustomerInfo({
            hoten: '',
            soDienThoai: phoneNumber,
            email: ''
          });
        }
      } else {
        setCustomerSuggestions([]);
      }
    } catch (error) {
      console.error('Error checking customer:', error);
      setCustomerSuggestions([]);
    }
  };

  // Thêm hàm xử lý khi chọn khách hàng từ gợi ý
  const handleSelectCustomer = (customer) => {
    setCustomerInfo({
      hoten: customer.hoten,
      soDienThoai: customer.soDienThoai,
      email: customer.email
    });
    setCustomerSuggestions([]); // Đóng danh sách gợi ý
  };

  return (
    <div className="min-h-screen flex bg-[#f0f2f5]">
      <NavbarAdmin />
      <ToastContainer />
      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BiLaptop className="text-blue-600" />
              Bán Hàng Tại Quầy
            </h1>
            <p className="text-gray-500 mt-2">Quản lý bán laptop trực tiếp tại cửa hàng</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Filter & Search Section */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm laptop..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
                </div>
              </div>
            </div>

            {/* Product Grid - Thay đổi thành grid 4 cột */}
            <div className="grid grid-cols-4 gap-4">
              {products
                .filter(product => 
                  product.tenSanPhamChiTiet.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(product => (
                  <div key={product.id} 
                    className="bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all duration-300">
                    <div className="relative group">
                      <img 
                        src={product.hinhAnhMinhHoa} 
                        alt={product.tenSanPhamChiTiet} 
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.soLuong === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          Hết hàng
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.soLuong === 0}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-white text-sm font-medium transition-colors
                            ${product.soLuong === 0 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                          <FiPlus size={14} />
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1 text-gray-800 line-clamp-2">
                        {product.tenSanPhamChiTiet}
                      </h3>
                      
                      <div className="space-y-1 mb-2 text-xs">
                        <div className="flex items-center text-gray-600">
                          <BiChip className="mr-1 text-blue-500" size={12} />
                          <span>Intel Core i7-1165G7</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BiMemoryCard className="mr-1 text-blue-500" size={12} />
                          <span>16GB RAM</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BiDesktop className="mr-1 text-blue-500" size={12} />
                          <span>512GB SSD</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-base font-bold text-blue-600">
                          {product.donGia.toLocaleString()}₫
                        </p>
                        <p className="text-xs text-gray-500">
                          Còn {product.soLuong} sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <FiShoppingCart className="text-2xl text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
            </div>

            {/* Customer Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiUser className="text-xl text-blue-500" />
                <h3 className="font-semibold text-lg text-gray-800">Thông tin khách hàng</h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={customerInfo.soDienThoai}
                    onChange={(e) => {
                      setCustomerInfo({...customerInfo, soDienThoTai: e.target.value});
                      checkCustomerInfo(e.target.value);
                    }}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Họ tên khách hàng"
                  value={customerInfo.hoten}
                  onChange={(e) => setCustomerInfo({...customerInfo, hoten: e.target.value})}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} 
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.tenSanPhamChiTiet}</h3>
                    <p className="text-blue-600 font-bold">{item.donGia.toLocaleString()}₫</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max={item.soLuong}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="w-20 px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
                <span className="text-3xl font-bold text-blue-600">{calculateTotal().toLocaleString()}₫</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || loading}
                className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3
                  ${cart.length === 0 || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 transform hover:-translate-y-1'}`}
              >
                <FiCreditCard size={20} />
                {loading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BanHangTaiQuay;