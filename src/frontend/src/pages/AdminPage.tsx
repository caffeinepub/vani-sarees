import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  Camera,
  Edit,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { OrderStatus, Product, ProductInput } from "../backend.d";
import { Category } from "../backend.d";
import { loadConfig } from "../config";
import { useNav } from "../context/NavContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllOrders,
  useAllProducts,
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useSeedProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";
import { getCategoryLabel } from "../utils/categoryGradient";
import { formatDate, formatPrice } from "../utils/format";

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  price: 0n,
  stock: 0n,
  category: Category.silk,
  imageUrl: "",
  featured: false,
};

function ProductForm({
  initial,
  onSave,
  isPending,
}: {
  initial: ProductInput;
  onSave: (data: ProductInput) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<ProductInput>(initial);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { identity } = useInternetIdentity();

  const update = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadProgress(0);
      const config = await loadConfig();
      const agent = new HttpAgent({
        identity: identity ?? undefined,
        host: config.backend_host,
      });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setUploadProgress(Math.round(pct)),
      );
      const url = await storageClient.getDirectURL(hash);
      update("imageUrl", url);
      toast.success("Photo uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photo");
    } finally {
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const rupees = form.price === 0n ? "" : String(Number(form.price) / 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-sans text-sm">Product Name</Label>
          <Input
            data-ocid="admin.product.name.input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Kanjivaram Silk Saree"
          />
        </div>
        <div>
          <Label className="font-sans text-sm">Category</Label>
          <Select
            value={String(form.category)}
            onValueChange={(v) => update("category", v as Category)}
          >
            <SelectTrigger data-ocid="admin.product.category.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Category.silk}>Silk</SelectItem>
              <SelectItem value={Category.cotton}>Cotton</SelectItem>
              <SelectItem value={Category.designer}>Designer</SelectItem>
              <SelectItem value={Category.bridal}>Bridal</SelectItem>
              <SelectItem value={Category.bestSellers}>Best Sellers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="font-sans text-sm">Description</Label>
        <Textarea
          data-ocid="admin.product.description.textarea"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Product description…"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-sans text-sm">Price (₹)</Label>
          <Input
            data-ocid="admin.product.price.input"
            type="number"
            value={rupees}
            onChange={(e) => {
              const val = e.target.value;
              update(
                "price",
                val === ""
                  ? 0n
                  : BigInt(Math.round(Number.parseFloat(val) * 100)),
              );
            }}
            placeholder="e.g. 1250 for ₹1,250"
          />
        </div>
        <div>
          <Label className="font-sans text-sm">Stock</Label>
          <Input
            data-ocid="admin.product.stock.input"
            type="number"
            value={Number(form.stock)}
            onChange={(e) => update("stock", BigInt(e.target.value || "0"))}
          />
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <Label className="font-sans text-sm">Product Photo</Label>
        <div className="flex items-center gap-3 mt-1">
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Product preview"
              className="w-14 h-14 object-cover rounded-lg border border-border"
            />
          )}
          <div className="flex flex-col gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              data-ocid="admin.product.upload_button"
              onChange={handleFileChange}
              disabled={uploadProgress !== null}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-sans gap-2"
              disabled={uploadProgress !== null}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              {form.imageUrl ? "Change Photo" : "Upload Photo"}
            </Button>
            {uploadProgress !== null && (
              <div
                data-ocid="admin.product.upload.loading_state"
                className="text-xs font-sans text-muted-foreground flex items-center gap-1"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading… {uploadProgress}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          data-ocid="admin.product.featured.switch"
          checked={form.featured}
          onCheckedChange={(v) => update("featured", v)}
        />
        <Label className="font-sans text-sm">Featured product</Label>
      </div>

      <Button
        data-ocid="admin.product.save.submit_button"
        onClick={() => onSave(form)}
        disabled={isPending || !form.name || uploadProgress !== null}
        style={{ backgroundColor: "#8A0F3A", color: "white" }}
        className="w-full font-sans font-semibold"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isPending ? "Saving…" : "Save Product"}
      </Button>
    </div>
  );
}

