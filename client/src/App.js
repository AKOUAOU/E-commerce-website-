import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import SEOHelmet from './components/SEO/SEOHelmet';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/Admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'));
const AdminAnalytics = lazy(() => import('./pages/Admin/AdminAnalytics'));

// Error pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));

function App() {
  const { i18n } = useTranslation();
  const { language, direction } = useLanguage();
  const { user } = useAuth();

  // Set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: direction === 'rtl' ? -20 : 20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: direction === 'rtl' ? 20 : -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3,
  };

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50">
        <SEOHelmet />
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <motion.div
                      key="home"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <HomePage />
                    </motion.div>
                  </Layout>
                }
              />
              
              <Route
                path="/products"
                element={
                  <Layout>
                    <motion.div
                      key="products"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductsPage />
                    </motion.div>
                  </Layout>
                }
              />
              
              <Route
                path="/products/:slug"
                element={
                  <Layout>
                    <motion.div
                      key="product-detail"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductDetailPage />
                    </motion.div>
                  </Layout>
                }
              />
              
              <Route
                path="/cart"
                element={
                  <Layout>
                    <motion.div
                      key="cart"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <CartPage />
                    </motion.div>
                  </Layout>
                }
              />
              
              <Route
                path="/checkout"
                element={
                  <Layout>
                    <motion.div
                      key="checkout"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <CheckoutPage />
                    </motion.div>
                  </Layout>
                }
              />
              
              <Route
                path="/checkout/success"
                element={
                  <Layout>
                    <motion.div
                      key="checkout-success"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <CheckoutSuccessPage />
                    </motion.div>
                  </Layout>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/login"
                element={
                  user ? (
                    <Navigate to="/admin/dashboard" replace />
                  ) : (
                    <motion.div
                      key="admin-login"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminLoginPage />
                    </motion.div>
                  )
                }
              />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route
                  path="dashboard"
                  element={
                    <motion.div
                      key="admin-dashboard"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminDashboard />
                    </motion.div>
                  }
                />
                <Route
                  path="products"
                  element={
                    <motion.div
                      key="admin-products"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminProducts />
                    </motion.div>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <motion.div
                      key="admin-orders"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminOrders />
                    </motion.div>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <motion.div
                      key="admin-analytics"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminAnalytics />
                    </motion.div>
                  }
                />
              </Route>

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <Layout>
                    <motion.div
                      key="not-found"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <NotFoundPage />
                    </motion.div>
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;