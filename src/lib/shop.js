import { api } from "./api";

let cachedShopId = null;
let cachedSettings = null;

export async function getShopId() {
  if (cachedShopId) return cachedShopId;

  const slug = import.meta.env.VITE_SHOP_SLUG;
  if (slug) {
    const shop = await api(`/api/shop?slug=${encodeURIComponent(slug)}`);
    if (shop?.id) {
      cachedShopId = shop.id;
      return shop.id;
    }
    return null;
  }

  return null;
}

export async function getShopSettings() {
  if (cachedSettings) return cachedSettings;

  const shopId = await getShopId();
  if (!shopId) return null;

  const data = await api(`/api/settings?shop_id=${shopId}`);
  if (data) {
    cachedSettings = data;
    return data;
  }

  return null;
}
