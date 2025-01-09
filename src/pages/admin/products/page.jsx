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
          <div className="flex items-center gap-3">
            {!showDeleted && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm sản phẩm
              </button>
            )}
            
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showDeleted 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {showDeleted ? (
                <>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Quay lại
                </>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Thùng rác
                </>
              )}
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