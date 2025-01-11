import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttributeTable from './components/AttributeTable';
import AddRamModal from './components/AddRamModal';
import AddAttributeModal from './components/AddAttributeModal';
import AddBrandModal from './components/AddBrandModal';
import EditBrandModal from './components/EditBrandModal';
import EditRamModal from './components/EditRamModal';
import AddStorageModal from './components/AddStorageModal';
import AddCpuModal from './components/AddCpuModal';
import EditCpuModal from './components/EditCpuModal';
import AddGpuModal from './components/AddGpuModal';
import EditGpuModal from './components/EditGpuModal';
import AddMaterialModal from './components/AddMaterialModal';
import EditMaterialModal from './components/EditMaterialModal';
import AddSizeModal from './components/AddSizeModal';
import EditSizeModal from './components/EditSizeModal';
import AddProductTypeModal from './components/AddProductTypeModal';
import AddColorModal from './components/AddColorModal';
import AddSupplierModal from './components/AddSupplierModal';
import AddScreenModal from './components/AddScreenModal';
import EditScreenModal from './components/EditScreenModal';
import AddGraphicsCardModal from './components/AddGraphicsCardModal';
import EditGraphicsCardModal from './components/EditGraphicsCardModal';
import EditProductTypeModal from './components/EditProductTypeModal';
import EditColorModal from './components/EditColorModal';
import EditSupplierModal from './components/EditSupplierModal';
import AttributeTab from './components/AttributeTab';

