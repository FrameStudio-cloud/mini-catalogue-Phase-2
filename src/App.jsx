import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Catalogue from './components/Catalogue'
import About from './components/About'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import WhatsAppFloat from './components/WhatsAppFloat'
import CartDrawer from './components/CartDrawer'
import ChatWidget from './components/ChatWidget'
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
            <ChatWidget />
            <CartDrawer />
          </div>
        }
      />
      <Route path="/p/:id" element={<PublicProduct />} />
    </Routes>
  )
}

export default App
