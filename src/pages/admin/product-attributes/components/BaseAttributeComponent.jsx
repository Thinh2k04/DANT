import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AttributeTable from './AttributeTable';
import AddAttributeModal from './AddAttributeModal';
import { FaPlus } from 'react-icons/fa';

const BaseAttributeComponent = ({ endpoint, label }) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAttribute, setNewAttribute] = useState('');
  const [editingAttribute, setEditingAttribute] = useState(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
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
    <div>
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
      >
        <FaPlus /> Thêm mới
      </button>

      <AttributeTable 
        attributes={attributes}
        editingAttribute={editingAttribute}
        setEditingAttribute={setEditingAttribute}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <AddAttributeModal 
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newAttribute={newAttribute}
        setNewAttribute={setNewAttribute}
        handleAdd={handleAdd}
        label={label}
      />
    </div>
  );
};

export default BaseAttributeComponent; 