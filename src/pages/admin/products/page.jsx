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
    <div className="min-h-screen flex bg-gray-100">
      <NavbarAdmin />
      <main className="flex-1 p-8 overflow-hidden">
        <ToastContainer limit={3} />
        
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {showDeleted ? 'Danh sách sản phẩm đã ẩn' : 'Danh sách tất cả sản phẩm trong hệ thống'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!showDeleted && (
                  <button
                    onClick={openAddModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm sản phẩm mới
                  </button>
                )}
                
                <button
                  onClick={() => setShowDeleted(!showDeleted)}
                  className={`px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium ${
                    showDeleted 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  {showDeleted ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Quay lại danh sách
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Thùng rác
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
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
              <div className="flex gap-4">
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Thương hiệu</option>
                  {thuongHieus?.map(th => (
                    <option key={th.id} value={th.id}>{th.ten}</option>
                  ))}
                </select>
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Loại sản phẩm</option>
                  {loaiSanPhams?.map(lsp => (
                    <option key={lsp.id} value={lsp.id}>{lsp.tenLoai}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <ProductTable 
              products={products}
              onToggleStatus={handleToggleStatus}
              onEdit={openEditModal}
              onViewDetail={handleViewDetail}
              showDeleted={showDeleted}
            />
          </div>
        </div>

        {/* Modals */}
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