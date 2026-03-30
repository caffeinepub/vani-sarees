import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  type Price = Nat;

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Price;
    category : Category;
    imageUrl : Text;
    stock : Nat;
    featured : Bool;
  };

  type ProductInput = {
    name : Text;
    description : Text;
    price : Price;
    category : Category;
    imageUrl : Text;
    stock : Nat;
    featured : Bool;
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
  };

  type OrderItemView = {
    product : Product;
    quantity : Nat;
  };

  type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
  };

  type Order = {
    id : Nat;
    buyer : Principal;
    items : [OrderItem];
    totalPrice : Price;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  type OrderView = {
    id : Nat;
    buyer : Principal;
    items : [OrderItemView];
    totalPrice : Price;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  type Category = {
    #silk;
    #cotton;
    #designer;
    #bridal;
    #bestSellers;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 1;
  var nextOrderId = 1;

  func getNextProductId() : Nat {
    let id = nextProductId;
    nextProductId += 1;
    id;
  };

  func getNextOrderId() : Nat {
    let id = nextOrderId;
    nextOrderId += 1;
    id;
  };

  // Product Management
  public shared ({ caller }) func createProduct(input : ProductInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let id = getNextProductId();
    let product : Product = {
      input with id;
    };
    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductInput) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_oldProduct) {
        let updatedProduct : Product = {
          input with id;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category }).sort();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured }).sort();
  };

  // Order Management
  public shared ({ caller }) func placeOrder(items : [OrderItem]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (items.size() == 0) { Runtime.trap("Order must have at least one item") };
    let orderId = getNextOrderId();
    var totalPrice = 0;

    // Validate products and calculate total price
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId.toText()) };
        case (?product) {
          if (product.stock < item.quantity) {
            Runtime.trap("Insufficient stock for product " # product.name);
          };
          totalPrice += product.price * item.quantity;
        };
      };
    };

    // Reduce stock
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId.toText()) };
        case (?product) {
          products.add(
            item.productId,
            {
              product with
              stock = product.stock - item.quantity;
            },
          );
        };
      };
    };

    // Create order
    let order : Order = {
      id = orderId;
      buyer = caller;
      items;
      totalPrice;
      status = #pending;
      timestamp = Time.now();
    };
    orders.add(orderId, order);
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(
          orderId,
          {
            order with
            status;
          },
        );
      };
    };
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?OrderView {
    switch (orders.get(id)) {
      case (null) { null };
      case (?order) {
        if (caller != order.buyer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        let items = order.items.map(
          func(item) {
            switch (products.get(item.productId)) {
              case (null) { Runtime.trap("Product not found") };
              case (?product) {
                {
                  product;
                  quantity = item.quantity;
                };
              };
            };
          }
        );
        ?{
          order with
          items;
        };
      };
    };
  };

  public query ({ caller }) func getOrdersByUser(user : Principal) : async [Order] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(o) { o.buyer == user });
  };

  public query ({ caller }) func getMyOrders() : async [OrderView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(o) { o.buyer == caller }).map(getOrderView);
  };

  public query ({ caller }) func getAllOrders() : async [OrderView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().map(getOrderView);
  };

  func getOrderView(order : Order) : OrderView {
    let items = order.items.map(
      func(item) {
        switch (products.get(item.productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?product) {
            {
              product;
              quantity = item.quantity;
            };
          };
        };
      }
    );
    {
      order with
      items;
    };
  };

  // Seed Data
  public shared ({ caller }) func seedProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };
    if (products.size() > 0) { Runtime.trap("Products already seeded") };

    let seedData : [ProductInput] = [
      {
        name = "Banarasi Silk Saree";
        description = "Elegant Banarasi silk saree with intricate zari work.";
        price = 3500;
        category = #silk;
        imageUrl = "https://example.com/banarasi_silk.jpg";
        stock = 20;
        featured = true;
      },
      {
        name = "Kanjivaram Silk Saree";
        description = "Traditional Kanjivaram silk saree in vibrant colors.";
        price = 5000;
        category = #silk;
        imageUrl = "https://example.com/kanjivaram_silk.jpg";
        stock = 15;
        featured = false;
      },
      {
        name = "Cotton Handloom Saree";
        description = "Lightweight cotton handloom saree perfect for summers.";
        price = 1200;
        category = #cotton;
        imageUrl = "https://example.com/cotton_handloom.jpg";
        stock = 30;
        featured = true;
      },
      {
        name = "Chanderi Silk Saree";
        description = "Chanderi silk saree with beautiful floral motifs.";
        price = 2500;
        category = #silk;
        imageUrl = "https://example.com/chanderi_silk.jpg";
        stock = 18;
        featured = false;
      },
      {
        name = "Designer Party Wear Saree";
        description = "Trendy designer saree with sequin work for parties.";
        price = 4000;
        category = #designer;
        imageUrl = "https://example.com/designer_party_wear.jpg";
        stock = 10;
        featured = true;
      },
      {
        name = "Bridal Wedding Saree";
        description = "Grand bridal saree with heavy embroidery and stone work.";
        price = 8000;
        category = #bridal;
        imageUrl = "https://example.com/bridal_wedding.jpg";
        stock = 5;
        featured = false;
      },
      {
        name = "Best Seller Silk Saree";
        description = "Our top selling silk saree with modern design.";
        price = 2800;
        category = #bestSellers;
        imageUrl = "https://example.com/best_seller_silk.jpg";
        stock = 25;
        featured = true;
      },
      {
        name = "Casual Cotton Saree";
        description = "Comfortable cotton saree for daily wear in pastel shades.";
        price = 900;
        category = #cotton;
        imageUrl = "https://example.com/casual_cotton.jpg";
        stock = 35;
        featured = false;
      },
    ];

    for (product in seedData.values()) {
      let id = getNextProductId();
      let newProduct : Product = {
        product with
        id;
      };
      products.add(id, newProduct);
    };
  };
};
