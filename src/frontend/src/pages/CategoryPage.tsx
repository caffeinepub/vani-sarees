import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import type { Category } from "../backend.d";
import ProductCard from "../components/ProductCard";
import { useNav } from "../context/NavContext";
import { useProductsByCategory } from "../hooks/useQueries";
import {
  getCategoryGradient,
  getCategoryLabel,
} from "../utils/categoryGradient";

interface CategoryPageProps {
  category: Category;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const { navigate } = useNav();
  const { data: products, isLoading } = useProductsByCategory(category);

  return (
    <main className="bg-cream min-h-screen">
      {/* Hero banner */}
      <div
        className="relative h-48 md:h-64"
        style={{ background: getCategoryGradient(category) }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-6xl mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <button
            type="button"
            data-ocid="category.back.button"
            onClick={() => navigate({ type: "home" })}
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-sans mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">
            {getCategoryLabel(category)}
          </h1>
          {products && (
            <p className="text-white/70 font-sans text-sm mt-1">
              {products.length} products
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {isLoading ? (
          <div
            data-ocid="category.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-4 mt-3 rounded" />
                <Skeleton className="h-4 mt-2 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i + 1}
              />
            ))}
          </div>
        ) : (
          <div data-ocid="category.empty_state" className="text-center py-20">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4"
              style={{ background: getCategoryGradient(category) }}
            />
            <h2 className="font-serif text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="font-sans text-muted-foreground mb-6">
              Our {getCategoryLabel(category)} collection is being curated with
              love.
            </p>
            <Button
              data-ocid="category.browse_all.button"
              style={{ backgroundColor: "#8A0F3A", color: "white" }}
              onClick={() => navigate({ type: "home" })}
            >
              Browse All Collections
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
