import React from 'react';
import NavbarAdmin from '../pages/admin/Navbar/NavbarAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 