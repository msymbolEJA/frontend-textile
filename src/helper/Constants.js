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
  LETTER_PATTERN_IS_WRONG: "LETTER PATTERN IS WRONG",
  WRONG_COLOR: "WRONG COLOR",
  STONE_FALL: "STONE FALL",
  DIFFERENT_PRODUCT: "DIFFERENT PRODUCT",
  LONG_CHAIN: "LONG CHAIN",
  SHORT_CHAIN: "SHORT CHAIN",
  DIFFERENT_FONT: "DIFFERENT FONT",
  DISCOLORATION: "DISCOLORATION",
  BREAK_OFF: "BREAK OFF",
  LOST_IN_MAIL: "LOST IN MAIL",
  SECOND: "SECOND",
};

export const repeatReasonsLinen = {
  SEWING_MISTAKE: "SEWING MISTAKE",
  CUSTOMER_SOURCED: "CUSTOMER SOURCED",
  MISSING_CUSTOMIZATION: "MISSING CUSTOMIZATION",
  MISSING_INFO: "MISSING INFO",
  WRONG_COLOR: "WRONG COLOR",
  DIFFERENT_PRODUCT: "DIFFERENT PRODUCT",
  DISCOLORATION: "DISCOLORATION",
  LOST_IN_MAIL: "LOST IN MAIL",
  SECOND: "SECOND",
};

export const repeatReasonsMenuItemsLinenia = [
  {id: "SEWING_MISTAKE", name: "SEWING MISTAKE", value: "Sewing Mistake"},
  {id: "CUSTOMER_SOURCED", name: "CUSTOMER SOURCED", value: "Customer Sourced"},
  {
    id: "MISSING_CUSTOMIZATION",
    name: "MISSING CUSTOMIZATION",
    value: "Missing Customization",
  },
  {id: "MISSING_INFO", name: "MISSING INFO", value: "Missing Info"},
  {id: "WRONG_COLOR", name: "WRONG COLOR", value: "Wrong Color"},
  {id: "DIFFERENT_PRODUCT", name: "DIFFERENT PRODUCT", value: "Different Product"},
  {id: "DISCOLORATION", name: "DISCOLORATION", value: "Discoloration"},
  {id: "LOST_IN_MAIL", name: "LOST IN MAIL", value: "Lost in Mail"},
  {id: "SECOND", name: "SECOND", value: "Second"},
];

export const STORE_BASE_URLS = {
  BELKY: "http://45.76.57.100:8080/",
  SHINY: "http://144.202.67.136:8080/",
  SILVERISTIC: "http://45.32.195.132:8080/",
  SILVERBYSWAN: "http://209.250.229.146:8080/",
  LALYN: "http://37.148.213.60:8080/",
  LILLIAN: "http://185.15.198.109:8080/",
  NEW_SHINY: "http://149.28.251.24:8080/",
  NEW_LALYN: "http://31.169.92.203:8080/",
  LINENIA: "http://155.138.255.69:8080/",
  CHLOE: "http://149.28.100.118:8080/",
};

export const STORE_SERIES = {
  BELKY: "Kalpli Serisi",
  SHINY: "Güneş Serisi",
  SILVERISTIC: "Hilal Serisi",
  SILVERBYSWAN: "Papyon Serisi",
  LALYN: "Ankara Serisi",
  LILLIAN: "Manisa Serisi",
  LINENIA: "Linen Serisi",
  CHLOE: "Anamur Serisi",
};

export const FONTS = {
  Shiny: {
    FONT1: "Hello Honey",
    FONT2: "Alex Brush", //OK
    FONT3: "Blackjack", //OK
    FONT4: "Dynalight", //OK
    FONT5: "",
    FONT6: "Originality Script", //OK
    FONT7: "",
    FONT8: "",
    FONT9: "Auteur Script", //OK
    FONT10: "",
    FONT11: "Fineday", //OK
    FONT12: "Above the Beyond Script", //OK
    FONT13: "Supa Mega Fantastic",
    FONT14: "Notera",
    FONT15: "Great Day",
    FONT16: "Old English Text",
  },
  Silveristic: {
    FONT1: "Alex Brush", //OK
    FONT2: "Brush Script MT", //OK
    FONT3: "Commercial Script MT", //OK
    FONT4: "Elaine Hanks Bold",
    FONT5: "Fabfelt Script Bold", //OK
    FONT6: "Harlow Solid", //OK
    FONT7: "Sofia", //OK
    FONT8: "Old English Text MT", //OK
    FONT9: "Harmonie Script",
    FONT10: "Love Hewits", //OK
  },
  SilverBySwan: {
    FONT1: "Marketing Script", //OK
    FONT2: "Scriptina", //OK
    FONT3: "Pasifico", //OK
  },
};

export const bestSellerColumns = [
  { id: 1, name: "Type", objKey: "type", translate: "type" },
  {
    id: 2,
    name: "Order Count",
    objKey: "order_count",
    translate: "orderCount",
  },
];

export const colorNumberColumns = [
  { id: 1, name: "Type", objKey: "color", translate: "type" },
  {
    id: 2,
    name: "Color Count",
    objKey: "color_count",
    translate: "colorCount",
  },
];
