export const BASE_URL = "http://144.202.67.136:8080/";
export const BASE_URL_MAPPING = "http://144.202.67.136:8080/etsy/mapping/";

export const tagsData = [
  "pending",
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
  "shipped",
];

export const nonAdminTagsData = [
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
];

export const statusData = [
  "pending",
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
  "shipped",
];

export const USER_TYPE = {
  ADMIN: "admin",
  SHOP_MANAGER: "shop_manager",
  SHOP_PACKER: "shop_packer",
  WORKSHOP_MANAGER: "workshop_manager",
  WORKSHOP_PACKER: "workshop_packer",
};

export const sortingArrayAdmin = [
  "PENDING",
  "AWAITING",
  "IN PROGRESS",
  "READY",
  "SHIPPED",
  "CANCELLED",
  "REPEAT",
  "FOLLOW UP",
];

export const sortingArrayUser = [
  "AWAITING",
  "IN PROGRESS",
  "READY",
  "CANCELLED",
  "REPEAT",
];
