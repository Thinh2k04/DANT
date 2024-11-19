import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtils'; 
import Navbar from '../../../components/Layout/DefaultLayout/Navbar'; 
import Footer from '../../../components/Layout/DefaultLayout/Footer';

const ChiTietSanPham = () => {
    const { idSanPham } = useParams();
    const [product, setProduct] = useState(null);
    const [laptops, setLaptops] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedConfig, setSelectedConfig] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/spctDTO/getById/${idSanPham}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProduct(data);
                setSelectedConfig(data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [idSanPham]);

    useEffect(() => {
        const fetchProductImages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rest/san_pham_chi_tiet/getIMG/${idSanPham}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const imageData = await response.json();
                
                let formattedImages = [];
                if (Array.isArray(imageData)) {
                    formattedImages = imageData.map(img => ({
                        imageUrl: img.imageUrl || img
                    }));
                } else if (typeof imageData === 'object') {
                    formattedImages = [{ imageUrl: imageData.imageUrl || imageData }];
                }

                setProductImages(formattedImages);
                if (formattedImages.length > 0) {
                    setSelectedImage(formattedImages[0].imageUrl);
                    setProduct(prevState => ({
                        ...prevState,
                        hinhAnh: formattedImages[0].imageUrl
                    }));
                }
            } catch (error) {
                console.error('Error fetching product images:', error);
            }
        };

        fetchProductImages();
    }, [idSanPham]);

    useEffect(() => {
        const fetchLaptops = async () => {
          try {
            const response = await fetch('http://localhost:8080/rest/spctDTO/getAll');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLaptops(data);
            const related = data.filter(item => item.idSanPham === product?.idSanPham);
            setRelatedProducts(related);
          } catch (error) {
            console.error('Error fetching laptops:', error);
          }
        };
        fetchLaptops();
    }, [product]);

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const handleAddToCart = (item) => {
        addToCart(item);
    };

    const handleRelatedProductClick = (relatedProduct) => {
        navigate(`/chitietsanpham/${relatedProduct.id}`);
    };

    const handleBuyNow = () => {
        navigate(`/xacnhandonhang/${selectedConfig.id}`);
    };

    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleConfigSelect = (config) => {
        setSelectedConfig(config);
    };

    const formatPrice = (price) => {
        if (typeof price === 'undefined' || price === null) {
            return 'N/A';
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Product Images */}
                    <div className="sticky top-24 h-fit bg-white p-4 rounded-lg shadow-lg">
                        <div className="h-80 mb-4">
                            <img 
                                src={selectedImage || product.hinhAnh} 
                                alt={product.tenSanPham} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto py-2 max-h-24">
                            {productImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover cursor-pointer rounded-md flex-shrink-0 ${
                                        selectedImage === img.imageUrl ? 'border-2 border-blue-500' : 'border border-gray-200'
                                    }`}
                                    onClick={() => handleThumbnailClick(img.imageUrl)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-4">{selectedConfig.tenSanPhamChiTiet}</h1>
                        <p className="text-gray-600 mb-6">{selectedConfig.gioiThieu}</p>
                        <div className="text-2xl font-bold text-red-600 mb-6">
                            {formatPrice(selectedConfig.donGia)} VNĐ
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật:</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">CPU:</p>
                                    <p className="font-medium">{selectedConfig.tenCPU}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">RAM:</p>
                                    <p className="font-medium">{selectedConfig.dungLuongRam} GB</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Ổ cứng:</p>
                                    <p className="font-medium">{selectedConfig.dungLuong} GB</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Màn hình:</p>
                                    <p className="font-medium">{selectedConfig.kichThuocLaptop} inch</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Card đồ họa:</p>
                                    <p className="font-medium">{selectedConfig.gpu} </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Card đồ họa rời:</p>
                                    <p className="font-medium">{selectedConfig.cardDoHoaRoi ? selectedConfig.cardDoHoaRoi : 'Không có'} </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Pin:</p>
                                    <p className="font-medium">{selectedConfig.pin} Wh</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Trọng lượng:</p>
                                    <p className="font-medium">{selectedConfig.trongLuong} kg</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Bảo hành:</p>
                                    <p className="font-medium">{selectedConfig.baoHanh} </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={handleBuyNow}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Mua ngay
                            </button>
                            <button 
                                onClick={() => handleAddToCart(selectedConfig)}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Thêm vào giỏ
                            </button>
                        </div>

                        {/* Configuration Options */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Tùy chọn cấu hình:</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {relatedProducts.map((config) => (
                                    <div
                                        key={config.id}
                                        className={`border rounded-lg p-4 cursor-pointer ${
                                            selectedConfig.id === config.id ? 'border-2 border-green-500' : ''
                                        }`}
                                        onClick={() => handleConfigSelect(config)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    Core™ {config.tenCPU}, RAM {config.dungLuongRam}GB, SSD {config.dungLuong}GB
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

                {/* Related Products */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <div 
                                key={relatedProduct.id} 
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                onClick={() => handleRelatedProductClick(relatedProduct)}
                            >
                                <img 
                                    src={relatedProduct.hinhAnh} 
                                    alt={relatedProduct.tenSanPham} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">{relatedProduct.tenSanPhamChiTiet}</h3>
                                    <p className="text-red-600 font-bold mb-3">{formatPrice(relatedProduct.donGia)} VNĐ</p>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(relatedProduct);
                                        }}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ChiTietSanPham;