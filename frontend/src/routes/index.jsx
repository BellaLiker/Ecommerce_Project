import { Routes, Route } from "react-router-dom";
import PublicLayout    from "../layouts/PublicLayout.jsx";
import UserLayout      from "../layouts/UserLayout.jsx";
import AdminLayout     from "../layouts/AdminLayout.jsx";
import ProtectedRoute  from "./ProtectedRoute.jsx";
import AdminRoute      from "./AdminRoute.jsx";

// Public
import Home            from "../pages/public/Home.jsx";
import Shop            from "../pages/public/Shop.jsx";
import ProductDetails  from "../pages/public/ProductDetails.jsx";
import Categories      from "../pages/public/Categories.jsx";
import Brands          from "../pages/public/Brands.jsx";
import Cart            from "../pages/public/Cart.jsx";
import Wishlist        from "../pages/public/Wishlist.jsx";
import Checkout        from "../pages/public/Checkout.jsx";
import Login           from "../pages/public/Login.jsx";
import Register        from "../pages/public/Register.jsx";
import ForgotPassword  from "../pages/public/ForgotPassword.jsx";
import ResetPassword   from "../pages/public/ResetPassword.jsx";
import About           from "../pages/public/About.jsx";
import Contact         from "../pages/public/Contact.jsx";
import FAQ             from "../pages/public/FAQ.jsx";
import NotFound        from "../pages/public/NotFound.jsx";

// User
import UserDashboard   from "../pages/user/Dashboard.jsx";
import Profile         from "../pages/user/Profile.jsx";
import ChangePassword  from "../pages/user/ChangePassword.jsx";
import MyOrders        from "../pages/user/MyOrders.jsx";
import OrderDetails    from "../pages/user/OrderDetails.jsx";
import UserWishlist    from "../pages/public/Wishlist.jsx";
import AddressBook     from "../pages/user/AddressBook.jsx";
import Notifications   from "../pages/user/Notifications.jsx";

// Admin
import AdminDashboard       from "../pages/admin/Dashboard.jsx";
import AdminProducts        from "../pages/admin/Products.jsx";
import AddProduct           from "../pages/admin/AddProduct.jsx";
import EditProduct          from "../pages/admin/EditProduct.jsx";
import AdminCategories      from "../pages/admin/Categories.jsx";
import AdminBrands          from "../pages/admin/Brands.jsx";
import AdminOrders          from "../pages/admin/Orders.jsx";
import AdminOrderDetails    from "../pages/admin/AdminOrderDetails.jsx";
import AdminUsers           from "../pages/admin/Users.jsx";
import AdminCustomers       from "../pages/admin/Customers.jsx";
import AdminReviews         from "../pages/admin/Reviews.jsx";
import AdminCoupons         from "../pages/admin/Coupons.jsx";
import AdminReports         from "../pages/admin/Reports.jsx";
import AdminSettings        from "../pages/admin/Settings.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/"                  element={<Home />} />
        <Route path="/shop"              element={<Shop />} />
        <Route path="/product/:slug"     element={<ProductDetails />} />
        <Route path="/categories"        element={<Categories />} />
        <Route path="/brands"            element={<Brands />} />
        <Route path="/cart"              element={<Cart />} />
        <Route path="/wishlist"          element={<Wishlist />} />
        <Route path="/checkout"          element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/forgot-password"   element={<ForgotPassword />} />
        <Route path="/reset-password"    element={<ResetPassword />} />
        <Route path="/about"             element={<About />} />
        <Route path="/contact"           element={<Contact />} />
        <Route path="/faq"               element={<FAQ />} />
        <Route path="*"                  element={<NotFound />} />
      </Route>

      {/* User Dashboard */}
      <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route path="/user/dashboard"        element={<UserDashboard />} />
        <Route path="/user/profile"          element={<Profile />} />
        <Route path="/user/change-password"  element={<ChangePassword />} />
        <Route path="/user/orders"           element={<MyOrders />} />
        <Route path="/user/orders/:id"       element={<OrderDetails />} />
        <Route path="/user/wishlist"         element={<UserWishlist />} />
        <Route path="/user/addresses"        element={<AddressBook />} />
        <Route path="/user/notifications"    element={<Notifications />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin/dashboard"           element={<AdminDashboard />} />
        <Route path="/admin/products"            element={<AdminProducts />} />
        <Route path="/admin/products/add"        element={<AddProduct />} />
        <Route path="/admin/products/edit/:id"   element={<EditProduct />} />
        <Route path="/admin/categories"          element={<AdminCategories />} />
        <Route path="/admin/brands"              element={<AdminBrands />} />
        <Route path="/admin/orders"              element={<AdminOrders />} />
        <Route path="/admin/orders/:id"          element={<AdminOrderDetails />} />
        <Route path="/admin/customers"           element={<AdminCustomers />} />
        <Route path="/admin/users"               element={<AdminUsers />} />
        <Route path="/admin/reviews"             element={<AdminReviews />} />
        <Route path="/admin/coupons"             element={<AdminCoupons />} />
        <Route path="/admin/reports"             element={<AdminReports />} />
        <Route path="/admin/settings"            element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
