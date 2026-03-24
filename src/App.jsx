import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGallery from './components/ProductGallery'
import About from './components/About'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import WhatsAppFloat from './components/WhatsAppFloat'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ProtectedRoute from './admin/ProtectedRoute'
import CartDrawer from './components/CartDrawer'

function App() {
  return (
    <Routes>

      {/* Public website */}
      <Route path="/" element={
        <div className="font-sans">
          <Navbar />
          <Hero />
          <ProductGallery />
          <About />
          <Footer />
          <BackToTop />
          <WhatsAppFloat />
          <CartDrawer />
        </div>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

    </Routes>
  )
}

export default App
