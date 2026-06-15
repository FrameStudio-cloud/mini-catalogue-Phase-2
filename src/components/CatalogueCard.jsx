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

  function handleAddToCart(e) {
    e.stopPropagation()
    if (sizes && !selectedSize) { setError('Select a size'); setTimeout(() => setError(''), 3000); return }
    if (colors && !selectedColor) { setError('Select a color'); setTimeout(() => setError(''), 3000); return }
    addToCart(item, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setCartOpen(true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm group hover:shadow-md hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden h-44 cursor-pointer" onClick={() => onClick(item)}>
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {item.category}
          </span>
          {item.badge && <Badge badge={item.badge} />}
        </div>
        {item.type && (
          <div className="absolute bottom-2 left-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              item.type === "service"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}>
              {item.type === "service" ? "Service" : "Product"}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="mb-1 text-sm font-medium leading-tight text-primary line-clamp-1 cursor-pointer" onClick={() => onClick(item)}>
          {item.name}
        </h3>

        {item.specs && item.specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.specs.slice(0, 3).map((spec) => (
              <span key={spec} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        )}

        {item.includes && item.includes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.includes.slice(0, 2).map((inc) => (
              <span key={inc} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {inc}
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
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
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
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
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

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-bold text-accent">
            {item.priceLabel || `Ksh ${item.price?.toLocaleString()}`}
          </span>
          {item.type !== "service" && sizes ? (
            <button
              onClick={handleAddToCart}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                added
                  ? "bg-green-500 text-white scale-95"
                  : selectedSize || !colors || selectedColor
                    ? "bg-primary hover:bg-accent text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
              aria-label={added ? "Added to cart" : "Add to cart"}
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onClick(item) }}
              className="text-xs text-gray-400 font-medium group-hover:text-accent transition-colors"
            >
              View details →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CatalogueCard
