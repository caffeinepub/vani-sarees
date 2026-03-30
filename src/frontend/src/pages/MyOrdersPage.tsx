import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import type { OrderStatus } from "../backend.d";
import { useNav } from "../context/NavContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyOrders } from "../hooks/useQueries";
import { formatDate, formatPrice } from "../utils/format";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

function statusLabel(status: OrderStatus): string {
  const key = Object.keys(status)[0];
  if (key === "pending") return "Pending";
  if (key === "shipped") return "Shipped";
  if (key === "delivered") return "Delivered";
  return key;
}

export default function MyOrdersPage() {
  const { navigate } = useNav();
  const { identity, login } = useInternetIdentity();
  const { data: orders, isLoading } = useMyOrders();

  if (!identity) {
    return (
      <main className="bg-cream min-h-screen">
        <div
          data-ocid="orders.login_required.section"
          className="max-w-lg mx-auto px-4 py-20 text-center"
        >
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold mb-2">My Orders</h2>
          <p className="font-sans text-muted-foreground mb-6">
            Please login to view your order history.
          </p>
          <Button
            data-ocid="orders.login.button"
            style={{ backgroundColor: "#8A0F3A", color: "white" }}
            className="font-sans font-semibold"
            onClick={login}
          >
            Login
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div data-ocid="orders.loading_state" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl p-5">
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div
                key={order.id.toString()}
                data-ocid={`orders.item.${i + 1}`}
                className="bg-card rounded-xl p-5 shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-sans font-semibold text-sm text-muted-foreground">
                      Order #{order.id.toString()}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {formatDate(order.timestamp)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${
                      STATUS_STYLES[String(Object.keys(order.status)[0])] ??
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product.id.toString()}
                      className="flex justify-between text-sm font-sans"
                    >
                      <span className="text-foreground">
                        {item.product.name} × {item.quantity.toString()}
                      </span>
                      <span className="text-muted-foreground">
                        {formatPrice(
                          item.product.price * BigInt(item.quantity),
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-serif font-bold text-maroon">
                    Total: {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div data-ocid="orders.empty_state" className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">
              No Orders Yet
            </h2>
            <p className="font-sans text-muted-foreground mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Button
              data-ocid="orders.shop_now.button"
              style={{ backgroundColor: "#8A0F3A", color: "white" }}
              className="font-sans font-semibold"
              onClick={() => navigate({ type: "home" })}
            >
              Shop Now
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
