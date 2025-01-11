import '../i18n/i18n';
import HomePage from '../pages/use/home/page';
import CartPage from '../pages/use/giohang/page';
import AdminDashboard from '../pages/admin/homeAdmin/page';
import ProductManagement from '../pages/admin/products/page';
import OrderManagement from '../pages/admin/orders/page';
import CustomerManagement from '../pages/admin/customers/page';
import AttributeManagement from '../pages/admin/attributes/page';
import ChiTietSanPham from '../pages/chitietsanpham[/id]/page';
import CheckoutPage from '../pages/use/thanhtoan/page';
import PaymentSuccess from '../components/GioHangComponenst/PaymentSuccess';
import ChiTietSanPhamAdmin from '../pages/admin/sanphamchitietAdmin[/id]/page';
import TrackOrder from '../pages/use/track order/page';
import LoginPage from '../pages/use/loginuse/page';
import RegisterPage from '../pages/use/register/page';
import ProductAttributesPage from '../pages/admin/product-attributes/page';
import VoucherPage from '../pages/admin/vocher/page';
import EmployeePage from '../pages/admin/employee/page';
import PromotionPeriodPage from '../pages/admin/promotionperiod/page';


// Public routes
const publicRoutes = [
  { path: '/', component: HomePage },
  { path: '/home', component: HomePage },
  { path: '/cart', component: CartPage },
  { path: '/chitietsanpham/:idSanPham', component: ChiTietSanPham },
  { path: '/checkout', component: CheckoutPage },
  { path: '/payment-success', component: PaymentSuccess },
  { path: '/track-order', component: TrackOrder },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
];

// Private routes (Admin routes)
const privateRoutes = [
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/products', component: ProductManagement },
  { path: '/admin/orders', component: OrderManagement },
  { path: '/admin/customers', component: CustomerManagement },
  { path: '/admin/attributes', component: AttributeManagement },
  { path: '/admin/chitietsanpham/:idSanPham', component: ChiTietSanPhamAdmin },
  { path: '/admin/product-attributes', component: ProductAttributesPage },
  { path: '/admin/employees', component: EmployeePage },
  { path: '/admin/vouchers', component: VoucherPage },
  { path: '/admin/promotion-period', component: PromotionPeriodPage },
];

export { privateRoutes, publicRoutes };
