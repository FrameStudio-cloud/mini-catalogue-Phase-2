import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getShopId, withShop } from "../lib/shop";
import { FiLogOut, FiPlus } from "react-icons/fi";

const EMPTY_FORM = {
  type: "product",
  category: "",
  name: "",
  description: "",
  image: "",
  price: "",
  price_label: "",
  badge: "",
  available: true,
  specs: "",
  includes: "",
};

function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  async function loadItems() {
    const shopId = await getShopId();
    const { data, error } = await supabase
      .from("catalogue")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });
    if (!error) setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    getShopId().then(shopId => {
      supabase.from("catalogue").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }).then(({ data, error }) => {
        if (!error) setItems(data);
        setLoading(false);
      });
    });
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditItem(null);
    setShowForm(true);
  }

  function openEdit(item) {
    setForm({
      ...item,
      specs: Array.isArray(item.specs) ? item.specs.join("\n") : "",
      includes: Array.isArray(item.includes) ? item.includes.join("\n") : "",
    });
    setEditItem(item);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.category || !form.type) {
      showToast("Name, category and type are required", "error");
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      price: parseInt(form.price) || 0,
      specs:
        form.type === "product" && form.specs
          ? form.specs.split("\n").map((s) => s.trim()).filter(Boolean)
          : null,
      includes:
        form.type === "service"
          ? form.includes.split("\n").map((s) => s.trim()).filter(Boolean)
          : null,
      badge: form.badge || null,
    };

    let error;
    if (editItem) {
      ({ error } = await supabase
        .from("catalogue")
        .update(payload)
        .eq("id", editItem.id)
        .eq("shop_id", await getShopId()));
    } else {
      ({ error } = await supabase.from("catalogue").insert([withShop(payload)]));
    }

    setSaving(false);
    if (error) { showToast("Something went wrong", "error"); return; }
    showToast(editItem ? "Item updated!" : "Item added!");
    setShowForm(false);
    loadItems();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    const { error } = await supabase.from("catalogue").delete().eq("id", id).eq("shop_id", await getShopId());
    if (error) { showToast("Delete failed", "error"); return; }
    showToast("Item deleted");
    loadItems();
  }

  async function toggleAvailable(item) {
    await supabase
      .from("catalogue")
      .update({ available: !item.available })
      .eq("id", item.id)
      .eq("shop_id", await getShopId());
    loadItems();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin");
  }

  const total = items.length;
  const productsCount = items.filter((i) => i.type === "product").length;
  const servicesCount = items.filter((i) => i.type === "service").length;
  const unavailable = items.filter((i) => !i.available).length;
  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const filtered = items.filter((i) => {
    const matchType = filterType === "All" || i.type === filterType.toLowerCase();
    const matchCat = filterCategory === "All" || i.category === filterCategory;
    return matchType && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-accent text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
          <div>
            <h1 className="text-xl font-bold text-primary">
              Admin <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-xs text-gray-400">{items.length} items in catalogue</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-gray-500 transition-colors hover:text-primary">
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
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          {[
            { label: "Total Items", value: total, color: "text-primary" },
            { label: "Products", value: productsCount, color: "text-green-500" },
            { label: "Services", value: servicesCount, color: "text-blue-500" },
            { label: "Unavailable", value: unavailable, color: "text-red-500" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="mb-1 text-xs text-gray-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {["All", "product", "service"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1))}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filterType === (t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1))
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
            </button>
          ))}
          <span className="text-gray-200">|</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filterCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl">
          <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
            <p className="text-sm text-gray-400">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-accent"
            >
              <FiPlus size={16} />
              Add Item
            </button>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filtered.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${
                  i < filtered.length - 1 ? "border-b border-gray-50" : ""
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="flex-shrink-0 object-cover w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-primary">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.category}
                      {item.type && <> • <span className={item.type === "service" ? "text-blue-500" : "text-green-500"}>{item.type}</span></>}
                      {item.badge && <> • {item.badge}</>}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-accent flex-shrink-0">
                    {item.price_label || `Ksh ${item.price?.toLocaleString()}`}
                  </span>
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                      item.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {item.available ? "Available" : "Hidden"}
                  </button>
                  <div className="flex items-center flex-shrink-0 gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="px-2 py-1 text-xs text-gray-400 transition-colors rounded-lg hover:text-primary hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 text-xs text-red-400 transition-colors rounded-lg hover:text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <p className="mb-3 text-3xl">📭</p>
                  <p className="text-sm">No items found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-primary">
                  {editItem ? "Edit Item" : "Add New Item"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-primary" aria-label="Close form">✕</button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                    >
                      <option value="product">Product</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Category *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dresses"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-xs text-gray-500">Name *</label>
                  <input
                    type="text"
                    placeholder="Product or service name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs text-gray-500">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the item..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs text-gray-500">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                  />
                  {form.image && (
                    <img src={form.image} alt="preview" className="object-cover w-full h-24 mt-2 rounded-lg" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Price (Ksh)</label>
                    <input
                      type="number"
                      placeholder="2500"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Price Label</label>
                    <input
                      type="text"
                      placeholder="From Ksh 2,500"
                      value={form.price_label}
                      onChange={(e) => setForm({ ...form, price_label: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Badge</label>
                    <select
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                    >
                      <option value="">No Badge</option>
                      <option value="New">New</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="On Sale">On Sale</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Status</label>
                    <select
                      value={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent"
                    >
                      <option value="true">Available</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                </div>

                {form.type === "product" && (
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">
                      Specs <span className="text-gray-400">(one per line)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      value={form.specs}
                      onChange={(e) => setForm({ ...form, specs: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent resize-none font-mono"
                    />
                  </div>
                )}

                {form.type === "service" && (
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">
                      What&apos;s Included <span className="text-gray-400">(one per line)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Included item 1&#10;Included item 2"
                      value={form.includes}
                      onChange={(e) => setForm({ ...form, includes: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-accent resize-none font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:text-primary rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary hover:bg-accent text-white font-medium rounded-lg text-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
