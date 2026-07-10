import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Catalogue from './components/Catalogue'
import About from './components/About'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import WhatsAppFloat from './components/WhatsAppFloat'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ProtectedRoute from './admin/ProtectedRoute'
import CartDrawer from './components/CartDrawer'
import PublicProduct from './pages/PublicProduct'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="font-sans text-black bg-white">
            <Navbar />
            <Hero />
            <Catalogue />
            <About />
            <Footer />
            <BackToTop />
            <WhatsAppFloat />
            <CartDrawer />
          </div>
        }
      />
      <Route path="/p/:id" element={<PublicProduct />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
