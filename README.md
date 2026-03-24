# 🛍️ Mini Catalogue Website

A beautiful, fast and reusable product catalogue website template built for small Kenyan clothing shops. Customers browse products and order directly via WhatsApp — no complex checkout needed.

---

## ✨ Features

- **WhatsApp Order Button** — Customers order directly on WhatsApp with a pre-filled message
- **Product Catalogue** — Clean grid layout with category filtering
- **Fully Responsive** — Works perfectly on mobile, tablet and desktop
- **Smooth Animations** — Powered by Framer Motion
- **Reusable Template** — Change one config file per client
- **Mobile Menu** — Animated hamburger menu for mobile
- **Scroll Effects** — Navbar changes on scroll
- **Back to Top** — Smooth scroll button
- **Fast Loading** — Built with Vite for maximum performance

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Icons | Icons |
| Vercel | Deployment |

---

## 📁 Project Structure

```
src/
├── config/
│   ├── shop.js          ← change this per client
│   └── products.js      ← change this per client
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── ProductGallery.jsx
│   ├── ProductCard.jsx
│   ├── About.jsx
│   ├── Footer.jsx
│   └── BackToTop.jsx
├── App.jsx
└── main.jsx
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/FrameStudio-cloud/mini-catalogue.git
cd mini-catalogue

```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🎨 Customizing Per Client

### Step 1: Update Shop Info

Open `src/config/shop.js` and update everything:

```javascript
const shopConfig = {
  name: "Shop Name",
  nameAccent: "Fashion",
  tagline: "Your tagline here",
  whatsapp: "254712345678",
  email: "hello@shopname.co.ke",
  location: "Nairobi, Kenya",
  // ... etc
}
```

### Step 2: Update Products

Open `src/config/products.js` and replace with client's products:

```javascript
const products = [
  {
    id: 1,
    name: "Product Name",
    price: 2500,
    category: "Category",
    image: "image-url-here",
    available: true
  },
  // ... more products
]
```

### Step 3: Update Colors

Open `tailwind.config.js` and change the brand colors:

```javascript
colors: {
  primary: "#1a1a2e",   // main dark color
  accent: "#e94560",    // highlight color
}
```

That's it — three files, new client! 🎉

---

## 📱 Pages & Sections

| Section | Description |
|---|---|
| Navbar | Fixed navigation with mobile menu |
| Hero | Full screen banner with CTA buttons |
| Catalogue | Product grid with category filter |
| About | Shop story with stats |
| Footer | Contact info + social links |

---

## 💬 WhatsApp Order Flow

```
Customer sees product
        ↓
Clicks "Order" button
        ↓
WhatsApp opens with pre-filled message:
"Hi! I'm interested in the Red Dress
(Ksh 2,500) I saw on your website.
Is it available?"
        ↓
Shop owner receives order on WhatsApp ✅
```

No payment gateway. No complex system. Just WhatsApp!

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to **vercel.com**
3. Click **"Add New Project"**
4. Select your repository
5. Click **"Deploy"**

Vercel auto-detects Vite and configures everything. ✅

### Build for Production

```bash
npm run build
```

---

## 🔁 Reusing for New Clients

```
Time to set up first time  → a few days of learning
Time per new client        → 30 minutes

Steps:
1. Duplicate project folder
2. Update src/config/shop.js
3. Update src/config/products.js
4. Update colors in tailwind.config.js
5. Deploy to Vercel
6. Add client's custom domain
Done! ✅
```

---

## 💰 Pricing Guide

| Package | What's Included | Price |
|---|---|---|
| Basic | Catalogue + WhatsApp button | Ksh 25,000 |
| Standard | Basic + Instagram feed + Search | Ksh 35,000 |
| Premium | Standard + Analytics + WhatsApp API | Ksh 45,000 |
| Maintenance | Hosting + Updates per month | Ksh 2,000 |

---

## 🔮 Roadmap

- [ ] Dark mode support
- [ ] Product search
- [ ] Instagram feed integration
- [ ] Simple cart with WhatsApp checkout
- [ ] Admin panel to manage products
- [ ] Analytics dashboard
- [ ] Multiple language support (English + Swahili)

---

## 🌍 Perfect For

- 👗 Clothing & fashion shops
- 💄 Beauty & cosmetics shops
- 👟 Shoe shops
- 🎂 Cake & bakery businesses
- 💐 Flower shops
- 🪑 Furniture shops
- 📱 Phone accessories shops

---

## 👨‍💻 Built With

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Icons](https://react-icons.github.io/react-icons)

---

## 📄 License

MIT License — feel free to use and modify for your own client projects.

---

## 🤝 Contact

Built by **Your Name**
- WhatsApp: +254 700 000 000
- Email: yourname@gmail.com
