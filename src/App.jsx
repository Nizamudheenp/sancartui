import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';


// Lazy Load Page Components
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const UserOrders = lazy(() => import('./pages/UserOrders'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AddProduct = lazy(() => import('./components/AddProduct'));
const EditProduct = lazy(() => import('./components/EditProduct'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./components/About'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const NotFound = lazy(() => import('./pages/NotFound'));


const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] mt-16">
    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {

  const location = useLocation();
  const shouldShowFooter = ['/', '/about', '/contact', '/shop'].includes(location.pathname);
  return (
    <>
      <Header />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/myorders' element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          } />
          <Route path='/about' element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit-product/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
          <Route path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
          <Route path="*" element={<NotFound />} />


        </Routes>
      </Suspense>

      {shouldShowFooter && <Footer />}

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#000',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />


    </>
  )
}

export default App
