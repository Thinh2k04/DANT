import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import ProductTable from './components/ProductTable';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import { useProduct } from './hooks/useProduct';

const ProductManagement = () => {
  const {
    products,
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    showDeleted,
    formData,
    setFormData,
    spctData,
    setSpctData,
    selectedProduct,
    loading,
    imageUrls,
    setImageUrls,
    handleSubmit,
    handleEdit,
    handleToggleStatus,
    handleViewDetail,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    closeDetailModal,
    setShowDeleted,
    // Options data
    loaiSanPhams,
    nguonNhaps,
    chatLieus,
    ktlts,
    rams,
    oLuuTrus,
    manHinhs,
    cpus,
    gpus,
    mauSacs,
    cardDoHoas,
    thuongHieus
  } = useProduct();

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-6">
        <ToastContainer />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thêm sản phẩm
            </button>
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 ${
                showDeleted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              } text-white rounded`}
            >
              {showDeleted ? 'Xem sản phẩm đang bán' : 'Xem sản phẩm đã ẩn'}
            </button>
          </div>
        </div>

        <ProductTable 
          products={products}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditModal}
          onViewDetail={handleViewDetail}
          showDeleted={showDeleted}
        />

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onAdd={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          spctData={spctData}
          setSpctData={setSpctData}
          loading={loading}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          loaiSanPhams={loaiSanPhams}
          nguonNhaps={nguonNhaps}
          chatLieus={chatLieus}
          ktlts={ktlts}
          rams={rams}
          oLuuTrus={oLuuTrus}
          manHinhs={manHinhs}
          cpus={cpus}
          gpus={gpus}
          mauSacs={mauSacs}
          cardDoHoas={cardDoHoas}
          thuongHieus={thuongHieus}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleEdit}
          formData={formData}
          setFormData={setFormData}
          spctData={spctData}
          setSpctData={setSpctData}
          loading={loading}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          loaiSanPhams={loaiSanPhams}
          nguonNhaps={nguonNhaps}
          chatLieus={chatLieus}
          ktlts={ktlts}
          rams={rams}
          oLuuTrus={oLuuTrus}
          manHinhs={manHinhs}
          cpus={cpus}
          gpus={gpus}
          mauSacs={mauSacs}
          cardDoHoas={cardDoHoas}
          thuongHieus={thuongHieus}
        />

        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          product={selectedProduct}
        />
      </main>
    </div>
  );
};

export default ProductManagement;