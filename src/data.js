export const INITIAL_LEADS = [];

export const ADMIN_USERS = [
  {
    id: "super-admin",
    name: "Briz Patel (Super Admin)",
    loginId: "briz@brizpatel.online",
    phone: "+91 87990 36132",
    password: "Briz@Admin2026",
    role: "super_admin",
    company: "Briz AiWeb Studio"
  },
  {
    id: "super-admin-gmail",
    name: "Briz Patel (Super Admin)",
    loginId: "brizpatel13@gmail.com",
    phone: "+91 87990 36132",
    password: "Briz@Admin2026",
    role: "super_admin",
    company: "Briz AiWeb Studio"
  }
];

export const SALES_REPS = [];

export const CLIENT_TENANTS = [
  {
    id: "briz-aiweb",
    name: "Briz AiWeb Studio",
    industry: "Digital Technology & SaaS Solutions",
    city: "Ahmedabad, Gujarat",
    repsCount: 1,
    pipelineValue: "₹0",
    status: "Active (Master Account)",
    logo: "⚡"
  }
];

export const DEFAULT_PRODUCT_CATALOG = [
  { name: "Standard Product / Service Package", basePrice: 25000, spec: "Standard Commercial Specification" },
  { name: "Professional Business Package", basePrice: 50000, spec: "Premium Commercial Specification" },
  { name: "Enterprise Custom Solution", basePrice: 100000, spec: "Turnkey Implementation" }
];

// Backward-compatible alias for any residual references
export const MACHINE_PRESETS = DEFAULT_PRODUCT_CATALOG;
