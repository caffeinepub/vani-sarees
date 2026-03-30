import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Category } from "../backend.d";
import { useCart } from "../context/CartContext";
import { useNav } from "../context/NavContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

const NAV_ITEMS: { label: string; category?: Category; special?: string }[] = [
  { label: "Home", special: "home" },
  { label: "Silk Sarees", category: Category.silk },
  { label: "Cotton", category: Category.cotton },
  { label: "Designer", category: Category.designer },
  { label: "Bridal", category: Category.bridal },
  { label: "Best Sellers", category: Category.bestSellers },
];

export default function Header() {
  const { totalItems } = useCart();
  const { navigate, page } = useNav();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const isLoggedIn = !!identity;

  return (
    <header className="sticky top-0 z-50 shadow-lifted">
      {/* Utility bar */}
      <div className="bg-cream border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => navigate({ type: "home" })}
            className="font-serif text-2xl font-bold tracking-widest text-maroon uppercase select-none"
          >
            Vani Sarees
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="header.search_input"
              className="pl-9 bg-white/80 border-border"
              placeholder="Search sarees…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                data-ocid="nav.admin.link"
                variant="ghost"
                size="sm"
                className="text-maroon font-sans text-xs font-semibold hidden md:inline-flex"
                onClick={() => navigate({ type: "admin" })}
              >
                Admin
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Button
                  data-ocid="nav.orders.link"
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex gap-1 text-xs font-sans"
                  onClick={() => navigate({ type: "orders" })}
                >
                  <User className="w-4 h-4" /> Orders
                </Button>
                <Button
                  data-ocid="header.logout.button"
                  variant="ghost"
                  size="icon"
                  onClick={clear}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                data-ocid="header.login.button"
                variant="ghost"
                size="sm"
                className="text-xs font-sans"
                onClick={login}
                disabled={isLoggingIn}
              >
                <User className="w-4 h-4 mr-1" />
                {isLoggingIn ? "Logging in…" : "Login"}
              </Button>
            )}
            <button
              type="button"
              data-ocid="header.wishlist.button"
              className="p-2 rounded-full hover:bg-cream-dark transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-maroon" />
            </button>
            <button
              type="button"
              data-ocid="header.cart.button"
              className="p-2 rounded-full hover:bg-cream-dark transition-colors relative"
              aria-label="Cart"
              onClick={() => navigate({ type: "cart" })}
            >
              <ShoppingCart className="w-5 h-5 text-maroon" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-sans font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary nav bar */}
      <nav
        className="hidden md:block"
        style={{
          background: "linear-gradient(90deg, #7A0E34 0%, #5E0A28 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.special === "home"
                  ? page.type === "home"
                  : page.type === "category" && page.category === item.category;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    data-ocid="nav.link"
                    onClick={() => {
                      if (item.special === "home") {
                        navigate({ type: "home" });
                      } else if (item.category) {
                        navigate({ type: "category", category: item.category });
                      }
                    }}
                    className={`px-4 py-3 text-sm font-sans font-medium transition-colors ${
                      isActive
                        ? "text-yellow-300 border-b-2 border-yellow-300"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-maroon text-white">
          <div className="px-4 py-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="Search sarees…"
              />
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                data-ocid="nav.link"
                className="block w-full text-left py-3 border-b border-white/10 text-sm font-sans"
                onClick={() => {
                  if (item.special === "home") navigate({ type: "home" });
                  else if (item.category)
                    navigate({ type: "category", category: item.category });
                  setMobileOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
            {isLoggedIn && (
              <button
                type="button"
                className="block w-full text-left py-3 border-b border-white/10 text-sm font-sans"
                onClick={() => {
                  navigate({ type: "orders" });
                  setMobileOpen(false);
                }}
              >
                My Orders
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                className="block w-full text-left py-3 text-sm font-sans text-yellow-300"
                onClick={() => {
                  navigate({ type: "admin" });
                  setMobileOpen(false);
                }}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
