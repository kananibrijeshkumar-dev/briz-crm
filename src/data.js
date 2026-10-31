export const INITIAL_LEADS = [];

export const ADMIN_USERS = [
  {
    id: "super-admin",
    name: "Briz Patel (Super Admin)",
    loginId: "briz@brizpatel.online",
    phone: "+91 98988 60145",
    password: "Briz@Admin2026",
    role: "super_admin",
    company: "Briz AiWeb Studio"
  },
  {
    id: "jay-ambe-owner",
    name: "Jay Ambe Owner (Admin)",
    loginId: "owner@jayambefoodmachinery.com",
    phone: "+91 98988 60145",
    password: "Ambe@Owner2026",
    role: "client_admin",
    company: "Jay Shree Ambe Food Machinery"
  },
  {
    id: "mnp-owner",
    name: "MNP Holidays Owner (Admin)",
    loginId: "owner@mnpholidays.in",
    phone: "+91 98988 60145",
    password: "MNP@Owner2026",
    role: "client_admin",
    company: "MNP Holidays"
  }
];

export const SALES_REPS = [
  { id: 1, name: "Anilbhai", phone: "+91 99253 43582", password: "Anil@123", company: "Jay Shree Ambe Food Machinery", leads: 11, won: 3, revenue: "₹2,35,000", rate: "88%" },
  { id: 2, name: "Ankitbhai", phone: "+91 81606 94888", password: "Ankit@123", company: "Jay Shree Ambe Food Machinery", leads: 6, won: 1, revenue: "₹1,35,000", rate: "75%" },
  { id: 3, name: "Hemali", phone: "+91 76228 85040", password: "Hemali@123", company: "Jay Shree Ambe Food Machinery", leads: 10, won: 2, revenue: "₹2,20,000", rate: "82%" },
  { id: 4, name: "Lata", phone: "+91 72018 90809", password: "Lata@123", company: "Jay Shree Ambe Food Machinery", leads: 10, won: 1, revenue: "₹1,15,000", rate: "70%" },
  { id: 5, name: "Mansi", phone: "+91 87809 64019", password: "Mansi@123", company: "Jay Shree Ambe Food Machinery", leads: 8, won: 1, revenue: "₹95,000", rate: "78%" },
  { id: 6, name: "Mukeshbhai", phone: "+91 90545 85040", password: "Mukesh@123", company: "Jay Shree Ambe Food Machinery", leads: 14, won: 6, revenue: "₹6,48,000", rate: "96%" },
  { id: 7, name: "Priyanshi", phone: "+91 93282 63342", password: "Priyanshi@123", company: "Jay Shree Ambe Food Machinery", leads: 12, won: 3, revenue: "₹2,95,000", rate: "85%" },
  { id: 8, name: "Ritu", phone: "+91 79904 71987", password: "Ritu@123", company: "Jay Shree Ambe Food Machinery", leads: 11, won: 2, revenue: "₹1,80,000", rate: "80%" },
  { id: 9, name: "Siya", phone: "+91 97239 28746", password: "Siya@123", company: "Jay Shree Ambe Food Machinery", leads: 7, won: 1, revenue: "₹85,000", rate: "79%" },
  { id: 10, name: "MNP Tour Desk", phone: "+91 98988 60145", password: "MNP@Tour2026", company: "MNP Holidays", leads: 5, won: 1, revenue: "₹1,68,000", rate: "92%" }
];

export const CLIENT_TENANTS = [
  {
    id: "jay-ambe",
    name: "Jay Shree Ambe Food Machinery",
    industry: "Food Processing & Agricultural Machinery",
    city: "Ahmedabad, Gujarat",
    repsCount: 9,
    pipelineValue: "₹20,08,000",
    status: "Active (Enterprise Plan)",
    logo: "🏭"
  },
  {
    id: "mnp-holidays",
    name: "MNP Holidays",
    industry: "Luxury Travel, Holiday Packages & Tourism",
    city: "Ahmedabad / Surat, Gujarat",
    repsCount: 3,
    pipelineValue: "₹7,68,000",
    status: "Connected (Website & CRM Live)",
    logo: "✈️"
  },
  {
    id: "apex-eng",
    name: "Apex Industrial Grinders",
    industry: "Industrial Equipment Manufacturing",
    city: "Rajkot, Gujarat",
    repsCount: 3,
    pipelineValue: "₹6,20,000",
    status: "Demo Client",
    logo: "⚙️"
  }
];

export const MACHINE_PRESETS = [
  // Machinery Presets (Jay Ambe)
  { name: "5 HP Mini Flour Mill (Atta Chakki)", basePrice: 58000, hp: "5 HP", company: "Jay Shree Ambe Food Machinery" },
  { name: "5 HP Heavy Duty Commercial Chakki", basePrice: 62000, hp: "5 HP", company: "Jay Shree Ambe Food Machinery" },
  { name: "7.5 HP Standard Pulverizer", basePrice: 80500, hp: "7.5 HP", company: "Jay Shree Ambe Food Machinery" },
  { name: "10 HP Cyclone Pulverizer with Starter", basePrice: 122880, hp: "10 HP", company: "Jay Shree Ambe Food Machinery" },
  { name: "20 HP Heavy Commercial Masala Mill", basePrice: 186440, hp: "20 HP", company: "Jay Shree Ambe Food Machinery" },
  
  // Travel Package Presets (MNP Holidays)
  { name: "Thailand 5N/6D (Bangkok + Pattaya)", basePrice: 42000, hp: "Per Person", company: "MNP Holidays" },
  { name: "Dubai 5N/6D Luxury (Burj + Safari)", basePrice: 60000, hp: "Per Person", company: "MNP Holidays" },
  { name: "Bali 6N/7D Honeymoon Private Villa", basePrice: 65000, hp: "Per Person", company: "MNP Holidays" },
  { name: "Goa 3N/4D Luxury Beach Resort", basePrice: 15000, hp: "Per Person", company: "MNP Holidays" },
  { name: "Himachal (Shimla-Manali) 6N/7D Volvo", basePrice: 18500, hp: "Per Person", company: "MNP Holidays" }
];
