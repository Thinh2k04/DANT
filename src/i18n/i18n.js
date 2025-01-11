import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // English translations
      "welcome": "Welcome",
      "home": "Home",
      "products": "Products",
      "about": "About",
      "contact": "Contact",
      "addToCart": "Add to Cart",
      "viewMore": "View More",
      "loading": "Loading...",
      "viewMoreProducts": "View More Products",
      "featuredBrands": "Featured Brands",
      "priceRange": "Price Range",
      "allPrices": "All Prices",
      "under20m": "Under 20 million",
      "20mTo40m": "20 - 40 million",
      "40mTo60m": "40 - 60 million",
      "above60m": "Above 60 million",
      "brand": "Brand",
      "allBrands": "All Brands",
      "storage": "Storage",
      "allStorage": "All Storage",
      "screen": "Screen",
      "allScreens": "All Screens",
      "filterSearch": "Search Filters",
      "premiumLaptops": "Premium Laptops",
      "showing": "Showing",
      "of": "of",
      "products": "products",
      "sortBy": "Sort By",
      "newest": "Newest",
      "priceLowToHigh": "Price Low to High",
      "priceHighToLow": "Price High to Low",
      "hotDeals": "Hot Deals",
      "viewAll": "View All",
      "gamingLaptop": "Gaming Laptop",
      "discount20": "Up to 20% off on premium gaming laptops",
      "viewNow": "View Now",
      
      // Navigation
      "searchOrder": "Track Order",
      "shoppingCart": "Shopping Cart",
      "login": "Login",
      "register": "Register",
      
      // Product details
      "specifications": "Specifications",
      "description": "Description",
      "reviews": "Reviews",
      "relatedProducts": "Related Products",
      
      // Shopping cart
      "cart": "Cart",
      "product": "Product",
      "price": "Price",
      "quantity": "Quantity",
      "total": "Total",
      "checkout": "Checkout",
      "emptyCart": "Your cart is empty",
      "continueShopping": "Continue Shopping",
      
      // Checkout
      "shippingAddress": "Shipping Address",
      "paymentMethod": "Payment Method",
      "orderSummary": "Order Summary",
      "placeOrder": "Place Order",
      
      // Footer
      "aboutUs": "About Us",
      "contactUs": "Contact Us",
      "termsConditions": "Terms & Conditions",
      "privacyPolicy": "Privacy Policy",
      "followUs": "Follow Us",
      
      // Notifications
      "addedToCart": "Added to cart successfully",
      "errorOccurred": "An error occurred",
      "orderSuccess": "Order placed successfully",
      
      // AI Chat related
      "aiChatPlaceholder": "Type your message here...",
      "aiChatSend": "Send",
      "aiChatThinking": "AI is thinking...",
      "aiChatWelcome": "Hello! How can I help you today?",
      
      // User profile
      "myProfile": "My Profile",
      "editProfile": "Edit Profile",
      "accountSettings": "Account Settings",
      "myOrders": "My Orders",
      "wishlist": "Wishlist",
      "logout": "Logout",
      
      // Search
      "searchPlaceholder": "Search for products...",
      "noResults": "No results found",
      "popularSearches": "Popular Searches",
      
      // Product filters
      "filters": "Filters",
      "clearAll": "Clear All",
      "apply": "Apply",
      "inStock": "In Stock",
      "outOfStock": "Out of Stock",
      
      // Order tracking
      "orderTracking": "Order Tracking",
      "orderNumber": "Order Number",
      "trackOrder": "Track Order",
      "orderStatus": "Order Status",
      "orderDate": "Order Date",
      "estimatedDelivery": "Estimated Delivery",
      
      // Reviews
      "writeReview": "Write a Review",
      "rating": "Rating",
      "comment": "Comment",
      "submitReview": "Submit Review",
      "reviewSuccess": "Review submitted successfully",
      
      // Authentication
      "emailAddress": "Email Address",
      "password": "Password",
      "forgotPassword": "Forgot Password?",
      "confirmPassword": "Confirm Password",
      "createAccount": "Create Account",
      "alreadyHaveAccount": "Already have an account?",
      "dontHaveAccount": "Don't have an account?",
      
      // Error messages
      "requiredField": "This field is required",
      "invalidEmail": "Invalid email address",
      "passwordMismatch": "Passwords do not match",
      "networkError": "Network error occurred",
    }
  },
  vi: {
    translation: {
      // Vietnamese translations
      "welcome": "Xin chào",
      "home": "Trang chủ",
      "products": "Sản phẩm",
      "about": "Giới thiệu",
      "contact": "Liên hệ",
      "addToCart": "Thêm vào giỏ hàng",
      "viewMore": "Xem thêm",
      "loading": "Đang tải...",
      "viewMoreProducts": "Xem thêm sản phẩm",
      "featuredBrands": "Thương Hiệu Nổi Bật",
      "priceRange": "Khoảng giá",
      "allPrices": "Tất cả mức giá",
      "under20m": "Dưới 20 triệu",
      "20mTo40m": "20 - 40 triệu",
      "40mTo60m": "40 - 60 triệu",
      "above60m": "Trên 60 triệu",
      "brand": "Thương hiệu",
      "allBrands": "Tất cả thương hiệu",
      "storage": "Ổ cứng",
      "allStorage": "Tất cả ổ cứng",
      "screen": "Màn hình",
      "allScreens": "Tất cả màn hình",
      "filterSearch": "Bộ lọc tìm kiếm",
      "premiumLaptops": "Laptop cao cấp chính hãng",
      "showing": "Hiển thị",
      "of": "trên",
      "products": "sản phẩm",
      "sortBy": "Sắp xếp theo",
      "newest": "Mới nhất",
      "priceLowToHigh": "Giá thấp đến cao",
      "priceHighToLow": "Giá cao đến thấp",
      "hotDeals": "Khuyến Mãi Hot",
      "viewAll": "Xem tất cả",
      "gamingLaptop": "Laptop Gaming",
      "discount20": "Giảm đến 20% cho laptop gaming cao cấp",
      "viewNow": "Xem ngay",
      
      // Navigation
      "searchOrder": "Tra cứu đơn hàng",
      "shoppingCart": "Giỏ hàng",
      "login": "Đăng nhập",
      "register": "Đăng ký",
      
      // Product details
      "specifications": "Thông số kỹ thuật",
      "description": "Mô tả",
      "reviews": "Đánh giá",
      "relatedProducts": "Sản phẩm liên quan",
      
      // Shopping cart
      "cart": "Giỏ hàng",
      "product": "Sản phẩm",
      "price": "Giá",
      "quantity": "Số lượng",
      "total": "Tổng cộng",
      "checkout": "Thanh toán",
      "emptyCart": "Giỏ hàng trống",
      "continueShopping": "Tiếp tục mua sắm",
      
      // Checkout
      "shippingAddress": "Địa chỉ giao hàng",
      "paymentMethod": "Phương thức thanh toán",
      "orderSummary": "Tổng quan đơn hàng",
      "placeOrder": "Đặt hàng",
      
      // Footer
      "aboutUs": "Về chúng tôi",
      "contactUs": "Liên hệ",
      "termsConditions": "Điều khoản & Điều kiện",
      "privacyPolicy": "Chính sách bảo mật",
      "followUs": "Theo dõi chúng tôi",
      
      // Notifications
      "addedToCart": "Đã thêm vào giỏ hàng",
      "errorOccurred": "Đã xảy ra lỗi",
      "orderSuccess": "Đặt hàng thành công",
      
      // AI Chat related
      "aiChatPlaceholder": "Nhập tin nhắn của bạn...",
      "aiChatSend": "Gửi",
      "aiChatThinking": "AI đang suy nghĩ...",
      "aiChatWelcome": "Xin chào! Tôi có thể giúp gì cho bạn?",
      
      // User profile
      "myProfile": "Hồ sơ của tôi",
      "editProfile": "Chỉnh sửa hồ sơ",
      "accountSettings": "Cài đặt tài khoản",
      "myOrders": "Đơn hàng của tôi",
      "wishlist": "Danh sách yêu thích",
      "logout": "Đăng xuất",
      
      // Search
      "searchPlaceholder": "Tìm kiếm sản phẩm...",
      "noResults": "Không tìm thấy kết quả",
      "popularSearches": "Tìm kiếm phổ biến",
      
      // Product filters
      "filters": "Bộ lọc",
      "clearAll": "Xóa tất cả",
      "apply": "Áp dụng",
      "inStock": "Còn hàng",
      "outOfStock": "Hết hàng",
      
      // Order tracking
      "orderTracking": "Theo dõi đơn hàng",
      "orderNumber": "Mã đơn hàng",
      "trackOrder": "Theo dõi",
      "orderStatus": "Trạng thái đơn hàng",
      "orderDate": "Ngày đặt hàng",
      "estimatedDelivery": "Dự kiến giao hàng",
      
      // Reviews
      "writeReview": "Viết đánh giá",
      "rating": "Xếp hạng",
      "comment": "Bình luận",
      "submitReview": "Gửi đánh giá",
      "reviewSuccess": "Đã gửi đánh giá thành công",
      
      // Authentication
      "emailAddress": "Địa chỉ email",
      "password": "Mật khẩu",
      "forgotPassword": "Quên mật khẩu?",
      "confirmPassword": "Xác nhận mật khẩu",
      "createAccount": "Tạo tài khoản",
      "alreadyHaveAccount": "Đã có tài khoản?",
      "dontHaveAccount": "Chưa có tài khoản?",
      
      // Error messages
      "requiredField": "Trường này là bắt buộc",
      "invalidEmail": "Địa chỉ email không hợp lệ",
      "passwordMismatch": "Mật khẩu không khớp",
      "networkError": "Đã xảy ra lỗi mạng",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 