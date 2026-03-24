import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'
import SearchBar from './SearchBar'

function ProductGallery() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Convert sizes and colors from string to array
      const formatted = data.map(p => ({
        ...p,
        sizes: p.sizes ? p.sizes.split(',') : [],
        colors: p.colors ? p.colors.split(',') : []
      }))

      setProducts(formatted)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))]

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="catalogue" className="py-20 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto">

        {/* Section Header */}
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
          <h2 className="text-4xl font-bold text-primary">
            Latest Catalogue
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-gray-500">
            Browse our latest collection and order directly on WhatsApp
          </p>
        </motion.div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
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

        {/* Products Grid */}
        {!loading && (
          <>
            <p className="mb-6 text-sm text-center text-gray-400">
              {searchQuery
                ? `${filteredProducts.length} results for "${searchQuery}"`
                : `Showing ${filteredProducts.length} items`
              }
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="mb-4 text-4xl">🔍</p>
                <p className="mb-2 text-lg font-medium text-primary">
                  No products found
                </p>
                <p className="mb-6 text-sm text-gray-400">
                  Try a different search or category
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All')
                  }}
                  className="px-6 py-2 text-sm font-medium text-white transition-colors rounded-full bg-primary hover:bg-accent"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  )
}

export default ProductGallery