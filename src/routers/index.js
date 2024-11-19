import HomePage from '../pages/use/home/page';
import CartPage from '../pages/use/giohang/page';
import AdminDashboard from '../pages/admin/homeAdmin/page';
import ProductManagement from '../pages/admin/products/page';
import OrderManagement from '../pages/admin/orders/page';
import CustomerManagement from '../pages/admin/customers/page';
import AttributeManagement from '../pages/admin/attributes/page';
import ChiTietSanPham from '../pages/chitietsanpham[/id]/page';
import CheckoutPage from '../pages/use/thanhtoan/page';

// Public routes
const publicRoutes = [
  { path: '/', component: HomePage },
  { path: '/home', component: HomePage },
  { path: '/cart', component: CartPage },
  { path: '/chitietsanpham/:idSanPham', component: ChiTietSanPham },
  { path: '/checkout', component: CheckoutPage },
];

// Private routes (Admin routes)
const privateRoutes = [
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/products', component: ProductManagement },
  { path: '/admin/orders', component: OrderManagement },
  { path: '/admin/customers', component: CustomerManagement },
  { path: '/admin/attributes', component: AttributeManagement },
];

export { privateRoutes, publicRoutes };
