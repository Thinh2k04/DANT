import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { FiTrash2 } from 'react-icons/fi';
import Toast from '../../../components/Toast';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [deletedCustomers, setDeletedCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    hoTen: '',
    diaChi: '',
    soDienThoai: '',
    email: '',
    trangThai: 1
  });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/rest/tttk/getAll');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCustomers(data.filter(customer => customer.trangThai === 1));
        setDeletedCustomers(data.filter(customer => customer.trangThai === 0));
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const customerToUpdate = customers.find(customer => customer.id === id);
      if (!customerToUpdate) {
        throw new Error('Customer not found');
      }

      const updateData = {
        id: customerToUpdate.id,
        hoTen: customerToUpdate.hoTen,
        diaChi: customerToUpdate.diaChi,
        soDienThoai: customerToUpdate.soDienThoai,
        email: customerToUpdate.email,
        trangThai: 0
      };

      const response = await fetch(`http://localhost:8080/rest/tttk/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      const updatedCustomers = customers.filter(customer => customer.id !== id);
      const deletedCustomer = customers.find(customer => customer.id === id);
      
      setCustomers(updatedCustomers);
      setDeletedCustomers([...deletedCustomers, {...deletedCustomer, trangThai: 0}]);
      
      setShowDeleteConfirm(false);
      showToast('Xóa khách hàng thành công!', 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast('Có lỗi xảy ra khi xóa khách hàng!', 'error');
    }
  };

  const handleRestore = async (id) => {
    try {
      const customerToRestore = deletedCustomers.find(customer => customer.id === id);
      if (!customerToRestore) {
        throw new Error('Customer not found');
      }

      const updateData = {
        id: customerToRestore.id,
        hoTen: customerToRestore.hoTen,
        diaChi: customerToRestore.diaChi,
        soDienThoai: customerToRestore.soDienThoai,
        email: customerToRestore.email,
        trangThai: 1
      };

      const response = await fetch(`http://localhost:8080/rest/tttk/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to restore customer');
      }

      const restoredCustomer = deletedCustomers.find(customer => customer.id === id);
      const updatedDeletedCustomers = deletedCustomers.filter(customer => customer.id !== id);
      
      setDeletedCustomers(updatedDeletedCustomers);
      setCustomers([...customers, {...restoredCustomer, trangThai: 1}]);

      showToast('Khôi phục khách hàng thành công!', 'success');
    } catch (error) {
      console.error('Error restoring customer:', error);
      showToast('Có lỗi xảy ra khi khôi phục khách hàng!', 'error');
    }
  };

  const checkPhoneNumberExists = (phoneNumber) => {
    return customers.some(customer => customer.soDienThoai === phoneNumber);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      if (checkPhoneNumberExists(newCustomer.soDienThoai)) {
        showToast('Số điện thoại này đã được đăng ký! Vui lòng sử dụng số điện thoại khác.', 'error');
        return;
      }

      const response = await fetch('http://localhost:8080/rest/tttk/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer)
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      const addedCustomer = await response.json();
      setCustomers([...customers, addedCustomer]);
      setShowAddForm(false);
      
      setNewCustomer({
        hoTen: '',
        diaChi: '',
        soDienThoai: '',
        email: '',
        trangThai: 1
      });

      showToast('Thêm khách hàng thành công!', 'success');
    } catch (error) {
      console.error('Error adding customer:', error);
      showToast('Có lỗi xảy ra khi thêm khách hàng. Vui lòng thử lại!', 'error');
    }
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        id: customerToEdit.id,
        hoTen: customerToEdit.hoTen,
        diaChi: customerToEdit.diaChi,
        soDienThoai: customerToEdit.soDienThoai,
        email: customerToEdit.email,
        trangThai: customerToEdit.trangThai
      };

      const response = await fetch(`http://localhost:8080/rest/tttk/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const updatedCustomer = await response.json();
      setCustomers(customers.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      ));
      setShowEditForm(false);
      setCustomerToEdit(null);

      showToast('Cập nhật thông tin khách hàng thành công!', 'success');
    } catch (error) {
      console.error('Error updating customer:', error);
      showToast('Có lỗi xảy ra khi cập nhật thông tin!', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <NavbarAdmin />
      <main className="flex-1 p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý thông tin khách hàng trong hệ thống
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm khách hàng
                </button>
                <button
                  onClick={() => setShowTrashModal(true)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Thùng rác ({deletedCustomers.length})
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4">
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Đã khóa</option>
                </select>
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Sắp xếp theo</option>
                  <option value="name">Tên</option>
                  <option value="date">Ngày tạo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">{customer.hoTen.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.hoTen}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.diaChi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.soDienThoai}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setCustomerToEdit(customer);
                              setShowEditForm(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <span className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Sửa
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setCustomerToDelete(customer.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <span className="flex items-center bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showTrashModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-3/4 max-h-[80vh] flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thùng rác</h2>
                <button
                  onClick={() => setShowTrashModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition duration-200"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b">Tên</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b">Địa chỉ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b">Số điện thoại</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deletedCustomers.map(customer => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-6 py-4 text-sm text-gray-800">{customer.hoTen}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{customer.diaChi}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{customer.soDienThoai}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRestore(customer.id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200"
                          >
                            Khôi phục
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Xác nhận xóa</h3>
              <p className="mb-6 text-gray-600">Bạn có chắc chắn muốn xóa khách hàng này?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(customerToDelete)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px]">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm khách hàng mới</h2>
              <form onSubmit={handleAddCustomer} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={newCustomer.hoTen}
                    onChange={(e) => setNewCustomer({...newCustomer, hoTen: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={newCustomer.diaChi}
                    onChange={(e) => setNewCustomer({...newCustomer, diaChi: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.soDienThoai}
                    onChange={(e) => setNewCustomer({...newCustomer, soDienThoai: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px]">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh sửa khách hàng</h2>
              <form onSubmit={handleEditCustomer} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={customerToEdit.hoTen}
                    onChange={(e) => setCustomerToEdit({...customerToEdit, hoTen: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={customerToEdit.diaChi}
                    onChange={(e) => setCustomerToEdit({...customerToEdit, diaChi: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={customerToEdit.soDienThoai}
                    onChange={(e) => setCustomerToEdit({...customerToEdit, soDienThoai: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerToEdit.email}
                    onChange={(e) => setCustomerToEdit({...customerToEdit, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setCustomerToEdit(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </main>
    </div>
  );
};

export default CustomerManagement;