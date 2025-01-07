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
  
  const isRamTab = activeTab === 'ram';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Thêm {tabs.find(tab => tab.id === activeTab).label}
        </h2>
        
        {isRamTab ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dung lượng RAM (GB)
              </label>
              <input
                type="number"
                value={newAttribute.dungLuong}
                onChange={(e) => setNewAttribute({
                  ...newAttribute,
                  dungLuong: parseInt(e.target.value)
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập dung lượng RAM"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tốc độ RAM (MHz)
              </label>
              <input
                type="number"
                value={newAttribute.tocDo}
                onChange={(e) => setNewAttribute({
                  ...newAttribute,
                  tocDo: parseInt(e.target.value)
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tốc độ RAM"
                min="1"
              />
            </div>
          </>
        ) : (
          <input
            type="text"
            value={newAttribute.ten || ''}
            onChange={(e) => setNewAttribute({ ten: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder={`Nhập tên ${tabs.find(tab => tab.id === activeTab).label}`}
          />
        )}
        
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
            disabled={isRamTab && (!newAttribute.dungLuong || !newAttribute.tocDo)}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAttributeModal; 