// Import các thư viện cần thiết
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiUser, FiSearch, FiPackage } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';

const Navbar = () => {
  // Khởi tạo các state và hook cần thiết
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrollText, setScrollText] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState({name: ''});

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setIsAuthenticated(true);
      setUser({name: username});
    }
  }, []);

  // Xử lý hiệu ứng chữ chạy cho banner
  useEffect(() => {
    const text = "🔥 Siêu sale laptop - Giảm giá đến 50% - Số lượng có hạn 🔥                                                                                                ";
    let position = 0;
    const speed = 200;

    const animate = () => {
      const shiftedText = text.substring(position) + text.substring(0, position);
      setScrollText(shiftedText);
      position = (position + 1) % text.length;
    };

    const interval = setInterval(animate, speed);
    return () => clearInterval(interval);
  }, []);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Hàm thay đổi ngôn ngữ
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="w-full">
      {/* Banner chạy chữ ở trên cùng */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4">
        <div className="container mx-auto">
          <div className="overflow-hidden">
            <div className="text-sm font-medium whitespace-nowrap animate-scroll">
              {scrollText}
            </div>
          </div>
        </div>
      </div>

      {/* Thanh điều hướng chính */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo và điều hướng chính */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440677/u9hh2q6oqqeqeaewwnvl.png" 
                  alt="logo" 
                  className="w-8 h-8"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                  AINO
                </span>
              </Link>

              {/* Menu điều hướng */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  to="/track-order" 
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiPackage className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('searchOrder')}</span>
                </Link>
                <Link 
                  to="/accessories" 
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <HiOutlineFire className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('hotDeals')}</span>
                </Link>
              </nav>
            </div>

            {/* Các nút thao tác bên phải */}
            <div className="flex items-center gap-4">
              {/* Giỏ hàng */}
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Phần xác thực người dùng */}
              {localStorage.getItem('username') ? (
                <div className="flex items-center gap-2">
                  {/* <img
                    src="https://ui-avatars.com/api/?name=User"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  /> */}
                  <Link 
                    to="/profile"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {localStorage.getItem('username')}
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiUser className="w-6 h-6" />
                  <span className="text-sm font-medium hidden md:inline">
                    {t('login')}
                  </span>
                </Link>
              )}


              {/* Chuyển đổi ngôn ngữ */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('vi')}
                  className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
                    i18n.language === 'vi'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  VI
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
