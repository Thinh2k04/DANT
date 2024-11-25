export const addToCart = (item) => {
  try {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    return {
      success: true,
      productName: item.tenSanPhamChiTiet || item.tenSanPham,
      price: parseFloat(item.donGia)
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false };
  }
};
