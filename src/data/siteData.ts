export interface ProductItem {
  slug: "aruvi" | "semmai" | "uzhavan";
  name: string;
  category: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  tagline: string;
  image: string;
  cardBg: string;
  accentColor: string;
  badgeTextColor: string;
  packWeight: string;
  grossWeight: string;
  netWeight: string;
  ingredients: string[];
  highlights: string[];
  idealFor: string[];
  nutritionFocus: { label: string; value: string }[];
}

export const COMPANY_INFO = {
  name: "RAJ VEL FOOD PRODUCTS",
  shortName: "Raj Vel Food",
  tagline: "PURE GRAINS • HONEST FOOD • SALEM, TAMIL NADU",
  footerMotto: "PURE GRAIN | BETTER HEALTH | BRIGHTER FUTURE",
  addressLine1: "SF. No. 135/1, Near Royal Garden,",
  addressLine2: "Nadupatty Post, Kadayampatti (Tk),",
  addressLine3: "Salem (Dt) - 636 351 (T.N), India",
  fullAddress:
    "SF. No. 135/1, Near Royal Garden, Nadupatty Post, Kadayampatti (Tk), Salem (Dt) - 636 351 (T.N), India",
  phones: ["+91 96773 93659"],
  primaryPhoneRaw: "+919677393659",
  secondaryPhoneRaw: "+919677393659",
  email: "rajvelfoodproducts@gmail.com",
  fssai: "22426179000396",
  logo: "/images/logo.jpeg",
};

export const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "PRODUCTS", href: "/products" },
  { label: "SERVICES", href: "/services" },
  { label: "FACILITIES", href: "/facilities" },
  { label: "ABOUT", href: "/about" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "/contact" },
];

export const VALUE_PILLARS = [
  {
    number: "01",
    title: "QUALITY FIRST",
    description: "Selected grains, clean processing.",
  },
  {
    number: "02",
    title: "MADE WITH CARE",
    description: "Consistent texture in every batch.",
  },
  {
    number: "03",
    title: "EVERYDAY GOODNESS",
    description: "For home and commercial kitchens.",
  },
  {
    number: "04",
    title: "BUILT ON TRUST",
    description: "FSSAI certified Salem mill.",
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "SELECT",
    shortDesc: "Carefully sourced raw grains.",
    detail:
      "Bengal gram, maize, rice, and peas dal checked for natural colour, aroma, and moisture balance.",
    accentBg: "bg-[#D5EA88]",
  },
  {
    number: "02",
    title: "PREPARE",
    shortDesc: "Multi-stage grain cleaning.",
    detail:
      "Destoning, air-cleaning, and grading ensure only clean, wholesome grain enters the mill.",
    accentBg: "bg-[#E6EEDF]",
  },
  {
    number: "03",
    title: "PROCESS",
    shortDesc: "Controlled temperature milling.",
    detail:
      "Precision grinding preserves natural protein, golden colour, and uniform flour fineness.",
    accentBg: "bg-[#D5EA88]",
  },
  {
    number: "04",
    title: "PACK & SERVE",
    shortDesc: "Hygienic sealed dispatch.",
    detail:
      "Sealed in food-grade bags with batch traceability and reliable dispatch from Salem.",
    accentBg: "bg-[#E6EEDF]",
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    slug: "semmai",
    name: "Semmai",
    category: "PURE GRAM FLOUR",
    subtitle: "Pure gram flour",
    shortDescription:
      "100% pure Bengal gram flour for traditional sweets and crisp savouries.",
    fullDescription:
      "Milled from 100% selected Bengal gram for authentic aroma, smooth roasting, and reliable binding across sweet stalls, caterers, and home kitchens.",
    tagline: "Perfect for Healthy Living",
    image: "/images/semmai.webp",
    cardBg: "#BEEBF0",
    accentColor: "#0E7490",
    badgeTextColor: "#164E63",
    packWeight: "30 kg Pack",
    grossWeight: "30.00 Kg",
    netWeight: "29.90 Kg",
    ingredients: ["100% Pure Bengal Gram"],
    highlights: [
      "100% Pure Gram Flour",
      "Rich in Protein & High Energy",
      "Great Taste & Texture",
      "Home & Commercial Use",
    ],
    idealFor: [
      "Motichoor & Besan Laddu",
      "Traditional Mysore Pak",
      "Crisp Onion Pakoda & Bajji",
      "Boondi, Sev & Festive Sweets",
    ],
    nutritionFocus: [
      { label: "Purity", value: "100% Bengal Gram" },
      { label: "Packing", value: "Food-Grade Bag" },
      { label: "Energy", value: "High Protein" },
      { label: "Use", value: "Sweets & Snacks" },
    ],
  },
  {
    slug: "uzhavan",
    name: "Uzhavan",
    category: "MULTI-GRAIN FLOUR",
    subtitle: "Gram flour with multi grains",
    shortDescription:
      "A balanced grain blend for high-yield flour mixes and crispy snacks.",
    fullDescription:
      "Crafted from Bengal gram, maize, rice, and peas dal for rich protein, even coating, and consistent quality in commercial and home kitchens.",
    tagline: "Healthy Food for a Better Life",
    image: "/images/uzhavan.webp",
    cardBg: "#D3EDC5",
    accentColor: "#1E5635",
    badgeTextColor: "#124328",
    packWeight: "30 kg Pack",
    grossWeight: "30.00 Kg",
    netWeight: "29.90 Kg",
    ingredients: ["Bengal Gram", "Maize", "Rice", "Peas Dal"],
    highlights: [
      "100% Natural Ingredients",
      "Rich in Protein & Fibre",
      "No Added Preservatives",
      "Hygienically Packed",
    ],
    idealFor: [
      "Kara Boondi & Ribbon Pakoda",
      "Chilli Bajji & Fritters",
      "Catering & Hotel Kitchens",
      "Daily Savoury Batters",
    ],
    nutritionFocus: [
      { label: "Blend", value: "4-Grain Mix" },
      { label: "Packing", value: "Food-Grade Bag" },
      { label: "Quality", value: "Hygienically Packed" },
      { label: "Yield", value: "Consistent" },
    ],
  },
  {
    slug: "aruvi",
    name: "Aruvi",
    category: "MULTI-GRAIN FLOUR",
    subtitle: "Gram flour with multi grains",
    shortDescription:
      "Crisp multi-grain blend formulated for namkeen, murukku, and daily snacks.",
    fullDescription:
      "Combines selected Bengal gram with maize, rice, and peas dal for light crunch, low oil absorption, and golden finish in savoury snacks.",
    tagline: "Quality Food for a Healthier Life",
    image: "/images/aruvi.webp",
    cardBg: "#FCE3A4",
    accentColor: "#B45309",
    badgeTextColor: "#78350F",
    packWeight: "30 kg Pack",
    grossWeight: "30.00 Kg",
    netWeight: "29.90 Kg",
    ingredients: ["Bengal Gram", "Maize", "Rice", "Peas Dal"],
    highlights: [
      "100% Pure & Natural",
      "Rich in Protein",
      "Good for Health",
      "Multi-Grain Nutrition",
    ],
    idealFor: [
      "Murukku & Crispy Savouries",
      "Mixture & Kara Sev",
      "Pakoda, Bonda & Bajji",
      "Bakery & Snack Units",
    ],
    nutritionFocus: [
      { label: "Blend", value: "Multi-Grain Besan" },
      { label: "Packing", value: "Food-Grade Bag" },
      { label: "Additives", value: "Zero Added" },
      { label: "Texture", value: "Fine & Uniform" },
    ],
  },
];

