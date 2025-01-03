import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AttributeTable = ({ 
  attributes, 
  editingAttribute, 
  setEditingAttribute, 
  handleEdit, 
  handleDelete 
}) => {
  return (
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
  );
};

export default AttributeTable; 