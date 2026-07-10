import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingBag, FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { getShopId } from "../lib/shop";
import { useCart } from "../context/CartContext";
import Badge from "../components/Badge";

function PublicProduct() {
  const { id } = useParams();
  const { addToCart, cartItems, increaseQuantity, decreaseQuantity, setCartOpen } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [shopWhatsapp, setShopWhatsapp] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const shopId = await getShopId();
      if (!shopId) { setNotFound(true); setLoading(false); return }

      const { data: settings } = await supabase
        .from("store_settings")
        .select("whatsapp")
        .eq("shop_id", shopId)
        .maybeSingle();
      if (settings?.whatsapp) setShopWhatsapp(settings.whatsapp);

      const { data } = await supabase
        .from("catalogue")
        .select("*")
        .eq("shop_id", shopId)
        .or(`id.eq.${id},product_id.eq.${id}`)
        .maybeSingle();

      if (data) {
        setItem(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <FiShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h1 className="text-xl font-bold text-primary">Product Not Found</h1>
        <p className="text-sm text-gray-400 max-w-xs">This product may have been removed or is no longer available.</p>
        <Link to="/" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
          <FiArrowLeft className="w-4 h-4" /> Back to Catalogue
        </Link>
      </div>
    );
  }

  const sizes = item.sizes || item.variants?.sizes;
  const colors = item.colors || item.variants?.colors;
  const needsVariants = sizes || colors;

  const now = new Date();
  const isOnSale = item.sale_price != null && (!item.sale_ends_at || new Date(item.sale_ends_at) > now);
  const effectivePrice = isOnSale ? item.sale_price : item.price;
  const isBadgeExpired = item.badge_ends_at && new Date(item.badge_ends_at) < now;

  const cartItem = cartItems.find(ci =>
    ci.id === item.id &&
    ci.selectedSize === selectedSize &&
    ci.selectedColor === selectedColor
  );
  const cartQuantity = cartItem?.quantity || 0;

  function handleAddToCart() {
    if (sizes && !selectedSize) { setError("Select a size"); return }
    if (colors && !selectedColor) { setError("Select a color"); return }
    addToCart({ ...item, price: effectivePrice }, selectedSize, selectedColor);
    setError("");
  }

  function handleWhatsApp() {
    const priceText = isOnSale
      ? `Ksh ${item.sale_price?.toLocaleString()} (was Ksh ${item.price?.toLocaleString()})`
      : `Ksh ${item.price?.toLocaleString()}`;
    const variantText = selectedSize || selectedColor
      ? ` (${[selectedSize, selectedColor].filter(Boolean).join(", ")})`
      : "";
    const message = `Hi! I'm interested in *${item.name}*${variantText} — ${priceText}. Please advise.`;
    const phone = shopWhatsapp || "254712345678";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-accent transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <span className="text-xs text-gray-300 truncate flex-1 text-right">{item.name}</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto px-4 py-6 pb-28"
      >
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="relative bg-gray-50 h-64 sm:h-80">
            {item.image ? (
              <>
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-contain w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiShoppingBag className="w-16 h-16 text-gray-200" />
              </div>
            )}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary/80 backdrop-blur text-xs font-semibold text-white px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
                {item.type && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.type === "service" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}>
                    {item.type === "service" ? "Service" : "Product"}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {item.new_arrival && <Badge variant="new_arrival" />}
                {item.badge && !isBadgeExpired && <Badge badge={item.badge} />}
              </div>
            </div>
          </div>

          <div className="p-5">
            <h1 className="text-xl font-bold text-primary mb-1">{item.name}</h1>

            <div className="flex items-baseline gap-2 mb-4">
              {isOnSale ? (
                <>
                  <span className="text-2xl font-bold text-accent">Ksh {item.sale_price?.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through">Ksh {item.price?.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-accent">
                  {item.priceLabel || `Ksh ${item.price?.toLocaleString()}`}
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{item.description}</p>
            )}

            {needsVariants && (
              <div className="mb-5 space-y-3">
                {sizes && (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-gray-500">Size:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => { setSelectedSize(size); setError("") }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedSize === size
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {colors && (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-gray-500">Color:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => { setSelectedColor(color); setError("") }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedColor === color
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
            )}

            {item.specs && item.specs.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Specifications</p>
                <div className="grid grid-cols-2 gap-2">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                      <FiCheck className="w-3 h-3 text-accent flex-shrink-0" />
                      <span className="text-xs text-gray-600">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.includes && item.includes.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">What&apos;s Included</p>
                <div className="flex flex-col gap-2">
                  {item.includes.map((inc, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiCheck className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-gray-600">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 pb-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            {isOnSale ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-accent">Ksh {item.sale_price?.toLocaleString()}</span>
                <span className="text-xs text-gray-400 line-through">Ksh {item.price?.toLocaleString()}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-accent">{item.priceLabel || `Ksh ${item.price?.toLocaleString()}`}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {item.type !== "service" && cartQuantity > 0 && (
              <div className="flex items-center gap-0">
                <button
                  onClick={() => decreaseQuantity(cartItem.cartId)}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-medium text-primary">{cartQuantity}</span>
                <button
                  onClick={() => {
                    if (sizes && !selectedSize) { setError("Select a size"); return }
                    if (colors && !selectedColor) { setError("Select a color"); return }
                    increaseQuantity(cartItem.cartId);
                  }}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {item.type !== "service" && (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                <FiShoppingBag className="w-4 h-4" />
                {cartQuantity > 0 ? "Add More" : "Add to Cart"}
              </button>
            )}
          </div>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span className="hidden sm:inline">Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicProduct;
