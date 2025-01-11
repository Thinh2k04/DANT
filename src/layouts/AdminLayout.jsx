import React from 'react';
import NavbarAdmin from '../pages/admin/Navbar/NavbarAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-sm bg-white/75 shadow-sm">
          <NavbarAdmin />
        </div>
      </div>
      <main className="pt-20 px-4 md:px-6 lg:px-8 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto py-6 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 