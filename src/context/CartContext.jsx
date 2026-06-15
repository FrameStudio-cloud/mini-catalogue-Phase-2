import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('mini-catalogue-cart')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function saveCartToStorage(items) {
  try { localStorage.setItem('mini-catalogue-cart', JSON.stringify(items)) } catch {}
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => { saveCartToStorage(cartItems) }, [cartItems])

  function addToCart(product, selectedSize, selectedColor) {
    setCartItems(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      )
      if (existing) {
        return prev.map(item =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        ...product,
        selectedSize,
        selectedColor,
        quantity: 1,
        cartId: `${product.id}-${selectedSize}-${selectedColor}`
      }]
    })
    setCartOpen(true)
  }

  function removeFromCart(cartId) {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId))
  }

  function increaseQuantity(cartId) {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function decreaseQuantity(cartId) {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0
  )

  function buildCartWhatsAppMessage(shopWhatsapp) {
    let message = `Hi! I'd like to order the following items:\n\n`
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Size: ${item.selectedSize}\n`
      message += `   Color: ${item.selectedColor}\n`
      message += `   Qty: ${item.quantity}\n`
      message += `   Price: Ksh ${((Number(item.price) || 0) * item.quantity).toLocaleString()}\n\n`
    })
    message += `─────────────────\n`
    message += `*Total: Ksh ${totalPrice.toLocaleString()}*\n\n`
    message += `Please confirm availability. Thank you!`
    return `https://wa.me/${shopWhatsapp}?text=${encodeURIComponent(message)}`
  }

  return (
    <CartContext.Provider value={{
      cartItems, cartOpen, setCartOpen,
      addToCart, removeFromCart,
      increaseQuantity, decreaseQuantity,
      clearCart, totalItems, totalPrice,
      buildCartWhatsAppMessage
    }}>
      {children}
    </CartContext.Provider>
  )
}
