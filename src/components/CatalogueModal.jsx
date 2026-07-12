import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import Badge from "./Badge";

export function CatalogueModal({ item, onClose }) {
  const { shop } = useShop();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [error, setError] = useState("");
  const { addToCart, setCartOpen } = useCart();

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setError("");
  }, [item]);

  if (!item) return null;

  const sizes = item.sizes || item.variants?.sizes;
  const colors = item.colors || item.variants?.colors;
  const needsVariants = sizes || colors;
  const variantEntries = item.variants
    ? Object.entries(item.variants).filter(([k, v]) => k !== 'sizes' && k !== 'colors' && typeof v === 'string')
    : [];

  const now = new Date();
  const isOnSale = item.sale_price != null && (!item.sale_ends_at || new Date(item.sale_ends_at) > now);
  const effectivePrice = isOnSale ? item.sale_price : item.price;
  const isBadgeExpired = item.badge_ends_at && new Date(item.badge_ends_at) < now;

  const priceDisplay = isOnSale
    ? `Ksh ${item.sale_price?.toLocaleString()}`
    : (item.priceLabel || `Ksh ${item.price?.toLocaleString()}`);

  const whatsappUrl = `https://wa.me/${shop.whatsapp}?text=Hi%2C%20I%20am%20interested%20in%20*${encodeURIComponent(item.name)}*%20(${encodeURIComponent(priceDisplay)}).%20Please%20advise.`;

  function handleAddToCart() {
    if (sizes && !selectedSize) { setError('Select a size'); return }
    if (colors && !selectedColor) { setError('Select a color'); return }
    addToCart({ ...item, price: effectivePrice }, selectedSize, selectedColor);
    setCartOpen(true);
    onClose();
  }

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/80 backdrop-blur text-xs font-semibold text-white px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    {item.type && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.type === "service"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
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
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-primary font-bold text-lg leading-snug">
                    {item.name}
                  </h2>
                  <div className="flex flex-col items-end whitespace-nowrap">
                    {isOnSale ? (
                      <>
                        <span className="text-accent font-bold text-lg">{`Ksh ${item.sale_price?.toLocaleString()}`}</span>
                        <span className="text-xs text-gray-400 line-through">{`Ksh ${item.price?.toLocaleString()}`}</span>
                      </>
                    ) : (
                      <span className="text-accent font-bold text-lg">
                        {item.priceLabel || `Ksh ${item.price?.toLocaleString()}`}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {needsVariants && (
                  <div className="mb-4 space-y-3">
                    {sizes && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-gray-500">Size:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => { setSelectedSize(size); setError('') }}
                              className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
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
                        <p className="mb-1 text-xs font-medium text-gray-500">Color:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => { setSelectedColor(color); setError('') }}
                              className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
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

                {variantEntries.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                      Attributes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variantEntries.map(([key, val]) => (
                        <span key={key} className="inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.specs && item.specs.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                      Specifications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.specs.map((spec) => (
                        <span key={spec} className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.includes && item.includes.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                      What&apos;s Included
                    </p>
                    <div className="flex flex-col gap-2">
                      {item.includes.map((inc, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </span>
                          <span className="text-sm text-gray-600">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {item.type !== "service" && (
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-accent text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Add to Cart
                    </button>
                  )}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {item.type === "service" ? "Book This Service" : "Enquire on WhatsApp"}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
