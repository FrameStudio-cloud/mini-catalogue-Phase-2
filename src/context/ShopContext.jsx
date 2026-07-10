import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getShopId, getShopSettings } from "../lib/shop";
import shopConfig from "../config/shop";

const defaultShop = {
  loaded: false,
  name: shopConfig.name,
  nameAccent: shopConfig.nameAccent,
  tagline: shopConfig.tagline,
  description: shopConfig.description,
  about: shopConfig.about,
  aboutExtra: shopConfig.aboutExtra,
  heroTag: shopConfig.heroTag,
  catalogueTag: shopConfig.catalogueTag,
  catalogueTitle: shopConfig.catalogueTitle,
  catalogueDescription: shopConfig.catalogueDescription,
  whatsapp: shopConfig.whatsapp,
  email: shopConfig.email,
  location: shopConfig.location,
  hours: shopConfig.hours,
  instagram: shopConfig.instagram,
  facebook: shopConfig.facebook,
  tiktok: shopConfig.tiktok,
  logo_url: null,
  stats: shopConfig.stats,
  yearsInBusiness: shopConfig.yearsInBusiness,
  primaryColor: shopConfig.primaryColor,
  accentColor: shopConfig.accentColor,
  developerName: shopConfig.developerName,
  developerWhatsapp: shopConfig.developerWhatsapp,
  slides: shopConfig.slides,
  features: shopConfig.features,
  timeline: shopConfig.timeline,
};

const ShopContext = createContext({ shop: defaultShop, banners: [] });

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
}

function parseBusinessHours(hours) {
  if (!hours) return shopConfig.hours;
  if (typeof hours === "string") return hours;
  try {
    const days = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
    const parts = Object.entries(days)
      .filter(([key]) => hours[key]?.active)
      .map(([key, label]) => `${label}: ${hours[key].open} - ${hours[key].close}`);
    if (parts.length === 7) return "Mon - Sun: " + parts[0].split(": ")[1];
    return parts.join(" | ") || shopConfig.hours;
  } catch {
    return shopConfig.hours;
  }
}

function parseTheme(theme) {
  if (!theme || typeof theme !== "object") return {};
  return {
    primary: theme.primary || shopConfig.primaryColor,
    accent: theme.accent || shopConfig.accentColor,
  };
}

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(defaultShop);

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    (async () => {
      const settings = await getShopSettings();
      if (settings) {
        const hours = parseBusinessHours(settings.business_hours);
        const theme = parseTheme(settings.theme);
        setShop(prev => ({
          ...prev,
          loaded: true,
          name: settings.store_name || prev.name,
          whatsapp: settings.whatsapp || prev.whatsapp,
          email: settings.email || prev.email,
          description: settings.description || prev.description,
          location: settings.store_address || prev.location,
          instagram: settings.instagram || prev.instagram,
          facebook: settings.facebook || prev.facebook,
          tiktok: settings.tiktok || prev.tiktok,
          logo_url: settings.logo_url || null,
          hours,
          primaryColor: theme.primary || prev.primaryColor,
          accentColor: theme.accent || prev.accentColor,
        }));
      }

      const shopId = await getShopId();
      if (shopId) {
        const { data } = await supabase
          .from("banners")
          .select("*")
          .eq("shop_id", shopId)
          .eq("active", true)
          .order("sort_order");

        if (data && data.length > 0) {
          const heroSlides = data
            .filter(b => b.type === "hero")
            .map(b => ({
              id: b.id,
              image: b.image_url,
              tag: b.subtitle || "",
              title: b.title || "",
              titleAccent: "",
              description: b.message || "",
              buttonText: "Shop Now",
              buttonLink: b.link_url || "#catalogue",
            }));
          if (heroSlides.length > 0) {
            setShop(prev => ({ ...prev, slides: heroSlides }));
          }
          setBanners(data);
        }
      }

      setShop(prev => ({ ...prev, loaded: true }));
    })();
  }, []);

  return (
    <ShopContext.Provider value={{ shop, banners }}>
      {children}
    </ShopContext.Provider>
  );
}
