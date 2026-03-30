import { type ReactNode, createContext, useContext, useState } from "react";
import type { Category } from "../backend.d";

export type PageView =
  | { type: "home" }
  | { type: "category"; category: Category }
  | { type: "product"; id: bigint }
  | { type: "cart" }
  | { type: "orders" }
  | { type: "admin" };

interface NavContextType {
  page: PageView;
  navigate: (page: PageView) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageView>({ type: "home" });

  const navigate = (p: PageView) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <NavContext.Provider value={{ page, navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
