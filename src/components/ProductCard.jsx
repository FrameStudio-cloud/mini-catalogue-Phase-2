import { useState } from 'react'
import PropTypes from 'prop-types'
import { useCart } from '../context/CartContext'
import Badge from './Badge'


function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setError(
        !selectedSize && !selectedColor ? 'Select size and color' :
        !selectedSize ? 'Select a size' : 'Select a color'
      )
      setTimeout(() => setError(''), 3000)
      return
    }

    addToCart(product, selectedSize, selectedColor)

    // Show added confirmation
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="overflow-hidden transition-shadow bg-white border border-gray-100 rounded-xl hover:shadow-md group">

      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <span className="px-3 py-1 text-xs font-medium bg-white rounded-full text-primary">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute flex items-center justify-between top-2 left-2 right-2">
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.badge && <Badge badge={product.badge} />}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="mb-2 text-sm font-medium leading-tight text-primary line-clamp-1">
          {product.name}
        </h3>

        {/* Sizes */}
        {product.available && product.sizes && (
          <div className="mb-2">
            <p className="mb-1 text-xs text-gray-400">Size:</p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors
                    ${selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.available && product.colors && (
          <div className="mb-2">
            <p className="mb-1 text-xs text-gray-400">Color:</p>
            <div className="flex flex-wrap gap-1">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors
                    ${selectedColor === color
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mb-2 text-xs text-red-500">{error}</p>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-accent">
            Ksh {product.price.toLocaleString()}
          </span>

          {product.available ? (
            <button
              onClick={handleAddToCart}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${added
                  ? 'bg-green-500 text-white scale-95'
                  : selectedSize && selectedColor
                    ? 'bg-primary hover:bg-accent text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
            >
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full text-xs cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    available: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired,
    badge: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
    colors: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number.isRequired,
  }).isRequired,
}

export default ProductCard