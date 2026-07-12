import { useState } from "react"
import { motion } from "framer-motion"
import { useCart } from '../context/CartContext'
import Badge from './Badge'

function CatalogueCard({ item, onClick }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const { addToCart, setCartOpen } = useCart()

  const sizes = item.sizes || item.variants?.sizes
  const colors = item.colors || item.variants?.colors
  const variantEntries = item.variants
    ? Object.entries(item.variants).filter(([k, v]) => k !== 'sizes' && k !== 'colors' && typeof v === 'string')
    : []

  const now = new Date()
  const isOnSale = item.sale_price != null && (!item.sale_ends_at || new Date(item.sale_ends_at) > now)
  const effectivePrice = isOnSale ? item.sale_price : item.price
  const isBadgeExpired = item.badge_ends_at && new Date(item.badge_ends_at) < now

  const priceLabel = item.priceLabel || `Ksh ${effectivePrice?.toLocaleString()}`
  const origPriceLabel = item.priceLabel
    ? item.priceLabel.replace(/[\d,]+/, item.price?.toLocaleString())
    : `Ksh ${item.price?.toLocaleString()}`

  const description = item.description
    ? item.description.split('\n')[0].length > 80
      ? item.description.split('\n')[0].slice(0, 80) + '…'
      : item.description.split('\n')[0]
    : null

  function handleAddToCart(e) {
    e.stopPropagation()
    if (sizes && !selectedSize) { setError('Select a size'); setTimeout(() => setError(''), 3000); return }
    if (colors && !selectedColor) { setError('Select a color'); setTimeout(() => setError(''), 3000); return }
    addToCart({ ...item, price: effectivePrice }, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setCartOpen(true)
  }

  const badges = []
  if (item.new_arrival) badges.push('new_arrival')
  if (item.badge && !isBadgeExpired) badges.push(item.badge)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm group hover:shadow-md hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden h-52 cursor-pointer" onClick={() => onClick(item)}>
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="bg-primary/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {isOnSale ? (
              <span className="text-red-500">{priceLabel}</span>
            ) : (
              priceLabel
            )}
          </span>
        </div>
      </div>

      <div className="p-4">
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {badges.map((b) => (
              <Badge key={b} {...(b === 'new_arrival' ? { variant: b } : { badge: b })} />
            ))}
          </div>
        )}

        <h3 className="mb-1 text-base font-semibold leading-tight text-primary line-clamp-1 cursor-pointer" onClick={() => onClick(item)}>
          {item.name}
        </h3>

        {description && (
          <p className="mb-2.5 text-xs text-gray-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {variantEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {variantEntries.map(([key, val]) => (
              <span key={key} className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {key}: {val}
              </span>
            ))}
          </div>
        )}

        {item.specs && item.specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.specs.slice(0, 3).map((spec) => (
              <span key={spec} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        )}

        {sizes && (
          <div className="mb-2">
            <p className="mb-1 text-xs text-gray-400">Size:</p>
            <div className="flex flex-wrap gap-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(size); setError('') }}
                  className={`text-xs px-2.5 py-0.5 rounded-lg border transition-colors ${
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
          <div className="mb-2">
            <p className="mb-1 text-xs text-gray-400">Color:</p>
            <div className="flex flex-wrap gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={(e) => { e.stopPropagation(); setSelectedColor(color); setError('') }}
                  className={`text-xs px-2.5 py-0.5 rounded-lg border transition-colors ${
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

        {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            {isOnSale ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-gray-400 line-through">
                  {origPriceLabel}
                </span>
                <span className="text-sm font-bold text-red-500">
                  {priceLabel}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-accent">
                {priceLabel}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.97] ${
              added
                ? "bg-green-500 text-white scale-95"
                : (!sizes || selectedSize) && (!colors || selectedColor)
                  ? "bg-primary hover:bg-accent text-white"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            aria-label={added ? "Added to cart" : "Add to cart"}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CatalogueCard
