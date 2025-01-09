import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrollText, setScrollText] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const user = {name: ''};

  useEffect(() => {
    const text = "🔥 Siêu sale laptop - Giảm giá đến 50% - Số lượng có hạn 🔥";
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

  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <img src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736440677/u9hh2q6oqqeqeaewwnvl.png" alt="logo" className="w-10 h-10" />
            <Link to="/" className="text-2xl font-bold">AINO</Link>
            <nav className="flex space-x-6">
              <Link to="/track-order" className="hover:text-blue-400 transition">Tra cứu đơn hàng</Link>
              <Link to="/accessories" className="hover:text-blue-400 transition">Giảm giá SỐC</Link>
            </nav>
          </div>

          <div className="flex-1 mx-4 overflow-hidden">
            <div className="text-yellow-400 font-medium whitespace-nowrap">
              {scrollText}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Giỏ hàng</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 hover:text-blue-400 transition">
                <i className="fas fa-user mr-2"></i>
                <Link to="/profile">{user.name}</Link>
              </div>
            ) : (
              <Link to="/login" className="hover:text-blue-400 transition">
                <i className="fas fa-user mr-2"></i>
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
