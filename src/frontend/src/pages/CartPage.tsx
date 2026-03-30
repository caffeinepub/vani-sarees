import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useNav } from "../context/NavContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePlaceOrder } from "../hooks/useQueries";
import { getCategoryGradient } from "../utils/categoryGradient";
import { formatPrice } from "../utils/format";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const { navigate } = useNav();
  const { identity, login } = useInternetIdentity();
  const placeOrder = usePlaceOrder();

  const handlePlaceOrder = async () => {
    if (!identity) {
      login();
      return;
    }
    const orderItems = items.map((i) => ({
      productId: i.product.id,
      quantity: BigInt(i.quantity),
    }));
    try {
      await placeOrder.mutateAsync(orderItems);
      clearCart();
      toast.success("Order placed successfully!");
      navigate({ type: "orders" });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <main className="bg-cream min-h-screen">
        <div
          data-ocid="cart.empty_state"
          className="max-w-2xl mx-auto px-4 py-20 text-center"
        >
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold mb-2">
            Your Cart is Empty
          </h2>
          <p className="font-sans text-muted-foreground mb-8">
            Add some beautiful sarees to get started!
          </p>
          <Button
            data-ocid="cart.continue_shopping.button"
            style={{ backgroundColor: "#8A0F3A", color: "white" }}
            className="font-sans font-semibold"
            onClick={() => navigate({ type: "home" })}
          >
            Continue Shopping
          </Button>
        </div>
      </main>
    );
  }

  const shipping = totalPrice >= 299900n ? 0n : 9900n;
  const finalTotal = totalPrice + shipping;

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          type="button"
          data-ocid="cart.back.button"
          onClick={() => navigate({ type: "home" })}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-sans mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>

        <h1 className="font-serif text-3xl font-bold mb-8">
          Shopping Cart ({items.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <div
                key={item.product.id.toString()}
                data-ocid={`cart.item.${i + 1}`}
                className="bg-card rounded-xl p-4 flex gap-4 shadow-xs"
              >
                <div
                  className="w-20 h-20 rounded-lg shrink-0"
                  style={{
                    background: getCategoryGradient(item.product.category),
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-base line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground mb-2">
                    {formatPrice(item.product.price)} each
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-ocid={`cart.decrement.button.${i + 1}`}
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-sans font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      data-ocid={`cart.increment.button.${i + 1}`}
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <span className="font-serif font-bold text-maroon">
                    {formatPrice(item.product.price * BigInt(item.quantity))}
                  </span>
                  <button
                    type="button"
                    data-ocid={`cart.remove.delete_button.${i + 1}`}
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-5">
                Order Summary
              </h2>
              <div className="space-y-3 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0n ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0n && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders above ₹2,999
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-maroon font-serif text-lg">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
              <Button
                data-ocid="cart.place_order.primary_button"
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
                className="w-full mt-6 font-sans font-semibold py-6"
                style={{ backgroundColor: "#8A0F3A", color: "white" }}
              >
                {placeOrder.isPending
                  ? "Placing Order…"
                  : identity
                    ? "Place Order"
                    : "Login to Order"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3 font-sans">
                Secure checkout • Authentic products guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
