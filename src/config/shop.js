const shopConfig = {
  // ─── Shop Info ────────────────────────────────
  name: "Zuri",
  nameAccent: "Fashion",
  tagline: "Dress to Impress",
  description:
    "Discover our latest collection of beautiful clothing crafted for the modern Kenyan woman.",
  about: `We are a Nairobi based clothing boutique passionate about
    bringing you the finest fashion at affordable prices.
    From casual wear to elegant evening outfits — we have
    something for every occasion.`,
  aboutExtra: `Every piece in our collection is carefully selected to
    celebrate the modern Kenyan woman — bold, beautiful
    and unstoppable.`,
  heroTag: "New Collection 2026",
  catalogueTag: "Our Collection",
  catalogueTitle: "Latest Catalogue",
  catalogueDescription:
    "Browse our latest collection and order directly on WhatsApp",

  // ─── Contact ──────────────────────────────────
  whatsapp: "254712345678",
  email: "hello@zurifashion.co.ke",
  location: "Westlands, Nairobi, Kenya",
  hours: "Mon - Sat: 9am - 7pm",

  // ─── Social Media ─────────────────────────────
  instagram: "https://instagram.com/zurifashion",
  facebook: "https://facebook.com/zurifashion",
  tiktok: "https://tiktok.com/@zurifashion",

  // ─── Stats ────────────────────────────────────
  stats: [
    { number: "500+", label: "Happy Clients" },
    { number: "200+", label: "Products" },
    { number: "5★", label: "Rating" },
  ],

  // ─── Years in Business ────────────────────────
  yearsInBusiness: "5+",

  // ─── Colors (matches tailwind.config.js) ──────
  // To change colors update tailwind.config.js too
  primaryColor: "#1a1a2e",
  accentColor: "#e94560",

  // ─── Your Details (footer credit) ─────────────
  developerName: "Framestudio",
  developerWhatsapp: "254793302518",

  slides: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
      tag: "New Arrivals 2026",
      title: "Dress to",
      titleAccent: "Impress",
      description:
        "Discover our latest collection crafted for the modern Kenyan woman.",
      buttonText: "Shop Now",
      buttonLink: "#catalogue",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200",
      tag: "Best Sellers",
      title: "Style That",
      titleAccent: "Speaks",
      description:
        "Our most loved pieces — trusted by hundreds of Nairobi women.",
      buttonText: "View Collection",
      buttonLink: "#catalogue",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200",
      tag: "Limited Edition",
      title: "Bold &",
      titleAccent: "Beautiful",
      description:
        "Exclusive African print designs handcrafted locally. Limited stock.",
      buttonText: "Shop Limited",
      buttonLink: "#catalogue",
    },
  ],
  features: [
    { icon: "🌿", text: "Locally sourced African prints" },
    { icon: "✂️", text: "Custom sizing available" },
    { icon: "🚚", text: "Same day delivery in Nairobi" },
    { icon: "💚", text: "Supporting local artisans" },
  ],

  timeline: [
    {
      year: "2019",
      title: "How It Started",
      side: "left",
      description:
        "Started selling from home with just 10 pieces and a WhatsApp group.",
    },
    {
      year: "2021",
      title: "First Shop",
      side: "right",
      description: "Opened our first physical location in Westlands, Nairobi.",
    },
    {
      year: "2023",
      title: "Going Online",
      side: "left",
      description:
        "Launched our online catalogue — now serving customers across Kenya.",
    },
    {
      year: "2026",
      title: "Still Growing",
      side: "right",
      description:
        "500+ happy clients and counting. Thank you for your support! ",
    },
  ],
};

export default shopConfig;
