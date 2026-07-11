import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getShopId } from '../lib/shop'
import { api } from '../lib/api'
import fallbackCatalogue from '../config/catalogue'
import CatalogueCard from './CatalogueCard'
import { CatalogueModal } from './CatalogueModal'
import SearchBar from './SearchBar'

function normalizeItem(item) {
  let variants = item.variants
  if (typeof variants === 'string') {
    try { variants = JSON.parse(variants) } catch { variants = null }
  }
  return {
    ...item,
    variants,
    priceLabel: item.priceLabel || item.price_label || null,
  }
}

function Catalogue() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    async function fetchCatalogue() {
      const shopId = await getShopId()
      if (!shopId) {
        setItems(fallbackCatalogue.map(normalizeItem))
        setLoading(false)
        return
      }
      const data = await api(`/api/catalogue?shop_id=${shopId}&available=true`)

      if (!data || !data.length) {
        setItems(fallbackCatalogue.map(normalizeItem))
      } else {
        setItems(data.map(normalizeItem))
      }
      setLoading(false)
    }
    fetchCatalogue()
  }, [])

  const categories = ['All', ...new Set(items.map(i => i.category))]

  const filteredItems = items.filter(i => {
    const matchesCategory = activeCategory === 'All' || i.category === activeCategory
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="catalogue" className="py-20 bg-white">
      <div className="max-w-6xl px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium tracking-widest uppercase text-accent">
            Our Collection
          </p>
          <h2 className="text-4xl font-bold text-primary">Latest Catalogue</h2>
          <p className="max-w-xl mx-auto mt-3 text-gray-500">
            Browse our full catalogue and order directly on WhatsApp
          </p>
        </motion.div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden bg-white border border-gray-100 rounded-xl">
                <div className="bg-gray-200 h-44 animate-pulse" />
                <div className="p-3">
                  <div className="h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                  <div className="w-2/3 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <p className="mb-6 text-sm text-center text-gray-400">
              {searchQuery
                ? `${filteredItems.length} results for "${searchQuery}"`
                : `Showing ${filteredItems.length} items`}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <CatalogueCard item={item} onClick={setSelectedItem} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredItems.length === 0 && (
              <div className="py-20 text-center">
                <p className="mb-4 text-4xl">🔍</p>
                <p className="mb-2 text-lg font-medium text-primary">
                  No items found
                </p>
                <p className="mb-6 text-sm text-gray-400">
                  Try a different search or category
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="px-6 py-2 text-sm font-medium text-white transition-colors rounded-full bg-primary hover:bg-accent"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CatalogueModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  )
}

export default Catalogue
