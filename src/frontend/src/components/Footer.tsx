import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Category } from "../backend.d";
import { useNav } from "../context/NavContext";

export default function Footer() {
  const { navigate } = useNav();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer style={{ backgroundColor: "#2E2E2E" }} className="text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-white text-2xl tracking-widest uppercase mb-3">
              Vani Sarees
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Celebrating the timeless tradition of Indian handloom — curated
              sarees for every occasion, brought to you with love.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Instagram"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Facebook"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Twitter"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-sans font-semibold text-sm mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Silk Sarees", cat: Category.silk },
                { label: "Cotton Sarees", cat: Category.cotton },
                { label: "Designer Sarees", cat: Category.designer },
                { label: "Bridal Collection", cat: Category.bridal },
                { label: "Best Sellers", cat: Category.bestSellers },
              ].map(({ label, cat }) => (
                <li key={label}>
                  <button
                    type="button"
                    data-ocid="nav.link"
                    className="hover:text-white transition-colors"
                    onClick={() =>
                      navigate({ type: "category", category: cat })
                    }
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-sans font-semibold text-sm mb-4 uppercase tracking-wider">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Returns &amp; Exchanges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Care Instructions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-sans font-semibold text-sm mb-4 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Get exclusive offers and new arrivals in your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                data-ocid="footer.newsletter.input"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm"
              />
              <Button
                data-ocid="footer.newsletter.submit_button"
                size="sm"
                style={{ backgroundColor: "#C7A24D", color: "#2A1F10" }}
                className="font-sans font-semibold shrink-0"
              >
                Subscribe
              </Button>
            </div>
            <div className="mt-6 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" /> +91 96666 43123
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" /> bsvani1983@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Tirupati, Andhra Pradesh
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {year} Vani Sarees. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
