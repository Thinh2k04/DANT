import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ProductDetailModal from './components/ProductDetailModal';
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
    thuongHieus,
    showDetailModal,
    setShowDetailModal,
    selectedProduct
  } = useProduct();

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-6">
        <ToastContainer />

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showDeleted 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {showDeleted ? 'Xem sản phẩm đang bán' : 'Xem sản phẩm đã ẩn'}
            </button>
            
            <button 
              onClick={() => openProductForm()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Thêm sản phẩm mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ProductTable 
            products={products}
            onToggleStatus={handleToggleStatus}
            onEdit={openProductForm}
            onViewDetail={handleViewDetail}
            showDeleted={showDeleted}
          />
        </div>

        {/* Modal thêm/sửa sản phẩm */}
        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          spctData={spctData}
          setSpctData={setSpctData}
          onSubmit={handleSubmit}
          isEditing={isEditing}
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

        {/* Modal xem chi tiết sản phẩm */}
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