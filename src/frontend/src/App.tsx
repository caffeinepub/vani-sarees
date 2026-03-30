import { Toaster } from "@/components/ui/sonner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { NavProvider, useNav } from "./context/NavContext";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function AppContent() {
  const { page } = useNav();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#8A0F3A" }}
    >
      <div className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto shadow-2xl">
        <Header />
        <div className="flex-1">
          {page.type === "home" && <HomePage />}
          {page.type === "category" && (
            <CategoryPage category={page.category} />
          )}
          {page.type === "product" && <ProductDetailPage productId={page.id} />}
          {page.type === "cart" && <CartPage />}
          {page.type === "orders" && <MyOrdersPage />}
          {page.type === "admin" && <AdminPage />}
        </div>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavProvider>
        <AppContent />
      </NavProvider>
    </CartProvider>
  );
}
