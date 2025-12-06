import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ChatbotWidget from "./components/chat/ChatbotWidget";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <HomePage />
                </PageWrapper>
              }
            />
            <Route
              path="/shop"
              element={
                <PageWrapper>
                  <ShopPage />
                </PageWrapper>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <PageWrapper>
                  <ProductDetailPage />
                </PageWrapper>
              }
            />
            <Route
              path="/cart"
              element={
                <PageWrapper>
                  <CartPage />
                </PageWrapper>
              }
            />
            <Route
              path="/checkout"
              element={
                <PageWrapper>
                  <CheckoutPage />
                </PageWrapper>
              }
            />
            <Route
              path="/checkout/success"
              element={
                <PageWrapper>
                  <CheckoutSuccessPage />
                </PageWrapper>
              }
            />
            <Route
              path="/orders"
              element={
                <PageWrapper>
                  <OrdersPage />
                </PageWrapper>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PageWrapper>
                  <WishlistPage />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <LoginPage />
                </PageWrapper>
              }
            />
            <Route
              path="/register"
              element={
                <PageWrapper>
                  <RegisterPage />
                </PageWrapper>
              }
            />
            <Route
              path="/admin"
              element={
                <PageWrapper>
                  <AdminDashboardPage />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
        <Footer />
        <ChatbotWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
