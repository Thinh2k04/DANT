import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">AINO</Link>
            <nav className="flex space-x-6">
              <Link to="/track-order" className="hover:text-blue-400 transition">Tra cứu đơn hàng</Link>
              <Link to="/accessories" className="hover:text-blue-400 transition">Giảm giá SỐC</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm laptop..."
                className="px-4 py-2 rounded-full text-black w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </span>
            </div>
            
            <Link to="/cart" className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Giỏ hàng</span>
            </Link>
            
            <Link to="/login" className="hover:text-blue-400 transition">
              <i className="fas fa-user mr-2"></i>
              Đăng Nhập
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
