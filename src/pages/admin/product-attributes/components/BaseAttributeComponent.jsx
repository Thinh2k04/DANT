import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AttributeTable from './AttributeTable';
import { FaPlus } from 'react-icons/fa';

const BaseAttributeComponent = ({ 
  endpoint,
  showTrash = false,
  fetchUrl,
  updateUrl,
  deleteUrl,
  addUrl,
  attributeType,
  AddModal
}) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAttributes(data);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  const handleEdit = async (id) => {
    try {
      let payload = editingAttribute;
      let url = '';
      let method = 'POST';

      // Xử lý đặc biệt cho từng loại thuộc tính
      switch(attributeType) {
        case 'ram':
          url = 'http://localhost:8080/rest/ram/update';
          payload = {
            id: editingAttribute.id,
            dungLuong: parseInt(editingAttribute.dungLuong),
            tocDo: parseInt(editingAttribute.tocDo),
            trangThai: editingAttribute.trangThai
          };
          break;

        case 'storage':
          url = 'http://localhost:8080/rest/o_luu_tru/update';
          payload = {
            id: editingAttribute.id,
            dungLuong: parseInt(editingAttribute.dungLuong),
            loaiOCung: editingAttribute.loaiOCung,
            trangThai: editingAttribute.trangThai
          };
          break;

        case 'brand':
          url = `http://localhost:8080/rest/thuong-hieu/update/${id}`;
          method = 'PUT';
          break;

        case 'cpu':
          url = 'http://localhost:8080/rest/cpu/update';
          payload = {
            ...editingAttribute,
            tocDoToiThieu: parseFloat(editingAttribute.tocDoToiThieu),
            tocDoToiDa: parseFloat(editingAttribute.tocDoToiDa),
            soNhan: parseInt(editingAttribute.soNhan),
            soLuong: parseInt(editingAttribute.soLuong),
            boNhoDem: parseInt(editingAttribute.boNhoDem)
          };
          break;

        case 'screen':
          url = 'http://localhost:8080/rest/man_hinh/update';
          payload = {
            ...editingAttribute,
            tanSoQuet: parseInt(editingAttribute.tanSoQuet),
            doSang: parseInt(editingAttribute.doSang),
            doPhuMau: parseFloat(editingAttribute.doPhuMau)
          };
          break;

        case 'gpu':
          url = 'http://localhost:8080/rest/gpu/update';
          payload = {
            ...editingAttribute,
            xungNhipToiThieu: parseInt(editingAttribute.xungNhipToiThieu),
            xungNhipToiDa: parseInt(editingAttribute.xungNhipToiDa),
            vram: parseInt(editingAttribute.vram),
            dienAp: parseInt(editingAttribute.dienAp)
          };
          break;

        case 'graphicsCard':
          url = 'http://localhost:8080/rest/card_do_hoa/update';
          break;

        case 'material':
          url = 'http://localhost:8080/rest/chat_lieu/update';
          break;

        case 'size':
          url = 'http://localhost:8080/rest/ktlt/update';
          payload = {
            ...editingAttribute,
            kichThuoc: parseFloat(editingAttribute.kichThuoc)
          };
          break;

        case 'productType':
          url = 'http://localhost:8080/rest/loai_san_pham/update';
          break;

        case 'color':
          url = 'http://localhost:8080/rest/mau_sac/update';
          break;

        case 'supplier':
          url = 'http://localhost:8080/rest/nguon_nhap/update';
          break;

        default:
          url = `${updateUrl}/${id}`;
          method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
      let url = '';
      let method = 'DELETE';

      // Xử lý đặc biệt cho từng loại thuộc tính
      switch(attributeType) {
        case 'brand':
          url = `http://localhost:8080/rest/thuong-hieu/del/${id}`;
          method = 'POST';
          break;
        case 'ram':
          url = `http://localhost:8080/rest/ram/del/${id}`;
          method = 'POST';
          break;
        case 'storage':
          url = `http://localhost:8080/rest/o_luu_tru/del/${id}`;
          method = 'POST';
          break;
        case 'cpu':
          url = `http://localhost:8080/rest/cpu/del/${id}`;
          method = 'POST';
          break;
        case 'screen':
          url = `http://localhost:8080/rest/man_hinh/del/${id}`;
          method = 'POST';
          break;
        case 'gpu':
          url = `http://localhost:8080/rest/gpu/del/${id}`;
          method = 'POST';
          break;
        case 'graphicsCard':
          url = `http://localhost:8080/rest/card_do_hoa/del/${id}`;
          method = 'POST';
          break;
        case 'material':
          url = `http://localhost:8080/rest/chat_lieu/del/${id}`;
          method = 'POST';
          break;
        case 'size':
          url = `http://localhost:8080/rest/ktlt/del/${id}`;
          method = 'POST';
          break;
        case 'productType':
          url = `http://localhost:8080/rest/loai_san_pham/del/${id}`;
          method = 'POST';
          break;
        case 'color':
          url = `http://localhost:8080/rest/mau_sac/del/${id}`;
          method = 'POST';
          break;
        case 'supplier':
          url = `http://localhost:8080/rest/nguon_nhap/del/${id}`;
          method = 'POST';
          break;
        default:
          url = `${deleteUrl}/${id}`;
      }

      const response = await fetch(url, {
        method: method,
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      toast.success('Xóa thành công');
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleRestore = async (id) => {
    try {
      let url = '';
      let method = 'POST';
      let payload = {};

      // Xử lý đặc biệt cho từng loại thuộc tính
      switch(attributeType) {
        case 'brand':
          url = `http://localhost:8080/rest/thuong-hieu/update/${id}`;
          method = 'PUT';
          payload = {
            trangThai: 1
          };
          break;
        default:
          url = `${updateUrl}/${id}`;
          method = 'PUT';
          payload = {
            ...editingAttribute,
            trangThai: 1
          };
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to restore');
      
      toast.success('Khôi phục thành công');
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi khôi phục');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa vĩnh viễn?')) return;

    try {
      let url = '';
      let method = 'DELETE';

      // Xử lý đặc biệt cho từng loại thuộc tính
      switch(attributeType) {
        case 'brand':
          url = `http://localhost:8080/rest/thuong-hieu/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'ram':
          url = `http://localhost:8080/rest/ram/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'storage':
          url = `http://localhost:8080/rest/o_luu_tru/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'cpu':
          url = `http://localhost:8080/rest/cpu/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'screen':
          url = `http://localhost:8080/rest/man_hinh/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'gpu':
          url = `http://localhost:8080/rest/gpu/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'graphicsCard':
          url = `http://localhost:8080/rest/card_do_hoa/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'material':
          url = `http://localhost:8080/rest/chat_lieu/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'size':
          url = `http://localhost:8080/rest/ktlt/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'productType':
          url = `http://localhost:8080/rest/loai_san_pham/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'color':
          url = `http://localhost:8080/rest/mau_sac/delete/permanent/${id}`;
          method = 'POST';
          break;
        case 'supplier':
          url = `http://localhost:8080/rest/nguon_nhap/delete/permanent/${id}`;
          method = 'POST';
          break;
        default:
          url = `${deleteUrl}/permanent/${id}`;
      }

      const response = await fetch(url, {
        method: method
      });

      if (!response.ok) throw new Error('Failed to delete permanently');
      
      toast.success('Đã xóa vĩnh viễn');
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi xóa vĩnh viễn');
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
        handleRestore={handleRestore}
        handlePermanentDelete={handlePermanentDelete}
        showTrash={showTrash}
        attributeType={attributeType}
      />

      <AddModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        onSuccess={fetchAttributes}
      />
    </div>
  );
};

export default BaseAttributeComponent; 