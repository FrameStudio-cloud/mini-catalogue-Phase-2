import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems, setCartOpen } = useCart()
  const { shop } = useShop()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Catalogue', href: '#catalogue' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="flex items-center justify-between max-w-6xl px-4 mx-auto">
        <a href="#home" className="flex items-center gap-1">
          {shop.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} className="h-8 w-auto object-contain" />
          ) : (
            <>
              <span
                className={`text-2xl font-bold transition-colors ${scrolled ? "text-primary" : "text-white"}`}
                style={scrolled ? {} : { color: 'white' }}
              >
                {shop.name}
              </span>
              <span className="text-2xl font-light" style={{ color: 'var(--accent)' }}>
                {shop.nameAccent}
              </span>
            </>
          )}
        </a>

        <div className="items-center hidden gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${scrolled ? 'text-gray-600' : 'text-white'}`}
              style={scrolled ? {} : { color: 'white' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${shop.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="items-center hidden gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-full md:flex"
            style={{ backgroundColor: '#25D366' }}
          >
            <FaWhatsapp size={16} />
            Order on WhatsApp
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <FiX size={24} className={scrolled ? "text-primary" : "text-white"} />
            ) : (
              <FiMenu size={24} className={scrolled ? "text-primary" : "text-white"} />
            )}
          </button>
          <button onClick={() => setCartOpen(true)} className="relative p-2" aria-label="Open cart">
            <FiShoppingBag size={22} className={scrolled ? "text-primary" : "text-white"} />
            {totalItems > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-1 -right-1" style={{ backgroundColor: 'var(--accent)' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-t border-gray-100 md:hidden"
          >
            <div className="flex flex-col max-w-6xl gap-4 px-4 py-4 mx-auto">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 font-medium text-gray-600 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`https://wa.me/${shop.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-full"
                style={{ backgroundColor: '#25D366' }}
              >
                <FaWhatsapp size={16} />
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
