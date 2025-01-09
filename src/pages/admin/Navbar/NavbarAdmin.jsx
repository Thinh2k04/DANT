import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBox, 
  FiShoppingCart, 
  FiUsers, 
  FiTag, 
  FiLogOut, 
  FiGift,
  FiMenu,
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiGrid
} from 'react-icons/fi';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const username = localStorage.getItem("sub");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("sub");
    navigate("/login");
  };

  const navItems = [
    { 
      id: 'dashboard',
      path: '/admin', 
      icon: FiGrid, 
      label: 'Thống kê',
      badge: null
    },
    { 
      id: 'pos',
      path: '/admin/attributes', 
      icon: FiTag, 
      label: 'Bán hàng tại quầy',
      badge: null
    },
    { 
      id: 'products',
      icon: FiBox, 
      label: 'Quản lý sản phẩm',
      children: [
        { path: '/admin/products', label: 'Danh sách sản phẩm' },
        { path: '/admin/product-attributes', label: 'Quản lý thuộc tính' }
      ]
    },
    { 
      id: 'orders',
      path: '/admin/orders', 
      icon: FiShoppingCart, 
      label: 'Quản lý đơn hàng',
      badge: null
    },
    { 
      id: 'customers',
      path: '/admin/customers', 
      icon: FiUsers, 
      label: 'Quản lý khách hàng',
      badge: null
    },
    { 
      id: 'employees',
      path: '/admin/employees', 
      icon: FiUsers, 
      label: 'Quản lý nhân viên',
      badge: null
    },
    { 
      id: 'vouchers',
      path: '/admin/vouchers', 
      icon: FiGift, 
      label: 'Quản lý voucher',
      badge: null
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (id) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      <div className="fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl flex flex-col transition-all duration-300 ease-in-out"
           style={{ width: isSidebarOpen ? '16rem' : '5rem' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-indigo-950 to-indigo-900 border-b border-indigo-700">
          {isSidebarOpen && (
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="bg-white p-1 rounded">
                <img src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736320038/y3dz2geugbbnbrlq63mu.png" alt="Logo" className="h-8 w-8" />
              </div>
              <span className="font-bold text-xl text-white">LAPTOP</span>
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-transparent">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.children ? (
                  // Menu with submenu
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                        ${activeSubmenu === item.id 
                          ? 'bg-indigo-700 text-white shadow-lg' 
                          : 'text-indigo-100 hover:bg-indigo-800 hover:shadow-md'}`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} size={20} />
                        {isSidebarOpen && <span>{item.label}</span>}
                      </div>
                      {isSidebarOpen && (
                        <div className="flex items-center">
                          {activeSubmenu === item.id ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                        </div>
                      )}
                    </button>
                    
                    {/* Submenu with animation */}
                    {activeSubmenu === item.id && isSidebarOpen && (
                      <div className="ml-8 mt-2 space-y-1 transition-all duration-200">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200
                              ${isActive(child.path) 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-indigo-100 hover:bg-indigo-700 hover:shadow-sm'}`}
                          >
                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 relative
                      ${isActive(item.path) 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg' 
                        : 'text-indigo-100 hover:bg-indigo-800 hover:shadow-md'}`}
                  >
                    <item.icon className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} size={20} />
                    {isSidebarOpen && (
                      <>
                        <span>{item.label}</span>
                      </>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-indigo-700 bg-gradient-to-r from-indigo-950 to-indigo-900 p-4">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && (
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-indigo-400"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-900"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{username}</p>
                  <p className="text-xs text-indigo-300">Administrator</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 group
                ${!isSidebarOpen && 'mt-4 hover:bg-red-500'}`}
              title="Đăng xuất"
            >
              <FiLogOut 
                size={20} 
                className="group-hover:text-red-400 transition-colors duration-200" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;