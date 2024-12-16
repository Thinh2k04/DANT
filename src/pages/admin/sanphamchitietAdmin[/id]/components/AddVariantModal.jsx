import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AddVariantModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit,
  cpus,
  rams,
  storages,
  gpus,
  displays,
  colors 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Thêm sản phẩm chi tiết</h2>
        <form onSubmit={onSubmit}>
          {/* Form content here - copy from original modal */}
          {/* ... */}
        </form>  
      </div>
    </div>
  );
};

export default AddVariantModal; 