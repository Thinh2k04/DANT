import { FiX } from 'react-icons/fi';

const ProductListModal = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Danh sách sản phẩm được giảm giá</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex space-x-4">
              <img
                src={item.product.hinhAnhMinhHoa}
                alt={item.product.sanPham.tenSanPham}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.product.sanPham.tenSanPham}</h4>
                <p className="text-sm text-gray-500">Mã: {item.product.maSpct}</p>
                <p className="text-sm text-gray-500">
                  RAM: {item.product.ram.dungLuong}GB
                </p>
                <p className="text-sm text-gray-500">
                  CPU: {item.product.cpu.ten}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">
                    Giá gốc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.donGia)}
                  </p>
                  <p className="text-sm font-medium text-red-600">
                    Giá sau giảm: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.donGia * (1 - item.discountCampaign.discountPercentage / 100))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListModal; 