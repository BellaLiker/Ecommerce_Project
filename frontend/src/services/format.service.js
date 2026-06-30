export const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export const truncate = (str, n = 80) =>
  str?.length > n ? `${str.slice(0, n)}...` : str;

export const slugToTitle = (slug) =>
  slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
