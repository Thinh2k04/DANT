import React from 'react';

const AddAttributeModal = ({ 
  showAddModal, 
  setShowAddModal, 
  newAttribute, 
  setNewAttribute, 
  handleAdd,
  activeTab,
  tabs 
}) => {
  if (!showAddModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Thêm {tabs.find(tab => tab.id === activeTab).label}
        </h2>
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
  );
};

export default AddAttributeModal; 