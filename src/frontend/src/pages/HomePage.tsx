import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  ChevronRight,
  Headphones,
  RefreshCw,
  Truck,
} from "lucide-react";
import { Category } from "../backend.d";
import ProductCard from "../components/ProductCard";
import { useNav } from "../context/NavContext";
import { useAllProducts, useFeaturedProducts } from "../hooks/useQueries";
import {
  getCategoryGradient,
  getCategoryLabel,
} from "../utils/categoryGradient";
import { formatPrice } from "../utils/format";

const CATEGORIES = [
  { cat: Category.silk, desc: "Luxurious Banarasi & Kanjivaram" },
  { cat: Category.cotton, desc: "Breezy everyday elegance" },
  { cat: Category.designer, desc: "Contemporary couture" },
  { cat: Category.bridal, desc: "Bridal splendour & lehengas" },
];

const SAMPLE_PRODUCTS = [
  { name: "Kanjivaram Silk Saree", price: 1250000n, category: Category.silk },
  { name: "Banarasi Brocade", price: 980000n, category: Category.silk },
  { name: "Handloom Cotton", price: 320000n, category: Category.cotton },
  { name: "Designer Georgette", price: 750000n, category: Category.designer },
];

export default function HomePage() {
  const { navigate } = useNav();
  const { data: allProducts, isLoading } = useAllProducts();
  const { data: featuredProducts } = useFeaturedProducts();

  const displayNewArrivals = allProducts?.slice(0, 8) ?? [];
  const displayFavorites = featuredProducts ?? allProducts?.slice(0, 6) ?? [];

  return (
    <main>
      {/* Hero */}
      <section
        data-ocid="hero.section"
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #8A0F3A 0%, #5E0A28 60%, #3A0618 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, rgba(199,162,77,0.6) 0%, transparent 60%), repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 flex items-center">
          <div className="max-w-xl">
            <p className="font-sans text-yellow-300/80 text-sm tracking-widest uppercase mb-4">
              New Collection 2026
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
              Discover
              <br />
              <em className="not-italic text-yellow-300">Timeless</em>
              <br />
              Elegance
            </h1>
            <p className="text-white/70 font-sans text-base leading-relaxed mb-8 max-w-sm">
              Handcrafted sarees from the finest weavers of Varanasi,
              Kanchipuram, and beyond — each piece a living heritage.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                data-ocid="hero.shop_now.primary_button"
                onClick={() =>
                  navigate({ type: "category", category: Category.silk })
                }
                className="font-sans font-semibold px-8 py-3 h-auto"
                style={{ backgroundColor: "#C7A24D", color: "#2A1F10" }}
              >
                Shop The Collection <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                data-ocid="hero.explore.secondary_button"
                variant="outline"
                onClick={() =>
                  navigate({ type: "category", category: Category.bridal })
                }
                className="font-sans font-semibold px-8 py-3 h-auto border-white/40 text-white hover:bg-white/10"
              >
                Bridal Collection
              </Button>
            </div>
          </div>
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 hidden lg:block"
          style={{
            background:
              "linear-gradient(135deg, transparent, rgba(199,162,77,0.3))",
          }}
        />
      </section>

      {/* Trust badges */}
      <section className="bg-maroon text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: "Free Shipping above ₹2,999" },
              { icon: RefreshCw, text: "Easy 7-day Returns" },
              { icon: Award, text: "100% Authentic Handloom" },
              { icon: Headphones, text: "24/7 Customer Support" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm font-sans"
              >
                <Icon className="w-5 h-5 text-yellow-300 shrink-0" />
                <span className="text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page content on cream */}
      <div className="bg-cream">
        {/* Shop by Category */}
        <section
          data-ocid="categories.section"
          className="max-w-6xl mx-auto px-4 py-16"
        >
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Shop by Category
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map(({ cat, desc }, i) => (
              <button
                key={cat}
                type="button"
                data-ocid={`category.card.${i + 1}`}
                onClick={() => navigate({ type: "category", category: cat })}
                className="group relative rounded-xl overflow-hidden shadow-card hover:shadow-lifted transition-all duration-300 aspect-[3/4]"
              >
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: getCategoryGradient(cat) }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="font-serif text-white text-lg font-bold">
                    {getCategoryLabel(cat)}
                  </h3>
                  <p className="text-white/75 text-xs font-sans mt-0.5">
                    {desc}
                  </p>
                  <span className="text-yellow-300 text-xs font-sans mt-1 flex items-center gap-1">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section
          data-ocid="new_arrivals.section"
          className="max-w-6xl mx-auto px-4 pb-16"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                New Arrivals
              </h2>
              <div className="w-16 h-1 bg-gold mt-2" />
            </div>
            <Button
              data-ocid="new_arrivals.view_all.button"
              variant="outline"
              size="sm"
              className="font-sans border-maroon text-maroon hover:bg-maroon hover:text-white"
              onClick={() =>
                navigate({ type: "category", category: Category.silk })
              }
            >
              View All
            </Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} data-ocid="new_arrivals.loading_state">
                  <Skeleton className="h-64 rounded-lg" />
                  <Skeleton className="h-4 mt-3 rounded" />
                  <Skeleton className="h-4 mt-2 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : displayNewArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {displayNewArrivals.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i + 1}
                />
              ))}
            </div>
          ) : (
            <div
              data-ocid="new_arrivals.empty_state"
              className="text-center py-12"
            >
              <p className="text-muted-foreground font-sans">
                No products yet. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* Customer Favorites */}
        <section data-ocid="favorites.section" className="pb-16">
          <div
            style={{
              background:
                "linear-gradient(180deg, oklch(0.94 0.025 82) 0%, oklch(0.89 0.03 80) 100%)",
            }}
          >
            <div className="max-w-6xl mx-auto px-4 py-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Customer Favorites
              </h2>
              <p className="font-sans text-muted-foreground text-sm mb-8">
                Loved by thousands of saree enthusiasts across India
              </p>
              {displayFavorites.length > 0 ? (
                <div className="flex gap-5 overflow-x-auto pb-4">
                  {displayFavorites.map((product, i) => (
                    <div key={product.id.toString()} className="shrink-0 w-52">
                      <ProductCard product={product} index={i + 1} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-5 overflow-x-auto pb-4">
                  {SAMPLE_PRODUCTS.map((p, i) => (
                    <button
                      key={p.name}
                      type="button"
                      data-ocid={`favorites.item.${i + 1}`}
                      className="shrink-0 w-52 bg-card rounded-lg overflow-hidden shadow-card cursor-pointer hover:shadow-lifted transition-all text-left"
                      onClick={() =>
                        navigate({ type: "category", category: p.category })
                      }
                    >
                      <div
                        className="h-36"
                        style={{ background: getCategoryGradient(p.category) }}
                      />
                      <div className="p-3">
                        <p className="font-serif text-sm font-semibold line-clamp-1">
                          {p.name}
                        </p>
                        <p className="font-serif text-base font-bold text-maroon mt-1">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          data-ocid="about.section"
          className="max-w-6xl mx-auto px-4 pb-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-gold font-semibold text-sm tracking-widest uppercase mb-3">
                Our Story
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-5">
                About Vani Sarees
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                Founded in the heart of Varanasi, Vani Sarees has been dedicated
                to preserving the magnificent art of Indian handloom weaving for
                over three decades. Every saree in our collection is hand-woven
                by master weavers who have inherited this craft through
                generations.
              </p>
              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                We partner directly with artisan communities across India — from
                Kanchipuram in the south to Chanderi in the north — ensuring
                authentic craftsmanship, fair wages, and a sustainable future
                for traditional weaving.
              </p>
              <Button
                data-ocid="about.learn_more.button"
                style={{ backgroundColor: "#8A0F3A", color: "white" }}
                className="font-sans font-semibold"
              >
                Our Heritage
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl h-48 col-span-2 md:col-span-1"
                style={{
                  background:
                    "linear-gradient(135deg, #9f1239 0%, #7c3aed 100%)",
                }}
              />
              <div
                className="rounded-xl h-48"
                style={{
                  background:
                    "linear-gradient(135deg, #d97706 0%, #c026d3 100%)",
                }}
              />
              <div
                className="rounded-xl h-48"
                style={{
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%)",
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
