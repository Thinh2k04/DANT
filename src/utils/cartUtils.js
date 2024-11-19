export const addToCart = (item) => {
    console.log(item.id + " đã thêm vào giỏ hàng");
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    const storedArray = JSON.parse(localStorage.getItem('cartItems'));
    console.log(storedArray);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
};