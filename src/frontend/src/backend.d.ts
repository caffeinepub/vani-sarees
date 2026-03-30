import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    featured: boolean;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: Category;
    price: Price;
}
export interface ProductInput {
    featured: boolean;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: Category;
    price: Price;
}
export interface OrderItemView {
    quantity: bigint;
    product: Product;
}
export type Time = bigint;
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    timestamp: Time;
    buyer: Principal;
    items: Array<OrderItem>;
    totalPrice: Price;
}
export type Price = bigint;
export interface OrderView {
    id: bigint;
    status: OrderStatus;
    timestamp: Time;
    buyer: Principal;
    items: Array<OrderItemView>;
    totalPrice: Price;
}
export enum Category {
    bridal = "bridal",
    bestSellers = "bestSellers",
    silk = "silk",
    designer = "designer",
    cotton = "cotton"
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(input: ProductInput): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    getAllOrders(): Promise<Array<OrderView>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getMyOrders(): Promise<Array<OrderView>>;
    getOrder(id: bigint): Promise<OrderView | null>;
    getOrdersByUser(user: Principal): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<OrderItem>): Promise<bigint>;
    seedProducts(): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, input: ProductInput): Promise<Product>;
}
