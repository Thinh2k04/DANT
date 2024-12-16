import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const BanHangTaiQuay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    hoTen: '',
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
          hoTen: customerInfo.hoTen || "",
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
          hoTen: '',
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
      if (phoneNumber.length >= 3) { // Chỉ tìm kiếm khi nhập ít nhất 3 số
        const response = await axios.get(`http://localhost:8080/rest/tttk/search/${phoneNumber}`);
        setCustomerSuggestions(response.data);
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
      hoTen: customer.hoTen,
      soDienThoai: customer.soDienThoai,
      email: customer.email
    });
    setCustomerSuggestions([]); // Đóng danh sách gợi ý
  };

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <ToastContainer />
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bán hàng tại quầy</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 pr-4 py-2 border rounded-lg w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              {products
                .filter(product => 
                  product.tenSanPhamChiTiet.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow">
                    <img 
                      src={product.hinhAnhMinhHoa} 
                      alt={product.tenSanPhamChiTiet} 
                      className="w-full h-40 object-cover mb-4 rounded"
                    />
                    <h3 className="font-semibold mb-2">{product.tenSanPhamChiTiet}</h3>
                    <p className="text-gray-600 mb-2">{product.donGia.toLocaleString()} VNĐ</p>
                    <p className="text-sm text-gray-500 mb-3">Còn {product.soLuong} sản phẩm</p>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.soLuong === 0}
                      className={`w-full py-2 rounded text-white flex items-center justify-center gap-2
                        ${product.soLuong === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      <FiPlus />
                      {product.soLuong === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>

            {/* Thông tin khách hàng */}
            <div className="mb-4 pb-4 border-b relative">
              <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={customerInfo.soDienThoai}
                    onChange={(e) => {
                      setCustomerInfo({...customerInfo, soDienThoai: e.target.value});
                      checkCustomerInfo(e.target.value);
                    }}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {customerSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                      {customerSuggestions.map((customer, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div>{customer.hoTen}</div>
                          <div className="text-sm text-gray-600">{customer.soDienThoai}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Họ tên khách hàng"
                  value={customerInfo.hoTen}
                  onChange={(e) => setCustomerInfo({...customerInfo, hoTen: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Danh sách sản phẩm trong giỏ */}
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h3 className="font-medium">{item.tenSanPhamChiTiet}</h3>
                  <p className="text-gray-600">{item.donGia.toLocaleString()} VNĐ</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max={item.soLuong}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                    className="w-16 px-2 py-1 border rounded mr-2"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Tổng tiền:</span>
                <span className="font-bold">{calculateTotal().toLocaleString()} VNĐ</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || loading}
                className={`w-full py-3 rounded text-white
                  ${cart.length === 0 || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'}`}
              >
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