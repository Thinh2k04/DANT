import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiTag, FiLogOut } from 'react-icons/fi';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const username = localStorage.getItem("sub");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("sub");
    navigate("/login");
  };

  const navItems = [
    { path: '/admin', icon: FiHome, label: 'Thống kê' },
    { path: '/admin/attributes', icon: FiTag, label: 'Bán hàng tại quầy' },
    { 
      path: '/admin/products', 
      icon: FiBox, 
      label: 'Quản lý sản phẩm',
      children: [
        { path: '/admin/products', icon: FiBox, label: 'Danh sách sản phẩm' },
        { path: '/admin/product-attributes', icon: FiTag, label: 'Quản lý thuộc tính' }
      ]
    },
    { path: '/admin/orders', icon: FiShoppingCart, label: 'Quản lý đơn hàng' },
    { path: '/admin/customers', icon: FiUsers, label: 'Quản lý khách hàng' },
    { path: '/admin/account', icon: FiUsers, label: 'Quản lý tài khoản' },
    {path: '/admin/employees', icon: FiUsers, label: 'Quản lý nhân viên'}
  ];

  return (
    <nav className="bg-gray-800 text-white min-h-screen w-64 md:w-1/5">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16">
          <Link to="/admin" className="flex-shrink-0">
            <img className="h-8 w-8" src="/path-to-your-logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <div key={item.path}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                      className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.path
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <item.icon className="inline-block mr-2" />
                      {item.label}
                    </button>
                    {isProductMenuOpen && item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center px-4 py-2 pl-10 rounded-md text-sm font-medium ${
                          location.pathname === child.path
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <child.icon className="inline-block mr-2" />
                        {child.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="inline-block mr-2" />
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center p-3 border-t border-gray-700">
          <img
            className="h-10 w-10 rounded-full"
            src="https://baothainguyen.vn/file//oldimage/baothainguyen/UserFiles/image/hiv(41).jpg"
            alt="User avatar"
          />
          <span className="ml-2">{username}</span>
          <button
            onClick={handleLogout}
            className="ml-auto px-3 py-1 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FiLogOut className="inline-block mr-1" />
            Đăng xuất
          </button>
        </div>
      </div>
      <button 
        className="md:hidden p-2 text-gray-300 hover:bg-gray-700" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? 'Ẩn menu' : 'Hiện menu'}
      </button>
      {isMobileMenuOpen && (
        <div className="flex flex-col space-y-1 md:hidden">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                    className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="inline-block mr-2" />
                    {item.label}
                  </button>
                  {isProductMenuOpen && item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`flex items-center px-4 py-2 pl-10 rounded-md text-sm font-medium ${
                        location.pathname === child.path
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <child.icon className="inline-block mr-2" />
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="inline-block mr-2" />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;