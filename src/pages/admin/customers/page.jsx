import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { FiTrash2 } from 'react-icons/fi';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [deletedCustomers, setDeletedCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
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

      const response = await fetch(`http://localhost:8080/rest/tttk/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerToUpdate,
          trangThai: 0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      const updatedCustomers = customers.filter(customer => customer.id !== id);
      const deletedCustomer = customers.find(customer => customer.id === id);
      
      setCustomers(updatedCustomers);
      setDeletedCustomers([...deletedCustomers, {...deletedCustomer, trangThai: 0}]);
      
      setShowDeleteSuccess(true);
      setShowDeleteConfirm(false);
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleRestore = async (id) => {
    try {
      const customerToRestore = deletedCustomers.find(customer => customer.id === id);
      if (!customerToRestore) {
        throw new Error('Customer not found');
      }

      const response = await fetch(`http://localhost:8080/rest/tttk/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerToRestore,
          trangThai: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to restore customer');
      }

      const restoredCustomer = deletedCustomers.find(customer => customer.id === id);
      const updatedDeletedCustomers = deletedCustomers.filter(customer => customer.id !== id);
      
      setDeletedCustomers(updatedDeletedCustomers);
      setCustomers([...customers, {...restoredCustomer, trangThai: 1}]);
    } catch (error) {
      console.error('Error restoring customer:', error);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...newCustomer,
        trangThai: 1
      };
      
      const response = await fetch('http://localhost:8080/rest/tttk/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      const addedCustomer = await response.json();
      
      if (!addedCustomer || !addedCustomer.id) {
        throw new Error('Invalid response data');
      }

      setCustomers([...customers, addedCustomer]);
      setShowAddForm(false);
      setNewCustomer({
        hoTen: '',
        diaChi: '',
        soDienThoai: '',
        email: '',
        trangThai: 1
      });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/rest/tttk/update/${customerToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerToEdit)
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
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 flex items-center"
              >
                <span className="mr-2">+</span>
                Thêm khách hàng
              </button>
              <button
                onClick={() => setShowTrashModal(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 flex items-center"
              >
                <FiTrash2 className="mr-2" />
                Thùng rác ({deletedCustomers.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
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
                {customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-800">{customer.hoTen}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.diaChi}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.soDienThoai}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setCustomerToEdit(customer);
                            setShowEditForm(true);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => {
                            setCustomerToDelete(customer.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {showDeleteSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-500">
              <p className="text-green-500 font-semibold text-lg">Xóa khách hàng thành công!</p>
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
      </main>
    </div>
  );
};

export default CustomerManagement;