const ProductAttributesPage = () => {
  const [activeTab, setActiveTab] = useState('thuongHieu');
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);

  const tabs = [
    { id: 'thuongHieu', label: 'Thương hiệu', endpoint: 'thuong-hieu' },
    { id: 'ram', label: 'RAM', endpoint: 'ram' },
    { id: 'oCung', label: 'Ổ cứng', endpoint: 'o_luu_tru' },
    { id: 'cpu', label: 'CPU', endpoint: 'cpu' },
    { id: 'manHinh', label: 'Màn hình', endpoint: 'man_hinh' },
    { id: 'gpu', label: 'GPU', endpoint: 'gpu' },
    { id: 'cardManHinh', label: 'Card màn hình', endpoint: 'card_do_hoa' },
    { id: 'chatLieu', label: 'Chất liệu', endpoint: 'chat_lieu' },
    { id: 'kichThuoc', label: 'Kích thước', endpoint: 'ktlt' },
    {id: 'loaisanpham', label: 'Loại sản phẩm', endpoint: 'loai_san_pham'},
    {id: 'mausac', label: 'Màu sắc', endpoint: 'mau_sac'},
    {id: 'nguon', label: 'Nguồn', endpoint: 'nguon_nhap'}
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

  const handleEdit = async (id) => {
    try {
      const endpoint = tabs.find(tab => tab.id === activeTab).endpoint;
      
      if (activeTab === 'kichThuoc') {
        const payload = {
          ...editingAttribute,
          kichThuoc: parseFloat(editingAttribute.kichThuoc)
        };

        const response = await fetch(`http://localhost:8080/rest/ktlt/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'oCung') {
        const payload = {
          id: editingAttribute.id,
          dungLuong: editingAttribute.dungLuong,
          loaiOCung: editingAttribute.loaiOCung,
          trangThai: null
        };

        const response = await fetch(`http://localhost:8080/rest/${endpoint}/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'cpu') {
        const payload = {
          ...editingAttribute,
          tocDoToiThieu: parseFloat(editingAttribute.tocDoToiThieu),
          tocDoToiDa: parseFloat(editingAttribute.tocDoToiDa),
          soNhan: parseInt(editingAttribute.soNhan),
          soLuong: parseInt(editingAttribute.soLuong),
          boNhoDem: parseInt(editingAttribute.boNhoDem)
        };

        const response = await fetch(`http://localhost:8080/rest/${endpoint}/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'gpu') {
        const payload = {
          ...editingAttribute,
          xungNhipToiThieu: parseInt(editingAttribute.xungNhipToiThieu),
          xungNhipToiDa: parseInt(editingAttribute.xungNhipToiDa),
          vram: parseInt(editingAttribute.vram),
          dienAp: parseInt(editingAttribute.dienAp)
        };

        const response = await fetch(`http://localhost:8080/rest/${endpoint}/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'manHinh') {
        const payload = {
          ...editingAttribute,
          tanSoQuet: parseInt(editingAttribute.tanSoQuet),
          doSang: parseInt(editingAttribute.doSang),
          doPhuMau: parseFloat(editingAttribute.doPhuMau)
        };

        const response = await fetch(`http://localhost:8080/rest/man_hinh/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'cardManHinh') {
        const response = await fetch(`http://localhost:8080/rest/card_do_hoa/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAttribute),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'chatLieu') {
        const response = await fetch(`http://localhost:8080/rest/chat_lieu/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAttribute),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'loaisanpham') {
        const response = await fetch(`http://localhost:8080/rest/loai_san_pham/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAttribute),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'mausac') {
        const response = await fetch(`http://localhost:8080/rest/mau_sac/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAttribute),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      } else if (activeTab === 'nguon') {
        const response = await fetch(`http://localhost:8080/rest/nguon_nhap/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAttribute),
        });

        if (!response.ok) throw new Error('Failed to update');
        
        toast.success('Cập nhật thành công');
        setEditingAttribute(null);
        fetchAttributes();
      }
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

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <NavbarAdmin />
      <main className="flex-1 p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Thuộc tính sản phẩm</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý các thuộc tính của sản phẩm trong hệ thống
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <AttributeTab 
              tabs={tabs} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
            />

            {/* Content Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm thuộc tính..."
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
                <div className="ml-4">
                  <button
                    onClick={handleAddClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm mới
                  </button>
                </div>
              </div>

              <AttributeTable
                attributes={attributes}
                editingAttribute={editingAttribute}
                setEditingAttribute={setEditingAttribute}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {activeTab === 'loaisanpham' ? (
          <AddProductTypeModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'kichThuoc' ? (
          <AddSizeModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'chatLieu' ? (
          <AddMaterialModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'ram' ? (
          <AddRamModal 
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'thuongHieu' ? (
          <AddBrandModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'oCung' ? (
          <AddStorageModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'cpu' ? (
          <AddCpuModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'gpu' ? (
          <AddGpuModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'mausac' ? (
          <AddColorModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'nguon' ? (
          <AddSupplierModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'manHinh' ? (
          <AddScreenModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : activeTab === 'cardManHinh' ? (
          <AddGraphicsCardModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSuccess={fetchAttributes}
          />
        ) : (
          <AddAttributeModal 
            showAddModal={showAddModal}
            setShowModal={setShowAddModal}
            activeTab={activeTab}
            tabs={tabs}
          />
        )}

        {/* Add EditRamModal */}
        {activeTab === 'ram' && (
          <EditRamModal
            editingRam={editingAttribute}
            setEditingRam={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditBrandModal */}
        {activeTab === 'thuongHieu' && (
          <EditBrandModal
            editingBrand={editingAttribute}
            setEditingBrand={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditCpuModal */}
        {activeTab === 'cpu' && (
          <EditCpuModal
            editingCpu={editingAttribute}
            setEditingCpu={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditGpuModal */}
        {activeTab === 'gpu' && (
          <EditGpuModal
            editingGpu={editingAttribute}
            setEditingGpu={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditMaterialModal */}
        {activeTab === 'chatLieu' && (
          <EditMaterialModal
            editingMaterial={editingAttribute}
            setEditingMaterial={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditSizeModal */}
        {activeTab === 'kichThuoc' && (
          <EditSizeModal
            editingSize={editingAttribute}
            setEditingSize={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditScreenModal */}
        {activeTab === 'manHinh' && (
          <EditScreenModal
            editingScreen={editingAttribute}
            setEditingScreen={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditGraphicsCardModal */}
        {activeTab === 'cardManHinh' && (
          <EditGraphicsCardModal
            editingCard={editingAttribute}
            setEditingCard={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditProductTypeModal */}
        {activeTab === 'loaisanpham' && (
          <EditProductTypeModal
            editingProductType={editingAttribute}
            setEditingProductType={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditColorModal */}
        {activeTab === 'mausac' && (
          <EditColorModal
            editingColor={editingAttribute}
            setEditingColor={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        {/* Add EditSupplierModal */}
        {activeTab === 'nguon' && (
          <EditSupplierModal
            editingSupplier={editingAttribute}
            setEditingSupplier={setEditingAttribute}
            onSuccess={fetchAttributes}
          />
        )}

        <ToastContainer />
      </main>
    </div>
  );
};

export default ProductAttributesPage;
