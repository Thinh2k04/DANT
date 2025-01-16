import { toast } from 'react-toastify';

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = (item) => {
  try {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Sử dụng giá đã giảm nếu có, nếu không thì dùng giá gốc
    const priceToUse = item.discountedPrice || item.donGia;
    const updatedCart = [...existingCart, {...item, donGia: priceToUse}];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(
      <div>
        <p>Đã thêm vào giỏ hàng:</p>
        <p className="font-semibold">{item.tenSanPhamChiTiet || item.tenSanPham}</p>
        <p className="text-red-600 font-semibold mt-1">
          Giá: {parseFloat(priceToUse).toLocaleString('vi-VN')}₫
          {item.discountedPrice && (
            <span className="text-gray-500 text-sm line-through ml-2">
              {parseFloat(item.donGia).toLocaleString('vi-VN')}₫
            </span>
          )}
        </p>
      </div>, 
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );

    return {
      success: true,
      productName: item.tenSanPhamChiTiet || item.tenSanPham,
      price: parseFloat(priceToUse)
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('Có lỗi xảy ra khi thêm sản phẩm!');
    return { success: false };
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (id) => {
  try {
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = currentCart.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    // Trigger event để cập nhật số lượng trong navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false };
  }
};

// Hàm cập nhật số lượng sản phẩm
export const updateCartItemQuantity = async (id, newQuantity) => {
  try {
    const response = await fetch('http://localhost:8080/rest/ghct/changQuantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: id,
        quantityChange: newQuantity
      })
    });

    const result = await response.json();
    
    if (result.success) {
      const stockResponse = await fetch(`http://localhost:8080/rest/discount/getProductByProductId/${id}`);
      const stockData = await stockResponse.json();
      
      if (newQuantity > stockData.soLuong) {
        toast.warning(`Số lượng vượt quá hàng tồn kho (${stockData.soLuong} sản phẩm)!`);
        return { success: false };
      }

      const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItemIndex = currentCart.findIndex(item => item.id === id);

      if (existingItemIndex !== -1) {
        // Cập nhật số lượng và giá (sử dụng giá đã giảm nếu có)
        const priceToUse = stockData.discountedPrice || stockData.donGia;
        currentCart[existingItemIndex] = {
          ...currentCart[existingItemIndex],
          quantity: newQuantity,
          donGia: priceToUse
        };
      } else {
        // Thêm sản phẩm mới với giá đã giảm nếu có
        const priceToUse = stockData.discountedPrice || stockData.donGia;
        currentCart.push({ 
          ...stockData, 
          quantity: newQuantity,
          donGia: priceToUse
        });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      return { success: true };
    } else {
      toast.error(result.message || 'Không thể cập nhật số lượng sản phẩm');
      return { success: false };
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    toast.error('Có lỗi xảy ra khi cập nhật số lượng!');
    return { success: false };
  }
};

// Hàm lấy tất cả sản phẩm trong giỏ hàng
export const getCartItems = () => {
  try {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const uniqueItems = [];
    const quantities = {};
    const selectedItems = {};

    cartItems.forEach(item => {
      if (!quantities[item.id]) {
        uniqueItems.push(item);
        quantities[item.id] = item.quantity || 1;
        selectedItems[item.id] = false;
      } else {
        quantities[item.id] = item.quantity || quantities[item.id];
      }
    });

    return {
      success: true,
      items: uniqueItems,
      quantities,
      selectedItems
    };
  } catch (error) {
    console.error('Error getting cart items:', error);
    return { success: false };
  }
};

// Hàm tính tổng tiền các sản phẩm đã chọn
export const calculateTotal = (cartItems, selectedItems, quantities) => {
  return cartItems.reduce((total, item) => {
    if (selectedItems[item.id]) {
      const quantity = quantities[item.id] || 1;
      // Sử dụng giá đã giảm nếu có
      const price = parseFloat(item.donGia); // donGia đã là giá được giảm từ khi thêm vào giỏ
      return total + (price * quantity);
    }
    return total;
  }, 0);
};

// Hàm xử lý checkout
export const processCheckout = (cartItems, selectedItems, quantities) => {
  try {
    const itemsToCheckout = cartItems.filter(item => selectedItems[item.id]);
    if (itemsToCheckout.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return { success: false };
    }

    // Lưu thông tin đầy đủ của sản phẩm được chọn
    const checkoutData = itemsToCheckout.map(item => ({
      ...item,
      id: item.id,
      maDinhDanh: item.id,
      soLuong: quantities[item.id] || 1,
      thanhTien: (quantities[item.id] || 1) * parseFloat(item.donGia)
    }));

    const quantityData = {};
    checkoutData.forEach(item => {
      quantityData[item.id] = item.soLuong;
    });

    // Lưu danh sách sản phẩm được chọn để checkout
    localStorage.setItem('checkoutItems', JSON.stringify(checkoutData));
    localStorage.setItem('checkoutQuantities', JSON.stringify(quantityData));

    return { success: true };
  } catch (error) {
    console.error('Error processing checkout:', error);
    toast.error('Có lỗi xảy ra khi xử lý thanh toán!');
    return { success: false };
  }
};
