import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FiLogOut, FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)

  // Empty form state
  const emptyForm = {
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    available: true,
    badge: '',
    sizes: '',
    colors: ''
  }

  const [form, setForm] = useState(emptyForm)

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Toggle available/unavailable
  async function toggleAvailable(product) {
    const { error } = await supabase
      .from('products')
      .update({ available: !product.available })
      .eq('id', product.id)

    if (!error) {
      setProducts(products.map(p =>
        p.id === product.id
          ? { ...p, available: !p.available }
          : p
      ))
    }
  }

  // Delete product
  async function deleteProduct(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (!error) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  // Save product (add or edit)
async function saveProduct() {
  setSaving(true);

  let imageUrl = form.image;

  try {
    // 🔥 Upload image ONLY if a new one is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=YOUR_API_KEY",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      imageUrl = data.data.url;
    }

    const productData = {
      ...form,
      image: imageUrl,
      price: parseInt(form.price),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (!error) {
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData } : p,
          ),
        );
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (!error) setProducts([data[0], ...products]);
    }
  } catch (err) {
    console.error(err);
    alert("Image upload failed");
  }

  setSaving(false);
  setShowAddForm(false);
  setEditingProduct(null);
  setForm(emptyForm);
  setImageFile(null);
}

  // Start editing
  function startEdit(product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description || '',
      available: product.available,
      badge: product.badge || '',
      sizes: product.sizes || '',
      colors: product.colors || ''
    })
    setShowAddForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  // Stats
  const total = products.length
  const available = products.filter(p => p.available).length
  const soldOut = products.filter(p => !p.available).length
  const categories = [...new Set(products.map(p => p.category))].length

  // Search filter
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
          <div>
            <h1 className="text-xl font-bold text-primary">
              Admin <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-xs text-gray-400">Manage your catalogue</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              View Site →
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-red-500"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          {[
            { label: "Total Products", value: total, color: "text-primary" },
            { label: "Available", value: available, color: "text-green-500" },
            { label: "Sold Out", value: soldOut, color: "text-red-500" },
            { label: "Categories", value: categories, color: "text-accent" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 bg-white border border-gray-100 rounded-xl"
            >
              <p className="mb-1 text-xs text-gray-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="p-6 mb-8 bg-white border border-gray-100 rounded-xl">
            <h2 className="mb-6 text-lg font-semibold text-primary">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-xs text-gray-500">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Floral Summer Dress"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-500">
                  Price (Ksh) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="2500"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-500">
                  Category *
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Dresses"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-500">
                  Badge
                </label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                >
                  <option value="">No Badge</option>
                  <option value="New">New</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="On Sale">On Sale</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-xs text-gray-500">
                  Product Image *
                </label>

                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />

                {/* Preview */}
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="object-cover w-20 h-20 mt-2 rounded"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-xs text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Beautiful floral dress perfect for summer"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-500">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  placeholder="S,M,L,XL"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-500">
                  Colors (comma separated)
                </label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  placeholder="Pink,White,Yellow"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) =>
                    setForm({ ...form, available: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="available" className="text-sm text-gray-600">
                  Available for purchase
                </label>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveProduct}
                disabled={
                  saving ||
                  !form.name ||
                  !form.price ||
                  !form.category ||
                  !form.image
                }
                className="px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-accent disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  setForm(emptyForm);
                }}
                className="px-6 py-2 text-sm font-medium text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-gray-100 rounded-xl">
          {/* Table Header */}
          <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-xs">
              <FiSearch
                size={16}
                className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2 pr-3 text-sm border border-gray-200 rounded-lg outline-none pl-9 focus:border-accent"
              />
            </div>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingProduct(null);
                setForm(emptyForm);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-accent"
            >
              <FiPlus size={16} />
              Add Product
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-8 text-center text-gray-400">
              Loading products...
            </div>
          )}

          {/* Products List */}
          {!loading &&
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 transition-colors border-b border-gray-50 hover:bg-gray-50"
              >
                {/* Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="flex-shrink-0 object-cover w-12 h-12 rounded-lg"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-primary">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.category} • Ksh {product.price.toLocaleString()}
                    {product.badge && ` • ${product.badge}`}
                  </p>
                </div>

                {/* Available Toggle */}
                <button
                  onClick={() => toggleAvailable(product)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0
                  ${
                    product.available
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {product.available ? "✅ Available" : "❌ Sold Out"}
                </button>

                {/* Actions */}
                <div className="flex items-center flex-shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="p-2 text-gray-400 transition-colors hover:text-primary"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-gray-400 transition-colors hover:text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

          {/* Empty */}
          {!loading && filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard