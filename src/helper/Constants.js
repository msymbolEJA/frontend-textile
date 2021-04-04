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
  "IN TRANSIT",
  "SHIPPED",
  "CANCELLED",
];

export const sortingArrayUser = [
  "PENDING",
  "AWAITING",
  "IN PROGRESS",
  "READY",
  "IN TRANSIT",
  "CANCELLED",
];

export const repeatReasons = {
  MANUFACTURING_ERROR: "MANUFACTURING ERROR",
  DISCOLORATION: "DISCOLORATION",
  BREAK_OFF: "BREAK OFF",
  LOST_IN_MAIL: "LOST IN MAIL",
  SECOND: "SECOND",
};

export const STORE_BASE_URLS = {
  BELKY: "http://45.76.57.100:8080/",
  SHINY: "http://144.202.67.136:8080/",
  SILVERISTIC: "http://45.32.195.132:8080/",
  SILVERBYSWAN: "http://209.250.229.146:8080/",
  LALYN: "http://37.148.213.60:8080/",
  NEW_SHINY: "http://149.28.251.24:8080/",
};

export const STORE_SERIES = {
  BELKY: "Kalpli Serisi",
  SHINY: "Güneş Serisi",
  SILVERISTIC: "Hilal Serisi",
  SILVERBYSWAN: "Papyon Serisi",
  LALYN: "Ankara Serisi",
};

export const FONTS = {
  Shiny: {
    FONT1: "Hello Honey",
    FONT2: "Alex Brush",
    FONT3: "Black Jack",
    FONT4: "Dynalight",
    FONT5: "",
    FONT6: "Originality Script",
    FONT7: "",
    FONT8: "",
    FONT9: "Auteur Script",
    FONT10: "",
    FONT11: "Fineday",
    FONT12: "Above the Beyond Sc.",
    FONT13: "Supa Mega Fantastic",
    FONT14: "Notera",
    FONT15: "Great Day",
    FONT16: "Old English Text",
  },
  Silveristic: {
    FONT1: "Alex Brush",
    FONT2: "Brush Script MT", //works
    FONT3: "Commercial Script MT",
    FONT4: "Elaine Hanks Bold",
    FONT5: "Fabfelt Script Bold",
    FONT6: "Harlow Solid", //works
    FONT7: "Sofia",
    FONT8: "Old English Text MT", //works
    FONT9: "Harmonie Script",
    FONT10: "Love Hewits",
  },
  SILVERBYSWAN: {
    FONT1: "Marketing Script",
    FONT2: "Scriptina",
    FONT3: "Pasifico",
  },
};
