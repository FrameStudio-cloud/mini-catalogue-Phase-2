import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ShopProvider } from './context/ShopContext'
import { ThemeProvider } from "./components/ThemeProvider";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ShopProvider>
          <CartProvider>
          <App />
        </CartProvider>
        </ShopProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);