export const CULINARY_DISHES = [
  {
    name: "Mysore Pak & Besan Sweets",
    product: "Semmai Pure Gram Flour",
    note: "Silky roast and rich nutty aroma",
    image: "/images/dishes/mysore-pak.jpg",
    accentBg: "#FBF3DC",
  },
  {
    name: "Hot Bajji, Bonda & Pakoda",
    product: "Uzhavan Multi-Grain Flour",
    note: "Even coating and golden crispness",
    image: "/images/dishes/bajji-bonda.jpg",
    accentBg: "#EFF5E6",
  },
  {
    name: "Crispy Murukku & Ribbon Pakoda",
    product: "Aruvi Multi-Grain Flour",
    note: "Light crunch with low oil absorption",
    image: "/images/dishes/murukku-pakoda.jpg",
    accentBg: "#F7EFE0",
  },
  {
    name: "Mixture, Boondi & Festive Laddu",
    product: "All Raj Vel Flours",
    note: "Uniform droplet shape and batch yield",
    image: "/images/dishes/mixture-laddu.jpg",
    accentBg: "#F9F1DB",
  },
];

export interface BlogArticle {
  slug: string;
  category: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "pure-gram-flour-vs-multi-grain-flour",
    category: "INGREDIENT GUIDE",
    readTime: "2 min read",
    date: "Oct 2026",
    title: "Pure Gram Flour vs. Multi-Grain Blend",
    excerpt:
      "When to choose 100% Bengal gram flour (Semmai) versus multi-grain blends (Uzhavan & Aruvi).",
    coverImage: "/images/grain-blend.jpg",
    content: [
      "Pure Bengal gram flour (Semmai) delivers rich aroma, golden colour, and smooth ghee roasting — ideal for Mysore Pak, Besan Laddu, and fine boondi.",
      "Multi-grain blends (Uzhavan and Aruvi, milled with Bengal gram, maize, rice, and peas dal) add natural lightness and lasting crunch for murukku, mixture, and bajji batters.",
      "Both lines are hygienically milled at our Kadayampatti, Salem facility for consistent batch performance.",
    ],
  },
  {
    slug: "why-milling-temperature-and-grain-cleaning-matter",
    category: "QUALITY & PROCESS",
    readTime: "2 min read",
    date: "Sep 2026",
    title: "Why Grain Cleaning & Milling Fineness Matter",
    excerpt:
      "How our 4-step Select, Prepare, Process, and Pack workflow keeps every bag uniform.",
    coverImage: "/images/grains.jpg",
    content: [
      "Uniform particle size prevents batter separation and uneven frying, while temperature-controlled grinding protects natural Bengal gram aroma.",
      "Our Salem mill follows four strict stages: grain grading, multi-stage destoning and air-cleaning, controlled milling, and moisture-safe sealing.",
      "Every bag carries batch coding and FSSAI traceability (Lic. No: 22426179000396).",
    ],
  },
  {
    slug: "storing-30kg-gram-flour-bags-for-maximum-freshness",
    category: "KITCHEN OPERATIONS",
    readTime: "2 min read",
    date: "Aug 2026",
    title: "Storing Bulk Flour Packs for Peak Freshness",
    excerpt:
      "Simple storage habits to preserve natural aroma and flour freshness.",
    coverImage: "/images/dishes/murukku-pakoda.jpg",
    content: [
      "Stack sealed bags on dry pallets away from wall moisture and direct heat, rotating stock on a First-In, First-Out (FIFO) basis.",
      "Once opened, transfer flour into airtight food-grade bins and avoid sharp hooks during handling to protect bag integrity.",
    ],
  },
];
