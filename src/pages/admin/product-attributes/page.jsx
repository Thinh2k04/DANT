import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductAttributesPage = () => {
  const [activeTab, setActiveTab] = useState('thuongHieu');
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAttribute, setNewAttribute] = useState('');
  const [editingAttribute, setEditingAttribute] = useState(null);

  const tabs = [
    { id: 'thuongHieu', label: 'Thương hiệu', endpoint: 'thuong-hieu' },
    { id: 'ram', label: 'RAM', endpoint: 'ram' },
    { id: 'oCung', label: 'Ổ cứng', endpoint: 'o-cung' },
    { id: 'cpu', label: 'CPU', endpoint: 'cpu' },
    { id: 'manHinh', label: 'Màn hình', endpoint: 'man-hinh' }
  ];

  useEffect(() => {
    fetchAttributes();
  }, [activeTab]);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const endpoint = tabs.find(tab => tab.id === activeTab).endpoint;
      const response = await fetch(`http://localhost:8080/rest/${endpoint}/getAll`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAttributes(data);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      const endpoint = tabs.find(tab => tab.id === activeTab).endpoint;
      const response = await fetch(`http://localhost:8080/rest/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ten: newAttribute }),
      });

      if (!response.ok) throw new Error('Failed to add');
      
      toast.success('Thêm thành công');
      setShowAddModal(false);
      setNewAttribute('');
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi thêm');
    }
  };

  const handleEdit = async (id) => {
    try {
      const endpoint = tabs.find(tab => tab.id === activeTab).endpoint;
      const response = await fetch(`http://localhost:8080/rest/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ten: editingAttribute.ten }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      toast.success('Cập nhật thành công');
      setEditingAttribute(null);
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
      const endpoint = tabs.find(tab => tab.id === activeTab).endpoint;
      const response = await fetch(`http://localhost:8080/rest/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      toast.success('Xóa thành công');
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Quản lý thuộc tính sản phẩm</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <FaPlus /> Thêm mới
          </button>

          {/* Attributes Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attributes.map((attr) => (
                  <tr key={attr.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{attr.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingAttribute?.id === attr.id ? (
                        <input
                          type="text"
                          value={editingAttribute.ten}
                          onChange={(e) => setEditingAttribute({...editingAttribute, ten: e.target.value})}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        attr.ten
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingAttribute?.id === attr.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(attr.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingAttribute(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingAttribute(attr)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(attr.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Thêm {tabs.find(tab => tab.id === activeTab).label}</h2>
            <input
              type="text"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder={`Nhập tên ${tabs.find(tab => tab.id === activeTab).label}`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductAttributesPage;
