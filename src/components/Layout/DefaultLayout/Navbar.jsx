import React from 'react';
 import { Link } from 'react-router-dom';
 const Navbar = () => {
    return (
        <header className="bg-green-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <nav className="flex space-x-4">
            <Link to="/">Trang Chủ</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <input
                icon="fa-solid fa-magnifying-glass"
                type="text"
                placeholder="Tìm kiếm"
                className="px-3 py-1 rounded-full text-black"
                // value={searchTerm}
                // onChange={handleSearch}
              />
                 <Link to="/cart" className="text-white mt-2 px-4 py-2 bg-green-500 rounded-md inline-block text-center">
                           Giỏ Hàng
                       </Link>
            </div>
          </div>
        </div>
      </header>
    )
 };
 export default Navbar
 

