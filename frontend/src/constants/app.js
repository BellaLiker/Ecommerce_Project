export const APP_NAME = "KOKO STORE";

export const ORDER_STATUS_COLORS = {
  pending:    "gold",
  confirmed:  "blue",
  processing: "cyan",
  shipped:    "purple",
  delivered:  "green",
  cancelled:  "red",
};

export const PAYMENT_STATUS_COLORS = {
  pending:  "gold",
  paid:     "green",
  failed:   "red",
  refunded: "orange",
};

export const SORT_OPTIONS = [
  { label: "Newest",       value: "newest" },
  { label: "Price: Low",   value: "price_asc" },
  { label: "Price: High",  value: "price_desc" },
  { label: "Top Rated",    value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export const PAGE_SIZES = [12, 24, 48];
