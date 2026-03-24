import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import shop from '../config/shop'

function CartDrawer() {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    buildCartWhatsAppMessage
  } = useCart()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-full max-w-md bg-white shadow-2xl"
          >

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-primary">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full bg-accent">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 transition-colors hover:text-red-500"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Empty Cart */}
            {cartItems.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                  <FiShoppingBag size={32} className="text-gray-300" />
                </div>
                <p className="font-medium text-gray-400">Your cart is empty</p>
                <p className="text-sm text-center text-gray-300">
                  Browse our catalogue and add items you love!
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-white transition-colors rounded-full bg-primary hover:bg-accent"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {/* Cart Items */}
            {cartItems.length > 0 && (
              <>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {cartItems.map(item => (
                    <motion.div
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="flex-shrink-0 object-cover w-20 h-20 rounded-lg"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate text-primary">
                          {item.name}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                            {item.selectedSize}
                          </span>
                          <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                            {item.selectedColor}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-bold text-accent">
                          Ksh {(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQuantity(item.cartId)}
                              className="flex items-center justify-center w-6 h-6 transition-colors border border-gray-200 rounded-full hover:bg-gray-100"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="w-4 text-sm font-medium text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.cartId)}
                              className="flex items-center justify-center w-6 h-6 transition-colors border border-gray-200 rounded-full hover:bg-gray-100"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-gray-300 transition-colors hover:text-red-500"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4 space-y-4 border-t border-gray-100">

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Total ({totalItems} items)
                    </span>
                    <span className="text-xl font-bold text-primary">
                      Ksh {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* WhatsApp Order Button */}
                  <a
                    href={buildCartWhatsAppMessage(shop.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCartOpen(false)}
                    className="flex items-center justify-center w-full gap-2 py-4 font-medium text-white transition-colors bg-green-500 hover:bg-green-600 rounded-xl"
                  >
                    <FaWhatsapp size={20} />
                    Order All on WhatsApp
                  </a>

                  <p className="text-xs text-center text-gray-400">
                    Youll be redirected to WhatsApp with your order details
                  </p>
                </div>
              </>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer