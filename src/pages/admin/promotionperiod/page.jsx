import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiCheck, FiX, FiAlertCircle, FiRefreshCw, FiEye } from 'react-icons/fi';
import { format, isValid } from 'date-fns';
import { toast } from 'react-toastify';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import ConfirmDialog from './components/ConfirmDialog';
import ProductSelectionModal from './components/ProductSelectionModal';

// Add these toast configurations at the top of your component
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const successToast = (message) => {
  toast.success(
    <div className="flex items-center">
      <FiCheck className="mr-2 h-5 w-5" />
      <span>{message}</span>
    </div>,
    toastConfig
  );
};

const errorToast = (message) => {
  toast.error(
    <div className="flex items-center">
      <FiX className="mr-2 h-5 w-5" />
      <span>{message}</span>
    </div>,
    toastConfig
  );
};

const warningToast = (message) => {
  toast.warning(
    <div className="flex items-center">
      <FiAlertCircle className="mr-2 h-5 w-5" />
      <span>{message}</span>
    </div>,
    toastConfig
  );
};

// Add this new component for displaying product details
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

const PromotionPeriodPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    active: 1
  });
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'delete',
    onConfirm: () => {},
  });
  const [showProductSelection, setShowProductSelection] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [showTrash]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:8080/rest/discount/getAllCampaign');
      // Filter campaigns based on showTrash state
      const filteredCampaigns = response.data.filter(campaign => 
        showTrash ? campaign.active === 0 : campaign.active === 1
      );
      setCampaigns(filteredCampaigns);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      errorToast('Không thể tải dữ liệu chiến dịch khuyến mãi. Vui lòng thử lại sau!');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      discountPercentage: campaign.discountPercentage,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      active: campaign.active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      warningToast('Vui lòng chọn ít nhất một sản phẩm để áp dụng khuyến mãi!');
      return;
    }

    try {
      const formattedData = {
        campaigns: {
          name: formData.name,
          discountPercentage: parseInt(formData.discountPercentage),
          startDate: formData.startDate,
          endDate: formData.endDate,
          active: 1
        },
        products: selectedProducts
      };

      if (!formattedData.campaigns.startDate || !formattedData.campaigns.endDate) {
        warningToast('Ngày bắt đầu và ngày kết thúc không được để trống!');
        return;
      }

      const startDate = new Date(formattedData.campaigns.startDate);
      const endDate = new Date(formattedData.campaigns.endDate);

      if (endDate <= startDate) {
        warningToast('Ngày kết thúc phải sau ngày bắt đầu!');
        return;
      }

      const token = localStorage.getItem('Authorization');
      console.log(token);
      const headers = {
        'Authorization': `${token}`
      };

      if (editingCampaign) {
        await axios.put(
          `http://localhost:8080/rest/discount/updateDiscount/${editingCampaign.id}`, 
          formattedData,
          { headers }
        );
        successToast('Cập nhật chiến dịch khuyến mãi thành công! 🎉');
      } else {
        await axios.post(
          'http://localhost:8080/rest/discount/addDiscount', 
          formattedData,
          { headers }
        );
        successToast('Tạo chiến dịch khuyến mãi mới thành công! 🎉');
      }

      setShowModal(false);
      setEditingCampaign(null);
      fetchCampaigns();
      setFormData({
        name: '',
        discountPercentage: '',
        startDate: '',
        endDate: '',
        active: 1
      });
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error saving campaign:', error);
      errorToast(
        editingCampaign 
          ? 'Có lỗi xảy ra khi cập nhật chiến dịch. Vui lòng thử lại!' 
          : 'Có lỗi xảy ra khi tạo chiến dịch. Vui lòng thử lại!'
      );
    }
  };

  const handleDelete = (id) => {
    setDialogConfig({
      isOpen: true,
      title: 'Xác nhận chuyển vào thùng rác',
      message: 'Bạn có chắc chắn muốn chuyển chiến dịch khuyến mãi này vào thùng rác không?',
      type: 'delete',
      onConfirm: () => handleConfirmDelete(id),
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put(`http://localhost:8080/rest/discount/updateDiscountForRealTime/${deleteId}`, {
        active: 0
      });
      successToast('Đã chuyển chiến dịch vào thùng rác! ✨');
      fetchCampaigns();
    } catch (error) {
      console.error('Error moving campaign to trash:', error);
      errorToast('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setShowConfirmDialog(false);
      setDeleteId(null);
    }
  };

  const handleUpdate = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      discountPercentage: campaign.discountPercentage,
      startDate: campaign.startDate.slice(0, 16),
      endDate: campaign.endDate.slice(0, 16),
      active: 1
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (formData.name || formData.discountPercentage || formData.startDate || formData.endDate) {
      setDialogConfig({
        isOpen: true,
        title: 'Xác nhận đóng form',
        message: 'Các thay đổi sẽ không được lưu. Bạn có chắc chắn muốn đóng form không?',
        type: 'close',
        onConfirm: () => {
          setShowModal(false);
          setFormData({
            name: '',
            discountPercentage: '',
            startDate: '',
            endDate: '',
            active: 1
          });
          setEditingCampaign(null);
          setDialogConfig({ ...dialogConfig, isOpen: false });
        },
      });
    } else {
      setShowModal(false);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    
    if (field === 'discountPercentage') {
      if (value < 0 || value > 100) {
        warningToast('Phần trăm giảm giá phải từ 0 đến 100!');
        return;
      }
    }
    
    setFormData({ ...formData, [field]: value });
  };

  const handleViewProducts = async (campaignId) => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/discount/getProductByCampaignId/${campaignId}`);
      setSelectedProducts(response.data);
      setShowProductsModal(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      errorToast('Không thể tải danh sách sản phẩm. Vui lòng thử lại!');
    }
  };

  return (
    <div className="flex">
      <NavbarAdmin />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {showTrash ? 'Thùng rác khuyến mãi' : 'Quản lý khuyến mãi'}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowTrash(!showTrash)}
              className={`flex items-center px-4 py-2 ${
                showTrash ? 'bg-green-600' : 'bg-gray-600'
              } text-white rounded-lg hover:opacity-90 transition-colors`}
            >
              {showTrash ? (
                <>
                  <FiRefreshCw className="mr-2" />
                  Quay lại
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Thùng rác
                </>
              )}
            </button>
            {!showTrash && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Thêm khuyến mãi
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên chiến dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phần trăm giảm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{campaign.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{campaign.discountPercentage}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${campaign.active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {campaign.active === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {showTrash ? (
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleUpdate(campaign)}
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                      ) : (
                        <>
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => handleViewProducts(campaign.id)}
                            title="Xem sản phẩm"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => handleEdit(campaign)}
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for adding/editing promotion */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {editingCampaign ? 'Cập nhật chiến dịch khuyến mãi' : 'Thêm chiến dịch khuyến mãi'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tên chiến dịch</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phần trăm giảm</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.discountPercentage}
                      onChange={(e) => handleInputChange(e, 'discountPercentage')}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <input
                      type="datetime-local"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <input
                      type="datetime-local"
                      required
                      min={formData.startDate || new Date().toISOString().slice(0, 16)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Sản phẩm áp dụng</label>
                    <button
                      type="button"
                      onClick={() => setShowProductSelection(true)}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-left flex justify-between items-center"
                    >
                      <span>{selectedProducts.length > 0 ? `${selectedProducts.length} sản phẩm được chọn` : 'Chọn sản phẩm'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={handleCloseModal}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      {editingCampaign ? 'Cập nhật' : 'Lưu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={dialogConfig.isOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          type={dialogConfig.type}
          onConfirm={() => {
            dialogConfig.onConfirm();
            setDialogConfig({ ...dialogConfig, isOpen: false });
          }}
          onCancel={() => setDialogConfig({ ...dialogConfig, isOpen: false })}
        />

        <ProductListModal
          isOpen={showProductsModal}
          onClose={() => setShowProductsModal(false)}
          products={selectedProducts}
        />

        <ProductSelectionModal
          isOpen={showProductSelection}
          onClose={() => setShowProductSelection(false)}
          onConfirm={(products) => {
            setSelectedProducts(products);
            setShowProductSelection(false);
          }}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>
    </div>
  );
};

export default PromotionPeriodPage;
