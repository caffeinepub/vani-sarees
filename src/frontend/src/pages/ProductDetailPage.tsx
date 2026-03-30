import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Heart,
  Package,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useNav } from "../context/NavContext";
import { useProduct } from "../hooks/useQueries";
import {
  getCategoryGradient,
  getCategoryLabel,
} from "../utils/categoryGradient";
import { formatPrice } from "../utils/format";

interface ProductDetailPageProps {
  productId: bigint;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const { navigate } = useNav();
  const { addToCart } = useCart();
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div
        data-ocid="product_detail.loading_state"
        className="max-w-6xl mx-auto px-4 py-12 bg-cream min-h-screen"
      >
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-96 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        data-ocid="product_detail.error_state"
        className="max-w-6xl mx-auto px-4 py-20 text-center bg-cream min-h-screen"
      >
        <h2 className="font-serif text-2xl font-bold mb-2">
          Product Not Found
        </h2>
        <Button onClick={() => navigate({ type: "home" })} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const inStock = product.stock > 0n;
  const gradient = getCategoryGradient(product.category);

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          type="button"
          data-ocid="product_detail.back.button"
          onClick={() =>
            navigate({ type: "category", category: product.category })
          }
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-sans mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to{" "}
          {getCategoryLabel(product.category)}
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="space-y-4">
            <div
              className="w-full aspect-square rounded-2xl overflow-hidden shadow-lifted"
              style={{ background: gradient }}
            />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border cursor-pointer hover:border-maroon transition-colors"
                  style={{ background: gradient, opacity: 0.7 + i * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <Badge className="mb-3 font-sans bg-card text-foreground">
              {getCategoryLabel(product.category)}
            </Badge>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-sans text-muted-foreground">
                4.0 (128 reviews)
              </span>
            </div>

            <p className="font-serif text-3xl font-bold text-maroon mb-5">
              {formatPrice(product.price)}
            </p>

            <p className="font-sans text-muted-foreground leading-relaxed mb-6">
              {product.description ||
                "A beautiful handcrafted saree, lovingly woven by skilled artisans. Each piece is unique, bearing the hallmark of traditional craftsmanship blended with contemporary design sensibility."}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-4 h-4 text-muted-foreground" />
              {inStock ? (
                <span className="font-sans text-sm text-green-700 font-medium">
                  In Stock ({product.stock.toString()} left)
                </span>
              ) : (
                <span className="font-sans text-sm text-red-600 font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                data-ocid="product_detail.add_to_cart.primary_button"
                disabled={!inStock}
                onClick={() => {
                  addToCart(product);
                  toast.success(`${product.name} added to cart!`);
                }}
                className="flex-1 font-sans font-semibold py-6"
                style={{ backgroundColor: "#C7A24D", color: "#2A1F10" }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button
                data-ocid="product_detail.wishlist.button"
                variant="outline"
                className="border-maroon text-maroon hover:bg-maroon hover:text-white py-6"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Buy now */}
            <Button
              data-ocid="product_detail.buy_now.button"
              disabled={!inStock}
              onClick={() => {
                addToCart(product);
                navigate({ type: "cart" });
              }}
              className="w-full font-sans font-semibold py-6"
              style={{ backgroundColor: "#8A0F3A", color: "white" }}
            >
              Buy Now
            </Button>

            {/* Shipping info */}
            <div className="mt-6 p-4 bg-card rounded-lg">
              <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                <Truck className="w-4 h-4" />
                Free shipping on orders above ₹2,999 | Expected delivery in 5-7
                business days
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
