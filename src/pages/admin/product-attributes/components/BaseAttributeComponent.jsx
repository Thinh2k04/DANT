import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AttributeTable from './AttributeTable';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';

const BaseAttributeComponent = ({ 
  endpoint,
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
  const [isTrashView, setIsTrashView] = useState(false);

  useEffect(() => {
    fetchAttributes();
  }, [isTrashView]);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      // Thay đổi URL dựa vào loại thuộc tính và view
      let url;
      if (isTrashView) {
        switch(attributeType) {
          case 'brand':
            url = 'http://localhost:8080/rest/thuong-hieu/getThungRac';
            break;
          case 'ram':
            url = 'http://localhost:8080/rest/ram/getThungRac';
            break;
          case 'storage':
            url = 'http://localhost:8080/rest/o_luu_tru/getThungRac';
            break;
          case 'cpu':
            url = 'http://localhost:8080/rest/cpu/getThungRac';
            break;
          case 'screen':
            url = 'http://localhost:8080/rest/man_hinh/getThungRac';
            break;
          case 'gpu':
            url = 'http://localhost:8080/rest/gpu/getThungRac';
            break;
          case 'graphicsCard':
            url = 'http://localhost:8080/rest/card_do_hoa/getThungRac';
            break;
          case 'material':
            url = 'http://localhost:8080/rest/chat_lieu/getThungRac';
            break;
          case 'size':
            url = 'http://localhost:8080/rest/ktlt/getThungRac';
            break;
          case 'productType':
            url = 'http://localhost:8080/rest/loai_san_pham/getThungRac';
            break;
          case 'color':
            url = 'http://localhost:8080/rest/mau_sac/getThungRac';
            break;
          case 'supplier':
            url = 'http://localhost:8080/rest/nguon_nhap/getThungRac';
            break;
          default:
            url = fetchUrl;
        }
      } else {
        url = fetchUrl;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      // Lọc dữ liệu dựa vào view và loại thuộc tính
      if ((attributeType === 'brand' || attributeType === 'ram' || attributeType === 'storage' || 
           attributeType === 'cpu' || attributeType === 'screen' || attributeType === 'gpu' || 
           attributeType === 'graphicsCard' || attributeType === 'material' || attributeType === 'size' ||
           attributeType === 'productType' || attributeType === 'color' || attributeType === 'supplier') && !isTrashView) {
        // Chỉ hiển thị items có trạng thái = 1 trong view chính
        setAttributes(data.filter(item => item.trangThai === 1));
      } else {
        setAttributes(data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  const handleEdit = async (id) => {
    try {
      let url = '';
      let payload;
      let method = 'POST';

      // Xử lý đặc biệt cho từng loại thuộc tính
      switch(attributeType) {
        case 'brand':
          url = 'http://localhost:8080/rest/thuong-hieu/update';
          payload = {
            id: editingAttribute.id,
            ten: editingAttribute.ten,
            trangThai: editingAttribute.trangThai
          };
          break;

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
      // Lấy thông tin hiện tại của item
      const currentItem = attributes.find(attr => attr.id === id);
      if (!currentItem) {
        toast.error('Không tìm thấy dữ liệu');
        return;
      }

      let url;
      switch(attributeType) {
        case 'brand':
          url = 'http://localhost:8080/rest/thuong-hieu/update';
          break;
        case 'ram':
          url = 'http://localhost:8080/rest/ram/update';
          break;
        case 'storage':
          url = 'http://localhost:8080/rest/o_luu_tru/update';
          break;
        case 'cpu':
          url = 'http://localhost:8080/rest/cpu/update';
          break;
        case 'screen':
          url = 'http://localhost:8080/rest/man_hinh/update';
          break;
        case 'gpu':
          url = 'http://localhost:8080/rest/gpu/update';
          break;
        case 'graphicsCard':
          url = 'http://localhost:8080/rest/card_do_hoa/update';
          break;
        case 'material':
          url = 'http://localhost:8080/rest/chat_lieu/update';
          break;
        case 'size':
          url = 'http://localhost:8080/rest/ktlt/update';
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
          url = updateUrl;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentItem,
          trangThai: 1
        }),
      });

      if (!response.ok) throw new Error('Failed to restore');
      
      toast.success('Khôi phục thành công');
      fetchAttributes();
    } catch (error) {
      toast.error('Lỗi khi khôi phục');
    }
  };

  const toggleTrashView = () => {
    setIsTrashView(!isTrashView);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {!isTrashView ? (
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <FaPlus /> Thêm mới
            </button>

            {(attributeType === 'brand' || attributeType === 'ram' || attributeType === 'storage' || 
              attributeType === 'cpu' || attributeType === 'screen' || attributeType === 'gpu' || 
              attributeType === 'graphicsCard' || attributeType === 'material' || attributeType === 'size' ||
              attributeType === 'productType' || attributeType === 'color' || attributeType === 'supplier') && (
              <button
                onClick={toggleTrashView}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700"
              >
                <FaTrash /> Thùng rác
              </button>
            )}
          </>
        ) : (
          <button
            onClick={toggleTrashView}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700"
          >
            <FaArrowLeft /> Quay lại
          </button>
        )}
      </div>

      <AttributeTable 
        attributes={attributes}
        editingAttribute={editingAttribute}
        setEditingAttribute={setEditingAttribute}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        showTrash={isTrashView}
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