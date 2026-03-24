import { createContext, useContext, useState} from 'react'

// Create the context
const CartContext = createContext()

// Custom hook to use cart anywhere
export function useCart() {
  return useContext(CartContext)
}

// Provider wraps the whole app
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  // Add item to cart
  function addToCart(product, selectedSize, selectedColor) {
    setCartItems(prev => {
      // Check if same product + size + color already in cart
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      )

      if (existing) {
        // If exists → increase quantity
        return prev.map(item =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // If new → add to cart
      return [...prev, {
        ...product,
        selectedSize,
        selectedColor,
        quantity: 1,
        cartId: `${product.id}-${selectedSize}-${selectedColor}`
      }]
    })

    // Open cart when item added
    setCartOpen(true)
  }

  // Remove item from cart
  function removeFromCart(cartId) {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId))
  }

  // Increase quantity
  function increaseQuantity(cartId) {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Decrease quantity
  function decreaseQuantity(cartId) {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  // Clear entire cart
  function clearCart() {
    setCartItems([])
  }

  // Total items count
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )

  // Build WhatsApp message for entire cart
  function buildCartWhatsAppMessage(shopWhatsapp) {
    let message = `Hi! I'd like to order the following items:\n\n`

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Size: ${item.selectedSize}\n`
      message += `   Color: ${item.selectedColor}\n`
      message += `   Qty: ${item.quantity}\n`
      message += `   Price: Ksh ${(item.price * item.quantity).toLocaleString()}\n\n`
    })

    message += `─────────────────\n`
    message += `*Total: Ksh ${totalPrice.toLocaleString()}*\n\n`
    message += `Please confirm availability. Thank you! 🙏`

    return `https://wa.me/${shopWhatsapp}?text=${encodeURIComponent(message)}`
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      totalPrice,
      buildCartWhatsAppMessage
    }}>
      {children}
    </CartContext.Provider>
  )
}