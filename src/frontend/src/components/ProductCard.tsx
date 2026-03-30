import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import { useNav } from "../context/NavContext";
import {
  getCategoryGradient,
  getCategoryLabel,
} from "../utils/categoryGradient";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { navigate } = useNav();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const gradient = getCategoryGradient(product.category);
  const inStock = product.stock > 0n;

  return (
    <button
      type="button"
      data-ocid={`product.item.${index}`}
      className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-lifted transition-all duration-300 cursor-pointer text-left w-full"
      onClick={() => navigate({ type: "product", id: product.id })}
    >
      {/* Product image placeholder */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          style={{ background: gradient }}
        />
        {/* Category badge */}
        <Badge className="absolute top-3 left-3 font-sans text-xs bg-white/90 text-foreground">
          {getCategoryLabel(product.category)}
        </Badge>
        {/* Wishlist */}
        <button
          type="button"
          data-ocid={`product.wishlist.button.${index}`}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-maroon" />
        </button>
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-sm font-sans font-semibold px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${
                s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground font-sans ml-1">
            (4.0)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-maroon">
            {formatPrice(product.price)}
          </span>
          <Button
            data-ocid={`product.add_to_cart.button.${index}`}
            size="sm"
            disabled={!inStock}
            onClick={handleAddToCart}
            style={{ backgroundColor: "#C7A24D", color: "#2A1F10" }}
            className="font-sans font-semibold text-xs hover:opacity-90"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </button>
  );
}
