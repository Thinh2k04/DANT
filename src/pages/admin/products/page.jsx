import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import EditProductModal from './components/EditProductModal';
import { useProduct } from './hooks/useProduct';

const ProductManagement = () => {
  const {
    products,
    isModalOpen,
    showDeleted,
    formData,
    setIsModalOpen,
    setFormData,
    setShowDeleted,
    openProductForm,
    handleToggleStatus,
    handleViewDetail,
    isEditing,
    loading,
    spctData,
    setSpctData,
    imageUrls,
    setImageUrls,
    handleSubmit,
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
    isEditModalOpen,
    setIsEditModalOpen,
    handleEdit,
    openEditForm,
    showDetailModal,
    setShowDetailModal,
    selectedProduct
  } = useProduct();

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-6">
        <ToastContainer />

        <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>
        
        <div className="mb-4 flex justify-between">
          <button 
            onClick={() => openProductForm()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thêm sản phẩm
          </button>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`px-4 py-2 ${
              showDeleted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            } text-white rounded transition-colors`}
          >
            {showDeleted ? 'Xem sản phẩm đang bán' : 'Xem sản phẩm đã ẩn'}
          </button>
        </div>

        <ProductTable 
          products={products}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditForm}
          onViewDetail={handleViewDetail}
          showDeleted={showDeleted}
        />

        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          spctData={spctData}
          setSpctData={setSpctData}
          onSubmit={handleSubmit}
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
        />

        <EditProductModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          spctData={spctData}
          setSpctData={setSpctData}
          onSubmit={handleEdit}
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
        />

        <ProductDetailModal 
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          product={selectedProduct}
        />
      </main>
    </div>
  );
};

export default ProductManagement;