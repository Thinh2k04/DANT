import { toast } from 'react-toastify';

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = (item) => {
  try {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    // Trigger event để cập nhật số lượng trong navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Hiển thị thông báo thành công
    toast.success(`Đã thêm ${item.tenSanPhamChiTiet || item.tenSanPham} vào giỏ hàng!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    return {
      success: true,
      productName: item.tenSanPhamChiTiet || item.tenSanPham,
      price: parseFloat(item.donGia)
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
    // Kiểm tra số lượng trong database
    const response = await fetch(`http://localhost:8080/rest/spctDTO/getById/${id}`);
    const dbProduct = await response.json();

    if (newQuantity > 0 && newQuantity <= dbProduct.soLuong) {
      const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const updatedCart = currentCart.map(item => {
        if (item.id === id) {
          return { ...item, soLuong: newQuantity };
        }
        return item;
      });
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      // Trigger event để cập nhật số lượng trong navbar
      window.dispatchEvent(new Event('cartUpdated'));
      
      return { success: true };
    } else {
      toast.error(`Số lượng sản phẩm không được vượt quá số lượng trong kho (${dbProduct.soLuong})`);
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
        quantities[item.id] = 1;
        selectedItems[item.id] = false;
      } else {
        quantities[item.id] += 1;
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
      return total + (parseFloat(item.donGia) * quantity);
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

    localStorage.setItem('checkoutItems', JSON.stringify(checkoutData));
    localStorage.setItem('checkoutQuantities', JSON.stringify(quantityData));

    return { success: true };
  } catch (error) {
    console.error('Error processing checkout:', error);
    toast.error('Có lỗi xảy ra khi xử lý thanh toán!');
    return { success: false };
  }
};
