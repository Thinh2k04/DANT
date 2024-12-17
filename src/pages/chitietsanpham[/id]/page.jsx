// Import các thư viện và components cần thiết
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtils';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import Footer from '../../../components/Layout/DefaultLayout/Footer';
// Import các icon từ react-icons/fa
import { FaShoppingCart, FaRegHeart, FaHeart, FaShippingFast, FaShieldAlt, FaUndo, FaInfoCircle, FaMicrochip, FaMemory, FaHdd, FaDesktop, FaGamepad, FaBatteryFull, FaWeightHanging, FaTools, FaLaptop } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AnimeLoading from '../../../components/Loading/AnimeLoading';
import { ToastContainer } from 'react-toastify';
import { updateCartItemQuantity } from '../../../utils/cartUtils';
import CartToast from '../../../components/Toast/CartToast';

import 'react-toastify/dist/ReactToastify.css';

// Định nghĩa component ChiTietSanPham
const ChiTietSanPham = () => {
    // Lấy id sản phẩm từ URL params
    const { idSanPham } = useParams();
    // Khai báo các state cần thiết
    const [product, setProduct] = useState(null); // State lưu thông tin sản phẩm
    const [laptops, setLaptops] = useState([]); // State lưu danh sách laptop
    const [relatedProducts, setRelatedProducts] = useState([]); // State lưu sản phẩm liên quan
    const [productImages, setProductImages] = useState([]); // State lưu ảnh sản phẩm
    const [selectedImage, setSelectedImage] = useState(''); // State lưu ảnh được chọn
    const [selectedConfig, setSelectedConfig] = useState(null); // State lưu cấu hình được chọn
    const [isFavorite, setIsFavorite] = useState(false); // State lưu trạng thái yêu thích
    const navigate = useNavigate(); // Hook điều hướng
    const [isLoading, setIsLoading] = useState(true); // State loading
    const [selectedProduct, setSelectedProduct] = useState(null); // Thêm state cho sản phẩm được chọn
    const [showToast, setShowToast] = useState(false); // Thêm state cho toast

    // useEffect để fetch thông tin chi tiết sản phẩm
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsLoading(true);
                // Gọi API lấy thông tin sản phẩm
                const response = await fetch(`http://localhost:8080/rest/spctDTO/getById/${idSanPham}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setProduct(data);
                setSelectedConfig(data);

                // Gọi API lấy danh sách laptop
                const laptopsResponse = await fetch('http://localhost:8080/rest/spctDTO/getAll');
                if (!laptopsResponse.ok) throw new Error('Network response was not ok');
                const laptopsData = await laptopsResponse.json();
                setLaptops(laptopsData);
                // Lọc sản phẩm liên quan
                const related = laptopsData.filter(item => item.idSanPham === data?.idSanPham);
                setRelatedProducts(related);

                // Delay 1s để hiển thị loading
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error('Error:', error);
                toast.error('Không thể tải thông tin sản phẩm');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [idSanPham]);

    // useEffect để fetch ảnh sản phẩm
    useEffect(() => {
        const fetchProductImages = async () => {
            try {
                // Gọi API lấy ảnh sản phẩm
                const response = await fetch(`http://localhost:8080/rest/san_pham_chi_tiet/getIMG/${idSanPham}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const imageData = await response.json();
                
                // Format dữ liệu ảnh
                let formattedImages = Array.isArray(imageData) 
                    ? imageData.map(img => ({ imageUrl: img.imageUrl || img }))
                    : [{ imageUrl: imageData.imageUrl || imageData }];

                setProductImages(formattedImages);
                if (formattedImages.length > 0) {
                    setSelectedImage(formattedImages[0].imageUrl);
                    setProduct(prev => ({ ...prev, hinhAnh: formattedImages[0].imageUrl }));
                }
            } catch (error) {
                console.error('Error fetching images:', error);
                toast.error('Không thể tải hình ảnh sản phẩm');
            }
        };

        fetchProductImages();
    }, [idSanPham]);

    // Hiển thị loading khi đang tải dữ liệu
    if (isLoading) {
        return <AnimeLoading />;
    }

    // Hiển thị loading spinner khi chưa có dữ liệu sản phẩm
    if (!product) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = async (product) => {
        try {
            const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = currentCart.find(item => item.id === product.id);
            const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

            const result = await updateCartItemQuantity(product.id, newQuantity);
            if (result.success) {
                if (existingItem) {
                    existingItem.quantity = newQuantity;
                } else {
                    currentCart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cartItems', JSON.stringify(currentCart));

                setSelectedProduct(product);
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!', {
                position: "top-right", 
                autoClose: 2000,
            });
        }
    };

    // Hàm xử lý khi click vào sản phẩm liên quan
    const handleRelatedProductClick = (relatedProduct) => {
        navigate(`/chitietsanpham/${relatedProduct.id}`);
    };

    // Hàm xử lý khi click nút mua ngay
    const handleBuyNow = () => {
        navigate(`/xacnhandonhang/${selectedConfig.id}`);
    };

    // Hàm xử lý khi click vào ảnh thumbnail
    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // Hàm xử lý khi chọn cấu hình
    const handleConfigSelect = (config) => {
        setSelectedConfig(config);
    };

    // Hàm format giá tiền
    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 'Liên hệ';
    };

    // Object chứa các icon cho thông số kỹ thuật
    const specIcons = {
        CPU: <FaMicrochip className="text-blue-600" />,
        RAM: <FaMemory className="text-green-600" />,
        'Ổ cứng': <FaHdd className="text-purple-600" />,
        'Màn hình': <FaDesktop className="text-red-600" />,
        'Card đồ họa': <FaGamepad className="text-yellow-600" />,
        'Card đồ họa rời': <FaGamepad className="text-orange-600" />,
        'Pin': <FaBatteryFull className="text-green-600" />,
        'Trọng lượng': <FaWeightHanging className="text-blue-600" />,
        'Bảo hành': <FaTools className="text-gray-600" />
    };

    // Return JSX
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <ToastContainer />
            <CartToast 
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        product={selectedProduct}
      />
            {!isLoading && product && (
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cột trái - Ảnh sản phẩm */}
                        <div className="sticky top-20 h-fit">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-4">
                                <div className="relative h-80 mb-4">
                                    <img 
                                        src={selectedImage || product.hinhAnh} 
                                        alt={product.tenSanPham} 
                                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                    />
                                    <button 
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                                    >
                                        {isFavorite ? 
                                            <FaHeart className="text-red-500 text-xl" /> : 
                                            <FaRegHeart className="text-gray-400 text-xl" />
                                        }
                                    </button>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {productImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0"
                                            onClick={() => handleThumbnailClick(img.imageUrl)}
                                        >
                                            <img
                                                src={img.imageUrl}
                                                alt={`Thumbnail ${index + 1}`}
                                                className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all
                                                    ${selectedImage === img.imageUrl 
                                                        ? 'ring-2 ring-blue-500 scale-105' 
                                                        : 'hover:ring-2 hover:ring-blue-300'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cột phải - Thông tin sản phẩm */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">{selectedConfig.tenSanPhamChiTiet}</h1>
                                <p className="text-gray-600 text-base mb-4">{selectedConfig.gioiThieu}</p>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold text-red-600">
                                        {formatPrice(selectedConfig.donGia)} VNĐ
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(selectedConfig.donGia * 1.1)} VNĐ
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaShippingFast className="text-blue-600 text-lg" />
                                        <span>Giao hàng miễn phí</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaShieldAlt className="text-green-600 text-lg" />
                                        <span>Bảo hành chính hãng</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaUndo className="text-red-600 text-lg" />
                                        <span>Đổi trả trong 7 ngày</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
                                    {[
                                        ['CPU', selectedConfig.tenCPU],
                                        ['RAM', `${selectedConfig.dungLuongRam} GB`],
                                        ['Ổ cứng', `${selectedConfig.dungLuong} GB`],
                                        ['Màn hình', `${selectedConfig.kichThuocLaptop} inch`],
                                        ['Card đồ họa', selectedConfig.gpu],
                                        ['Card đồ họa rời', selectedConfig.cardDoHoaRoi || 'Không có'],
                                        ['Pin', `${selectedConfig.pin} Wh`],
                                        ['Trọng lượng', `${selectedConfig.trongLuong} kg`],
                                        ['Bảo hành', selectedConfig.baoHanh]
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex items-center gap-2">
                                            {specIcons[label]}
                                            <div>
                                                <p className="text-sm text-gray-600">{label}</p>
                                                <p className="font-medium text-gray-900">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleBuyNow}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FaShoppingCart />
                                        Mua ngay
                                    </button>
                                    <button 
                                        onClick={() => handleAddToCart(selectedConfig)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FaShoppingCart />
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>

                            {/* Phần tùy chọn cấu hình */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-600" />
                                    Tùy chọn cấu hình
                                </h2>
                                <div className="space-y-3">
                                    {relatedProducts.map((config) => (
                                        <div
                                            key={config.id}
                                            className={`border rounded-xl p-4 cursor-pointer transition-all
                                                ${selectedConfig.id === config.id 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300'}`}
                                            onClick={() => handleConfigSelect(config)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {config.tenCPU}, RAM {config.dungLuongRam}GB, SSD {config.dungLuong}GB
                                                        {config.cardDoHoa && `, ${config.cardDoHoa}`}
                                                    </p>
                                                </div>
                                                <p className="text-red-600 font-bold text-lg ml-4">
                                                    {formatPrice(config.donGia)} đ
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phần sản phẩm tương tự */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaLaptop className="text-blue-600" />
                            Sản phẩm tương tự
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div 
                                    key={relatedProduct.id} 
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => handleRelatedProductClick(relatedProduct)}
                                >
                                    <div className="relative h-40">
                                        <img 
                                            src={relatedProduct.hinhAnhMinhHoa} 
                                            alt={relatedProduct.tenSanPham} 
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                            {relatedProduct.tenSanPhamChiTiet}
                                        </h3>
                                        <p className="text-red-600 font-bold text-lg mb-3">
                                            {formatPrice(relatedProduct.donGia)} VNĐ
                                        </p>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(relatedProduct);
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <FaShoppingCart />
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default ChiTietSanPham;