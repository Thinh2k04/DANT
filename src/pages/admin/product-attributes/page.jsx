import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import AttributeTab from './components/AttributeTab';
import BrandAttribute from './components/BrandAttribute';
import RamAttribute from './components/RamAttribute';
import CpuAttribute from './components/CpuAttribute';
import StorageAttribute from './components/StorageAttribute';
import ScreenAttribute from './components/ScreenAttribute';
import GpuAttribute from './components/GpuAttribute';
import GraphicsCardAttribute from './components/GraphicsCardAttribute';
import MaterialAttribute from './components/MaterialAttribute';
import SizeAttribute from './components/SizeAttribute';
import ProductTypeAttribute from './components/ProductTypeAttribute';
import ColorAttribute from './components/ColorAttribute';
import SupplierAttribute from './components/SupplierAttribute';

const ProductAttributesPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('thuongHieu');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Define tabs array
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
    { id: 'loaisanpham', label: 'Loại sản phẩm', endpoint: 'loai_san_pham' },
    { id: 'mausac', label: 'Màu sắc', endpoint: 'mau_sac' },
    { id: 'nguon', label: 'Nguồn nhập', endpoint: 'nguon_nhap' }
  ];

  const renderAttributeComponent = () => {
    switch(activeTab) {
      case 'thuongHieu':
        return <BrandAttribute />;
      case 'ram':
        return <RamAttribute />;
      case 'cpu':
        return <CpuAttribute />;
      case 'oCung':
        return <StorageAttribute />;
      case 'manHinh':
        return <ScreenAttribute />;
      case 'gpu':
        return <GpuAttribute />;
      case 'cardManHinh':
        return <GraphicsCardAttribute />;
      case 'chatLieu':
        return <MaterialAttribute />;
      case 'kichThuoc':
        return <SizeAttribute />;
      case 'loaisanpham':
        return <ProductTypeAttribute />;
      case 'mausac':
        return <ColorAttribute />;
      case 'nguon':
        return <SupplierAttribute />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <NavbarAdmin />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý thuộc tính sản phẩm</h1>
            </div>

            <AttributeTab 
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {renderAttributeComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductAttributesPage;
