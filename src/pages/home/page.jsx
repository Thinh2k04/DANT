import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/DefaultLayout/Navbar';
import Footer from '../../../components/Layout/DefaultLayout/Footer';
import { FaShoppingCart } from 'react-icons/fa';
import CartToast from '../../../components/Toast/CartToast';
import AnimeLoading from '../../../components/Loading/AnimeLoading';
import { updateCartItemQuantity } from '../../utils/cartUtils';
import { toast } from 'react-toastify';

const Home = () => {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchLaptops();
    }, []);

    const fetchLaptops = async () => {
        try {
            const response = await fetch('http://localhost:8080/rest/spctDTO/getAll');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLaptops(data);
        } catch (error) {
            console.error('Error fetching laptops:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (laptop) => {
        console.log("Function handleAddToCart called");
        try {
            const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = currentCart.find(item => item.id === laptop.id);
            const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

            const result = await updateCartItemQuantity(laptop.id, newQuantity);
            if (result.success) {
                if (existingItem) {
                    existingItem.quantity = newQuantity;
                } else {
                    currentCart.push({ ...laptop, quantity: 1 });
                }
                localStorage.setItem('cartItems', JSON.stringify(currentCart));

                toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                setSelectedProduct(laptop);
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleProductClick = (laptopId) => {
        navigate(`/chitietsanpham/${laptopId}`);
    };

    if (loading) {
        return <AnimeLoading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <CartToast 
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                product={selectedProduct}
            />
            
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {laptops.map((laptop) => (
                        <div 
                            key={laptop.id}
                            onClick={() => handleProductClick(laptop.id)}
                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="relative">
                                <img
                                    src={laptop.hinhAnhMinhHoa}
                                    alt={laptop.tenSanPhamChiTiet}
                                    className="w-full h-48 object-cover"
                                />
                                {laptop.giamGia > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                        -{laptop.giamGia}%
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                    {laptop.tenSanPhamChiTiet}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    {laptop.specs && laptop.specs.map((spec, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-600">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            <span className="text-sm">{spec}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="text-xl font-bold text-red-600">
                                            {laptop.donGia?.toLocaleString()} ₫
                                        </span>
                                        {laptop.giamGia > 0 && (
                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                {(laptop.donGia * (1 + laptop.giamGia/100)).toLocaleString()} ₫
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) => {
                                        console.log("Click detected");
                                        handleAddToCart(laptop);
                                    }}
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart />
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home; 