function getStatusKey(status: OrderStatus): string {
  return Object.keys(status)[0];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminPage() {
  const { navigate } = useNav();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products, isLoading: loadingProducts } = useAllProducts();
  const { data: orders, isLoading: loadingOrders } = useAllOrders();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const seedProducts = useSeedProducts();

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  if (checkingAdmin) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="min-h-screen bg-cream flex items-center justify-center"
      >
        <Loader2 className="w-8 h-8 animate-spin text-maroon" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.access_denied.section"
        className="min-h-screen bg-cream flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Access Denied</h2>
          <p className="font-sans text-muted-foreground mb-4">
            You don&apos;t have admin access.
          </p>
          <Button onClick={() => navigate({ type: "home" })}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleCreate = async (data: ProductInput) => {
    try {
      await createProduct.mutateAsync(data);
      setAddOpen(false);
      toast.success("Product created!");
    } catch {
      toast.error("Failed to create product");
    }
  };

  const handleUpdate = async (data: ProductInput) => {
    if (!editProduct) return;
    try {
      await updateProduct.mutateAsync({ id: editProduct.id, input: data });
      setEditProduct(null);
      toast.success("Product updated!");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      setDeleteConfirm(null);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleStatusChange = async (orderId: bigint, newStatus: string) => {
    let status: OrderStatus;
    if (newStatus === "shipped")
      status = { shipped: null } as unknown as OrderStatus;
    else if (newStatus === "delivered")
      status = { delivered: null } as unknown as OrderStatus;
    else status = { pending: null } as unknown as OrderStatus;
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSeed = async () => {
    try {
      await seedProducts.mutateAsync();
      toast.success("Products seeded successfully!");
    } catch {
      toast.error("Failed to seed products");
    }
  };

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold">Admin Panel</h1>
            <p className="font-sans text-muted-foreground text-sm mt-1">
              Manage products and orders
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              data-ocid="admin.seed.button"
              variant="outline"
              size="sm"
              onClick={handleSeed}
              disabled={seedProducts.isPending}
              className="font-sans"
            >
              {seedProducts.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Package className="w-4 h-4 mr-2" />
              )}
              Seed Products
            </Button>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.add_product.open_modal_button"
                  style={{ backgroundColor: "#8A0F3A", color: "white" }}
                  className="font-sans font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent
                data-ocid="admin.add_product.dialog"
                className="max-w-lg"
              >
                <DialogHeader>
                  <DialogTitle className="font-serif">
                    Add New Product
                  </DialogTitle>
                </DialogHeader>
                <ProductForm
                  initial={EMPTY_FORM}
                  onSave={handleCreate}
                  isPending={createProduct.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6 font-sans">
            <TabsTrigger data-ocid="admin.products.tab" value="products">
              <ShoppingBag className="w-4 h-4 mr-1" /> Products (
              {products?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger data-ocid="admin.orders.tab" value="orders">
              <Package className="w-4 h-4 mr-1" /> Orders ({orders?.length ?? 0}
              )
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" data-ocid="admin.products.panel">
            <div className="bg-card rounded-xl overflow-hidden shadow-card">
              <Table data-ocid="admin.products.table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans">Name</TableHead>
                    <TableHead className="font-sans">Category</TableHead>
                    <TableHead className="font-sans">Price</TableHead>
                    <TableHead className="font-sans">Stock</TableHead>
                    <TableHead className="font-sans">Featured</TableHead>
                    <TableHead className="font-sans">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingProducts ? (
                    <TableRow data-ocid="admin.products.loading_state">
                      <TableCell colSpan={6} className="text-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : products && products.length > 0 ? (
                    products.map((p, i) => (
                      <TableRow
                        key={p.id.toString()}
                        data-ocid={`admin.products.row.${i + 1}`}
                      >
                        <TableCell className="font-sans font-medium">
                          {p.name}
                        </TableCell>
                        <TableCell className="font-sans text-muted-foreground">
                          {getCategoryLabel(p.category)}
                        </TableCell>
                        <TableCell className="font-sans">
                          {formatPrice(p.price)}
                        </TableCell>
                        <TableCell className="font-sans">
                          {p.stock.toString()}
                        </TableCell>
                        <TableCell>
                          {p.featured ? (
                            <Badge className="font-sans bg-yellow-100 text-yellow-800">
                              Yes
                            </Badge>
                          ) : (
                            <span className="font-sans text-muted-foreground text-sm">
                              No
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              data-ocid={`admin.products.edit.edit_button.${i + 1}`}
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditProduct(p)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              data-ocid={`admin.products.delete.delete_button.${i + 1}`}
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setDeleteConfirm(p.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow data-ocid="admin.products.empty_state">
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 font-sans text-muted-foreground"
                      >
                        No products yet. Add one or seed sample products.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" data-ocid="admin.orders.panel">
            <div className="bg-card rounded-xl overflow-hidden shadow-card">
              <Table data-ocid="admin.orders.table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans">Order ID</TableHead>
                    <TableHead className="font-sans">Date</TableHead>
                    <TableHead className="font-sans">Items</TableHead>
                    <TableHead className="font-sans">Total</TableHead>
                    <TableHead className="font-sans">Status</TableHead>
                    <TableHead className="font-sans">Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingOrders ? (
                    <TableRow data-ocid="admin.orders.loading_state">
                      <TableCell colSpan={6} className="text-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : orders && orders.length > 0 ? (
                    orders.map((order, i) => (
                      <TableRow
                        key={order.id.toString()}
                        data-ocid={`admin.orders.row.${i + 1}`}
                      >
                        <TableCell className="font-sans font-medium">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell className="font-sans text-muted-foreground">
                          {formatDate(order.timestamp)}
                        </TableCell>
                        <TableCell className="font-sans">
                          {order.items.length} item(s)
                        </TableCell>
                        <TableCell className="font-sans font-semibold">
                          {formatPrice(order.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-sans font-semibold ${
                              STATUS_STYLES[getStatusKey(order.status)] ??
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {getStatusKey(order.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={getStatusKey(order.status)}
                            onValueChange={(v) =>
                              handleStatusChange(order.id, v)
                            }
                          >
                            <SelectTrigger
                              data-ocid={`admin.orders.status.select.${i + 1}`}
                              className="w-32 font-sans text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow data-ocid="admin.orders.empty_state">
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 font-sans text-muted-foreground"
                      >
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent
          data-ocid="admin.edit_product.dialog"
          className="max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm
              initial={{
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price,
                stock: editProduct.stock,
                category: editProduct.category,
                imageUrl: editProduct.imageUrl,
                featured: editProduct.featured,
              }}
              onSave={handleUpdate}
              isPending={updateProduct.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <DialogContent
          data-ocid="admin.delete_product.dialog"
          className="max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-serif">Delete Product</DialogTitle>
          </DialogHeader>
          <p className="font-sans text-muted-foreground text-sm">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              data-ocid="admin.delete_product.cancel_button"
              variant="outline"
              className="flex-1 font-sans"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.delete_product.confirm_button"
              className="flex-1 font-sans"
              style={{ backgroundColor: "#dc2626", color: "white" }}
              disabled={deleteProduct.isPending}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
